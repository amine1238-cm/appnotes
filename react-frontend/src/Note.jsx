import { useState } from 'react';



function Note ({ id, text,onDelete,onSave,isDeleting,deleteDisabled}){
    const [isEditing, setIsEditing] = useState(false);

    const [editedText, setEditedText] = useState(text);

    const [isSaving, setIsSaving] = useState(false);

    const [saveError, setSaveError] = useState("");

    const maxLength = 100;

    function handleKeyDown(event) {

        if(event.key === "Enter"){
            saveEditing();
        }
    }

    function startEditing() {
        setEditedText(text);
        setIsEditing(true);
        setSaveError("");
    }
    async function saveEditing() {
        if (isSaving) {
            return;
        }
        const trimmedText = editedText.trim();
        if (trimmedText ==="") {
            return
        }
        if (editedText.length > maxLength) {
            return;
        }

        setSaveError("");


        try{
            setIsSaving(true);
            await onSave(id , trimmedText);
            setIsEditing(false);
        }
        catch (error) {
            console.error("Failed to save note:", error);
            setSaveError("Could not save note. Please try again.");
        }
        finally{
            setIsSaving(false);
        }

        
    }
    return <div>
                <h3> {id}</h3>
                {isEditing ? (
                    <div>
                        <input
                            value={editedText}
                            onChange={(event) => setEditedText(event.target.value)}
                            disabled={isSaving}
                            onKeyDown={handleKeyDown}
                        />


                        <button onClick={() => setIsEditing(false)}  disabled={isSaving} >
                            Cancel
                        </button>


                        <button onClick={saveEditing} disabled={isSaving || editedText.trim().length === 0 || editedText.length > maxLength } >
                            {isSaving? "Saving..." : "Save"}
                        </button>

                        <p>{editedText.length} / {maxLength}</p>

                        {saveError && <p>{saveError}</p>}
                        {editedText.length > maxLength && <p> Note is too long ! </p>}

                    </div>
                ) : (
                    <div>
                        <p>{text}</p>


                        <button onClick={startEditing}>
                            Edit
                        </button>


                        <button onClick={() => onDelete(id)} disabled= {deleteDisabled}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>


                    </div>
                )}
            </div>
}
export default Note