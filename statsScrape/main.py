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

@app.route('/')
def scrape_basketball_stats():
    base_url = 'https://www.basketball-reference.com/players/'
    all_stats = {}

    for letter in 'abcdefghijklmnopqrstuvwxyz':
        url = base_url + letter + '/'
        response = requests.get(url)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            table = soup.find('table')
            
            if table:
                caption = table.find('caption').text
                data_rows = table.find_all('tr')
                
                stats = []
                for row in data_rows:
                    player_info = []
                    columns = row.find_all(['td', 'a'])
                    for column in columns:
                        if column.name == 'a':
                            player_info.append({'text': column.text, 'href': column['href']})
                        else:
                            player_info.append(column.text)
                    stats.append(player_info)
                
                letter_players_ref = db.collection('players').document(letter)
                players_data = [{'name': player_info[0]['text'], 'stats': player_info[1:]} for player_info in stats if player_info]  # Extract player names and stats
                letter_players_ref.set({'players': players_data})
            else:
                all_stats[letter] = "Table not found on the webpage."
        else:
            all_stats[letter] = "Failed to fetch webpage."

    return all_stats

if __name__ == '__main__':
    app.run(debug=True)
