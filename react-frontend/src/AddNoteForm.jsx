function AddNoteForm({ text, onTextChange, onAddNote,maxLength,isAdding,inputRef }) {

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim().length === 0  || text.length > maxLength ) {
      return;
    }
    onAddNote();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Write a new note..."
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
      />
      <p> {text.length} / {maxLength} </p>
      {text.length > maxLength && <p> Note is too long! </p>}
      <button type="submit" disabled= {text.trim().length === 0  || text.length > maxLength || isAdding === true }>
        {isAdding ? "Adding..." : "Add Note"}
      </button>
    </form>
  );
}

export default AddNoteForm