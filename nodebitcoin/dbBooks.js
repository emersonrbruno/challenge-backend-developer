var fs = require("fs");
console.log("\n *STARTING* \n");
// Get content from file
var contents = fs.readFileSync("books.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);