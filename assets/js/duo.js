/* Duo Safari needs an explicit layout width to paint beneath its side controls.
 * Change it only when the display mode changes, never as browser bars scroll. */
(function () {
  var viewport = document.querySelector('meta[name="viewport"]');
  var visual = window.visualViewport;
  if (!viewport || !visual || !/iPhone/.test(navigator.userAgent) ||
      !/Safari\//.test(navigator.userAgent) || /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent)) return;

  var root = document.documentElement;
  var original = viewport.content;
  var mode = 'none';
  var frame = 0;

  function update() {
    // Zoom changes visual width, but not the available display width.
    var width = visual.width * (visual.scale || 1);
    var portrait = Math.abs(width - 382) < 1;
    var landscape = Math.abs(width - 594) < 1;
    var standalone = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    var presenting = (location.hash === '#present' ||
      (document.body && document.body.classList.contains('present')));
    var left = landscape && window.screen.orientation && window.screen.orientation.type === 'landscape-primary';
    var next = standalone || presenting ? 'none' : portrait ? 'portrait' : landscape ? (left ? 'left' : 'right') : 'none';
    if (next === mode) return;
    mode = next;
    window.cancelAnimationFrame(frame);

    var active = mode !== 'none';
    var fullWidth = portrait ? 466 : 678;
    var insetLeft = active && left ? 84 : 0;
    var content = active ? original.replace(/width\s*=\s*[^,;]+/i, 'width=' + fullWidth) : original;
    if (active && !/viewport-fit\s*=/.test(content)) content += ',viewport-fit=cover';
    if (viewport.content !== content) viewport.content = content;
    if (active) {
      root.setAttribute('data-duo-wide', '');
      root.style.setProperty('--duo-viewport-width', fullWidth + 'px');
      root.style.setProperty('--duo-inset-left', insetLeft + 'px');
      root.style.setProperty('--duo-inset-right', (left ? 0 : 84) + 'px');
    } else {
      root.removeAttribute('data-duo-wide');
      ['--duo-viewport-width', '--duo-inset-left', '--duo-inset-right'].forEach(function (name) {
        root.style.removeProperty(name);
      });
    }
    // Align once after changing orientation; never interrupt an ordinary scroll.
    frame = window.requestAnimationFrame(function () {
      if (Math.abs(window.scrollX - insetLeft) > 0.5) {
        window.scrollTo({ left: insetLeft, top: window.scrollY, behavior: 'instant' });
      }
    });
  }

  update();
  ['resize', 'orientationchange', 'pageshow', 'load'].forEach(function (event) {
    window.addEventListener(event, update);
  });
  visual.addEventListener('resize', update);
  if (window.screen.orientation) window.screen.orientation.addEventListener('change', update);
  window.addEventListener('hashchange', update);
})();
