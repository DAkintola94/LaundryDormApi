import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(5);

function increment(){
setCount(nextValue => nextValue + 1)
}

function decrement(){
  setCount(previousValue => previousValue - 1)
}
  return (
    <>
      <button onClick={increment}> +</button>
      <span> {count} </span>
      <button onClick={decrement}> - </button>
      <div>Hei der</div>
      </>
  )
}

export default App
