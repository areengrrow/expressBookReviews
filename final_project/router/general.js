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
    let booksPromise = new Promise((resolve,reject) => {
        if (Object.keys(books).length > 0){
            resolve("Successful");
        } else {
            reject("Failure");
        }
    })
    booksPromise.then((message)=>{
        res.send(JSON.stringify(books, null, 4));
    }).catch((error)=>{
        return res.status(200).json({message: "books list is empty"});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let isbnPromise = new Promise((resolve,reject)=>{
      if (isbn in books){
          resolve("Successfull")
      } else {
          reject("Failur")
      }
  })
  isbnPromise.then((message)=>{
    res.send(books[isbn])
  }).catch((error)=>{
    return res.status(200).json({message: `isbn ${isbn} is invalid`});        
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let authorPromise = new Promise((resolve,reject)=>{
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

  })
  authorPromise.then((message)=>{
        res.send(JSON.stringify(result,null,4));
    }).catch((error)=>{
        return res.status(200).json({message: `author ${author} has no books`});        
    })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let result = {'booksbytitle':[]};
  let titlePromise = new Promise((resolve,reject)=>{
    for (const [key, value] of Object.entries(books)){
        if(value.title === title){
            let book = {'ISBN':key,
                        'author':value.author,
                        'reviews': value.reviews
            }
            result['booksbytitle'].push(book)
        }
    }
    if (result['booksbytitle'].length > 0){
        resolve("Successful");
    } else {
        reject("Failure");
    }
  })
  titlePromise.then((message)=>{
    res.send(JSON.stringify(result,null,4));
  }).catch((error)=>{
    return res.status(200).json({message: `There is no book with title ${title}`});        
  })


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
