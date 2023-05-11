const addCompleteBtn = document.querySelector('.add-completed-btn');
let completeList = [];

// show Tasks
export const addCompleteNote = function (data='') {
    let html =
        `
       <li draggable="true"><input type="text" contentEditable="false" value ="${data}" ><span><ion-icon name="pencil-outline" class="edit-note"></ion-icon> <ion-icon name="trash-outline" class="delete-note"></ion-icon></span></li>
       `
    addCompleteBtn.insertAdjacentHTML('beforebegin', html)
}


// Update Ui When reloding page
const updateCompletedUi = function() {
    if (localStorage.getItem('completed') != null) {
        completeList = [...new Set(JSON.parse(localStorage.getItem('completed')))]
        // completeList = JSON.parse(localStorage.getItem('completed'))
        completeList.forEach(data => {
            addCompleteNote(data.trim())
        })

        const existData = document.querySelectorAll('.completed input');
        existData.forEach(dataInput =>{
            dataInput.setAttribute('disabled', true);
            dataInput.setAttribute('readonly', true)
        })
    }
}

updateCompletedUi()


// Delete Specific Task
export function deletedCompletedTask() {
    const deleteIcon = document.querySelectorAll('.completed .delete-note')
    deleteIcon.forEach(icon => {
        icon.addEventListener('click', function (e) {
            const li = icon.closest('li');
            const input = li.querySelector('input').value;
            const indexOfInput = completeList.indexOf(input)
            li.remove()
            completeList.splice(indexOfInput, 1)
            localStorage.setItem('completed', JSON.stringify(completeList))
        })
    })
}


// get data of tasks form user
export const getCompleteData = function () {
    const inputs = document.querySelectorAll('.completed ul input');
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            completeList.push(input.value.trim());
            localStorage.setItem('completed', JSON.stringify(completeList))
            input.setAttribute('disabled', true);
            input.setAttribute('readonly', true)
            deletedCompletedTask()
        })
    })
}


// Edit Tasks
export const editTasks = function () {
    if (localStorage.getItem('completed') != null || localStorage.getItem('completed') !== []) {
        const editIcon = document.querySelector('.completed ul');
        editIcon.addEventListener('click', function (e) {

            const input = e.target.closest('li').querySelector('input');
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.focus();

            const indexOfEditData  = completeList.indexOf(input.value);
             
            if(indexOfEditData > -1) {
            input.addEventListener('change', function (e) {
                completeList[indexOfEditData] = e.target.value;
                localStorage.setItem('completed', JSON.stringify(completeList));
            })
        }
        })
    }
}