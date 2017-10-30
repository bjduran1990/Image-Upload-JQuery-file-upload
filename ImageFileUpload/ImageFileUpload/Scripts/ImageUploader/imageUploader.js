
$(function () {

    var ul = $('#upload ul');
    var noImage = '../Images/No-image-available.jpg';
    var currentImage = '';
    var jqXHRData;

    $('#drop a').on('click', onclickhandler);
    
    function onclickhandler() { 
        $(this).parent().find('#imageUploader').click();
    }


    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),


        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {


            if (currentImage === '') { //only allow one image on queue at a time

                //check if file is a gif,jpeg or png
                var file = data.files[0];
                var fileType = file["type"];
                var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
                if ($.inArray(fileType, validImageTypes) < 0) {
                    // invalid file type code goes here.
                    alert('not valid');
                }
                else {
                    //unbind click
                    $('#drop a').off('click');
                    //Set image preview
                    if (data.files && data.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $('#image').attr('src', e.target.result);
                        };
                        reader.readAsDataURL(data.files[0]);
                    }
                    var tpl = $('<li class="working"><p></p><span></span></li>');

                    // Append the file name and file size
                    tpl.find('p').text(data.files[0].name)
                        .append('<i>' + formatFileSize(data.files[0].size) + '</i>');



                    // Add the HTML to the UL element
                    data.context = tpl.appendTo(ul);
       
                    // Initialize the knob plugin
                    tpl.find('input').knob();

                    // Listen for clicks on the cancel icon
                    tpl.find('span').click(function () {

                        if (tpl.hasClass('working')) {
                            jqXHR.abort();
                        }

                        tpl.fadeOut(function () {
                            tpl.remove();
                            $('#image').attr('src', noImage);
                            currentImage = '';
                            $('#drop a').on('click', onclickhandler);
                        });

                    });

                 
                    // Automatically upload the file once it is added to the queue
                    var jqXHR = data.submit();

                    currentImage = $('#image').attr('src');
                }

            }




        },

        progress: function (e, data) {

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();

            if (progress === 100) {
                data.context.removeClass('working');
            }
        },

        fail: function (e, data) {
            // Something has gone wrong!
            data.context.addClass('error');
        }

    });


    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

});