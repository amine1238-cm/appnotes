import sqlite3 
from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path 


DB_PATH = Path(__file__).resolve().parent / "notes.db"

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

class NoteCreate(BaseModel):
    text : str 


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://127.0.0.1:5500",
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

notes = [
    {"id": 1, "text": "Learn Python"},
    {"id": 2, "text": "Build my first API"},
    {"id": 3, "text": "Become a software developer"}
]

@app.get("/")
def home():
    return {
                "application": "My Notes",
                "status": "running",
                "version": 1
            }


@app.get("/notes")
def get_notes():
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute ("SELECT * FROM notes")
        rows = cursor.fetchall()
        result = [dict(row) for row in rows]
    finally:
        connection.close()

    return {"notes": result}

@app.get("/notes/{note_id}")
def get_note(note_id : int):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT * FROM notes WHERE id =?",
            (note_id,)
        )
        row = cursor.fetchone()
    finally:
        connection.close()

    if row is None :
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
    return dict(row)


@app.post("/notes")
def create_note(note: NoteCreate):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO notes (text) VALUES (?)",
            (note.text,)
        )
        
        new_id = cursor.lastrowid
        connection.commit()
    finally:
        connection.close()
    new_note = {"id": new_id, "text": note.text}
    return new_note 



@app.delete("/notes/{note_id}")
def delete_note(note_id : int):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM notes WHERE ID = ?",
            (note_id,)
        )
        affectedRows = cursor.rowcount

        connection.commit()
    finally:
        connection.close()
    if affectedRows == 0 :
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    return {"message": f"Note {note_id} deleted successfully"}

@app.put("/notes/{note_id}")
def update_note(note_id: int, note: NoteCreate):
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE notes SET text = ? WHERE id = ?",
            (note.text, note_id)
        )

        affectedRows = cursor.rowcount
        connection.commit()
    finally:
        connection.close()

    if affectedRows == 0 :
        raise HTTPException(
        status_code=404,
        detail="Note not found"
        )
    return  {"id": note_id, "text": note.text}