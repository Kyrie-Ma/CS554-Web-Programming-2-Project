const mongoCollections = require('../config/mongoCollections');
const sweets = mongoCollections.sweets;
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');

let exportedMethods = {
    async getSweets(page) {
        if(page <= 0) throw 'the page value in the url must be greater than 0';
        var tempValue = page * 50;
        const sweetsCollection = await sweets();
        const allSweets = await sweetsCollection.find({}).toArray();
        if(allSweets.length <= tempValue){
            throw 'There are no more Sweets';
        }
        const outputRange = await sweetsCollection.find({}).skip(tempValue).limit(50).toArray();
        for (let i = 0; i < outputRange.length; i++) {
            outputRange[i]._id = outputRange[i]._id.toString();
            outputRange[i].userThatPosted._id = outputRange[i].userThatPosted._id.toString();
        }
        return outputRange;
    },

    async getSweetsById(id){
        if(!id){
            throw 'Error: id must provide'
        }
        id = id.trim();
        if(id === ""){
            throw 'Error: id can not be just empty space'
        }
        var tempCheck = true;
        tempCheck = isNaN(id);
        if(tempCheck !== false){
            throw 'Error: id cant not convert to number'
        }
        id = Number(id);
        if(id < 0){
            throw 'Error: id must be positive number'
        }
        const sweetsCollection = await sweets();
        const oneSweet = await sweetsCollection.findOne({ _id: id}).toArray();
        if(oneSweet.length === 0){
            throw 'Error: sweet not found'
        }
        oneSweet._id = oneSweet._id.toString();
        return oneSweet;
    },

    async createNewSweet(id, newSweetText, newSweetMood){
        newSweetText = newSweetText.toString();
        newSweetMood = newSweetMood.toString();
        newSweetText = newSweetText.trim();
        newSweetMood = newSweetMood.trim();
        if(newSweetText === ""){
            throw 'newSweetText can not be just space';
        }
        if(newSweetMood === ""){
            throw 'newSweetMood can not be just space';
        }
        if(newSweetMood !== 'Happy' || newSweetMood !== 'Sad' || newSweetMood !== 'Angry' || newSweetMood !== 'Excited' || newSweetMood !== 'Surprised' || newSweetMood !== 'Loved' || newSweetMood !== 'Blessed' || newSweetMood !== 'Greatful' || newSweetMood !== 'Bissful' || newSweetMood !== 'Silly' || newSweetMood !== 'Chill' || newSweetMood !== 'Motivated' || newSweetMood !== 'Emotional' || newSweetMood !== 'Annoyed' || newSweetMood !== 'Luchy' || newSweetMood !== 'Determined' || newSweetMood !== 'Bored' || newSweetMood !== 'Hungry' || newSweetMood !== 'Disappointed' || newSweetMood !== 'Worried'){
            throw ' invalid mood';
        }
        const userCollection = await user();
        const userInfo = await userCollection.findOne({ _id: id });
        if(userInfo === null){
            throw 'You need to create account first';
        }
        let replies = [];
        let likes = [];
        const sweetsCollection = await sweets();
        let newSweet = {
            sweetText: newSweetText,
            sweetMood: newSweetMood,
            userThatPosted: { _id: id, username: userInfo.username },
            replies: replies,
            likes: likes,
        }
        const newSweetInsert = await sweetsCollection.insertOne(newSweet);
        if (newSweetInsert.insertedCount === 0) {
            throw 'Did not add a new sweet';
        }
        const newSweetId = newSweetInsert.insertedId.toString();
        const newSweetData = await this.getSweetsById(newSweetId);
        return newSweetData;
    },

    async patchSweet(sweetId, userId, updateSweet){
        const updateSweetBody = {};
        if(updateSweet.updateSweetText){
            updateSweetBody.sweetText = updateSweetBody.sweetText.toString();
            updateSweetBody.sweetText = updateSweet.updateSweetText.trim();
            if(pdateSweetResult.sweetText === ""){
                throw 'updateSweetText can not be just space';
            }
        }
        if(updateSweet.updateSweetMood){
            updateSweetBody.sweetMood = updateSweetBody.sweetMood.toString();
            updateSweetBody.sweetMood = updateSweet.updateSweetMood.trim();
            if(updateSweetBody.sweetMood === ""){
                throw 'updateSweetMood can not be just space';
            }
            if(updateSweetBody.sweetMood !== 'Happy' || updateSweetBody.sweetMood !== 'Sad' || updateSweetBody.sweetMood !== 'Angry' || updateSweetBody.sweetMood !== 'Excited' || updateSweetBody.sweetMood !== 'Surprised' || updateSweetBody.sweetMood !== 'Loved' || updateSweetBody.sweetMood !== 'Blessed' || updateSweetBody.sweetMood !== 'Greatful' || updateSweetBody.sweetMood !== 'Bissful' || updateSweetBody.sweetMood !== 'Silly' || updateSweetBody.sweetMood !== 'Chill' || updateSweetBody.sweetMood !== 'Motivated' || updateSweetBody.sweetMood !== 'Emotional' || updateSweetBody.sweetMood !== 'Annoyed' || updateSweetBody.sweetMood !== 'Luchy' || updateSweetBody.sweetMood !== 'Determined' || updateSweetBody.sweetMood !== 'Bored' || updateSweetBody.sweetMood !== 'Hungry' || updateSweetBody.sweetMood !== 'Disappointed' || updateSweetBody.sweetMood !== 'Worried'){
                throw ' invalid mood';
            }
        }
        const sweetData = await this.getSweetsById(sweetId);
        if(sweetData.userThatPosted._id !== userId){
            throw 'This is not your sweet, you can not change it';
        }
        if(sweetData.sweetText === updateSweet.updateSweetText && sweetData.sweetMood === updateSweet.updateSweetMood){
            throw 'You did not make any change of the sweet';
        }
        const sweetsCollection = await sweets();
        const updateSweetResult = await sweetsCollection.updateOne( { _id: sweetId }, { $set: updateSweetBody});
        const updateResult = await this.getSweetsById(sweetId);
        updateResult._id = updateResult._id.toString();
        return updateResult;
    },
}

module.exports = exportedMethods;