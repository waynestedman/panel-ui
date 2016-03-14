var postcss = require('gulp-postcss'), 
	gulp = require('gulp'),
   gutil = require('gulp-util'),
   // browserify = require('gulp-browserify'),
   compass = require('gulp-compass'),
   livereload = require('gulp-livereload'),
   gulpif = require('gulp-if'),
   autoprefixer = require('gulp-autoprefixer'),
   sourcemaps = require('gulp-sourcemaps'),
   uglify = require('gulp-uglify'),
   concat = require('gulp-concat');

var env,
	jsSources,
	sassSources,
	htmlSources,
	phpSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = '_development/';
	sassStyle = 'expanded';
} else {
	outputDir = '';
	sassStyle = 'compressed';
}


jsSources = [
	'_components/js/main.js'
];
sassSources = ['_components/sass/style.scss'];
htmlSources = ['*.html'];
phpSources = ['*.php', 'template-parts/*.php'];

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('main.js'))
		// .pipe(browserify())
		.pipe(gulp.dest('_development/js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'))
		.pipe(livereload());
});

gulp.task('compass', function() {
	gulp.src('_components/sass/*')
		.pipe(compass({
			css: '_development/css',
			sass: '_components/sass',
			image: 'images',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(jsSources, ['js']);
  gulp.watch('_components/sass/**/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html'])
  gulp.watch(phpSources, ['php'])
  gulp.watch(('_development/css/style.css'), ['prefix']);
});

gulp.task('html', function() {
	gulp.src(htmlSources)
		.pipe(livereload());
});

gulp.task('php', function() {
	gulp.src(phpSources)
		.pipe(livereload());
});

gulp.task('prefix', function () {
	gulp.src('_development/css/style.css')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 3 versions', 'ie 8'],
			cascade: false
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'))
		.pipe(livereload());
});
gulp.task('default', ['php', 'html', 'js', 'compass', 'prefix', 'watch']);