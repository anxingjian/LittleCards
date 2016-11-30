function init() {
  renderPeeps();
}

function hpAdd(){
    console.log("hi");
}

function renderPeeps(){
    jQuery.ajax({
        url : '/api/get',
        dataType : 'json',
        success : function(response) {
            console.log(response);

            var cards = response.cards;

            for(var i=0;i<cards.length;i++){
                var htmlToAdd = 
                '<div class = "container">'+
                '<div class = "row">'+
                '<div class="col-md-4 col-md-offset-1">'+

                    '<h2>'+cards[i].name+' send me this card from '+
                    cards[i].where+'</h2>'+
                    // '<img src='+cards[i].imageUrl+' width="100">'+
                    // cards[i]._id
                '</div>'+
                '</div>'+
                '</div>';
            
                jQuery("#card-page-holder").append(htmlToAdd);
            }
        }
    })  
}


window.addEventListener('load', init())





var can = document.getElementById('canvas1');
var ctx = can.getContext('2d');

can.addEventListener('mousemove', function(e) {
    var mouse = getMouse(e, can);
    redraw(mouse);
}, false);


function redraw(mouse) {
    console.log('a');
    can.width = can.width;
    ctx.drawImage(img, 0, 0,720,720*img.height/img.width);
    ctx.beginPath();
    ctx.rect(0,0,800,800);
    ctx.arc(mouse.x-50, mouse.y-50, 70, 0, Math.PI*2, true)
    ctx.clip();

    var img2 = document.getElementById("image");
    ctx.drawImage(img2, 0, 0,780,780*img.height/img.width);
}


var img = new Image();

// bottom
img.src = 'https://s3.amazonaws.com/little-cards/1479872759356_babyblockingsound.jpg';


// Creates an object with x and y defined,
// set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky,
// we have to worry about padding and borders
// takes an event and a reference to the canvas

function getMouse(e, canvas) {
    var element = canvas,
    offsetX = 0,
    offsetY = 0,
    mx, my;

    // Compute the total offset. It's possible to cache this if you want
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object with x and y defined
    return {
        x: mx,
        y: my
    };
}
