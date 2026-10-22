import sqlite3
connection = sqlite3.connect("notes.db")

cursor = connection.cursor()

note_text = "Learn SQLite"

cursor.execute(
    "INSERT INTO notes (text) VALUES (?)",
    (note_text,)
)

connection.commit()
connection.close()

print("Note inserted successfully!")