import json
import os

def update_users_file():
    file_path = "data/users.json"
    new_date = {"$date": "2026-03-30T14:49:14.488Z"}

    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, list):
            for item in data:
                item["dateJoined"] = new_date
        
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"Successfully updated {file_path}")
        else:
            print(f"Skipped {file_path}: root is not a list")
            
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

if __name__ == "__main__":
    update_users_file()
