var express= require("express")
const Niveau = require("../models/Niveau")
var router=express.Router()
var BatimentService=require("../services/battimentservice")
var {list}=require("../services/battimentservice")
router.get("/list",list)
router.post("/add/", BatimentService.addBattiment)
router.post("/addNiveau/", BatimentService.ajouterNiveauAuBatiment)
router.get("/getbattimentbyid/:id", BatimentService.listbyid)
router.delete("/deletebattimentbyid/:id", BatimentService.deleteBattiment)
router.put("/construction/:id", BatimentService.construction)
router.get('/test',(req,res)=>{res.render('bat')}) 
router.get('/somme-batiments', BatimentService.calculerSommeBatiments);
/* router.get('/test', async function(req, res) {
  
        const niveaux = await Niveau.find();
        res.render('bat', { niveaux: niveaux });
 
}); */

module.exports = router;