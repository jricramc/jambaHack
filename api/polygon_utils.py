from datetime import datetime, time, timedelta
import pytz
from polygon_api import Polygon

def get_current_price(api: Polygon, stock_ticker: str) -> float:
    """
    Get the current price of a stock.

    Args:
        api (Polygon): An instance of the Polygon API client.
        stock_ticker (str): The stock symbol to query.

    Returns:
        float: The current price of the stock.
    """
    last_trade_data = api.get_last_trade(stock_ticker=stock_ticker)
    current_price = last_trade_data['results']['p']
    return current_price

def get_trading_volume(api: Polygon, stock_ticker: str) -> int:
    """
    Get the trading volume for a stock.

    If queried before market open, returns the previous day's trading volume.
    If queried during market hours, returns the current day's trading volume so far.

    Args:
        api (Polygon): An instance of the Polygon API client.
        stock_ticker (str): The stock symbol to query.

    Returns:
        int: The trading volume for the stock.
    """

    # Set timezone to Eastern Time (ET) for US market
    et_tz = pytz.timezone('America/New_York')
    now = datetime.now(et_tz)
    
    # Define market hours
    market_open = time(9, 30)
    market_close = time(16, 0)


    market_open_time = now.replace(hour=market_open.hour, minute=market_open.minute, second=0, microsecond=0)

    # If current time is before market open, there's no volume yet.
    # Get previous day's trading volume
    if now.time() < market_open_time.time():
        yesterdays_open_close_data = api.get_previous_open_close(stock_ticker=stock_ticker)
        assert yesterdays_open_close_data['resultsCount'] == 1
        return yesterdays_open_close_data['results'][0]['v']

    # If current time is after market close, use market close time
    end_time = min(now, now.replace(hour=market_close.hour, minute=market_close.minute, second=0, microsecond=0))
    
    # Convert to millisecond timestamps
    start_timestamp_ms: int = int(market_open_time.timestamp() * 1000)
    end_timestamp_ms: int = int(end_time.timestamp() * 1000)

    aggregate_data = api.get_aggregates_bars(stock_ticker, 1, "day", start_timestamp_ms=start_timestamp_ms, end_timestamp_ms=end_timestamp_ms)
    assert aggregate_data['resultsCount'] == 1
    return aggregate_data['results'][0]['v']

def get_market_open_price(api: Polygon, stock_ticker: str) -> float:
    """
    Get the market open price for a stock.

    If queried before market open, returns the previous day's open price.
    If queried during market hours, returns the current day's open price.

    Args:
        api (Polygon): An instance of the Polygon API client.
        stock_ticker (str): The stock symbol to query.

    Returns:
        float: The market open price for the stock.
    """
    # Set timezone to Eastern Time (ET) for US market
    et_tz = pytz.timezone('America/New_York')
    now = datetime.now(et_tz)
    
    # Define market hours
    market_open = time(9, 30)
    market_close = time(16, 0)

    market_open_time = now.replace(hour=market_open.hour, minute=market_open.minute, second=0, microsecond=0)

    # If current time is before market open, return previous day's open price
    if now.time() < market_open_time.time():
        yesterdays_open_close_data = api.get_previous_open_close(stock_ticker=stock_ticker)
        assert yesterdays_open_close_data['resultsCount'] == 1
        return yesterdays_open_close_data['results'][0]['o']

    # If current time is after market close, use market close time
    end_time = min(now, now.replace(hour=market_close.hour, minute=market_close.minute, second=0, microsecond=0))
    
    # Convert to millisecond timestamps
    start_timestamp_ms: int = int(market_open_time.timestamp() * 1000)
    end_timestamp_ms: int = int(end_time.timestamp() * 1000)

    aggregate_data = api.get_aggregates_bars(stock_ticker, 1, "day", start_timestamp_ms=start_timestamp_ms, end_timestamp_ms=end_timestamp_ms)
    assert aggregate_data['resultsCount'] == 1
    return aggregate_data['results'][0]['o']

def get_52_week_high_low(api: Polygon, stock_ticker: str) -> dict:
    """
    Get the 52-week high and low prices for a stock.

    This function retrieves the highest high and lowest low prices
    for the given stock over the past 52 weeks.

    Args:
        api (Polygon): An instance of the Polygon API client.
        stock_ticker (str): The stock symbol to query.

    Returns:
        dict: A dictionary containing the following keys:
            - fifty_two_week_high (float): The highest price in the last 52 weeks.
            - fifty_two_week_low (float): The lowest price in the last 52 weeks.
    """
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)  # 52 weeks

    # Convert to millisecond timestamps
    end_timestamp_ms = int(end_date.timestamp() * 1000)
    start_timestamp_ms = int(start_date.timestamp() * 1000)

    # Fetch aggregate data for the past year
    aggregate_data = api.get_aggregates_bars(
        stock_ticker, 
        1, 
        "day", 
        start_timestamp_ms=start_timestamp_ms, 
        end_timestamp_ms=end_timestamp_ms
    )

    if aggregate_data['resultsCount'] == 0:
        raise ValueError(f"No data available for {stock_ticker} in the past 52 weeks")

    # Initialize high and low with the first day's data
    fifty_two_week_high = aggregate_data['results'][0]['h']
    fifty_two_week_low = aggregate_data['results'][0]['l']

    # Iterate through all days to find the highest high and lowest low
    for day in aggregate_data['results']:
        fifty_two_week_high = max(fifty_two_week_high, day['h'])
        fifty_two_week_low = min(fifty_two_week_low, day['l'])

    return {
        "fifty_two_week_high": fifty_two_week_high,
        "fifty_two_week_low": fifty_two_week_low
    }

def get_market_data(api: Polygon, stock_ticker: str) -> dict:
    """
    Get comprehensive market data for a stock.

    This function retrieves the current price, trading volume, market open price,
    calculates the price change percentage, and gets the 52-week high/low for the given stock.

    Args:
        api (Polygon): An instance of the Polygon API client.
        stock_ticker (str): The stock symbol to query.

    Returns:
        dict: A dictionary containing the following keys:
            - current_price (float): The current price of the stock.
            - trading_volume (int): The trading volume for the stock.
            - current_market_open (float): The market open price for the stock.
            - price_change_percentage (float): The percentage change in price since market open.
            - fifty_two_week_high (float): The highest price in the last 52 weeks.
            - fifty_two_week_low (float): The lowest price in the last 52 weeks.
    """
    current_price = get_current_price(api, stock_ticker=stock_ticker)
    todays_trading_volume = get_trading_volume(api, stock_ticker=stock_ticker)
    todays_market_open_price = get_market_open_price(api, stock_ticker=stock_ticker)
    price_change_percentage = (current_price - todays_market_open_price) / todays_market_open_price * 100
    fifty_two_week_data = get_52_week_high_low(api, stock_ticker=stock_ticker)

    return {
        "current_price": current_price,
        "trading_volume": todays_trading_volume,
        "current_market_open": todays_market_open_price,
        "price_change_percentage": price_change_percentage,
        "fifty_two_week_high": fifty_two_week_data["fifty_two_week_high"],
        "fifty_two_week_low": fifty_two_week_data["fifty_two_week_low"],
    }