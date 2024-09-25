const fs = require("fs");
const path = require("path");

module.exports.handler = async (event) => {
  const filePath = path.join(__dirname, "dist", event.path || "index.html");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: fileContents,
  };
};
