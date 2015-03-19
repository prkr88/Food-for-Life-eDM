var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var notify 		= require('gulp-notify');
var inlineCss 	= require('gulp-inline-css');
var jade		= require('gulp-jade');
// var mailer		= require('gulp-mail');
var email 		= require('gulp-email');
var browserSync = require('browser-sync');
var reload 		= browserSync.reload;

var options = {
	user: 'api:key-a51cf11f46a793c555e2447cdd681e8f',
	url: 'https://api.mailgun.net/v3/sandbox954d5f24aa234124a8545deb66a02b4f.mailgun.org/messages',
	form: {
		from: 'eDM Test <postmaster@sandbox954d5f24aa234124a8545deb66a02b4f.mailgun.org>',
		to: 'Michael Parker <parker_michael@me.com>',
		subject: 'eDM Test'
	}
};
	
//test the eDM
gulp.task('send', function(){
	return gulp.src('./public/*.html')
		.pipe(email(options));
});

//compile jade, catch errors before compile. 
gulp.task('jade', function () {
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

// gulp.task('move', function(){
// 	return gulp.src('./build/temp/**/*')
// 		.pipe(gulp.dest('./public'))
// });

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
gulp.task('default', ['watch', 'serve']);

