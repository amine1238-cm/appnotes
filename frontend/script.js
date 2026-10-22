const input = document.getElementById("noteInput");
const button = document.getElementById("addButton");
const container = document.getElementById("notesContainer");

button.addEventListener("click", async function() {
    const userNote = input.value.trim();

    if (userNote === "") {
        return;
    }

    try{
        const response = await fetch("http://127.0.0.1:8000/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: userNote
            })
        });

        if (!response.ok) {
            console.error("Request failed:", response.status);
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        input.value = "";
        await loadNotes();
    }
    catch(error){
        console.error("Operation failed",error);
        alert("could not add note please try again");;
    }
});

async function loadNotes() {
    try {
        const response = await fetch("http://127.0.0.1:8000/notes");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        container.replaceChildren();
        data.notes.forEach((note) => {
            const stored_paragraph = document.createElement("p");
            stored_paragraph.textContent = note.text;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", async function() {
                try{
                    const response = await fetch(`http://127.0.0.1:8000/notes/${note.id}`, {
                        method: "DELETE"
                    });

                    if (!response.ok) {
                        console.error("Request failed:", response.status);
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    await loadNotes(); 
                }
                catch(error){
                    console.error("Could not delete the note. Please try again.", error);
                    alert("Could not delete the note. Please try again.");
                }       
            });
            const editButton = document.createElement("button");
            editButton.textContent = " Edit ";


            editButton.addEventListener("click", async function (){
                const newText = prompt("Edit your note:", note.text);
                if (newText === null) {
                    return;
                }
                const updatedText = newText.trim();
                if (updatedText ==""){
                    return;
                }

                try{
                    const response = await fetch(`http://127.0.0.1:8000/notes/${note.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            text: updatedText
                        })
                    });

                    if (!response.ok) {
                        console.error("Request failed:", response.status);
                        throw new Error(`HTTP error: ${response.status}`);
                    }
                    await loadNotes();
                }

                catch(error){
                    console.error("Operation failed ", error);
                    alert("could not edit this please try again");
                }
                 




                
            });
    



            stored_paragraph.append(" " ,deleteButton, editButton);
            container.appendChild(stored_paragraph);  
            
        });
    }
    catch (error){
        console.error("Could not connect to the server:", error);
        container.replaceChildren();
        const errorParagraph = document.createElement("p");
        errorParagraph.textContent="Unable to load notes. Please try again later.";
        container.append( " ", errorParagraph);
    }



        
}

loadNotes();

