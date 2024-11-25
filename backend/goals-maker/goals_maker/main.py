from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage

load_dotenv()

model = ChatGroq(model="llama3-8b-8192")


def create_how_to_goal(goal):
    response = model.invoke([HumanMessage(content=goal)])
    return response.content
