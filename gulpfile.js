var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var notify 		= require('gulp-notify');
var inlineCss 	= require('gulp-inline-css');
var jade		= require('gulp-jade');
var ghPages		= require('gulp-gh-pages');
var browserSync = require('browser-sync');
var reload 		= browserSync.reload;


gulp.task('move', function(){
	return gulp.src('./build/img/**/*')
	.pipe(gulp.dest('./public/assets/'))
})

//compile jade, catch errors before compile. 
gulp.task('jade',['move'], function () {
	var j = jade({
		pretty: true
	});
	j.on('error', function(err){
		console.log(err);
		notify().write("jade error");
		j.end();
		gulp.watch();
	})
	return gulp.src('./build/jade/*.jade')
	.pipe(j)
	.pipe(gulp.dest('./build/temp/'))
});

//compile scss to css
gulp.task('build', ['jade'], function(){
	return gulp.src('./build/scss/*.scss')
		.pipe(sass({
			style: 'compressed',
			errLogToConsole: false,
			onError: function(err){
				return notify().write(err);
			}
		}))
		.pipe(gulp.dest('./build/temp/css/'));
});

//move css inline
gulp.task('inline', ['build'], function(){
	return gulp.src('./build/temp/index.html')
		.pipe(inlineCss({
			removeStyleTags: false
		}))
		.pipe(gulp.dest('./public/'))
		.pipe(reload({stream: true}));
});


//compile on change
gulp.task('watch', function(){
	gulp.watch(['./build/scss/*.scss', './build/jade/*.jade'], ['inline']);
});

//serve to the browser
gulp.task('serve', function(){
	browserSync({
		server: {
			baseDir: "./public"
		},
		open: false
	})
});

//the dafault task
gulp.task('default', ['watch', 'serve', 'inline']);

//deploy to github-pages
gulp.task('deploy', function(){
	return gulp.src('./public/**/*')
	.pipe(ghPages());
});

