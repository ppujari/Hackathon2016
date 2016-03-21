import pandas as pd
import matplotlib.pyplot as plt
import pylab as pl
import sys

def main():
  assert(len(sys.argv) == 2)
  df = pd.read_csv("results.csv")
  adf = df.ix[df.Rating  < 2]
  adf_all = adf.ix[adf.Nfeatures > 0]
  adf_rest = adf.ix[adf.Nfeatures > 0]
  print adf_all
  print adf_rest
  adf_rest = adf_rest.drop("Rating", 1)
  adf_rest = adf_rest.set_index("Nfeatures")
  adf_rest["accuracy_all"] = adf_all[["accuracy"]].values[0][0]
  adf_rest["precision_all"] = adf_all[["precision"]].values[0][0]
  adf_rest["recall_all"] = adf_all[["recall"]].values[0][0]
  #adf_rest.plot(title=sys.argv[1])
  plt.plot(adf_rest[3])
  plt.show()

if __name__ == "__main__":
  main()
