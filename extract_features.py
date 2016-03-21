from sklearn.cross_validation import KFold
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_selection import chi2
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.naive_bayes import MultinomialNB
from feature_format import featureFormat, targetFeatureSplit

import json
import numpy as np
import operator

def load_data(fname):
  rec = [] 
  f = open(fname, 'rb')
  for line in f:
    r = json.loads(line.strip())
    rec.append(r)
  return rec

def read_data(fname):
  f = open(fname, 'rb')
  texts = []
  votes = []
  labels = []
  for line in f:
    rec = json.loads(line.strip())
    texts.append(rec["text"])
    votes.append([
      1 if int(rec["votes"]["useful"]) > 0 else 0,
      1 if int(rec["votes"]["funny"]) > 0 else 0,
      1 if int(rec["votes"]["cool"]) > 0 else 0])
    yvector = [0,0,0,0,0]
    rating = rec["stars"] 
    yvector[rating - 1] = 1;
    labels.append(yvector)
  f.close()
  return texts, np.matrix(votes), np.matrix(labels)

def vectorize(texts, vocab=[]):
  vectorizer = CountVectorizer(min_df=0, stop_words="english") 
  if len(vocab) > 0:
    vectorizer = CountVectorizer(min_df=0, stop_words="english", 
      vocabulary=vocab)
  features = vectorizer.fit_transform(texts)
  return vectorizer.vocabulary_,features 

def vectorize_test(texts, vocab=[]):
  vectorizer = CountVectorizer(min_df=0, stop_words="english") 
  if len(vocab) > 0:
    vectorizer = CountVectorizer(min_df=0, stop_words="english", 
      vocabulary=vocab)
  features = vectorizer.transform(texts)
  return features 

def cross_validate(ufc_val, X, y, nfeats):
  nrows = X.shape[0]
  kfold = KFold(nrows, 10)
  scores = []
  for train_index, test_index in kfold:
    #print("TRAIN:", train_index, "TEST:", test_index)
    Xtrain, Xtest, ytrain, ytest = X[train_index], X[test_index], y[train_index], y[test_index]
    clf = MultinomialNB()
    clf.fit(Xtrain, ytrain)
    ypred = clf.predict(Xtest)
    accuracy = accuracy_score(ytest, ypred)
    precision = precision_score(ytest, ypred)
    recall = recall_score(ytest, ypred)
    scores.append((accuracy, precision, recall))
  print ",".join([ufc_val, str(nfeats), 
    str(np.mean([x[0] for x in scores])),
    str(np.mean([x[1] for x in scores])),
    str(np.mean([x[2] for x in scores]))])

def sorted_features(ufc_val, V, X, y, topN):
  iv = {v:k for k, v in V.items()}
  chi2_scores = chi2(X, y)[0]
  top_features = [(x[1], iv[x[0]], x[0]) 
    for x in sorted(enumerate(chi2_scores), 
    key=operator.itemgetter(1), reverse=True)]
  print "TOP 10 FEATURES FOR RATING:", ufc_val
  for top_feature in top_features[0:10]:
    print "%7.3f  %s (%d)" % (top_feature[0], top_feature[1], top_feature[2])
  return [x[1] for x in top_features]

def main():
   ufc = {0:"1", 1:"2", 2:"3", 3:"4", 4:"5"}
   texts, votes, labels = read_data("yelp_academic_dataset_review.json")
   print ",".join(["Rating", "Nfeatures", "accuracy", "precision", "recall"])
   for ufc_idx, ufc_val in ufc.items():
   	label = labels[:, ufc_idx].A1
        V, features = vectorize(texts)
    	cross_validate(ufc_val, features, label, -1)
    	sorted_feats = sorted_features(ufc_val, V, features, label, 10)
    	for nfeats in [1000, 3000, 10000, 30000, 100000]:
      	    V, X = vectorize(texts, sorted_feats[0:nfeats])
      	    cross_validate(ufc_val, X, label, nfeats)

if __name__ == "__main__":
  main()
