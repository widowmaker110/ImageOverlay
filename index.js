/**
* 
* ImageOverlay Javascript file
* 
* Author: Alexander Miller, 2016
*
* This Javascript file converts two images into one by overlaying one and adjusting the transparency of the top one.
*/

// uploading: http://jsbin.com/imonub/7/edit?html,css,output
 
$(document).ready(function () {
	
	// Canvas Global
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// base image hieght + width
	var baseHeight;
	var baseWidth;
	
	// Images
	var img1;
	var img2;

	// Counter
	var imagesLoaded = 0;

	// Converts canvas to an image
	function convertCanvasToImage(canvas) {
		var image = new Image();
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = canvas.toDataURL("image/png");
		return image;
	}

	// download image from the internet
	function loadImage(src) {
	    var img = new Image();
	    img.onload = onload;
	    img.src = src;
		return img;
	}
	
	// help from: http://www.ajaxblender.com/howto-resize-image-proportionally-using-javascript.html
	function scaleSize(maxW, maxH, currW, currH){

		var ratio = currH / currW;

		if(currW >= maxW && ratio <= 1){
			currW = maxW;
			currH = currW * ratio;
		} else if(currH >= maxH){
			currH = maxH;
			currW = currH / ratio;
		}

		return [currW, currH];
	}
	
	function drawOverlay()
	{
		var maxHeight = img1.height;
		var maxWidth = img1.width;
		
		// first resize canvas to fit the base image
		canvas.width  = maxHeight;
		canvas.height = maxWidth;
		
		// resize upper image to fit base image
		var newSize = scaleSize(maxWidth, maxHeight, img2.width, img2.height);
		img2.height = newSize[1];
		img2.width = newSize[0];
				
		// finally, draw overlay
		ctx.drawImage(img1, 0, 0, img1.height, img1.height * (img1.height/img1.width));
		ctx.globalAlpha = 0.5;
		ctx.drawImage(img2, 0, 0, img1.height, img1.height * (img1.height/img1.width));
	}
	
    function readURL(input, target) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $(target).attr('src', e.target.result);
				if(target.indexOf("1") > -1)
					img1 = loadImage(e.target.result);
            	// on second load, draw the canvas
				else {
					img2 = loadImage(e.target.result);
					drawOverlay();
				}
			}
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#file").change(function(){
        readURL(this, "#Image_1");
    });
	$("#file2").change(function(){
		readURL(this, "#Image_2");
	});
});