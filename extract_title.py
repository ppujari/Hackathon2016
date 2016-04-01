__author__ = 'achaud9'

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
from sumy.models.dom import ObjectDocumentModel, Paragraph, Sentence
from rake import Rake
from itertools import islice


import requests
import json

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__),'...RAKE'))


import re

LANGUAGE = "english"
SENTENCES_COUNT = 1

import read_reviews

_TOKENIZER = Tokenizer("english")

def build_sentence(sentence_as_string, is_heading=False):
    return Sentence(sentence_as_string, _TOKENIZER, is_heading)

def build_document_from_string(string):
    sentences = []
    paragraphs = []

    for line in string.strip().splitlines():
        line = line.lstrip()
        if line.startswith("# "):
            sentences.append(build_sentence(line[2:], is_heading=True))
        elif not line:
            paragraphs.append(Paragraph(sentences))
            sentences = []
        else:
            sentences.append(build_sentence(line))

    paragraphs.append(Paragraph(sentences))
    return ObjectDocumentModel(paragraphs)

def prepare_data_for_sumy(reviews):
    with open("reviews_for_sumy.txt","w") as sumyfile:
        for item_id, review in reviews.iteritems():
            sumyfile.write (review + "\n\n")

def extract_titles (reviews):

    stemmer = Stemmer(LANGUAGE)
    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words(LANGUAGE)

    for item_id, review in reviews.iteritems():
        print "Review: {}".format(review)
        print "\n"
        #sentences = re.split(r' *[\.\?!][\'"\)\]]* *', review)

        for sentence in summarizer(build_document_from_string(review), SENTENCES_COUNT):
            print sentence
        print "\n"

def extract_titles_rake(reviews):

    rake = Rake("SmartStoplist.txt")
    for item_id, review in reviews:
        print "Review: {}".format(review)
        title = extract_title_rake(review, rake)
        print title
        print "\n"

def extract_title_rake(review, rake):
    keywords = rake.run(review)
    print keywords
    title = ''
    for keyword in keywords:
        if float(keyword[1]) < 0.8:
            continue
        if len(keyword[0].split()) < 2:
            continue
        title = keyword[0]
        break
    if title is '':
        return "This Product"
    return title.lstrip()

def extract_sentiment (keywords):
    keywords_with_sentiment = list()
    pos_keyword_list = list()
    neg_keyword_list = list()
    for keyword in keywords:
        data = "text=" + keyword
        response = requests.post("http://text-processing.com/api/sentiment/", data=data)
        print keyword
        json_response = json.loads(response._content)
        pos_prob = json_response.get("probability").get("pos")
        neg_prob = json_response.get("probability").get("neg")
        neut_prob = json_response.get("probability").get("neutral")
        if float(pos_prob) > 0.6:
            pos_keyword_list.append(keyword)
            continue
        if float(neg_prob) > 0.6:
            neg_keyword_list.append(keyword)
            continue

    return pos_keyword_list, neg_keyword_list

def extract_keywords_with_sentiment(review, rake):
    keywords = rake.run(review)
    meaningful_keywords = list()
    for keyword in keywords:
        if len(keyword[0].split()) >= 2:
            meaningful_keywords.append(keyword[0])

    pos_keyword_list, neg_keyword_list = extract_sentiment(meaningful_keywords)
    return pos_keyword_list, neg_keyword_list

def extract_sentiment_nltk(reviews):
    rake = Rake("SmartStoplist.txt")
    for item_id, review in reviews:
        pos_keyword_list, neg_keyword_list = extract_keywords_with_sentiment(review, rake)
        print "pos: {}".format(pos_keyword_list)
        print "neg: {}".format(neg_keyword_list)
        print "\n"

if __name__ == "__main__":
    reviews = read_reviews.read_reviews("amazon_reviews_train.txt")

    extract_titles_rake(islice(reviews.iteritems(), 10))

    extract_sentiment_nltk(islice(reviews.iteritems(), 10))