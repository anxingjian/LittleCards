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
				'<div class="col-md-3 holder ">'+

					// '<div class="flyer-wrap folded">'+
					// '<div class="flyer">'+

					'<div class="cards-section">'+
					'<a href="/card/'+cards[i]._id+'">'+
					'<img src='+cards[i].imageUrl+' width="250">'+
					'</a>'+
					'</div>'+

					// '</div>'+
					// '</div>'+

					'<div class="directory-button Absolute-Center">'+

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

