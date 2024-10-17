const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    status:{
        type:String
    }
})

const AccessModel=mongoose.model("Access",schema)

module.exports={AccessModel}