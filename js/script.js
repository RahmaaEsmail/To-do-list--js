const addBtn = document.querySelectorAll('.add-note');
const startedBtn = document.querySelector('.add-btn');
const progressBtn = document.querySelector('.add-progress-btn');
const completedBtn = document.querySelector('.add-completed-btn');

let dataList = [];


const displayStoredData = function () {
    if (localStorage.getItem('dataList') != null) {
        dataList = JSON.parse(localStorage.getItem('dataList'));

        dataList.forEach(item => {
            const { list, data, id } = item;
            if (data && data !== '') {
                const btn = document.querySelector(`.${list}`).querySelector('.add-note')
                addDataToBoxes(btn, data)
            }
        })
    }
}


const disableInput = function () {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
    })
}

displayStoredData()
disableInput()

function addDataToBoxes(btn, dataValue = '') {
    const li = document.createElement('li');
    li.innerHTML = `<input type="text" value="${dataValue}"><span><ion-icon name="pencil-outline" class="edit-note"></ion-icon> <ion-icon name="trash-outline" class="delete-note"></ion-icon></span>`
    li.draggable = true;
    li.className = 'task';
    btn.insertAdjacentElement('beforebegin', li)

    deleteTasks(li)
    editTasks(li)
    dragTouch(li)
    dragMouse(li)
}

const displayData = function (e) {
    addDataToBoxes(e.target)
    const inputs = document.querySelectorAll('input');
    getUserData(inputs)
}

const getUserData = function (inputs) {
    inputs.forEach(input => {
        input.addEventListener('change', storeData)
    })
}

const storeData = function (e, data) {
    let closestDiv = e.target.closest('div').className;
    let id = Math.floor(e.timeStamp);

    dataList.push(
        {
            list: closestDiv,
            data: data || e.target.value,
            id: id
        });
    removeDuplicatesObjFromArray(dataList)
    e.target.disabled = true;
}

function removeDuplicatesObjFromArray(dataList) {
    const map = new Map();
    for (let data of dataList) {
        map.set(data['id'], data)
    }
    const iteratorValues = map.values()
    const uniqueData = [...iteratorValues]
    localStorage.setItem('dataList', JSON.stringify(uniqueData));
}

function deleteTasks(...li) {
    li.forEach(task => {
        task.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-note')) {
                dataList.forEach(data => {
                    if (data['data'] && data['id']) {
                        const index = dataList.indexOf(data)
                        dataList.splice(index, 1)
                        localStorage.setItem('dataList', JSON.stringify(dataList))
                        task.remove()
                    }
                })
            }
        })
    })
}

function editTasks(...li) {
    li.forEach(item => {
        item.addEventListener('click', function (e) {
            if (e.target.classList.contains('edit-note')) {
                const input = e.target.closest('li').querySelector('input')
                input.disabled = false;
                input.focus()

                const div = item.closest('div').className;

                dataList.forEach(data => {
                    if (data['list'] === div && data['data'] == input.value) {

                        input.addEventListener('change', function (e) {
                            data['data'] = input.value;
                            localStorage.setItem('dataList', JSON.stringify(dataList))
                            removeDuplicatesObjFromArray(dataList)
                            disableInput()
                        })

                    }
                })
            }
        })
    })
}



function dragMouse(...tasks) {
    const boxes = document.querySelectorAll('.to-do-list-container div');
    let closestStartDiv;
    let drag = null;

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

function dragMouseEnd(e) {
    const className = closestStartDiv.className;
    const input = drag.querySelector('input').value;
    e.target.style.opacity = 1;

    dataList.forEach(data => {
        if (data['list'] === className && data['data'] === input) {
            const index = dataList.indexOf(data);
            dataList.splice(index, 1)
            removeDuplicatesObjFromArray(dataList)
        }
    })
    drag = null;
}

function dragMouseOver(e) {
    e.preventDefault()
}

function dropMouse(e) {
    const btn = e.target.closest('div').querySelector('.add-note');
    const input = drag.querySelector('input').value
    btn.insertAdjacentElement('beforebegin', drag)
    storeData(e, input)
}



function dragTouch(...tasks) {
    let closestStartDiv, closestEndDiv, drag;
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
    e.stopPropagation()
    closestStartDiv = e.target.closest('div');
    // e.target.closest('li').classList.remove('drop_touch--end')
    // e.target.closest('li').classList.add('drop_touch--start')
    e.target.closest('li').style.position ='absolute';
    e.target.closest('li').style.opacity = 0.5;
    drag = e.target.closest('li').querySelector('input');
}

function dragTouchEnd(e) {
    e.stopPropagation()
    closestEndDiv = e.target.closest('div');
    // e.target.closest('li').classList.remove('drop_touch--start')
    e.target.closest('li').classList.add('drop_touch--end')
    e.target.closest('li').style.opacity = 1;

    if (closestStartDiv !== closestEndDiv) {
        dataList.forEach(data => {
            if (data['list'] === closestStartDiv.className && data['data'] === drag.value) {
                const index = dataList.indexOf(data);
                dataList.splice(index, 1)
                localStorage.setItem('dataList', JSON.stringify(dataList))
                removeDuplicatesObjFromArray(dataList)
            }
        })

        storeData(e, drag.value)
    }
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



// Event Listeners
addBtn.forEach(add => {
    add.addEventListener('click', displayData);
})
