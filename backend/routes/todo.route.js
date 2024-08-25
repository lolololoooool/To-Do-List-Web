const {Router} = require('express')
const {getAll, addToDo,findToDo,removeToDo,editToDo, reorderTasks} = require('../controllers/todo.controller')

const toDoRoute = Router()

toDoRoute.get('/', getAll)
toDoRoute.post('/', addToDo)
toDoRoute.put('/reorder', reorderTasks)
toDoRoute.get('/:id', findToDo)
toDoRoute.delete('/:id', removeToDo)
toDoRoute.put('/:id', editToDo)

module.exports = toDoRoute