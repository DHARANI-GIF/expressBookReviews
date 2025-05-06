const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const bcrypt = require('bcrypt');

const public_users = express.Router();

// Helper function to check if username is valid
const isValidUsername = (username) => {
    return !users.some(user => user.username === username); // Check if the username already exists
  };
  
  // Registration route
  public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (!isValidUsername(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Hash the password for security
    const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds
  
    // Create new user and add it to the users array
    const newUser = {
      username: username,
      password: hashedPassword
    };
  
    // Add the new user to the users array
    users.push(newUser);
  
    return res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.json(books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;  // Retrieve the ISBN (in your case, it's the ID) from the request parameters
  
  // Convert the ISBN (ID) to an integer since it's stored as a number in the `books` object
  const bookId = parseInt(isbn, 10);

  // Find the book with the matching ID
  const book = books[bookId];  // Access the book using the bookId as the key
  
  if (book) {
    // If the book is found, send it as a JSON response
    return res.status(200).json(book);
  } else {
    // If no book is found, send a 404 error response
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author.trim().toLowerCase();  // Get the author name from request parameters

  console.log(`Searching for books by author: ${authorName}`); // Log the search term
  
  // Normalize and trim all authors in the dataset
  console.log("Authors in the dataset:");
  Object.values(books).forEach(book => console.log(book.author));

  // Function to normalize and trim the author name
  const normalizeString = (str) => {
    return str.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();  // Normalize and convert to lowercase
  };

  // Filter the books that match the author's name
  const matchingBooks = Object.values(books).filter(book =>
    normalizeString(book.author).includes(authorName)  // Case-insensitive matching with normalized strings
  );

  console.log(`Matching books:`, matchingBooks); // Log the matching books
  
  if (matchingBooks.length > 0) {
    // If matching books are found, return them in a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // If no books are found, return a message indicating no books were found for the given author
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.trim().toLowerCase();  // Get the title from request parameters

  console.log(`Searching for books with title: ${title}`); // Log the search term
  
  // Normalize and trim all titles in the dataset
  console.log("Titles in the dataset:");
  Object.values(books).forEach(book => console.log(book.title));

  // Function to normalize and trim the title string
  const normalizeString = (str) => {
    return str.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();  // Normalize and convert to lowercase
  };

  // Filter the books that match the title
  const matchingBooks = Object.values(books).filter(book =>
    normalizeString(book.title).includes(title)  // Case-insensitive matching with normalized strings
  );

  console.log(`Matching books:`, matchingBooks); // Log the matching books
  
  if (matchingBooks.length > 0) {
    // If matching books are found, return them in a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // If no books are found, return a message indicating no books were found for the given title
    return res.status(404).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn, 10);  // Convert the ISBN parameter to an integer

    console.log("Looking for reviews for ISBN: " + isbn);  // Log the ISBN we're querying

    // Check if the ISBN exists in the books object
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found for this ISBN" });
    }
});

module.exports.general = public_users;
