from fastapi import FastAPI
from fastapi import HTTPException
import pymongo
from pymongo import MongoClient

app = FastAPI()
client = None
@app.on_event("startup")
def startup():
    client = MongoClient("mongodb+srv://kdi:CANCUN1234@synosurvey.vylbayn.mongodb.net/test")
    db = client["SynoSurvey"]

@app.on_event("shutdown")
def shutdown():
    client.close()

@app.get("/")
async def root():
    return {"message" : "Hello world"}

@app.post("/schemas", status_code = 200)
def save_schema(question_code : str, answer_codes : list):
    print("Hello world!")