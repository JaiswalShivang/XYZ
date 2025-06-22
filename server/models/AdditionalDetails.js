const mongoose = require('mongoose')

const AdditionalDetailsSchema = new mongoose.Schema({
  state:{
    type:String,
    required:true,
  },
  city:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  gender:{
    type:String,
    required:true, 
  },
  familyincome:{
    type:String,
    required:true,
  },
  age:{
    type:Number,
    required:true,
  },
  educationalbackground:{
    type:String,
    required:true,
  },
  userimage:{
    type:String,
    required:true,
  },
})

module.exports = mongoose.model("AdditionalDetails",AdditionalDetailsSchema)