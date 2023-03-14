import React from 'react'
import Navbar from './Notes/Navbar'
import CreateNote from './Notes/CreateNote'
import EditNote from './Notes/EditNote'
import Home from './Notes/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Notes = ({setIsLogin}) => {
  return (
    <Router>
      <div className='notes-pages'>
        <Navbar setIsLogin={setIsLogin}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </div>
    </Router>
  )
}

export default Notes
