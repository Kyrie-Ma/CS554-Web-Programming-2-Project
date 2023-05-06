const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');
const bcryptjs = require('bcrypt');

let exportedMethods = {
    async createUser(name, username, password) {
        name = name.trim();
        /*
        if(typeof name !== "string" || typeof username !== "string" || typeof password !== "string"){
            throw 'name, username or password is not a string';
        }
        */
        username = username.toString();
        password = password.toString();
        if (username.indexOf(" ") != -1) throw `username shouln'd have spaces`;
        if (password.indexOf(" ") != -1) throw `password shouln'd have spaces`;
        var Regx = /^[A-Za-z0-9]*$/;
        if (!Regx.test(name)){
            throw "name should only be combained by alphanumeric characters";
        }
        if (!Regx.test(username)){
            throw "username should only be combained by alphanumeric characters";
        }           
        let hasPwd = await bcryptjs.hash(password, 10);
        const userCollection = await user();
        const newUsername = username.toLowerCase();
        let check = await userCollection.findOne({ username: newUsername });
        if (check !== null) throw `${username} is existed, please change the username`;
        const newName = name;
        let newUser = {
            name: newName,
            username: newUsername,
            password: hasPwd,
        };    
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount == 0){
            throw `Could not add a new user`;
        }
        const newInsertedUser = await userCollection.findOne({ _id: insertInfo.insertedId });  
        if (newInsertedUser === null) {
            throw 'The new user insert went wrong';
        }
        newInsertedUser._id = newInsertedUser._id.toString();
        return newInsertedUser;
    },

    async login(loginUsername, loginPassword){
        if(typeof loginUsername !== "string" || typeof loginPassword !== "string"){
            throw 'username or password is not a string';
        }
        if (loginUsername.indexOf(" ") != -1) throw `username shouln'd have spaces`;
        if (loginUsername.indexOf(" ") != -1) throw `password shouln'd have spaces`;
        var Regx = /^[A-Za-z0-9]*$/;
        if (!Regx.test(loginUsername)){
            throw "username should only be combained by alphanumeric characters";
        }
        let hashPassword = await bcryptjs.hash(loginPassword, 10);
        const userCollection = await user();
        loginUsername = loginUsername.toLowerCase();
        let check = await userCollection.findOne({ username: loginUsername });
        if (check === null){
            throw  'account is not exist, please signup first';
        }
        if (!(await bcryptjs.compare(loginPassword, check.password))){
            throw 'password is wrong';
        }
        check._id = check._id.toString();
        delete check.password;
        return check; 
    },
}

module.exports = exportedMethods;