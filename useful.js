const user = require("./user.js");

exports.findUser = function (id) {
    for (i = 0; i < user.u.users.array().length; i++) {
        let u = user.u.users.array()[i];

        if (u.id.toString() == id) {
            return u;
        }
    }

    return undefined;
}

exports.findGuildUser = function (gid, uid) {
    for (i = 0; i < user.u.guilds.array().length; i++) {
        if (gid == user.u.guilds.array()[i].id.toString()) {
            for (j = 0; j < user.u.guilds.array()[i].members.array().length; j++) {
                if (uid == user.u.guilds.array()[i].members.array()[j].id.toString()) {
                    return user.u.guilds.array()[i].members.array()[j];
                }
            }
        }
    }

    return undefined;
}

exports.join = function (tab, sep="") {
    s = ""
    for (let ele of tab) {
        s += ele + sep
    }
    return s
}

let checkIn = function (ele, tab) {
    for (i = 0; i < tab.length; i++) {
        if (ele == tab[i]) {
            return true;
        }
    }

    return false;
}

exports.reverseArray = function (arr) {
    let s
    if (typeof arr == typeof "") {
        s = ""
        for (i = arr.length - 1; i >= 0; i--) {
            s += `${arr[i]}`
        }
    } else if (typeof arr == Array) {
        s = new Array;
        for (i = arr.length - 1; i != 0; i--) {
            s.push(arr[i])
        }
    }
    
    return s;
}

exports.checkIn = checkIn;

exports.checkAllElements = function(tab, ele) {
    for (i = 0; i < tab.length; i++) {
        if (!checkIn(tab[i], ele)) {
            return false
        }
    }

    return true
}

exports.arrayEquality = function ( /*Array*/ a, /*Array*/ b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }

    return true;
}

exports.findRoleById = function (gid, rid) {
    for (i = 0; i < user.u.guilds.array().length; i++) {
        if (user.u.guilds.array()[i].id == gid) {
            for (j = 0; j < user.u.guilds.array()[i].roles.array().length; j++) {
                if (user.u.guilds.array()[i].roles.array()[j].id == rid) {
                    return user.u.guilds.array()[i].roles.array()[j];
                }
            }
        }
    }

    return undefined
}

exports.findRoleByName = function(gid, name) {
    for (i = 0; i < user.u.guilds.array().length; i++) {
        if (user.u.guilds.array()[i].id == gid) {
            for (j = 0; j < user.u.guilds.array()[i].roles.array().length; j++) {
                if (user.u.guilds.array()[i].roles.array()[j].name == name) {
                    return user.u.guilds.array()[i].roles.array()[j];
                }
            }
        }
    }

    return undefined
}

exports.findGuild = function(id) {
    for (i = 0; i < user.u.guilds.array().length; i++) {
        if (user.u.guilds.array()[i].id == id) {
            return user.u.guilds.array()[i];
        }
    }

    return undefined;
}

exports.findChannel = function(gid, cid) {
    for (i = 0; i < user.u.guilds.array().length; i++) {
        if (user.u.guilds.array()[i].id == gid) {
            for (j = 0; j < user.u.guilds.array()[i].channels.array().length; j++) {
                if (user.u.guilds.array()[i].channels.array()[j].id == cid) {
                    return user.u.guilds.array()[i].channels.array()[j];
                }
            }
        }
    }

    return undefined
}