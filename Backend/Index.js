const express = require('express');
const { client } = require("./db/db.js");
const { ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the 'TodolistDB' database
const db = client.db('TodolistDB');
const todolistCollection = db.collection('todolist');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all todolist
app.get('/todolist', async (req, res) => {
    try {
        const results = await todolistCollection.find({}).toArray();
        res.status(200).json(results);
    } catch (e) {
        console.error('Failed to fetch todolist:', e);
        res.status(500).send('Internal server error');
    }
});

// Create a new todolist
app.post('/todolist', async (req, res) => {
    try {
        const newTask = req.body;
        const result = await todolistCollection.insertOne(newTask);
        res.status(201).json(result);
    } catch (e) {
        console.error('Failed to create a new todolist:', e);
        res.status(500).send('Internal server error');
    }
});

// Update a todolist by ID
app.put('/todolist/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const update = { $set: req.body };
        const result = await todolistCollection.updateOne(query, update);
        res.status(200).json(result);
    } catch (e) {
        console.error('Failed to update todolist:', e);
        res.status(500).send('Internal server error');
    }
}); 

//// Update a todolist by ID
/*app.put('/todolist/:id', async (req, res) => {
    
        const query = { _id: new ObjectId(req.params.id) };
        const update = {
        $set:{
            newTask : req.body.title,
        }
    }
        let todolistCollection = await db.collection('todolist') 
        const result = await todolistCollection.updateOne(query, update);
        res.status(200).json(result);
   
}); */

// Delete a todolist by ID
app.delete('/todolist/:id', async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await todolistCollection.deleteOne(query);
        res.status(204).send();
    } catch (e) {
        console.error('Failed to delete todolist:', e);
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
