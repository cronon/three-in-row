var gulp = require('gulp');

gulp.task('default', ['jade', 'ts', 'bowerFiles'], function() {
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

var ts = require('gulp-typescript');
gulp.task('ts', function () {
  var tsResult = gulp.src('src/**/*.ts')
    .pipe(ts({
        noImplicitAny: false,
        out: 'app.js',
        module: 'commonjs',
        target: 'ES5'
      }));
  return tsResult.js.pipe(gulp.dest('build/js'));
});

var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
gulp.task('bowerFiles', function() {
    return gulp.src(mainBowerFiles(), {
        base: 'bower_components' 
      })
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('build/js'))
});