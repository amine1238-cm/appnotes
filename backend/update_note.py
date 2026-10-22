import sqlite3 
connection = sqlite3.connect("notes.db")

cursor = connection.cursor()

note_id= 2
new_text = "Master SQLite"


cursor.execute(
    "UPDATE notes SET text = ? WHERE id = ?",
    (new_text, note_id)
)

if cursor.rowcount == 1 :
    print("Note updated successfully!")
else :
    print("Note not found!")


connection.commit()
connection.close()



