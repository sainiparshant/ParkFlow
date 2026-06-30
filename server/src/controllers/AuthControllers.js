import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


const Register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const allowedRoles = ["USER", "VENDOR"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await prisma.User.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.User.create({
      data: {
        username: username,
        email:email,
        password: hashedPassword,
        role: role || "USER",
      },
    });


    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
            id: user.id,
            email: user.email,
            username: user.username
        }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req,res) => {
  try{

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const user = await prisma.User.findUnique({
      where:{email: email}
    });
    if(!user){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}


const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
} 

export { Register, login, logout };
