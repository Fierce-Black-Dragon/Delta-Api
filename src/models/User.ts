import mongoose from "mongoose"
import bcrypt  from "bcryptjs";
import jwt, { Secret }  from "jsonwebtoken";
import { stringify } from "querystring";

const acces_key  =process.env.JWT_ACCESS_KEY

const refresh_key   =process.env.JWT_ACCESS_KEY
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [40, " max 40 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email address"],
    unique: true,
  
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [6, "Please enter password greater than or equal to 6 char"],
    select: false,
  },

 
  forgotPasswordToken: String,
  forgotTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // more fields will be added when required
});

//encrypt password before save -- mongoose Hook
userSchema.pre("save", async function (next) {
  //to prevent over-encryption of password
  if (!this.isModified("password")) {
    return next();
  }
  //encrypt
  this.password = await bcrypt.hash(this.password, 10);
});
// Mongoose Methods
//user password validate method
userSchema.methods.isPasswordValid = async function (senderPassword :string)  {
  return await bcrypt.compare(senderPassword, this.password);
};

// jwt Access Token  creation
userSchema.methods.jwtAccessTokenCreation = async function () {
  let token =jwt.sign({ id: this._id }, process.env.JWT_ACCESS_KEY as Secret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  return token
};
// jwt tRefresh Token  creation
userSchema.methods.jwtRefreshTokenCreation = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_KEY as Secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

// //Verification token creation
// userSchema.methods.getVerificationToken = async function () {
//   //Verification token token creation -(type - String)
//   const verificationToken = await crypto.randomBytes(20).toString("hex");
//   this.verificationTokenExpiry = Date.now() + 20 * 60 * 1000;

//   // save hash version of the token in the database  and send the Verification token token  to user
//   this.verificationToken = await crypto
//     .createHash("sha256")
//     .update(forgotToken)
//     .digest("hex");

//   return verificationToken;
// };
// // forgot password token creation
// userSchema.methods.getForgotPasswordToken = async function () {
//   //forgot password token creation -(type - String)
//   const forgotToken = await crypto.randomBytes(20).toString("hex"); // dont know how much time will  take
//   //expire
//   this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

//   // save hash version of the token in the database  and send the forgot password token  to user
//   this.forgotPasswordToken = await crypto
//     .createHash("sha256")
//     .update(forgotToken)
//     .digest("hex");

//   return forgotToken;
// };
const User = mongoose.model("User", userSchema);
export default User