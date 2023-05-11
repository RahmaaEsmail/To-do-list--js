const addProgressBtn = document.querySelector('.add-progress-btn');
let ProgressList = [];

// Show Tasks
export const addProgressNote = function (data ='') {
    let html =
        `
       <li draggable="true" ><input type="text" contentEditable="false" value ="${data}" ><span><ion-icon name="pencil-outline" class="edit-note"></ion-icon> <ion-icon name="trash-outline" class="delete-note"></ion-icon></span></li>
    `
    addProgressBtn.insertAdjacentHTML('beforebegin', html)
}

// Update Ui When reloding page
export const updateProgressUi = function() {
    if (localStorage.getItem('in-progress') != null) {
        ProgressList = [...new Set(JSON.parse(localStorage.getItem('in-progress')))]

        ProgressList.forEach(data => {
            addProgressNote(data.trim())
        })
        
        const existData = document.querySelectorAll('.in-progress input');
        existData.forEach(dataInput => {
            dataInput.setAttribute('disabled', true);
            dataInput.setAttribute('readonly', true)
        })
    }
}
updateProgressUi()


// Delete Specific Task
export function deletedProgressTask() {
    const deleteIcon = document.querySelectorAll('.in-progress .delete-note')
    deleteIcon.forEach(icon => {
        icon.addEventListener('click', function (e) {
            const li = icon.closest('li');
            const input = li.querySelector('input').value;
            const indexOfInput = ProgressList.indexOf(input)
            li.remove()
            ProgressList.splice(indexOfInput,1)
            localStorage.setItem('in-progress', JSON.stringify(ProgressList))
        })
    })
}


// get data of tasks form user
export const getProgressData = function () {
    const inputs = document.querySelectorAll('.in-progress ul input');
    inputs.forEach(input => {
        input.addEventListener('change', function () {
            ProgressList.push(input.value.trim());
            localStorage.setItem('in-progress', JSON.stringify(ProgressList))
            input.setAttribute('disabled', true);
            input.setAttribute('readonly', true)
            deletedProgressTask()
        })
    })
}


// Edit Tasks

    export const editTasks = function () {
        if (localStorage.getItem('in-progress') != null || localStorage.getItem('in-progress') !== []) {  
        const editIcon = document.querySelector('.in-progress ul');
        editIcon.addEventListener('click', function (e) {

            const input = e.target.closest('li').querySelector('input');
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.focus();

            const indexOfEditData = ProgressList.indexOf(input.value);

            if (indexOfEditData > -1) {
            input.addEventListener('change', function (e) {
                ProgressList[indexOfEditData] = e.target.value;
                localStorage.setItem('in-progress', JSON.stringify(ProgressList));
            })
        }
        })
    }
}
