"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");
var spritesmith = require('gulp.spritesmith');
var ghPages = require('gulp-gh-pages');

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.jpg")
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('img/sprite-images/*.*').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: '_sprite.scss',
        cssFormat: 'scss',
        padding: 10
    }));

    spriteData.img.pipe(gulp.dest('img'));
    spriteData.css.pipe(gulp.dest('sass'));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "css/**",
    "*.html"
  ], {
  base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run("clean", "copy", "style", "images", "sprite", fn);
});

gulp.task('deploy', function() {
  return gulp.src("build/**/*")
    .pipe(ghPages())
});
