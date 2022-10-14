import express, { NextFunction, Request, Response } from "express";
import User from "../models/User";
import cookieToken from "../utils/cookieToken";

const Signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).send(" every feild  is needed");
    } //finding if user is already register
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(403).send(`${existingUser.email} is already been registered`);
    }
    //creating user in mongo db
    const user = new User({ name, email, password });
    await user.save();
    //token creation function
    cookieToken(user, res);
  } catch (error) {
    res.json(error);
  }
};

const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validate the  user input (checking if all fields are enter correctly)

    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("feilds missing");
    }
    //finding the user in database  using email
    const user = await User.findOne({ email }).select("+password");
    //if user is not found
    if (!user) {
      throw new Error("User not found");
    }
    // checking  if enter password is correct
    const isPasswordCorrect = await user?.verifyPassword(password);
    console.log("verified", isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new Error("email or password invalid");
    }

    //token creation function
    cookieToken(user, res);
  } catch (error) {
    next(error);
  }
};

export { Login, Signup };
