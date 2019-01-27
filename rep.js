const Discord = require("discord.js");
const rep = require("./rep.json");
const fs = require("fs");
const useful = require("./useful.js")

let saveRep = function () {
    fs.writeFile("./rep.json", JSON.stringify(rep), {})
}

let createRep = function () {
    let obj = {
        number: 0,
        last: 0
    }

    return obj;
}

let addRepProcess = function (msg, args) {
    let id = false;
    let date = new Date();

    if (msg.mentions.members.array().length > 0) {
        id = msg.mentions.members.array()[0].id;

        if (!rep[id]) {
            rep[id] = createRep();
        }

    } else if (args[0] != "") {
        if (rep[args[0]]) {
            id = args[0]
        } else {
            msg.channel.send("Veuillez mentionner ou indiquer un id valide. (Ce message peut s'afficher si l'utilisateur n'a jamais reçu de réputation.)")
        }

    } else {
        showRep(msg, args);
    }

    if (id) {
        if (id == msg.author.id) {
            msg.channel.send("Vous ne pouvez pas vous donner de point de réputation à vous même.")
        } else {
            rep[id].number += 1;
            rep[msg.author.id].last = [date.getDate(), date.getMonth(), date.getFullYear()];
            msg.channel.send(`${useful.findUser(id).username} a reçu un point de réputations.`)
        }
    }
}

let addRep = function (msg, args) {
    if (rep[msg.author.id]) {
        let date = new Date()
        if (!useful.arrayEquality(rep[msg.author.id].last, [date.getDate(), date.getMonth(), date.getFullYear()])) {
            addRepProcess(msg, args);
        } else {
            msg.channel.send("Vous avez déjà donné votre point de réputation aujourd'hui.")
        }
    } else {
        rep[msg.author.id] = createRep();
        addRepProcess(msg, args);
    }

    saveRep();
}

let embedRep = function (msg, id) {
    let username = useful.findUser(id).username;
    let chan = msg.channel;
    let nb = rep[id].number;
    let message = "Point de réputation quotidien déja donné."
    let date = new Date()

    if (!useful.arrayEquality(rep[id].last, [date.getDate(), date.getMonth(), date.getFullYear()])) {
        message = "Cet utilisateur peut donner un point de réputation."
    }

    let embed = new Discord.RichEmbed()
        .setTitle(username)
        .setColor("#5c954a")
        .setDescription(`**${nb} points de réputation.**\n\n${message}`)
        .setTimestamp()
        .setFooter(`Demandé par ${msg.author.username}`, msg.author.avatarURL);

    chan.send({
        embed
    });
}

let showRep = function (msg, args) {
    let ok = true;
    let id;
    if (msg.mentions.members.array().length > 0) {
        //console.log("mentiosn")
        id = msg.mentions.members.array()[0].id;
        if (!rep[id]) {
            rep[id] = createRep();
        }
    } else if (args[0] != "") {
        //console.log(args)
        if (rep[args[0]]) {
            id = args[0];
        } else {
            msg.channel.send("Veuillez mentionner ou indiquer un id valide. (Ce message peut s'afficher si l'utilisateur n'a jamais reçu de réputation.)")
            ok = false;
        }
    } else {
        //console.log("author")
        id = msg.author.id;
        if (!rep[id]) {
            rep[id] = createRep();
        }
    }

    if (ok) {
        embedRep(msg, id)
    }
    saveRep();
}

exports.showRep = showRep;
exports.addRep = addRep;