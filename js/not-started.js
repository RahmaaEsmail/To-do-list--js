const addBtn = document.querySelector('.add-btn');
let notStartedList = [];
let drag = null;
const boxes = document.querySelectorAll('.to-do-list-container div');
const items = document.querySelectorAll('.to-do-list-container li');


// Show Tasks
export const addNewNote = function (data ='') {
    let html =
        `
       <li draggable="true" ><input type="text" value ="${data}" ><span><ion-icon name="pencil-outline" class="edit-note"></ion-icon> <ion-icon name="trash-outline" class="delete-note"></ion-icon></span></li>
    `
    addBtn.insertAdjacentHTML('beforebegin', html)
    // dragItems()
}


// Update Ui When reloding page
export const updateStartedUi = function() {
    if (localStorage.getItem('not-started') != null) {
        notStartedList = [...new Set(JSON.parse(localStorage.getItem('not-started')))]
        notStartedList.forEach(data => {
            addNewNote(data)
        })

        const existData = document.querySelectorAll('.not-started input');
        existData.forEach(dataInput => {
            dataInput.setAttribute('disabled', true);
            dataInput.setAttribute('readonly', true)
        })
    }

    dragItems()
}
updateStartedUi()


// Delete Specific Task
export function deletedStartedTask() {
    const deleteIcon = document.querySelectorAll('.not-started .delete-note')
    deleteIcon.forEach(icon => {
        icon.addEventListener('click', function (e) {
            const li = icon.closest('li');
            const input = li.querySelector('input').value;
            const indexOfInput = notStartedList.indexOf(input)
            li.remove()
            notStartedList.splice(indexOfInput, 1)
            localStorage.setItem('not-started', JSON.stringify(notStartedList))
        })
    })
}


// get data of tasks form user
export const getData = function() {
     const inputs = document.querySelectorAll('.not-started ul input');
     inputs.forEach(input=>{
        input.addEventListener('change',function(){
            notStartedList.push(input.value.trim());
            localStorage.setItem('not-started',JSON.stringify(notStartedList))
            input.setAttribute('disabled',true);
            input.setAttribute('readonly',true)
            deletedStartedTask()
        })
     })
}


// Edit Tasks
export const editTasks = function () {
    if (localStorage.getItem('not-started') != null || localStorage.getItem('not-started') !== []) {
    const editIcon = document.querySelector('.not-started ul');
    editIcon.addEventListener('click',function(e) {

        const input =  e.target.closest('li').querySelector('input');
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.focus();

        const indexOfEditData = notStartedList.indexOf(input.value);

        if (indexOfEditData > -1) {
        input.addEventListener('change',function(e) {
            notStartedList[indexOfEditData] = e.target.value;
            localStorage.setItem('not-started',JSON.stringify(notStartedList));
        })
    }
    }) 
}
}



export function dragItems () {
   items.forEach(item => {
       item.addEventListener('dragstart', function () {
        console.log(item);
           drag = item;
           item.style.opacity = 0.5;
       })
   })
}
dragItems()