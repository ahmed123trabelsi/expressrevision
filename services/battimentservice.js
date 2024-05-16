var Batiment=require('../models/Batiment')
var Niveau=require('../models/Niveau')
var socket = require("socket.io")
async function  addBattiment(c,res){
 await   new Batiment({
    nom: c.body.nom,
    description: c.body.description,
    adresse: c.body.adresse
   }).save().then((err,data)=>{console.log("b added"); res.send('B addedd')})

}
list=(req,res,next)=>{
    Batiment.find().then((data,err)=>{
        if(err)
      { console.log(err)}
        else 
        {res.json(data)}

    })
}
listbyid=(req,res,next)=>{
    Batiment.findById(req.params.id).then((data,err)=>{
        if(err)
      { console.log(err)}
        else 
        {res.json(data)}

    })
}
async function  deleteBattiment(c,res){
   Batiment.findByIdAndDelete(c.params.id).then((err,data)=>{console.log("b deleted"); res.send('B deleted')})
   
   }
   async function ajouterNiveauAuBatiment(req, res) {
    try {
    

        // Créer et sauvegarder le nouveau niveau
        let niveau = new Niveau({
            nom: req.body.nom,
            nbr_chambre: req.body.nbr_chambre,
            id_batiment: req.body.id_batiment
        });

        let niveauAjoute = await niveau.save();

      

        console.log("Niveau ajouté au bâtiment :", niveauAjoute);
        res.status(201).json(niveauAjoute);
    } catch (err) {
        console.error("Erreur lors de l'ajout du niveau :", err);
        res.status(500).send(err);
    }
}

async function construction(req, res) {
    try {
        // Trouver le bâtiment par son ID
        let n = await Niveau.findById(req.params.id);
        if (!n) {
            return res.status(404).send("niveau non trouvé.");
        }

     n.etat_construction=true

        await n.save();
   // Mettre à jour le nombre de niveaux dans le bâtiment
   let batiment = await Batiment.findById(n.id_batiment);
   if (!batiment) {
       return res.status(404).send("Bâtiment non trouvé.");
   }

   batiment.nbr_niveau += 1;
   await batiment.save();
        console.log("construction :", n);
        res.status(201).json(n);
    } catch (err) {
        console.error("Erreur lors de l'ajout du con :", err);
        res.status(500).send(err);
    }
}
function socketIO(server){
    const io=  socket(server)

    io.on('connection',(socket)=>{
        console.log('user connected');
        socket.broadcast.emit("msg","A new user is connected")
        socket.on("demande_niveaux_non_construits",async  ()=>{
         await   Niveau.find({ etat_construction: false }).then((data,err) => {
            if(err){console.log(err)}
            else{      console.log('rr',data)
            io.emit("msg",JSON.stringify(data))}

            })
         } );
         socket.on("constructionn", async (idNiveau) => {    
            try {
            // Trouver le bâtiment par son ID
            let n = await Niveau.findById(idNiveau);

    
         n.etat_construction=true
    
            await n.save();
            await io.emit("msg",JSON.stringify(n))
       // Mettre à jour le nombre de niveaux dans le bâtiment
       let batiment = await Batiment.findById(n.id_batiment);
      
    
       batiment.nbr_niveau += 1;
       await batiment.save();
       console.log("qqq",n)

          
        } catch (err) {
            socket.emit('erreur', err.message);
         
        }})
    })
} 
async function calculerSommeBatiments(req, res) {
    try {
        const batiments = await Batiment.find({
            nbr_niveau: { $gt: 5 },
            adresse: "Tunis"
        });

        const somme = batiments.reduce((acc, batiment) => acc + 1,0);

        console.log("La somme des niveaux des bâtiments à Tunis :", somme);
        res.status(200).json({ somme: somme });
    } catch (err) {
        console.error("Erreur lors du calcul de la somme :", err);
        res.status(500).send(err);
    }
}
module.exports = {
    addBattiment,list,listbyid,deleteBattiment,ajouterNiveauAuBatiment,construction,socketIO,calculerSommeBatiments
};