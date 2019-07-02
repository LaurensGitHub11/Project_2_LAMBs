import pandas as pd
import numpy as np
import datetime as dt
import sqlalchemy
import time
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
engine = create_engine("sqlite://///Users/abigailmetzger/Desktop/Project_2_LAMBs/Project_2_LAMBs/all_denver_data.sqlite")
Base = automap_base()
Base.prepare(engine,reflect=True)
session = Session(engine)
INCIDENT_ID = Base.classes.denver_data
app = Flask(__name__)
@app.route("/")
def home():
    print("Server received request for 'Home' page...")
    return "Welcome to my 'Home' page!"


if __name__ == "__main__":
    app.run(debug=True)