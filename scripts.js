"use strict";

var form = document.querySelector("form");
var input = form.querySelector("input");
var taskId = 0;
var taskList = document.querySelector(".list-group");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var inputValue = input.value;
  if (inputValue.length > 0) {
    addTask(inputValue);
  }
  input.value = "";
});


function addTask(inputValue) {
  taskId++;
  var taskIdText = "task" + taskId;
  var html = `
    <div class="col-lg-12">
      <div class="input-group">
        <span class="input-group-addon">
          <input type="checkbox">
        </span>
        <div class="form-control">${inputValue}</div>
        <span class="input-group-btn">
          <button class="btn btn-secondary delete" type="button"></button>
        </span>
      </div>
    </div>
  `;

  var li = document.createElement("li");
  li.innerHTML = html;
  li.setAttribute("id", taskIdText);
  taskList.appendChild(li);

  var checkbox = li.querySelector("input");
  var taskItem = li.querySelector(".form-control");
  checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
      taskItem.classList.add("active");
    } else {
      taskItem.classList.remove("active");
    }
  });

  var deleteBtn = li.querySelector(".delete");
  deleteBtn.addEventListener("click", function() {
    showYesNoModal(
      "Are you sure you want to delete this unfulfilled promise?",
      function() {
        removeTask(taskIdText);
      }
    );
  });

  var taskObj = {
    taskState: checkbox.value,
    taskText: inputValue
  };

  var serialObj = JSON.stringify(taskObj);
  localStorage.setItem("taskId", serialObj);
}

function removeTask(id) {
  var task = document.getElementById(id);
  taskList.removeChild(task);
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