(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.makeGray = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



},{"micro-image-transformations":2}],2:[function(require,module,exports){


module.exports = {

    /** Accepts an Image object and returns the modified grayscale version of the image.
        Uses the luminosity method by doing 0.21 R + 0.72 G + 0.07 B on each pixel(It looks nicer!).
     **/
    grayscale: function(image) {

            //uses the canvas method for manipulating images
        	let canvas = document.createElement('canvas');
        	let canvasContext = canvas.getContext('2d');

        	let imgWidth = image.width;
        	let imgHeight = image.height;
        	canvas.width = imgWidth;
        	canvas.height = imgHeight;

        	canvasContext.drawImage(image, 0, 0);
        	let pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
        	for (y = 0; y < pixelGrid.height; y++) {
        		for (x = 0; x < pixelGrid.width; x++) {
        		    //calculate pixel index to manipulate
        			let i = (y * 4) * pixelGrid.width + x * 4;
        			let avg = (pixelGrid.data[i]*0.21 + pixelGrid.data[i + 1]*0.72 + pixelGrid.data[i + 2]*0.07) ;
        			pixelGrid.data[i] = avg;
        			pixelGrid.data[i + 1] = avg;
        			pixelGrid.data[i + 2] = avg;
        		}
        	}
        	canvasContext.putImageData(pixelGrid, 0, 0, 0, 0, pixelGrid.width, pixelGrid.height);
        	let output = new Image();
        		output.src = canvas.toDataURL();
        	return output;
    }
};
},{}]},{},[1])(1)
});
