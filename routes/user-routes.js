const express = require("express");
const verify = require("../token");
const { getAllUsers, addUser, updateUser, deleteUser, login, register,} = require("../controllers/user-controller");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/", verify, getAllUsers);
router.post("/", verify, addUser);
router.put("/:id", verify, updateUser);
router.delete("/:id", verify, deleteUser);

module.exports=router;