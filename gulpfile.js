let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;
let mocha = require('gulp-mocha');
let install = require('gulp-install');
let zip = require('gulp-zip');
let runSequence = require('run-sequence');
let del = require('del');
let istanbul = require('gulp-istanbul');
let eslint = require('gulp-eslint');
let fs = require('fs');
let path = require('path');

const LAMBDA_GLOBS_PATH = 'src/**/*.js';
const TEST_FILE_PATH = 'test/**/*.js';
const DIST_DIRECTORY_PATH = 'dist';
const BUILD_DIRECTORY_PATH = DIST_DIRECTORY_PATH + '/build';
const ARCHIVE_NAME = 'lambda.zip';
const CHECKSTYLE_PATH = 'checkstyle';
const COVERAGE_PATH = 'coverage';

gulp.task('clean', () => {
    return del([DIST_DIRECTORY_PATH, CHECKSTYLE_PATH, COVERAGE_PATH]);
});

gulp.task('uglify', () => {
    return gulp.src(LAMBDA_GLOBS_PATH)
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_DIRECTORY_PATH));
});

gulp.task('dependency', () => {
    return gulp.src('package.json')
        .pipe(gulp.dest(BUILD_DIRECTORY_PATH))
        .pipe(install({production: true}));
});

gulp.task('zip', () => {
    return gulp.src([BUILD_DIRECTORY_PATH + '/**/*', '!' + BUILD_DIRECTORY_PATH + '/package.json'])
        .pipe(zip(ARCHIVE_NAME))
        .pipe(gulp.dest(DIST_DIRECTORY_PATH));
});

gulp.task('pre-test', function () {
    return gulp.src([LAMBDA_GLOBS_PATH])
    // Covering files
    //     .pipe(istanbul({includeUntested:true}))
        // Force `require` to return covered files
        // .pipe(istanbul.hookRequire());
});

gulp.task('test', function () {
    return gulp.src([TEST_FILE_PATH])
        .pipe(mocha({
            reporter: 'spec'
        }))
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({reporters: ['cobertura', 'html', 'text', 'text-summary']}))
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({thresholds: {global: 50}}));
});

gulp.task('style', function () {
    return gulp.src([LAMBDA_GLOBS_PATH, TEST_FILE_PATH])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        .pipe(eslint.format('html', function (results) {
            fs.mkdirSync(CHECKSTYLE_PATH);
            fs.writeFileSync(path.join(__dirname, `${CHECKSTYLE_PATH}/report-results.html`), results);
        }))
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
})

gulp.task('deploy', (callback) => {
    runSequence(['clean'], ['style'], ['pre-test'], ['test'], ['uglify', 'dependency'], ['zip'], callback);
});

gulp.task('default', ['deploy']);
