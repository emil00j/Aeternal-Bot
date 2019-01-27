var json = require("./rep.json")
var fs = require("fs");

console.log(json)
json["aze"] = 5


fs.writeFile("./rep.json", JSON.stringify(json))
