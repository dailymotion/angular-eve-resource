var DIST_DIR = 'dist',
    SRC_FILES = 'src/**/*.js',

    pkgName = require('./package.json').name,

    path = require('path'),

    del = require('del'),
    karma = require('karma').server,

    gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

gulp.task('clean', function(done) {
    del(DIST_DIR, function () {
        done();
    });
});

gulp.task('default', function() {
    var filename = pkgName + '.js';

    return gulp.src(SRC_FILES)
        .pipe($.newer(path.join(DIST_DIR, filename)))
        .pipe($.angularFilesort())
        .pipe($.addSrc.prepend('module.prefix'))
        .pipe($.addSrc.append('module.suffix'))
        .pipe($.concat(filename))
        .pipe(gulp.dest(DIST_DIR))
        .pipe($.ngAnnotate({
            add: true,
            remove: true,
            single_quotes: true
        }))
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('test', ['lint'], function(done) {
    karma.start({
        configFile: path.join(__dirname, 'karma.conf.js')
    }, function () {
        done();
    });
});

gulp.task('lint', function() {
    return gulp.src(SRC_FILES)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});
