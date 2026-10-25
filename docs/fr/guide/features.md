# Fonctionnalités & Modes d'Affichage

Kato est pensé pour fonctionner 24h/24 et 7j/7 sur des écrans muraux de supervision (NOC), des postes d'exploitation ou sur smartphone d'astreinte.

---

## 1. Grille Adaptative Zéro-Scroll

Contrairement aux tableaux de bord classiques qui ajoutent une barre de défilement verticale dès que le nombre de sondes augmente, Kato mesure en permanence l'espace disponible (`ResizeObserver`) et sélectionne automatiquement l'un des **5 paliers de densité** :

| Palier | Nombre typique de sondes | Rendu visuel |
| :--- | :--- | :--- |
| **`large`** | 1 – 12 sondes | Cartes détaillées avec nom complet, URL nettoyée, groupe, pastille de source, disponibilité 24h et latence. |
| **`medium`** | 13 – 48 sondes | Cartes équilibrées avec titre, indicateur d'état, pastille de source, % uptime et temps de réponse. |
| **`compact`** | 49 – 120 sondes | Tuiles condensées affichant le nom, la couleur de statut, la pastille de source et la latence. |
| **`micro`** | 121 – 300 sondes | Cellules haute densité avec infobulle instantanée au survol ou au focus clavier. |
| **`pixel`** | 300+ sondes | Matrice thermique ultra-dense où chaque sonde est représentée par un pixel d'état. |

![Vue Haute Densité](/screenshots/kato-high-density.png)

---

## 2. Mode TV & Wallboard NOC 24/7 (`?tv=1`)

Ajoutez `?tv=1` à l'URL (`http://localhost:3000/?tv=1`) pour activer les protections dédiées aux écrans muraux :

- **Plein écran automatique** : Bascule automatiquement en plein écran natif et s'y remet après 30 secondes d'inactivité.
- **Masquage du curseur** : Fait disparaître le pointeur de souris après 5 secondes d'inactivité.
- **Dérive Anti Burn-In** : Applique un léger déplacement périodique (±3px) pour protéger les dalles OLED, AMOLED et plasma contre le marquage.
- **Screen Wake Lock** : Empêche la mise en veille de l'écran ou du téléviseur via l'API Web Wake Lock.
- **En-tête compact (`32px`)** : Maximise la surface dédiée aux sondes.

---

## 3. Application Installable (PWA) & Lancement au Démarrage

Kato intègre un manifeste Web App et un Service Worker permettant de l'installer comme une véritable application de bureau ou mobile :

1. Cliquez sur l'icône **Installer l'application** dans la barre supérieure (ou via **Paramètres ⚙️ → Application (PWA)**).
2. Une fois installée sur Chrome, Edge ou Brave, ouvrez `chrome://apps` (ou `edge://apps`), faites un clic droit sur **Kato Dashboard** et cochez **Lancer l'application à l'ouverture de session** pour démarrer automatiquement votre wallboard à l'allumage du PC.

---

## 4. Notifications de Bureau & Alertes Sonores Synthétisées

Soyez alerté immédiatement même lorsque Kato est en arrière-plan :

- **Notifications de bureau (`N`)** : Notifications natives du système d'exploitation via l'API Web Notifications. Les bascules unitaires (1 à 3 sondes) génèrent une notification dédiée (cliquable pour ouvrir la sonde concernée), tandis que les pannes massives (>3 sondes simultanées) sont regroupées en une seule notification récapitulative.
- **Alertes sonores Web Audio (`M`)** : Synthétiseur audio intégré (`OscillatorNode`, aucun fichier MP3 externe) :
  - **1–2 sondes DOWN** : Signal sonore d'alerte panne.
  - **≥3 sondes DOWN simultanément** : Triple alarme critique + flash rouge du cadre principal.
  - **Rétablissement DOWN → UP** : Double tonalité ascendante de retour à la normale.

---

## 5. Mode Anonymisation / Capture (`?anonymize=1`)

Besoin de partager une capture d'écran de votre wallboard de production dans une présentation, une documentation ou sur GitHub sans divulguer les noms de vos serveurs ni vos URLs internes ?

- Ouvrez **Paramètres ⚙️ → Affichage → Mode Anonymisation (Capture)** (ou ajoutez `?anonymize=1` à l'URL).
- Kato remplace de façon déterministe tous les noms de sondes, URLs et groupes par des intitulés d'infrastructure génériques (`API Gateway Prod`, `PostgreSQL Primary`, `Redis Cache Cluster`) tout en **conservant vos vrais statuts, latences, disponibilités 24h/7j et pastilles de source**.

---

## 6. Raccourcis Clavier & Accessibilité (WCAG AA)

Pilotez l'intégralité du dashboard au clavier :

| Touche | Action |
| :--- | :--- |
| `Flèches directionnelles` | Navigation spatiale 2D dans la grille de sondes |
| `Origine (Home)` / `Fin (End)` | Aller à la première sonde (en panne prioritaire) ou à la dernière |
| `Entrée` / `Espace` | Ouvrir le panneau latéral d'inspection 24h de la sonde sélectionnée |
| `F` | Activer / quitter le plein écran |
| `M` | Activer / couper les alertes sonores |
| `N` | Activer / désactiver les notifications de bureau |
| `T` | Changer de thème (`Sombre` → `Clair` → `AMOLED`) |
| `P` | Mettre en pause / reprendre le défilement des incidents |
| `?` | Ouvrir la fenêtre d'aide et des raccourcis clavier |
| `Échap` | Fermer la fenêtre active / quitter le mode TV |
