// const express = require('express');
// const { MongoClient } = require('mongodb');
// const app = express();
// const port = 3000;

// // MongoDB connection string
// const uri = 'mongodb+srv://divyabonda462:Divya123@cluster0.cx34y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// app.use(express.json());

// let db, tasksCollection;

// // Connect to MongoDB
// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     db = client.db('taskdb');
//     tasksCollection = db.collection('tasks');
//     console.log('Connected to MongoDB');
//   })
//   .catch(error => console.error(error));

// // Get tasks
// app.get('/tasks', async (req, res) => {
//   try {
//     const tasks = await tasksCollection.find().toArray();
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve tasks' });
//   }
// });

// // Add new task
// app.post('/tasks', async (req, res) => {
//   const newTask = {
//     ...req.body,
//     status: 'pending',
//     timeSpent: 0,
//   };
//   try {
//     const result = await tasksCollection.insertOne(newTask);
//     res.status(201).json(result.ops[0]);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create task' });
//   }
// });

// // Update task status
// app.put('/tasks/:id/status', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     const result = await tasksCollection.findOneAndUpdate(
//       { _id: new require('mongodb').ObjectID(id) },
//       { $set: { status } },
//       { returnOriginal: false }
//     );
//     res.json(result.value);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update task status' });
//   }
// });

// // Log time spent on a task
// app.put('/tasks/:id/time', async (req, res) => {
//   const { id } = req.params;
//   const { minutes } = req.body;
//   try {
//     const result = await tasksCollection.findOneAndUpdate(
//       { _id: new require('mongodb').ObjectID(id) },
//       { $inc: { timeSpent: minutes } },
//       { returnOriginal: false }
//     );
//     res.json(result.value);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to log time' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Task management backend running at http://localhost:${port}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/task'); // Import the Task model
const app = express();
const port = 3000;

// MongoDB connection string
const uri = 'mongodb+srv://divyabonda462:Divya123@cluster0.cx34y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error(error));

// Get tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks' });
  }
});

// Add new task
app.post('/tasks', async (req, res) => {
  const newTask = new Task({
    ...req.body,
    status: 'pending',
    timeSpent: 0
  });

  try {
    const existingTask = await Task.findOne({
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate,
    });

    if (existingTask) {
      res.status(400).json({ message: 'Task already exists' });
    } else {
      const task = await newTask.save();
      res.status(201).json(task);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// Update task status
app.put('/tasks/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task status' });
  }
});

// Log time spent on a task
app.put('/tasks/:id/time', async (req, res) => {
  const { id } = req.params;
  const { minutes } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { $inc: { timeSpent: minutes } },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to log time' });
  }
});

app.listen(port, () => {
  console.log(`Task management backend running at http://localhost:${port}`);
});
