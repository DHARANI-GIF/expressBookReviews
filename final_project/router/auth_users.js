const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bcrypt = require('bcrypt');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate if the user exists and if the password matches
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Compare password with the stored hash using bcrypt
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token if authentication is successful
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret_key', { expiresIn: '1h' });

    return res.status(200).json({ message: "Login successful", token });
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review, rating } = req.body;

  // Find the book and add/modify the review
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the review for the authenticated user
  book.reviews[req.user.username] = { reviewer: req.user.username, rating, comment: review };

  res.status(200).json({ message: "Review added/modified successfully", book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
