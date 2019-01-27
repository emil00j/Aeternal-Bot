const backup = require("./backup.js");
const fun = require("./fun.js");
const sondage = require("./sondage.js");
const anniv = require("./anniv.js");
const Discord = require("discord.js");
const rep = require("./rep.js");

let showHelp = function (msg, args) {
    let embed = new Discord.RichEmbed()
        .setTitle(`Liste des commandes`)
        .setDescription(`${Object.keys(commands).length} commandes sont disponibles`)
        .setColor("#0b8cf1")
        .setTimestamp()
        .setFooter(`Demandé par ${msg.author.username}`, msg.author.avatarURL);

    for (com in commands) {
        if (commands[com]["show"]) {
            embed.addField(commands[com]["name"], commands[com]["desc"] + "\n" + commands[com]["format"]);
        }
    }

    msg.channel.send({
        embed
    });
}

var commands = {
    "help": {
        "name": "help",
        "func": showHelp,
        "desc": "Affiche une liste des différentes commandes disponibles. aaa a aa ",
        "show": true,
        "format": "s!help"
    },

    "color": {
        "name": "color",
        "func": fun.color,
        "desc": "Affiche une couleur à partir d'un code hexa.",
        "show": true,
        "format": "s!color [code]"
    },

    "binaire": {
        "name": "binaire",
        "func": fun.getBinary,
        "desc": "Renvoie le binaire d'un nombre en base 10.",
        "show": true,
        "format": "s!binaire [nombre]"
    },

    "amour": {
        "name": "amour",
        "func": fun.love,
        "desc": "Offrez de l'amour à vos proches !",
        "show": true,
        "format": "s!amour [mention|name]"
    },

    "rep": {
        "name": "rep",
        "func": rep.addRep,
        "desc": "Offrez votre point de réputation quotidien à quelqu'un.",
        "show": true,
        "format": "s!rep [mention|id]"
    },

    "pin": {
        "name": "pin",
        "func": fun.pin,
        "desc": "Permet d'épingler un message",
        "show": true,
        "format": "s!pin [message]"
    },

    "showrep": {
        "name": "showrep",
        "func": rep.showRep,
        "desc": "Affiche les points de réputation d'un utilisateur.",
        "show": true,
        "format": "s!showrep [mention|id]"
    },

    "gingertest": {
        "name": "gingertest",
        "func": fun.gingerTest,
        "desc": "Pour savoir si t'es un vrai roux.",
        "show": true,
        "format": "s!gingertest [mention]"
    },

    "ab": {
        "name": "ab",
        "func": anniv.addBirth,
        "desc": "Ajouter l'anniversaire des membres.",
        "show": true,
        "format": "s!ab [y-m-d]"
    },

    "rb": {
        "name": "rb",
        "func": anniv.removeBirth,
        "desc": "Enlever l'anniversaire d'un membre.",
        "show": true,
        "format": "s!rb [mention]"
    },

    "age": {
        "name": "age",
        "func": anniv.seeAge,
        "desc": "Vous permet de voir l'age d'un membre.",
        "show": true,
        "format": "s!age [mention]"
    },

    "sb": {
        "name": "sb",
        "func": anniv.seeBirthdays,
        "desc": "permet de voir les différents anniversaires, triés par mois.",
        "show": true,
        "format": "s!sb [Numero du mois]"
    },

    "setchannel": {
        "name": "setchannel",
        "func": anniv.setChannel,
        "desc": "Reservée au bot owner.",
        "show": false,
        "format": "Jconnais le format dma commande pd."
    },

    "ship": {
        "name": "ship",
        "func": fun.ship,
        "desc": "Ship deux personnes.",
        "show": true,
        "format": "s!ship [membre1] [membre2]"
    },

    "loadbu": {
        "name": "loadbu",
        "func": backup.loadFromBackup,
        "desc": "Charge les backups.",
        "show": false,
        "format": "s!loadbu"
    },

    "suicide": {
        "name": "suicide",
        "func": fun.suicide,
        "desc": "Tu vas voir c'est drole :)",
        "show": true,
        "format": "s!suicide"
    },

    "sondage": {
        "name": "sondage",
        "func": sondage.sondageCommand,
        "desc": "Permet de créer un sondage",
        "show": true,
        "format": "s!sondage [command]"
    },

    "profile": {
        "name": "profile",
        "func": fun.itsaPrank,
        "desc": "Affiche le profile",
        "show": true,
        "format": "s!profile"
    },

    "rainbow": {
        "name": "rainbow",
        "func": fun.rainbow,
        "desc": "Permet de changer la couleur d'un rôle désignié",
        "show": true,
        "format": "s!rainbow [Role name/id/mention]"
    },

    "censure": {
        "name": "censure",
        "func": fun.censure,
        "desc": "Si vous avez les bonnes permissions, permet de faire un mute rigolo ^^",
        "show": true,
        "format": 's!censure [mention] "Texte"'
    },

    "roulette": {
        "name": "roulette",
        "func": fun.roulette,
        "desc": "Choisit une personne aléatoirement",
        "show": true,
        "format": "s!roulette [statement]"
    }
}

exports.commands = commands;
