# Connecter vos Sources & Multi-Instances

Kato agit comme un serveur **Backend-For-Frontend (BFF)** qui interroge vos outils de supervision côté serveur, normalise les métriques en mémoire, et diffuse les changements en temps réel aux navigateurs via Server-Sent Events (SSE).

Vos clés API **ne sont jamais exposées** côté navigateur.

---

## 1. Uptime Kuma

Kato interroge le point de terminaison Prometheus `/metrics` natif d'Uptime Kuma.

### Étape 1 : Générer une clé API dans Uptime Kuma
1. Ouvrez votre interface **Uptime Kuma**.
2. Allez dans **Paramètres (⚙️) → Clés API (API Keys)**.
3. Cliquez sur **Ajouter une clé API**, donnez-lui un nom (ex. `Wallboard Kato`), et copiez le jeton généré (`uk1_...`).

> [!IMPORTANT]
> Dans Uptime Kuma, la création d'une clé API désactive définitivement l'accès sans mot de passe à `/metrics` et impose une authentification HTTP Basic (utilisateur vide, clé API en mot de passe). Kato gère cela automatiquement dès que `UPTIME_KUMA_API_KEY` est renseigné.

### Étape 2 : Configurer Kato
```dotenv
UPTIME_KUMA_URL=https://kuma.exemple.fr
UPTIME_KUMA_API_KEY=uk1_votre_jeton_secret
UPTIME_KUMA_POLL_INTERVAL=60000
```

---

## 2. UptimeRobot (API v3)

Kato utilise l'API REST v3 d'UptimeRobot avec pagination par curseur et suivi des pannes en mémoire vive pour respecter strictement les quotas du plan gratuit (10 requêtes/min).

### Étape 1 : Récupérer votre clé API Read-Only
1. Connectez-vous à **UptimeRobot**.
2. Allez dans **Integrations & API → API**.
3. Copiez votre **Main / Read-Only API Key**.

### Étape 2 : Configurer Kato
```dotenv
UPTIMEROBOT_API_KEY=u123456-abcdef1234567890
UPTIMEROBOT_POLL_INTERVAL=30000
```

---

## 3. Mode Multi-Instances (`KATO_ADAPTERS`)

Vous souhaitez superviser **deux serveurs Uptime Kuma distincts** (ex. Production Cloud + Réseau Interne LAN) ainsi qu'un **compte UptimeRobot** sur un seul et même écran ?

Utilisez `KATO_ADAPTERS` pour déclarer autant d'instances nommées que nécessaire. Chaque instance dispose de son propre intervalle de collecte et affiche une **pastille de source colorée** (`KP`, `KL`, `RM`) sur chaque carte :

```dotenv
# Liste des alias d'instances séparés par des virgules
KATO_ADAPTERS=kuma_prod,kuma_lan,robot_main

# Instance 1 : Uptime Kuma Production -> Pastille "KP"
ADAPTER_KUMA_PROD_TYPE=uptimekuma
ADAPTER_KUMA_PROD_URL=https://kuma.prod.acme.fr
ADAPTER_KUMA_PROD_API_KEY=uk1_jeton_prod
ADAPTER_KUMA_PROD_POLL_INTERVAL=30000

# Instance 2 : Uptime Kuma Interne / LAN -> Pastille "KL"
ADAPTER_KUMA_LAN_TYPE=uptimekuma
ADAPTER_KUMA_LAN_URL=http://192.168.1.50:3001
ADAPTER_KUMA_LAN_API_KEY=uk1_jeton_lan
ADAPTER_KUMA_LAN_POLL_INTERVAL=15000

# Instance 3 : UptimeRobot Externe -> Pastille "RM"
ADAPTER_ROBOT_MAIN_TYPE=uptimerobot
ADAPTER_ROBOT_MAIN_API_KEY=u987654-secret
ADAPTER_ROBOT_MAIN_POLL_INTERVAL=60000
```

> [!TIP]
> **Inférence automatique du type** : Si le nom de votre alias contient `kuma` (ex. `kuma_prod`) ou `robot` (ex. `robot_main`), la variable `ADAPTER_<NOM>_TYPE` est facultative !
