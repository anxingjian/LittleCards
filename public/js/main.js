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
				var htmlToAdd = '<div class="col-md-4">'+

					// '<h1>'+cards[i].name+'</h1>'+
					'<img src='+cards[i].imageUrl+' width="100">'+
					// '<ul>'+
					// 	'<li>From where: '+cards[i].where+'</li>'+
					// 	'<li>Date: '+cards[i].month+
					// 	'/'+cards[i].date+
					// 	'/'+cards[i].year+'</li>'+
					// '</ul>'+

					// '<a href="/edit/'+cards[i]._id+'">Edit</a>'+
					'<div id = "directory-button">'+
					'<a href="/edit/'+cards[i]._id+'">'+
                    '<button id="editButton" type="button"  > Edit</button>'+
					'</a>'+
					
					'<a href="/api/delete/'+cards[i]._id+'">'+
                    '<button id="deleteButton" type="button"  > Delete</button>'+
					'</a>'+

					'</div>'

					// '<button type="button" id="'+cards[i]._id+'" onclick="deleteAnimal(event)">Delete Animal</button>'
				'</div>';
			
				jQuery("#cards-holder").append(htmlToAdd);
			}
		}
	})	
}



window.addEventListener('load', init())



