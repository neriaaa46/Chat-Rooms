const mongoose = require('mongoose');

function connectDataBase(){
  
  mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true})

  mongoose.connection.once('open', ()=> {
    console.log('connection has been made')
  }).on('error', (error)=> {
    console.log('error mongodb connection :', error)
  })
}


  module.exports = {connectDataBase}
