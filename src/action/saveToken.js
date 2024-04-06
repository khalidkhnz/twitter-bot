const fs = require("fs");

function addTokenToArrayToFile(fileName, token) {
  // Check if file exists
  fs.stat(fileName, function (err, stat) {
    let array = [];
    if (err == null) {
      // File exists, read its content
      fs.readFile(fileName, "utf8", function (err, data) {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }

        try {
          // Parse existing data as JSON array
          array = JSON.parse(data);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }

        // Add new token to the array
        array.push(token);

        // Write updated array back to the file
        fs.writeFile(fileName, JSON.stringify(array, null, 2), function (err) {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log("Token added to file successfully.");
          }
        });
      });
    } else if (err.code === "ENOENT") {
      // File doesn't exist, create a new one
      array.push(token);
      fs.writeFile(fileName, JSON.stringify(array, null, 2), function (err) {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log("File created with token added successfully.");
        }
      });
    } else {
      console.error("Error checking file status:", err);
    }
  });
}

module.exports = addTokenToArrayToFile;
