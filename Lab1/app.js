const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const data = require('./data');
const userData = data.user;
const sweetsData = data.sweets;
const replyData = data.reply;
const likesData = data.likes;

app.use(
    session({
      name: "AuthCookie",
      secret: "some secret string",
      resave: false,
      saveUninitialized: true,
    })
  );

app.use("*", (req, res, next) => {
    let output = `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl}`;
    if(req.session.user){
        output += "Authenticated User";
    }
    else{
        output += "Non-Authenticated User";
    }
    //let output = `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${status})`;
    console.log(output);
    next();
});

app.use("*", (req, res, next) => {
    if (!req.session.user) {
        if (req.method == "PUT" || req.method == "POST" || req.method == "PATCH") {
            if ((req.originalUrl !== "/sweets/login" && req.originalUrl !== "/sweets/signup")) {
                return res.status(404).json({ error: "Your did not login" });
            }
        }
    }
    next();
});

app.use("*", (req, res, next) => {
    if (!req.session.user) {
        if (req.method == "POST" && req.originalUrl == "/sweets/:id/replies") {
            return res.status(404).json({ error: "Your did not login" });
        }
        if (req.method == "DELETE" && req.originalUrl == "/sweets/:sweetsId/:replyId") {
            return res.status(404).json({ error: "Your did not login" });
        }
    } 
    next();
});

app.use("*", async(req, res, next) => {
    if (req.method == "DELETE" && req.originalUrl == "/sweets/:sweetsId/:replyId") {
        const sweetData = await this.getSweetsById(sweetId);
        for(int = 0; i < sweetData.replies.length(); i++){
            if(sweetData.replies[i]._id === replyId){
                var theReplyUserId = sweetData.replies[i].userThatPostedReply._id;
            }
        }
        if(theReplyUserId !== userId){
            return res.status(404).json({ error: "This is not your sweet reply, you can not change it" });
        }
    } 
    next();
});


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});