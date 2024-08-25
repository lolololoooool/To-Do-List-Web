const ToDo = require('../models/todo.model')

async function getAll(req,res){
  try {
    const toDoArray = await ToDo.find().sort({order:1})
    res.status(200).json({
      success:true,
      message:'found all',
      data: toDoArray
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      message:`error while loading array`,
      data: error.message
    })
  }
}

async function reorderTasks(req,res){

  try {
    const {tasks} = req.body

    if(!Array.isArray(tasks)){
      res.status(400).json({
        success:false,
        message:'Tasks must be an array'
      })
    }

    const updateTasks = tasks.map(async (task) =>{
      await ToDo.findByIdAndUpdate(task._id, {order: task.order}, {new:true})
    })

    await Promise.all(updateTasks)

    res.status(200).json({
      success:true,
      message:'succesfully reordered tasks'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      data: error.message,
    })
  }
}

async function addToDo(req,res){
  try {
    const {name, isDone} = req.body
    const toDoArray = await ToDo.find()
    const newToDo = new ToDo({name, isDone, order: toDoArray.length})
    await newToDo.save()

    res.status(201).json({
      success:true,
      message:'Succesfully created ToDo',
      data: newToDo
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      message:`error while adding to array`,
      data: error.message
    })
  }
}

async function findToDo(req,res){
  try {
    const {id} = req.params
    const foundToDo = await ToDo.findById(id)

    if(foundToDo){
      res.status(200).json({
        success:true,
        message:'Succesfully found ToDo',
        data: foundToDo
      })
    }else{
      res.status(404).json({
        success:false,
        message:`Cannot find ToDo due to wrong ID`,
      })
    }
  } catch (error) {
    res.status(400).json({
      success:false,
      message:`error while finding ToDo`,
      data: error.message
    })
  }
}

async function removeToDo(req,res){
  try {
    const {id} = req.params
    const foundToDo = await ToDo.findByIdAndDelete(id)

    if(foundToDo){
      res.status(200).json({
        success:true,
        message:'Succesfully removed ToDo'
      })
    }else{
      res.status(404).json({
        success:false,
        message:`Cannot find ToDo due to wrong ID`,
      })
    }
  } catch (error) {
    res.status(400).json({
      success:false,
      message:`error while finding ToDo`,
      data: error.message
    })
  }
}

async function editToDo(req,res){
  try {
    const {id} = req.params
    const {name, isDone, order} = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const foundToDo = await ToDo.findById(id)
    
    if(foundToDo){
      foundToDo.name = name
      foundToDo.isDone = isDone
      foundToDo.order = order !== undefined ? order : foundToDo.order
      await foundToDo.save()

      res.status(200).json({
        success:true,
        message:'succesfully changed ToDo'
      })
    }else{
      res.status(404).json({
        success:false,
        message:`Cannot find ToDo due to wrong ID`,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      data: error.message,
    })
  }
}

module.exports = {getAll, addToDo,findToDo,removeToDo,editToDo, reorderTasks}