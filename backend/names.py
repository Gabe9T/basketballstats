from flask import Flask
from bs4 import BeautifulSoup
import requests
import json
import os

app = Flask(__name__)

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

    # Ensure the 'data' directory exists
    if not os.path.exists('data'):
        os.makedirs('data')

    # Writing data to a JSON file in the 'data' directory
    with open('data/basketball_players.json', 'w') as f:
        json.dump(all_players, f)

    return {'information': all_players}

if __name__ == '__main__':
    app.run(debug=True)
