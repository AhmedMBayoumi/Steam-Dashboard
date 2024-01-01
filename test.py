from flask import Flask, jsonify, render_template
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
def remove_outlier(df, column, v):
    mean = df[column].mean()
    variance = df[column].var()
    std = variance**0.5
    lower = mean - std * v
    upper = mean + std * v

    return df[(df[column] >= lower) & (df[column] <= upper)]

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn

df = pd.read_csv("game_data_all.csv")
connection = create_connection("demo.db")
df.to_sql("Steam_data", connection, if_exists="replace")
db_url = 'sqlite:///demo.db'
engine = create_engine(db_url, echo=True)

query = """
    SELECT
        CAST(REPLACE(players_right_now, ',', '') AS INTEGER) AS players_right_now,
        STRFTIME('%Y', release) AS years,
        CASE
            WHEN STRFTIME('%Y', release) = '2021' THEN REPLACE(primary_genre, SUBSTR(primary_genre, INSTR(primary_genre, ' ')), '(21)')
            WHEN STRFTIME('%Y', release) = '2022' THEN REPLACE(primary_genre, SUBSTR(primary_genre, INSTR(primary_genre, ' ')), '(22)')
            WHEN STRFTIME('%Y', release) = '2023' THEN REPLACE(primary_genre, SUBSTR(primary_genre, INSTR(primary_genre, ' ')), '(23)')
        END AS primary_genre
    FROM Steam_data
"""
data = pd.read_sql_query(query, engine)
data = data.groupby(['years', 'primary_genre'])['players_right_now'].sum().reset_index()
data = data.groupby('years').apply(lambda x: x.nlargest(6, 'players_right_now')).reset_index(drop=True)

chart_data = data.to_dict(orient='records')

print(data.head(20))
