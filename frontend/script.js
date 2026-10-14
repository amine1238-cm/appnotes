const input = document.getElementById("noteInput");
const button = document.getElementById("addButton");
const container = document.getElementById("notesContainer");

button.addEventListener("click", function() {
    const userNote = input.value.trim();

    if (userNote === "") {
        return;
    }

    const paragraph = document.createElement("p");
    paragraph.textContent = userNote;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click" , function(){
        paragraph.remove();
    })

    container.appendChild(paragraph);
    paragraph.append(" ");
    paragraph.appendChild(deleteButton);
    input.value = "";
});

