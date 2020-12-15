const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const axios = require("axios")

app.use(bodyParser.json())


var urlParser = bodyParser.urlencoded({extended:false});
var path = require('path');

mongoose.connect("mongodb+srv://test:test@cluster1.zycuz.mongodb.net/ordersservice?retryWrites=true&w=majority", () => {
    console.log("Database connected - Orders")
})
//Model is loaded
require("./Order")
const Order = mongoose.model("Order")



app.get('/order1',function(req,res) {

    console.log(req.params);
    res.sendFile(path.join(__dirname,'orders.html'));
    // var d=window.document.getElementById('login_input').reset();
  
    console.log(__dirname) });
    
app.get('/', (req,res) => {
    res.send("The is the orders service");
})

app.post("/order" , urlParser,async(req,res) => {
    var newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send("Order created with success!")
    }).catch((err) => {
        if(err){
            throw err
        }
    })
})


app.get("/orders", (req,res) =>{
    Order.find().then((books) => {
        res.json(books)
    }).catch((err)=> {
        if(err){
            throw err
        }
    })
})

app.get("/order/:id" , (req,res) => {
    Order.findById(req.params.id).then((order) =>{
        if(order){
axios.get("http://localhost:5555/customer/"+ order.CustomerID).then((response) => {
   var orderObject = {customerName: response.data.name , bookTitle: ' '}
   axios.get("http://localhost:4545/book/"+ order.BookID).then((response) => {
       orderObject.bookTitle = response.data.title
       res.json(orderObject)
})
})
        }else{
            res.send("Invalid Order")
        }
    })
})

app.listen(7777, () =>{
    console.log("Up and running - Orders service")
})