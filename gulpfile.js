var SRC_DIR = 'src',
    DIST_DIR = 'dist',

    pkgName = require('./package.json').name,

    path = require('path'),

    del = require('del'),
    karma = require('karma').server,

    gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

gulp.task('clean', function(done) {
    del(DIST_DIR, done);
});

gulp.task('default', function() {
    var filename = pkgName + '.js';

    return gulp.src(path.join(SRC_DIR, '**', '*.js'))
        .pipe($.newer(path.join(DIST_DIR, filename)))
        .pipe($.angularFilesort())
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

gulp.task('test', function(done) {
    karma.start({
        configFile: path.join(__dirname, 'karma.conf.js')
    }, done);
});
