# Benchy website — benchy-app.com

Site statique prêt pour GitHub Pages + petit Worker Cloudflare optionnel pour PayPal.

## 1. GitHub Pages
1. Crée un dépôt GitHub, par exemple `benchy-site`.
2. Mets tous les fichiers de ce dossier à la racine du dépôt puis `git push`.
3. GitHub > Settings > Pages > Deploy from a branch > `main` / root.
4. Le fichier `CNAME` contient déjà `benchy-app.com`.
5. Chez Amen, configure les DNS demandés par GitHub Pages pour le domaine personnalisé.

## 2. Téléchargement / releases
Dans `config.js` et `version.json`, remplace `YOUR_GITHUB_USERNAME/Benchy` par le vrai dépôt qui contient tes GitHub Releases.
À chaque nouvelle version, mets à jour `version.json`. Benchy lit ce fichier pour détecter une MAJ sans serveur dédié.

## 3. PayPal
Le Client ID PayPal est public et va dans `config.js`. Le Client Secret ne doit JAMAIS être mis dans GitHub Pages.
Le dossier `worker/` contient un backend Cloudflare Worker minimal pour créer et capturer une commande PayPal.
Dans Cloudflare Worker, ajoute les secrets `PAYPAL_CLIENT_ID` et `PAYPAL_CLIENT_SECRET`, déploie le Worker, puis mets son URL dans `paymentApiBase` de `config.js`.

## 4. Avant mise en production
- complète `/legal/` avec tes vraies mentions légales, CGV et politique de confidentialité ;
- choisis le vrai prix Benchy+ dans `config.js` ;
- configure le système de licence/activation après paiement si Benchy+ doit s'activer automatiquement ;
- signe numériquement l'installateur Windows si possible.
