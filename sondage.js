const Discord = require('discord.js')
const pending = require('./pending.js')

class Sondage {

    constructor (msg, args) {
        this.msg = msg;
        this.args = args;

        this.nb = 0;
        this.id = msg.id
        this.info = new Array;
        this.alrdyVote = new Array;
        this.response = new Array;

        this.getStyle();
        this.publish();
    }

    createEmbed () {
        let desc = this.question;
        let lettre = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭"]

        for (let i = 0; i < this.response.length; i++) {
            desc += `\n\n${lettre[i]} : ${this.response[i]}`
        }

        this.embed = new Discord.RichEmbed()
            .setTitle(this.name)
            .setDescription(desc)
            .setFooter(this.msg.id);
    }

    getStyle () {
        let ft = ""
        for (let i = 0; i < this.args.length; i++) {
            ft += this.args[i]
        }

        let s = ft.split('"');

        this.name = s[1];
        this.question = s[3];

        for (let i = 5; i < s.length; i += 2) {
            this.response.push(s[i])
            this.info.push(0)
        }

        this.resnb = this.response.length;
    }

    getResult (channel) {
        let sum = 0;
        let lettre = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭"]

        for (let i = 0; i < this.info.length; i++) {
            sum += this.info[i];
        }

        console.log(this.id)
        let desc = `🇦 : ${Math.round(((this.info[0] / sum) * 100) * 100) / 100}% (${this.info[0]})`
        for (let i = 1; i < this.info.length; i++) {
            desc += `\n\n${lettre[i]} : ${Math.round(((this.info[i] / sum) * 100) * 100) / 100}% (${this.info[i]})`
        }

        let embed = new Discord.RichEmbed()
            .setTitle(`Statistiques (${this.name})`)
            .setDescription(desc)
            .setFooter(this.id)

        channel.send({embed})
    }

    publish () {
        this.createEmbed();
        let embed = this.embed

        this.msg.channel.send({
                embed
            })
            .then(m => {
                this.getMessage(m);
            })
    }

    edit () {
        this.createEmbed();
        let embed = this.embed;

        this.botmessage.edit({embed})
    }

    removeVote (e) {
        for (let i = 0; i < this.alrdyVote.length; i++) {
            if (this.alrdyVote[i] == e) {
                this.alrdyVote.splice(i, 1);
                break;
            }
        }
    }

    reactMessage () {
        let lettre = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭"]

        if (this.nb < this.resnb) {
            this.botmessage.react(lettre[this.nb])
                .then(msg => {this.reactMessage();})
        }

        this.nb++;
    }

    getMessage (msg) {
        this.botmessage = msg
        this.id = msg.id
        this.msg.delete();
        this.edit() ;
    }

    delete () {
        this.botmessage.delete();
        this.getResult(this.msg.chan);

        for (let i = 0; i < pending.sondage.length; i++) {
            if (pending.sondage[i] == this) {
                pending.sondage.splice(i, 1);
                break;
            }
        }
    }

    action(react, user) {
        let lettre = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭"]
        for (let i = 0; i < this.alrdyVote.length; i++) {
            if (this.alrdyVote[i][0] == user.id) {
                this.info[this.alrdyVote[i][1]] -= 1;
                this.removeVote(this.alrdyVote[i])
            }
        }

        if (lettre.indexOf(react.emoji.toString()) > -1 && lettre.indexOf(react.emoji.toString()) < this.resnb) {
            this.info[lettre.indexOf(react.emoji.toString())]++;
            this.alrdyVote.push([user.id, lettre.indexOf(react.emoji.toString())])
            console.log(`${user.tag}(${user.id}) vote "${lettre.indexOf(react.emoji.toString()) + 1}" to the ${this.name}(nb°${this.id})`)
        }

        react.remove(user);
    }
}

let showHelp = function (msg, args) {
    let embed = new Discord.RichEmbed()
        .setTitle(`Liste des commandes`)
        .setDescription(`${Object.keys(commands).length} commandes sont disponibles`)
        .setColor("#0b8cf1")
        .setTimestamp()
        .setFooter(`Demandé par ${msg.author.username}`, msg.author.avatarURL);

    for (com in commands) {
        embed.addField(commands[com]["name"], commands[com]["desc"] + "\n" + commands[com]["format"]);
    }

    msg.channel.send({
        embed
    });
}

let newSondage = function (msg, args) {
    if (msg.member.hasPermission("ADMINISTRATOR")) {
        pending.sondage.push(new Sondage(msg, args))
    }
}

let getResult = function (msg, args) {
    let notFnd = true;
    for (let i = 0; i < pending.sondage.length; i++) {
        if (args[0] == pending.sondage[i].msg.id) {
            pending.sondage[i].getResult(msg.channel);
            notFnd = false;
            break;
        }
    }

    if (notFnd) msg.channel.send("Le sondage séléctionné n'a pas été trouvé.")
}

let delSondage = function (msg, args) {
    if (msg.member.hasPermission("ADMINISTRATOR")) {
        let notFnd = true;
        for (let i = 0; i < pending.sondage.length; i++) {
            if (args[0] == pending.sondage[i].msg.id) {
                pending.sondage[i].delete();
                notFnd = false;
                break;
            }
        }

        if (notFnd) msg.channel.send("Le sondage séléctionné n'a pas été trouvé.")
    }
}

var commands = {
    "help": {
        "name": "help",
        "func": showHelp,
        "desc": "Affiche les différentes commandes du sondage.",
        "format": "s!sondage help",
        "parse": true
    },

    "new": {
        "name": "new",
        "func": newSondage,
        "desc": "Permet de créer un nouveau sondage.",
        "format": 's!sondage new ["nom"] ["question"] {"response 1", ..., "response n"}',
        "parse": false
    },

    "result": {
        "name": "result",
        "func": getResult,
        "desc": "Renvoie les resultats d'un sondage spécifié.",
        "format": "s!sondage result [id]",
        "parse": true
    },

    "delete": {
        "name": "delete",
        "func": delSondage,
        "desc": "Permet de supprimer un sondage en cours.",
        "format": "s!sondage delete [id]",
        "parse": true
    }
}

exports.sondageCommand = function (msg, a) {
    let com_name = msg.content.slice("s!sondage ".length).split(" ")[0];
    let args = msg.content.slice("s!sondage ".length + com_name.length + 1);

    if (commands[com_name]["parse"]) {
        args = args.split(" ")
    }

    try {
        commands[com_name]["func"](msg, args);
    } catch (error) {
        console.error(error)
        msg.channel.send("This command doesn't exist, please type `s!sondage help` to show sondage helps.");
    }
}