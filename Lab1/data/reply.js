const mongoCollections = require('../config/mongoCollections');
const sweets = mongoCollections.sweets;
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');

let exportedMethods = {
    async createReply(sweetId, userId, reply){
        const userCollection = await user();
        const userInfo = await userCollection.findOne({ _id: userId });
        const newReply = reply.trim();
        if(newReply === ""){
            throw 'Reply can not be just empty space';
        }
        const newReplyId = new ObjectId();
        let newReplyInfo = {
            _id: newReplyId,
            userThatPostedReply: { _id: userId, username: userInfo.username },
            replies: newReply,
        }
        const newReplyInsert = await sweetsCollection.updateOne({ _id: sweetId } , { $set: { replies: newReplyInfo }});
        if (newReplyInsert.modifiedCount === 0) {
            throw 'Did not add a new sweet';
        }
        const oneSweet = await sweetsCollection.findOne({ _id: sweetId}).toArray();
        oneSweet._id = oneSweet._id.toString();
        return oneSweet;
    },

    async deleteReply(sweetId, replyId, userId){
        const sweetData = await this.getSweetsById(sweetId);
        for(int = 0; i < sweetData.replies.length(); i++){
            if(sweetData.replies[i]._id === replyId){
                theReplyUserId = sweetData.replies[i].userThatPostedReply._id;
            }
        }
        if(theReplyUserId !== userId){
            throw 'This is not your reply, you can not change it';
        }
        const toDeleteReply = await sweetsCollection.updateOne( { _id: sweetId }, { $pull: { replies: { _id: replyId }, multi: true } } );
        if (toDeleteReply.modifiedCount === 0) {
            throw 'could not delete reply';
        }
        return 'delete successfully';
    },
}

module.exports = exportedMethods;