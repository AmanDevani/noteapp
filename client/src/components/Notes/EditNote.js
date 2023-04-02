import { React, useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import Alert from '../Alert'
import Spinner from '../Spinner'

const EditNote = () => {
  const [note, setNote] = useState({ title: "", description: "", tag: "" });
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(true)

  const params = useParams();
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      showAlert(null);
    }, 1500);
  }
  useEffect(() => {
    const getNote = async () => {

      const token = localStorage.getItem('tokenStore')
      if (params.id) {
        const res = await axios.get(`/api/notes/${params.id}`, {
          headers: { Authorization: token }
        }
        )
        setLoading(false)
        setNote({
          title: res.data.title,
          description: res.data.description,
          tag: res.data.tag,
          id: res.data._id
        })
      }
    }
    getNote()
  }, [params.id])

  const onChangeInput = e => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value })
  }
  const editNote = async e => {
    setLoading(true)
    e.preventDefault()
    try {
      const token = localStorage.getItem('tokenStore')
      if (token) {
        const { title, description, tag, id } = note;
        const newNote = {
          title, description, tag
        }

        await axios.put(`/api/notes/updatenote/${id}`, newNote, {
          headers: { authtoken: token }
        })
        setNote({ ...note, title: "", description: "", tag: "" })
        showAlert("Note Updated Successfully", "success")
        window.location.href = '/'
      }
    } catch (err) {
      showAlert("Some Error Occured", "danger")
      console.log(err.message);
    }
  }
  return (
    <>
      <Alert alert={alert} />
      <div className="container my-3">
        <h2>Edit Note</h2>
        {loading ? <Spinner /> :
          <form onSubmit={editNote} autoComplete="off">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">Note Title</label>
              <input type="text" className="form-control" value={note.title} name="title" id="title" placeholder="Enter Title" required minLength={3} onChange={onChangeInput} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlTextarea1" className="form-label">Note Description</label>
              <textarea type="text" className="form-control" name="description" value={note.description} id="description" rows="3" placeholder="Enter Description" required onChange={onChangeInput}></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">Note Tag</label>
              <input type="text" className="form-control" name="tag" minLength={2} value={note.tag} id="tag" placeholder="Enter Tag" required onChange={onChangeInput} />
            </div>
            <button type="submit" className="btn btn-primary">
              Edit Note
            </button>
          </form>
        }
      </div>
    </>
  )
}

export default EditNote
