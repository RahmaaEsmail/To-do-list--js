'use strict';
const addTasksBtn = document.querySelectorAll('.add-note');
const addNotStartedTaskBtn = document.querySelector('.add-btn');
const addProgressTaskBtn = document.querySelector('.add-progress-btn');
const addCompletedTaskBtn = document.querySelector('.add-completed-btn');
const boxes = document.querySelectorAll('.to-do-list-container div');
let closestStartDiv, closestEndDiv;
let drag = null;
let timer;
let dataList = [];

getDataFromStorage()
disableInput()

function init(li) {
    selectDeleteIcon(li)
    selectEditIcon(li)
    dragTouch(li)
    dragMouse(li)
}

function getDataFromStorage() {
    if (localStorage.getItem('dataList') != null && localStorage.getItem('dataList') != []) {
        dataList = JSON.parse(localStorage.getItem('dataList'));
        removeDuplicatesObjFromArray(dataList)
        displayStoredData(dataList)
    }
}

function displayStoredData(dataList) {
    dataList.forEach(item => {
        const { list, data, id } = item;
        if (data && data !== '') {
            const divList = document.querySelector(`.${list}`)
            const btn = divList.querySelector('.add-note')
            createNewElement(btn, data)
        }
    })

}

function disableInput() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
    })
}

function enableInputs(input) {
    input.disabled = false;
    input.focus()
}

function createNewElement(btn, dataValue = '') {
    const li = document.createElement('li');
    li.innerHTML = `<input type="text" value="${dataValue}"><span><ion-icon name="pencil-outline" class="edit-note"></ion-icon> <ion-icon name="trash-outline" class="delete-note"></ion-icon></span>`
    li.draggable = true;
    li.className = 'task';
    btn.insertAdjacentElement('beforebegin', li)

    init(li)
}

const addDataToBoxes = function (e) {
    createNewElement(e.target)
    const inputs = document.querySelectorAll('input');
    getUserData(inputs)
}

const getUserData = function (inputs) {
    inputs.forEach(input => {
        input.addEventListener('change', storeDataToStorage)
    })
}

const storeDataToStorage = function (e, data = '') {
    let closestDiv
    if (e.target.closest('div')) {
        closestDiv = e.target.closest('div').className;
    }
    let id = Math.floor(Date.now());
    dataList.push(
        {
            list: closestDiv,
            data: data || e.target.value,
            id: id
        });

    removeDuplicatesObjFromArray(dataList)
    disableInput()
}

function removeDuplicatesObjFromArray(dataList) {
    const map = new Map();
    for (let data of dataList) {
        map.set(data['data'], data)
    }
    const iteratorValues = map.values()
    const uniqueData = [...iteratorValues]
    localStorage.setItem('dataList', JSON.stringify(uniqueData));
}



function selectDeleteIcon(...li) {
    li.forEach(task => {
        task.addEventListener('click', (e) => {
            let input = task.querySelector('input')
            if (e.target.classList.contains('delete-note'))
                deleteTask(input, e)
        })
    })
}

function deleteTask(input, e) {
    dataList = dataList.filter(data => data['data'] !== input.value)
    localStorage.setItem('dataList', JSON.stringify(dataList))
    e.target.closest('li').remove()
}



function selectEditIcon(...li) {
    li.forEach(item => {
        item.addEventListener('click', function (e) {
            const div = item.closest('div').className;
            if (e.target.classList.contains('edit-note')) {
                const input = e.target.closest('li').querySelector('input')
                enableInputs(input)
                editTask(div, input)
            }
        })
    })
}

function editTask(div, input) {
    dataList.forEach(data => {
        if (data['list'] === div && data['data'] == input.value) {
            input.addEventListener('change', function (e) {
                data['data'] = input.value;
                removeDuplicatesObjFromArray(dataList)
                disableInput()
            })
        }
    })
}


function dragMouse(...tasks) {
    tasks.forEach(task => {
        task.addEventListener('dragstart', dragMouseStart)
    })

    tasks.forEach(task => {
        task.addEventListener('dragend', dragMouseEnd)
    })

    boxes.forEach(box => {
        box.addEventListener('dragover', dragMouseOver)
    })

    boxes.forEach(box => {
        box.addEventListener('drop', dropMouse.bind(this))
    })
}

function dragMouseStart(e) {
    e.target.style.opacity = 0.5;
    e.dataTransfer.effectAllowed = 'move';
    drag = e.target;
    closestStartDiv = drag.closest('div')
}

function dragMouseOver(e) {
    e.preventDefault()
}

function dragMouseEnd(e) {
    e.target.style.opacity = 1;
    drag = null;
}

function dropMouse(e) {
    const btn = e.target.closest('div').querySelector('.add-note');
    const input = drag.querySelector('input').value
    btn.insertAdjacentElement('beforebegin', drag)
    storeDataToStorage(e, input)
}




function dragTouch(...tasks) {
    tasks.forEach(task => {
        task.addEventListener('touchstart', dragTouchStart)
    })

    tasks.forEach(task => {
        task.addEventListener('touchend', dragTouchEnd)
    })

    tasks.forEach(task => {
        task.addEventListener('touchmove', dragTouchMove)
    })
}

function dragTouchStart(e) {
    closestStartDiv = e.target.closest('div');
    let li = e.target.className === 'task' ? e.target : e.target.closest('li')
    drag = e.target.closest('li').querySelector('input');

    timer = setTimeout(() => {
        li.classList.remove('drop_touch--end')
        li.classList.add('drop_touch--start')
    }, 300)
}

function dragTouchMove(e) {
    e.preventDefault()
    if (e.target.closest('li').getAttribute('draggable')) {
        const li = e.target.closest('li');
        li.style.top = `${e.target.clientY}px`;

        const ourEle = document.elementsFromPoint(
            e.touches[0].clientX,
            e.touches[0].clientY,
        )

        ourEle.forEach(ele => {
            if (ele.className === 'not-started' || ele.className === 'in-progress' || ele.className === 'completed') {
                let btn = ele.querySelector('.add-note');
                btn.insertAdjacentElement('beforebegin', li)
            }
        })

    }
}

function dragTouchEnd(e) {
    closestEndDiv = e.target.closest('div');
    let li = e.target.className === 'task' ? e.target : e.target.closest('li')

    if (timer) {
        clearTimeout(timer)
    }
    li.classList.remove('drop_touch--start')
    li.classList.add('drop_touch--end')

    if (closestStartDiv !== closestEndDiv) {
        editTask(e, drag)
        storeDataToStorage(e, drag.value)
    }
}


addTasksBtn.forEach(add => {
    add.addEventListener('click', addDataToBoxes);
})