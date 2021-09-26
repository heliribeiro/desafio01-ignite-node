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
    return response.status(404).json({	error: 'Mensagem do erro'})
  }
  request.user = user
  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username } = request.body
  const userExists = users.find(user => user.username === username)
  if(userExists) {
    return response.status(400).json({	error: 'Mensagem do erro'})
  } 
  const user = {
    id: v4(),
    name,
    username,
    todos: []
  }
  users.push(user)
  response.status(201).send(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request
  response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

   const {title, deadline } = request.body
   const {user} = request
   const id = v4()
  user.todos.push({
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })
   let todo = user.todos.find(todo => todo.id === id)
  return response.status(201).json(todo)
   
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
 
  const {title, deadline} = request.body
  const {id} = request.params
  const {user} = request

  // encontra a tarefa a ser alterada
  let todo = user.todos.find(todo => todo.id === id)
  if(!todo) {
    return response.status(404).json({error: 'Mensagem de erro'})
  }
  todo = {...todo, title, deadline}

  //Encontra o indice da tarefa, remove a tarefa antiga e adiciona a atual.
  let index  = user.todos.findIndex(todo=> todo.id === id)
  user.todos.splice(index,1, todo)

  return response.status(200).json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request
  const {id} = request.params
  
  let todo = user.todos.find(todo => todo.id === id)
  
  if(!todo) {
    return response.status(404).json({error: 'Mensagem de erro'})
  }
  todo = {...todo, done:true}

  //Encontra o indice da tarefa, remove a tarefa antiga e adiciona a atual.
  let index  = user.todos.findIndex(todo=> todo.id === id)
  user.todos.splice(index,1, todo)

  return response.status(200).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers
  const {id} = request.params
  const user = users.find(user => user.username === username)

  //Encontra o indice da tarefa e remove a tarefa.
  let index  = user.todos.findIndex(todo=> todo.id === id)
  if(index === -1) {
    return response.status(404).json({error: 'Mensagem de erro'})
  }
  user.todos.splice(index,1)

  return response.status(204).send()

});

module.exports = app;