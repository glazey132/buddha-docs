const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {
    required: true,
    unique: true,
    type: String
  },
  password: {
    required: true,
    type: String
  }
})

const docsSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
		required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  editorRaw: {
    type: String
  },
  history: []
});

const User = mongoose.model('User', userSchema);
const Document = mongoose.model('Document', docsSchema);


module.exports = {
  User: User,
  Document: Document
};
