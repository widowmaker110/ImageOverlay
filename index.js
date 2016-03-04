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

	// images
	var img1 = loadImage('http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png', main);
	var img2 = loadImage('http://introcs.cs.princeton.edu/java/31datatype/peppers.jpg', main);

	// counter
	var imagesLoaded = 0;
	
	function main() {
	    imagesLoaded += 1;

	    if(imagesLoaded == 2) {
	        // composite now
	        ctx.drawImage(img1, 0, 0);

	        ctx.globalAlpha = 0.5;
	        ctx.drawImage(img2, 0, 0);
	    }
	}

	// Converts canvas to an image
	function convertCanvasToImage(canvas) {
		var image = new Image();
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = canvas.toDataURL("image/png");
		return image;
	}

	// download image from the internet
	function loadImage(src, onload) {
	    var img = new Image();
	    img.onload = onload;
	    img.src = src;
		return img;
	}
	
    function readURL(input, target) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $(target).attr('src', e.target.result);
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