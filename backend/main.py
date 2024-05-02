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
                
                players_data = []
                for row in data_rows:
                    player_info = {}
                    columns = row.find_all(['td', 'a', 'th'])
                    if columns:  
                        player_name_tag = columns[0].find('a')  # Find first <a> in column
                        if player_name_tag:  # Check for  <a>
                            player_name = player_name_tag.text  # Get the text within the <a> tag
                            player_link = player_name_tag['href']  # Get the value of the 'href'
                            
                            # info for links 
                            link_data = {
                                'name': player_name,
                                'link': player_link
                            }
                            db.collection('links').add(link_data)
                            
                            # Exclude cells 7 and 9 (dupes)
                            player_stats = [column.text for index, column in enumerate(columns[1:]) if index != 6 and index != 8]
                            
                            player_info['info'] = player_stats
                            
                            letter_players_ref = db.collection('players').document(letter).collection('players').document(player_name)
                            letter_players_ref.set(player_info)
                            
                            players_data.append(player_info)
                            
                all_stats[letter] = players_data
            else:
                all_stats[letter] = "Table not found on the webpage."
        else:
            all_stats[letter] = "Failed to fetch webpage."

    return all_stats

if __name__ == '__main__':
    app.run(debug=True)
