"""Infographies d'énoncé (sans spoilers). Les schémas corrigés sont générés séparément."""
from pathlib import Path
from xml.sax.saxutils import escape
P=Path(__file__).parent/'public'/'assets'
NAVY='#17374C'; TEAL='#078983'; ORANGE='#CE6739'; INK='#2A4655'; MUTED='#647D88'; PALE='#EAF6F4'; LINE='#C9DEE3'
def R(x,y,w,h,fill='white',r=14,stroke='none',sw=1):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def T(x,y,s,size=20,color=INK,b=False,mono=False,anchor='start'):
 return f'<text x="{x}" y="{y}" font-family="{("DejaVu Sans Mono" if mono else "Arial,DejaVu Sans")}" font-weight="{700 if b else 400}" font-size="{size}" text-anchor="{anchor}" fill="{color}">{escape(str(s))}</text>'
def L(x1,y1,x2,y2,c=LINE,sw=2):return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{sw}"/>'
def circle(x,y,r,fill,stroke='none'):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}"/>'
def save(filename,title,subtitle,art):
 content='<svg xmlns="http://www.w3.org/2000/svg" width="940" height="440" viewBox="0 0 940 440" role="img" aria-label="Situation à analyser"><rect x="0" y="0" width="940" height="440" rx="22" fill="#F6F9F8"/>'
 content+=T(32,46,title,24,NAVY,True)+T(34,75,subtitle,16,MUTED)+art+'</svg>'
 (P/filename).write_text(content,encoding='utf-8')

# 1 SQL : deux tables, sans expliquer/commenter la jointure
b=R(40,111,350,264,'white',18,LINE)+R(40,111,350,51,NAVY,13)+T(60,144,'Table ETUDIANTS',20,'white',True)
b+=T(70,201,'id',17,MUTED,True)+T(200,201,'nom',17,MUTED,True)+L(62,212,365,212)+T(70,259,'7',22,INK,False,True)+T(200,259,'Lina',21,INK)+L(62,276,365,276)+T(70,323,'8',22,INK,False,True)+T(200,323,'Adam',21,INK)
b+=R(550,111,350,264,'white',18,LINE)+R(550,111,350,51,NAVY,13)+T(572,144,'Table INSCRIPTIONS',20,'white',True)
b+=T(576,201,'etudiant_id',17,MUTED,True)+T(764,201,'module',17,MUTED,True)+L(566,212,878,212)+T(576,259,'7',22,INK,False,True)+T(764,259,'Big Data',19,INK)+L(566,276,878,276)+T(576,323,'8',22,INK,False,True)+T(764,323,'Python',19,INK)
b+=circle(470,238,40,'#FFF1E8','#E1B89B')+T(470,250,'?',37,ORANGE,True,False,'middle')
save('sql-join.svg','Deux tables à rapprocher','Étudiez les identifiants et les inscriptions.',b)

# 2 Relation source data: legitimate fields only, no relation arrows or conclusion
b=R(42,117,360,248,'white',18,LINE)+R(42,117,360,51,NAVY,14)+T(62,149,'products',21,'white',True)
for y,s in [(214,'_id: 101'),(260,'name: "Laptop Pro"'),(306,'price: 3200')]:b+=T(68,y,s,20,INK,False,True)
b+=R(526,104,373,284,'white',18,LINE)+R(526,104,373,51,NAVY,14)+T(549,137,'reviews',21,'white',True)
for y,k,v in [(177,501,5),(244,502,4),(311,503,3)]:
 b+=R(545,y,335,55,['#EEF8F6','#F4F6F8','#FFF3EC'][(k-501)],10)+T(560,y+20,f'_id: {k}   productId: 101',16,INK,False,True)+T(560,y+43,f'rating: {v}',15,MUTED,False,True)
b+=T(465,256,'?',36,ORANGE,True,False,'middle')
save('relation-1n.svg','Deux jeux de documents','Observez les valeurs des identifiants dans products et reviews.',b)

# 3 Specs storefront UI, no data storage prescription
b=R(64,110,810,272,'white',18,LINE)+R(64,110,810,48,NAVY,14)+T(85,141,'Fiche produit affichée dans une boutique',21,'white',True)
b+=R(94,184,264,165,'#E9F4F8',16)+R(160,205,129,74,'#A6D3D6',10)+R(168,213,113,58,NAVY,6)+L(147,292,305,292,'#7795A7',5)+T(228,330,'Laptop Pro',20,NAVY,True,False,'middle')
b+=T(413,210,'Informations de la fiche',19,MUTED)+T(413,250,'Prix : 3 200',21,INK,True)+T(413,293,'RAM : 32 Go',20,INK)+T(413,335,'SSD : 1 000 Go',20,INK)
save('embedding.svg','Ce que voit le client','Un ordinateur est consulté avec ses caractéristiques techniques.',b)

# 4 Many reviews UI; no labels concerning storage
b=R(48,105,303,274,'white',18,LINE)+T(74,153,'Produit 101',23,NAVY,True)+T(74,203,'Laptop Pro',24,INK,True)+T(74,243,'Prix : 3 200',19,INK)
b+=R(75,274,241,65,PALE,12)+T(94,303,'Des milliers',19,TEAL,True)+T(94,329,'de commentaires',18,TEAL)
b+=R(434,104,459,276,'white',18,LINE)+T(461,146,'Avis visibles dans la boutique',20,NAVY,True)
for i,(name,rating) in enumerate([('Client A',5),('Client B',4),('Client C',3)]):
 y=169+i*66;b+=R(458,y,411,55,['#EEF8F6','#F1F5FA','#FFF2EA'][i],12)+circle(487,y+27,18,['#55AFA6','#7896B6','#D9926D'][i])+T(522,y+23,name,18,NAVY,True)+''.join(circle(529+j*21,y+39,7,ORANGE if j<rating else '#CFDCE0') for j in range(5))
b+=T(389,255,'?',34,ORANGE,True,False,'middle')
save('referencing.svg','Un produit qui reçoit de nombreux avis','Imaginez leur croissance et leur consultation au fil du temps.',b)

# 5 Choose strategy visually without naming or assigning which is which
b=R(40,113,410,271,'white',18,LINE)+R(40,113,410,52,'#E1F1EE',14)+T(62,146,'Données A : caractéristiques',20,NAVY,True)
b+=T(66,209,'RAM : 32 Go',21,INK,True)+T(66,251,'SSD : 1 000 Go',21,INK,True)+R(66,289,345,64,'#F4F8FA',12)+T(80,317,'Évoluent rarement',18,MUTED)+T(80,341,'Lues avec le produit',18,MUTED)
b+=R(490,113,410,271,'white',18,LINE)+R(490,113,410,52,'#FFF0E8',14)+T(511,146,'Données B : avis clients',20,NAVY,True)
b+=T(518,209,'10 000+ commentaires',21,INK,True)+T(518,251,'Ajouts chaque jour',20,INK)+R(516,289,345,64,'#F4F8FA',12)+T(532,317,'Consultation par pages',18,MUTED)+T(532,341,'Modification indépendante',18,MUTED)
save('embedding-versus-referencing.svg','Deux profils de données','Choisissez une stratégie adaptée à chaque situation.',b)

# 6 Chronology deliberately unsorted, no sort command anywhere
b=R(46,115,848,266,'white',18,LINE)+T(73,156,'Trois avis enregistrés à des dates différentes',20,NAVY,True)
for i,(av,date,txt) in enumerate([(502,'18/11/2026','Produit satisfaisant'),(501,'15/11/2026','Livraison correcte'),(503,'19/11/2026','Très bon produit')]):
 x=76+i*274
 b+=R(x,193,247,135,['#EDF6F8','#FFF2EB','#EAF6F2'][i],14)+T(x+17,228,f'Avis {av}',20,NAVY,True)+T(x+17,260,date,21,ORANGE,True)+T(x+17,298,txt,14,INK)
b+=T(468,357,'Dans quel ordre les afficher ?',18,MUTED,False,False,'middle')
save('avis-chronologie.svg','Des avis présentés sans tri','Les dates ne sont pas classées : à vous de choisir l’opération.',b)

# 7 Index question neutral, only search use-case. No field-order cues
b=R(48,115,846,262,'white',18,LINE)+R(73,142,796,64,'#EDF5F8',14)+T(93,183,'Recherche : avis du produit 101',22,NAVY,True)
b+=R(75,228,235,105,'#F3F7F8',12)+T(96,269,'Un grand volume',18,INK,True)+T(96,300,'d’avis à consulter',17,MUTED)
b+=R(354,228,235,105,'#E9F6F2',12)+T(377,269,'Des filtres',19,INK,True)+T(377,300,'utilisés très souvent',17,MUTED)
b+=R(632,228,235,105,'#FFF2EB',12)+T(653,269,'Un affichage',19,INK,True)+T(653,300,'des derniers avis',17,MUTED)
save('index.svg','Requête fréquente du catalogue','Quels accès faut-il optimiser pour ce besoin ?',b)
print('Illustrations neutres générées')
