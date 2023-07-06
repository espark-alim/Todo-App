// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnjK5hEzEz6MGohwccwKdH30FT6o_sDr4",
  authDomain: "todo-app-68297.firebaseapp.com",
  projectId: "todo-app-68297",
  storageBucket: "todo-app-68297.appspot.com",
  messagingSenderId: "994477430121",
  appId: "1:994477430121:web:8987e661dd3b98f7e2d9f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.onload = function () {
  renderTodos();
};

const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");

// Add a new todo
function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText !== "") {
    const reference = ref(database, "todos");
    const todoId = push(reference).key;

    const todoRef = ref(database, `todos/${todoId}`);

    const todo = {
      id: todoId,
      text: todoText,
    };

    set(todoRef, todo);

    todoInput.value = "";

    renderTodos();
  }
}

// Update a todo
function updateTodo() {
  const todoId = todoInput.getAttribute("data-id");

  update(ref(database, `todos/${todoId}`), {
    id: todoId,
    text: todoInput.value.trim(),
  }).then(() => {
    todoInput.value = "";

    todoInput.removeAttribute("data-id");
    updateBtn.style.display = "none";
    addBtn.style.display = "inline-block";

    renderTodos();
  });
}

// Delete a todo
function deleteTodo(id) {
  remove(ref(database, `todos/${id}`));

  renderTodos();
}

// Edit a todo
function editTodo(id) {
  updateBtn.style.display = "inline-block";
  addBtn.style.display = "none";

  get(ref(database, `todos/${id}`)).then((todo) => {
    const todoInObj = todo.val();

    todoInput.value = todoInObj.text;

    todoInput.setAttribute("data-id", todoInObj.id);

    renderTodos();
  });
}

// Render the todo list
function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  const todosRef = ref(database, "todos");

  onValue(todosRef, (snapshot) => {
    const todos = snapshot.val();

    if (todos === null || typeof todos !== "object") {
      // Handle case when there are no todos or the data is not an object
      console.log("No todos found.");
      return;
    }

    Object.values(todos).forEach((todo) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item my-2 d-flex align-items-center"
      listItem.textContent = todo.text;

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger mx-2";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));

      const editButton = document.createElement("button");
      editButton.className = "btn btn-warning mx-1"
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editTodo(todo.id));

      listItem.appendChild(deleteButton);
      listItem.appendChild(editButton);

      todoList.appendChild(listItem);
    });
  });
}

// Attach event listeners
addBtn.addEventListener("click", addTodo);
updateBtn.addEventListener("click", updateTodo);
