import json
import os

def add_bio_to_users():
    file_path = "data/users.json"

    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, list):
            for item in data:
                item["bio"] = ""
        
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"Successfully added 'bio' field to {file_path}")
        else:
            print(f"Skipped {file_path}: root is not a list")
            
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

if __name__ == "__main__":
    add_bio_to_users()
