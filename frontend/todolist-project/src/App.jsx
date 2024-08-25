import { useEffect, useState } from "react"
import ToDoTask from './components/ToDoTask'

export default function ToDoPage(){

  const [allTasks, setAllTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText,setErrorText] = useState('')
  const [charCount, setCharCount] = useState(0)

  useEffect(()=>{
    setCharCount(newTask.length)
  },[newTask])
  
  useEffect(()=>{
    setLoading(true)
    fetch('http://192.168.100.12:5000/todolist')
    .then(_ => _.json())
    .then(data => setAllTasks(data.data))
    .catch(err=> console.log(err))
    .finally(()=>setLoading(false))
  }, [])

  function moveTask(id, direction){
    const index = allTasks.findIndex(task => task._id === id)
    if(index < 0) return

    const newTasks = [...allTasks]
    const task = newTasks[index]

    if(index > 0 && direction === 'up'){
      newTasks[index] = newTasks[index - 1]
      newTasks[index - 1] = task
    }else if(index < allTasks.length - 1 && direction === 'down'){
      newTasks[index] = newTasks[index + 1]
      newTasks[index + 1] = task
    }

    setAllTasks(newTasks)

    const tasksForUpdate = newTasks.map((task,index)=>({_id: task._id, order:index}))
    
    fetch('http://192.168.100.12:5000/todolist/reorder',{
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({tasks: tasksForUpdate})
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        console.error('Failed to reorder tasks:', data.message);
      }
    })
    .catch(err => console.error('Error while reordering tasks:', err))
  }
  
  function taskMaker(){
    if(Array.isArray(allTasks) && allTasks.length > 0){
     return allTasks.map(task => (
      <ToDoTask key={task._id} task={task} moveTask={moveTask} setAllTasks={setAllTasks}/>
     ))
    }else{
      <p>No tasks found</p>
    }
  }

  function sendNewTask(taskName){
    showError()
    if(taskName !== null && taskName !== ''){
      if(taskName.length > 2 && taskName.length < 50){
        fetch('http://192.168.100.12:5000/todolist', {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            name: taskName
          })
        })
        .then(res => res.json())
        .then(res => {
          setAllTasks(c => [...c,res.data])
          setErrorText('')
        })
      } 
    }else{
      setErrorText('შეიყვანეთ დავალება')
    }
  }

  function showError(){
    if(newTask.length <3 || newTask.length > 50){
      setErrorText('ტექსტი უნდა იყოს 3 და 50 ასოს შორის')
    }else {
      setErrorText(''); 
    }
  }

  return<div>  
    {loading?
          <h1><b>Loading</b></h1>
        :
        <>
          <h1 className="header">დავალებების გასაკეთებელი სია</h1>
          <div className="task-add-container">
            <input type="text" placeholder="ჩაწერე დავალება" value={newTask} onChange={(e)=>{
              setNewTask(e.target.value)
              setCharCount(e.target.value.length)
            }} />
            <button onClick={() => {
              sendNewTask(newTask)
              setNewTask('')
            }}>დაამატე დავალება</button>
          </div>
          {newTask === ''?
            ''
            :
            <span className="base-letter-count">{charCount}</span>
          }
          <p style={{color:'red'}}>{errorText}</p>
          <div style={{marginTop: '50px'}}>
            {taskMaker()}
          </div>
        </>
      }
  </div>
}