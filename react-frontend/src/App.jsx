import Welcome from './Welcome'
import Note from './Note'
import SearchBar from "./SearchBar";
import AddNoteForm from './AddNoteForm';
import NotesCounter from './NotesCounter';
import { useState, useEffect } from 'react';
import SortSelector from './SortSelector';
import { useRef } from "react";


function App() {





  const [notes, setNotes] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");

  const [addError, setAddError] = useState("");

  const [deleteSuccess, setDeleteSuccess] = useState("");

  const [deleteError, setDeleteError] = useState("");

  const [isAdding, setIsAdding] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [sortOrder, setSortOrder] = useState("newest");

  const noteInputRef = useRef(null);

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );
  const visibleNotes = filteredNotes.length ;
  const totalNotes = notes.length;

  const sortedNotes = [...filteredNotes].sort((a,b) => {
      if (sortOrder ==="newest"){
        return b.id - a.id;
      }else{
        return a.id - b.id;
      }
  });


  const noteElements = sortedNotes.map((note) => (
    <Note
        key={note.id}
        id={note.id}
        text={note.text}
        onDelete={deleteNote}
        onSave={updateNote}
        isDeleting={deletingId === note.id}
        deleteDisabled={deletingId !== null}

    />
  ));





  const [text,setText]= useState("");


  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");





  async function loadData() {
      setIsLoading(true);
      setError("");
      try {
          const response = await fetch("http://127.0.0.1:8000/notes");

          if (!response.ok) {
              throw new Error(`HTTP error: ${response.status}`);
          }

          const data = await response.json();
          setNotes(data.notes);
      } catch (error) {
          console.error("Failed to load notes:", error);
          setError("Could not load notes. Please try again.");
      }
      finally{
        setIsLoading(false);
      }
  }











  useEffect(() => {
    loadData();
}, []);







  async function addNote(){
    setSuccessMessage("");
    setAddError("");
    const trimmedText = text.trim();
    if (trimmedText === ""){
      return;
    }
    if (isAdding === true){
      return;
    }
    try {
      setIsAdding(true);
      const response = await fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: trimmedText
        })
      });
      if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
      }
      const newNote = await response.json();
      setNotes(previousNotes => [
      ...previousNotes,
      newNote
      ]);
      setText("");
      setSuccessMessage("Note added successfully!");
      noteInputRef.current?.focus();
    }
    catch (error) {
      console.error("Failed to add note:", error);
      setAddError("coud not add note .");
    }
    finally{
      setIsAdding(false);
    }



  }





async function deleteNote(id) {

    if (deletingId !== null){
      return;
    }

    const confirmed = window.confirm("Delete this item?");

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    setDeleteSuccess("");
    setDeleteError("");
    try {

        const response = await fetch(
            `http://127.0.0.1:8000/notes/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        setNotes(previousNotes =>
            previousNotes.filter(note => note.id !== id)
        );
        setDeleteSuccess("Note deleted successfully!");

    } catch (error) {
        console.error("DELETE FAILED:", error);
        setDeleteError("Could not delete note. Please try again.");
    }
    finally{
      setDeletingId(null);
    }
}



async function updateNote(id, updatedText) {
  try{

    const response = await fetch(
      `http://127.0.0.1:8000/notes/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: updatedText
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const updatedNote = await response.json();
    setNotes(previousNotes =>
      previousNotes.map(note =>
        note.id === updatedNote.id
            ? updatedNote
            : note
      )
    );

  }
  catch (error) {
    console.error("Failed to update note:", error);
    throw error;
  }

}




return (
  <>
    <Welcome />
    
    <SearchBar
      searchText={searchText}
      onSearchChange={setSearchText}
    />
    <SortSelector
      sortOrder={sortOrder}
      onSortChange={setSortOrder}
    />
    <NotesCounter
      visibleNotes={visibleNotes}
      totalNotes={totalNotes}
     /> 

    {isLoading ? (
      <p>Loading notes...</p>
    ) : error ? (
      <>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </>
    ) : notes.length === 0 ? (
      <p>No notes yet.</p>

    ) : notes.length > 0 && filteredNotes.length === 0 ? (
      <p> No matching notes found.</p>
    ) : (
      noteElements
    )}

    <AddNoteForm
      text={text}
      onTextChange={setText}
      onAddNote={addNote}
      maxLength={100}
      isAdding={isAdding}
      inputRef={noteInputRef}
    />
    {successMessage && <p>{successMessage}</p>}
    {addError && <p>{addError}</p>}
    {successMessage  && <button onClick={() => setSuccessMessage("")}> Dismiss </button>}

    {deleteSuccess && <p>{deleteSuccess}</p>}
    {deleteError && <p>{deleteError}</p>}
    {deleteSuccess  && <button onClick={() => setDeleteSuccess("")}> Dismiss </button>}
  </>
);
  
}

export default App
