const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const toDoRoute = require('./routes/todo.route')
app.use('/todolist', toDoRoute)

const PORT = process.env.PORT || 5000
const CONNECTION_STRING = process.env.CONNECTION_STRING

async function runner(){
  try {
    await mongoose.connect(CONNECTION_STRING)
    console.log('db connection established')
    app.listen(PORT, "192.168.100.12", () =>{
      console.log(`listening on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

runner()