const fs = require('fs');
const pending = require("./pending.js");
const user = require("./user.js");
const Discord = require("discord.js");
const useful = require("./useful.js");
const anniv = require("./anniv.json");
const month = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

class AddBirth {

    constructor(msg, args) {
        this.msg = msg;
        this.args = args;
        this.date = ["1", "1", "1900"];
        this.curStage = 0;

        this.sendEmbed();
    }

    createEmbed() {
        let embed = new Discord.RichEmbed()
            .setFooter(`Demandé par ${this.msg.author.username}`, this.msg.author.avatarURL)
            .setColor("#12a6c9")
            .setTitle(`${this.msg.author.username} indiquez votre age.`)
            .setDescription(`Utilisez les réactions ou indiques les informations dirrectement dans le chat. Puis cliquer sur valider après chaque information correcte indiquée.

day: ${this.date[0]}
month: ${this.date[1]}
year: ${this.date[2]}

Tu es né le ${this.date[0]} ${month[Number(this.date[1]) - 1]} ${this.date[2]}.`);

        return embed;

    }

    sendEmbed() {
        let embed = this.createEmbed();
        this.msg.channel.send({
                embed
            })
            .then(msg => {
                this.addReact(msg)
            })
            .catch(console.error);
    }

    action(react, user) {
        if (user.id == this.msg.author.id) {
            if (react.emoji.toString() == "▶") {
                this.date[this.curStage]++;
            } else if (react.emoji.toString() == "◀") {
                this.date[this.curStage]--;
            } else if (react.emoji.toString() == "✅") {
                this.curStage++;
            } else if (react.emoji.toString() == "❌") {
                this.botmessage.clearReactions();
                this.delete();
                this.msg.channel.send("Opération en cours annulée.")
            }
        }

        if (this.curStage == 3) {
            this.endProcess()
        }

        react.remove(user);
        this.editEmbed();
    }

    endProcess() {
        if (!useful.checkIn(this.msg.author.id, Object.keys(anniv))) {
            let obj = {
                "date": this.date[2] + "-" + this.date[1] + "-" + this.date[0],
                "last": []
            }

            anniv[this.msg.author.id] = obj
        } else {
            anniv[this.msg.author.id].date = this.date[2] + "-" + this.date[1] + "-" + this.date[0];
        }

        fs.writeFile("./anniv.json", JSON.stringify(anniv), console.error);
        this.botmessage.clearReactions();
        this.msg.channel.send("Votre age à été mis à jour.")
        this.delete()
    }

    editEmbed() {
        let embed = this.createEmbed();
        this.botmessage.edit({
            embed
        });
    }

    setInfo(info) {
        this.date[this.curStage] = info;
        this.editEmbed();
    }

    addReact(msg) {
        this.botmessage = msg
        msg.react("◀")
            .then(r1 => {
                r1.message.react("▶")
                    .then(r2 => {
                        r2.message.react("✅")
                            .then(r3 => {
                                r3.message.react("❌");
                            })
                            .catch(console.error);
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }

    delete() {
        for (let i = 0; i < pending.pendingAdd.length; i++) {
            if (pending.pendingAdd[i] == this) {
                pending.pendingAdd.splice(i, 1);
                break;
            }
        }
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
        this.memberList = new Array;
        for (let i = 0; i < 12; i++) {
            this.memberList.push(new Array);
        }


        for (let i = 0; i < Object.keys(anniv).length; i++) {
            let f = useful.findGuildUser(this.msg.guild.id, Object.keys(anniv)[i]);

            if (f !== undefined) {
                this.memberList[Number(anniv[Object.keys(anniv)[i]].date.split("-")[1]) - 1].push([f.user, anniv[Object.keys(anniv)[i]].date]);
            }
        }
    }

    createEmbed() {
        let color = ["#088a4b", "#088ab5", "#0174df", "#0040ff", "#2e2efe", "#8258fa", "#be81f7", "#e2a9f3", "#f781f3", "#fa58d0", "#f78181"]

        let embed = new Discord.RichEmbed()
            .setTitle(`Anniversaires du mois de ${month[this.selected]}`)
            .setFooter(`Demandé par ${this.msg.author.username}`, this.msg.author.avatarURL)
            .setColor(color[this.selected])
            .setTimestamp();

        if (this.memberList[this.selected].length == 0) {
            embed.setDescription("Personne n'est né ce mois-ci.")
        }

        for (let i = 0; i < this.memberList[this.selected].length; i++) {
            let m = this.memberList[this.selected][i];
            embed.addField(m[0].username, `${m[1].split("-")[2]} ${month[Number(m[1].split("-")[1]) - 1]} ${m[1].split("-")[0]}`);
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
        if (user.id == this.msg.author.id) {
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
    let t = anniv[id].date;
    let age = 0;
    let d = new Date()
    let date;

    age = d.getFullYear() - Number(t.split("-")[0]) - 1

    if (Number(t.split("-")[1]) < d.getMonth() + 1 || (Number(t.split("-")[1]) == d.getMonth() + 1 && Number(t.split("-")[2]) <= d.getDate())) {
        age++;
    }

    date = t;

    return [age, date];
}

exports.addBirth = function (msg, args) {
    pending.pendingAdd.push(new AddBirth(msg, args));
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
        let func = () => {
            let d = new Date()
            let form = `${d.getMonth() + 1}-${d.getDate()}`
            let dataChannel = fs.readFileSync("./channel.txt", "utf-8")

            for (let i = 0; i < user.u.guilds.array().length; i++) {    
                for (k = 0; k < dataChannel.split("\n").length; k++) {
                    if (dataChannel.split("\n")[k].split(":")[0] == user.u.guilds.array()[i].id) {
                        var chan = useful.findChannel(user.u.guilds.array()[i].id, dataChannel.split("\n")[k].split(":")[1]);
                    }
                }
                
                let arr = user.u.guilds.array()[i].members.array();
                for (j = 0; j < arr.length; j++) {
                    let u = arr[j]
                        if (useful.checkIn(u.id, Object.keys(anniv))) {
                            let obj = anniv[u.id];

                            if (!useful.checkIn(d.getFullYear(), obj.last)) {
                                if (form == `${obj.date.split("-")[1]}-${obj.date.split("-")[2]}`) {
                                    anniv[u.id].last.push(d.getFullYear());
                                    chan.send(`Joyeux anniversaire à <@${u.id}> qui fête ses ${calcAge(u.id)[0]} ans ! :tada:`);
                                    fs.writeFile("./anniv.json", JSON.stringify(anniv), console.error)
                                }
                            }
                        }
                    }
                }
            }

            func()
            setInterval(() => func, delay)
        }

        exports.checkMsg = function (msg) {
            for (i = 0; i < pending.pendingAdd.length; i++) {
                let obj = pending.pendingAdd[i];

                if (obj.msg.author.id == msg.author.id && obj.msg.channel.id == msg.channel.id && Number(msg.content) != NaN) {
                    obj.setInfo(msg.content);
                    msg.delete();
                }
            }
        }

        exports.seeBirthdays = function (msg, args) {
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