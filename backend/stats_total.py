from flask import Flask, jsonify
from bs4 import BeautifulSoup
import requests
import json
import os

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
        table = soup.find('table', {'class': 'stats_table', 'id': 'totals'})
        if table:
            tbody = table.find('tbody')
            rows = tbody.find_all('tr')
            for row in rows:
                # Extracting data from each row
                cells = row.find_all('td')
                if row.get('id'):
                    season_id = row.get('id').split('.')[-1]  # Extracting the year from the id attribute
                    season = cells[0].text.strip()
                    stats = [cell.text.strip() for cell in cells[1:]]
                    player_info[season_id] = {'age': season, 'stats': stats}
    else:
        print(f"Failed to fetch data from {player_link}: {response.status_code}")
    return player_info

@app.route('/')
def scrape_basketball_stats():
    base_url = 'https://www.basketball-reference.com/players/'
    all_players = []

    for letter in 'abcdefghijklmnopqrstuvwxyz':
        url = base_url + letter + '/'
        response = requests.get(url)

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
                            player_stats = scrape_player_info(player_link)
                            all_players.append({'player_info': player_info, 'player_stats': player_stats})
        else:
            print(f"Failed to fetch webpage for letter {letter}.")

    # path to frontend src folder
    frontend_data_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data')

    # check for exist
    if not os.path.exists(frontend_data_dir):
        os.makedirs(frontend_data_dir)

    # write data
    with open(os.path.join(frontend_data_dir, 'basketball_players_stats_total.json'), 'w', encoding='utf-8') as f:
        json.dump(all_players, f, ensure_ascii=False)

    return jsonify({'all_players': all_players})

if __name__ == '__main__':
    app.run(debug=True)
