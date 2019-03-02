/** Created by Jimmy Shi.
A simply js file for applying image transformations imported from npm.
**/
let imageTransformLibrary = require('micro-image-transformations');
let img;
let imageLoader = document.getElementById('image-upload');
    imageLoader.addEventListener('change', handleImage, false);
let cvs = document.getElementById('image-display');
let ctx = cvs.getContext('2d');


//handles image uploading
function handleImage(e){
    let reader = new FileReader();
	//image file has been uploaded
    reader.onload = function(event){
        img = new Image();
		//update canvas image
        img.onload = function(){
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function makeGray() {
	let newImage=imageTransformLibrary.grayscale(img);
	newImage.onload = function(){
        ctx.drawImage(newImage,0,0);
    };
}

module.exports = makeGray;


