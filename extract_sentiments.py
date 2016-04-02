__author__ = 'achaud9'

import read_reviews

def extract_sentiment (keywords):
    keywords_with_sentiment = list()
    for keyword in keywords:
        data = "text=" + keyword
        response = requests.post("http://text-processing.com/api/sentiment/", data={data})
        print keyword
        print response
        keywords_with_sentiment.append((keyword, response))
    return keywords_with_sentiment



