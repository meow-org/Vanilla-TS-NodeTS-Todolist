document.addEventListener('DOMContentLoaded', () => {
  interface TODOS {
    id: string;
    todo: string;
  }

  let todoList = {};
  const url:string = 'http://127.0.0.1:5000';
  //get some dummy todos
  fetch(url).then((response)=>{return response.text();})
    .then(content => {
      let contentObj:TODOS = JSON.parse(content);
      console.log(content);
      console.log(contentObj);
      for (let [id,text] of Object.entries(contentObj)){
        const todo:HTMLElement = createTodo(id, text);
        todoList[id] = { text };
        container.appendChild(todo);
      }
      console.log(content);})
    .catch(() => console.log(`Can’t access ${url} response. Blocked by browser?`));

  //get some data
  fetch(url).then((response)=>{return response.text();})
    .then(text => console.log(text))
    .catch(() => console.log(`Can’t access ${url+'/data'} response. Blocked by browser?`));


  function createRandomId(this:void):string {
    return Math.random().toString(36).substring(2);
  }

  function createTodo(id:string, text:string):HTMLElement{
    const li:HTMLElement = document.createElement('li');
    li.setAttribute('id', `parent_${id}`);
    li.className = 'todo';
    li.innerHTML = `<span class="todo-text" data-id="${id}">${text}</span><button class="delete-todo" data-role="remove" data-id="${id}">x</button>`;
    return li
  }

  function onListClick(e : Event):void {
    const { dataset } = <HTMLTextAreaElement>e.target;
    if(dataset.role && dataset.role === "remove"){
      delete todoList[dataset.id];
      const element:HTMLElement = document.getElementById(`parent_${dataset.id}`);
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
      const id:string = createRandomId();
      const todo:HTMLElement = createTodo(id, text);
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
      todoList[dataset.id] = { text };
      e.target.contentEditable=false;
      e.target.addEventListener("keydown", changeTodoList );
      }
    };
    e.target.addEventListener("keydown", changeTodoList );
    console.log(todoList);
  }
  
  const input:HTMLElement = document.getElementById('todo-input');
  const container:HTMLElement = document.getElementById('todo-container');
  input.addEventListener("keydown", onInputKeyDown);
  container.addEventListener("click", onListClick);
  container.addEventListener("dblclick",onTodoDoubleClick);
  

  

})