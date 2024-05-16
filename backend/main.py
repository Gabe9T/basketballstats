from flask import Flask
from bs4 import BeautifulSoup
import requests

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
                        player_info = [column.text for column in columns]
                        player_name_tag = columns[0].find('a')
                        if player_name_tag:
                            player_info.append({'name': player_name_tag.text, 'link': player_name_tag['href']})
                            all_players.append(player_info)
        else:
            print(f"Failed to fetch webpage for letter {letter}.")

    return {'infomation': all_players}

if __name__ == '__main__':
    app.run(debug=True)
