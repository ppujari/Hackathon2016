__author__ = 'achaud9'

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
from sumy.models.dom import ObjectDocumentModel, Paragraph, Sentence
from rake import Rake
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
    for item_id, review in reviews.iteritems():
        print "Review: {}".format(review)
         = extract_title_rake(review, rake)
        print keyword
        print "\n"

def extract_title_rake(review, rake):
    keywords = rake.run(review)
    print keywords
    title = ''
    title_len = 0
    i = 0
    while title_len < 3 and i < len(keywords):
        title += " " + keywords[i][0]
        title_len += len(keywords[i][0].split())
        i += 1
    return title.lstrip()

if __name__ == "__main__":
    reviews = read_reviews.read_reviews("reviews_train.txt")
    #prepare_data_for_sumy(reviews)

    #parser = PlaintextParser.from_file("reviews_for_sumy.txt", Tokenizer(LANGUAGE))

    #extract_titles(reviews)
    extract_titles_rake(reviews)