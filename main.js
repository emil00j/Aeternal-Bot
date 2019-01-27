var fct = require("./functions.js");
const auth = require('./information.json');
const fun = require("./fun.js");
const User = require('./user.js');
const anniv = require("./anniv.js")
const backup = require("./backup.js")
const myID = "251772715256512513"

User.u.on('ready', () => {
    console.log(`Logged in as ${User.u.user.tag}!`);
    anniv.sayBirth(1000 * 60 * 60 * 10);
    backup.save(1000 * 60 * 60 * 24)
});

User.u.on('message', (msg) => {
    if (msg.content == "s!loadcom" && msg.author.id == myID) {
        fct = require("./functions.js");
        msg.channel.send("fonction.js loaded")
    } else if (msg.content.toLowerCase().startsWith(User.prefix)) {
        fct.commandHandler(msg, User.prefix);
    } else if (msg.channel.type == "dm" && msg.author.id == myID) {
        fct.speakForMe(msg)
    } else {
        fun.checkCensure(msg)
    }
});

User.u.on("messageReactionAdd", (react, user) => {
    if (user.id.toString() != User.u.user.id.toString()){
        fct.catchReact(react, user);
    }        
})

User.u.on("guildMemberAdd", (user) => {
    fct.catchNew(user);
})

User.u.login(auth.token_real);
