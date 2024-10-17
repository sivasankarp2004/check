const mongoose=require("mongoose")

const Schema=new mongoose.Schema({
    regNo:{
       type:String,
    },
    status:{
        type:String,
    }
})

const Wmodels=mongoose.model("WStatus",Schema)

module.exports={Wmodels}