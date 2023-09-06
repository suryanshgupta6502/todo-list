const express = require("express")
const bodyparser = require("body-parser")
var app = express();
const mongoose=require("mongoose")

var port=process.env.PORT || 3000
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static("public"))
var items = [];


mongoose.connect("mongodb+srv://Surya:Surya@cluster0.yenhx0h.mongodb.net/?retryWrites=true&w=majority").then(()=>{console.log("succefully connected");})
.catch((err)=>{console.log(err);})

const todoschema = mongoose.Schema({
    item: String
})
const Item = mongoose.model("Item", todoschema)
const item1 = new Item({ item: "this is the first defualt item" })
const item2 = new Item({ item: "this is the second defualt item" })
const defaultitems = [item1, item2]



app.get("/", function (req, res) {

    const items = Item.find({}).then((values)=>{
        console.log(values);
        if(values.length===0){
            Item.insertMany(defaultitems).then(() => { console.log("succefule added to db"); })
                            .catch(() => { console.log("Not added"); })

        res.redirect("/");
        }
        else{
            res.render("html", { todayday: "Today", newitem: values })
        }
        
    })
    
    .catch(()=>{console.log("not print");})

    

})
app.post("/", function (req, res) {
    const itemname = req.body.addnewitem
    console.log("added to db -> "+itemname);

    var item=new Item({
        item:itemname
    })
    item.save();
    res.redirect("/")
    console.log(item);
    // console.log(item)
    // res.render("html",{newitem:item})
    // res.send("this is post")
})

app.post("/delete",function(req,res){
    console.log(req.body.checkbox)
    Item.findByIdAndDelete(req.body.checkbox).then(()=>{console.log("deleted done");})
                                    .catch(()=>{console.log("not deleted");})

    res.redirect("/")                                
})

app.get("/:routes",function(req,res){
    console.log(req.params.routes);
})

app.listen(port, function () {
    console.log("localhost:3000")
})