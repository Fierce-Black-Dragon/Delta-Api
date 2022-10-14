import express, { Request, Response } from "express";
import User  from "../models/User"

export const signup =async (req: Request, res: Response)=>{
try {
    const {email,password,name}=req.body
    console.log(req.body);
    
if( !email || !password || name){
    throw new Error(("feilds missing"))
}  //finding if user is already register;

const existingUser = await User.findOne({ email: email });
if (existingUser) {
  throw new Error(
    `${existingUser.email} is already been registered`
  );
}
//creating user in mongo db
const user = await User.create({
  name,
  email,
  password,
  
});
// send json response with register successfully
res.status(201).json({
  success: true,
  user:user,
  message: "Register successfully u can login now",
});
} catch (error) {
res.json(error)
}
}