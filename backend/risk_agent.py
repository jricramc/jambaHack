import autogen
from autogen.cache import Cache
from finrobot.utils import get_current_date, register_keys_from_json

from finrobot.data_source import (
    FinnHubUtils,
    YFinanceUtils,
    SECUtils,
    FMPUtils,
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

risk_manager = autogen.AssistantAgent(
    name="Risk_Manager",
    system_message="As a Risk Manager, your task is to perform comprehensive risk analysis for a given company, utilizing various data sources and tools. Reply TERMINATE when the task is done.",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="User_Proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", "").endswith("TERMINATE"),
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "risk_analysis",
        "use_docker": False,
    },
)

tools = [
    {
        "function": FinnHubUtils.get_company_profile,
        "name": "get_company_profile",
        "description": "get a company's profile information"
    },
    {
        "function": FinnHubUtils.get_company_news,
        "name": "get_company_news",
        "description": "retrieve market news related to designated company"
    },
    {
        "function": FinnHubUtils.get_basic_financials,
        "name": "get_financial_basics",
        "description": "get latest financial basics for a designated company"
    },
    {
        "function": YFinanceUtils.get_stock_data,
        "name": "get_stock_data",
        "description": "retrieve stock price data for designated ticker symbol"
    },
    {
        "function": YFinanceUtils.get_income_stmt,
        "name": "get_income_stmt",
        "description": "get the latest income statement of the company"
    },
    {
        "function": YFinanceUtils.get_balance_sheet,
        "name": "get_balance_sheet",
        "description": "get the latest balance sheet of the company"
    },
    {
        "function": YFinanceUtils.get_cash_flow,
        "name": "get_cash_flow",
        "description": "get the latest cash flow statement of the company"
    },
    {
        "function": SECUtils.get_10k_section,
        "name": "get_10k_section",
        "description": "get a specific section of a 10-K report from the SEC API"
    },
    {
        "function": SECUtils.download_10k_filing,
        "name": "download_10k_filing",
        "description": "download the latest 10-K filing as htm for a given ticker"
    },
    {
        "function": SECUtils.download_10k_pdf,
        "name": "download_10k_pdf",
        "description": "download the latest 10-K filing as pdf for a given ticker"
    },
    {
        "function": FMPUtils.get_competitor_financial_metrics,
        "name": "get_competitor_financial_metrics",
        "description": "get financial metrics for a company and its competitors"
    },
    
    # {
    #     "function": FinanceData.get_stock_data,
    #     "name": "get_stock_data",
    #     "description": "retrieve stock price data for designated ticker symbol"
    # },
    # {
    #     "function": FinanceData.get_company_profile,
    #     "name": "get_company_profile",
    #     "description": "get a company's profile information"
    # },
    # {
    #     "function": FinanceData.get_company_news,
    #     "name": "get_company_news",
    #     "description": "retrieve market news related to designated company"
    # },
    # {
    #     "function": FinanceData.get_financial_basics,
    #     "name": "get_financial_basics",
    #     "description": "get latest financial basics for a designated company"
    # },
]
register_toolkits(tools, risk_manager, user_proxy)

def perform_risk_analysis(company):
    with Cache.disk() as cache:
        user_proxy.initiate_chat(
            risk_manager,
            message=f"Perform a comprehensive risk analysis for {company} as of {get_current_date()}. Utilize all available tools to gather relevant information, including company profile, news, financial statements, SEC filings, and competitor data. Analyze potential risks and provide a detailed risk assessment report.",
            cache=cache,
        )

    messages = user_proxy.chat_messages[risk_manager]
    return messages[:-2][-1]['content']

if __name__ == "__main__":
    company = "Apple Inc."
    risk_analysis_report = perform_risk_analysis(company)
    print(risk_analysis_report)