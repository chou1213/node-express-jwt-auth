const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 characters']
  }
})

userSchema.post('save', function(doc, next) {
  console.log('new user was created &save', doc);
  next();
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  console.log(salt);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('user about to be created & save', this);
  next();
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  // 校验电子邮箱是否正确
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    // 校验密码是否正确
    if (auth) {
      return user;
    } else {
      throw Error('incorrect password');
    }
  } else {
    throw Error('incorrect email');
  }
}

const User = mongoose.model('user', userSchema);
module.exports = User;