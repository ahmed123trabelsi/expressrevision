var mongoose=require("mongoose")
var Schema=mongoose.Schema

var Niveau=new Schema({
    nom:String,
    nbr_chambre: Number,
    id_batiment: { type: Schema.Types.ObjectId, ref: 'Batiment' },
    etat_construction: { type: Boolean, default: false }
})

module.exports= mongoose.model("Niveau",Niveau)