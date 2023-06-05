/* eslint-disable react/no-unescaped-entities */
import { useState, useRef, useEffect, useLayoutEffect } from "react"
import Select from "react-select"
import { Card, CardBody, CardHeader } from "reactstrap"
import { statusOption } from "../utils/data"
import { Edit, Trash2, X, Delete,AlertCircle } from "react-feather"
import image1 from "../assets/image/todolist.png"
import "./todolist.scss"

const TodoList = () => {
  const [todos, setTodos] = useState( localStorage.getItem("Todos")
  ? JSON.parse(localStorage.getItem("Todos"))
  : [])
  const [listRender,setListRender]=useState([])
  const [addTask,setAddTask]=useState(false)
  const [inputValue, setInputValue] = useState("")

  const [completeAll,setCompleteAll]=useState(false)
  const [modalClear,setModalClear]=useState(false)
  const [clearAll, setClearAll] = useState(false)

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTaskValue, setEditingTaskValue] = useState("")

  const inputRef = useRef(null)
  const inputAddTaskRef=useRef(null)

  const [selectedStatus, setSelectedStatus] = useState("null")

  let totalCompleted = Math.round(
    todos.reduce((acc, todo) => (todo.completed ? acc + 1 : acc), 0)
  )
  const openModal=()=>{
    setAddTask(!addTask)
  }
  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        task: inputValue,
        completed: false,
      }

      setTodos([...todos, newTodo])
      setInputValue("")
    }
  }

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id)
    setTodos(updatedTodos)
  }

  const handleStartEdit = (id, task) => {
    setEditingTaskId(id)
    setEditingTaskValue(task)
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditingTaskValue("")
  }

  const handleSaveEdit = (id) => {
    if (editingTaskValue.trim() !== "") {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            task: editingTaskValue,
          }
        }
        return todo
      })

      setTodos(updatedTodos)
      setEditingTaskId(null)
      setEditingTaskValue("")
    }
  }

  //Toggle complete
  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        }
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  //Complete All
  const handleCompleteAll = () => {
    const updatedTodos = todos.map((todo) => {
      return {
        ...todo,
        completed: !completeAll,
      }
    })
    setTodos(updatedTodos)
    setCompleteAll(!completeAll)
  }

  //tự động focus vào input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if(inputAddTaskRef.current){
      inputAddTaskRef.current.focus()
    }
  }, [editingTaskId,addTask])

  //Enter to add task
  const handleKeyDown = (event, id) => {
    if (event.key === "Enter" && id !== null) {
      handleSaveEdit(id)
    } else if (event.key === "Enter" && id === null) {
      handleAddTodo()
    }
  }

  //handle filter select
  const handleChangeStatus = (selected) => {
    setSelectedStatus(selected.value)
  }
  
  const handleClearComplete = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed)
    setTodos(updatedTodos)
  }

  const toggleClearAll=()=>{
    setModalClear(!modalClear)
  }
  const handleClearAll = () => {
    setClearAll(true);
    setModalClear(!modalClear)
    setTodos([]);
  }
  //Filter
  useEffect(() => {
    let listFilter = todos
    if (selectedStatus === "Incomplete") {
      listFilter = listFilter.filter((todo) => !todo.completed)
    } else if (selectedStatus === "Completed") {
      listFilter = listFilter.filter((todo) => todo.completed)
    }
    setListRender(listFilter)
    setClearAll(false)
  }, [selectedStatus, todos])
  

  //Local storage
  useLayoutEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos))
  }, [todos])

  return (
    <main>
      <div className="container">
      <div className="introduction">
        <div className="information">
          <h2>let's set up your live now</h2>
          <div className="work-progress">
            <div className="progress-complete" style={{width:clearAll?0:`${(totalCompleted/todos.length)*100}%`}}></div>
          </div>
          {(todos.length>0&&todos.length==totalCompleted)? <p>You have completed all the tasks</p>: 
          todos.length>0?<p>You have completed <b>{totalCompleted}</b> out of <b>{todos.length}</b> tasks</p>: <p>There are no tasks</p> }
        </div>
        <div className="imgTodoList">
          <img src={image1} alt="" />
        </div>
      </div>
      {
        <Card className="container-todolist">
          <CardHeader className="headerContainer">
            <div>
              <span onClick={handleCompleteAll} className={`circle ${completeAll===true?"done":""}`}><i className="fa-solid fa-check"></i></span>
            </div>
            <button className="btn clear" onClick={handleClearComplete}>
              <Delete size={18} />
              Clear Complete
            </button> 
            <button className="btn clear" onClick={toggleClearAll}>
              <Delete size={18} />
              Clear All
            </button>
            {modalClear&&<div className="modal-clearAll-overlay">
              <div className="modal-clearAll">
                <AlertCircle />
                <p>You definitely want to delete all the tasks</p>
                <button onClick={handleClearAll}>Clear All</button>
                <button onClick={toggleClearAll}>Cancel</button>
              </div> 
            </div>}
            <div >
              <Select
                classNamePrefix="react-select"
                placeholder={"Select Status"}
                options={statusOption}
                onChange={handleChangeStatus}
              />
            </div>
            <div className="addnewtask">
            <h4 onClick={openModal}>add task</h4>
            {addTask&&<div className="modal-overlay">
              <div className="modal-container">
                <h3>add new task</h3>
                <input
                type="text"
                value={inputValue}
                ref={inputAddTaskRef}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, null)}
                placeholder="Enter a new task"
                />
                <button className="btn" onClick={handleAddTodo}>Add</button>
                <X className="close-modal" onClick={openModal}/>  
              </div>
            </div>}
            </div>
          </CardHeader>
          <CardBody className="listTask">
            <ul>
              {listRender.map((todo) => (
                <li className={`task ${todo.completed===true?"done":""}`} key={todo.id}>
                  <span onClick={()=>handleToggleComplete(todo.id)} className={`circle ${todo.completed===true?"done":""}`}><i className="fa-solid fa-check"></i></span>
                  {editingTaskId === todo.id ? (
                    <>
                      <input
                        className="inputEdit"
                        type="text"
                        value={editingTaskValue}
                        onChange={(e) => setEditingTaskValue(e.target.value)}
                        ref={inputRef}
                        onKeyDown={(e) => handleKeyDown(e, todo.id)}
                      />
                      <button className="btn save" onClick={() => handleSaveEdit(todo.id)}>
                        Save
                      </button>
                      <button className="btn cancel" onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <div className="content" onClick={()=>handleToggleComplete(todo.id)}>{todo.task}</div>
                      <div className="action">
                      <button className="btn edit"
                        onClick={() => handleStartEdit(todo.id, todo.task)}>
                        <Edit size={18}/>
                      </button>
                      <button className="btn del" onClick={() => handleDeleteTodo(todo.id)}>
                        <Trash2 size={18}/>
                      </button></div> 
                    </>
                  )}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      }</div>
    </main>
  )
}

export default TodoList
    