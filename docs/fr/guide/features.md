# Fonctionnalités & Mode TV

---

## 1. Grille Zéro-Scroll Adaptative

Kato ajuste automatiquement la taille des cartes et la grille pour que toutes vos sondes tiennent sur un seul écran sans défilement vertical ni horizontal — que vous suiviez 10 services ou plus de 150.

![Vue Haute Densité](/screenshots/kato-high-density.png)

---

## 2. Mode TV & Wallboard (`?tv=1`)

Ajoutez `?tv=1` à l'URL (`http://localhost:3000/?tv=1`) pour un écran mural :

- **Plein écran automatique** : Bascule en plein écran et s'y remet après 30 secondes d'inactivité.
- **Masquage du curseur** : Cache le pointeur de souris après 5 secondes d'inactivité.
- **Protection Anti Burn-In** : Léger déplacement périodique pour protéger les dalles OLED et AMOLED.
- **Maintien de l'écran allumé** : Empêche la mise en veille de l'écran ou du téléviseur.
- **Bandeau d'incidents en continu** : Affiche les pannes en cours en bas de l'écran.

---

## 3. Application Installable (PWA) & Démarrage Auto

Vous pouvez installer Kato comme une application de bureau ou mobile :

1. Cliquez sur l'icône **Installer** dans la barre supérieure (ou via **Paramètres ⚙️ → Application (PWA)**).
2. Sur Chrome, Edge ou Brave, ouvrez `chrome://apps` (ou `edge://apps`), faites un clic droit sur **Kato Dashboard** et cochez **Lancer l'application à l'ouverture de session**.

---

## 4. Alertes Bureau & Audio

- **Notifications de bureau (`N`)** : Recevez une notification système dès qu'une sonde tombe en panne ou revient en ligne.
- **Alertes sonores (`M`)** : Signaux sonores intégrés en cas de coupure, de panne massive ou de rétablissement.

---

## 5. Mode Anonymisation / Capture (`?anonymize=1`)

Besoin de partager une capture d'écran de votre dashboard sans exposer vos noms de serveurs ou URLs internes ?

- Ouvrez **Paramètres ⚙️ → Affichage → Mode Anonymisation (Capture)** (ou ajoutez `?anonymize=1` à l'URL).
- Kato remplace les noms, URLs et groupes par des intitulés génériques tout en conservant vos vrais statuts, latences, disponibilités et pastilles de source.

---

## 6. Raccourcis Clavier

| Touche | Action |
| :--- | :--- |
| `Flèches` / `Origine` / `Fin` | Se déplacer d'une sonde à l'autre |
| `Entrée` / `Espace` | Ouvrir le panneau de détail et d'historique 24h |
| `F` | Activer / quitter le plein écran |
| `M` | Activer / couper les alertes sonores |
| `N` | Activer / désactiver les notifications de bureau |
| `T` | Changer de thème (`Sombre` → `Clair` → `AMOLED`) |
| `P` | Mettre en pause / reprendre le bandeau d'incidents |
| `?` | Ouvrir l'aide et les raccourcis clavier |
| `Échap` | Fermer la fenêtre active / quitter le mode TV |
