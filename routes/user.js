const express = require("express")
const router = express.Router()
const User = require("../models/User.js")
const bcrypt = require("bcrypt")



router.get("/",(req,res)=>{
    res.send("hello world")
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// register
router.post("/register",async (req, res) => {
    const {name, surname,email,password} = req.body;
    try {
        // user creation
        const newUser = new User({name, surname,email,password})

        // e-mail existance check + unicity checking
        const searchUser = await User.findOne({email})
        if(searchUser) {
            return res.status(400).send({msg: "user already exists !"});
        }

        // hashing the password
        const saltRounds = 10;  // see documentation (Usage section) : https://www.npmjs.com/package/bcrypt
        const genSalt = bcrypt.genSalt(salt);
        const hashedPassword = bcrypt.hash(password, genSalt);
        console.log(hashedPassword);
        newUser.password = hashedPassword

        // save the user
        await newUser.save()
        res.status(200).send({newUser, msg: "user is saved"})
    } catch (error) {
        res.status(500).send("cannot the user!")    // 500 → error N°
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// login
router.post("/login", async(req, res)=>{
    const {email, password} = req.body 
    try {
        // find if the user exists or not
        const searchUser = await User.findOne({email});

        // if the email not existing
        if(!searchUser) {
            return res.status(400).send({msg: "Bad credential !"})
        }

        // password ==
        const match = await bcrypt.compare(password, searchUser.password);    // 👈 To check a password
        if(!match) {
            return res.status(400).send({msg: "Bad credential !"});
        }
        
    // send the user
    res.status(200).send({user: searchUser, msg: "user is saved."})
    } catch (error) {
        res.status(500).send({msg: "canot get the user"})
    }
})



module.exports = router