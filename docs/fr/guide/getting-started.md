# Démarrage Rapide

Kato est distribué sous forme de conteneur léger (`ghcr.io/kwaadpepper/kato-dashboard:latest`) sans base de données.

---

## 1. En une commande `docker run`

### Tester la Démo Intégrée
```bash
docker run -d --name kato-dashboard -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest
```

Ouvrez **`http://localhost:3000`** dans votre navigateur.

### Connecter Uptime Kuma ou UptimeRobot
Renseignez `UPTIME_KUMA_URL` ou `UPTIMEROBOT_API_KEY` et Kato active automatiquement la source correspondante :

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

## 2. Avec `docker-compose.yml`

Créez un fichier `docker-compose.yml` sur votre serveur :

```yaml
services:
  kato:
    image: ghcr.io/kwaadpepper/kato-dashboard:latest
    container_name: kato-dashboard
    ports:
      - "3000:3000"
    environment:
      UPTIME_KUMA_URL: "https://kuma.votre-domaine.fr"
      UPTIME_KUMA_API_KEY: "uk1_votre_cle_api"
      KATO_DEFAULT_LOCALE: "fr"
      KATO_DEFAULT_THEME: "dark"
    restart: unless-stopped
```

```bash
docker compose up -d
```

---

## 3. Depuis les Sources

```bash
git clone https://github.com/Kwaadpepper/kato-dashboard.git
cd kato-dashboard
cp .env.example .env
npm install
npm run dev
```
