# Basketball Player Stats Scraper

This is a Flask web application that scrapes basketball player statistics from Basketball Reference and stores them in JSON files.

### Disclaimer 
You dont need to run any of this, stats should already be on repo. This is optional.

## Usage

This backend application is designed to demonstrate how to scrape basketball player stats from the Basketball Reference website and store them in JSON files for easy access and use.

To run the application, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/Gabe9T/basketballstats.git
    cd basketballstats/backend
    ```

2. Set up a virtual environment (optional but recommended):

    ```bash
    python -m venv env
    ```

3. Activate the virtual environment:

    - On Windows:

        ```bash
        .\env\Scripts\activate
        ```

    - On macOS and Linux:

        ```bash
        source env/bin/activate
        ```

4. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Run the application:

    ```bash
    python main.py
    ```

The Flask server will start running locally on port 5000 by default.

## Functionality

- **Scraping**: The application scrapes basketball player statistics from the Basketball Reference website by iterating through the alphabet and fetching player data for each letter. It extracts player names and their corresponding statistics from the HTML tables on the website.
  
- **Storage**: The scraped player statistics are stored in JSON files. Each player's information is saved in a structured JSON file within the project's directory.

## Dependencies

- **Flask**: A lightweight WSGI web application framework in Python.
- **Beautiful Soup**: A Python library for pulling data out of HTML and XML files.
- **Requests**: A Python library for making HTTP requests.
- **JSON**: A built-in Python library for handling JSON data.

## Limitations

- **Single-threaded**: This application is single-threaded, so scraping large amounts of data may take some time.
  
- **Error Handling**: Basic error handling is implemented, but the application may fail to fetch data if there are network issues or if the structure of the Basketball Reference website changes.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Gabe9T/basketballstats.git
    cd basketballstats/backend
    ```

2. Set up a virtual environment (optional but recommended):

    ```bash
    python -m venv env
    ```

3. Activate the virtual environment:

    - On Windows:

        ```bash
        .\env\Scripts\activate
        ```

    - On macOS and Linux:

        ```bash
        source env/bin/activate
        ```

4. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Run the application:

    ```bash
    python main.py
    ```

The Flask server will start running locally on port 5000 by default.

## To-Do

- Improve automation of scrapes to ensure data is always up-to-date.
- Enhance error handling for more robust scraping.

## Stretch Goals

- Implement multi-threading or asynchronous scraping to improve performance.
- Add functionality to handle changes in the Basketball Reference website structure automatically.

---