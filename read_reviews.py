import json

def read_reviews(review_file):
    reviews = dict()
    with open(review_file, 'r') as infile:
        for line in infile:
            review_data = json.loads(line)
            review_text = review_data.get("description")
            item_id = review_data.get("item_id")
            reviews[item_id] = review_text
    return reviews

if __name__ == "__main__":
    reviews = read_reviews("reviews_train.txt")