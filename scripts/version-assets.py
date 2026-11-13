"""Atualiza URLs de CSS/JS por conteúdo antes da publicação."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]
for name in ['doceria.css','doceria.js']:
 version=hashlib.sha256((root/name).read_bytes()).hexdigest()[:12]
 for page in root.glob('*.html'):
  text=page.read_text();text=re.sub(re.escape(name)+r'\?v=[^"\s]+',name+'?v='+version,text);page.write_text(text)
 print(name,version)
