// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = []; // Массив с нашими данными

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask); // Добавление задачи
tasksList.addEventListener('click', deleteTask); // Удаление задачи
tasksList.addEventListener('click', doneTask); // Отмечаем задачу завершенной

function addTask(event) {
  // Отменяем отправку формы
  event.preventDefault();

  // Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в массив с элементами
  tasks.push(newTask)

  renderTask(newTask);

  // Очищаем поле ввода и влзвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();
  checkEmptyList();
  saveToLocalSrorage(); // Сохраняем список задач в хранилище браузера LocalStorege
}

function deleteTask(event) {
  // Проверяем что клик не был по кнопке удалить задачу
  if (event.target.dataset.action !== 'delete') return;
    
    // closest ищет снаружи селектора
    const parenNode = event.target.closest('.list-group-item');

  // Определяем ID задачи
  const id = Number(parenNode.id);
  // Удаляем задачу из массива с задачами
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalSrorage(); // Сохраняем список задач в хранилище браузера LocalStorege

    // remove - удаляет выбранный элемент со страницы
    parenNode.remove();
    checkEmptyList();
    
}

function doneTask(event) {
  // Проверяем что клик был не по кнопке задача выролнена
  if(event.target.dataset.action !== 'done') return;

  // Проверяем что клик был по кнопке задача выполнена
    const parentNode = event.target.closest('.list-group-item');

  // определяем ID задачи
  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;
  saveToLocalSrorage(); // Сохраняем список задач в хранилище браузера LocalStorege

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if(tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
          <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
          <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }
  if(tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalSrorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  //  Формируем CSS класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title'; 

  // Формируем разметку для новой задачи
  const taskHTML = 
        `<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  // Добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}