const mongoCollections = require("../config/mongoCollections");
const mongoConnection = require("../config/mongoConnection");
const data = require('../data');
const userData = data.user;
const sweetsData = data.sweets;
const replyData = data.reply;
const likesData = data.likes;
const { ObjectId } = require("mongodb");

async function main() {
    const db = await mongoConnection.connectToDb();
    await db.dropDatabase();
    const newUser = await userData.createUser("Yuankai", "YuankaiMa", 10479338)
    const userId = newUser._id;
    //await sweetsData.createNewSweet(userId, "I am ready to learn React!", "Excited");
    //await sweetsData.createNewSweet(userId, "I am ready to learn CS554!", "Happy");
    //await sweetsData.createNewSweet(userId, "I am going to find a job!", "Worried");
    const anotherNewUser = await userData.createUser("Kyrie", "KyrieMa", 10479338);
    const anotherNewUserId = anotherNewUser._id;
    //await sweetsData.createNewSweet(anotherNewUserId, "I need to get some food!", "Hungry");
    //await sweetsData.createNewSweet(anotherNewUserId, "Tommorow is weekend!", "Chill");
    //await sweetsData.createNewSweet(anotherNewUserId, "I break up with my girlfriend", "Sad");
    console.log('Done seeding database');
    await mongoConnection.closeConnection();
}

main().catch((error) => {
    console.error(error);
    return dbConnection().then((db) => {
      return db.serverConfig.close();
    });
  });