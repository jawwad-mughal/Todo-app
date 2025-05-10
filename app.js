var firebaseConfig = {
  apiKey: "AIzaSyAUPNXiuM-1JGmLXmL4n5_C3rQFoTkIOak",
  authDomain: "todo-app-31a3a.firebaseapp.com",
  databaseURL: "https://todo-app-31a3a-default-rtdb.firebaseio.com",
  projectId: "todo-app-31a3a",
  storageBucket: "todo-app-31a3a.firebasestorage.app",
  messagingSenderId: "439277951180",
  appId: "1:439277951180:web:1c732ded1b962764cb8a69"
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);

firebase.database().ref("todos").on("child_added", function (data) {
    var todo = data.val();
    console.log(todo);

    var li = document.createElement("li");
    li.className =
      "todo-item flex items-center justify-between p-3 bg-neutral-300 rounded-lg";

    var textSpan = document.createElement("span");
    textSpan.textContent = todo.todo_value;
    textSpan.className = "text-gray-800";
    if (todo.completed) {
      textSpan.className += " line-through text-gray-500";
    }

    var buttonsDiv = document.createElement("div");
    buttonsDiv.className = "flex gap-2";

    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "text-blue-500 hover:text-blue-600";
    editBtn.setAttribute("id", todo.id);
    editBtn.onclick = () => EditSingleTodo(editBtn);

    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "text-red-500 hover:text-red-600";
    deleteBtn.setAttribute("id", todo.id);
    deleteBtn.onclick = () => deleteSingleTodo(deleteBtn);

    buttonsDiv.append(editBtn, deleteBtn);
    li.append(textSpan, buttonsDiv);
    document.getElementById("items_data").appendChild(li);
});

function addTodo() {
    var todoInput = document.getElementById("todoInput");
    var todoText = todoInput.value.trim();
    console.log("addTodo called, todoText:", todoText);

    if (todoText === "") {
      alert("No task entered! Please enter a task.");
      return;
    }

    var id = firebase.database().ref("todos").push().key;
    var obj = {
      todo_value: todoText,
      id: id,
      completed: false,
    };

    firebase.database().ref(`todos/${id}`).set(obj);
    todoInput.value = "";
}

function deleteSingleTodo(element) {
    if (confirm("Are you sure you want to delete this task?")) {
      element.parentNode.parentNode.remove();
      firebase.database().ref(`todos/${element.id}`).remove();
    }
}

function EditSingleTodo(element) {
    var li = element.parentNode.parentNode;
    var textSpan = li.querySelector("span");
    var newText = prompt("Edit Task:", textSpan.textContent);

    if (newText !== null && newText.trim() !== "") {
      newText = newText.trim();
      textSpan.textContent = newText;
      textSpan.className = "text-gray-800";
      var obj = {
        todo_value: newText,
        id: element.id,
        completed: false,
      };
      firebase.database().ref(`todos/${element.id}`).set(obj);
    } else if (newText !== null && newText.trim() === "") {
      alert("Task cannot be empty!");
    }
}

function deleteAllTodos() {
    var itemsData = document.getElementById("items_data");
    var taskCount = itemsData.getElementsByTagName("li").length;

    if (taskCount === 0) {
      alert("No tasks! Please enter a task.");
      return;
    }

    if (confirm("Are you sure you want to delete all tasks? You won't be able to revert this!")) {
      document.getElementById("items_data").innerHTML = "";
      firebase.database().ref("todos").remove();
      alert("All tasks have been deleted.");
    }
}

function completeAllTodos() {
    var itemsData = document.getElementById("items_data");
    var taskCount = itemsData.getElementsByTagName("li").length;

    if (taskCount === 0) {
      alert("No tasks! Please enter a task.");
      return;
    }

    firebase.database().ref("todos").once("value", (snapshot) => {
      var updates = {};
      snapshot.forEach((child) => {
        updates[`todos/${child.key}/completed`] = true;
      });
      firebase.database().ref().update(updates);
    });

    var tasks = itemsData.getElementsByTagName("li");
    for (let task of tasks) {
      var textSpan = task.querySelector("span");
      textSpan.className = "text-gray-800 line-through text-gray-500";
    }

    alert("All tasks completed!");
}

var todoInput = document.getElementById("todoInput");
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      console.log("Enter pressed, input value:", todoInput.value);
      addTodo();
    }
});










































