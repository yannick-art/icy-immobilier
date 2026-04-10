# ICY Immobilier — Site web

Site statique de l'agence immobilière ICY Immobilier (Paris & Île-de-France).

---

## Stack technique

| Composant | Détail |
|---|---|
| Pages | HTML/CSS/JS vanilla — pas de framework |
| Déploiement | **Netlify** — push sur `main` → déploiement automatique |
| Analytics | Google Tag Manager `GTM-KKR6XMGH` |
| Polices | Clash Display (cdnfonts) + DM Sans (Google Fonts) |
| Formulaires | `form.js` → webhook Make.com |
| En-têtes HTTP | `_headers` (CSP, HSTS, etc.) |
| Redirections | `_redirects` (routes Netlify sans `.html`) |

---

## Structure du projet

```
icy-immobilier/
├── index.html                  # Page d'accueil
├── vendre.html
├── acheter.html
├── methode.html
├── honoraires.html
├── nos-biens.html              # Listing des biens
├── icy-direct.html             # Offre vente autonome
├── icy-radar.html              # Offre achat autonome
├── estimation.html
├── contact.html
├── mentions-legales.html
│
├── biens/                      # Fiches détail des biens
│   ├── saint-maur-paris-11.html    # Référence V001 — À vendre
│   └── cantagrel-paris-13.html     # Référence L001 — À louer
│
├── images/
│   └── biens/
│       ├── v001/               # Photos du bien V001 (9 photos HDR)
│       └── l001/               # Photos du bien L001 (7 photos — à uploader)
│
├── form.js                     # Logique formulaire de contact/estimation
├── faq.js                      # Toggle FAQ (methode.html)
├── methode.js                  # Animations méthode
│
├── icy-immobilier-logo-header.svg
├── icy-immobilier-logo-footer.svg
│
├── sitemap.xml                 # À mettre à jour à chaque nouveau bien
├── _headers                    # En-têtes HTTP Netlify (CSP, HSTS…)
└── _redirects                  # Routes Netlify (ex: /vendre → /vendre.html)
```

---

## Conventions biens

### Références
- Biens en vente : `V001`, `V002`…
- Biens en location : `L001`, `L002`…

### Nommage des images
- Dossier : `images/biens/v001/` ou `images/biens/l001/`
- Format attendu : JPG, largeur minimale 1600px
- La **première image** du dossier est l'image principale (utilisée dans la card `nos-biens.html`)

### Palette de couleurs
```css
--pine: #2B5141          /* vert foncé — fond nav, hero */
--pine-mid: #3a6b56      /* vert moyen — badge location */
--caramel: #C46210       /* orange — CTA, prix vente */
--beige: #EEE8D3         /* fond général */
--charcoal: #3E403A      /* texte */
```

---

## Ajouter un nouveau bien

### 1. Créer la fiche détail

Dupliquer le fichier le plus proche selon le type :
- Vente → `biens/saint-maur-paris-11.html` → renommer `biens/[slug].html`
- Location → `biens/cantagrel-paris-13.html` → renommer `biens/[slug].html`

Modifier dans la fiche :
- `<title>` et balises `<meta>`
- Référence (`V00X` ou `L00X`)
- H1, sous-titre, tags
- Description dans `<div class="desc-block">`
- Specs (surface, pièces, étage, DPE…)
- Prix et durée
- Photos (chemin `images/biens/vXXX/` ou `lXXX/`)
- Tableau `photos[]` dans le script lightbox (bas de page)

### 2. Ajouter les photos

Créer le dossier `images/biens/vXXX/` (ou `lXXX/`) et y déposer les photos JPG.

### 3. Mettre à jour `nos-biens.html`

- Copier le bloc `<a href="..." class="bien-card">` existant du même type (vente ou location)
- Adapter : référence, titre, subtitle, tags, prix, photo principale
- Mettre à jour le compteur dans `<div class="s-eyebrow">` (ex : « 3 biens disponibles »)

### 4. Mettre à jour `sitemap.xml`

Ajouter une entrée `<url>` :

```xml
<url>
  <loc>https://icy-immobilier.fr/biens/[slug].html</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## Déploiement

```bash
git add .
git commit -m "feat(biens): ajout [nom-du-bien]"
git push
```

Netlify déclenche le déploiement automatiquement sur push vers `main`.
Le site est en ligne sur **icy-immobilier.fr** via Netlify DNS.

---

## Points d'attention

- **Ne pas modifier** les balises `<meta name="title">` : elles contiennent des `—` intentionnels comme séparateur.
- **Ne pas toucher** aux entités HTML existantes (`&#8212;`, `&#8364;`, etc.) : elles sont intentionnelles.
- La CSP est dans `_headers`. Toute nouvelle source externe (font, script, image) doit y être ajoutée.
- `images/biens/l001/` contient un `.gitkeep` en attendant les vraies photos du bien L001 (Cantagrel). Les remplacer avant de publier la fiche.
