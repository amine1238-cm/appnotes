import sqlite3

connection = sqlite3.connect("notes.db")

cursor = connection.cursor()

note_id = 3 

cursor.execute(
    "DELETE FROM notes WHERE ID = ?",
    (note_id,)
)

if cursor.rowcount == 1 :
    print(" note deleted successfully ")
else :
    print ( "Note not found" )


connection.commit()
connection.close()