from autogen import AssistantAgent, UserProxyAgent
from types import SimpleNamespace
from autogen.cache import Cache
from finrobot.utils import get_current_date, register_keys_from_json
from finrobot.data_source import FinnHubUtils, YFinanceUtils, SECUtils, FMPUtils
from finrobot.toolkits import register_toolkits
from ai21 import AI21Client
from ai21.models.chat import UserMessage


# from ai21.models.chat import ChatMessage


# Replace this with your actual API key
# api_key = "7RePlXMxYsEdGQsldNUGG2kIOAmB22ob"

# Define AI21 Jamba Model Client Class
class AI21JambaModelClient:
    def __init__(self, config, **kwargs):
        # self.api_key = config.get('api_key')
        self.client = AI21Client(api_key="7RePlXMxYsEdGQsldNUGG2kIOAmB22ob")
        self.model = "jamba-1.5-large"
        self.temperature = config.get('temperature', 0.7)
        self.top_p = config.get('top_p', 1.0)
        print(f"AI21JambaModelClient initialized with config: {config}")

    def create(self, params):
        messages = [
            UserMessage(
                content=params["messages"][0]['content']  # Assuming single user message
            )
        ]
        
        # Calling AI21's Jamba API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            top_p=self.top_p,
            max_tokens=params.get("max_tokens", 256),
        )
        
        # Convert the response to the necessary structure
        choices = response.choices
        # Wrap the response in SimpleNamespace to make it compatible with AutoGen
        response_namespace = SimpleNamespace()
        response_namespace.choices = [
            SimpleNamespace(message=SimpleNamespace(content=choice.message.content))
            for choice in choices
        ]
        # Add a cost attribute (even if 0, since AutoGen expects it)
        response_namespace.cost = 0
        
        return response_namespace

    def message_retrieval(self, response):
        """Retrieve the assistant's response from the AI21 API response."""
        choices = response.choices
        return [choice.message.content for choice in choices]

    def cost(self, response) -> float:
        return response.cost

    @staticmethod
    def get_usage(response):
        return {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
            "cost": response.cost
        }

# Define the configuration
config_list_custom = [
    {
        "model": "jamba-1.5-large",
        "model_client_cls": "AI21JambaModelClient",
        "api_key": "7RePlXMxYsEdGQsldNUGG2kIOAmB22ob",
        "temperature": 0.7,
        "top_p": 1.0,
        "max_tokens": 256
    }
]

# Initialize Assistant and Register the AI21JambaModelClient


# class JambaCustomModelClient:
#     def __init__(self, config, **kwargs):
#         # self.client = AI21Client(api_key=config["api_key"])
#         self.client = AI21Client(api_key="7RePlXMxYsEdGQsldNUGG2kIOAmB22ob")

#         self.model = config["model"]
#         self.temperature = config.get("temperature", 0.7)
#         self.max_tokens = config.get("max_tokens", 500)
#         # print(f"CustomModelClient config: {config}")

#     def create(self, params):
#         num_of_responses = params.get("n", 1)
#         messages = params.get("messages", [])

#         response = self.client.chat.completions.create(
#             model=self.model,
#             messages=[ChatMessage(**msg) for msg in messages],
#             temperature=self.temperature,
#             max_tokens=self.max_tokens,
#             n=num_of_responses
#         )

#         converted_response = SimpleNamespace()
#         converted_response.choices = []
#         converted_response.model = self.model

#         for choice in response.choices:
#             converted_choice = SimpleNamespace()
#             converted_choice.message = SimpleNamespace()
#             converted_choice.message.content = choice.message.content
#             converted_choice.message.function_call = None
#             converted_response.choices.append(converted_choice)

#         return converted_response

       
#     def message_retrieval(self, response):
#         choices = response.choices
#         return [choice.message.content for choice in choices]

#     def cost(self, response):
#         return response.cost

#     @staticmethod
#     def get_usage(response):
#         return response.usage

# Read OpenAI API keys from a JSON file
# config_list = autogen.config_list_from_json(
#     "OAI_CONFIG_LIST",
#     filter_dict={"model": ["gpt-4-0125-preview"]},
# )
config_list2 = [{
        "model": "jamba-1.5-large",
        "model_client_cls": "AI21JambaModelClient",
        "temperature": 0.7,
        "top_p": 1,
        "max_tokens": 400,
        
}]


llm_config = {"config_list": config_list_custom, "timeout": 120, "temperature": 0}

# Register API keys
register_keys_from_json("config_api_keys")

researcher = AssistantAgent(
    name="Researcher_Agent",
    system_message="As a Researcher Agent, your task is to provide comprehensive research information about a company, including summaries of its latest SEC filings, news, and fundamental data. Reply TERMINATE when the task is done.",
    llm_config=llm_config,
)

researcher.register_model_client(model_client_cls=AI21JambaModelClient)


# researcher.register_model_client(model_client_cls=JambaCustomModelClient)


user_proxy = UserProxyAgent(
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
    company = "Nvidia"
    research_report = research_company(company)
    print(research_report)