import autogen
from autogen.cache import Cache
from finrobot.utils import get_current_date, register_keys_from_json
from finrobot.data_source import (
    FinnHubUtils,
    YFinanceUtils,
    SECUtils,
    FMPUtils,
    PolygonUtils
)
from finrobot.toolkits import register_toolkits

# Read OpenAI API keys from a JSON file
config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={"model": ["gpt-4-0125-preview"]},
)
llm_config = {"config_list": config_list, "timeout": 120, "temperature": 0}

# Register API keys
register_keys_from_json("config_api_keys")

junior_trader = autogen.AssistantAgent(
    name="Junior_Trader",
    system_message=(
        "As a Junior Trader, your task is to assist in analyzing and understanding options. "
        "Identify cheap and rich options by evaluating various comparison metrics. Provide clear "
        "and actionable insights to aid in trading decisions. Reply TERMINATE when the task is done."
    ),
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="User_Proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", ""
    ).endswith("TERMINATE"),
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "junior_trader_analysis",
        "use_docker": False,
    },
)

tools = [
    {
        "function": FinnHubUtils.get_company_profile,
        "name": "get_company_profile",
        "description": "Get a company's profile information."
    },
    {
        "function": FinnHubUtils.get_company_news,
        "name": "get_company_news",
        "description": "Retrieve market news related to the designated company."
    },
    {
        "function": FinnHubUtils.get_basic_financials,
        "name": "get_financial_basics",
        "description": "Get the latest financial basics for the designated company."
    },
    {
        "function": YFinanceUtils.get_stock_data,
        "name": "get_stock_data",
        "description": "Retrieve stock price data for the designated ticker symbol."
    },
    {
        "function": PolygonUtils.get_options_metrics,
        "name": "get_options_metrics",
        "description": "Get various metrics for options to identify cheap and rich options."
    },
    {
        "function": PolygonUtils.compare_option_prices,
        "name": "compare_option_prices",
        "description": "Compare option prices against historical averages to identify anomalies."
    },
]

register_toolkits(tools, junior_trader, user_proxy)

def analyze_options(company, ticker):
    with Cache.disk() as cache:
        user_proxy.initiate_chat(
            junior_trader,
            message=(
                f"Analyze the options for {company} ({ticker}) as of {get_current_date()}. "
                "Identify cheap and rich options by evaluating various comparison metrics such as implied volatility, "
                "historical volatility, open interest, and volume. Provide actionable insights and recommendations "
                "based on your analysis."
            ),
            cache=cache,
        )

    messages = user_proxy.chat_messages[junior_trader]
    return messages[-2]['content']

if __name__ == "__main__":
    company = "Apple Inc."
    ticker = "AAPL"
    options_analysis_report = analyze_options(company, ticker)
    print(options_analysis_report)
