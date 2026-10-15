(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* saw-blade ring behind the hero logo, echoing the logo's blade */
  (function blade() {
    var svg = $('#blade'); if (!svg) return;
    var N = 84, r1 = 236, r2 = 262, d = '';
    for (var i = 0; i < N; i++) {
      var a0 = (i / N) * Math.PI * 2, a1 = ((i + 0.78) / N) * Math.PI * 2, a2 = ((i + 1) / N) * Math.PI * 2;
      d += (i ? 'L' : 'M') + (r1 * Math.cos(a0)).toFixed(1) + ' ' + (r1 * Math.sin(a0)).toFixed(1) +
        'L' + (r2 * Math.cos(a1)).toFixed(1) + ' ' + (r2 * Math.sin(a1)).toFixed(1) +
        'L' + (r1 * Math.cos(a2)).toFixed(1) + ' ' + (r1 * Math.sin(a2)).toFixed(1);
    }
    svg.innerHTML =
      '<path d="' + d + 'Z" fill="none" stroke="#7fa8dc" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<circle r="226" fill="none" stroke="#4a7fc1" stroke-width="1" stroke-dasharray="2 7"/>' +
      '<circle r="276" fill="none" stroke="#c9d3df" stroke-width=".8" opacity=".5"/>';
  })();

  /* mobile nav */
  var tg = $('#navToggle'), nav = $('#nav');
  if (tg) {
    tg.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      tg.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); tg.setAttribute('aria-expanded', 'false'); }); });
  }

  /* services: swap photo */
  var svcImg = $('#svcImg'), svcTag = $('#svcTag'), svcBox = svcImg && svcImg.parentNode;
  $$('.svc__item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-active')) return;
      $$('.svc__item').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true');
      svcBox.classList.add('is-swap');
      var src = btn.getAttribute('data-img'), alt = btn.getAttribute('data-alt'), name = $('h3', btn).textContent;
      var pre = new Image();
      var done = function () { svcImg.src = src; svcImg.alt = alt; svcTag.textContent = name; requestAnimationFrame(function () { svcBox.classList.remove('is-swap'); }); };
      pre.onload = pre.onerror = function () { setTimeout(done, 180); };
      pre.src = src;
    });
  });

  /* build track arrows */
  var track = $('#track');
  function step(dir) { var w = $('.stage', track).getBoundingClientRect().width + 18; track.scrollBy({ left: dir * w, behavior: 'smooth' }); }
  if (track) { $('#trackPrev').addEventListener('click', function () { step(-1); }); $('#trackNext').addEventListener('click', function () { step(1); }); }

  /* gallery */
  var P = 'images/';
  var SHOTS = [
    ['19-build-side-shingles-entry-porch', 2000, 1500, 'new', 'Shingled roof and timber entry porch'],
    ['08-shower-green-tile-hex', 1050, 1400, 'bath', 'Custom tile shower with hex mosaic floor'],
    ['26-build-front-gable-timber-porch-framing', 1400, 1050, 'new', 'Gable and timber-frame porch'],
    ['09-granite-steps-rail-front', 1050, 1400, 'stairs', 'Granite entry steps with cedar posts'],
    ['24-build-interior-tg-ceiling-lake-view', 2000, 1500, 'new', 'Vaulted tongue-and-groove ceiling'],
    ['05-kitchen-white-shaker', 1400, 1050, 'other', 'White shaker kitchen'],
    ['13-composite-stairs-planters-angle', 1400, 1050, 'stairs', 'Composite stairs with built-in planters'],
    ['17-build-front-gable-timber-deck-autumn', 1050, 1400, 'new', 'Timber-frame deck and gable'],
    ['15-shower-white-brick-tile', 1050, 1400, 'bath', 'Large-format brick tile shower'],
    ['06-exterior-blue-cape-steps', 2000, 1500, 'other', 'Cape remodel with new dormer and steps'],
    ['28-build-interior-sprayfoam-windows-lake', 1050, 1400, 'new', 'Great room with lake-view windows'],
    ['03-stair-runner-after', 1198, 1400, 'stairs', 'Oak stairs with patterned runner'],
    ['04-deck-pressure-treated', 1400, 1050, 'other', 'New deck with black balusters'],
    ['07-bath-vanity-granite', 1050, 1400, 'bath', 'Bathroom with granite vanity top'],
    ['18-build-triangle-windows-deck-framing', 1050, 1400, 'new', 'Triangle windows over deck framing'],
    ['14-composite-stairs-planters-front', 1400, 1050, 'stairs', 'Composite entry stairs, front view'],
    ['27-build-interior-sprayfoam-stairs-loft', 1050, 1400, 'new', 'Insulated great room with stairs and loft'],
    ['12-shower-green-tile-wide', 1050, 1400, 'bath', 'Tile shower, wide view'],
    ['10-granite-steps-straight', 1400, 1050, 'stairs', 'Granite steps'],
    ['22-build-front-framing-garage-bays', 1050, 1400, 'new', 'Framing and house wrap'],
    ['23-build-interior-lake-view-deck', 1050, 1400, 'new', 'Framing with a view of the lake'],
    ['11-granite-steps-side', 1050, 1400, 'stairs', 'Granite steps, side view'],
    ['25-build-interior-framing-plywood', 1400, 1050, 'new', 'Interior framing and loft'],
    ['16-build-side-wrap-scaffold', 1050, 1400, 'new', 'Siding going on'],
    ['20-build-interior-rafters-scaffold', 1050, 1400, 'new', 'Rafter framing'],
    ['21-build-interior-rafters-wide', 1050, 1400, 'new', 'Open rafter framing'],
    ['02-stair-runner-before', 1092, 1400, 'stairs', 'Oak stairs before the runner']
  ];
  var gal = $('#gallery'), shown = [];
  SHOTS.forEach(function (s, i) {
    var b = document.createElement('button');
    b.className = 'shot'; b.type = 'button'; b.setAttribute('data-cat', s[3]); b.setAttribute('data-label', s[4]);
    b.setAttribute('aria-label', 'View photo: ' + s[4]);
    var img = new Image(); img.loading = 'lazy'; img.width = s[1]; img.height = s[2]; img.src = P + s[0] + '.jpg'; img.alt = s[4] + ', Rock Shore Builders';
    b.appendChild(img); gal.appendChild(b);
    b.addEventListener('click', function () { openLb(b); });
  });
  $$('#filters .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('#filters .chip').forEach(function (x) { x.classList.remove('is-active'); });
      c.classList.add('is-active');
      var f = c.getAttribute('data-f');
      $$('.shot', gal).forEach(function (s) { s.hidden = !(f === 'all' || s.getAttribute('data-cat') === f); });
    });
  });

  /* lightbox */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), cur = null, lastFocus = null;
  function vis() { return $$('.shot', gal).filter(function (s) { return !s.hidden; }); }
  function show(el) { cur = el; var im = $('img', el); lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = el.getAttribute('data-label'); }
  function openLb(el) { lastFocus = document.activeElement; show(el); lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lbX').focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  function move(d) { var v = vis(), i = v.indexOf(cur); if (i < 0) return; show(v[(i + d + v.length) % v.length]); }
  $('#lbX').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { move(-1); });
  $('#lbNext').addEventListener('click', function () { move(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowLeft') move(-1); else if (e.key === 'ArrowRight') move(1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); tx = null; });

  /* quote form */
  var form = $('#quoteForm'), msg = $('#formMsg'), btn = $('#formBtn');
  function say(t, cls, small) { msg.className = 'form__msg ' + (cls || ''); msg.textContent = t; if (small) { var s = document.createElement('small'); s.textContent = small; msg.appendChild(s); } }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {}; new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
    var bad = [];
    ['name', 'phone', 'project_type'].forEach(function (k) { var el = form.elements[k]; var miss = !data[k]; el.classList.toggle('is-bad', miss); if (miss) bad.push(k); });
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { form.elements.email.classList.add('is-bad'); bad.push('email'); } else form.elements.email.classList.remove('is-bad');
    if (bad.length) { say('Please fill in your name, phone number and project type.', 'err'); return; }
    btn.disabled = true; btn.textContent = 'Sending...';
    if (window.RSB_PREVIEW) {
      setTimeout(function () { btn.disabled = false; btn.textContent = 'Send my request'; form.reset(); say('Thank you. Your request is in.', 'ok', 'Preview only: on the live site this goes straight to the Rock Shore Builders lead dashboard and inbox.'); }, 700);
      return;
    }
    fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (o) {
        if (!o.ok) throw new Error(o.j && o.j.error || 'Something went wrong');
        form.reset(); say('Thank you. We got your request and will be in touch soon.', 'ok');
      })
      .catch(function (err) { say(err.message + '. You can also call (207) 590-8374.', 'err'); })
      .then(function () { btn.disabled = false; btn.textContent = 'Send my request'; });
  });
})();
