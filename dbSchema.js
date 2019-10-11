const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
	guid: {
		type: Number,
		required: true,
		unique: true
	},
	date: {
		type: Date,
		default: Date.now()
	}
});
const PostModel = mongoose.model('vacancies', PostSchema);


module.exports = PostModel;