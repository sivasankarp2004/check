const mongoose=require("mongoose")

const Schema=new mongoose.Schema({
    regNo:{
       type:String,
    },
    status:{
        type:String,
    }
})

const Rmodels=mongoose.model("RStatus",Schema)

module.exports={Rmodels}