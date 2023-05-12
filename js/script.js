const addNoteBtn = document.querySelectorAll('.add-note');
const startedBtn = document.querySelector('.add-btn');
const progressBtn = document.querySelector('.add-progress-btn');
const completedBtn = document.querySelector('.add-completed-btn');
let drag = null;

let dataListStarted = [];
let dataListProgress = [];
let dataListCompleted = [];

addNoteBtn.forEach(addBtn => {
    addBtn.addEventListener('click', (e) => {
        const closeInput = e.target.closest('div');
        if (closeInput.classList.contains('not-started')) {
            let btn = closeInput.querySelector('.add-note')
            displayData(btn)
            getUserData(closeInput, 'not-started', dataListStarted)

        }

        if (closeInput.classList.contains('in-progress')) {
            let btn = closeInput.querySelector('.add-note')
            displayData(btn)
            getUserData(closeInput, 'in-progress', dataListProgress)
        }

        if (closeInput.classList.contains('completed')) {
            let btn = closeInput.querySelector('.add-note')
            displayData(btn)
            getUserData(closeInput, 'completed', dataListCompleted)
        }
    })
})

// Display Data on screen
const displayData = function (btn, data = '') {
    let li =
        `
   <li class="task" draggable="true" ><input type="text" value="${data}"><span><ion-icon name="pencil-outline" class="edit-note"></ion-icon> <ion-icon name="trash-outline" class="delete-note"></ion-icon></span></li>
   `
    btn.insertAdjacentHTML('beforebegin', li)
    // // draggablee()
    // draggableMouse()
    // draggableTouch()
}


// Show Existing Data in localstorage
function updateStartedUi() {
    if (localStorage.getItem('not-started') != null) {
        dataListStarted = [...new Set(JSON.parse(localStorage.getItem('not-started')))]
    }

    dataListStarted.forEach(data => {
        displayData(startedBtn, data)
    })
}

function updateProgressUi() {
    if (localStorage.getItem('in-progress') != null) {
        dataListProgress = [...new Set(JSON.parse(localStorage.getItem('in-progress')))]
    }

    dataListProgress.forEach(data => {
        displayData(progressBtn, data)
    })
}

function updateCompletedUi() {
    if (localStorage.getItem('completed') != null) {
        dataListCompleted = [...new Set(JSON.parse(localStorage.getItem('completed')))]
    }

    dataListCompleted.forEach(data => {
        displayData(completedBtn, data)
    })
}

const updateUi = function () {
    if (updateCompletedUi() || updateProgressUi() || updateStartedUi()) {
        updateCompletedUi()
        updateProgressUi()
        updateStartedUi()
    }

    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => {
        input.setAttribute('disabled', 'true')
    })
}
updateUi()



// Get Value from input
function getUserData(closeInput, inputName, dataListName) {
    let inputs = closeInput.querySelectorAll('input')
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {

            dataListName.push(input.value)
            localStorage.setItem(inputName, JSON.stringify(dataListName))
            input.setAttribute('disabled', 'true')
        })
    })
}

// Delete Task
function deleteProcess(e, listType, storageName) {
    const li = e.target.closest('li');
    const input = li.querySelector('input').value;
    const index = listType.indexOf(input)
    li.remove()
    listType.splice(index, 1)
    localStorage.setItem(storageName, JSON.stringify(listType))
}

const deleteTasks = function () {
    let notes = document.querySelectorAll('.delete-note')
    notes.forEach(note => {
        note.addEventListener('click', function (e) {
            let div = e.target.closest('div')
            if (div.classList.contains('not-started'))
                deleteProcess(e, dataListStarted, 'not-started')

            if (div.classList.contains('in-progress'))
                deleteProcess(e, dataListProgress, 'in-progress')

            if (div.classList.contains('completed'))
                deleteProcess(e, dataListCompleted, 'completed')
        })
    })
}
deleteTasks()



// Drag & Drop Mouse Element
function draggableMouse() {
    let li = document.querySelectorAll('li');
    let boxes = document.querySelectorAll('.to-do-list-container div')
    let closeDiv;

    // Element that dragged
    li.forEach(item => {
        item.addEventListener('dragstart', function (e) {
            closeDiv = e.target.closest('div');
            drag = item;
            item.style.opacity = 0.5;
            e.dataTransfer.effectAllowed = 'move';
        })

        item.addEventListener('dragend', function (e) {
            if(e.dataTransfer.dropEffect != 'none') {
                let input = drag.querySelector('input').value;
                if(closeDiv.className =='not-started') 
                    removedDraggedEle(dataListStarted, input, 'not-started')
                

                if (closeDiv.className == 'in-progress') 
                    removedDraggedEle(dataListProgress, input, 'in-progress')
                

                if (closeDiv.className == 'completed') 
                    removedDraggedEle(dataListCompleted, input, 'completed')

            }
            drag = null;
            item.style.opacity = 1;
        })
    })

    // box in which drop happend
    boxes.forEach(box => {
        box.addEventListener('dragover', (e) => {
                e.preventDefault()
        })

        box.addEventListener('drop', (e) => {
            e.preventDefault()
            box.querySelector('.add-note').insertAdjacentElement('beforebegin', drag)

            if (box.className == 'not-started')
                dropElement(drag, dataListStarted, 'not-started')


            if (box.className == 'in-progress')
                dropElement(drag, dataListProgress, 'in-progress')


            if (box.className == 'completed')
                dropElement(drag, dataListCompleted, 'completed')

        })

    })
}

function dropElement(dragEle, listType, storageName) {
    let input = dragEle.querySelector('input')
    listType.push(input.value)
    localStorage.setItem(storageName, JSON.stringify(listType))
}

function removedDraggedEle (listType,input,storageName) {
    let index = listType.indexOf(input);
    listType.splice(index, 1)
    localStorage.setItem(storageName, JSON.stringify(listType))
}

function draggableTouch() {
    const li = document.querySelectorAll('.task');
    let closeStartDiv , closeEndDiv , drag;
    li.forEach(item => { 
        deleteTasks()
        item.addEventListener('touchstart',(e)=>{
            closeStartDiv = item.closest('div');
            console.log(closeStartDiv);
            item.style.position ='absolute';
            item.style.width='250px'
            item.style.opacity = 0.5;
           })
        })
    

    li.forEach(item => {

        item.addEventListener('touchend', (e) => {
            closeEndDiv = item.closest('div');
            if(closeStartDiv.className  !== closeEndDiv.className) {
                let input = item.querySelector('input');
                if(closeStartDiv.className === 'not-started') {
                   let index = dataListStarted.indexOf(input.value);
                   dataListStarted.splice(index,1)
                   localStorage.setItem('not-started',JSON.stringify(dataListStarted))
                }
            }
            console.log(closeEndDiv);
            e.preventDefault()
            item.style.position = 'relative';
            item.style.width = 'auto'
            item.style.top = 'auto';
            item.style.left= 'auto'
            item.style.opacity = 1;
        })
    })

    li.forEach(item => {
        item.addEventListener('touchmove', (e) => {
            e.preventDefault()
            if(item.getAttribute('draggable')) {
                item.style.top =`${e.touches[0].clientY - item.offsetHeight /2}px`
                item.style.left = `${e.touches[0].clientX - item.offsetWidth / 2}px`
            }

            let ourEle = document.elementsFromPoint(
                e.touches[0].clientX,
                e.touches[0].clientY
            )

            ourEle.forEach(element => {
               if(element.className ==='not-started' && element.className != closeStartDiv.className) {
                   const taskBtn = element.querySelector('.add-note');
                   taskBtn.insertAdjacentElement('beforebegin', item) 
                   const input = element.querySelector('input')
                   dataListStarted.push(input.value)
                   localStorage.setItem('not-started',JSON.stringify(dataListStarted))
                
               }
                if (element.className === 'in-progress' && element.className != closeStartDiv.className) {
                    
                    const taskBtn = element.querySelector('.add-note');
                    taskBtn.insertAdjacentElement('beforebegin',item) 
                    const input = element.querySelector('input')
                    dataListProgress.push(input.value)
                    localStorage.setItem('in-progress', JSON.stringify(dataListProgress))
                }
                if (element.className === 'completed' && element.className != closeStartDiv.className) {

                    const taskBtn = element.querySelector('.add-note');
                    taskBtn.insertAdjacentElement('beforebegin', item) 
                    const input = element.querySelector('input')
                    dataListCompleted.push(input.value)
                    localStorage.setItem('completed', JSON.stringify(dataListCompleted))
                }
            })
        })
    })
}
// Edit Tasks
function editProcess(storageName, listType, input) {

    const indexOfEditData = listType.indexOf(input.value);
    if (indexOfEditData > -1) {
        input.addEventListener('change', function (e) {
            listType[indexOfEditData] = e.target.value;
            localStorage.setItem(storageName, JSON.stringify(listType))
        })
    }

}

function editTasks() {
    const editIcon = document.querySelectorAll('.edit-note');
    editIcon.forEach(edit => {
        edit.addEventListener('click', function (e) {
            let divClass = e.target.closest('div').className;
            let closeInput = e.target.closest('li').querySelector('input');
            closeInput.removeAttribute('disabled')
            closeInput.focus()


            if (divClass === 'not-started') {
                editProcess('not-started', dataListStarted, closeInput)
            }

            if (divClass === 'in-progress') {
                editProcess('in-progress', dataListProgress, closeInput)
            }

            if (divClass === 'completed') {
                editProcess('completed', dataListCompleted, closeInput)
            }
        })
    })
}

editTasks()

const details = navigator.userAgent;
let regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
  draggableTouch()
} else {
  draggableMouse()
}

