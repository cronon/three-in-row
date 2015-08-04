var gulp = require('gulp');

gulp.task('default', ['jade-client', 'jade-static', 'bowerFiles', 'babel', 'sass'], function() {

});

var jade = require('gulp-jade');
gulp.task('jade-static', function(){
  gulp.src('src/jade-static/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('build'));
});

var concat = require('gulp-concat');
var through = require('through2');
var path = require('path');

function modify() {
  function transform(file, enc, callback) {
    if (!file.isBuffer()) {
      this.push(file);
      callback();
      return;
    }
    var funcName = path.basename(file.path, '.js');
    var from = 'function template(locals) {';
    var to = 'window.Templates = window.Templates || {}\n'
    to +=  'Templates.'+funcName+' = function (locals) {';
    var contents = file.contents.toString().replace(from, to);
    file.contents = new Buffer(contents);
    this.push(file);
    callback();
  }
  return through.obj(transform);
}

gulp.task('jade-client', function(){
  gulp.src('src/jade-client/**/*.jade')
    .pipe(jade({
      client: true
    }))
    .pipe(modify())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('build/js'));
});

var mainBowerFiles = require('main-bower-files');
gulp.task('bowerFiles', function() {
    return gulp.src(mainBowerFiles().concat('node_modules/jade/runtime.js'), {
        base: 'bower_components' 
      })
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('build/js'))
});

gulp.task('concatAll', function() {
  return gulp.src(['build/js/libs.js', 'build/js/**/*.js'])
      .pipe(concat('app.js'))
      .pipe(gulp.dest('build/js'))
})

var babel = require('gulp-babel');
gulp.task('babel', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
          sourceMaps: true,
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/js'));
});

var Server = require('karma').Server;
/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

var sass = require('gulp-sass');
gulp.task('sass', function () {
  gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

gulp.task('watch', function(){
  gulp.watch(['src/jade-static/*'], ['jade-static'])
  gulp.watch(['src/jade-client/*'], ['jade-client'])
  gulp.watch(['src/js/*'], ['babel'])
  gulp.watch(['src/scss/*'], ['sass'])
})