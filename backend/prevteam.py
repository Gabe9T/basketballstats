from flask import Flask
from bs4 import BeautifulSoup
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import re
import hashlib

app = Flask(__name__)

cred = credentials.Certificate("../serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def scrape_player_stats(player_link):
    """
    Scrapes player stats from a given player link.
    """
    response = requests.get(player_link)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        info_section = soup.find('div', id='info')
        if info_section:
            meta_section = soup.find('div', id='meta')
            if meta_section:
                player_name = meta_section.find('h1').text.strip()
            else:
                print("Meta section not found on the page.")
                return None
            uni_holder = info_section.find('div', class_='uni_holder bbr')
            if uni_holder:
                # Find all <a> elements in uni_holder and extract data-tip and href attributes
                team_history = [{'text': a['data-tip'], 'href': a['href']} for a in uni_holder.find_all('a', href=True)]
                player_stats = {
                    'name': player_name,
                    'team_history': team_history
                }
                return player_stats
            else:
                print("Uni holder not found within info.")
                return None
        else:
            print("Info section not found on the page.")
            return None
    else:
        print(f"Failed to fetch data from {player_link}: {response.status_code}")
        return None

def extract_numbers_from_href(href):
    """
    Extract numbers from the href link.
    """

    numbers = re.findall(r'\d+', href)
    if numbers:
        return ', '.join(numbers)
    else:
        return None

def hash_player_link(player_link):
    """
    Hashes the player link to generate a document ID.
    """
    return hashlib.sha256(player_link.encode()).hexdigest()

def scrape_links_and_get_stats():
    """
    Scrapes player stats for the specified player links.
    """
    all_stats = {}

    links_ref = db.collection('links')
    player_links_docs = links_ref.stream()
    player_links = [doc.to_dict()['link'] for doc in player_links_docs]
    
    base_url = "https://www.basketball-reference.com"
    for player_link in player_links:

        full_player_link = f"{base_url}{player_link}"
        
        player_stats = scrape_player_stats(full_player_link)
        
        if player_stats:
            all_stats[full_player_link] = player_stats
        else:
            print(f"Failed to scrape player stats for {full_player_link}")

    return all_stats

def store_stats_in_firestore(stats):
    """
    Store scraped player stats in Firestore under the collection name "teams".
    """
    for player_link, player_stats in stats.items():
        # Generate a document ID by hashing the player link
        doc_id = hash_player_link(player_link)
        # Create a document reference for the team
        team_ref = db.collection('teams').document(doc_id)
        team_ref.set(player_stats)  # Set player stats as the document data

@app.route('/')
def display_scraped_stats():
    # Scrape player stats and get data
    all_stats = scrape_links_and_get_stats()
    
    # Store scraped player stats in Firestore
    store_stats_in_firestore(all_stats)
    
    return "Player stats scraped and stored in Firestore!"

if __name__ == "__main__":
    app.run(debug=True)
