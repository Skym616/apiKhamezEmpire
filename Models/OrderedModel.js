const mongoose = require('mongoose');

const OrderedSchema = mongoose.Schema({
  ordered: { type: String, require: true },
  total: { type: Number, require: true },
  number: { type: String, require: true },
  dateOrdered: { type: String, require: true },
  status: { type: String, require: true }
});

module.exports = mongoose.model('Ordered', OrderedSchema);
