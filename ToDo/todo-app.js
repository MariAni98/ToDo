(function () {
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener("input", function (e) {
      e.preventDefault();
      if (input.value.length > 0) {
        button.disabled = false;
      } else if (input.value.length === 0) {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name, done) {
    let item = document.createElement("li");

    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    doneButton.dataset.name = name;
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";
    deleteButton.dataset.name = name;

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    if (done === true) {
      item.classList.add("list-group-item-success");
    }

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(container, title, currentList) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    let todoItemsDefault = [];

    if (localStorage.getItem(title) != undefined) {
      todoItemsDefault = JSON.parse(localStorage.getItem(title));
    }

    for (let elem of currentList) {
      let todoItems = createTodoItem(elem.name);

      todoItems.doneButton.addEventListener("click", function () {
        if (elem.name == this.dataset.name) {
          todoItems.item.classList.toggle("list-group-item-success");
        }
      });

      todoItems.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItems.item.remove();
        }
      });

      if (elem.done === true) {
        todoItems.item.classList.toggle("list-group-item-success");
      }

      todoList.append(todoItems.item);
    }

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    for (let todoItem of todoItemsDefault) {
      let todoItemElem = createTodoItem(todoItem.name, todoItem.done);

      todoItemElem.doneButton.addEventListener("click", function () {
        if (todoItem.name == this.dataset.name) {
          todoItemElem.item.classList.toggle("list-group-item-success");
          let index = todoItemsDefault.indexOf(todoItem);
          todoItemsDefault[index].done = todoItem.done ? false : true;
          localStorage.setItem(title, JSON.stringify(todoItemsDefault));
        }
      });

      todoItemElem.deleteButton.addEventListener("click", function () {
        if (todoItem.name == this.dataset.name && confirm("Вы уверены?")) {
          todoItemElem.item.remove();
          todoItemsDefault.splice(todoItemsDefault.indexOf(todoItem), 1);
          localStorage.setItem(title, JSON.stringify(todoItemsDefault));
        }
      });

      todoList.append(todoItemElem.item);
    }

    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function ret(e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      todoItemsDefault.push({
        name: todoItemForm.input.value,
        done: false,
      });

      localStorage.setItem(title, JSON.stringify(todoItemsDefault));

      let todoItem = createTodoItem(todoItemForm.input.value);

      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");
      });

      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItem.item.remove();
        }
      });

      todoList.append(todoItem.item);

      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
