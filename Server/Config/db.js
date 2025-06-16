const mongoose = require('mongoose');

const ConnectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        console.log('Connected MongoDB');
    } catch(err){
        console.log('DataBase Connection Error' , err.Message);
        process.exit(1);
    }
};

module.exports = ConnectDB;