__author__ = 'achaud9'

import read_reviews

def extract_sentiment (reviews):
    for item_id, review in reviews.iteritems():
        #print item_id, review

if __name__ == "__main__":
    reviews = read_reviews.read_reviews("reviews_train.txt")
    extract_sentiment(reviews)