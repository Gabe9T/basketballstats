from flask import Flask, jsonify
from bs4 import BeautifulSoup
import requests
import json
import os
import time

app = Flask(__name__)

def scrape_player_info(player_link):
    """
    Scrapes player info from a given player link.
    """
    response = requests.get('https://www.basketball-reference.com' + player_link)
    player_info = {}
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # Find the table with the specified class and ID
        table = soup.find('table', {'class': 'stats_table', 'id': 'last5'})
        if table:
            tbody = table.find('tbody')
            rows = tbody.find_all('tr')
            for row in rows:
                # Extracting data from each row
                cells = row.find_all('td')
                if cells:
                    game_date = cells[0].text.strip()
                    stats = [cell.text.strip() for cell in cells[1:]]
                    player_info[game_date] = stats
    else:
        print(f"Failed to fetch data from {player_link}: {response.status_code}")
    return player_info

def scrape_basketball_stats():
    base_url = 'https://www.basketball-reference.com/players/'
    all_players = []

    for letter in 'q':  
        url = base_url + letter + '/'
        response = requests.get(url)
        time.sleep(1) 

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            table = soup.find('table')

            if table:
                data_rows = table.find_all('tr')

                for row in data_rows:
                    columns = row.find_all(['td', 'th'])
                    if columns:
                        player_name_tag = columns[0].find('a')
                        if player_name_tag:
                            player_name = player_name_tag.text
                            player_link = player_name_tag['href']
                            player_info = {'name': player_name, 'link': player_link}
                            player_stats_last5 = scrape_player_info(player_link)
                            all_players.append({'player_info': player_info, 'player_stats_last5': player_stats_last5})
        else:
            print(f"Failed to fetch webpage for letter {letter}.")

    # Path to frontend src folder
    frontend_data_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data')

    # Check for existence and create directory if it doesn't exist
    if not os.path.exists(frontend_data_dir):
        os.makedirs(frontend_data_dir)

    # Write data to JSON file
    with open(os.path.join(frontend_data_dir, 'basketball_players_stats_last5.json'), 'w', encoding='utf-8') as f:
        json.dump(all_players, f, ensure_ascii=False)

    return all_players

@app.route('/')
def index():
    all_players = scrape_basketball_stats()
    return jsonify({'all_players': all_players})

if __name__ == '__main__':
    app.run(debug=True)