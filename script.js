// script.js

document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDueDate = document.getElementById('todo-due-date');
    const todoPriority = document.getElementById('todo-priority');
    const todoCategory = document.getElementById('todo-category');
    const todoDescription = document.getElementById('todo-description');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const filterPriority = document.getElementById('filter-priority');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    let draggedElement = null;

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const saveDarkMode = () => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    };

    const toggleDarkMode = () => {
        darkMode = !darkMode;
        saveDarkMode();
        renderTheme();
    };

    const renderTheme = () => {
        if (darkMode) {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        }
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.setAttribute('draggable', true);
            li.addEventListener('dragstart', () => draggedElement = li);
            li.addEventListener('dragover', (e) => e.preventDefault());
            li.addEventListener('drop', () => {
                const draggedIndex = Array.from(todoList.children).indexOf(draggedElement);
                todos.splice(index, 0, todos.splice(draggedIndex, 1)[0]);
                saveTodos();
                renderTodos();
            });
            if (todo.completed) li.classList.add('completed');

            const span = document.createElement('span');
            span.textContent = todo.text;
            li.appendChild(span);

            const details = document.createElement('div');
            details.classList.add('details');

            const dueDate = document.createElement('span');
            dueDate.textContent = `Due: ${todo.dueDate}`;
            details.appendChild(dueDate);

            const priority = document.createElement('span');
            priority.textContent = `Priority: ${todo.priority}`;
            details.appendChild(priority);

            const category = document.createElement('span');
            category.textContent = `Category: ${todo.category}`;
            details.appendChild(category);

            li.appendChild(details);

            const actions = document.createElement('div');
            actions.classList.add('actions');

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete');
            completeButton.onclick = () => completeTodo(index);
            actions.appendChild(completeButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit');
            editButton.onclick = () => editTodo(index);
            actions.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteTodo(index);
            actions.appendChild(deleteButton);

            li.appendChild(actions);
            todoList.appendChild(li);
        });
    };

    const addTodo = (text, dueDate, priority, category, description) => {
        todos.push({ text, dueDate, priority, category, description, completed: false });
        saveTodos();
        renderTodos();
    };

    const deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    const editTodo = (index) => {
        const newText = prompt('Edit task:', todos[index].text);
        if (newText !== null) {
            todos[index].text = newText;
            todos[index].dueDate = prompt('Edit due date:', todos[index].dueDate) || todos[index].dueDate;
            todos[index].priority = prompt('Edit priority:', todos[index].priority) || todos[index].priority;
            todos[index].category = prompt('Edit category:', todos[index].category) || todos[index].category;
            todos[index].description = prompt('Edit description:', todos[index].description) || todos[index].description;
            saveTodos();
            renderTodos();
        }
    };

    const completeTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    };

    const filterTodos = () => {
        const searchText = searchInput.value.toLowerCase();
        const priority = filterPriority.value;

        todoList.innerHTML = '';
        todos
            .filter(todo => {
                const matchesSearchText = todo.text.toLowerCase().includes(searchText);
                const matchesPriority = priority === 'all' || todo.priority === priority;
                return matchesSearchText && matchesPriority;
            })
            .forEach((todo, index) => {
                const li = document.createElement('li');
                li.setAttribute('draggable', true);
                li.addEventListener('dragstart', () => draggedElement = li);
                li.addEventListener('dragover', (e) => e.preventDefault());
                li.addEventListener('drop', () => {
                    const draggedIndex = Array.from(todoList.children).indexOf(draggedElement);
                    todos.splice(index, 0, todos.splice(draggedIndex, 1)[0]);
                    saveTodos();
                    renderTodos();
                });
                if (todo.completed) li.classList.add('completed');

                const span = document.createElement('span');
                span.textContent = todo.text;
                li.appendChild(span);

                const details = document.createElement('div');
                details.classList.add('details');

                const dueDate = document.createElement('span');
                dueDate.textContent = `Due: ${todo.dueDate}`;
                details.appendChild(dueDate);

                const priority = document.createElement('span');
                priority.textContent = `Priority: ${todo.priority}`;
                details.appendChild(priority);

                const category = document.createElement('span');
                category.textContent = `Category: ${todo.category}`;
                details.appendChild(category);

                li.appendChild(details);

                const actions = document.createElement('div');
                actions.classList.add('actions');

                const completeButton = document.createElement('button');
                completeButton.textContent = 'Complete';
                completeButton.classList.add('complete');
                completeButton.onclick = () => completeTodo(index);
                actions.appendChild(completeButton);

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit');
                editButton.onclick = () => editTodo(index);
                actions.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete');
                deleteButton.onclick = () => deleteTodo(index);
                actions.appendChild(deleteButton);

                li.appendChild(actions);
                todoList.appendChild(li);
            });
    };

    todoForm.onsubmit = (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        const dueDate = todoDueDate.value;
        const priority = todoPriority.value;
        const category = todoCategory.value.trim();
        const description = todoDescription.value.trim();

        if (text !== '') {
            addTodo(text, dueDate, priority, category, description);
            todoInput.value = '';
            todoDueDate.value = '';
            todoPriority.value = 'low';
            todoCategory.value = '';
            todoDescription.value = '';
        }
    };

    searchInput.oninput = filterTodos;
    filterPriority.onchange = filterTodos;
    toggleThemeButton.onclick = toggleDarkMode;

    renderTodos();
    renderTheme();
});
