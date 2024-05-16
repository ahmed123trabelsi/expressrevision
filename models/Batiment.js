var mongoose=require("mongoose")
var Schema=mongoose.Schema

var Batiment=new Schema({
    nom:String,
    nbr_niveau: { type: Number, default: 0 },
    description: String,
    adresse:String
})

module.exports= mongoose.model("Batiment",Batiment)