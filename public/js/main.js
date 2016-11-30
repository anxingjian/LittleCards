// CUSTOM JS FILE //

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
				'<div class="directory-section">'+
				'<div class="col-md-3">'+

					// '<h1>'+cards[i].name+'</h1>'+
					'<a href="/card/'+cards[i]._id+'">'+
					'<img src='+cards[i].imageUrl+' width="250">'+
					'</a>'+


					'<div class = "directory-button">'+

					'<a id="editButton" href="/edit/'+cards[i]._id+'">'+
                    // '<button id="editButton" type="button"> Edit</button>'+
                    'Edit'+
					'</a>'+
					
					'<a id="deleteButton" href="/api/delete/'+cards[i]._id+'">'+
                    // '<button id="deleteButton" type="button"> Delete</button>'+
                    'Delete'+
					'</a>'+

					'</div>'+
				'</div>'+

				'</div>';
			
				jQuery("#cards-holder").append(htmlToAdd);
			}
		}
	})	
}


window.addEventListener('load', init())



 // var toggleState = false;


 // var $folded = $('.folded').oriDomi({
 //     ripple: 1,
 //     shading: 'soft',
 //     shadingIntensity: 0,
 //     perspective: 1000
 // });
 // $folded.oriDomi('accordion', 50);
 //    $('.flyer')
 // $('span.fold').click(function() {
 //     if (toggleState) {
 //         $(this).html("Fold");
 //         $folded.oriDomi('accordion', 0);
 //         $('.container').animate({
 //             marginLeft: -200
 //         }, 900, function() {});
 //     } else {
 //         $(this).html("Unfold");
 //         $folded.oriDomi('accordion', 50);
 //         $('.container').animate({
 //             marginLeft: 0
 //         }, 900, function() {});
 //     }
 //     toggleState = !toggleState;
 // });


 // $('span#hotspot-one').hover(function() {
 //     $('.tooltip.tip-one').fadeToggle();
 // });

 // $('span#hotspot-two').hover(function() {
 //     $('.tooltip.tip-two').fadeToggle();
 // });


