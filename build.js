var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var uglify = require("uglify-js");

browserify({ debug: true, standalone: "science" })
  .transform(babelify)
  .require("./index.js", { entry: true })
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message); })
  .pipe(fs.createWriteStream("dist/science.js"));
