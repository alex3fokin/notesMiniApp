function Note(name, description, date) {
    this.name = name;
    this.description = description;
    this.date = date;
}

window.onload = function () {
    var notesTable = {
        table: document.getElementById('notes-table'),
        addRow: function(note) {
            var newTr = document.createElement('tr');
            newTr.innerHTML = "<td title='" + note.description + "'>" + note.name + "</td><td>" + note.date + "</td><td><button class='btn btn-outline-warning' type='button'>Изменить</button><button class='btn btn-outline-danger' type='button'>X</button></td>";
            this.table.appendChild(newTr);
        },
        editRow: function(index, note) {
            this.table.rows[index].cells[0].textContent = note.name;
            this.table.rows[index].cells[0].setAttribute('title', note.description);
            this.table.rows[index].cells[1].textContent = note.date;
        },
        deleteRow: function(index) {
            this.table.deleteRow(index);
        }
    };
    var ctrlNote = document.forms.notesCtrl;
    var notesData = {
        data: JSON.parse(localStorage.getItem('notes')),
        updateLocalStorage: function() {
            localStorage.setItem('notes', JSON.stringify(this.data));
        },
        addNote: function(name, description) {
            var currentTime = new Date();
            currentTime = currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString();
            this.data.push(new Note(name, description, currentTime));
        },
        deleteNote: function(index) {
            this.data.splice(index, 1);
        },
        editNote: function(index, newName, newDescription) {
            var currentTime = new Date();
            currentTime = currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString();
            this.data[index].name = newName;
            this.data[index].description = newDescription;
            this.data[index].date = currentTime;
        }
    }; 
    
    if(notesData.data === null || notesData.data.length === 0) {
        notesData.data = [];
    } else {
        notesData.data.forEach(function (note, index) {
            notesTable.addRow(note);
            notesTable.table.children[index + 1].children[2].children[0].onclick = function() {
                var rowIndex = this.parentNode.parentNode.rowIndex;
                ctrlNote.elements.noteName.value = note.name;
                ctrlNote.elements.noteDescription.value = note.description;
                ctrlNote.elements.rowID.value = rowIndex;
                ctrlNote.elements.submitBtn.value = 'Сохранить';
            };
            notesTable.table.children[index + 1].children[2].children[1].onclick = function() {
                var rowIndex = this.parentNode.parentNode.rowIndex;
                notesTable.deleteRow(rowIndex);
                notesData.deleteNote(rowIndex - 1);
                notesData.updateLocalStorage();
            };
        });
    }
    ctrlNote.onsubmit = function() {
        var newName = this.elements.noteName.value, 
            newDescription = this.elements.noteDescription.value;
	if(this.elements.rowID.value !== '-1') {
            var index = this.elements.rowID.value;
            notesData.editNote(index - 1, newName, newDescription);
            notesTable.editRow(index, notesData.data[index - 1]);
            notesData.updateLocalStorage();
            
            this.elements.noteName.value = this.elements.noteDescription.value = "";
            this.elements.submitBtn.value = "Добавить заметку";
            this.elements.rowID.value = '-1';
        } else {
            notesData.addNote(newName, newDescription);
            notesTable.addRow(notesData.data[notesData.data.length - 1]);

            notesTable.table.children[notesData.data.length].children[2].children[0].onclick = function() {
                var rowIndex = this.parentNode.parentNode.rowIndex;
                ctrlNote.elements.noteName.value = notesData.data[rowIndex - 1].name;
                ctrlNote.elements.noteDescription.value = notesData.data[rowIndex - 1].description;
                ctrlNote.elements.rowID.value = rowIndex;
                ctrlNote.elements.submitBtn.value = 'Сохранить';
            };
            notesTable.table.children[notesData.data.length].children[2].children[1].onclick = function() {
                var rowIndex = this.parentNode.parentNode.rowIndex;
                notesTable.deleteRow(rowIndex);
                notesData.deleteNote(rowIndex - 1);
                notesData.updateLocalStorage();
            };
            notesData.updateLocalStorage();
            this.elements.noteName.value = this.elements.noteDescription.value = "";
        }
	return false;
    };
};