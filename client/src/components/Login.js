import React, { useState } from "react";
import axios from 'axios'
import Spinner from './Spinner'

const Login = ({setIsLogin}) => {
  const [user, setUser] = useState({name: "",email: "",password: ""});
  const [err, setErr] = useState('');
  const [onLogin,setOnLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const style = {
    visibility : onLogin ? "visible" :"hidden",
    opacity : onLogin ?1:0
  }
  const onChangeInput = e =>{
    const {name,value} = e.target;
    setUser({...user,[name]:value})
    setErr('')
  }
  const registerSubmit = async (e)=>{
    setLoading(true)
    e.preventDefault()
    try { 
      //call the api with route
      const res = await axios.post(`/api/auth/register`,{
        name:user.name,
        email:user.email,
        password:user.password,
      })
      
      setUser({name: "",email: "",password: ""})
      setErr(res.data.msg)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      err.response.data.msg && setErr(err.response.data.msg) 
    }
  }

  const loginSubmit = async (e)=>{
    setLoading(true)
    e.preventDefault()
    try { 
      const res = await axios.post(`/api/auth/login`,{
        email:user.email,
        password:user.password,
      })
      setUser({name: "",email: "",password: ""})
      //token in video
      localStorage.setItem('tokenStore',res.data.authtoken);
      setIsLogin(true)
      
    } catch (err) {
      setLoading(false)
      err.response.data.msg && setErr(err.response.data.msg) 
      
    }
  }
  return (
  <>
      {loading ?<Spinner /> :
    <section className="container login-page">
      <div className="login create-note">
        <form onSubmit={loginSubmit}>
          <h2 className="my-3">Login</h2>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="label-black">
              Email address
            </label>
            <input
              name="email"
              type="email"
              className="form-control"
              id="login-email"
              placeholder="Email"
              aria-describedby="emailHelp"
              required
              value={user.email}
              onChange= {onChangeInput}
              />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="abc">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              id="login-password"
              required
              value={user.password}
              autoComplete="true"
              onChange= {onChangeInput}
              minLength={5}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <p className="my-3">You don't have an account?
            <span onClick={()=>{setOnLogin(true)}}>Register Now</span>
          </p>
          <h3>{err}</h3>
        </form>
      </div>
      
      <div className="register create-note" style={style}>
          <h2 className="my-3">Register</h2>
        <form onSubmit={registerSubmit}>
          <div className="mb-3">
            <label htmlFor="nameInputEmail1" className="abc">
              Username:
            </label>
            <input
              name="name"
              minLength={3}
              placeholder="User Name"
              required
              value={user.name}
              type="text"
              className="form-control"
              id="register-name"
              aria-describedby="nameHelp"
              onChange= {onChangeInput}
              />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="abc">
              Email address
            </label>
            <input
              name="email"
              type="email"
              className="form-control"
              id="register-email"
              placeholder="Email"
              aria-describedby="emailHelp"
              required
              value={user.email}
              onChange= {onChangeInput}
              />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="abc">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              id="register-password"
              required
              value={user.password}
              autoComplete="true"
              onChange= {onChangeInput}
              minLength={5}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <p className="my-3">Already have an account?
            <span onClick={()=>{setOnLogin(false)}}>Login Now</span>
          </p>
          <h3>{err}</h3>
        </form>
      </div>
    </section>
}
       </>
  );
};

export default Login;
