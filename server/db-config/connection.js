const mongoose = require('mongoose')


export const dbConnection = mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/auth-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));
