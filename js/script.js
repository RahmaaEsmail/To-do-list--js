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
        dataListStarted = [...new Set(dataListStarted)]
    }

    dataListStarted.forEach(data => {
        displayData(startedBtn, data)
    })
}

function updateProgressUi() {
    if (localStorage.getItem('in-progress') != null) {
        dataListProgress = [...new Set(JSON.parse(localStorage.getItem('in-progress')))]
        dataListProgress = [...new Set(dataListProgress)]
    }

    dataListProgress.forEach(data => {
        displayData(progressBtn, data)
    })
}

function updateCompletedUi() {
    if (localStorage.getItem('completed') != null) {
        dataListCompleted = [...new Set(JSON.parse(localStorage.getItem('completed')))]
        dataListCompleted = [...new Set(dataListCompleted)]
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
            localStorage.setItem(inputName, JSON.stringify([...new Set(dataListName)]))
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
    localStorage.setItem(storageName, JSON.stringify([...new Set(listType)]))
}

function removedDraggedEle (listType,input,storageName) {
    let index = listType.indexOf(input);
    listType.splice(index, 1)
    localStorage.setItem(storageName, JSON.stringify([...new Set(listType)]))
}



function draggableTouch() {
    const li = document.querySelectorAll('.task input');
    let drag = false
    let closeLi , closeStartDiv , closeEndDiv;
    li.forEach(item => {
        item.addEventListener('touchstart',(e)=>{
            drag = true;
            closeLi = e.target.closest('li');
            closeStartDiv = closeLi.closest('div')
           
            closeLi.style.position = 'absolute';
            closeLi.style.opacity = 0.5;
        })
    })


    li.forEach(item => {
        item.addEventListener('touchend', (e) => {
            closeLi = e.target.closest('li');
            closeEndDiv = closeLi.closest('div')
            closeLi.style.position = 'relative';
            closeLi.style.top = 'auto';
            closeLi.style.left = 'auto';
            closeLi.style.width = 'auto'
            closeLi.style.opacity = 1;
            drag = false;

        if(!drag) {
                if(closeStartDiv.className === 'not-started') {
                    dataListStarted =  [...new Set(dataListStarted)]
                    const index = dataListStarted.indexOf(item.value);
                    dataListStarted.splice(index,1)

                    localStorage.setItem('not-started', JSON.stringify([...new Set(dataListStarted)]))
                }


                if (closeStartDiv.className === 'in-progress') {
                    const index = [... new Set(dataListProgress)].indexOf(item.value);
                    dataListProgress = [...new Set(dataListProgress)]
                    console.log(dataListProgress);
                    dataListProgress.splice(index, 1)
                    console.log(dataListProgress);
                    localStorage.setItem('in-progress', JSON.stringify([...new Set(dataListProgress)]))
                }

                if (closeStartDiv.className === 'completed') {
                    drag = false;
                    dataListCompleted = [...new Set(dataListCompleted)]
                    console.log(dataListCompleted);
                    const index = dataListCompleted.indexOf(item.value);
                    console.log(dataListCompleted);
                    dataListCompleted.splice(index,1)
                    console.log(dataListCompleted);
                    localStorage.setItem('completed', JSON.stringify([...new Set(dataListCompleted)]))
                }
            }
        })
    })
    

    li.forEach(item => {
        item.addEventListener('touchmove', (e) => {
            e.preventDefault()
            if(closeLi.getAttribute('draggable')) {
            closeLi = e.target.closest('li');
            closeLi.style.top = `${e.target.offsetHeight}px`;
            closeLi.style.width = '300px';

            
            const ourEle = document.elementsFromPoint(
                e.touches[0].clientX,
                e.touches[0].clientY,
            )

            ourEle.forEach(ele => {
               
                if(ele.className == 'in-progress' ) {
                    const taskBtn = ele.querySelector('.add-note');
                    taskBtn.insertAdjacentElement('beforebegin', closeLi)
                    dataListProgress.push(item.value)
                    localStorage.setItem('in-progress', JSON.stringify([...new Set(dataListProgress)]))
                    
                }

                if (ele.className == 'not-started') {
                    const taskBtn = ele.querySelector('.add-note');
                    taskBtn.insertAdjacentElement('beforebegin', closeLi)
                    dataListStarted.push(item.value)
                    localStorage.setItem('not-started', JSON.stringify([...new Set(dataListStarted)]))

                }

                if (ele.className == 'completed') {
                    const taskBtn = ele.querySelector('.add-note');
                    taskBtn.insertAdjacentElement('beforebegin', closeLi)
                    dataListCompleted.push(item.value)
                    localStorage.setItem('completed', JSON.stringify([...new Set(dataListCompleted)]))

                }
            })}
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

draggableMouse()
draggableTouch()
