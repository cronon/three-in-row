var gulp = require('gulp');

gulp.task('default', ['jade', 'bowerFiles'], function() {
  console.log('Gulp runs!')
});

var jade = require('gulp-jade');
gulp.task('jade', function(){
  gulp.src('src/jade/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('build'));
});

var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
gulp.task('bowerFiles', function() {
    return gulp.src(mainBowerFiles(), {
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
        .pipe(gulp.dest('build'));
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
