from __future__ import print_function
import json
import sys
ff = open("out.txt", "w")

with open('yelp_academic_dataset_review.json', 'r') as data_file:
	for line in data_file:
    		data = json.loads(line)
		ff.write(data['text'].encode('utf-8'))
		ff.write('|#')
                rating = str(data['stars'])
                if rating is None or len(rating.strip()) == 0:
			ff.write("1")
                else:
			ff.write(str(data['stars']))
		ff.write(' \n')
