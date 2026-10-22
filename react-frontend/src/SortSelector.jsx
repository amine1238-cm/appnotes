function SortSelector({sortOrder, onSortChange}){
    return (
        <select
            value={sortOrder}
            onChange={(event) => onSortChange(event.target.value)}
        >
            <option value="newest"> Newest first </option>
            <option value="oldest"> Oldest first </option>
        </select>



    );
}
export default SortSelector;