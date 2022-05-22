const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//definiera strukturen av dokumentet
const accountSchema = new Schema({
  balance: {
    type: Number,
    required: true
  },
  accountName: {
    type: String,
    required: true
  }
}, {timestamps: true });


//gör modell baserat på schemat ovanför
const Account = mongoose.model('Account', accountSchema);


module.exports = Account;