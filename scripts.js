"use strict";

var form = document.querySelector("form");
var input = form.querySelector("input");
var taskList = document.querySelector(".list-group");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var inputValue = input.value;
  if (inputValue.length > 0) {
    addTask(createTaskId(), inputValue, false);
  }
  input.value = "";
});


function addTask(taskId, taskDesc, isCompleted) {
  var checkedString = isCompleted ? "checked" : "";
  var html = `
    <div class="col-lg-12">
      <div class="input-group">
        <span class="input-group-addon">
          <input type="checkbox" ${checkedString}>
        </span>
        <div class="form-control">${taskDesc}</div>
        <span class="input-group-btn">
          <button class="btn btn-secondary delete" type="button"></button>
        </span>
      </div>
    </div>
  `;

  var li = document.createElement("li");
  li.innerHTML = html;
  li.setAttribute("id", taskId);
  taskList.appendChild(li);

  var checkbox = li.querySelector("input");
  var taskItem = li.querySelector(".form-control");
  function updActiveState () {
    if (checkbox.checked) {
      taskItem.classList.add("active");
    } else {
      taskItem.classList.remove("active");
    }
  }
  checkbox.addEventListener("change", updActiveState);
  updActiveState();

  var deleteBtn = li.querySelector(".delete");

  deleteBtn.addEventListener("click", function() {
    var modalText = "";
    if (checkbox.checked) {
      modalText = "Are you sure you want to delete this promise forever?";
    } else {
      modalText = "Are you sure you want to delete this unfulfilled promise?";
    }

    showYesNoModal(
      modalText,
      function() {
        removeTask(taskIdText);
      }
    );
  });

  var serialObj = JSON.stringify(getTaskState(taskId));
  localStorage.setItem(taskId, serialObj);
}

function removeTask(id) {
  var task = document.getElementById(id);
  taskList.removeChild(task);
}

function getTaskState (taskId) {
  var task = document.getElementById(taskId);
  var taskText = task.querySelector(".form-control").innerHTML;
  var taskCheckbox = task.querySelector("input");

  var taskObj = {
    taskId: taskId,
    isCompleted: taskCheckbox.checked,
    text: taskText
  };

  return taskObj;
}

var taskIdCounter = 0;

function createTaskId () {
  taskIdCounter++;
  return "task" + taskIdCounter;
}

function showYesNoModal(text, yesCallback, noCallback) {
  var html = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <p>${text}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Yeah, sure!</button>
          <button type="button" class="btn btn-secondary">No, not now</button>
        </div>
      </div>
    </div>
  `;
  var modal = document.createElement("div");
  modal.innerHTML = html;
  modal.classList.add("modal");
  var container = document.querySelector(".container");
  container.appendChild(modal);

  var yesBtn = modal.querySelector(".btn-primary");
  var noBtn = modal.querySelector(".btn-secondary");

  yesBtn.addEventListener("click", function () {
    container.removeChild(modal);
    yesCallback();
  });

  noBtn.addEventListener("click", function () {
    container.removeChild(modal);
    if (noCallback) {
      noCallback();
    }
  });
}