import { useEffect, useState } from "react"

export default function ToDoTask({task, moveTask, setAllTasks}){

  const [isEditing, setIsEditing] = useState(false)
  const [newTaskName, setNewTaskName] = useState(task.name)
  const [isDone, setIsDone] = useState(task.isDone)
  const [errorText, setErrorText] = useState('')
  const [charCount, setCharCount] = useState(0)

  useEffect(()=>{
    setCharCount(newTaskName.length)
  },[newTaskName])

  function saveEditedTask(isDoneVar){
    
    fetch(`http://localhost:5000/todolist/${task._id}`,{
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        name: newTaskName,
        isDone: isDoneVar
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success){
        const updatedTask = { ...task, name: newTaskName, isDone: isDoneVar }
        setAllTasks(prevTasks =>
          prevTasks.map(t => (t._id === updatedTask._id ? updatedTask : t))
        )
        setIsEditing(false)
        setErrorText('')
      }else{
        showError()
        console.error('Failed to update task: ' + data.message)
      }
    })
    .catch(err => console.error('error while updating task: '+ err))
  }

  function deleteTask(){
    fetch(`http://localhost:5000/todolist/${task._id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() =>{
      setAllTasks(prevTasks => prevTasks.filter(t => t._id !== task._id))
    })
  }

  useEffect(()=>{
    if(!isEditing){
      saveEditedTask(isDone)
    }
  }, [isDone])

  function moveUp(){
    moveTask(task._id, 'up')
  }

  function moveDown(){
    moveTask(task._id, 'down')
  }

  function showError(){
    if(newTaskName.length <3 || newTaskName.length > 50 && isEditing === true){
      setErrorText('TASK MUST BE BETWEEN 3 AND 50 LETTERS')
    }else {
      setErrorText(''); 
    }
  }

  return(
    <>
      <div className="task-container">
        <p>
          {isEditing ?
            <>
              <input value={newTaskName} onChange={(e) => {
                setNewTaskName(e.target.value)
                setCharCount(e.target.value.length)
              }}/>
              <span className="letter-count">{charCount}</span>
            </>
            :
            <span style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <span className= {isDone? 'line-through' : 'line-not-through'} >{task.name}</span>
              <button className="mark-button" onClick={() => setIsDone(c => !c)}>{isDone? '➖' : '➕'}</button>
            </span> 
          }
        </p>
        
        <div className="buttons-div">
          {
            isEditing ?
              <button onClick={() => {
                saveEditedTask(false)
                setIsDone(false)
              }}>💾</button>
            :
              <button onClick={() => setIsEditing(true)}>📝</button>
          }
          <button onClick={() => deleteTask()}>✖️</button>
        </div>
        <div className="arrow-buttons-div">
          <button onClick={()=> moveUp()}>⬆️</button>
          <button onClick={()=> moveDown()}>⬇️</button>
        </div>
      </div>
      <p style={{color:'red'}}>{errorText}</p>
    </>
  )
}