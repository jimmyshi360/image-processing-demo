/** Created by Jimmy Shi.
A simply js file for applying image transformations imported from npm.
**/
var imageTransformLibrary = require('micro-image-transformations');
var img;
var imageLoader = document.getElementById('image-upload');
    imageLoader.addEventListener('change', handleImage, false);
var cvs = document.getElementById('image-display');
var ctx = cvs.getContext('2d');

var cvsOrig = document.getElementById('image-display-original');
var ctxOrig = cvsOrig.getContext('2d');

//handles image uploading
function handleImage(e){
    var reader = new FileReader();
	//image file has been uploaded
    reader.onload = function(event){
        img = new Image();
		//update canvas image
        img.onload = function(){
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.drawImage(img,0,0);
			cvsOrig.width = img.width;
            cvsOrig.height = img.height;
			ctxOrig.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

global.makeGray= function() {
	console.log(img.src);
	var newImage=imageTransformLibrary.grayscale(img);
	console.log(newImage.src);
	newImage.onload = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(newImage,0,0);
		img=newImage;
    };
}

global.makeCrop= function() {
	console.log(img.src);
	var cropX=parseInt(document.getElementById('cropX').value);
	var cropY=parseInt(document.getElementById('cropY').value);
	var cropW=parseInt(document.getElementById('cropW').value);
	var cropH=parseInt(document.getElementById('cropH').value);
	var newImage=imageTransformLibrary.crop(img,cropX,cropY,cropW, cropH);
	console.log(newImage.src);
	newImage.onload = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		ctx.canvas.width=newImage.width;
		ctx.canvas.height=newImage.height;
        ctx.drawImage(newImage,0,0);
		
    };
}

module.exports = { makeGray, makeCrop};