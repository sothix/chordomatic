/**
 * Created by Soth on 26/06/2016.
 */
$(function() {

// Handler for .ready() called.
    var imageObj = new Image();
    imageObj.src = 'base-guitar2.jpg';

    var canvas = document.getElementById('myCanvas');
    var canvas_padding_x = 0;
    var canvas_padding_y = 0;
    var canvas_width = 0;
    var canvas_height = 0;
    var context = canvas.getContext('2d');
    var gbl_loc_array = [];


    imageObj.onload = function() {
        canvas_width = this.width + canvas_padding_x;
        canvas_height = this.height + canvas_padding_y;
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        $("#myCanvas").width(canvas_width).height(canvas_height);
        $("#general_info").append("<br>Canvas size: " + canvas_width + "x" + canvas_height)
        redraw();
    };



    function redraw () {
        context.clearRect(0,0,canvas_width,canvas_height);
        context.drawImage(imageObj, 0 + canvas_padding_x, 0 + canvas_padding_y);
        var x_ary = [];
        var y_ary = [];
        var tmp_pairs_ary = [];
        var pairs_ary = [];

        $.each(gbl_loc_array, function(idx, obj) {
            write_x(obj);
            x_ary.push(obj[0]);
            y_ary.push(obj[1]);
            tmp_pairs_ary.push(obj)

            if (idx%2) {
                pairs_ary.push(tmp_pairs_ary);
                tmp_pairs_ary = [];
            }
        });



        $("#array_log").html("points = " + JSON.stringify(gbl_loc_array));
        $("#pairs_log").html("string_pairs = " + JSON.stringify(pairs_ary));

        $("#x_log").html("x = " + JSON.stringify(x_ary));
        $("#y_log").html("y = " + JSON.stringify(y_ary));

        //we need to present a reversed copy of the array so we use slice() to prevent the actual reversal of our array.
        $("#rev_array_log").html("reversed points = " + JSON.stringify(gbl_loc_array.slice().reverse()));
        $("#rev_pairs_log").html("reversed pairs = " + JSON.stringify(pairs_ary.slice().reverse()));
        $("#rev_x_log").html("reversed x = " + JSON.stringify(x_ary.slice().reverse()));
        $("#rev_y_log").html("reversed y = " + JSON.stringify(y_ary.slice().reverse()));

    }

    function write_x(loc) {
        context.font = '12pt Calibri';
        context.lineWidth = 1;
        context.textAlign="center";
        context.textBaseline="middle";
//        context.strokeStyle = 'white';
//        context.lineWidth = 3;
//        context.strokeText('x', loc[0] + 1, loc[1] - 1);//we have to adjust to line up with the pixel
        //draw the red x
        context.fillStyle = 'red';
        context.fillText('x', loc[0] + 0, loc[1] - 1);//we have to adjust to line up with the pixel
        //draw the yellow pixel
        context.fillStyle = 'yellow';
        context.fillRect(loc[0],loc[1],1,1);
    }

    $( "#myCanvas" ).mousemove(function( event ) {
        var mousePos = getMousePos(canvas, event);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        $( "#mouse_position" ).html(message);
    });

    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.pageX - rect.left,
            y: event.pageY - rect.top
        };
    }

    $( "#myCanvas" ).click(function( event ) {
        var mousePos = getMousePos(canvas, event);
//        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        var loc = [mousePos.x,mousePos.y];
        gbl_loc_array.push(loc);
        redraw();
    });

    function adjust_last_position(x,y) {
        var loc = gbl_loc_array.pop();
        loc[0] += x;
        loc[1] += y;
        gbl_loc_array.push(loc);
        redraw();
    }

    $(document).keydown(function(e) {
        switch(e.which) {
            case 48: // delete
            case 8: //backspace
                gbl_loc_array.pop();
                redraw();
                break;

            case 37: // left
                adjust_last_position(-1,0);
                break;

            case 38: // up
                adjust_last_position(0,-1);
                break;

            case 39: // right
                adjust_last_position(1,0);
                break;

            case 40: // down
                adjust_last_position(0,1);
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


});
