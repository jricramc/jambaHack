import requests
from datetime import datetime

class Polygon:
    """A class to interact with the Polygon.io API."""

    def __init__(self, token):
        """
        Initialize the Polygon API client.

        Args:
            token (str): The API key for authenticating with Polygon.io.
        """
        self.base_url = "https://api.polygon.io"
        self.api_key = token
        self.headers = {
            "Authorization": f"Bearer {token}"
        }
    
    def get_last_trade(self, stock_ticker: str):
        """
        Get the last trade for a given stock.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            dict: A dictionary containing the last trade information.
        """
        endpoint = f"/v2/last/trade/{stock_ticker}"
        full_url = self.base_url + endpoint
        response = requests.get(full_url, headers=self.headers)
        return response.json()

    def get_aggregates_bars(self, stock_ticker: str, multiplier: int, timespan: str, start_timestamp_ms: int, end_timestamp_ms: int):
        """
        Get aggregated bars for a stock over a given date range.

        Args:
            stock_ticker (str): The stock symbol to query.
            multiplier (int): The size of the timespan multiplier.
            timespan (str): The size of the time window (e.g., "minute", "hour", "day", "week", "month", "quarter", "year").
            start_timestamp_ms (int): The start of the aggregate time window in milliseconds.
            end_timestamp_ms (int): The end of the aggregate time window in milliseconds.

        Returns:
            dict: A dictionary containing the aggregated bars data.
        """
        endpoint = f"/v2/aggs/ticker/{stock_ticker}/range/{multiplier}/{timespan}/{start_timestamp_ms}/{end_timestamp_ms}"
        params = {
            "adjusted": "true",
            "sort": "asc",
        }
        full_url = self.base_url + endpoint
        response = requests.get(full_url, headers=self.headers, params=params)
        return response.json()

    def get_previous_open_close(self, stock_ticker: str):
        """
        Get the open and close prices for a stock from the previous trading day.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            dict: A dictionary containing the previous day's open and close data.
        """
        endpoint = f"/v2/aggs/ticker/{stock_ticker}/prev"
        full_url = self.base_url + endpoint
        params = {
            "adjusted": "true",
        }
        response = requests.get(full_url, headers=self.headers, params=params)
        return response.json()

    def get_open_close(self, stock_ticker: str, date: datetime):
        """
        Get the open and close prices for a stock on a specific date.

        Args:
            stock_ticker (str): The stock symbol to query.
            date (datetime): The date to query for.

        Returns:
            dict: A dictionary containing the open and close data for the specified date.
        """
        date_str = date.strftime('%Y-%m-%d')
        endpoint = f"/v1/open-close/{stock_ticker}/{date_str}"
        params = {
            "adjusted": "true",
        }
        full_url = self.base_url + endpoint
        response = requests.get(full_url, headers=self.headers, params=params)
        return response.json()