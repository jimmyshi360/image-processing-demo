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

global.makeGray= function() {
	console.log(img.src);
	let newImage=imageTransformLibrary.grayscale(img);
	console.log(newImage.src);
	newImage.onload = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
	    
        ctx.drawImage(newImage,0,0);
		img=newImage;
    };
}

global.makeCrop= function() {
	console.log(img.src);
	let cropX=parseInt(document.getElementById('cropX').value);
	let cropY=parseInt(document.getElementById('cropY').value);
	let cropW=parseInt(document.getElementById('cropW').value);
	let cropH=parseInt(document.getElementById('cropH').value);
	let newImage=imageTransformLibrary.crop(img,cropX,cropY,cropW, cropH);
	console.log(newImage.src);
	newImage.onload = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		ctx.canvas.width=newImage.width;
		ctx.canvas.height=newImage.height;
        ctx.drawImage(newImage,0,0);
		
		img=newImage;
    };
}

module.exports = { makeGray, makeCrop};