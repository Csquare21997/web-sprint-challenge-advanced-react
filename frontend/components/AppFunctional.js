import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [index, setIndex] = useState (initialIndex)
  const [message,setMessage]= useState (initialMessage)
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    let row 
    if (index < 3){
      row = 1
    }else if (index < 6){
      row = 2
    }else if (index < 9) {
      row = 3
    }
    const col = index % 3 +1
    
    return {row, col} 
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {

    const {row, col} = getXY()
    return `Coordinates(${col},${row})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }
  

  function reset() {
    setIndex(initialIndex)
    setEmail(initialEmail)
    setMessage(initialMessage)
    setSteps(initialSteps)
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    const col = index%3
    let updateindex = index
    switch (direction) {
      case "up":
        return index < 3 ? index : index-3
   
      case "down":
        return index > 5 ? index : index +3 ;

      case "left":
       if(col > 0) {updateindex = index - 1
       }
       return updateindex

      case "right":
        if(col < 2) {updateindex = index + 1
        }
        return updateindex

    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    const direction = evt.target.id
    const newindex = getNextIndex(direction)
    if (newindex !== index ){
      setIndex(newindex)
       setSteps(presteps => presteps + 1)
      setMessage('')
    }else {
      setMessage(`You can't go ${direction}`)
    }
    return newindex
    
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    setEmail(evt.target.value)
    console.log(email)
    
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault();

    const {row, col} = getXY()  
    

    let message 
    axios.post ('http://localhost:9000/api/result',{email,steps,x:col,y:row})
    .then ((res)=>{
      message = res.data.message
    })
    .catch((err)=>{
      message = err.response.data.message
    })
    .finally(()=>{
      setMessage(message)
      setEmail(initialEmail)
    })
    
  
    // Use a POST request to send a payload to the server.
  }


  
  
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1? 'time': 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move}id="right">RIGHT</button>
        <button onClick={move}id="down">DOWN</button>
        <button onClick={reset}id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" onChange = {onChange} placeholder="type email" value = {email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
