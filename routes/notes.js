const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middlewares/fetchUser');

router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user_ID });
        // console.log(req.user_ID);
        res.status(200).json(notes)
    } catch (error) {
        res.send('some error occured while fetching notes')
    }

})


router.patch('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        if(!req.params.id){
            res.status(400).json({message: 'Please provide note id'})
        }
        const id = req.params.id;
        const note = await Notes.findById(id);
        if(!note){
            return res.status(404).json({message: 'note not found'})
        }
        // The id of the user who's logged in should match with the userID of the note    
        if (note.user.toString() !== req.user_ID) {
            return res.status(401).send('Unauthorised');
        }
        let newNote = {};
        if (req.body.title) {newNote.title = req.body.title;}
        if (req.body.description) {newNote.description = req.body.description;}

        if (req.body.tag) {newNote.tag = req.body.tag;}

        // let updatedNote = new Notes(newNote);
        // console.log(updatedNote);
        const result = await Notes.findByIdAndUpdate(id,
            newNote,
            {new: true})
            
            res.status(200).send(result);

    } catch (error) {
        res.status(400).send('some error occured while updating notes');
    }

})




router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        if(!req.params.id){
            res.status(400).json({message: 'Please provide note id'})
        }
        const id = req.params.id;
        const note = await Notes.findById(id);
        if(!note){
            return res.status(404).json({message: 'note not found'})
        }
        // The id of the user who's logged in should match with the userID of the note    
        if (note.user.toString() !== req.user_ID) {
            return res.status(401).send('Unauthorised');
        }
        
        const result = await Notes.findByIdAndDelete(id,
            
            {new: true})
            
            res.status(200).send(`${result} has been successfully deleted`);

    } catch (error) {
        res.status(400).send('some error occured while updating notes');
    }

})

router.post('/createnote', fetchUser, [
    body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

    body('description').isLength({ min: 5 }).withMessage('password must be at least 5 characters'),


], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const newNote = new Notes({
            title,
            description,
            tag,
            user: req.user_ID
        })
        const result = await Notes.insertMany(newNote);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send('some error occured while creating notes'+ error)
    }

})
// delete all the notes belonging to a user: he needs to be logged in
router.delete('/deletenotes', fetchUser, async (req, res) => {
    try {
        
        console.log(req.user_ID);
        const result = await Notes.deleteMany({user:req.user_ID})
        res.status(200).json(result)
    } catch (error) {
        res.send('some error occured while deleting notes'+ error)
    }

})

module.exports = router;