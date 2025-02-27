const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let saltrounds = 5;

let userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  favTeam: [String],
  age: Number,
  userBlogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Blogs',
    },
  ],
  role: {
    type: String,
    required: true,
    enum: ['superAdmin', 'admin', 'user', 'premiumUser'],
    default: 'user',
  },
  image: { type: Object, required: false },
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, saltrounds);
  next();
});

let userModel = mongoose.model('Users', userSchema);

module.exports = userModel;
