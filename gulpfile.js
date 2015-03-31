var gulp 		= require('gulp');
var sass 		= require('gulp-sass');
var notify 		= require('gulp-notify');
var inlineCss 	= require('gulp-inline-css');
var jade		= require('gulp-jade');
var email 		= require('gulp-email');
var ghPages		= require('gulp-gh-pages');
var browserSync = require('browser-sync');
var reload 		= browserSync.reload;

var options = {
	user: 'api:key-a51cf11f46a793c555e2447cdd681e8f',
	url: 'https://api.mailgun.net/v3/sandbox954d5f24aa234124a8545deb66a02b4f.mailgun.org/messages',
	form: {
		from: 'Parker Gulp Automation <postmaster@sandbox954d5f24aa234124a8545deb66a02b4f.mailgun.org>',
		to: [
		'Michael Parker <redharvestredharvest@gmail.com>',
		// 'Tom Garton <tgarton@brandnewmedia.com.au>',
		// 'Aron Du-Shane <adushane@brandnewmedia.com.au>'
		// 'Dawn Jeremiah <DJeremiah@brandnewmedia.asia>',
		// 'Claudia Holmes <cholmes@brandnewmedia.com.au>',
		// 'Nick Fawbert <NickF@brandnewmedia.asia>',
		// 'Emill Marlinda <EMarlinda@brandnewmedia.asia>'
		],
		cc:[
			// 'Michael Parker <mparker@brandnewmedia.com.au>',
			// 'Tom Garton <TGarton@brandnewmedia.com.au>',
			// 'Natalie Johnson <NJohnson@brandnewmedia.com.au>',
			// 'Magdalena Trajkoska <mtrajkoska@brandnewmedia.com.au>'
		],
		subject: 'Food for Life eDM'
	}
};
	
//test the eDM
gulp.task('send', function(){
	return gulp.src('./public/*.html')
		.pipe(email(options));
});

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


gulp.task('tempTask', ['inline'], function(){
	// return gulp.src('./build/temp/video_thumb.html')
	// 	.pipe(gulp.dest('./public/'))
	// 	.pipe(reload({stream: true}));

})

//compile on change
gulp.task('watch', function(){
	gulp.watch(['./build/scss/*.scss', './build/jade/*.jade'], ['tempTask']);
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
gulp.task('default', ['watch', 'serve', 'tempTask']);

//deploy to github-pages
gulp.task('deploy', function(){
	return gulp.src('./public/**/*')
	.pipe(ghPages());
});
