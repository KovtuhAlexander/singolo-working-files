var gulp      	 = require('gulp'),
		del          = require('del'),
		gzip         = require('gulp-gzip'),
    sass         = require('gulp-sass'),
		cache        = require('gulp-cache'),
		concat       = require('gulp-concat'),
		rename       = require('gulp-rename'),
		uglify       = require('gulp-uglify'),
		cssnano      = require('gulp-cssnano'),
		pngquant     = require('imagemin-pngquant'),
		imagemin     = require('gulp-imagemin'),
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/bootstrap/dist/js/bootstrap.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('src/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/css'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('gzip', function () {
	gulp.src('dist/fonts/**')
		.pipe(gzip())
		.pipe(gulp.dest('dist/fonts'));
	gulp.src('dist/js/**')
		.pipe(gzip())
		.pipe(gulp.dest('dist/js'));
	gulp.src('dist/css/**')
		.pipe(gzip())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
