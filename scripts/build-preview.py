import re,os
root=os.path.join(os.path.dirname(__file__),'..')
h=open(f'{root}/public/index.html').read()
css=open(f'{root}/public/css/style.css').read()
js=open(f'{root}/public/js/main.js').read()
title=re.search(r'<title>(.*?)</title>',h,re.S).group(1).strip()
font=re.search(r'<link[^>]*fonts\.googleapis[^>]*>',h).group(0)
body=re.search(r'<body[^>]*>(.*)</body>',h,re.S).group(1)
body=re.sub(r'<script[^>]*src="js/main.js"[^>]*></script>','',body)
out=f'<title>Rock Shore Builders</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n{font}\n<style>\n{css}\n</style>\n{body}\n<script>window.RSB_PREVIEW=true</script>\n<script>\n{js}\n</script>\n'
os.makedirs(f'{root}/preview',exist_ok=True)
open(f'{root}/preview/index.html','w').write(out)
print(len(out),title)
