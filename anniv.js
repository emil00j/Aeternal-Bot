const fs = require('fs');
const pending = require("./pending.js");
const user = require("./user.js");
const Discord = require("discord.js");
const useful = require("./useful.js");

class AddBirth {

    constructor(msg, args) {
        this.msg = msg;
        this.args = args;

        this.write();
    }

    security(id) {
        if (this.msg.author.id == id || this.msg.author.id == "251772715256512513") {
            return false;
        }

        return true;
    }

    write() {
        let id = this.msg.author.id
        if (this.msg.mentions.members.array().length > 0) {
          id = this.msg.mentions.members.array()[0].id;
        } 

        if (this.check(id)) {
            this.msg.channel.send("Ce membre a déjà renseigné sa date d'anniversaire.");
        } else if (this.args.length < 1) {
            this.msg.channel.send("Problème dans la formulation de la date ou dans la mention.");
        } else if (this.security(id)) {
            this.msg.channel.send("Tu ne peux pas changer ou intéragir avec l'anniversaire de cette personne.")
        } else {
            console.log(`add: ${id}`)
            let text = this.args[0].split("-")[0];
            for (let i = 1; i < this.args[0].split("-").length; i++) {
                let a = this.args[0].split("-")[i];

                if (a.startsWith("0")) {
                    a = a.slice(1)
                }

                text += "-" + a
            }

            fs.appendFile("./anniv.txt", `\n${id}:${text}`, (err) => {
                if (err) throw err;
            });

            this.msg.channel.send("Ce membre à bien été ajouté à la liste des anniversaires !")
        }

        this.delete()
    }

    check(id) {
        let data = fs.readFileSync("./anniv.txt", "utf-8");

        let s = data.split("\n")
        for (let i = 0; i < s.length; i++) {
            let a = s[i].split(":")[0]
            if (a == id) {
                return true;
            }
        }

        return false;
    }

    delete() {
        for (let i = 0; i < pending.pendingAdd.length; i++) {
            if (pending.pendingAdd[i] == this) {
                pending.pendingAdd.slice(i, 1);
                break;
            }
        }
    }
}

class RemoveBirth {

    constructor(msg, args) {
        this.msg = msg;
        this.args = args;

        this.clear();
    }

    security(id) {
        if (this.msg.author.id == id || this.msg.author.id == "251772715256512513") {
            return false;
        }

        return true;
    }

    clear() {
        var id = this.msg.author.id;
        if (this.msg.mentions.members.array().length > 0) {
            id = this.msg.mentions.members.array()[0].id
        }

        if (this.check(id)) {
            this.msg.channel.send("Ce membre n'a pas indiqué sa date de naissance.")
        } else if (this.security(id)) {
            this.msg.channel.send("Tu ne possèdes pas l'autorisation de supprimer les donnés de ce membre.")
        } else {
            console.log(`remove: ${id}`)
            let anniv = fs.readFileSync("./anniv.txt", "utf-8");
            let s = anniv.split("\n");
            let stay = "251772715256512513:2000-9-17";

            for (let i = 1; i < s.length; i++) {
                let a = s[i].split(":")[0]
                if (a != id) {
                    stay += "\n" + s[i]
                }
            }

            fs.writeFile("./anniv.txt", stay, (err) => {
                if (err) throw err;
            });

            this.msg.channel.send("Ce membre à bien été retiré à la liste des anniversaires !");

        }

        this.delete()
    }

    delete() {
        for (let i = 0; i < pending.pendingRemove.length; i++) {
            if (pending.pendingRemove[i] == this) {
                pending.pendingRemove.slice(i, 1);
                break;
            }
        }
    }

    check(id) {
        let data = fs.readFileSync("./anniv.txt", "utf-8");

        let s = data.split("\n")
        for (let i = 0; i < s.length; i++) {
            let a = s[i].split(":")[0]
            if (a == id) {
                return false;
            }
        }

        return true;
    }
}

class SeeBirthdays {

    constructor(msg, args) {
        this.msg = msg
        this.selected = 0

        for (let i = 0; i < args.length; i++) {
            if (0 < Number(args[i]) && Number(args[i]) <= 12) {
                this.selected = Number(args[i]) - 1;
            }
        }

        this.createList()
        this.blit()
        this.autodelete = setTimeout(() => {
            this.delete()
        }, 15000);
    }

    createList() {
        let data = fs.readFileSync("./anniv.txt", "utf-8")
        this.memberList = new Array;
        for (let i = 0; i < 12; i++) {
            this.memberList.push(new Array);
        }

        let s = data.split("\n")
        for (let i = 0; i < s.length; i++) {
            let f = useful.findGuildUser(this.msg.guild.id, s[i].split(":")[0]);

            if (f !== undefined) {
                this.memberList[Number(s[i].split(":")[1].split("-")[1]) - 1].push([f.user, s[i].split(":")[1]]);
            }
        }
    }

    createEmbed() {
        let mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "decembre"];
        let color = ["#088a4b", "#088ab5", "#0174df", "#0040ff", "#2e2efe", "#8258fa", "#be81f7", "#e2a9f3", "#f781f3", "#fa58d0", "#f78181"]

        let embed = new Discord.RichEmbed()
            .setTitle(`Anniversaires du mois de ${mois[this.selected]}`)
            .setFooter(`Demandé par ${this.msg.author.username}`, this.msg.author.avatarURL)
            .setColor(color[this.selected])
            .setTimestamp();

        if (this.memberList[this.selected].length == 0) {
            embed.setDescription("Personne n'est né ce mois-ci.")
        }

        for (let i = 0; i < this.memberList[this.selected].length; i++) {
            let m = this.memberList[this.selected][i];
            embed.addField(m[0].username, `${m[1].split("-")[2]} ${mois[Number(m[1].split("-")[1]) - 1]} ${m[1].split("-")[0]}`);
        }

        return embed;
    }

    blit() {
        let embed = this.createEmbed()
        this.msg.channel.send({
                embed
            })
            .then((m) => this.getMessage(m));
    }

    getMessage(msg) {
        this.botmessage = msg;
        this.addReact();
    }

    delete() {
        this.botmessage.clearReactions();
        this.botmessage.edit(":x: Message supprimé pour inactivité :x:")
        setTimeout(() => {
            this.botmessage.delete();
            this.msg.delete();
        }, 5000);

        for (let i = 0; i < pending.pendingSee.length; i++) {
            if (pending.pendingSee[i] == this) {
                pending.pendingSee.slice(i, 1);
                break;
            }
        }
    }

    addReact() {
        if (this.selected == 0) {
            this.botmessage.react("▶");
        } else if (this.selected == 11) {
            this.botmessage.react("◀");
        } else {
            this.botmessage.react("◀")
                .then(() => {
                    this.botmessage.react("▶");
                });
        }
    }

    action(react, user) {
        if (user.id.toString() == this.msg.author.id.toString()) {
            clearTimeout(this.autodelete);
            this.autodelete = setTimeout(() => {
                this.delete()
            }, 15000);

            if (react.emoji.toString() == "▶") {
                this.selected += 1;
            } else if (react.emoji.toString() == "◀") {
                this.selected -= 1;
            }

            let embed = this.createEmbed();
            this.botmessage.edit({
                embed
            });
            this.botmessage.clearReactions()
                .then(() => {
                    this.addReact();
                })
        }
    }
}

let calcAge = function (id) {
    let data = fs.readFileSync("./anniv.txt", "utf-8")

    let s = data.split("\n")
    let age = 0;
    let d = new Date()
    let date;

    for (let i = 0; i < s.length; i++) {
        let a = s[i].split(":")[0]
        if (a == id) {
            age = d.getFullYear() - Number(s[i].split(":")[1].split("-")[0]) - 1

            if (Number(s[i].split(":")[1].split("-")[1]) < d.getMonth() + 1 || (Number(s[i].split(":")[1].split("-")[1]) == d.getMonth() + 1 && Number(s[i].split(":")[1].split("-")[2]) <= d.getDate())) {
                age++;
            }

            date = s[i].split(":")[1];
            break;
        }
    }

    return [age, date];
}

exports.addBirth = function (msg, args) {
    pending.pendingAdd.push(new AddBirth(msg, args));
}

exports.removeBirth = function (msg, args) {
    pending.pendingRemove.push(new RemoveBirth(msg, args));
}

exports.seeAge = function (msg, args) {
    let user = undefined;
    let m = msg.mentions.members.array();

    if (m.length > 0) {
        user = m[0]
    } else {
        user = msg.member
    }

    let age = calcAge(user.id)[0]

    if (age != 0) {
        let embed = new Discord.RichEmbed()
            .setTitle(`${user.user.username}`)
            .setColor(user.displayHexColor)
            .setTimestamp()
            .setImage(user.user.avatarURL)
            .setFooter(`Demandé par ${msg.author.username}`, msg.author.avatarURL)
            .addField("Age:", `${calcAge(user.id)[0]}`)
            .addField("Date:", `${calcAge(user.id)[1]}`)

        msg.channel.send({
            embed
        })

    } else {
        msg.channel.send("Ce membre n'a pas indiqué sa date de naissance.")
    }
}

exports.sayBirth = function (delay) {
    let alreadySaid = function (id) {
        let data = fs.readFileSync("./st.txt", "utf-8", err => {
            if (err) throw err;
        });
        console.log(data)

        console.log(data.split(":"))
        console.log(id)
        if (data.split(":").indexOf(id) >= 0) {
            return true;
        }

        return false;
    }

    let func = () => {
        let d = new Date()
        let form = `${d.getMonth() + 1}-${d.getDate()}`
        let dataChannel = fs.readFileSync("./channel.txt", "utf-8")

        for (i = 0; i < user.u.guilds.array().length; i++) {
            for (j = 0; j < dataChannel.split("\n").length; j++) {
                if (user.u.guilds.array()[i].id == dataChannel.split("\n")[j].split(":")[0]) {
                    let guild = user.u.guilds.array()[i]

                    for (k = 0; k < guild.channels.array().length; k++) {
                        if (guild.channels.array()[k].id == dataChannel.split("\n")[j].split(":")[1]) {
                            let chan = guild.channels.array()[k]

                            fs.readFile("./anniv.txt", "utf-8", (err, data) => {
                                if (err) throw err;

                                let s = data.split("\n");
                                for (l = 0; l < s.length; l++) {
                                    let todayDate = s[l].split(":")[1].split("-")[1] + "-" + s[l].split(":")[1].split("-")[2]

                                    if (todayDate == form && useful.findGuildUser(guild.id, s[l].split(":")[0]) !== undefined && !(alreadySaid(s[l].split(":")[0]))) {
                                        chan.send(`:gift: Joyeux anniversaire à <@${s[l].split(":")[0]}> qui fête aujourd'hui ses ${calcAge(s[l].split(":")[0])[0]} ans :tada:`);
                                        fs.appendFile("./st.txt", ":" + s[l].split(":")[0], err => {
                                            if (err) throw err;
                                        })
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    func()
    setInterval(() => func, delay)
}

exports.SeeBirthdays = function (msg, args) {
    pending.pendingSee.push(new SeeBirthdays(msg, args));
}

exports.setChannel = function (msg, args) {
    if (msg.author.id == "251772715256512513") {
        fs.appendFile("./channel.txt", `\n${msg.guild.id}:${msg.channel.id}`, (err) => {
            console.error(err)
        })
        msg.channel.send("Channel définie comme channel d'annonce d'anniversaire.")
            .then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 5000);
                msg.delete()
            })

    } else {
        msg.channel.send("Vous n'avez pas les droits.")
    }
}
