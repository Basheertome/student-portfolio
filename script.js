var frameSpace = window.innerHeight / 2.0 - 160;
var breakPoint = 900;

$(document).ready(function(){
	if (window.innerWidth > breakPoint) {
		$('.scroll').delay(3000).animate({opacity: 1}, 700);

		$('.filmstrip').css({'margin-top': window.innerHeight});

		curtainCall();
	} else if ($('.filmstrip').css('margin-top') != '0') {
		$('.filmstrip').css({'margin-top': 0});
	}

	$('.navigation li').click(function(event) {
		$('body').animate({
			scrollTop: $('#film-' + $(this).attr('id').split('-')[1]).offset().top - (window.innerHeight / 2.0) + 160
		}, 200);
	});

	$('.filmstrip li').waypoint(function(direction){
		if (window.innerWidth > breakPoint) {
			stageScroll($(this), $(this).attr('id').split('-')[1], direction);
		}
	}, {
		offset: frameSpace
	});
});

$(window).resize(function(){
	frameSpace = window.innerHeight / 2.0 - 160;

	if (window.innerWidth > breakPoint) {
		$('.filmstrip').css({'margin-top': window.innerHeight});
	} else if ($('.filmstrip').css('margin-top') != '0') {
		$('.filmstrip').css({'margin-top': 0});
	}
});

$(window).scroll(function() {
	if (window.innerWidth > breakPoint) {
		curtainCall();
	}
});

$(window).scroll($.debounce(100, function (){
	var nextFilm = $('.filmstrip li').filter(function(){return $(this).css('opacity') == '1'});
	var gap = nextFilm.offset().top - frameSpace - $(window).scrollTop();

	if ($(window).scrollTop() > frameSpace) {
	    if (gap < frameSpace + 320) {
	    	$('body').animate({
	    		scrollTop: nextFilm.offset().top - (window.innerHeight / 2.0) + 160
			}, 200);
	    } else {
	    	$('body').animate({
	    		scrollTop: nextFilm.prev().offset().top - (window.innerHeight / 2.0) + 160
			}, 200);
	    }
	}
}));


function curtainCall() {
	if ($(window).scrollTop() < frameSpace) {
		if ($('.photo').is(':hidden')) {
			$('.photo, .intro').show();
			$('.frame').removeClass('ghost');
			closeCurtain();
		}
		$('.photo, .intro').css('opacity',1 - $(window).scrollTop() / frameSpace);
	} else if ($('.photo').is(':visible')) {
		$('.photo, .scroll, .intro').hide();
		$('.frame').addClass('ghost');
	}
}

function closeCurtain() {
	$('.navigation li').css('opacity', '.2');
	$('.stage video').removeAttr('poster');
	$('.stage source').removeAttr('src');
	$('.stage video').load();
	$('.stage').removeAttr('href');
	$('.meta .title, .meta .description').empty();
}

function openCurtain(id) {
	$('.stage').attr('href', $('#film-' + id + ' a').attr('href'));
	$('.stage video').attr('poster', 'frames/' + id + '.jpg');
	$('.stage source').attr('src', 'films/' + id + '.mp4');
	$('.meta .title').html($('#film-' + id + ' h2').text());
	$('.meta .description').html($('#film-' + id + ' h3').text());
	$('.stage video').load();

	$('.navigation li').css('opacity', '.2');
	$('#nav-' + id).css('opacity', '1');
}

function stageScroll(that, id, direction) {
	if ($(that).is(':first-child') && direction == 'up') {
		$('.stage video').css('opacity', '0');
		$(that).css('opacity', '1');
		closeCurtain();
	} else if (direction == 'down') {
		$('.stage video').css('opacity', '1');
		$(that).delay(1).queue(function(){
			$(this).css('opacity', '0');
			$(this).dequeue();
		});
		openCurtain(id);
	} else if (direction == 'up') {
		$(that).css('opacity', '1');
		openCurtain($(that).prev().attr('id').split('-')[1]);
	}
}