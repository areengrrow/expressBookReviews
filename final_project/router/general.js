const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
      if (isValid(username)){
        users.push({'username':username, 'password':password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});         
      } else {
        return res.status(404).json({message: "Username is not valid"});
      }
  } else {
      return res.status(404).json({message: "Username or password is not provided"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let result = {'booksbyauthor':[]};
    for (const [key, value] of Object.entries(books)){
        if(value.author === author){
            let book = {'ISBN':key,
                        'title':value.title,
                        'reviews': value.reviews
            }
            result['booksbyauthor'].push(book)
        }
    }
    res.send(JSON.stringify(result,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let result = {'booksbytitle':[]};
    for (const [key, value] of Object.entries(books)){
        if(value.title === title){
            let book = {'ISBN':key,
                        'author':value.author,
                        'reviews': value.reviews
            }
            result['booksbytitle'].push(book)
        }
    }
    res.send(JSON.stringify(result,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
