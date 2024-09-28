
import autogen
from autogen.cache import Cache

from finrobot.utils import get_current_date, register_keys_from_json
from finrobot.data_source import FinnHubUtils, YFinanceUtils
from finrobot.toolkits import register_toolkits


# Read OpenAI API keys from a JSON file
config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={"model": ["gpt-4-0125-preview"]},
)
llm_config = {"config_list": config_list, "timeout": 120, "temperature": 0}

# Register FINNHUB API keys
register_keys_from_json("config_api_keys")

analyst = autogen.AssistantAgent(
    name="Market_Analyst",
    system_message="As a Market Analyst, one must possess strong analytical and problem-solving abilities, collect necessary financial information and aggregate them based on client's requirement."
    "For coding tasks, only use the functions you have been provided with. Reply TERMINATE when the task is done.",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="User_Proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", "").endswith("TERMINATE"),
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },  # Please set use_docker=True if docker is available to run the generated code. Using docker is safer than running the generated code directly.
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
    }
]
register_toolkits(tools, analyst, user_proxy)

# company = "Tesla"
def single_agent_analysis(company):
    # company = "APPLE"

    with Cache.disk() as cache:
        # start the conversation
        user_proxy.initiate_chat(
            analyst,
            message=f"Use all the tools provided to retrieve information available for {company} upon {get_current_date()}. Analyze the positive developments and potential concerns of {company} "
            "with 2-4 most important factors respectively and keep them concise. Most factors should be inferred from company related news. "
            f"Then make a rough prediction (e.g. up/down by 2-3%) of the {company} stock price movement for next week. Provide a summary analysis to support your prediction.",
            cache=cache,
        )

    # print('here got to the end')
    # print(user_proxy.chat_messages)


    x = user_proxy.chat_messages

    for key in x.keys():
        if isinstance(key, autogen.agentchat.assistant_agent.AssistantAgent):
            messages = x[key]
            break
    
    return messages[:-2][-1]['content']

if __name__ == "__main__":
    company = "Tesla"
    analysis = single_agent_analysis(company)
    print(analysis)