const {Schema, model} = require('mongoose')

const toDoSchema = new Schema({
  name:{
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50
  },
  isDone:{
    type:Boolean,
    required:true,
    default:false
  },
  order:{
    type:Number,
    default: 0
  }
})

const ToDo = model('ToDo', toDoSchema)

module.exports = ToDo