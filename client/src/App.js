import './App.css';
import Notes from './components/Notes'
import Login from './components/Login'

// import axios from 'axios'
import { useEffect, useState } from 'react';
// useEffect

function App() {
  const [isLogin, setIsLogin] = useState(false);

  //we have to make verify route for cheack of authentication token
  const checkLogin = async () => {
    const token = localStorage.getItem('tokenStore');
    if (token) {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  }
  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <div className="App">
      {isLogin ? <Notes setIsLogin={setIsLogin} /> : <Login setIsLogin={setIsLogin} />}

    </div>
  );
}

export default App;
