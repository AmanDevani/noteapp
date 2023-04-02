import { React, useState } from 'react'
import axios from 'axios'
import Alert from '../Alert';
import Spinner from '../Spinner'

const CreateNote = () => {
  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(true)

  const onChangeInput = e => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value })
  }

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      showAlert(null);
    }, 2000);
  }
  const createnote = async e => {
    setLoading(false)
    e.preventDefault()
    try {
      const token = localStorage.getItem('tokenStore')
      if (token) {
        const { title, description, tag } = note
        const newnote = {
          title, description, tag
        }
        await axios.post(`/api/notes/addnote`, newnote, {
          headers: { authtoken: token }
        })
        setNote({ ...note, title: "", description: "", tag: "" })
        showAlert("Note Created Successfully", "success")
        window.location.href = '/'

      }
    } catch (err) {
      window.location.href = '/'
    }
  }
  return (
    <>
      <Alert alert={alert} />
      <div className="container my-3">
        <h2>Create Note</h2>
        {loading ?
        <form onSubmit={createnote} autoComplete="off" >
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Note Title</label>
            <input type="text" className="form-control" value={note.title} name="title" id="title" placeholder="Enter Title" required onChange={onChangeInput}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Note Description</label>
            <textarea type="text" minLength={5} className="form-control" value={note.description} name="description" id="description" rows="3" placeholder="Enter Description" required onChange={onChangeInput}></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Note Tag</label>
            <input type="text" className="form-control" minLength={2} value={note.tag} name="tag" id="tag" placeholder="Enter Tag" required onChange={onChangeInput} />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Note
          </button>
        </form>
        : <Spinner/>
}
      </div>
    </>
  )
}

export default CreateNote
