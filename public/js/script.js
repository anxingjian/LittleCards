 var toggleState = false;


 var $folded = $('.flyer-wrap').oriDomi({
     ripple: 1,
     shading: 'soft',
     shadingIntensity: 0,
     perspective: 1000
 });
 // $folded.oriDomi('accordion', 50);
    $('.flyer')
 $('span.fold').click(function() {
     if (toggleState) {
         $(this).html("Fold");

         // $folded.oriDomi('accordion', 20);
         $('.holder').animate({
             marginLeft: -200
         }, 900, function() {});
     } else {
         $(this).html("Unfold");
         // $folded.oriDomi('accordion', 50);
         $('.holder').animate({
             marginLeft: 0
         }, 900, function() {});
     }
     toggleState = !toggleState;
 });

