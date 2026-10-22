import sqlite3

connection = sqlite3.connect("notes.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL
    )
    """)


connection.commit()
connection.close()

print("Database initialized successfully!")
