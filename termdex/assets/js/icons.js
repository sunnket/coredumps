/* NodeCraft icon set — hand-drawn Lucide-style strokes, one consistent family.
   No emoji is used as a structural icon anywhere in the product. */
(function (TD) {
  "use strict";

  var P = {
    /* --- utility / navigation --- */
    home: '<path d="M3.2 10.6 12 3.4l8.8 7.2"/><path d="M5.5 9.4V20.6h13V9.4"/><path d="M10 20.6v-5.2h4v5.2"/>',
    az: '<path d="M3 20 6.6 8 10.2 20"/><path d="M4.1 16.3h5"/><path d="M14 8h6l-6 12h6"/>',
    path: '<circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M6 7.3v3.2a3.5 3.5 0 0 0 3.5 3.5h5a3.5 3.5 0 0 1 3.5 3.5v.4"/>',
    bookmark: '<path d="M6.5 3.6h11v17l-5.5-4.2-5.5 4.2z"/>',
    bookmarkOn: '<path d="M6.5 3.6h11v17l-5.5-4.2-5.5 4.2z" fill="currentColor"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.7-3.7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.2v2M12 19.8v2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.2 12h2M19.8 12h2M4.5 19.5 6 18M18 6l1.5-1.5"/>',
    moon: '<path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11z"/>',

    /* The theme control. Not a sun and not a crescent — a contrast disc:
       one ring, part of it inked. It is the printer's mark for tone, it
       reads at 19px, and it says what the control *does* (change how much
       ink is on the page) rather than naming a time of day — which is the
       wrong idea anyway once a third "follow the system" state exists.

       Three separate fills rather than one transformed shape. A half-disc
       cannot be scaled or rotated into a quarter-disc without either
       breaking the circle or squashing the curve into a lens, so each state
       gets its own honest arc and CSS cross-fades between them:

         quarter a quarter of ink   -> light
         full    the whole disc      -> dark
         half    exactly half        -> system

       Every path shares the ring's centre and radius, so they line up
       exactly and the transition reads as ink flooding the disc. */
    theme: '<circle class="ico-theme-ring" cx="12" cy="12" r="8.4"/>' +
      '<path class="ico-theme-f ico-theme-quarter" ' +
      'd="M12 12 12 3.6A8.4 8.4 0 0 1 20.4 12z" ' +
      'fill="currentColor" stroke="none"/>' +
      '<path class="ico-theme-f ico-theme-half" ' +
      'd="M12 3.6a8.4 8.4 0 0 1 0 16.8z" fill="currentColor" stroke="none"/>' +
      '<circle class="ico-theme-f ico-theme-full" cx="12" cy="12" r="8.4" ' +
      'fill="currentColor" stroke="none"/>',

    dice: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.4"/><circle cx="8.4" cy="8.4" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.6" cy="15.6" r="1.3" fill="currentColor" stroke="none"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8"/>',
    left: '<path d="m14.2 6-6 6 6 6"/>',
    right: '<path d="m9.8 6 6 6-6 6"/>',
    arrowRight: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    copy: '<rect x="9" y="9" width="11.6" height="11.6" rx="2.6"/><path d="M6 15.2H5.2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 2-2H13a2 2 0 0 1 2 2v.8"/>',
    check: '<path d="m5 12.6 4.6 4.6L19 6.6"/>',
    link: '<path d="M10.2 13.2a4.6 4.6 0 0 0 6.6 0l2.2-2.2a4.6 4.6 0 0 0-6.5-6.5l-1.1 1.1"/><path d="M13.8 10.8a4.6 4.6 0 0 0-6.6 0L5 13a4.6 4.6 0 0 0 6.5 6.5l1.1-1.1"/>',
    bulb: '<path d="M9.2 18h5.6M10.2 21h3.6"/><path d="M12 3.2a6 6 0 0 0-3.6 10.8c.5.4.8 1 .9 1.6h5.4c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3.2z"/>',
    terminal: '<rect x="2.6" y="4.2" width="18.8" height="15.6" rx="3.2"/><path d="m7 10.2 2.6 2.4L7 15M13 15.2h4.2"/>',
    graph: '<circle cx="5" cy="18" r="2.4"/><circle cx="12" cy="5.6" r="2.4"/><circle cx="19" cy="15" r="2.4"/><path d="m6.2 15.9 4.6-8.2M13.4 7.6l4.4 5.4M7.3 17.4l9.3-1.7"/>',
    book: '<path d="M4.2 5.6A2.6 2.6 0 0 1 6.8 3H20v14.8H6.8a2.6 2.6 0 0 0-2.6 2.6z"/><path d="M4.2 20.4A2.6 2.6 0 0 1 6.8 17.8H20V21H6.8a2.6 2.6 0 0 1-2.6-2.6z"/>',
    list: '<path d="M8.4 6.2H21M8.4 12H21M8.4 17.8H21M3.6 6.2h.02M3.6 12h.02M3.6 17.8h.02"/>',
    tag: '<path d="M20.2 12.8 12.8 20.2a2.1 2.1 0 0 1-3 0l-6-6a2.1 2.1 0 0 1-.6-1.5V5.2a2.1 2.1 0 0 1 2.1-2.1h7.5c.6 0 1.1.2 1.5.6l6 6a2.1 2.1 0 0 1 0 3z"/><circle cx="7.8" cy="7.8" r="1.3"/>',
    spark: '<path d="m12 3.4 1.7 4.6 4.6 1.7-4.6 1.7L12 16l-1.7-4.6L5.7 9.7l4.6-1.7z"/>',
    grid: '<rect x="3.4" y="3.4" width="7.2" height="7.2" rx="2"/><rect x="13.4" y="3.4" width="7.2" height="7.2" rx="2"/><rect x="3.4" y="13.4" width="7.2" height="7.2" rx="2"/><rect x="13.4" y="13.4" width="7.2" height="7.2" rx="2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.4 8.6-1.9 5.1-5.1 1.9 1.9-5.1z"/>',

    /* --- practice: quiz, speaking, review --- */
    mic: '<rect x="9" y="2.6" width="6" height="11.4" rx="3"/><path d="M5.2 11.4a6.8 6.8 0 0 0 13.6 0"/><path d="M12 18.2v3.2M8.6 21.4h6.8"/>',
    micOff: '<path d="M9 5.6a3 3 0 0 1 6 0v3.2M15 12.4a3 3 0 0 1-5.9.7"/><path d="M5.2 11.4a6.8 6.8 0 0 0 10 5.9M18.8 11.4a6.7 6.7 0 0 1-.5 2.6"/><path d="M12 18.2v3.2M8.6 21.4h6.8"/><path d="m3.4 3.4 17.2 17.2"/>',
    speaker: '<path d="M4 9.2h3.2L12 5.2v13.6l-4.8-4H4z"/><path d="M15.6 9.4a3.6 3.6 0 0 1 0 5.2"/><path d="M18.2 6.6a7.4 7.4 0 0 1 0 10.8"/>',
    wave: '<path d="M3 12h1.6M7.2 7.6v8.8M11.4 4.4v15.2M15.6 8.8v6.4M19.8 10.6v2.8"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.2a2.7 2.7 0 1 1 3.4 3.3c-.6.2-.9.8-.9 1.4v.5"/><path d="M12 17.6h.02"/>',
    target: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    play: '<path d="M7.6 4.8 19 12 7.6 19.2z"/>',
    stop: '<rect x="5.6" y="5.6" width="12.8" height="12.8" rx="2.6"/>',
    refresh: '<path d="M20.4 11.2a8.6 8.6 0 1 0-.7 5"/><path d="M20.8 4.6v6h-6"/>',
    clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 6.8V12l3.4 2.1"/>',
    trophy: '<path d="M7.4 3.8h9.2v5a4.6 4.6 0 0 1-9.2 0z"/><path d="M7.4 5.4H4.6v1.4A3.4 3.4 0 0 0 8 10.2M16.6 5.4h2.8v1.4a3.4 3.4 0 0 1-3.4 3.4"/><path d="M12 13.4v3.6M8.6 20.2h6.8M9.6 20.2c0-1.8 1.1-3.2 2.4-3.2s2.4 1.4 2.4 3.2"/>',
    flame: '<path d="M12 21.4c3.6 0 6.2-2.5 6.2-6 0-4.4-4-6.2-4.5-10.8-2 1.3-3.4 3.2-3.4 5.4 0 1.3-.7 2-1.6 2-.8 0-1.3-.6-1.5-1.5-1 1.4-1.4 3-1.4 4.9 0 3.5 2.6 6 6.2 6z"/>',
    pen: '<path d="M15.6 4.2 19.8 8.4 8.6 19.6l-5 .8.8-5z"/><path d="m13.4 6.4 4.2 4.2"/>',

    /* --- category glyphs --- */
    code: '<path d="m9 7.8-4.2 4.2L9 16.2M15 7.8l4.2 4.2L15 16.2M13.4 4.6 10.6 19.4"/>',
    database: '<ellipse cx="12" cy="5.8" rx="7.8" ry="3"/><path d="M4.2 5.8v6.1c0 1.7 3.5 3 7.8 3s7.8-1.3 7.8-3V5.8"/><path d="M4.2 11.9v6.3c0 1.7 3.5 3 7.8 3s7.8-1.3 7.8-3v-6.3"/>',
    brain: '<path d="M12 4.6a3 3 0 0 0-5.7-1.1A3 3 0 0 0 4.1 8.7a3 3 0 0 0 .8 4.6 3.1 3.1 0 0 0 3.6 6.1 3.5 3.5 0 0 0 3.5-2.6z"/><path d="M12 4.6a3 3 0 0 1 5.7-1.1 3 3 0 0 1 2.2 5.2 3 3 0 0 1-.8 4.6 3.1 3.1 0 0 1-3.6 6.1 3.5 3.5 0 0 1-3.5-2.6z"/><path d="M12 4.6v12.2"/>',
    layers: '<path d="m12 3 8.6 4.7-8.6 4.7-8.6-4.7z"/><path d="m3.4 12.4 8.6 4.7 8.6-4.7"/><path d="m3.4 16.6 8.6 4.7 8.6-4.7"/>',
    sparkles: '<path d="m10.4 3.4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/><path d="m17.8 13.6.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"/>',
    chat: '<path d="M4.2 6.2A2.8 2.8 0 0 1 7 3.4h10a2.8 2.8 0 0 1 2.8 2.8v7.2a2.8 2.8 0 0 1-2.8 2.8H9.4l-5.2 4.2z"/><path d="M8.4 9.8h.02M12 9.8h.02M15.6 9.8h.02"/>',
    eye: '<path d="M2.6 12S6.2 5.6 12 5.6 21.4 12 21.4 12 17.8 18.4 12 18.4 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="3.1"/>',
    pipeline: '<rect x="2.6" y="3.6" width="6.2" height="6.2" rx="2"/><rect x="15.2" y="14.2" width="6.2" height="6.2" rx="2"/><path d="M8.8 6.7h3.9a3 3 0 0 1 3 3v4.5"/><path d="M2.6 17.3h9.2"/><circle cx="14.4" cy="17.3" r="1.1" fill="currentColor" stroke="none"/>',
    gauge: '<path d="M4.4 18.2a8.8 8.8 0 1 1 15.2 0"/><path d="m12 14.2 3.6-3.8"/><circle cx="12" cy="15.6" r="1.7"/>',
    sigma: '<path d="M18.2 4.4H6l7 7.6-7 7.6h12.2"/>',
    cpu: '<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="2.6"/><rect x="9.8" y="9.8" width="4.4" height="4.4" rx="1.2"/><path d="M9.4 2.8v3.4M14.6 2.8v3.4M9.4 17.8v3.4M14.6 17.8v3.4M2.8 9.4h3.4M2.8 14.6h3.4M17.8 9.4h3.4M17.8 14.6h3.4"/>',
    browser: '<rect x="3.2" y="4.2" width="17.6" height="15.6" rx="3"/><path d="M3.2 9.2h17.6"/><path d="M6.6 6.7h.02M9.4 6.7h.02M12.2 6.7h.02"/>',
    server: '<rect x="3.2" y="3.8" width="17.6" height="7" rx="2.4"/><rect x="3.2" y="13.2" width="17.6" height="7" rx="2.4"/><path d="M7 7.3h.02M7 16.7h.02M10.4 7.3h.02M10.4 16.7h.02"/>',
    cloud: '<path d="M7.2 18.6h9.6a4.7 4.7 0 0 0 .5-9.4A6.3 6.3 0 0 0 5.6 10.6 4.2 4.2 0 0 0 7.2 18.6z"/>',
    network: '<circle cx="12" cy="4.8" r="2.6"/><circle cx="5" cy="19.2" r="2.6"/><circle cx="19" cy="19.2" r="2.6"/><path d="M12 7.4v4.2M12 11.6 6.4 17M12 11.6 17.6 17"/>',
    shield: '<path d="M12 3.2 19.4 6v6.1c0 4.4-3.1 7.9-7.4 9.3-4.3-1.4-7.4-4.9-7.4-9.3V6z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
    gitbranch: '<circle cx="7" cy="5.4" r="2.3"/><circle cx="7" cy="18.6" r="2.3"/><circle cx="17" cy="9" r="2.3"/><path d="M7 7.7v8.6"/><path d="M17 11.3c0 3.6-3.9 3.5-6.6 4.6"/>',
    /* --- added: section UI (interview / research / project lab) --- */
    arrowLeft: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
    alert: '<path d="M12 3.6 21.2 19.6H2.8z"/><path d="M12 9.6v4.2M12 17h.02"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20.2a6.2 6.2 0 0 1 12.4 0"/><path d="M16.4 5.2a3.4 3.4 0 0 1 0 6.6"/><path d="M18 14.6a6.2 6.2 0 0 1 3.2 5.6"/>',
    flow: '<rect x="3" y="3.2" width="6.6" height="5.2" rx="1.8"/><rect x="14.4" y="3.2" width="6.6" height="5.2" rx="1.8"/><rect x="8.7" y="15.6" width="6.6" height="5.2" rx="1.8"/><path d="M6.3 8.4v3a2 2 0 0 0 2 2h7.4a2 2 0 0 0 2-2v-3"/><path d="M12 13.4v2.2"/>',
    folder: '<path d="M3.2 6.6a2.4 2.4 0 0 1 2.4-2.4h3.1l2 2.4h7.7a2.4 2.4 0 0 1 2.4 2.4v8.4a2.4 2.4 0 0 1-2.4 2.4H5.6a2.4 2.4 0 0 1-2.4-2.4z"/>',
    filter: '<path d="M3.4 5.4h17.2l-6.6 7.7v5.9l-4 2.2v-8.1z"/>',
    chevronDown: '<path d="m6.4 9.4 5.6 5.6 5.6-5.6"/>',
    chevronUp: '<path d="m6.4 14.6 5.6-5.6 5.6 5.6"/>',
    trap: '<path d="M12 3.4a8.6 8.6 0 0 0-8.6 8.6c0 3.3 1.9 5 3.6 6.5 1 .9 1.6 1.6 1.8 2.5h6.4c.2-.9.8-1.6 1.8-2.5 1.7-1.5 3.6-3.2 3.6-6.5A8.6 8.6 0 0 0 12 3.4z"/><path d="m9 9 6 6M15 9l-6 6"/>',
    idea: '<path d="M9.4 20.4h5.2M10.4 17.6h3.2"/><path d="M12 3.2a6.2 6.2 0 0 0-3.8 11.1c.5.4.8 1 .9 1.6h5.8c.1-.6.4-1.2.9-1.6A6.2 6.2 0 0 0 12 3.2z"/><path d="M12 9.2v4"/>',
    chart: '<path d="M3.4 20.6h17.2"/><rect x="5" y="12" width="3.6" height="6.4" rx="1"/><rect x="10.2" y="7.6" width="3.6" height="10.8" rx="1"/><rect x="15.4" y="4" width="3.6" height="14.4" rx="1"/>',
    trend: '<path d="m3.4 16.6 5.2-5.2 3.6 3.6 8.4-8.4"/><path d="M15.4 6.6h5.2v5.2"/>',
    external: '<path d="M13.4 4.4h6.2v6.2"/><path d="m19.6 4.4-8 8"/><path d="M18.2 14v4.4a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2V7.8a2 2 0 0 1 2-2H10"/>',
    calendar: '<rect x="3.4" y="5" width="17.2" height="15.6" rx="2.8"/><path d="M3.4 10h17.2M8.4 3.2v3.6M15.6 3.2v3.6"/>',
    quote: '<path d="M9.4 6.4c-3 1-4.6 3.4-4.6 6.8v4.4h5.6v-5.6H7.2c0-2 .8-3.3 2.7-4z"/><path d="M19 6.4c-3 1-4.6 3.4-4.6 6.8v4.4H20v-5.6h-3.2c0-2 .8-3.3 2.7-4z"/>',
    flask: '<path d="M9.6 3.2h4.8M10.6 3.2v6.1L4.9 18a2.2 2.2 0 0 0 1.9 3.4h10.4a2.2 2.2 0 0 0 1.9-3.4l-5.7-8.7V3.2"/><path d="M7.4 15h9.2"/>',
    microscope: '<path d="M7.6 20.6h12.8"/><path d="M11.4 20.6a5.8 5.8 0 0 0 5.6-7.3"/><path d="M8.4 16.6h4.4"/><rect x="8.2" y="3.2" width="4.8" height="9.6" rx="2.2"/><path d="M13 5.8h1.8a2 2 0 0 1 2 2v1.8"/>',
    timer: '<circle cx="12" cy="13.4" r="7.6"/><path d="M12 9.8v3.6l2.4 1.6M9.4 2.6h5.2"/>',
    award: '<circle cx="12" cy="9" r="5.6"/><path d="m8.4 13.6-1.6 7.8L12 18.8l5.2 2.6-1.6-7.8"/>',
    scroll: '<path d="M6.4 3.4h11.2a2 2 0 0 1 2 2v13.2a2 2 0 0 1-2 2H6.4a2 2 0 0 1-2-2V5.4a2 2 0 0 1 2-2z"/><path d="M8.4 8h7.2M8.4 12h7.2M8.4 16h4.2"/>',
    star: '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
    starOn: '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="currentColor"/>',
    shuffle: '<path d="M17 3.6 20.6 7 17 10.4M17 13.6 20.6 17 17 20.4"/><path d="M3.4 7h3.2c1.6 0 2.6.9 3.4 2.2l3.6 5.6c.8 1.3 1.8 2.2 3.4 2.2h3.6"/><path d="M3.4 17h3.2c1.6 0 2.6-.9 3.4-2.2l.6-1M20.6 7H17c-1.6 0-2.6.9-3.4 2.2l-.6 1"/>',
    reset: '<path d="M3.6 12a8.4 8.4 0 1 1 2.5 6"/><path d="M3.4 20.4v-5h5"/>',
    plus: '<path d="M12 4.6v14.8M4.6 12h14.8"/>',
    minus: '<path d="M4.6 12h14.8"/>',
    print: '<path d="M6.6 9V3.6h10.8V9"/><rect x="3.2" y="9" width="17.6" height="7.6" rx="2.2"/><path d="M6.6 14.4h10.8v6H6.6z"/>',
    company: '<path d="M3.6 20.6h16.8"/><path d="M5.4 20.6V5.4a1.8 1.8 0 0 1 1.8-1.8h5.2a1.8 1.8 0 0 1 1.8 1.8v15.2"/><path d="M14.2 20.6V10h3.6a1.8 1.8 0 0 1 1.8 1.8v8.8"/><path d="M8.4 7.4h2.4M8.4 11h2.4M8.4 14.6h2.4"/>',
    atom: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.9"/><ellipse cx="12" cy="12" rx="9" ry="3.9" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.9" transform="rotate(120 12 12)"/>'
  };

  /* size: css controls it; keep viewBox uniform */
  TD.icon = function (name, cls) {
    var d = P[name] || P.spark;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' +
      (cls ? ' class="' + cls + '"' : "") + '>' + d + "</svg>";
  };

  TD.hasIcon = function (name) { return !!P[name]; };
})(window.TD);
