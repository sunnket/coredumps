/* HTML — forms and input. */
TD.addLessons("html", [

{
 t: "Forms — How a Page Collects Data",
 m: "forms",
 lvl: "core",
 s: "Far more capable natively than most people realise, and the place accessibility is most often broken.",
 goal: [
  "Build a form that submits correctly with no JavaScript",
  "Label every input so it is usable and accessible",
  "Use the right input type and native validation"
 ],
 b: [
  { p: "Forms are where the web stops being a document and becomes an application. They are also where accessibility fails most often — and the fix is usually one attribute." },

  { h: "The shape of a form" },
  { code: { lang: "html",
    lines: [
     { c: "<form action=\"/subscribe\" method=\"post\">", w: "**`action` is where the data goes; `method` is how.** `get` puts it in the URL, `post` in the request body." },
     { c: "", w: "" },
     { c: "  <label for=\"email\">Email address</label>", w: "**`for` must match the input's `id`.** This is the single most important attribute in this lesson.", hi: true },
     { c: "  <input type=\"email\" id=\"email\" name=\"email\" required>", w: "**`id` connects the label. `name` is the key the server receives.** Both are needed and they do different jobs." },
     { c: "", w: "" },
     { c: "  <button type=\"submit\">Subscribe</button>", w: "**`<button>`, not `<div onclick>`.** It is focusable, works with Enter and Space, and is announced as a button — all free." },
     { c: "</form>", w: "" }
    ],
    after: "That form works with no JavaScript at all: it validates the email, submits on Enter, is fully keyboard operable and reads correctly to a screen reader." } },
  { tbl: { h: ["`method`", "Data goes", "Use for"],
    rows: [
     ["`get`", "**In the URL** — `?q=cats&page=2`", "Searches and filters. Bookmarkable and shareable"],
     ["`post`", "**In the request body**", "**Anything that changes something**, and anything sensitive — a URL is logged everywhere"]
    ] } },

  { h: "Labels — the thing most often got wrong" },
  { p: "Every input needs a label. Not placeholder text, not a nearby paragraph — a real `<label>` connected to it." },
  { vs: { t: "The same field, two ways", lang: "html",
    bad: { c: "<input type=\"text\"\n       placeholder=\"Email address\">", label: "Placeholder as a label",
      w: "**It disappears the moment you type**, so anyone who forgets what the field was must clear it. It fails contrast requirements, is not announced by every screen reader, and gives no click target." },
    good: { c: "<label for=\"email\">Email address</label>\n<input type=\"email\" id=\"email\"\n       name=\"email\"\n       placeholder=\"you@example.com\">", label: "Real label, placeholder as an example",
      w: "**The label is permanent and announced.** Clicking it focuses the input — a bigger target, which matters enormously on a phone. The placeholder now does its actual job: showing the expected format." } } },
  { code: { lang: "html", t: "Three ways to associate a label",
    lines: [
     { c: "<label for=\"name\">Name</label>", w: "**Explicit — `for` matches `id`.** The most flexible; the label can be anywhere on the page." },
     { c: "<input id=\"name\" name=\"name\">", w: "" },
     { c: "", w: "" },
     { c: "<label>Name <input name=\"name\"></label>", w: "**Implicit — the input is inside the label.** No ids needed, and it works, but it is harder to style." },
     { c: "", w: "" },
     { c: "<input name=\"q\" aria-label=\"Search\">", w: "**A last resort**, for when a visible label genuinely would not fit — a search box whose magnifying glass makes it obvious. Screen readers get a label; sighted users get none." }
    ] } },
  { n: "The clickable-label behaviour is not a small thing. On a phone, a checkbox is a 20-pixel target and its label is often 200 pixels wide. Connecting them makes the whole label tappable — which is the difference between a form people complete and one they abandon.",
    nt: "Why labels matter for everyone" },

  { h: "Input types" },
  { code: { lang: "html",
    lines: [
     { c: "<input type=\"text\">", w: "The default." },
     { c: "<input type=\"email\">", w: "**Validates the format, and shows an @ key on mobile.**" },
     { c: "<input type=\"tel\">", w: "**Brings up the numeric keypad on a phone.** Does not validate — phone formats vary too much." },
     { c: "<input type=\"url\">", w: "" },
     { c: "<input type=\"number\" min=\"1\" max=\"10\" step=\"1\">", w: "**For genuine quantities only.** Not for phone numbers, postcodes or card numbers — it strips leading zeros and adds spinner arrows nobody wants.", hi: true },
     { c: "<input type=\"password\">", w: "" },
     { c: "<input type=\"date\">", w: "**A native date picker**, localised and keyboard-accessible for free." },
     { c: "<input type=\"search\">", w: "Adds a clear button." },
     { c: "<input type=\"file\" accept=\"image/*\" multiple>", w: "" },
     { c: "<input type=\"color\">", w: "" },
     { c: "<input type=\"range\" min=\"0\" max=\"100\">", w: "" },
     { c: "<input type=\"hidden\" name=\"csrf\" value=\"...\">", w: "**Not displayed, still submitted.** Note *hidden* means visually — it is fully visible in the page source." }
    ] } },
  { n: "Choosing the right `type` is the cheapest usability win in HTML. On a phone, `type=\"email\"` shows a keyboard with `@` and `.com`; `type=\"tel\"` shows a numeric keypad. It costs four characters and measurably improves completion rates.",
    nt: "The mobile keyboard is the reason" },

  { h: "The other controls" },
  { code: { lang: "html",
    lines: [
     { c: "<textarea id=\"msg\" name=\"message\" rows=\"5\"></textarea>", w: "**No `value` attribute** — the content goes between the tags. The closing tag is required even when empty." },
     { c: "", w: "" },
     { c: "<select id=\"country\" name=\"country\">", w: "" },
     { c: "  <option value=\"gb\">United Kingdom</option>", w: "**`value` is submitted; the text is displayed.** They differ deliberately." },
     { c: "  <option value=\"in\" selected>India</option>", w: "**`selected` sets the default.**" },
     { c: "  <optgroup label=\"Europe\">", w: "Groups options under a non-selectable heading." },
     { c: "    <option value=\"fr\">France</option>", w: "" },
     { c: "  </optgroup>", w: "" },
     { c: "</select>", w: "" },
     { c: "", w: "" },
     { c: "<input type=\"checkbox\" id=\"terms\" name=\"terms\" value=\"yes\">", w: "**Independent on/off.** An unchecked box submits **nothing at all** — the key is simply absent, which surprises people writing the server side." },
     { c: "", w: "" },
     { c: "<input type=\"radio\" name=\"plan\" id=\"free\" value=\"free\">", w: "" },
     { c: "<input type=\"radio\" name=\"plan\" id=\"pro\" value=\"pro\">", w: "**The shared `name` is what makes them mutually exclusive**, and each needs its own `id`. Radios with different names are not a group.", hi: true }
    ] } },
  { code: { lang: "html", t: "Grouping related controls",
    lines: [
     { c: "<fieldset>", w: "**Groups related inputs.**" },
     { c: "  <legend>Choose a plan</legend>", w: "**The group's label.** A screen reader announces it before each radio, so *Free* becomes *Choose a plan: Free* — without it the options have no context at all.", hi: true },
     { c: "", w: "" },
     { c: "  <input type=\"radio\" name=\"plan\" id=\"free\" value=\"free\" checked>", w: "" },
     { c: "  <label for=\"free\">Free</label>", w: "" },
     { c: "", w: "" },
     { c: "  <input type=\"radio\" name=\"plan\" id=\"pro\" value=\"pro\">", w: "" },
     { c: "  <label for=\"pro\">Pro — £9/month</label>", w: "" },
     { c: "</fieldset>", w: "" }
    ] } },

  { h: "Native validation" },
  { code: { lang: "html",
    lines: [
     { c: "<input type=\"email\" required>", w: "**`required` blocks submission and shows a browser message** — localised, styled by the OS, and free." },
     { c: "<input type=\"text\" minlength=\"3\" maxlength=\"20\">", w: "" },
     { c: "<input type=\"number\" min=\"18\" max=\"120\">", w: "" },
     { c: "<input type=\"text\" pattern=\"[A-Z]{2}[0-9]{4}\"", w: "**A regular expression the value must match.**" },
     { c: "       title=\"Two capital letters followed by four digits\">", w: "**`title` becomes the error message.** Without it the browser says only *please match the requested format*, which helps nobody.", hi: true },
     { c: "", w: "" },
     { c: "<input autocomplete=\"email\">", w: "**Tells the browser what this field is** so it can autofill correctly. `name`, `tel`, `street-address`, `cc-number`, `new-password` — there is a standard list, and using it saves your users real typing." },
     { c: "<input autofocus>", w: "**Focuses on load.** One per page at most, and never above the fold on a content page — it scrolls the reader somewhere they did not ask to go." }
    ] } },
  { trap: "**Native validation is a convenience, never a security control.** Anyone can remove the attributes in Inspect, or send the request directly with no browser involved. Every rule you enforce in the form must be enforced again on the server. Client-side validation is there to give fast feedback, not to keep anything out." },

  { h: "A complete, accessible form" },
  { code: { lang: "html", file: "contact.html",
    lines: [
     { c: "<form action=\"/contact\" method=\"post\">", w: "" },
     { c: "  <h2>Get in touch</h2>", w: "" },
     { c: "", w: "" },
     { c: "  <div>", w: "" },
     { c: "    <label for=\"name\">Your name</label>", w: "" },
     { c: "    <input type=\"text\" id=\"name\" name=\"name\"", w: "" },
     { c: "           required autocomplete=\"name\">", w: "" },
     { c: "  </div>", w: "" },
     { c: "", w: "" },
     { c: "  <div>", w: "" },
     { c: "    <label for=\"email\">Email address</label>", w: "" },
     { c: "    <input type=\"email\" id=\"email\" name=\"email\"", w: "" },
     { c: "           required autocomplete=\"email\"", w: "" },
     { c: "           aria-describedby=\"email-help\">", w: "**Links the hint text below to the input**, so a screen reader reads it as part of the field rather than as stray text.", hi: true },
     { c: "    <p id=\"email-help\">We will only use this to reply.</p>", w: "" },
     { c: "  </div>", w: "" },
     { c: "", w: "" },
     { c: "  <div>", w: "" },
     { c: "    <label for=\"message\">Message</label>", w: "" },
     { c: "    <textarea id=\"message\" name=\"message\" rows=\"6\" required></textarea>", w: "" },
     { c: "  </div>", w: "" },
     { c: "", w: "" },
     { c: "  <button type=\"submit\">Send message</button>", w: "**`type=\"submit\"` explicitly.** A `<button>` inside a form defaults to submit, but stating it prevents a confusing surprise when someone adds a second button." },
     { c: "</form>", w: "" }
    ] } },

  { h: "The keyboard test" },
  { l: [
   "**Tab through the whole form.** Every control must be reachable, in a sensible order.",
   "**Watch for the focus ring.** If you cannot see which element is focused, the form is unusable for keyboard users — and `outline: none` in someone's CSS reset is nearly always the culprit.",
   "**Press Enter in a text field.** It should submit.",
   "**Space on a checkbox, arrows on a radio group.** Both should work, free, if you used real form elements."
  ] },
  { n: "If all of that works without you writing any JavaScript, you used the right elements. If it does not, something has been rebuilt out of `<div>`s — and every one of those behaviours then has to be reimplemented by hand, usually incompletely.",
    nt: "The test that catches div-based forms" },

  { tryit: { t: "Build a form with no JavaScript",
    task: "Build a sign-up form: name, email, password with a minimum length, a country select, a radio group in a fieldset, a required terms checkbox, and a submit button. Every field labelled. Then complete it using only the keyboard.",
    hint: "Point `action` at `https://httpbin.org/post` to see exactly what gets submitted.",
    sol: { lang: "html", code: "<form action=\"https://httpbin.org/post\" method=\"post\">\n  <div>\n    <label for=\"name\">Full name</label>\n    <input type=\"text\" id=\"name\" name=\"name\" required autocomplete=\"name\">\n  </div>\n\n  <div>\n    <label for=\"email\">Email</label>\n    <input type=\"email\" id=\"email\" name=\"email\" required autocomplete=\"email\">\n  </div>\n\n  <div>\n    <label for=\"pw\">Password</label>\n    <input type=\"password\" id=\"pw\" name=\"password\"\n           required minlength=\"12\" autocomplete=\"new-password\"\n           aria-describedby=\"pw-help\">\n    <p id=\"pw-help\">At least 12 characters.</p>\n  </div>\n\n  <fieldset>\n    <legend>How did you hear about us?</legend>\n    <input type=\"radio\" name=\"source\" id=\"s-search\" value=\"search\" checked>\n    <label for=\"s-search\">Search</label>\n    <input type=\"radio\" name=\"source\" id=\"s-friend\" value=\"friend\">\n    <label for=\"s-friend\">A friend</label>\n  </fieldset>\n\n  <div>\n    <input type=\"checkbox\" id=\"terms\" name=\"terms\" value=\"yes\" required>\n    <label for=\"terms\">I accept the terms</label>\n  </div>\n\n  <button type=\"submit\">Create account</button>\n</form>" },
    w: "httpbin echoes the submission back as JSON, so you can see exactly which `name` keys arrived and what the server would receive. Leave the checkbox unticked on one attempt and watch it vanish from the payload entirely — that is the behaviour worth seeing once." } }
 ],
 k: [
  "Every input needs a real `<label for>` matching its `id` — a placeholder is not a label.",
  "`id` connects the label; `name` is the key the server receives. Both are needed and they differ.",
  "Choose the right `type` — it changes the mobile keyboard and adds free validation.",
  "Native validation is feedback, not security; every rule must be enforced again on the server."
 ],
 r: ["HTML", "Web Accessibility", "Cross-Site Request Forgery", "HTTP", "CSRF", "ARIA"],
 drill: {
  lang: "html",
  reps: 4,
  items: [
   { c: "<form action=\"/subscribe\" method=\"post\">", w: "start a form that sends data in the request body" },
   { c: "<label for=\"email\">Email address</label>", w: "label an input by its id" },
   { c: "<input type=\"email\" id=\"email\" name=\"email\" required>", w: "an email field the browser validates" },
   { c: "<button type=\"submit\">Subscribe</button>", w: "a real button rather than a clickable div" },
   { c: "<legend>Choose a plan</legend>", w: "give a group of radios a shared label" },
   { c: "<input autocomplete=\"email\">", w: "let the browser fill the field correctly" },
   { c: "aria-describedby=\"email-help\"", w: "attach hint text to a field so it is read with it" }
  ]
 }
}

]);
