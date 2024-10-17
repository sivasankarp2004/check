const mongoose=require("mongoose")


const Schema=new mongoose.Schema({
    id:{
      type:String
    },
    message:{
        type:String,
    }
})

const Announcement=mongoose.model("Message",Schema)

module.exports={Announcement}

