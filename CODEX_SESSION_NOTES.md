# Notes de reprise Codex - ICY Immobilier

Date de mise a jour : 2026-05-18

## Etat Git / deploiement

- Repo local : `C:\Users\yanni\Documents\GitHub\icy-immobilier`
- Remote GitHub : `https://github.com/yannick-art/icy-immobilier.git`
- Branche active : `main`
- Etat actuel : `main` local aligne avec `origin/main`
- Dernier commit pousse :
  - `0e23469 chore: improve site seo urls and assets`
- Fichier de memoire local :
  - `CODEX_SESSION_NOTES.md` reste non suivi volontairement.
  - Ne pas le commit/push sauf demande explicite.

## Historique recent pousse

- `0e23469 chore: improve site seo urls and assets`
  - Passe typo/copy globale.
  - SEO fiches biens.
  - Images de preview optimisees.
  - URLs propres + redirects Netlify.
  - Sitemap mis a jour.

- `cb52e9d fix: update property statuses`
  - V001 passe en `Offre acceptee`.
  - L001 passe en `Loue` / `Bail signe`.
  - Liste `nos-biens` ajustee : biens references, plus "disponibles".
  - CTA fiches biens remplaces par `Nous contacter`.

- `bf6105c fix: corrections reprise site`
  - Formulaire home corrige avec `id`, `name`, `required`, `value`.
  - FAQ `acheter` / `vendre` corriges (`display:block` a l'ouverture).
  - Suppression du `h` parasite dans `mentions-legales.html`.
  - Nettoyage des emails Cloudflare vers `mailto:contact@icy-immobilier.fr`.
  - Wording `10 h liberees par semaine`.

- `bcdb116 feat: add home youtube video`
  - Ajout embed YouTube Shorts sur la home.
  - CSP mise a jour pour YouTube.

## Point important formulaires

Le flux principal des leads ne passe plus par Make.

Flux actuel :

`formulaire HTML` -> `form.js` -> `Supabase RPC web_intake` -> ICY OS

Make reste uniquement comme fallback dans `form.js`.

Commits GitHub pertinents :

- `6977b33 Connect formulaires site -> ICY OS (remplace Make webhook)`
- `32f76d7 fix: ajouter supabase.co au CSP connect-src (formulaires -> ICY OS)`

A ne pas regresser :

- Ne pas remplacer `form.js` par une ancienne version.
- Ne pas retirer `https://*.supabase.co` de `connect-src` dans `_headers`.
- Ne pas retirer le fallback Make sans nouvelle strategie de secours.

## Travail effectue par categorie

### 1. Biens

- `nos-biens.html`
  - V001 : `Offre acceptee`
  - L001 : `Loue`
  - Texte general : biens suivis / references, plus de promesse de disponibilite.

- `biens/saint-maur-paris-11.html`
  - Badge principal : `Offre acceptee`
  - CTA : `Nous contacter`

- `biens/cantagrel-paris-13.html`
  - Badge principal : `Loue`
  - Tag : `Bail signe`
  - Detail prix : `Bien loue`
  - CTA : `Nous contacter`

### 2. Typo / copy

- Harmonise :
  - `24h` -> `24 h`
  - `48h` -> `48 h`
  - `990EUR` / `990 euro` -> `990 EUR` ou `990&#160;&#8364;`
  - `490EUR` / `490 euro` -> `490 EUR` ou `490&#160;&#8364;`
  - `6,5MEUR` -> `6,5 M EUR`
  - `Paris & IDF` -> `Paris & Ile-de-France`
- Reduction des tirets longs utilises comme ponctuation de phrase.
- Les tirets longs restent acceptes dans certains titres, meta, references biens ou separations visuelles.

### 3. SEO fiches biens

Ajoute sur les deux fiches :

- `meta description`
- `canonical`
- Open Graph avec vraie photo du bien
- Twitter card `summary_large_image`
- JSON-LD `RealEstateListing`

Verification faite :

- Les deux blocs JSON-LD se parse correctement via PowerShell `ConvertFrom-Json`.

### 4. Images

Pas d'outil local WebP/AVIF disponible (`magick`, `cwebp`, `ffmpeg` absents).

Fait a la place :

- Ajout de dimensions `width` / `height`.
- Ajout `decoding="async"`.
- Ajout `fetchpriority="high"` sur les images hero.
- Ajout `preload` sur les images hero optimisees.
- Creation de JPEG de preview legers :
  - `images/biens/v001/381A1612-HDR-900.jpg`
  - `images/biens/v001/381A1612-HDR-1600.jpg`
  - `images/biens/v001/381A1621-HDR-900.jpg`
  - `images/biens/v001/381A1631-HDR-900.jpg`
  - `images/biens/l001/IMG_20260326_114245-900.jpg`
  - `images/biens/l001/IMG_20260326_114245-1400.jpg`
  - `images/biens/l001/IMG_20260326_114755-900.jpg`
  - `images/biens/l001/IMG_20260326_115027-900.jpg`

Les pages utilisent les previews. Les originaux restent disponibles pour les galeries/lightbox et les archives.

### 5. URLs propres

- Liens internes principaux passes en URLs sans `.html` :
  - `/vendre`
  - `/acheter`
  - `/methode`
  - `/estimation`
  - `/honoraires`
  - `/nos-biens`
  - `/contact`
  - `/mentions-legales`
  - `/icy-direct`
  - `/icy-radar`
  - `/biens/saint-maur-paris-11`
  - `/biens/cantagrel-paris-13`

- `_redirects` :
  - anciennes URLs `.html` -> URLs propres en `301`
  - URLs propres -> fichiers `.html` en rewrite `200`

- `sitemap.xml` :
  - URLs des fiches biens passees sans `.html`.

## Verifications faites

- `git diff --check` : OK avant commit `0e23469`
- JSON-LD fiches biens : OK
- References images dans les pages biens : OK
- Recherche :
  - plus de `24h`, `48h`, `990EUR`, `490EUR`, `6,5MEUR`, `Paris & IDF`
  - `.html` restant dans les pages : uniquement Google Tag Manager `ns.html`
  - `.html` dans `_redirects` : attendu

## Points restants / idees futures

1. Ajouter `CODEX_SESSION_NOTES.md` a `.gitignore` si on veut eviter toute erreur de commit future.
2. Installer un vrai pipeline image WebP/AVIF si souhaite.
   - Exemple futur : `sharp`, `imagemagick`, `cwebp`, ou build Netlify.
3. Verifier le deploy Netlify du commit `0e23469`.
4. Faire une passe visuelle sur mobile/desktop apres deploy :
   - Home
   - Acheter
   - Vendre
   - Nos biens
   - Fiches V001/L001
   - Estimation/contact
5. Eventuellement uniformiser aussi les tirets longs restants dans les pages legales et techniques, mais ce n'est pas prioritaire.

## Commandes utiles

Git n'est pas dans le PATH PowerShell standard, utiliser :

```powershell
& 'C:\Program Files\Git\cmd\git.exe' status --short --branch
& 'C:\Program Files\Git\cmd\git.exe' log --oneline --decorate -n 8
& 'C:\Program Files\Git\cmd\git.exe' pull --rebase origin main
& 'C:\Program Files\Git\cmd\git.exe' diff --check
```

## Note de prudence

Il reste possiblement un stash local ancien :

`stash@{0}: autostash`

Il venait d'un `pull --rebase --autostash` pendant la resolution de conflit `_headers`.
Le contenu utile avait ete applique et committe dans `bcdb116`.
Ne pas appliquer ce stash sans verifier son contenu.
