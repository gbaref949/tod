import {useState , useReducer} from 'react'

const initalState = {category: [], task: [], details: ""}

const reducer = (state , action) => {
    const{type} = action
    switch(type){
        case 'ADD CATEGORY': {
            return{
                
            };
        }
        case 'ADD TASK': {
            return{
                
            };
        }
        case 'ADD DETAILS':{
            
        }
        default: return state
    }
    throw Error(`Invalid action ${type}`);
}

const TODO = () => {
  return (
    <>
    </>
  )
}

export default TODO