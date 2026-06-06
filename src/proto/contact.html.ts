// AUTO-GENERATED from the Claude Design prototype (Contact.html). Do not edit; run scripts/gen-proto.py.
export const contactHtml = `
    <section class="hero-x">
      <span class="hx-bgword" data-parallax="0.06">HELLO</span>
      <span class="hx-orb a"></span><span class="hx-orb b"></span>
      <div class="wrap">
      <div class="breadcrumb reveal"><a href="/">Home</a><span class="sep">/</span><span>Contact</span></div>
      <div class="ph-grid">
        <div>
          <div class="kicker reveal"><span class="kn">01</span><span class="kl">Get in touch</span><span class="kbar"></span></div>
          <h1 class="display mt-m reveal d1">We're here to help you take the <span class="hl">next step</span></h1>
          <p class="lede mt-m reveal d2">Questions about programmes, admissions, fees, or studying from abroad? Our team responds quickly and clearly — wherever you're starting from.</p>
          <div class="flex gap-s wrap-flex mt-m reveal d3"><a class="btn btn-primary btn-lg" href="#message">Send a message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a><a class="btn btn-outline btn-lg" href="tel:+256700123456">Call us</a></div>
        </div>
        <div class="obj-hero reveal-scale d2">
          <span class="oh-dots"></span><span class="oh-dots br"></span>
          <span class="oh-ring"></span>
          <span class="oh-splash s2"></span><span class="oh-splash s1"></span>
          <img class="oh-photo" src="/ppl/advisor2.jpg" alt="Talk to our team" style="object-position:50% 30%">
          <div class="oh-tag t1"><span class="tg-ic" data-tic="clock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><span><b>1 working day</b><i>Reply time</i></span></div>
          <div class="oh-tag t2"><span class="tg-ic" data-tic="phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/></svg></span><span><b>Call or chat</b><i>Mon–Fri</i></span></div>
          <div class="oh-tag t3"><span class="tg-ic" data-tic="globe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15 0 18M12 3c-2.5 2.6-2.5 15 0 18"/></svg></span><span><b>International</b><i>Welcome</i></span></div>
        </div>
      </div>
    </div></section>

    <section class="sec-tight" id="message"><div class="wrap">
      <div class="contact-grid">
        <div class="grid" style="gap:14px">
          <div class="method reveal"><span class="mi">M_phone</span><div><div class="mk">Call us</div><div class="mv"><a href="tel:+256700123456">+256 700 123 456</a></div></div></div>
          <div class="method reveal d1"><span class="mi">M_mail</span><div><div class="mk">Email admissions</div><div class="mv"><a href="mailto:admissions@ruguna.ac.ug">admissions@ruguna.ac.ug</a></div></div></div>
          <div class="method reveal d2"><span class="mi">M_chat</span><div><div class="mk">WhatsApp</div><div class="mv"><a href="#">+256 754 000 321</a></div></div></div>
          <div class="method reveal d3"><span class="mi">M_clock</span><div><div class="mk">Office hours</div><div class="mv">Mon–Fri · 8:00 AM – 5:00 PM</div></div></div>
        </div>
        <div class="form-card reveal-scale">
          <form id="cform" onsubmit="return false">
            <h2 class="display" style="font-size:1.7rem;margin:0 0 6px">Send a message</h2>
            <p class="muted" style="font-size:0.9rem;margin:0 0 22px">We typically reply within one working day.</p>
            <div class="frow"><div class="field"><label>Full name</label><input type="text" required placeholder="Your name"></div><div class="field"><label>Email</label><input type="email" required placeholder="you@email.com"></div></div>
            <div class="frow"><div class="field"><label>Phone (optional)</label><input type="tel" placeholder="+256 …"></div><div class="field"><label>I'm asking about</label><select><option>Admissions guidance</option><option>Programme selection</option><option>Fees &amp; funding</option><option>International application</option><option>Document verification</option><option>Something else</option></select></div></div>
            <div class="field"><label>Message</label><textarea required placeholder="How can we help?"></textarea></div>
            <button class="btn btn-primary btn-lg" type="submit" style="width:100%">Send message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          </form>
          <div class="form-success" id="csuccess">
            <div class="fs-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
            <h3 class="display" style="font-size:1.6rem;margin:0 0 8px">Message sent</h3>
            <p class="muted">Thank you — our admissions team will be in touch shortly.</p>
          </div>
        </div>
      </div>
    </div></section>

    <section class="sec bg-soft" style="border-block:1px solid var(--border)"><div class="wrap">
      <div class="section-head"><div><p class="eyebrow reveal">Departments</p><h2 class="display mt-s reveal">Reach the right team</h2></div><p class="muted reveal" style="max-width:34ch">Contact a specific office directly for a faster answer.</p></div>
      <div class="grid g4">
        <div class="card reveal"><div class="tag">Admissions</div><h3 style="margin-top:10px">Applications &amp; entry</h3><p>admissions@ruguna.ac.ug<br>+256 700 123 456</p></div>
        <div class="card reveal d1"><div class="tag">Finance</div><h3 style="margin-top:10px">Fees &amp; payments</h3><p>finance@ruguna.ac.ug<br>+256 700 123 460</p></div>
        <div class="card reveal d2"><div class="tag">Registrar</div><h3 style="margin-top:10px">Records &amp; verification</h3><p>registrar@ruguna.ac.ug<br>+256 700 123 470</p></div>
        <div class="card reveal d3"><div class="tag">International</div><h3 style="margin-top:10px">Studying from abroad</h3><p>international@ruguna.ac.ug<br>+256 754 000 321</p></div>
      </div>
    </div></section>

    <section class="sec"><div class="wrap" style="max-width:840px">
      <p class="eyebrow center reveal">Before you write</p><h2 class="display center mt-s reveal">Quick answers</h2>
      <div class="acc mt-l reveal">
        <div class="acc-item"><button class="acc-q">How quickly will I get a reply?<span class="pm" data-pm><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">We typically respond to messages and emails within one working day. For urgent admissions questions, calling or WhatsApp is fastest.</div></div></div>
        <div class="acc-item"><button class="acc-q">Can I visit the campus?<span class="pm" data-pm><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">Yes — visitors are welcome during office hours (Mon–Fri, 8:00 AM–5:00 PM), and we host scheduled open days. Get in touch to arrange a visit.</div></div></div>
        <div class="acc-item"><button class="acc-q">I'm applying from another country — who do I contact?<span class="pm" data-pm><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">Reach the International office directly, or use the form and choose "International application". You'll be matched with a dedicated advisor.</div></div></div>
        <div class="acc-item"><button class="acc-q">How do I verify a certificate?<span class="pm" data-pm><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">Use the <a href="/verification" style="color:var(--accent-deep);font-weight:700">verification page</a> to check a document code instantly, or contact the registrar for written confirmation.</div></div></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div style="text-align:center;border:1px solid var(--border);border-radius:var(--radius-lg);padding:clamp(40px,5vw,68px);background:linear-gradient(160deg,var(--soft),var(--soft-2))">
        <h2 class="display reveal">Prefer to just <span class="hl">apply</span>?</h2>
        <p class="lede mx-auto center mt-m reveal d1" style="max-width:46ch">Skip the queue and start your application today — it only takes a few minutes.</p>
        <div class="flex gap-s wrap-flex center reveal d2" style="justify-content:center;margin-top:30px"><a class="btn btn-dark btn-lg" href="/apply">Apply Now</a><a class="btn btn-outline btn-lg" href="/programs">Browse programmes</a></div>
      </div>
    </div></section>
  `;
