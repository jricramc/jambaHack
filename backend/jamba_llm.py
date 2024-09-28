# jamba_llm.py
import ai21
from autogen.llm import LLM

class JambaLLM(LLM):
    def __init__(self, model_name, api_key, **kwargs):
        self.model_name = model_name
        self.api_key = api_key
        self.kwargs = kwargs
        self.client = ai21.Client(api_key)

    def generate(self, prompt, max_tokens=None, stop=None, **kwargs):
        merged_kwargs = {**self.kwargs, **kwargs}
        response = self.client.generate(
            prompt=prompt,
            model=self.model_name,
            max_tokens=max_tokens,
            stop_sequences=stop,
            **merged_kwargs
        )
        return response.text

    def __call__(self, prompt, **kwargs):
        return self.generate(prompt, **kwargs)