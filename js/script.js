const addBtn = document.querySelector('.add-btn');
const addProgressBtn = document.querySelector('.add-progress-btn');
const addCompletedBtn = document.querySelector('.add-completed-btn')


import * as notStartedTasks from './not-started.js';
import * as progressTasks from './in-progress.js';
import * as completedTasks from './completed.js';

addBtn.addEventListener('click',function(){
    notStartedTasks.addNewNote()
    notStartedTasks.getData()

   
})

addProgressBtn.addEventListener('click',function(){
    progressTasks.addProgressNote()
    progressTasks.getProgressData()
})

addCompletedBtn.addEventListener('click',function(){
    completedTasks.addCompleteNote()
    completedTasks.getCompleteData()
})

// notStartedTasks.dragItems()
notStartedTasks.editTasks()
notStartedTasks.deletedStartedTask()

progressTasks.editTasks()
progressTasks.deletedProgressTask()

completedTasks.editTasks()
completedTasks.deletedCompletedTask()



const boxes = document.querySelectorAll('.to-do-list-container div');
const items = document.querySelectorAll('.to-do-list-container li');
let drag = null;
console.log(boxes);
console.log(items);
function dragFun() {

    items.forEach(item => {
        item.addEventListener('dragstart', function () {
            console.log(item);
            drag = item;
            item.style.opacity = 0.5;
        })
    })


    items.forEach(item => {
        item.addEventListener('dragend', function () {
            console.log(item);
            drag = null;
            item.style.opacity = 1;
        })
    })

    boxes.forEach(box => {
        box.addEventListener('dragover',function(e){
            e.preventDefault();
        })

        box.addEventListener('drop', function () {
            // box.insertAdjacentHTML('beforebegin', drag)
        })
    })
}

dragFun()