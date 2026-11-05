#!/usr/bin/env python3
"""Build the LivingStones static site.

Each file in _src/pages/ holds one page body. Its first line is a meta comment:
    <!--meta {"title": "...", "description": "...", "active": "about"} -->
The page path follows the file name: about.html -> /about/, index.html -> /,
post__unveiling-our-new-website.html -> /post/unveiling-our-new-website/.

Run:  python3 _src/build.py      (from the site folder or anywhere)
"""
import json, pathlib, re, datetime

SITE = pathlib.Path(__file__).resolve().parent.parent
SRC = SITE / '_src'
layout = (SRC / 'layout.html').read_text()
year = str(datetime.date.today().year)
built = []
for f in sorted((SRC / 'pages').glob('*.html')):
    raw = f.read_text()
    m = re.match(r'<!--meta (\{.*?\}) -->\n', raw, re.S)
    meta = json.loads(m.group(1)); body = raw[m.end():]
    slug = f.stem
    if slug == 'index': path, depth = '', 0
    elif slug == '404': path, depth = None, 0
    else:
        path = slug.replace('__', '/') + '/'; depth = path.count('/')
    root = '../' * depth if depth else './'
    if slug == '404': root = '/'   # 404 is served at any depth, so it needs absolute links
    if body.lstrip().startswith('<section class="memorial-hero"'):
        body = '<div class="memorial-page">\n' + body + '</div>\n'
    html = layout
    for k, v in {
        'content': body, 'title': meta['title'], 'description': meta.get('description', ''),
        'active': meta.get('active', ''), 'image': meta.get('image', 'assets/img/home-hero.jpg'),
        'path': path or '', 'year': year,
    }.items():
        html = html.replace('{{' + k + '}}', v)
    html = html.replace('{{root}}', root)
    out = SITE / '404.html' if slug == '404' else SITE / (path or '') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    built.append(str(out.relative_to(SITE)))

# sitemap for search engines
urls = [b.replace('index.html', '') for b in built if b != '404.html' and not b.startswith('thanks')]
(SITE / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + ''.join(f'  <url><loc>https://www.livingstones-association.org/{u}</loc></url>\n' for u in urls)
    + '</urlset>\n')
print('\n'.join(built))
