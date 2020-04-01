document.addEventListener('DOMContentLoaded', () => {
  interface TODOS {
    _id: string;
    todo: string;
  }

  let todoList = {};
  const url:string = 'http://127.0.0.1:5000';
  //get some todos
  fetch(url, {method:'GET'}).then((response)=>{return response.text();})
    .then(content => {
      let contentObj:TODOS = JSON.parse(content);
      console.log(contentObj);
      for (let [id,text] of Object.entries(contentObj)){
        console.log(`the id is ${id} and the todo is ${text} - that's what we were passing to createTodo function`);
        const todo:HTMLElement = createTodo(text._id, text.todo);
        todoList[id] = { text };
        container.appendChild(todo);
      }
    })
    .catch(() => console.log(`Can’t access ${url} response. Blocked by browser?`));

  function fetchPostTodo(newTodo:TODOS):void{
    fetch(url,{method:'POST',    headers: {'Content-Type': 'application/json',}, body:JSON.stringify(newTodo)})
    .then(data => console.log(data));
    console.log(newTodo);
    console.log(JSON.stringify(newTodo));
  }

  function fetchDeleteTodo(idTodoDelete:string):void{
    //sends to backend string with ID of todo which should be deleted
    fetch(url,{method:'DELETE',    headers: {'Content-Type': 'text/plain',}, body:String(idTodoDelete)})
    .then(data => console.log(data));
  }

  function fetchUpdateTodo(id:string,text:string):void{
    let modifiedTodo:TODOS = {_id: id, todo: text};
    fetch(url,{method:'PATCH',    headers: {'Content-Type': 'application/json',}, body:JSON.stringify(modifiedTodo)})
    .then(data => console.log(data));
  }
  

  function createRandomId(this:void):string {
    return Math.random().toString(36).substring(2);
  }

  function createTodo(id:string, text:string, fetchIt:boolean=false):HTMLElement{
    const li:HTMLElement = document.createElement('li');
    li.setAttribute('id', `parent_${id}`);
    li.className = 'todo';
    li.innerHTML = `<span class="todo-text" data-id="${id}">${text}</span><button class="delete-todo" data-role="remove" data-id="${id}">x</button>`;
    let newTodo:TODOS = {_id: id, todo: text};
    if(fetchIt){fetchPostTodo(newTodo);};
    return li
  }

  function onListClick(e : Event):void {
    const { dataset } = <HTMLTextAreaElement>e.target;
    if(dataset.role && dataset.role === "remove"){
      delete todoList[dataset.id];//or ._id???
      fetchDeleteTodo(dataset.id);//possible mistakes with id can be expected!
      const element:HTMLElement = document.getElementById(`parent_${dataset.id}`); // or ._id??
      fadeOut(element).then(()=>{element.remove()});
      }
  }

  function fadeOut(element:HTMLElement, msTotal:number = 300, msStep:number = 30, msFadeMultiplier:number = 0.9){
    return new Promise((resolve) => {
      const opacity : number = getComputedStyle(element).opacity as any as number;
      console.log(opacity);
      element.style.opacity = opacity as any as string;
      let interval = setInterval(()=>{element.style.opacity = String(Number(element.style.opacity) * msFadeMultiplier);},msStep) //assign and delete!!!
      let timer = setTimeout(()=>{clearTimeout(timer);clearInterval(interval);},msTotal);  
      resolve();
    });
  }

  function onInputKeyDown(e:KeyboardEvent):void {
    const text:string = String( (<HTMLInputElement>e.target).value);
    if(String((<KeyboardEvent>e).code) === "Enter" && text){
      const id:string = createRandomId(); //or ._id?
      const todo:HTMLElement = createTodo(id, text, true);
      todoList[id] = { text };
      container.appendChild(todo);
      (<HTMLInputElement>e.target).value = "";
    }
  }
  
  function onTodoDoubleClick(e):void{
    e.target.contentEditable = true;
    const changeTodoList = (input) => {if(input.code === "Enter"){
      const { dataset } = <HTMLTextAreaElement>e.target;
      const text:string = e.target.innerText;
      todoList[dataset.id] = { text }; //or ._id??
      fetchUpdateTodo(dataset.id,text);
      e.target.contentEditable=false;
      e.target.addEventListener("keydown", changeTodoList );
      }
    };
    e.target.addEventListener("keydown", changeTodoList );//????most likely we need to remove eventlistener
    console.log(todoList);
  }
  
  const input:HTMLElement = document.getElementById('todo-input');
  const container:HTMLElement = document.getElementById('todo-container');
  input.addEventListener("keydown", onInputKeyDown);
  container.addEventListener("click", onListClick);
  container.addEventListener("dblclick",onTodoDoubleClick);
  

  

})