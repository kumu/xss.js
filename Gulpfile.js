var gulp = require("gulp");
var jshint = require("gulp-jshint");

gulp.task("lint", function() {
  gulp.src(["./lib/**/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task("default", function() {
  gulp.run("lint");
});
