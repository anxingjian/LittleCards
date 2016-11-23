var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var cardSchema = new Schema({
	name:String,
	where:String,
	month:Number,
	date:Number,
	year:Number,
	imageUrl: String,
	imageUrl2: String
})

// export 'Person' model so we can interact with it in other files
module.exports = mongoose.model('Card',cardSchema);