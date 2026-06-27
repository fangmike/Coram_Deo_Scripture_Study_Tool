#!/usr/bin/env python3
"""
Run this script once to generate the data files needed by the app.
Output: public/data/bible.json and public/data/crossrefs.json

Usage:
  pip install requests
  python scripts/process-data.py
"""

import csv, json, re, io, os
import urllib.request

print("Downloading WEB Bible...")
web_url = "https://raw.githubusercontent.com/scrollmapper/bible_databases/2024/csv/t_web.csv"
crossref_url = "https://raw.githubusercontent.com/shandran/openbible/main/cross_references_expanded.csv"

books_list = [
    (1,"Gen","Genesis"),(2,"Exod","Exodus"),(3,"Lev","Leviticus"),(4,"Num","Numbers"),
    (5,"Deut","Deuteronomy"),(6,"Josh","Joshua"),(7,"Judg","Judges"),(8,"Ruth","Ruth"),
    (9,"1Sam","1 Samuel"),(10,"2Sam","2 Samuel"),(11,"1Kgs","1 Kings"),(12,"2Kgs","2 Kings"),
    (13,"1Chr","1 Chronicles"),(14,"2Chr","2 Chronicles"),(15,"Ezra","Ezra"),(16,"Neh","Nehemiah"),
    (17,"Esth","Esther"),(18,"Job","Job"),(19,"Ps","Psalms"),(20,"Prov","Proverbs"),
    (21,"Eccl","Ecclesiastes"),(22,"Song","Song of Solomon"),(23,"Isa","Isaiah"),(24,"Jer","Jeremiah"),
    (25,"Lam","Lamentations"),(26,"Ezek","Ezekiel"),(27,"Dan","Daniel"),(28,"Hos","Hosea"),
    (29,"Joel","Joel"),(30,"Amos","Amos"),(31,"Obad","Obadiah"),(32,"Jonah","Jonah"),
    (33,"Mic","Micah"),(34,"Nah","Nahum"),(35,"Hab","Habakkuk"),(36,"Zeph","Zephaniah"),
    (37,"Hag","Haggai"),(38,"Zech","Zechariah"),(39,"Mal","Malachi"),
    (40,"Matt","Matthew"),(41,"Mark","Mark"),(42,"Luke","Luke"),(43,"John","John"),
    (44,"Acts","Acts"),(45,"Rom","Romans"),(46,"1Cor","1 Corinthians"),(47,"2Cor","2 Corinthians"),
    (48,"Gal","Galatians"),(49,"Eph","Ephesians"),(50,"Phil","Philippians"),(51,"Col","Colossians"),
    (52,"1Thess","1 Thessalonians"),(53,"2Thess","2 Thessalonians"),(54,"1Tim","1 Timothy"),
    (55,"2Tim","2 Timothy"),(56,"Titus","Titus"),(57,"Phlm","Philemon"),(58,"Heb","Hebrews"),
    (59,"Jas","James"),(60,"1Pet","1 Peter"),(61,"2Pet","2 Peter"),(62,"1John","1 John"),
    (63,"2John","2 John"),(64,"3John","3 John"),(65,"Jude","Jude"),(66,"Rev","Revelation"),
]

num_to_abbrev = {str(n): a for n, a, _ in books_list}
books_meta = [{"id": n, "abbrev": a, "name": name} for n, a, name in books_list]

# --- Bible JSON ---
print("Processing Bible text...")
with urllib.request.urlopen(web_url) as response:
    content = response.read().decode('utf-8')

bible = {}
reader = csv.DictReader(io.StringIO(content))
for row in reader:
    b = num_to_abbrev[row['b']]
    c = row['c']
    v = row['v']
    text = re.sub(r'\{[^}]*\}', '', row['t']).strip()
    if b not in bible:
        bible[b] = {}
    if c not in bible[b]:
        bible[b][c] = {}
    bible[b][c][v] = text

# --- Cross-refs JSON ---
print("Processing cross-references...")
with urllib.request.urlopen(crossref_url) as response:
    content = response.read().decode('utf-8')

crossrefs = {}
reader = csv.DictReader(io.StringIO(content))
for row in reader:
    from_v = row['From Verse']
    to_v = row['To Verse start']
    votes = int(row['Votes']) if row['Votes'] else 0
    if not from_v or not to_v:
        continue
    if from_v not in crossrefs:
        crossrefs[from_v] = []
    crossrefs[from_v].append((votes, to_v))

for key in crossrefs:
    crossrefs[key] = [v for _, v in sorted(crossrefs[key], reverse=True)[:20]]

# --- Write output ---
os.makedirs('public/data', exist_ok=True)

with open('public/data/bible.json', 'w') as f:
    json.dump(bible, f, separators=(',', ':'))
print(f"  bible.json: {os.path.getsize('public/data/bible.json') / 1024 / 1024:.2f} MB")

with open('public/data/crossrefs.json', 'w') as f:
    json.dump(crossrefs, f, separators=(',', ':'))
print(f"  crossrefs.json: {os.path.getsize('public/data/crossrefs.json') / 1024 / 1024:.2f} MB")

with open('public/data/books.json', 'w') as f:
    json.dump(books_meta, f, separators=(',', ':'))
print(f"  books.json: written")

print("\nDone! Files are in public/data/")
