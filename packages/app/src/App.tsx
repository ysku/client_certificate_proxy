import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [message, setMessage] = useState('api not called');

  useEffect(() => {
    fetch('https://localhost:8080/api/example').then(res => {
      res.json().then(data => {
        if (data.message) {
          setMessage(data.message)
        } else {
          console.error(data)
        }
      }).catch(e => {
        console.error(e)
      })
    }).catch(e => {
      console.error(e)
    })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
