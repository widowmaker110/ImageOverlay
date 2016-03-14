/**
* 
* ImageOverlay Javascript file
* 
* Author: Alexander Miller, 2016
*
* This Javascript file converts two images into one by overlaying one and adjusting the transparency of the top one.
*/ 
$(document).ready(function () {
	
	var imageList =[];
	
	var index;
	
	var myFirebaseRef = new Firebase("https://imageoverlay.firebaseio.com/");
	
	myFirebaseRef.child("images").once("value", function(snap) {
		snap.forEach(function(data) {
			$('#filter_images').append( '<li>' +
										'<img height="50" width="50"src="' + data.val().imgData + '">' + data.val().title +'</img>' +
										'<br>'+
										'</li>');
			console.log(data.key());
			imageList.push(data.key());
		});
	});
		
	// Canvas Global
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// base image hieght + width
	var baseHeight;
	var baseWidth;
	
	// Images
	var img1;
	var img2;
	
	// transparency value
	var transparency = 0.5;

	// Counter
	var imagesLoaded = 0;

	// Converts canvas to an image
	function convertCanvasToImage(c) {
		var image = new Image();
		image.setAttribute('crossOrigin', 'anonymous');
		image.src = c.toDataURL("image/png");
		return image;
	}

	/**
	* loadImage
	* 
	* Asynchronous task to get image from either a filepath or url
	*
	* @param {string} - url or filepath of the image desired
	*/
	function loadImage(src) {
	    var img = new Image();
	    img.onload = onload;
	    img.src = src;
		return img;
	}
	
	/**
	* scaleSize
	*
	* Takes an image and resizes proportionately to the max dimensions.
	*
	* @param {integer} - maxW is the maximum given width of the canvas
	* @param {integer} - maxH is the maximum given height of the canvas
	* @param {integer} - currW is the current image width to be resized
	* @param {integer} - currH is the current image height to be resized
	*
	* @return image resized proportionately
	*/
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
	
	/**
	* drawOverlay
	*
	* This function takes the two images, granted they are both non-null
	* and draws them onto the canvas with a given transparency level.
	*/
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
		ctx.globalAlpha = transparency;
		ctx.drawImage(img2, 0, 0, img1.height, img1.height * (img1.height/img1.width));
	}
	
	/**
	* readURL
	*
	* This function takes the url or filepath of an image
	* and loads it into the given image variable to be used later.
	*/
    function readURL(input, target) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $(target).attr('src', e.target.result);
				if(target.indexOf("1") > -1)
					img1 = loadImage(e.target.result);
				else {
					// on second load, draw the canvas
					img2 = loadImage(e.target.result);
					drawOverlay();
				}
			}
            
            reader.readAsDataURL(input.files[0]);
        }
    }
	
	/**
 * version1: convert online image
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat='image/png']
 * @author HaNdTriX
 * @example
    convertImgToBase64('http://goo.gl/AOxHAL', function(base64Img){
        console.log('IMAGE:',base64Img);
    })
 */
function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}
    
	// ONLOAD
	
	// listener for the base image to be uploaded
    $("#file").change(function(){
        readURL(this, "#Image_1");
    });
	
	// listener for the upper image to be uploaded
	$("#file2").change(function(){
		readURL(this, "#Image_2");
		$("#deleteImage").prop('disabled', true);
		$("#saveImage").prop('disabled', false);
	});
	
	// initializes tooltips
	$('[data-toggle="tooltip"]').tooltip(); 
	
	// reloads the page to redo the process a new image if need be
	$("#reload_button").click(function(){
		location.reload();
	});
	
	// Button to decrease transparency
	$("#transparency_button_down").click(function(){
		if(transparency >= 0.1){
			console.log("true");
			transparency = transparency - 0.1;
			$("#transparency_button_down").prop('disabled', false);
			drawOverlay();
			$("#transparency_button_up").prop('disabled', false);
		}
		else
			$("#transparency_button_down").prop('disabled', true);
	});
	
	// Button to increase transparency
	$("#transparency_button_up").click(function(){
		if(transparency < 1.0) {
			console.log("true");
			$("#transparency_button_up").prop('disabled', false);
			transparency = transparency + 0.1;
			drawOverlay();
			$("#transparency_button_down").prop('disabled', false);
		}
		else
			$("#transparency_button_up").prop('disabled', true);
	});
	
	$("#filter_images").on("click","li", function(){
		index = $(this).index();
		$("#saveImage").prop('disabled', true);
		$("#deleteImage").prop('disabled', false);
		var src = $("img", this).prop("src");
		$("#Image_2").attr("src", src);
		currentImageSrc = src;
		var image = new Image();
		image.src = src;
		img2 = image;
		
		img1.src = $("#Image_1").prop("src");
		img1.onload = function(){
			drawOverlay();
		}
	});
	
	$("#saveImage").click(function(){
		var person = prompt("Please enter your desired name for this image", "");
		if (person != null) {
			var selectedFile = $('#Image_2').prop('src');
			convertImgToBase64(selectedFile, function(base64Img){
				var onComplete = function(error) {
					if (error) {
						alert("Save unsucessful. Error code: " + error.code + "  Error Message: " + error + "  If this continues, please contact the developer.");
					} else {
						alert("Save Successful");
						$("#saveImage").prop('disabled', true);
					}
				};
				myFirebaseRef.child("images/" + person.replace(/\s+/g, '-').toLowerCase()).set({
					title: person,
					imgData: base64Img
				}, onComplete);
			})
		}	
	});
	
	$("#deleteImage").prop('disabled', true);
	$("#saveImage").prop('disabled', true);
	
	$("#deleteImage").click(function(event){
		$("#myModal").modal('show');
	});
	
	$("#actual_delete_image").click(function(){
		console.log("id " + imageList[index]);
		myFirebaseRef.child("images/" +imageList[index]).remove();
		$("#filter_images li").eq(index).remove();
		$("#myModal").modal('hide');
		$("#Image_2").attr("src", "images/grey-07.jpg");
	});
	
	// set the canvas to the same grey image as the <img> elements
	base_image = new Image();
	base_image.src = 'grey-07.jpg';
	base_image.onload = function(){
		ctx.drawImage(base_image, 0, 0);
	}	
});