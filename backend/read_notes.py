import sqlite3
connection = sqlite3.connect("notes.db")

cursor = connection.cursor()

cursor.execute("SELECT * FROM notes")

rows = cursor.fetchall()



for row in rows:
    print(f"ID : {row[0]} | Note : {row[1]} ")






connection.close()

