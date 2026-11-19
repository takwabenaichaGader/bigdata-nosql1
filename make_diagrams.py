"""Generate meaningful, editable vector illustrations (SVG) for the quiz."""
from pathlib import Path
from xml.sax.saxutils import escape
DIR=Path(__file__).parent/'public'/'assets'
NAVY='#18374B'; TEAL='#078983'; ORANGE='#DE784A'; PALE='#E6F5F1'; INK='#2A4655'; BLUE='#DCECF5'; MUTED='#6C8390'
def rect(x,y,w,h,fill='white',r=12,stroke='none',sw=1):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def text(x,y,s,size=21,color=INK,bold=False,anchor='start',mono=False):
 family = 'DejaVu Sans Mono' if mono else 'Arial, DejaVu Sans'
 return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{color}" font-weight="{700 if bold else 400}" text-anchor="{anchor}">{escape(s)}</text>' 
def line(x1,y1,x2,y2,color=TEAL,sw=3,dash=None):
 dash_attr=f'stroke-dasharray="{dash}"' if dash else ''
 return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" {dash_attr}/>' 
def circle(cx,cy,r,fill,stroke='none',sw=1):return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def base(title,body,desc=''):
 out=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="940" height="440" viewBox="0 0 940 440" role="img" aria-label="{escape(title)}"><defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="{TEAL}" stroke-width="1.5"/></marker><filter id="sh"><feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#14364a" flood-opacity=".06"/></filter></defs>'''
 out+=rect(0,0,940,440,'#F6F9F7',22)+text(36,51,title,25,NAVY,True)
 if desc:out+=text(38,81,desc,16,MUTED)
 out+=body+'</svg>'
 return out

def save(name,title,body,desc=''): (DIR/name).write_text(base(title,body,desc),encoding='utf8')
# Diagram 1: SQL join, entity rows and condition
b=rect(42,112,340,246,'white',18,'#CFDFE7')+rect(42,112,340,55,NAVY,18)+text(62,145,'ETUDIANTS',19,'white',True)+text(66,201,'id',18,MUTED)+text(164,201,'nom',18,MUTED)+line(62,218,360,218,'#DAE5E8',1)+rect(61,230,290,47,'#E6F5F1',10)+text(70,260,'7',22,TEAL,True,mono=True)+text(166,260,'Lina',21,NAVY)+text(70,315,'8',20,INK,mono=True)+text(166,315,'Adam',20,INK)
b+=rect(558,112,340,246,'white',18,'#CFDFE7')+rect(558,112,340,55,NAVY,18)+text(578,145,'INSCRIPTIONS',19,'white',True)+text(575,201,'etudiant_id',17,MUTED)+text(754,201,'module',17,MUTED)+line(573,218,877,218,'#DAE5E8',1)+rect(572,230,306,47,'#E6F5F1',10)+text(580,260,'7',22,TEAL,True,mono=True)+text(752,260,'Big Data',20,NAVY)+text(580,315,'8',20,INK,mono=True)+text(752,315,'Python',20,INK)
b+=f'<path d="M 354 254 C 440 254, 498 254, 575 254" stroke="{TEAL}" stroke-width="4" fill="none" marker-end="url(#arr)"/>'+rect(399,186,142,37,'#FFF1E5',12)+text(470,211,'id = etudiant_id',12,'#B65E31',True,'middle')
save('sql-join.svg','Une jointure rapproche des lignes',''.join(b),'Liaison logique par une condition de correspondance')
# relation 1:N
b=rect(45,130,310,210,'white',19,'#BDDFE6')+rect(45,130,310,56,NAVY,18)+text(67,166,'products · 1 produit',19,'white',True)
b+=text(77,220,'_id: 101',22,ORANGE,True,mono=True)+text(77,266,'name: "Laptop Pro"',18,INK,mono=True)+text(77,305,'price: 3200',18,INK,mono=True)
b+=rect(547,102,343,275,'white',18,'#D8E6E8')+rect(547,102,343,56,NAVY,18)+text(568,137,'reviews · N avis',19,'white',True)
for i,(av,rat,y) in enumerate([(501,5,170),(502,4,238),(503,3,306)]):
 b+=rect(567,y,296,54,['#E8F8F4','#F4F7FB','#FFF2E9'][i],11)+text(584,y+22,f'_id: {av}',16,INK,mono=True)+text(584,y+44,'productId: 101',17,ORANGE,True,mono=True)+text(770,y+32,f'{rat} / 5',17,NAVY,True)
 b+=f'<path d="M 570 {y+33} C 490 {y+33}, 471 239, 351 239" fill="none" stroke="{TEAL}" stroke-width="3" marker-end="url(#arr)" />'
b+=rect(387,344,124,36,'#FCEDDC',11)+text(449,368,'1 → N',17,'#B76536',True,'middle')
save('relation-1n.svg','Un produit, plusieurs avis : relation 1:N',b,'La valeur productId de chaque avis référence le _id du produit')
# embedding
b=rect(74,106,470,278,'white',19,'#C7DEE3')+rect(74,106,470,53,NAVY,16)+text(98,140,'Collection products',21,'white',True)
b+=text(100,194,'{',23,NAVY,mono=True)+text(131,224,'_id: 101,',20,INK,mono=True)+text(131,254,'name: "Laptop Pro",',20,INK,mono=True)
b+=rect(121,266,395,84,'#E6F5F1',11,TEAL,2)+text(140,295,'specs: { ram: 32,',19,TEAL,True,mono=True)+text(234,323,'ssd: 1000 }',19,TEAL,True,mono=True)+text(100,372,'}',23,NAVY,mono=True)
b+=f'<path d="M 517 301 C 594 299, 628 259, 681 247" stroke="{TEAL}" fill="none" stroke-width="4" marker-end="url(#arr)" />'
b+=rect(660,172,222,149,'#FFF2E7',17)+text(771,205,'Une lecture',21,'#B56235',True,'middle')+text(771,238,'= produit',19,NAVY,False,'middle')+text(771,268,'+ specs',21,TEAL,True,'middle')
save('embedding.svg','Embedding : un document contient ses données liées',b,'Les caractéristiques bornées restent dans la fiche produit')
# referencing different layout
b=rect(46,118,320,245,'white',17,'#CADDE5')+rect(46,118,320,55,NAVY,15)+text(68,153,'Collection products',20,'white',True)+text(69,215,'_id: 101',22,ORANGE,True,mono=True)+text(69,263,'name: "Laptop Pro"',19,INK,mono=True)+text(69,302,'price: 3200',19,INK,mono=True)
b+=rect(585,104,307,282,'white',17,'#CADDE5')+rect(585,104,307,52,NAVY,15)+text(602,137,'Collection reviews',20,'white',True)
for idx,(id,y) in enumerate([(501,174),(502,243),(503,312)]):
 b+=rect(602,y,270,54,['#E7F6F2','#EDF5F8','#FFF1E6'][idx],10)+text(614,y+20,f'_id: {id}',17,NAVY,mono=True)+text(614,y+42,'productId: 101',17,ORANGE,True,mono=True)
 b+=f'<path d="M 601 {y+28} Q 480 {y+28}, 363 226" fill="none" stroke="{TEAL}" stroke-width="3" marker-end="url(#arr)"/>'
b+=text(475,404,'Les avis évoluent sans agrandir le produit',16,TEAL,True,'middle')
save('referencing.svg','Referencing : documents séparés, lien par identifiant',b,'Les avis conservent productId, sans être imbriqués dans products')
# compare
b=rect(40,116,402,260,'white',18,'#BFD9DE')+rect(40,116,402,51,NAVY,16)+text(66,150,'EMBEDDING',19,'white',True)
b+=rect(67,190,345,147,'#E7F6F2',14,TEAL,2)+text(94,222,'product {_id: 101,',18,NAVY,True,mono=True)+rect(91,241,294,60,'white',10)+text(117,277,'specs: { ram, ssd }',17,TEAL,True,mono=True)+text(95,321,'}',18,NAVY,mono=True)
b+=rect(497,116,400,260,'white',18,'#BFD9DE')+rect(497,116,400,51,NAVY,16)+text(522,150,'REFERENCING',19,'white',True)
b+=rect(527,200,126,110,'#E7F6F2',13)+text(545,230,'product',17,NAVY,True)+text(545,257,'_id: 101',18,ORANGE,True,mono=True)+text(545,287,'1 doc',15,MUTED)
b+=rect(752,200,119,110,'#FFF0E7',13)+text(766,231,'reviews',17,NAVY,True)+text(766,259,'N docs',16,ORANGE,True)+line(652,255,744,255,TEAL,4)+text(702,241,'productId',14,TEAL,True,'middle')
b+=text(240,409,'Petites données bornées et lues ensemble',15,TEAL,False,'middle')+text(696,409,'Listes nombreuses et évolutives',15,TEAL,False,'middle')
save('embedding-versus-referencing.svg','Deux stratégies, deux usages',b,'La décision dépend du volume, des accès et de l’évolution')
# chronology
b=rect(61,115,816,262,'white',18,'#C9E1E4')+text(92,155,'reviews',21,NAVY,True)+text(92,186,'sort({ createdAt: -1 })',18,TEAL,True,mono=True)
for i,(date,label) in enumerate([('19/11/2026','Avis 503'),('18/11/2026','Avis 502'),('15/11/2026','Avis 501')]):
 x=92+i*274
 b+=rect(x,216,245,114,['#E7F6F2','#EFF5F8','#FFF3EC'][i],14)+text(x+17,250,date,19,ORANGE,True)+text(x+17,282,label,20,NAVY,True)+text(x+17,311,['Le plus récent','Deuxième','Le plus ancien'][i],15,MUTED)
 if i<2:b+=f'<path d="M {x+245} 271 L {x+270} 271" stroke="{TEAL}" stroke-width="3" marker-end="url(#arr)"/>'
save('avis-chronologie.svg','Trier les avis du plus récent au plus ancien',b,'createdAt: -1 indique un ordre décroissant')
# index
b=rect(40,110,384,275,'white',18,'#C8E0E3')+rect(40,110,384,53,NAVY,16)+text(61,144,'Sans index : COLLSCAN',18,'white',True)
for i in range(8):
  x=67+(i%4)*84;y=184+(i//4)*72
  b+=rect(x,y,66,55,('#FCEAD9' if i in [2,5] else '#EFF4F7'),9)+text(x+33,y+34,str(i+1),19,ORANGE if i in [2,5] else MUTED,True,'middle')
b+=text(232,364,'Examiner les documents',16,MUTED,False,'middle')
b+=rect(496,110,405,275,'white',18,'#C8E0E3')+rect(496,110,405,53,NAVY,16)+text(518,144,'Avec index composé : IXSCAN',18,'white',True)
b+=rect(523,183,340,51,'#E7F6F2',11)+text(540,215,'productId = 101',18,TEAL,True,mono=True)
b+=line(688,235,688,260,TEAL,3)
for i,y in enumerate([264,308]):
 b+=rect(523,y,340,37,['#F7EEE3','#EDF5F7'][i],9)+text(541,y+25,['2026-11-19   Avis 503','2026-11-18   Avis 502'][i],17,NAVY,mono=True)
save('index.svg','Un index aide à cibler et trier les avis',b,'L’ordre des champs suit : productId (filtre) puis createdAt (tri)')
print('SVGs generated:',[p.name for p in DIR.glob('*.svg')]);
