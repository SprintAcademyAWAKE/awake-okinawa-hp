import os
import json
import re
from datetime import datetime

posts_dir = r"C:\Users\User\.gemini\antigravity\scratch\awake-okinawa-hp\posts"
output_json = r"C:\Users\User\.gemini\antigravity\scratch\awake-okinawa-hp\posts-index.json"

def parse_front_matter(content):
    match = re.match(r"^---\r?\n([\s\S]+?)\r?\n---", content)
    if not match:
        return {}, content
    
    yaml_content = match.group(1)
    body = content[match.end():]
    metadata = {}
    
    for line in yaml_content.splitlines():
        if ":" in line:
            parts = line.split(":", 1)
            key = parts[0].strip()
            value = parts[1].strip()
            # Remove quotes
            if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]
            metadata[key] = value
            
    return metadata, body

def generate_index():
    print("Generating blog index in Python...")
    if not os.path.exists(posts_dir):
        print(f"Directory {posts_dir} does not exist. Creating it.")
        os.makedirs(posts_dir)
        with open(output_json, "w", encoding="utf-8") as f:
            f.write("[]")
        return
        
    posts = []
    for filename in os.listdir(posts_dir):
        if filename.endswith(".md"):
            file_path = os.path.join(posts_dir, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            metadata, _ = parse_front_matter(content)
            if "title" not in metadata:
                print(f"Warning: {filename} has no title. Skipping.")
                continue
                
            post_id = os.path.splitext(filename)[0]
            posts.append({
                "id": post_id,
                "title": metadata.get("title"),
                "date": metadata.get("date", datetime.today().strftime('%Y-%m-%d')),
                "category": metadata.get("category", "未分類"),
                "description": metadata.get("description", ""),
                "thumbnail": metadata.get("thumbnail", "assets/hero-bg.png")
            })
            
    # Sort posts by date descending
    posts.sort(key=lambda x: x["date"], reverse=True)
    
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully generated index with {len(posts)} posts at {output_json}")

if __name__ == "__main__":
    generate_index()
