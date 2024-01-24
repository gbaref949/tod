import { useReducer, useState, useEffect } from 'react';

const initialState = {
  ADD_TODO:'add_todo',
  EDIT_TODO:'edit_todo',
  DELETE_TODO:'delete_todo'
}

function reducer(todos, action){
    switch(action.type){
        case initialState.ADD_TODO:
            return[...todos, newTodo(action.payload.name)]
        
        case initialState.EDIT_TODO:
            return todos.map(todo=>{
                if(todo.id === action.payload.id){
                    return{...todo, complete: !todo.complete}
                }
                return todo
            })
        case initialState.DELETE_TODO:
            return todos.filter(todo=> todo.id !== action.payload.id)   
            
        default:
           return todos    
    }
       

}

function newTodo(name){
    return{id:Date.now(), name:name, complete:false }
}

function Todo({ todo,dispatch }) {
    return (
        <div className="todo" >
            <div style={{color : todo.complete ? "#00008B" : "#fff"}} className="todo__title">{todo.name}</div>
            <div className="todo__buttons">
                <button className="todo__edit" onClick= {()=> {dispatch({type:initialState.EDIT_TODO, payload:{id:todo.id}})}}>
                    Edit
                </button>
                <button className="todo__delete"onClick= {()=> {dispatch({type:initialState.DELETE_TODO, payload:{id:todo.id}})}}>
                    Delete
                </button>

            </div>

            

            
        </div>
    )
}

const TODO = () => {
  const [todos, dispatch] = useReducer(reducer, [])
    const [name, setName] = useState('')

    function handleSubmit(e){
        e.preventDefault()
        dispatch({type:initialState.ADD_TODO, payload:{name:name}})
        setName('')
        
    }
    console.log(todos)



    return (
        <div className="todos">
            <div className='todos__content'>
                <h2>Todo Checklist</h2>
                <div className="todos__forms">
                    <form className="todos__form" onSubmit={handleSubmit} >
                        <input  className="todos__input" value={name} placeholder="Add todo" onChange={e => setName(e.target.value)} />
                    </form>

                    <button className='todos__add__btn' onClick={handleSubmit}>
                        Create
                    </button>

                </div>
                <div className="todos__todo">
                    {todos.map(todo =>{
                        return <Todo Key={todo.id} todo={todo} dispatch={dispatch} /> 
                    })}
                </div>
            </div>
        </div>
    )
}

export default TODO;