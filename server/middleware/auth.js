import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//valdiate the token generated from signup or login portals
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ message: "Access denied. No token provided" });

  try {
    req.user = jwt.verify(token, "secretstring1234");
    next(); //req.user only has to fields from jwt.verify: _id and iat
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

export default auth;