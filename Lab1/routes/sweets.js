const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;
const sweetsData = data.sweets;
const replyData = data.reply;
const likesData = data.likes;

router.get('/sweets', async (req, res) => {
    var pageSweets = req.query.page;
    var page = 1;
    if(pageSweets === undefined){
        page = 1;
        //const allSweetsData = await sweetsData.getSweets(page);
        ///res.status(200).json(allSweetsData);
    }
    else if(pageSweets !== undefined){
        pageSweets = pageSweets.trim();
        if(pageSweets.length === 0){
            page = 1;
            //const allSweetsData = await sweetsData.getSweets(page);
            //res.status(200).json(allSweetsData);
        }
        else{
            if(!parseInt(num1)){
                res.status(404).json({ error: "the page value in the url is wrong"});
                return;
            }
            else{
                page = parseInt(num1);
                if(page <= 0){
                    res.status(404).json({ error: "the page value in the url must be greater than 0"});
                    return;
                }
                //const allSweetsData = await sweetsData.getSweets(page);
            }
        }
    }
    try{
        const allSweetsData = await sweetsData.getSweets(page);
        res.status(200).json(allSweetsData);
    } catch (e){
        res.status(404).json(e);
    }
});

router.get('/sweets/:id', async (req, res) => {
    try {
        const sweetsById = await sweetsData.getSweetsById(req.params.id);
        res.status(200).json(sweetsById);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/sweets', async (req, res) =>{
    if(!req.session.user){
        res.status(404).json({ error: "Your did not login" });
        return;
    }
    let newSweetText = req.body.sweetText;
    let newSweetMood = req.body.sweetMood;
    if(newSweetText === undefined){
        res.status(404).json({ error: 'You have to enter the sweetText'});
        return;
    }
    if(newSweetMood === undefined){
        res.status(404).json({ error: 'You have to enter the sweetMood'});
        return;
    }
    try {
        const newSweet = await sweetsData.createNewSweet(req.session.user.user._id, newSweetText, newSweetMood);
        res.status(200).json(newSweet);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.patch('/sweets/:id', async (req, res) =>{
    if(!req.session.user){
        res.status(404).json({ error: "You did not login" });
        return;
    }
    if(req.body.sweetText === undefined || req.body.sweetMood === undefined){
        res.status(404).json({ error: "Your did not update anything valid" });
        return;
    }
    updateSweet = {};
    updateSweet.updateSweetText = req.body.sweetText;
    updateSweet.updateSweetMood = req.body.sweetMood;
    sweetId = req.params.id;
    try {
        const updateSweetResult = await sweetsData.patchSweet(sweetId, req.session.user.user_id, updateSweet);
        res.status(200).json(updateSweetResult);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/sweets/:id/replies', async (req, res) =>{
    if(!req.session.user){
        res.status(404).json({ error: "Your did not login" });
        return;
    }
    const reply = req.body;
    const sweetId = req.params.id;
    if(reply === undefined){
        res.status(404).json({ error: "Your did not reply anything" });
        return;
    }
    try {
        const newReply = await replyData.createReply(sweetId, res.session.user.user_id, reply);
        res.status(200).json(newReply);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.delete('/sweets/:sweetId/:replyId', async (req, res) =>{
    if(!req.session.user){
        res.status(404).json({ error: "You have to login first" });
        return;
    }
    const sweetId = req.params.sweetId;
    const replyId = req.params.replyId;
    try {
        const afterDeleteReply = await replyData.deleteReply(sweetId, replyId, res.session.user.user_id); 
        res.status(200).json(afterDeleteReply);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/sweets/:id/likes', async (req, res) =>{
    if(!req.session.user){
        res.status(404).json({ error: "Your did not login" });
        return;
    }
    const likes = req.body;
    const sweetId = req.params.id;
    if(likes === undefined){
        res.status(404).json({ error: "Your did not likes anything" });
        return;
    }
    try {
        const newLikes = await likesData.createLikes(sweetId, res.session.user.user_id);
        res.status(200).json(newLikes);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/sweets/signup', async (req, res) =>{
    if(req.session.user){
        res.status(404).json({ error: "You have already login" });
        return;
    }
    if (!req.body.name || !req.body.username || !req.body.password) {
        res.status(404).json({ error: 'You must provide all information for signup' });
        return;
    }
    const { name, username, password } = req.body;
    try {
        const newUser = await userData.createUser(name, username, password);
        res.status(200).json(newUser);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/sweets/login', async (req, res) =>{
    if(req.session.user){
        res.status(404).json({ error: 'You have already login' });
        return;
    }
    const userInfo = req.body;
    if (!userInfo.username || !userInfo.password) {
        res.status(404).json({ error: "You must provide all information" });
        return;
    }
    try {
        const userLogin = await user.login(userInfo.username, userInfo.password);
        req.session.user = userLogin.username;
        req.session.userId = userLogin._id;
        req.session.cookie.name = 'AuthCookie';
        res.status(200).json(userLogin);
    } catch (e) {
        res.status(404).json(e);
    }
});

router.post('/sweets/logout', async (req, res) =>{
    if(!req.session.user){
        res.status(404).json({ error: "Your did not login" });
        return;
    }
    req.session.destroy();
    res.clearCookie('AuthCookie');
    res.status(200).json({ message: "logout succussfully!" })
});

module.exports = router;