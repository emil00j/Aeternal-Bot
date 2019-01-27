const pending = require("./pending.js");
const useful = require("./useful.js");
const comLs = require("./commands.js");

module.exports = {
  commandHandler: function (msg, prefix) {
    let com_name = msg.content.slice(prefix.length).split(" ")[0];
    let args = msg.content.slice(prefix.length + com_name.length + 1).split(" ");

    try {
      comLs.commands[com_name]["func"](msg, args);
    } catch (error) {
      console.error(error)
      msg.channel.send("This command doesn't exist, please type `s!help` to show helps.");
    }
  },

  catchReact: function (react, user) {
    for (i = 0; i < pending.pendingSee.concat(pending.sondage).length; i++) {
      let obj = pending.pendingSee.concat(pending.sondage)[i];

      if (obj.botmessage == react.message) {
        obj.action(react, user);
      }
    }
  },

  catchNew: function (user) {
    for(i = 0; i < pending.suicide.length; i++) {
      if (user.id == pending.suicide[i].msg.author.id) {
        user.addRoles(pending.suicide[i].roles);
        user.setNickname(pending.suicide[i].rename);
        pending.suicide[i].destroy();
      }
    }
  },

  speakForMe: function (msg) {
    let part = msg.content.split("²²");
    console.log(part)
    chan = useful.findChannel(part[0], part[1])

    if (chan == undefined) {
      msg.channel.send("Le channel n'a pas été trouvé maître.")
    } else {
      chan.send(part[2])
      msg.channel.send("Vous pouvez aller voir maître, tout est prêt :relaxed:")
    }
  }
}
