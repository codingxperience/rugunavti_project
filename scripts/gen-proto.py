#!/usr/bin/env python3
"""Generate scoped prototype CSS + per-page HTML from the Claude Design bundle.
Produces exact-match public pages: prototype markup + prototype CSS (scoped under .rg),
with icons inlined at build time (no flash of IC_ placeholders)."""
import re, os, sys

PROTO = "/home/claude/repo/project"
ICONS = {
 "cap":'<path d="M22 9 12 5 2 9l10 4 10-4z"/><path d="M6 11v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"/>',
 "users":'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8M16.5 20a5.5 5.5 0 0 0-3-4.9"/>',
 "badge":'<circle cx="12" cy="9" r="6"/><path d="M9 14l-1 7 4-2 4 2-1-7"/>',
 "book":'<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h12"/>',
 "layers":'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 "compass":'<circle cx="12" cy="12" r="9"/><path d="m9.5 9.5 5 1-1 5-5-1z"/>',
 "check":'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>',
 "clock":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "phone":'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
 "globe":'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15 0 18M12 3c-2.5 2.6-2.5 15 0 18"/>',
 "spark":'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
 "calendar":'<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
 "shield":'<path d="M12 3l8 3v6c0 5-3.4 7.7-8 9-4.6-1.3-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 "heart":'<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
 "pin":'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 "mail":'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 "tool":'<path d="M14 6l4 4M5 21l9-9M16 4l4 4-3 3-4-4z"/>',
 "link":'<path d="M9 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M15 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
 "lab":'<path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3"/><path d="M8 3h8"/>',
 "folder":'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 "arrow":'<path d="M5 12h14M13 6l6 6-6 6"/>',
 "hammer":'<path d="M14 6l4 4M5 21l9-9M16 4l4 4-3 3-4-4z"/>',
 "brief":'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
 "cal":'<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
 "device":'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
}
import glob as _glob
def _extract_icons():
    """Pull every name:'<svg-inner>' entry from all prototype inline scripts + site.js."""
    d = {}
    for f in _glob.glob(os.path.join(PROTO, "*.html")) + [os.path.join(PROTO, "assets/site.js")]:
        try:
            t = open(f).read()
        except Exception:
            continue
        for m in re.finditer(r"([A-Za-z_]\w*)\s*:\s*'(<(?:path|circle|rect|line|polyline|polygon|ellipse)[^']*)'", t):
            d[m.group(1)] = m.group(2)
    return d
ICONS.update(_extract_icons())  # last definition wins (site.js authoritative for shared names)

def svg(name, w=None):
    sw = 2 if name=="arrow" else (w or 1.7)
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round">%s</svg>'%(sw, ICONS.get(name,""))

# ---------- CSS scoping ----------
SCOPE=".rg"
def scope_sellist(sel):
    out=[]
    for s in [x.strip() for x in sel.split(",")]:
        if not s: continue
        if s==":root": out.append(SCOPE)
        elif s=="html": out.append(s)
        elif s=="body": out.append(SCOPE)
        elif s.startswith("body:"): out.append(SCOPE+s[4:])
        elif s=="*": out.append(SCOPE+" *")
        elif s.startswith("::"): out.append(SCOPE+" "+s)
        else: out.append(SCOPE+" "+s)
    return ", ".join(out)
def scope_css(css):
    i=0;n=len(css);out=[]
    while i<n:
        ch=css[i]
        if ch.isspace(): out.append(ch);i+=1;continue
        if css.startswith("/*",i):
            j=css.find("*/",i+2);j=(j+2) if j!=-1 else n;out.append(css[i:j]);i=j;continue
        if ch=="@":
            j=i
            while j<n and css[j] not in "{;": j+=1
            pre=css[i:j]
            if j<n and css[j]==";": out.append(pre+";");i=j+1;continue
            depth=0;k=j
            while k<n:
                if css[k]=="{":depth+=1
                elif css[k]=="}":
                    depth-=1
                    if depth==0:break
                k+=1
            body=css[j+1:k];nm=pre.strip().split()[0].lower()
            if nm.startswith("@media") or nm.startswith("@supports"):
                out.append(pre+"{"+scope_css(body)+"}")
            else: out.append(pre+"{"+body+"}")
            i=k+1;continue
        j=css.find("{",i)
        if j==-1: out.append(css[i:]);break
        sel=css[i:j].strip();depth=0;k=j
        while k<n:
            if css[k]=="{":depth+=1
            elif css[k]=="}":
                depth-=1
                if depth==0:break
            k+=1
        out.append(scope_sellist(sel)+"{"+css[j+1:k]+"}")
        i=k+1
    return "".join(out)

# ---------- build prototype.css ----------
site=open(os.path.join(PROTO,"assets/site.css")).read()
site=re.sub(r"body::before\{[^}]*\}","",site)
site=re.sub(r"\s*--font-display:[^;]*;","",site)
site=re.sub(r"\s*--font-sans:[^;]*;","",site)
# .rg must NOT be a scroll container: overflow-x:hidden -> overflow-y:auto would
# clip the mega-menus, add a header scrollbar, and break the sticky header.
site=site.replace("overflow-x:hidden;","")
css_parts=[scope_css(site)]

PAGES={  # route : prototype file
 "home":"index.html",
 "about":"About.html",
 "academics":"Academics.html",
 "student-life":"Student Life.html",
 "news-events":"News & Events.html",
 "admissions":"Admissions.html",
 "elearning":"Elearning.html",
 "contact":"Contact.html",
 "verification":"Verification.html",
 "prospectus":"prospectus.html",
 "blog":"Blog.html",
}

def parse_blog_posts():
    t=open(os.path.join(PROTO,"assets/blog-data.js")).read()
    pat=re.compile(r'slug:"([^"]+)",\s*title:"((?:[^"\\]|\\.)*)",\s*category:"([^"]+)",\s*date:"([^"]+)",\s*read:"([^"]+)",\s*img:"([^"]+)",\s*author:"([^"]+)",\s*excerpt:"((?:[^"\\]|\\.)*)"')
    return [dict(slug=m[0],title=m[1],category=m[2],date=m[3],read=m[4],img=m[5],author=m[6],excerpt=m[7]) for m in pat.findall(t)]

def parse_school_names():
    t=open(os.path.join(PROTO,"assets/schools-data.js")).read()
    return re.findall(r'slug:"[^"]+",\s*name:"([^"]+)"', t)

def build_blog(main):
    posts=parse_blog_posts(); arrow=svg("arrow")
    f=posts[0]
    featured=('<a class="feature-post reveal-scale" href="/news-events"><div class="fp-body">'
        '<span class="tag">Featured · %s</span><h2>%s</h2><p class="muted">%s</p>'
        '<div class="meta"><span>%s</span><span>·</span><span>%s</span><span>·</span><span>%s</span></div>'
        '<span class="arrow-link" style="margin-top:18px">Read article %s</span></div></a>'
        )%(f["category"],f["title"],f["excerpt"],f["author"],f["date"],f["read"],arrow)
    cats=["All"]
    for p in posts:
        if p["category"] not in cats: cats.append(p["category"])
    chips="".join('<button class="filter-chip%s" data-c="%s">%s</button>'%(" active" if i==0 else "",c,c) for i,c in enumerate(cats))
    cards="".join(('<a class="post" href="/news-events" data-cat="%s"><div class="pbody"><h3>%s</h3>'
        '<p>%s</p><div class="pmeta"><span>%s</span><span>·</span><span>%s</span></div></div></a>'
        )%(p["category"],p["title"],p["excerpt"],p["date"],p["read"]) for p in posts)
    main=main.replace('<div id="featured"></div>','<div id="featured">'+featured+'</div>')
    main=main.replace('id="filters"></div>','id="filters">'+chips+'</div>')
    main=main.replace('id="postGrid"></div>','id="postGrid">'+cards+'</div>')
    return main

def build_prospectus(main):
    names=parse_school_names()
    sl="".join('<div class="sl"><span class="num">%s%d</span><span>%s</span></div>'%("0" if i+1<10 else "",i+1,n) for i,n in enumerate(names))
    return re.sub(r'(id="schoolList"[^>]*>)\s*(</div>)', lambda m: m.group(1)+sl+m.group(2), main)
# link rewrite map (order matters: longest/most-specific first)
LINKS=[
 ("school.html?slug=","/schools/"),
 ("Admissions.html#apply","/apply"),
 ("Academics.html#schools","/schools"),
 ("Academics.html#programmes","/programs"),
 ("Academics.html#modes","/programs"),
 ("Academics.html#levels","/programs"),
 ("News & Events.html#calendar","/news-events#calendar"),
 ("Student Life.html","/student-life"),
 ("News & Events.html","/news-events"),
 ("blog-post.html","/news-events"),
 ("Blog.html","/news-events"),
 ("Academics.html","/programs"),
 ("Admissions.html","/admissions"),
 ("Verification.html","/verification"),
 ("Elearning.html","/elearning"),
 ("prospectus.html","/prospectus"),
 ("school.html","/schools"),
 ("Contact.html","/contact"),
 ("About.html","/about"),
 ("index.html","/"),
]
def fix_assets(h):
    h=h.replace("public/video/home_hero.mp4","/brand/home_hero_illustrator.mp4")
    h=h.replace('public/img/',"/img/").replace('public/ppl/',"/ppl/").replace('public/brand/',"/brand/")
    return h
def fix_links(h):
    for a,b in LINKS: h=h.replace(a,b)
    return h
def inline_icons(h):
    h=re.sub(r"IC_(\w+)", lambda m: svg(m.group(1)), h)
    h=re.sub(r"I_(\w+)", lambda m: svg(m.group(1)), h)  # Academics' I_ icon tokens
    # fill empty data-* icon holders (all holder attributes used across the prototype)
    def fill(m):
        return m.group(1)+svg(m.group(3))+m.group(4)
    h=re.sub(r'(<(span|div)[^>]*data-(?:tic|ico|aico|fico|eic|sico)="([\w-]+)"[^>]*>)(</(?:span|div)>)', fill, h)
    # CK = check token (.proof .p, .portal .pl)
    h=re.sub(r'>CK ', '>'+svg("CK",1.9)+' ', h)
    # PM = accordion plus token (literal text, or empty data-pm holder used by Contact)
    h=re.sub(r'(<\w+ class="pm"[^>]*>)PM(</\w+>)', lambda m: m.group(1)+svg("PM")+m.group(2), h)
    h=re.sub(r'(<span class="pm"[^>]*data-pm[^>]*>)(</span>)', lambda m: m.group(1)+svg("PM")+m.group(2), h)
    h=h.replace(">PM<", ">"+svg("chev")+"<")  # Academics uses bare >PM< as a chevron
    return h
def ts_escape(s):
    return s.replace("\\","\\\\").replace("`","\\`").replace("${","\\${")

for route,fname in PAGES.items():
    html=open(os.path.join(PROTO,fname)).read()
    # page-specific styles -> scoped css
    for m in re.finditer(r"<style>(.*?)</style>", html, re.S):
        css_parts.append("\n/* ===== %s ===== */\n"%route + scope_css(m.group(1)))
    mm=re.search(r"<main[^>]*>(.*?)</main>", html, re.S)
    if mm:
        main=mm.group(1)
    else:  # documents like prospectus have no <main>; use <body> minus scripts
        body=re.search(r"<body[^>]*>(.*?)</body>", html, re.S).group(1)
        main=re.sub(r"<script.*?</script>", "", body, flags=re.S)
    main=inline_icons(fix_links(fix_assets(main)))
    if route=="home":
        # home-only fills from index.html's inline script: proof ✓ checks and ★ stars
        star='<svg class="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.8 5.9 20.3 7.2 13.6l-5-4.6 6.8-.8z"/></svg>'
        main=re.sub(r'(<div class="stars">)[^<]*(</div>)', lambda m: m.group(1)+star*5+m.group(2), main)
    if route=="elearning":
        # Use the real platform's sign-in/sign-up instead of "apply" for enrolment CTAs
        main=main.replace("/apply", "/elearning/register")
    if route=="blog":
        main=build_blog(main)
    if route=="prospectus":
        main=build_prospectus(main)
    var=re.sub(r"[^a-zA-Z0-9]","_",route)+"Html"
    open("src/proto/%s.html.ts"%route,"w").write(
        "// AUTO-GENERATED from the Claude Design prototype (%s). Do not edit; run scripts/gen-proto.py.\n"%fname
        + "export const %s = `%s`;\n"%(var, ts_escape(main)))
    print("wrote src/proto/%s.html.ts (%d chars)"%(route,len(main)))

hdr="/* AUTO-GENERATED — prototype site.css + page styles, scoped under .rg so it cannot affect dashboards/auth/shadcn. Run scripts/gen-proto.py to regenerate. */\n"
open("src/styles/prototype.css","w").write(hdr+"".join(css_parts)+"\n")
# fix has-js reveal selectors mangled by scoping
c=open("src/styles/prototype.css").read().replace(".rg html.has-js ",".rg ")
open("src/styles/prototype.css","w").write(c)
print("wrote src/styles/prototype.css (%d bytes)"%len(c))
