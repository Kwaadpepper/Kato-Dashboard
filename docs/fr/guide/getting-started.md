# Démarrage en 30 Secondes

Kato est distribué sous forme d'image Docker légère (`ghcr.io/kwaadpepper/kato-dashboard:latest`) **sans aucune base de données**. Tout l'état est maintenu en mémoire vive (RAM) et synchronisé automatiquement avec vos outils de supervision.

---

## Option 1 : En une commande `docker run` (Le plus rapide)

### Tester la Démo Interactive Multi-Sources
Lancez Kato avec 50 sondes réalistes réparties sur 3 sources simulées (`kuma-prod`, `kuma-lan`, `uptimerobot`) :

```bash
docker run -d \
  --name kato-dashboard \
  -p 3000:3000 \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

Ouvrez **`http://localhost:3000`** dans votre navigateur.

### Connecter Uptime Kuma ou UptimeRobot (Auto-Détection)
Inutile de préciser `KATO_ADAPTER` — dès que `UPTIME_KUMA_URL` ou `UPTIMEROBOT_API_KEY` est fourni, Kato active automatiquement l'adaptateur correspondant :

```bash
# Uptime Kuma
docker run -d \
  --name kato-dashboard \
  -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.votre-domaine.fr \
  -e UPTIME_KUMA_API_KEY=uk1_votre_cle_api \
  ghcr.io/kwaadpepper/kato-dashboard:latest

# UptimeRobot
docker run -d \
  --name kato-dashboard \
  -p 3000:3000 \
  -e UPTIMEROBOT_API_KEY=u123456-votre_cle_readonly \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

---

## Option 2 : `docker-compose.yml` Autonome

Sans même cloner le dépôt, créez un fichier `docker-compose.yml` :

```yaml
services:
  kato:
    image: ghcr.io/kwaadpepper/kato-dashboard:latest
    container_name: kato-dashboard
    ports:
      - "3000:3000"
    environment:
      # Auto-détecte Uptime Kuma ou UptimeRobot dès que renseigné :
      UPTIME_KUMA_URL: "https://kuma.votre-domaine.fr"
      UPTIME_KUMA_API_KEY: "uk1_votre_cle_api"
      # Préférences d'affichage par défaut :
      KATO_DEFAULT_LOCALE: "fr"
      KATO_DEFAULT_THEME: "dark"
    restart: unless-stopped
```

Puis démarrez le conteneur :

```bash
docker compose up -d
```

> [!TIP]
> L'image Docker officielle intègre un `HEALTHCHECK` automatique sur `http://127.0.0.1:3000/api/health`, permettant à Docker, Portainer ou Kubernetes de vérifier l'état de santé du service.

---

## Option 3 : Depuis les Sources (Node.js)

### Prérequis
- **Node.js** 20.x ou 22.x+
- **npm** 10.x+

```bash
# 1. Cloner le dépôt
git clone https://github.com/Kwaadpepper/kato-dashboard.git
cd kato-dashboard

# 2. Installer les dépendances
npm install

# 3. Copier les fichiers de configuration d'exemple
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml

# 4. Lancer le serveur de développement
npm run dev
```

Pour un build et lancement en production Node.js :

```bash
npm run build
node build
```
