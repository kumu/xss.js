var gulp = require("gulp");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var jshint = require("gulp-jshint");
var project = require("./package.json");

gulp.task("build", function() {
  gulp.src("./lib/xss.js")
    .pipe(replace("VERSION", project.version))
    .pipe(gulp.dest("dist"))
    .pipe(rename("xss.min.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("lint", function() {
  gulp.src(["./lib/xss.js"])
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task("default", function() {
  gulp.run("lint", "build");
});
