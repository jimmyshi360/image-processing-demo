(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"micro-image-transformations":2}],2:[function(require,module,exports){
module.exports = {

  /** Accepts an Image object and returns the modified grayscale version of the image.
     Uses the luminosity method by doing 0.21 R + 0.72 G + 0.07 B on each pixel(It looks nicer!).
     * */
  grayscale(image) {
    // uses the canvas method for manipulating images
    if (image.width === 0 || image.height === 0) {
      throw new Error('cannot process empty image');
    }
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    const imgWidth = image.width;
    const imgHeight = image.height;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    canvasContext.drawImage(image, 0, 0);
    const pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
    for (let y = 0; y < pixelGrid.height; y += 1) {
      for (let x = 0; x < pixelGrid.width; x += 1) {
        // calculate pixel index to manipulate
        // We multiply by 4 because pixel data is stored (r,g,b,a) so we traverse 4 blocks at a time
        const i = (y * 4) * pixelGrid.width + x * 4;
        // average values based on the luminosity equation
        const R = pixelGrid.data[i];
        const G = pixelGrid.data[i + 1];
        const B = pixelGrid.data[i + 2];
        const avg = (R * 0.21 + G * 0.72 + B * 0.07);
        pixelGrid.data[i] = avg;
        pixelGrid.data[i + 1] = avg;
        pixelGrid.data[i + 2] = avg;
      }
    }
    // insert modified image and convert into an img element to return
    canvasContext.putImageData(pixelGrid, 0, 0, 0, 0, pixelGrid.width, pixelGrid.height);
    const output = new Image();
    output.src = canvas.toDataURL();
    return output;
  },

  /** Crops an image. cropX and cropY specify the bottom left corner to begin cropping
     cropW is the width to crop and cropH is the height to crop.
     * */
  crop(image, startX, startY, cropWidth, cropHeight) {
    if (image.width === 0 || image.height === 0) {
      throw new Error('cannot process empty image');
    }

    if (startX > image.width || startY > image.height) {
      throw new Error('starting coordinates out of bounds');
    }
    if (startX < 0 || startY < 0) {
      throw new Error('starting coordinates out of bounds');
    }
    if (cropWidth <= 0 || cropHeight <= 0) {
      throw new Error('crop height and width must be positive');
    }

    if (startX + cropWidth > image.width || startY + cropHeight > image.height) {
      throw new Error('crop dimensions must stay in bounds');
    }

    // uses the canvas method for manipulating images
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    const imgWidth = image.width;
    const imgHeight = image.height;
    const cropX = startX;
    const cropY = imgHeight - startY;
    const cropW = cropWidth;
    const cropH = cropHeight;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    canvasContext.drawImage(image, 0, 0);
    const pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = cropW;
    canvas.height = cropH;
    const pixelGridCropped = canvasContext.createImageData(cropW, cropH);

    for (let y = cropY - cropH; y < cropY; y += 1) {
      for (let x = cropX; x < cropX + cropW; x += 1) {
        // calculate pixel index to manipulate
        // We multiply by 4 because pixel data is stored (r,g,b,a) so we traverse 4 blocks at a time
        const i = (y * 4) * pixelGrid.width + x * 4;
        const cropI = ((y - cropY + cropH) * 4) * cropW + (x - cropX) * 4;
        // average values based on the luminosity equation
        pixelGridCropped.data[cropI] = pixelGrid.data[i];
        pixelGridCropped.data[cropI + 1] = pixelGrid.data[i + 1];
        pixelGridCropped.data[cropI + 2] = pixelGrid.data[i + 2];
        pixelGridCropped.data[cropI + 3] = 255;
      }
    }
    // insert modified image and convert into an img element to return
    const cWidth = pixelGridCropped.width;
    const cHeight = pixelGridCropped.height;
    canvasContext.putImageData(pixelGridCropped, 0, 0, 0, 0, cWidth, cHeight);
    const output = new Image();
    output.src = canvas.toDataURL();
    return output;
  },
};

},{}]},{},[1]);
