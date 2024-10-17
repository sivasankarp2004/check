const mongoose=require("mongoose")

const Schema=new mongoose.Schema({
    regNo:{
       type:String,
    },
    status:{
        type:String,
    }
})

const Smodel=mongoose.model("Status",Schema)

module.exports={Smodel}