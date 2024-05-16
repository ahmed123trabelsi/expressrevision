var http=require("http")
var express=require("express")
var mongoose=require("mongoose")
var path=require('path')
 const { socketIO }= require('./services/battimentservice') 
var mongoConfig= require("./config/mongoConfig.json")
var batimentRoutes= require("./controller/battimentController")
var app=express()
app.set('views',path.join(__dirname,'views'))
app.set('view engine','twig')
app.use(express.json())
app.use(express.static('public'))
app.use("/battiment",batimentRoutes)
mongoose.connect(mongoConfig.uri)
  .then(() => {
    console.log("db connect");
  })
  .catch((err) => {
    console.log("db error: " + err);
  });
var server=http.createServer(app)
socketIO(server)
server.listen(3002,()=>{
    console.log("server started   ");
})