from core.config import settings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from openai import RateLimitError
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
    def generate_resume(cls, user_input: dict) -> dict:
        llm = cls._get_llm()
        parser = StrOutputParser()

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", RESUME_PROMPT),
                ("human", "Here is the user input JSON:\n{user_input}\n\nGenerate the resume accordingly."),
            ]
        )

        chain = prompt | llm | parser
        
        try:
            resume_text = chain.invoke({"user_input": str(user_input)})
        except RateLimitError as e:
            return {"error": "Rate limit reached. Please check billing or try again later."}

        template = user_input.get("template", "modern-2").lower()
        resume_text = cls._postprocess_resume(resume_text, template)

        resume_obj = cls._extract_resume_sections(resume_text)
        return resume_obj

    @staticmethod
    def _extract_resume_sections(text: str) -> dict:
        sections = {}

        title_match = re.search(r"^(.+(Resume|CV))\s*$", text, re.MULTILINE | re.IGNORECASE)
        sections["title"] = title_match.group(1).strip() if title_match else None

        name_match = re.search(r"^(?!.*(Resume|CV))([A-Z][a-zA-Z\s]+)$", text, re.MULTILINE)
        sections["name"] = name_match.group(2).strip() if name_match else None

        email_match = re.search(r"Email:\s*([^|\n]+)", text)
        phone_match = re.search(r"Phone:\s*([^|\n]+)", text)
        sections["email"] = email_match.group(1).strip() if email_match else None
        sections["phone"] = phone_match.group(1).strip() if phone_match else None

        linkedin_match = re.search(r"LinkedIn:\s*([^\|]+)", text)
        github_match = re.search(r"GitHub:\s*([^\n]+)", text)
        sections["linkedin"] = linkedin_match.group(1).strip() if linkedin_match else None
        sections["github"] = github_match.group(1).strip() if github_match else None

        def extract_section(header, next_headers):
            pattern = rf"{header}\n(.+?)(?=\n(?:{'|'.join(next_headers)}|$))"
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            return match.group(1).strip() if match else None

        sections["professionalsummary"] = extract_section("Professional Summary", ["Skills", "Work Experience", "Projects", "Education", "Certifications"])
        sections["skills"] = extract_section("Skills", ["Work Experience", "Projects", "Education", "Certifications"])
        sections["workexperience"] = extract_section("Work Experience", ["Projects", "Education", "Certifications"])
        sections["projects"] = extract_section("Projects", ["Education", "Certifications"])
        sections["education"] = extract_section("Education", ["Certifications"])
        sections["certifications"] = extract_section("Certifications", [])

        return sections

    @staticmethod
    def _postprocess_resume(text: str, template: str) -> str:

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
    
    
        
            

    