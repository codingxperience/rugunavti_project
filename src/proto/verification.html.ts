// AUTO-GENERATED from the Claude Design prototype (Verification.html). Do not edit; run scripts/gen-proto.py.
export const verificationHtml = `
    <section class="page-hero"><div class="wrap center">
      <div class="breadcrumb reveal" style="justify-content:center"><a href="/">Home</a><span class="sep">/</span><span>Verification</span></div>
      <p class="eyebrow center reveal">Document verification</p>
      <h1 class="display mt-s reveal d1" style="font-size:clamp(2.4rem,5.4vw,4.2rem)">Confirm a Ruguna <span class="hl">credential</span></h1>
      <p class="lede mx-auto center mt-m reveal d2" style="max-width:54ch">Verify the authenticity of an admission letter or certificate issued by Ruguna College. Enter the document code exactly as printed.</p>
    </div></section>

    <section class="sec-tight"><div class="wrap verify-wrap">
      <div class="verify-card reveal-scale">
        <p class="tag">Secure check</p>
        <h2 class="display" style="font-size:1.7rem;margin-top:8px">Enter document code</h2>
        <div class="vform">
          <input type="text" id="vcode" placeholder="e.g. RUG-CERT-2025-1142" autocomplete="off">
          <button class="btn btn-primary btn-lg" id="vbtn">Verify <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
        </div>
        <p class="vhint">Try a sample: <code data-fill="RUG-CERT-2025-1142">RUG-CERT-2025-1142</code> &nbsp; <code data-fill="RUG-ADM-2026-0831">RUG-ADM-2026-0831</code></p>
        <div class="result" id="result">
          <div class="rhead"><span class="rico" id="rico"></span><span><span class="rtitle" id="rtitle"></span><br><span class="rsub" id="rsub"></span></span></div>
          <div class="rdetails" id="rdetails"></div>
        </div>
      </div>
    </div></section>

    <section class="sec bg-soft" style="border-block:1px solid var(--border)"><div class="wrap">
      <div class="center maxw-sm mx-auto"><p class="eyebrow center reveal">How verification works</p><h2 class="display mt-s reveal">Trust, confirmed</h2></div>
      <div class="vsteps mt-l">
        <div class="vstep reveal"><div class="vn">01</div><h4>Locate the code</h4><p>Find the document code, certificate number, or student identifier printed on the official document.</p></div>
        <div class="vstep reveal d1"><div class="vn">02</div><h4>Enter &amp; verify</h4><p>Type the code above exactly as shown, then run the secure check against our records.</p></div>
        <div class="vstep reveal d2"><div class="vn">03</div><h4>Read the result</h4><p>A verified result confirms the holder, programme, award, and issue date on record.</p></div>
      </div>
      <p class="muted center mt-l reveal" style="font-size:0.88rem;max-width:60ch;margin-inline:auto">Verifying employers or institutions can also <a href="/contact" style="color:var(--accent-deep);font-weight:700">contact the registrar</a> for formal written confirmation.</p>
    </div></section>

    <section class="sec"><div class="wrap">
      <div style="display:grid;grid-template-columns:0.85fr 1.15fr;gap:clamp(28px,4vw,56px);align-items:start" class="vexplain">
        <div><p class="eyebrow reveal">Anatomy of a credential</p><h2 class="display mt-s reveal">What's on a Ruguna document</h2><p class="lede mt-m reveal d1">Every official certificate and admission letter carries the details you need to confirm it's genuine.</p></div>
        <div class="grid g2 reveal d1">
          <div class="card"><div class="ico" data-ico="hash"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg></div><h3>Document code</h3><p>A unique reference (e.g. RUG-CERT-2025-1142) printed on every document.</p></div>
          <div class="card"><div class="ico" data-ico="user"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></div><h3>Holder &amp; programme</h3><p>The graduate's name, school, programme, and award level.</p></div>
          <div class="card"><div class="ico" data-ico="seal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14l-1 7 4-2 4 2-1-7"/></svg></div><h3>Official seal &amp; signature</h3><p>The registrar's signature and the Ruguna College seal.</p></div>
          <div class="card"><div class="ico" data-ico="qr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><path d="M14 14h3v3M20 14v6M17 20h3"/></svg></div><h3>Issue date</h3><p>The date of issue, used alongside the code to confirm authenticity.</p></div>
        </div>
      </div>
    </div></section>

    <section class="sec bg-soft" style="border-block:1px solid var(--border)"><div class="wrap">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,52px);align-items:center" class="vemp">
        <div><p class="eyebrow reveal">For employers &amp; institutions</p><h2 class="display mt-s reveal">Confirming a Ruguna graduate</h2><p class="lede mt-m reveal d1">Hiring or admitting a Ruguna graduate? Use the checker above for an instant result, or request formal written confirmation from the registrar for your records.</p>
          <div class="flex gap-s wrap-flex mt-m reveal d2"><a class="btn btn-dark" href="/contact">Request written confirmation <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
        </div>
        <div class="grid reveal d1" style="gap:12px">
          <div class="card" style="display:flex;gap:14px;align-items:center;padding:20px"><span class="ico" data-ico="bolt" style="flex:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span><div><strong>Instant online check</strong><p style="margin:2px 0 0">Verify a code in seconds, any time.</p></div></div>
          <div class="card" style="display:flex;gap:14px;align-items:center;padding:20px"><span class="ico" data-ico="doc" style="flex:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4M9 13h6M9 17h6"/></svg></span><div><strong>Formal confirmation</strong><p style="margin:2px 0 0">Official written verification on request.</p></div></div>
          <div class="card" style="display:flex;gap:14px;align-items:center;padding:20px"><span class="ico" data-ico="lock" style="flex:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><div><strong>Secure &amp; private</strong><p style="margin:2px 0 0">We confirm authenticity, nothing more.</p></div></div>
        </div>
      </div>
    </div></section>

    <section class="sec"><div class="wrap" style="max-width:840px">
      <p class="eyebrow center reveal">Verification FAQ</p><h2 class="display center mt-s reveal">Common questions</h2>
      <div class="acc mt-l reveal">
        <div class="acc-item"><button class="acc-q">Where do I find the document code?<span class="pm" data-ico="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">The code is printed on the official certificate or admission letter — usually near the holder's name or in the footer. It begins with "RUG-".</div></div></div>
        <div class="acc-item"><button class="acc-q">The code returns "not found" — what now?<span class="pm" data-ico="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">Check carefully for typos, including hyphens and the year. If it still doesn't match, contact the registrar with a copy of the document and we'll confirm manually.</div></div></div>
        <div class="acc-item"><button class="acc-q">Is online verification legally sufficient?<span class="pm" data-ico="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">The online check confirms authenticity for most purposes. For formal processes, request written confirmation from the registrar, which carries the college seal.</div></div></div>
        <div class="acc-item"><button class="acc-q">Can I verify a document from years ago?<span class="pm" data-ico="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="acc-a"><div class="acc-a-inner">Yes. Records are retained, so historical certificates and letters can be confirmed using their original document code.</div></div></div>
      </div>
    </div></section>

    <section class="sec" style="padding-top:0"><div class="wrap">
      <div style="text-align:center;border:1px solid var(--border);border-radius:var(--radius-lg);padding:clamp(36px,5vw,64px);background:linear-gradient(160deg,var(--soft),var(--soft-2))">
        <h2 class="display reveal">Need help with a verification?</h2>
        <p class="lede mx-auto center mt-m reveal d1" style="max-width:46ch">The registrar's office is happy to assist employers, institutions, and graduates.</p>
        <div class="flex gap-s wrap-flex center reveal d2" style="justify-content:center;margin-top:28px"><a class="btn btn-dark btn-lg" href="/contact">Contact the registrar</a><a class="btn btn-outline btn-lg" href="/admissions">Admissions</a></div>
      </div>
    </div></section>
  `;
