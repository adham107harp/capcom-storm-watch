#!/usr/bin/env python3
"""Build single-page versions of CAPCOM: Storm Watch from the multi-file project.

  python3 tools/build_single.py

Writes two files to dist/:
  capcom-storm-watch.html          three.js from cdnjs/jsDelivr (small, needs internet)
  capcom-storm-watch-offline.html  three.js inlined too (opens from a USB stick with no internet)
CSS, game code, voices, NASA media and the SOL model are embedded as data URIs.
The live NASA panel needs the online (Vercel) version, because the API key must stay on a server.
"""
import base64
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIME = {'.jpg': 'image/jpeg', '.png': 'image/png', '.webm': 'video/webm', '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary'}
CDN = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
       'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js']
LIMIT = 16 * 1024 * 1024


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def data_uri(rel):
    with open(os.path.join(ROOT, rel), 'rb') as f:
        raw = f.read()
    return 'data:%s;base64,%s' % (MIME[os.path.splitext(rel)[1]], base64.b64encode(raw).decode())


def safe_js(src):
    return src.replace('</script', '<\\/script')


def asset_map():
    core = read('js/core.js')
    block = re.search(r'CC\.ASSETS = \{(.*?)\};', core, re.S).group(1)
    embed = {k: data_uri(v) for k, v in re.findall(r"(\w+): '([^']+)'", block)}
    lines = json.loads(read('tools/lines.json'))
    for line_id in lines:
        rel = 'assets/audio/%s.mp3' % line_id
        if os.path.exists(os.path.join(ROOT, rel)):
            embed['audio:' + line_id] = data_uri(rel)
    missing = [i for i in lines if 'audio:' + i not in embed]
    return embed, missing


def build(html, embed, offline):
    css = read('css/style.css')
    html = html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n' + css + '\n</style>')
    html = html.replace('src="assets/media/title_orion.jpg"', 'src="' + embed['titleImg'] + '"')
    scripts = re.findall(r'<script src="([^"]+)"></script>', html)
    out = []
    for src in scripts:
        if src.startswith('vendor/'):
            if offline:
                out.append('<script>\n' + safe_js(read(src)) + '\n</script>')
            else:
                out.append('<script src="%s"></script>' % CDN[0 if 'three' in src else 1])
        else:
            out.append('<script>\n' + safe_js(read(src)) + '\n</script>')
    first = html.index('<script src=')
    last = html.rindex('</script>') + len('</script>')
    embed_tag = '<script>window.CC_EMBED=' + json.dumps(embed, separators=(',', ':')) + ';</script>'
    return html[:first] + embed_tag + '\n' + '\n'.join(out) + html[last:]


def main():
    html = read('index.html')
    embed, missing = asset_map()
    if missing:
        raise SystemExit('Missing voice clips: ' + ', '.join(missing))
    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    for name, offline in (('capcom-storm-watch.html', False), ('capcom-storm-watch-offline.html', True)):
        page = build(html, embed, offline)
        size = len(page.encode('utf-8'))
        if size > LIMIT:
            raise SystemExit('%s is %.1f MB, over the 16 MB limit' % (name, size / 1048576))
        with open(os.path.join(ROOT, 'dist', name), 'w', encoding='utf-8') as f:
            f.write(page)
        print('%-34s %.2f MB' % (name, size / 1048576))


if __name__ == '__main__':
    main()
