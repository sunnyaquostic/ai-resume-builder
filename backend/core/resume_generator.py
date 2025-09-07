from core.config import settings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from core.prompts import RESUME_PROMPT
import os
import re

class ResumeGenerator:
    @classmethod
    def _get_llm(cls):
        openai_api_key = os.getenv("OPENAI_API_KEY")
        serviceurl = os.getenv("CHOREO_OPENAI_CONNECTION_SERVICEURL")

        if openai_api_key and serviceurl:
            return ChatOpenAI(
                model=settings.LLM_MODEL,
                api_key=openai_api_key,
                service_url=serviceurl,
            )

        return ChatOpenAI(model=settings.LLM_MODEL, api_key=settings.OPENAI_API_KEY)

    @classmethod
    def generate_resume(cls, user_input: dict) -> str:

        llm = cls._get_llm()

        parser = StrOutputParser()

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    RESUME_PROMPT,
                ),
                (
                    "human",
                    f"Here is the user input JSON:\n{user_input}\n\nGenerate the resume accordingly.",
                ),
            ]
        )

        chain = prompt | llm | parser
        resume_text = chain.invoke({})

        template = user_input.get("template", "modern-2").lower()
        resume_text = cls._postprocess_resume(resume_text, template)

        return resume_text

    @staticmethod
    def _postprocess_resume(text: str, template: str) -> str:
        """
        Enforce formatting rules depending on the resume style.
        """
        if template == "modern-1":

            lines = text.splitlines()
            short_lines = []
            for line in lines:
                if len(line.strip()) > 200:
                    line = line[:200] + "..."
                short_lines.append(line)
            return "\n".join(short_lines)

        elif template == "modern-2":
            text = re.sub(r"(Summary|Skills|Experience|Projects|Education)", r"\n\1", text)
            return text

        elif template == "modern-3":
            text = re.sub(r"[•●▪▶✔✓✦➤➔]", "-", text)
            text = re.sub(r"[^\x00-\x7F]+", "", text)
            return text.strip()

        return text
    
    
        
            

    