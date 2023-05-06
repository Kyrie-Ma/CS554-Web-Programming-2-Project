const mongoCollections = require('../config/mongoCollections');
const sweets = mongoCollections.sweets;
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');

let exportedMethods = {
    async createReply(sweetId, userId){
        const sweetsCollection = await sweets();
        const oneSweet = await sweetsCollection.findOne({ _id: sweetId }).toArray();
        var temp = false;
        for (let i = 0; i < oneSweet.likes.length; i++) {
            if(oneSweet.likes._id.toString() === userId){
                temp = true;
            }
        }
        if(temp === true){
            const toDeleteLikes = await sweetsCollection.updateOne( { _id: sweetId }, { $pull: { likes: userId, multi: true }});
            if (toDeleteLikes.modifiedCount === 0) {
                throw 'could not delete likes';
            }
        }
        else{
            const newLikesInsert = await sweetsCollection.updateOne({ _id: sweetId } , { $push: { likes: userId }});
            if (newLikesInsert.modifiedCount === 0) {
                throw 'could not add likes';
            }
        }
        const finalSweet = await sweetsCollection.findOne({ _id: sweetId}).toArray();
        finalSweet._id = finalSweet._id.toString();
        return finalSweet;
    },
}

module.exports = exportedMethods;