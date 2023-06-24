const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res, next)=>{
    const  user = await User.findOne( {email: req.body.email});
    if(!user) return res.status(400).send('Email not found');

    const password = await bcrypt.compare(req.body.password, user.password);
    if(!password) return res.status(400).send('Invalid password');

    const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
};

const register = async (req, res, next)=>{
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const saveUser = await user.save();
        res.status(200).send('Successfully Registered!')
        console.log("error");
    } catch (err) {
        res.status(400).send(err);
    }
} 

const getAllUsers = async (req, res, next)=>{
    let users;

    try {
        users = await User.find();
    } catch (err) {
        return next(err)
    }

    if(!users){
        return res.status(500).json({massahe:"Internal Server Error!"});
    }
    return res.status(200).json({ users });
};

const addUser = async (req, res, next)=>{
    const { name, email, password} = req.body;
    if(
        !name &&
        name.trim() == "" &&
        !email &&
        email.trim() === "" &&
        !password &&
        password.length > 6
    ){
        return res.status(422).json({ message: 'Invalid Data!'});
    }
    let user;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        user = new User({
            name,email,hashPassword,
        });
        user= await user.save();
    } catch (err) {
        return next(err);
    }
    if(!user){
        return res.status(500).json({ message: "Unable to save the records"});
    }
    return res.status(201).json({ user });
}

const updateUser = async (req, res, next)=>{
    const id = req.params.id;
    const { name, email, password} = req.body;
    if(
        !name &&
        name.trim() == "" &&
        !email &&
        email.trim() === "" &&
        !password &&
        password.length > 6
    ){
        return res.status(422).json({ message: 'Invalid Data!'});
    }

    let user;

    try {
        user= await User.findByIdAndUpdate(id, {name,email,password});
    } catch (err) {
        return next(err);
    }
    if(!user){
        return res.status(500).json({ message: "Unable to update the records!"});
    }
    return res.status(200).json({ message: "Records updated successfully!" });

}

const deleteUser = async  (req, res, next)=>{
    const id = req.params.id;
    let user;

    try {
        user= await User.findByIdAndRemove(id);
    } catch (err) {
        return next(err);
    }
    if(!user){
        return res.status(500).json({ message: "Unable to delete the records!"});
    }
    return res.status(200).json({ message: "Records delete successfully!" });
}

exports.login = login;
exports.register = register;
exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;