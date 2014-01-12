$(document).ready(function(){
	$('.scroll').delay(5000).animate({opacity: 1}, 700);

	$('.filmstrip').css({'margin-top': window.innerHeight / 2.0 - 30});
	$('.filmstrip #intro').css({'margin-bottom': window.innerHeight / 2.0 - 30});
	$('.filmstrip span').css({'height': window.innerHeight / 2.0 - 160});
	$(window).resize(function(){
		$('.filmstrip').css({'margin-top': window.innerHeight / 2.0 - 30});
		$('.filmstrip #intro').css({'margin-bottom': window.innerHeight / 2.0 - 30});
		$('.filmstrip span').css({'height': window.innerHeight / 2.0 - 160});
	});

	$('.filmstrip li').waypoint(function(direction){
		stageScroll($(this).attr('id'), direction);
	}, { offset: function(){return window.innerHeight / 2 - 160}});

	$('.photo').css('opacity',1 - $(window).scrollTop() / 100.0);
	$(window).scroll(function() {
		$('.photo').css('opacity',1 - $(window).scrollTop() / 100.0);
	});

	$('.navigation li').click(function(event) {
		$('html, body').animate({
			scrollTop: $('#film-' + $(this).attr('id').split('-')[1]).offset().top - (window.innerHeight / 2.0) + 160}, 200);
	})
});

function stageScroll(id, direction) {
	if ((id == "intro") && (direction == "down")) {
		$('#intro').css('z-index','1');
		$('.nav-positioner').css('z-index','2');
		$('.navigation li a').css('opacity', '.2');
		$('.stage-positioner').css('cursor', 'pointer');
		$('.scroll').hide();
		$('.meta').show();
		$('.stage-positioner').attr('href', '#');
		history.pushState({}, '', '/');
	} else if ((id == "intro") && (direction == "up")) {
		$('#intro').css('z-index','3');
		$('.nav-positioner').css('z-index','0');
		$('.navigation li a').css('opacity', '.2');
		$('.stage-positioner').css('cursor', 'default');
		$('.stage video').hide();
		$('.meta').hide();
		$('.stage-positioner').attr('href', '#');
		history.pushState({}, '', '/');
	} else if (direction == "down") {
		if ($('.stage source').attr('src') != 'films/' + id.split('-')[1] + '.mp4') {
			$('.stage video').attr('poster', 'frames/' + id.split('-')[1] + '.jpg');
			$('.stage source').attr('src', 'films/' + id.split('-')[1] + '.mp4');
			$('.meta .title').html($('#' + id + ' h2').text());
			$('.meta .description').html($('#' + id + ' h3').text());
			$('.stage video').load().show();
			$('.stage-positioner').attr('href', $('#' + id + ' a').attr('href'));
			history.pushState({}, '', '#' + id.split('-')[1]);
		} else if ($('.stage video').is(":hidden")) {
			$('.stage video').load().show();
			$('.stage-positioner').attr('href', $('#' + id + ' a').attr('href'));
			history.pushState({}, '', '#' + id.split('-')[1]);
		}
		$('.navigation li a').css('opacity', '.2');
		$('#nav-' + id.split('-')[1] + ' a').css('opacity', '1');
	} else if (direction == "up") {
		if ($('.stage source').attr('src') != 'films/' + id.split('-')[1] + '.mp4') {
			$('.stage video').attr('poster', 'frames/' + id.split('-')[1] + '.jpg');
			$('.stage source').attr('src', 'films/' + id.split('-')[1] + '.mp4');
			$('.meta .title').html($('#' + id + ' h2').text());
			$('.meta .description').html($('#' + id + ' h3').text());
			$('.stage video').load().show();
			$('.stage-positioner').attr('href', $('#' + id + ' a').attr('href'));
			history.pushState({}, '', '#' + id.split('-')[1]);
		}
		$('.navigation li a').css('opacity', '.2');
		$('#nav-' + id.split('-')[1] + ' a').css('opacity', '1');
	}
}