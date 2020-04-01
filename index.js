document.addEventListener('DOMContentLoaded', function () {
    var todoList = {};
    var url = 'http://127.0.0.1:5000';
    //get some todos
    fetch(url, { method: 'GET' }).then(function (response) { return response.text(); })
        .then(function (content) {
        var contentObj = JSON.parse(content);
        console.log(contentObj);
        for (var _i = 0, _a = Object.entries(contentObj); _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], text = _b[1];
            console.log("the id is " + id + " and the todo is " + text + " - that's what we were passing to createTodo function");
            var todo = createTodo(text._id, text.todo);
            todoList[id] = { text: text };
            container.appendChild(todo);
        }
    })["catch"](function () { return console.log("Can\u2019t access " + url + " response. Blocked by browser?"); });
    function fetchPostTodo(newTodo) {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo) })
            .then(function (data) { return console.log(data); });
        console.log(newTodo);
        console.log(JSON.stringify(newTodo));
    }
    function fetchDeleteTodo(idTodoDelete) {
        //sends to backend string with ID of todo which should be deleted
        fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'text/plain' }, body: String(idTodoDelete) })
            .then(function (data) { return console.log(data); });
    }
    function fetchUpdateTodo(id, text) {
        var modifiedTodo = { _id: id, todo: text };
        fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(modifiedTodo) })
            .then(function (data) { return console.log(data); });
    }
    function createRandomId() {
        return Math.random().toString(36).substring(2);
    }
    function createTodo(id, text, fetchIt) {
        if (fetchIt === void 0) { fetchIt = false; }
        var li = document.createElement('li');
        li.setAttribute('id', "parent_" + id);
        li.className = 'todo';
        li.innerHTML = "<span class=\"todo-text\" data-id=\"" + id + "\">" + text + "</span><button class=\"delete-todo\" data-role=\"remove\" data-id=\"" + id + "\">x</button>";
        var newTodo = { _id: id, todo: text };
        if (fetchIt) {
            fetchPostTodo(newTodo);
        }
        ;
        return li;
    }
    function onListClick(e) {
        var dataset = e.target.dataset;
        if (dataset.role && dataset.role === "remove") {
            delete todoList[dataset.id]; //or ._id???
            fetchDeleteTodo(dataset.id); //possible mistakes with id can be expected!
            var element_1 = document.getElementById("parent_" + dataset.id); // or ._id??
            fadeOut(element_1).then(function () { element_1.remove(); });
        }
    }
    function fadeOut(element, msTotal, msStep, msFadeMultiplier) {
        if (msTotal === void 0) { msTotal = 300; }
        if (msStep === void 0) { msStep = 30; }
        if (msFadeMultiplier === void 0) { msFadeMultiplier = 0.9; }
        return new Promise(function (resolve) {
            var opacity = getComputedStyle(element).opacity;
            console.log(opacity);
            element.style.opacity = opacity;
            var interval = setInterval(function () { element.style.opacity = String(Number(element.style.opacity) * msFadeMultiplier); }, msStep); //assign and delete!!!
            var timer = setTimeout(function () { clearTimeout(timer); clearInterval(interval); }, msTotal);
            resolve();
        });
    }
    function onInputKeyDown(e) {
        var text = String(e.target.value);
        if (String(e.code) === "Enter" && text) {
            var id = createRandomId(); //or ._id?
            var todo = createTodo(id, text, true);
            todoList[id] = { text: text };
            container.appendChild(todo);
            e.target.value = "";
        }
    }
    function onTodoDoubleClick(e) {
        e.target.contentEditable = true;
        var changeTodoList = function (input) {
            if (input.code === "Enter") {
                var dataset = e.target.dataset;
                var text = e.target.innerText;
                todoList[dataset.id] = { text: text }; //or ._id??
                fetchUpdateTodo(dataset.id, text);
                e.target.contentEditable = false;
                e.target.addEventListener("keydown", changeTodoList);
            }
        };
        e.target.addEventListener("keydown", changeTodoList); //????most likely we need to remove eventlistener
        console.log(todoList);
    }
    var input = document.getElementById('todo-input');
    var container = document.getElementById('todo-container');
    input.addEventListener("keydown", onInputKeyDown);
    container.addEventListener("click", onListClick);
    container.addEventListener("dblclick", onTodoDoubleClick);
});
