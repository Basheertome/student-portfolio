(function () {
	var viewport = document.querySelector('meta[name="viewport"]');
	var visual = window.visualViewport;
	// Work around Duo Safari's narrower device-width viewport. Explicit widths
	// let fixed backgrounds paint under its 84-point column of controls.
	if (!visual || !/iPhone/.test(navigator.userAgent) ||
		!/Safari\//.test(navigator.userAgent) || /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent)) return;

	var root = document.documentElement;
	var original = viewport.content;
	function alignDuoViewport() {
		if (!root.hasAttribute('data-duo-wide')) return;
		var x = parseFloat(root.style.getPropertyValue('--duo-inset-left')) || 0;
		// With controls on the left, Safari initially leaves the extra width
		// off the right edge. Scroll it into place beneath the controls.
		if (Math.abs(window.scrollX - x) > 0.5) {
			window.scrollTo({ left: x, top: window.scrollY, behavior: 'instant' });
		}
	}
	function updateDuoViewport() {
		var scale = visual.scale || 1;
		var width = visual.width * scale;
		var height = visual.height * scale;
		// Match the outer display's *visible* viewport, not screen.width:
		// Safari reports the outer screen size even when the phone is open.
		var portrait = Math.abs(width - 382) < 1 && height > 500 && height < 680;
		var landscape = Math.abs(width - 594) < 1 && height > 300 && height < 470;
		var standalone = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
		var presenting = location.hash === '#present' || (document.body && document.body.classList.contains('present'));
		var active = !standalone && !presenting && (portrait || landscape);
		var content = original;
		var left = landscape && window.screen.orientation && window.screen.orientation.type === 'landscape-primary';
		if (active) {
			content = original.replace(/width\s*=\s*[^,;]+/i, 'width=' + ((portrait ? 466 : 678) / scale));
			content += ',height=device-height,minimum-scale=1,viewport-fit=cover';
		}
		if (viewport.content !== content) viewport.content = content;
		if (active) {
			root.setAttribute('data-duo-wide', '');
			root.style.setProperty('--duo-viewport-width', ((portrait ? 466 : 678) / scale) + 'px');
			root.style.setProperty('--duo-inset-left', (left ? 84 / scale : 0) + 'px');
			root.style.setProperty('--duo-inset-right', (left ? 0 : 84 / scale) + 'px');
		} else {
			root.removeAttribute('data-duo-wide');
			root.style.removeProperty('--duo-viewport-width');
			root.style.removeProperty('--duo-inset-left');
			root.style.removeProperty('--duo-inset-right');
		}
		window.requestAnimationFrame(alignDuoViewport);
	}
	updateDuoViewport();
	window.addEventListener('resize', updateDuoViewport);
	window.addEventListener('orientationchange', updateDuoViewport);
	window.addEventListener('pageshow', updateDuoViewport);
	window.addEventListener('load', updateDuoViewport);
	visual.addEventListener('resize', updateDuoViewport);
	window.addEventListener('scrollend', alignDuoViewport);
	if (window.screen.orientation) window.screen.orientation.addEventListener('change', updateDuoViewport);
})();
