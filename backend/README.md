# Basketball Player Stats Scraper

This is a simple Flask web application that scrapes basketball player statistics from Basketball Reference and stores them in a Firestore database. 

## Usage

This backend application does not require any setup or configuration. It's designed to demonstrate how to scrape basketball player stats from the Basketball Reference website and store them in a Firestore database.

To run the application, simply execute the Python script `main.py` using a Python interpreter. The Flask server will start running locally on port 5000 by default.

## Functionality

- **Scraping**: The application scrapes basketball player statistics from the Basketball Reference website by iterating through the alphabet and fetching player data for each letter. It extracts player names and their corresponding statistics from the HTML tables on the website.
  
- **Database Storage**: The scraped player statistics are stored in a Firestore database. Each player's information is saved under a collection named after the first letter of their name, and within that collection, each player is stored as a document with their name as the document ID.

## Dependencies

- Flask: A lightweight WSGI web application framework in Python.
- Beautiful Soup: A Python library for pulling data out of HTML and XML files.
- Requests: A Python library for making HTTP requests.
- Firebase Admin SDK: A Python library for interacting with the Firebase services.

## Limitations

- **Single-threaded**: This application is single-threaded, so scraping large amounts of data may take some time.
  
- **Error Handling**: Basic error handling is implemented, but the application may fail to fetch data if there are network issues or if the structure of the Basketball Reference website changes.


## Installation

1. Clone the repository:

```bash
git clone https://github.com/Gabe9T/basketballstats.git
```
```bash
cd basketball-player-stats-scraper
```
2. Set up a virtual environment (optional but recommended):

```bash
python -m venv env
```
3. Activate the virtual environment:
On Windows:
```bash
.\env\Scripts\activate
```
On macOS and Linux:
```bash
source env/bin/activate
```
4. Install the required dependencies:
```bash
pip install -r requirements.txt
```

