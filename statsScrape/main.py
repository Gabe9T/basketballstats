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
                
                for row in data_rows:
                    player_info = {}
                    columns = row.find_all(['td', 'a'])
                    if columns:  
                        player_name = columns[0].text 
                        player_info['name'] = player_name
                        player_stats = [column.text for column in columns[1:]] 
                        for index, stat in enumerate(player_stats):
                            player_info[str(index)] = stat
                        letter_players_ref = db.collection('players').document(letter).collection('players').document(player_name)  
                        letter_players_ref.set(player_info)  
            else:
                all_stats[letter] = "Table not found on the webpage."
        else:
            all_stats[letter] = "Failed to fetch webpage."

    return all_stats

if __name__ == '__main__':
    app.run(debug=True)
