const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let todos = [];

app.post('/add', (req, res) => {
  const { task } = req.body;
  todos.push(task);
  res.send('Task added');
});

app.get('/tasks', (req, res) => {
  res.json(todos);
});

app.delete('/delete/:index', (req, res) => {
  todos.splice(req.params.index, 1);
  res.send('Deleted');
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});