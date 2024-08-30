const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('frontend'))

const users = []; // This will act as our in-memory database

// Secret key for JWT
const jwtSecret = 'jwtsecretkey@123';


app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = { id: users.length + 1, name, email, password };
  users.push(user);
  res.json({ message: 'Signup successful', user });
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ message: 'Login successful', token: 'mock-jwt-token', email: user.email });
}); 
  
  app.get('/api/profile', (req, res) => {
    const email = req.query.email;
    const user = users.find(u => u.email === email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  app.put('/api/profile', (req, res) => {
    const { id, name, email, age, phone } = req.body;
    const user = users.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.email = email;
      user.age = age;
      user.phone  = phone;
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  app.delete('/api/profile', (req, res) => {
    const { id } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      res.json({ message: 'Profile deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });  

