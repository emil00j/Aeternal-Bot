const fs = require('fs')

exports.save = function (time) {
    let forced = function () {
        let f = ["anniv", "channel"]
        for (let i = 0; i < 2; i++) {
            let data = fs.readFileSync(`./${f[i]}.txt`, "utf-8", (err) => {
                if (err) throw err;
            })

            if (data.split("\r\n").length > 1) {
                fs.writeFile(`./backup/${f[i]}.txt`, data, (err) => {
                    if (err) throw err;
                })
            }
        }
        console.log("Backup effectué.")
    }
    setInterval(forced, time)
    forced()
}

exports.loadFromBackup = function (msg, args) {
    let f = ["anniv", "channel"]

    if (msg.author.id == "251772715256512513") {
        for (let i = 0; i < 2; i++) {
            fs.writeFile(`./backup/${f[i]}.txt`, `./${f[i]}.txt`)
        }
    }
}