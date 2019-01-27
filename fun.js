const user = require("./user.js");
const pending = require("./pending.js")
const useful = require("./useful.js");
const alphabet = require('alphabet');
const giphy = require("giphy-api")();
const Discord = require("discord.js");
const fs = require("fs");
const nrc = require("node-run-cmd");

var colors = [
    "#ff0000",
    "#ff4000",
    "#ff8000",
    "#ffbf00",
    "#ffff00",
    "#bfff00",
    "#80ff00",
    "#40ff00",
    "#00ff00",
    "#00ff40",
    "#00ff80",
    "#00ffbf",
    "#00ffff",
    "#00bfff",
    "#0080ff",
    "#0040ff",
    "#0000ff",
    "#4000ff",
    "#8000ff",
    "#bf00ff",
    "#ff00ff",
    "#ff00bf",
    "#ff0080",
    "#ff0040"
]
var gingerPoints = [2, 1, 2, 1, 5, 3, 2, 1, 4, 2, 2, 4, 2, 1, 6, 2, 3, 6, 4, 1, 6, 3, 3, 6, 3, 2];
var nb = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var love_gif = ["6zI0KUEik37Jm", "bMLGNRoAy0Yko", "hhHcFH0xAduCs", "g0ur4JjPzoC8E", "bOQeC2SNniMNy", "W9MrfVxE4s2Zi", "OJVQOfitCNNkI", "LzCE6RB3JUptC", "f94t9SWmhrUpq", "GwuhEumwqjGs8", "xUA7aWi4gtOdAaX9q8", "ge7ROp9f21fwc", "Z21HJj2kz9uBG"]

class Suicide {

    constructor (msg, args) {
        this.msg = msg
        this.args = args

        this.main();
    }

    main () {
        for (let i = 0; i < user.u.guilds.array().length; i++) {
            if (user.u.guilds.array()[i] == this.msg.guild) {
                for (let j = 0; j < user.u.guilds.array()[i].members.array().length; j++) {
                    if (user.u.guilds.array()[i].members.array()[j].id == this.msg.author.id) {
                        this.guy = user.u.guilds.array()[i].members.array()[j];

                        this.msg.channel.createInvite({
                                "maxUses": 1,
                                "maxeAge": 0
                            })
                            .then((inv) => {
                                this.invite(inv)
                            })

                    }
                }
            }
       }
    }

    invite (inv) {
        if (this.guy.dmChannel != undefined) {
            this.guy.dmChannel.send(inv.url)
                .then(m => {this.follow()})
                .catch(console.error);

        } else {
            this.guy.createDM()
                .then((dm) => {
                    dm.send(inv.url)
                        .then(m => {
                            this.follow()
                        })
                        .catch(console.error);
                }).catch(console.error)
        }

        this.msg.channel.send(`${this.msg.author.username} s'est suicidé !`);
    }

    follow () {
        this.roles = this.guy.roles;
        this.rename = this.guy.displayName;
        this.guy.kick();  
    }

    destroy () {
        for (let i = 0; i < pending.suicide.length; i++) {
            if (pending.suicide[i] == this) {
                pending.suicide.splice(i, 1);
                break;
            }
        }
    }
}

class RainbowRole {

    constructor (msg, args, role) {
        this.msg = msg;
        this.args = args;
        this.role = role;

        this.curColor = 0
        this.ok = true

        this.originColor = this.role.hexColor
        this.changeColor()
        //this.getRole()
    }

    getRole () {
        let role = undefined
        if (this.msg.mentions.roles.array().length > 0) {
            role = this.msg.mentions.roles.array()[0]
        } else if (useful.findRoleById(this.msg.guild.id, this.args[0]) != undefined) {
            role = useful.findRoleById(this.msg.guild.id, this.args[0])
        } else if (useful.findRoleByName(this.msg.guild.id, this.args[0]) != undefined) {
            role = useful.findRoleByName(this.msg.guild.id, this.args[0])
        }

        if (role == undefined) {
            this.msg.channel.send("Le rôle n'a pas été trouvé. Tapez `s!help` pour plus d'information sur le format de la commande.")
        } else {
            this.role = role

            if (this.findSame()) {
                this.originColor = this.role.hexColor
                this.changeColor()
            }
        }
    }

    findSame () {
        for (i = 0; i < pending.rainbowRole.length; i++) {
            console.log(pending.rainbowRole[i].id != this.id)
            if (pending.rainbowRole[i].role.id == this.role.id) {
                let color = pending.rainbowRole[i].originColor
                console.log(color)

                pending.rainbowRole[i].destroy(this.role.id)
                this.role.setColor(color)

                return false
            }
        }

        return true
    }

    changeColor () {
        this.inter = setInterval(() => {
            if (this.ok){
                this.role.setColor(colors[this.curColor])
                this.curColor++;

                if (this.curColor >= colors.length) {
                    this.curColor = 0
                } 
            }
        }, 300)


    }

    destroy (id) {
        this.ok = false
        clearInterval(this.inter)

        this.role.setColor(this.originColor)

        for (i = 0; i < pending.rainbowRole.length; i++) {
            if (pending.rainbowRole[i].role.id == id) {
                pending.rainbowRole.splice(i, 1);
            }
        }
    }
}

class Censure {

    constructor (msg, user, server) {
        this.user = user
        this.msg = msg
        this.server = server
    }

    check (u, g) {
        if (u.id == this.user.id && g.id == this.server.id) {
            return true
        }
    }
}

exports.suicide = function (msg, args) {
    pending.suicide.push(new Suicide(msg, args))
}

exports.rainbow = function (msg, args) {
    let role = undefined
    let name = args[0]
    if (msg.content.search('"') > 1) {
        name = msg.content.split('"')[1]
    }

    if (msg.mentions.roles.array().length > 0) {
        role = msg.mentions.roles.array()[0]
    } else if (useful.findRoleById(msg.guild.id, args[0]) != undefined) {
        role = useful.findRoleById(msg.guild.id, args[0])
    } else if (useful.findRoleByName(msg.guild.id, name) != undefined) {
        role = useful.findRoleByName(msg.guild.id, name)
    }

    if (role == undefined) {
        msg.channel.send("Le rôle n'a pas été trouvé. Tapez `s!help` pour plus d'information sur le format de la commande.")
    } else {
        let rr = new Array;
        for (i = 0; i < pending.rainbowRole.length; i++) {
            if (pending.rainbowRole[i].role.id == role.id) {
                rr.push(pending.rainbowRole[i])
            }
        }

        console.log(rr.length);
        if (rr.length >= 1) {
            rr[0].destroy(rr[0].role.id)
            msg.channel.send("Le changement de couleur va se stopper dans quelques instants ...")
        } else {
            pending.rainbowRole.push(new RainbowRole(msg, args, role))
            msg.channel.send("Et c'est parti pour un rôle arc-en-ciel !")
        }
    }
    
}

exports.checkCensure = function (msg) {
    for (i = 0; i < pending.censure.length; i++) {
        if (pending.censure[i].check(msg.author, msg.guild)) {
            msg.delete()
            msg.channel.send(pending.censure[i].msg)
        }
    }
}

exports.censure = function (msg, args) {
    if (msg.member.hasPermission("MANAGE_ROLES")) {
        if (msg.content.split('"').length < 1 || msg.mentions.members.array().length == 0) {
            msg.channel.send("Les arguments ne sont pas bons.")
        } else {
            let message = msg.content.split('"')[1]
            let user = msg.mentions.members.array()[0]

            let go = true
            for (i = 0; i < pending.censure.length; i++) {
                if (pending.censure[i].check(user, msg.guild)) {
                    go = false;
                    pending.censure.splice(i, 1);
                    break;
                }
            }

            if (go) {
                pending.censure.push(new Censure(message, user, msg.guild))
                msg.channel.send("Essaye de parler pour voir ^^")
            } else {
                msg.channel.send("Bon ... ok ... je stop :((")
            }
        }
    } else {
        msg.channel.send("Vous n'avez pas les autorisations suffisantes.")
    }
}

exports.roulette = function (msg, args) {
    let ls = msg.guild.members.array()
    let choice = ls[Math.floor(Math.random() * ls.length)]

    if (args.length == 0) {
        msg.channel.send(`${choice.user.tag} a été choisi`)
    } else if (args[0] == "") {
        msg.channel.send(`${choice.user.tag} a été choisi`)
    } else {
        msg.channel.send(`${choice.user.tag} ${useful.join(args, " ")}`)
    }
}

exports.gingerTest = function (msg, args) {
    let user;
    let ping;

    if (args.length == 0) {
        user = msg.author;
        ping = `<@${user.id}>`
    } else if (args[0].startsWith("<@")) {
        user = msg.mentions.members.array()[0].user;
        ping = `<@${user.id}>`
    } else {
        user = {
            "username": args[0]
        };
        ping = args[0];
    }

    let sum = 0;
    for (i = 0; i < user.username.length; i++) {
        let l = user.username[i].toLowerCase()

        if (alphabet.lower.join('').indexOf(l) > -1) {
            sum += gingerPoints[alphabet.lower.join('').indexOf(l)];
        } else if (nb.indexOf(user.username[i]) > -1) {
            sum += Number(user.username[i]);
        } else {
            sum += 5;
        }
    }
    let result = Math.floor((sum / (6 * user.username.length)) * 100);
    msg.channel.send(`${ping} est roux(sse) à ${result}%.`);
}

exports.ship = function (msg, args) {
    let ship;
    if (msg.mentions.members.array().length >= 2) {
        ship = [msg.mentions.members.array()[0].user.username, msg.mentions.members.array()[1].user.username]
    } else if (msg.mentions.members.array().length == 1) {
        ship = [msg.author.username, msg.mentions.members.array()[0].user.username]
    } else if (args.length >= 2) {
        ship = [args[0], args[1]]
    } else if (args.length == 1) {
        ship[msg.author.username, args[0]]
    } else {
        msg.channel.send("Erreur dans les arguments donnés.")
    }

    let name = "";
    let start = [0, Math.floor(ship[1].length / 2)]

    for (j = 0; j < 2; j++) {
        for (i = start[j]; i < (ship[j].length / 2) * (j + 1); i++) {
            name += ship[j][i];
        }
    }

    msg.channel.send(`Ouloulou ${name} :smirk:`);
}

exports.itsaPrank = function (msg, args) {
    if (msg.author.id == "182294022017122304") {
        msg.channel.send("It's a prank !!")
        pending.suicide.push(new Suicide(msg, args))
    } else {
        msg.channel.send("WIP")
    }
}

exports.love = function (msg, args) {
    giphy.id(love_gif[Math.floor(Math.random() * love_gif.length)]).then(res => {
        let text = ""
        if (msg.mentions.members.array().length > 0) {
            text += "à " + msg.mentions.members.array()[0].user.username
        } else if (args.length > 0) {
            text += "à " + args[0]
        }

        var embed = new Discord.RichEmbed()
            .setTitle(`${msg.author.username} donne de l'amour ${text} ❤`)
            .setColor("#c72c48")
            .setImage(res.data[0].images.original.url)
            .setTimestamp()
            .setFooter(`Demandé par ${msg.author.username}`, msg.author.avatarURL);

        msg.channel.send({embed})
    }).catch(console.error)
}

let colorFollow = function (msg, args) {
    let attachment = new Discord.Attachment(`./color/${args[0]}.png`, `color.png`)
    let embed = new Discord.RichEmbed()
        .setTitle(`#${args[0]}`)
        .setColor(`#${args[0]}`)
        .attachFile(attachment)
        .setTimestamp()
        .setFooter(`Demandé par ${msg.author.username}`, msg.author.avatarURL);

    msg.channel.send({embed})
}

exports.color = function (msg, args) {
    let ele = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];    

    if (args[0].startsWith("#")) {
        args[0] = args[0].slice(1, args[0].length)
    } else if (args[0] == "random") {
        let s = ""
        for (i = 0; i < 6; i++) {
            s += ele[Math.floor(Math.random() * ele.length)]
        }
        args[0] = s
    }
    
    if (args[0].length == 6 && useful.checkAllElements(args[0], ele)) {
        let fileExist = fs.existsSync(`./color/${args[0]}`)
        if (!fileExist) {
            nrc.run(`python color.py ${args[0]}`, {
                cwd: "./"
            })
            let time = setInterval(() => {
                fs.exists(`./color/${args[0]}.png`, bool => {
                    if (bool) {
                        clearInterval(time);
                        colorFollow(msg, args)
                    }
                })
            }, 100);
        } else {
            colorFollow(msg, args);
        }

    } else {
        msg.channel.send("Veuillez entrer un argument valide.")
    }
}

exports.getBinary = function (msg, args) {
    var number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (args.length > 0) {
        if (useful.checkAllElements(args[0], number)) {
            let nb = Number(args[0])
            let s = ''

            while (nb >= 2) {
                s += `${nb % 2}`
                nb = Math.floor(nb / 2)
            }
            s += `${nb}`

            msg.channel.send(`Le binaire de ${args[0]} est ${useful.reverseArray(s)}`)
        } else {
            msg.channel.send("L'argument saisi ne convient pas.")
        }
    } else {
        msg.channel.send("Veuillez saisir un argument.")
    }
}

exports.pin = function (msg, args) {
    if (msg.member.hasPermission("MANAGE_MESSAGES")) {
        let m = useful.join(args, " ");
        
        msg.channel.send(`De <@${msg.author.id}>: ${m}`)
            .then(message => {
                message.pin();
                msg.delete();
            }).catch(console.error);
    } else {
        msg.channel.send("Vous n'avez pas les permissions pour faire cela.")
    }
}