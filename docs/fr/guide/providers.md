# Connecter vos Sources

Kato interroge vos outils de supervision côté serveur et diffuse les mises à jour en direct aux navigateurs. Vos clés API restent exclusivement sur le serveur.

---

## 1. Uptime Kuma

1. Dans **Uptime Kuma**, ouvrez **Paramètres (⚙️) → Clés API**.
2. Cliquez sur **Ajouter une clé API** et copiez le jeton généré (`uk1_...`).
3. Configurez Kato :

```dotenv
UPTIME_KUMA_URL=https://kuma.votre-domaine.fr
UPTIME_KUMA_API_KEY=uk1_votre_jeton_secret
UPTIME_KUMA_POLL_INTERVAL=60000
```

---

## 2. UptimeRobot

1. Dans **UptimeRobot**, ouvrez **Integrations & API → API** et copiez votre **Read-Only API Key**.
2. Configurez Kato :

```dotenv
UPTIMEROBOT_API_KEY=u123456-abcdef1234567890
UPTIMEROBOT_POLL_INTERVAL=30000
```

---

## 3. Mode Multi-Instances (`KATO_ADAPTERS`)

Pour regrouper plusieurs serveurs Uptime Kuma et comptes UptimeRobot sur un même écran, déclarez leurs alias dans `KATO_ADAPTERS`. Chaque source affiche sa propre pastille colorée (`KP`, `KL`, `RM`) sur chaque carte :

```dotenv
KATO_ADAPTERS=kuma_prod,kuma_lan,robot_main

# Instance 1 : Uptime Kuma Production -> Pastille "KP"
ADAPTER_KUMA_PROD_URL=https://kuma.prod.acme.fr
ADAPTER_KUMA_PROD_API_KEY=uk1_jeton_prod

# Instance 2 : Uptime Kuma Réseau Interne -> Pastille "KL"
ADAPTER_KUMA_LAN_URL=http://192.168.1.50:3001
ADAPTER_KUMA_LAN_API_KEY=uk1_jeton_lan

# Instance 3 : UptimeRobot -> Pastille "RM"
ADAPTER_ROBOT_MAIN_API_KEY=u987654-secret
```

> [!TIP]
> Si l'alias contient `kuma` ou `robot`, Kato déduit automatiquement le type de source. Sinon, précisez `ADAPTER_<ALIAS>_TYPE=uptimekuma` ou `uptimerobot`.
