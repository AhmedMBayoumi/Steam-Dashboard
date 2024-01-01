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

connection.close()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-datachart')
def get_datachart():
    query = """
        SELECT primary_genre, ROUND(AVG(rating), 1) AS rating
        FROM Steam_data
        GROUP BY primary_genre
        ORDER BY rating DESC
        LIMIT 5
    """
    data = pd.read_sql_query(query, engine)
    chart_data = []
    for index, row in data.iterrows():
        chart_data.append({
            "primary_genre": row["primary_genre"],
            "rating": row["rating"],
          })

    return jsonify(chart_data)

@app.route('/get-datachart2')
def get_datachart2():
    query = """
        SELECT game, rating, positive_reviews, negative_reviews
        FROM Steam_data
        ORDER BY rating DESC
        LIMIT 5
    """
    data = pd.read_sql_query(query, engine)
    chart_data = []
    for index, row in data.iterrows():
        chart_data.append({
            "game": row["game"],
            "rating": row["rating"],
            'Positive Reviews':row['positive_reviews'],
            'Negative Reviews':row['negative_reviews']
        })

    return jsonify(chart_data)

@app.route('/get-datachart3')
def get_datachart3():
    query = """
        SELECT STRFTIME('%Y', release) AS release_year,
            CAST(REPLACE(players_right_now, ',', '') AS INTEGER) AS players_right_now
        FROM Steam_data
        WHERE release IS NOT NULL
    """
    df2 = pd.read_sql_query(query, engine)
    data = df2.groupby('release_year')['players_right_now'].sum().reset_index()
    chart_data = []

    for index, row in data.iterrows():
            chart_data.append({
                "year" :row["release_year"],
                "current Players" :row['players_right_now']
            })
    return jsonify(chart_data)

@app.route('/get-datachart4')
def get_datachart4():
    query = """
        SELECT
            game,
            CAST(positive_reviews AS INTEGER) AS positive_reviews,
            CAST(negative_reviews AS INTEGER) AS negative_reviews,
            CAST(rating AS REAL) AS rating
        FROM Steam_data
    """

    data = pd.read_sql_query(query, engine)
    data = remove_outlier(data, 'positive_reviews', 3)
    data = remove_outlier(data, 'negative_reviews', 3)
    chart_data = []
    for index, row in data.iterrows():
        if row['rating']>95:
            color="#a367dc"
        elif row['rating']<95 and row['rating']>90:
            color="#8067dc"
        elif row['rating']<90 and row['rating']>80:
            color='#6771dc'
        else:
            color ='#67b7dc'

        chart_data.append({
            "Game" :row["game"],
            "Positive Reviews" :row['positive_reviews'],
            "Negative Reviews" :row['negative_reviews'],
            "Rating" : row['rating'],
            "color" : color
        })
    return jsonify(chart_data)

@app.route('/get-datachart5')
def get_datachart5():
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
    return jsonify(chart_data)

if __name__ == '__main__':
    app.run(debug=True)