import autogen
from autogen.cache import Cache
from finrobot.utils import get_current_date, register_keys_from_json
from finrobot.data_source import FinnHubUtils, YFinanceUtils, SECUtils, FMPUtils
from finrobot.toolkits import register_toolkits

# Read OpenAI API keys from a JSON file
config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={"model": ["gpt-4-0125-preview"]},
)
llm_config = {"config_list": config_list, "timeout": 120, "temperature": 0}

# Register API keys
register_keys_from_json("config_api_keys")

researcher = autogen.AssistantAgent(
    name="Researcher_Agent",
    system_message="As a Researcher Agent, your task is to provide comprehensive research information about a company, including summaries of its latest SEC filings, news, and fundamental data. Reply TERMINATE when the task is done.",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="User_Proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", "").endswith("TERMINATE"),
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "research",
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
    # {
    #     "function": SECUtils.get_10k_metadata,
    #     "name": "get_10k_metadata",
    #     "description": "retrieve a company's 10k metadata"
    # },
    {
        "function": FMPUtils.get_sec_report,
        "name": "get_sec_report",
        "description": "get the sec report for a specific company and year "
    },
]
register_toolkits(tools, researcher, user_proxy)

def research_company(company):
    with Cache.disk() as cache:
        user_proxy.initiate_chat(
            researcher,
            message=f"Provide a comprehensive research report for {company} as of {get_current_date()}. The report should include summaries of the company's latest SEC filings, relevant news, and key fundamental data. Organize the information in a clear and concise manner.",
            cache=cache,
        )

    messages = user_proxy.chat_messages[researcher]
    return messages[:-2][-1]['content']

if __name__ == "__main__":
    company = "NVDIA"
    research_report = research_company(company)
    print(research_report)