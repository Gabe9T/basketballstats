from flask import Flask
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

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
                
                all_stats[letter] = {
                    'caption': caption,
                    'stats': stats
                }
            else:
                all_stats[letter] = "Table not found on the webpage."
        else:
            all_stats[letter] = "Failed to fetch webpage."

    return all_stats

if __name__ == '__main__':
    app.run(debug=True)
