from flask import Flask
from bs4 import BeautifulSoup
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

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
        meta_section = soup.find('div', id='meta')
        if info_section and meta_section:
            stats_pullout = info_section.find('div', class_='stats_pullout')
            if stats_pullout:
                player_stats = {}
                player_name = meta_section.find('h1').text.strip() 
                for div in stats_pullout.find_all('div', class_=lambda x: x and x.startswith('p')):
                    key = div['class'][0]
                    value = div.text.strip()
                    player_stats[key] = remove_letters_and_percent(value)
                player_stats['name'] = player_name  
                return player_stats
            else:
                print("Stats pullout section not found within info.")
                return None
        else:
            print("Info or meta section not found on the page.")
            return None
    else:
        print(f"Failed to fetch data from {player_link}: {response.status_code}")
        return None

def remove_letters_and_percent(text):
    """
    Removes letters and the percentage sign ("%") from the given text.
    """
    return ''.join(filter(lambda x: not x.isalpha() and x != '%', text))

def scrape_links_and_get_stats():
    """
    Scrapes player stats for the player links fetched from the "links" collection in Firestore.
    """
    all_stats = []

    links_ref = db.collection('links')
    player_links_docs = links_ref.stream()
    player_links = [f"https://www.basketball-reference.com{doc.to_dict()['link']}" for doc in player_links_docs]

    for player_link in player_links:
        # scrape player stats
        player_stats = scrape_player_stats(player_link)
        
        if player_stats:
            all_stats.append(player_stats)
        else:
            print(f"Failed to scrape player stats for {player_link}")

    return all_stats

def store_stats_in_firestore(stats):
    """
    Store scraped player stats in Firestore.
    """
    for player_stats in stats:
        db.collection('playerstats').add(player_stats)

@app.route('/')
def display_scraped_stats():
    
    all_stats = scrape_links_and_get_stats()
    store_stats_in_firestore(all_stats)
    return "Player stats scraped and stored in Firestore!"

if __name__ == "__main__":
    app.run(debug=True)
