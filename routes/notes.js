const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../Middlewares/fetchuser");
const Notes = require("../models/Notes");

//Route 1 :Get all notes using :GET /api/notes/fetchallnotes ... Login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2 :Adding a  notes using :POST /api/notes/addnote ... Login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be 5 character").isLength({ min: 1 }),
    body("tag", "tag must be 2 character").isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //there are errors then return bad requests and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newnote = new Notes({ title, description, tag, user: req.user.id });
      const saveNote = await newnote.save();
      res.json(saveNote);

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 3 :update a  notes using :put /api/notes/updatenote ... Login required

router.put("/updatenote/:id", fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be 5 character").isLength({ min: 1 }),
    body("tag", "tag must be 2 character").isLength({ min: 2 }),
  ], async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //create a new note object
    try {
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      //find a note to be updated
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  });

//Route 4 :delete a  notes using :delete /api/notes/deletenote ... Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find a note to be delete and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //allowed deletion only if the user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been Deleted", note: note });

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});


router.get('/:id', async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id)
    res.json(note)
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
})

module.exports = router;
