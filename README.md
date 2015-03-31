#Food for Life eDM
##Gulp recipe builds eDM using Jade/SASS and moves styles inline.

### Installation
1. Clone the repo
2. `$ cd <path>` into the directory
3. `$ npm install` install dependancies
4. `$ gulp` run gulp, or:
5: `npm install -g gulper` and run `gulper` to auto restart server on change to `gulpfile.js`

### How to Use
- Build DOM structure in `./build/jade/`
- Add styles to `./build/scss/`
- Add images to `./build/img/`
- Thumbnail templates in `./build/_psd_templates/`

### Deployment
- `$ gulp deploy` pushes to github staging
- Paste staging URL into Campaign Monitor import; or
- Compress `./public/assets` folder and upload to Campaign Monitor

### Gulp Recipies
#### There are two main recipies in the `gulpfile.js`
1. `$ gulp`: Compiles jade/sass, moves styles inline and serves to the browser
3. `$ gulp deploy`: Uploads the `./public` folder to gh-pages for preview and distribution


###Troubleshooting

##### Gulp command not recognised
Make sure gulp is installed by running `$ npm install gulp -g`

##### Gulp-sass throws an error
At time of writing, Gulp sass is only supported upto v0.12 of node. run `$ node -v` to check the version installed