//load express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

var urlParser = bodyParser.urlencoded({extended:false});
var path = require('path');

app.use(bodyParser.json());

//Load mongoose
const mongoose = require("mongoose");

require("./Book")
const Book = mongoose.model("Book")

//Connect
mongoose.connect("mongodb+srv://test:test@cluster1.zycuz.mongodb.net/booksservice?retryWrites=true&w=majority", () => {
    console.log("Database is connected");
});

app.get('/book1',function(req,res) {

    console.log(req.params);
    res.sendFile(path.join(__dirname,'books.html'));
    // var d=window.document.getElementById('login_input').reset();
  
    console.log(__dirname) });

app.get('/', (req,res) => {
    res.send("The is the books service");
})

//Create functionality
app.post("/book", urlParser,async(req, res) => {
    var newBook = {
        title : req.body.title,
        author : req.body.author,
        numberPages : req.body.numberPages,
        publisher : req.body.publisher
    }
//Create a new Book
    var book = new Book(newBook)

    book.save().then(() => {
        console.log("New book created!")
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
    res.send("A new book created with success!");
})

app.get("/books", (req,res) => {
    Book.find().then((books) => {
        res.json(books)
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.get("/book/:id", (req,res) => {
    Book.findById(req.params.id).then((book) => {
if(book){
    //Book data
    res.json(book)
}else{
    res.sendStatus(404);
}
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.delete("/book/:id" , (req,res) =>{
    Book.findOneAndRemove(req.params.id).then(() => {
        res.send("Book removed with success!")
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.listen(4545,() => {
    console.log("Up and running! -- This is our Books service");
})
