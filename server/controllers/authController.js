import User from "../models/userModel.js";
import bcrypt from "bcrypt";

//Use for login portal
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default authUser;
