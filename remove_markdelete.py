import json
import os

def remove_markdelete():
    files = ["data/reviews.json", "data/ratings.json"]

    for file_path in files:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list):
                for item in data:
                    if "markDelete" in item:
                        del item["markDelete"]
            
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                print(f"Successfully removed markDelete from {file_path}")
            else:
                print(f"Skipped {file_path}: root is not a list")
                
        except Exception as e:
            print(f"Error updating {file_path}: {e}")

if __name__ == "__main__":
    remove_markdelete()
