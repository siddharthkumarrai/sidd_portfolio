if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
};
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const MONGO_URL="mongodb://127.0.0.1:27017/portfolio"
const ATLAS_URL=process.env.MONGO_ATLAS_URL

exports.connectMongoose = async ()=>{
    try {
        mongoose.connect(ATLAS_URL)
    .then((e)=> console.log(`connected to mongoDB:${e.connection.host}`))
    .catch((e) => console.log(e));
    } catch (error) {
        console.log(error)
    }
};

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

});

const clientSchema = new Schema({
    name:{
        type:String,
        required: true
        
    },
    email:{
        type:String,
        required: true,
        unique: true
        
    },
     phoneNr: {
            type: Number,
            required:true,
    },
    subject: String,
    description: String,

})

userSchema.plugin(passportLocalMongoose);
exports.User = mongoose.model("User",userSchema);
exports.Client = mongoose.model("Client",clientSchema);