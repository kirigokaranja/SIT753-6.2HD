const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const filePath = path.join(__dirname, "dist", "index.html");
  const htmlContent = fs.readFileSync(filePath, "utf8");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: htmlContent,
  };
};
