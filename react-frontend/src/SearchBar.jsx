function SearchBar({ searchText, onSearchChange }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      {searchText.length > 0 && <button onClick ={() => onSearchChange("")} > Clear </button> }
    </div>
  );
}

export default SearchBar;