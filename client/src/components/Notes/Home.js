import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../Spinner'
import Alert from '../Alert';


const Home = () => {
  const [notes, setNotes] = useState([])
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState("");
  
  
  const showAlert = (message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      showAlert(null);
    }, 1000);
  }


  const getNotes = async (token) => {
    const res = await axios.get(`/api/notes/fetchallnotes`, {
      headers: { authtoken: token }
    },)
    setNotes(res.data)
    setLoading(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('tokenStore')
    setToken(token)
    if (token) {
      getNotes(token)
    }
  }, [])

  const deleteNote = async (id) => {
    setLoading(true)
    try {
      if (token) {
        await axios.delete(`/api/notes/deletenote/${id}`, {
          headers: { authtoken: token }
        })
        showAlert("Note Deleted Successfully" ,"success")
        getNotes(token)

      }
    } catch (error) {
      showAlert("Some Error Occured" ,"danger")
      window.location.href = "/";
    }
  }

  return (
    <>
    <Alert alert = {alert}/>
      <h1 className='text-center my-2'>Your Notes</h1>
      {loading ?<Spinner /> :
      notes.length === 0 ? <h6 className='container my-3'>Please Add Note Using Create Note Page.</h6>:
      <div className="note-wrapper">
        {notes.map(note => (
          <div className="card my-3" key={note._id}>
            <div className="card-body ">
              <h5 className="card-title">{note.title}</h5>
              <p className="card-text">{note.description}</p>
              <button className="close"
                onClick={() => deleteNote(note._id)}>X</button>
              <h6 className="card-title">Tag:{note.tag}</h6>
              <div className="card-footer">
                {note.name}
                <Link to={`edit/${note._id}`}>Edit</Link>
              </div>
            </div>
          </div>
        ))}
      
      </div>
}
</>
  )
}

export default Home