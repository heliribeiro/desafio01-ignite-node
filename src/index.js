const express = require('express');
const cors = require('cors');
const { v4: uuidv4, v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers
  const user = users.find(user => user.username === username)
  if(!user) {
    return response.json({error: 'User does not exists.'})
  }
  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username } = request.body
  const user = {
    id: v4(),
    name,
    username,
    todos: []
  }
  users.push(user)
  response.status(200).send(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers
  const todos = users.find(user => user.username === username).todos
  response.json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
   const {username} = request.headers
   const {title, deadline } = request.body
   const user = users.find(user => user.username === username)
  user.todos.push({
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })
  return response.json(user)
   
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers
  const {title, deadline} = request.body
  const {id} = request.params
  const user = users.find(user => user.username === username)

  // encontra a tarefa a ser alterada
  let todo = user.todos.find(todo => todo.id === id)
  todo = {...todo, title, deadline}

  //Encontra o indice da tarefa, remove a tarefa antiga e adiciona a atual.
  let index  = user.todos.findIndex(todo=> todo.id === id)
  user.todos.splice(index,1, todo)

  return response.json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers
  const {id} = request.params
  const user = users.find(user => user.username === username)
  let todo = user.todos.find(todo => todo.id === id)
  todo = {...todo, done:true}

  //Encontra o indice da tarefa, remove a tarefa antiga e adiciona a atual.
  let index  = user.todos.findIndex(todo=> todo.id === id)
  user.todos.splice(index,1, todo)

  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;