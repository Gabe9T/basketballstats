from flask import Flask
from bs4 import BeautifulSoup
import requests
import json
import os
import time

app = Flask(__name__)

@app.route('/')
def scrape_basketball_stats():
    time.sleep(2)
    base_url = 'https://www.basketball-reference.com/players/'
    all_players = []

    for letter in 'abcdefghijklmnopqrstuvwxyz':
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
                        player_info = {}
                        player_info['name'] = columns[0].text
                        player_info['start'] = columns[1].text
                        player_info['end'] = columns[2].text
                        player_info['position'] = columns[3].text
                        player_info['height'] = columns[4].text
                        player_info['weight'] = columns[5].text
                        player_info['birthdate'] = columns[6].text
                        player_info['college'] = columns[7].text
                        player_name_tag = columns[0].find('a')
                        if player_name_tag:
                            player_info['link'] = player_name_tag['href']
                        all_players.append(player_info)
        else:
            print(f"Failed to fetch webpage for letter {letter}.")

    # path to frontend src folder
    frontend_data_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data')

    # check for exist
    if not os.path.exists(frontend_data_dir):
        os.makedirs(frontend_data_dir)

    # write data
    with open(os.path.join(frontend_data_dir, 'basketball_players_names.json'), 'w', encoding='utf-8') as f:
        json.dump(all_players, f, ensure_ascii=False)

    return {'information': all_players}
    time.sleep(5)

if __name__ == '__main__':
    app.run(debug=True)
