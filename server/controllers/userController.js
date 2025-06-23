import User from "../models/userModel.js";
import bcrypt from 'bcrypt';

// For ME route to take desipher token from auth.js middleware and return account details
const getUserByToken = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
}

//Use for signup portal
const createUser = async (req, res) => {
  try {
    const { userName, firstName, lastName, password, email } = req.body;

    const checkUserEmail = await User.findOne({email});
    const checkUserName = await User.findOne({userName});

    if(checkUserEmail || checkUserName){
      return res.status(400).json({message: "Username or email already taken"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ userName, firstName, lastName, password: hashedPassword, email, });
    const savedUser = await newUser.save();

    const token = savedUser.generateAuthToken();
    return res.header("x-auth-token", token).status(201).send( token );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    createUser,
    getUserByToken
};