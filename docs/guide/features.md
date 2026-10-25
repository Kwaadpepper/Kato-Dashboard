# Features & Display Modes

Kato is purpose-built for continuous 24/7 operation on NOC wallboards, operator workstations, and mobile on-call devices.

---

## 1. Adaptive Zero-Scroll Grid

Unlike conventional dashboards that overflow vertically as you add monitors, Kato continuously measures the available viewport via `ResizeObserver` and selects one of **5 density tiers**:

| Tier | Typical Probe Count | Visual Representation |
| :--- | :--- | :--- |
| **`large`** | 1 – 12 probes | Rich cards with full name, cleaned URL, group badge, source pill, 24h uptime, and latency. |
| **`medium`** | 13 – 48 probes | Balanced cards with title, status dot, source badge, uptime %, and response time. |
| **`compact`** | 49 – 120 probes | High-density tiles showing probe name, status color, source badge, and latency. |
| **`micro`** | 121 – 300 probes | Compact status cells with instant accessible hover/focus tooltips. |
| **`pixel`** | 300+ probes | Ultra-dense matrix heatmap where every monitor is a live status pixel. |

![High Density View](/screenshots/kato-high-density.png)

---

## 2. 24/7 TV & NOC Wallboard Mode (`?tv=1`)

Append `?tv=1` to your dashboard URL (`http://localhost:3000/?tv=1`) to activate dedicated wallboard protections:

- **Auto-Fullscreen**: Requests native browser fullscreen and re-enters after 30s of inactivity.
- **Cursor Auto-Hide**: Hides the mouse pointer after 5 seconds of inactivity.
- **Anti Burn-In Drift**: Applies a subtle ±3px periodic shift to protect OLED, AMOLED, and plasma displays from static image retention.
- **Screen Wake Lock**: Uses the Web Wake Lock API to prevent the OS or TV from dimming or sleeping.
- **Compact Header (`32px`)**: Maximizes vertical space for your probe grid.

---

## 3. Progressive Web App (PWA) & Auto-Start on OS Login

Kato includes a Web App Manifest and Service Worker so you can install it as a native-like desktop or mobile application:

1. Click the **Install Application** icon in the header (or open **Settings ⚙️ → Application (PWA)**).
2. Once installed on Chrome, Edge, or Brave, open `chrome://apps` (or `edge://apps`), right-click **Kato Dashboard**, and enable **Start app when you sign in** to launch your monitoring wallboard automatically on boot.

---

## 4. Desktop Notifications & Synthesizer Sound Alerts

Never miss an outage even when Kato is in a background window:

- **Desktop Notifications (`N`)**: Native OS notifications via the Web Notifications API. Individual alerts are emitted when 1–3 probes change state; bulk changes (>3 probes simultaneously) are automatically grouped into a single summary notification to prevent alert storms.
- **Web Audio Chimes (`M`)**: Pure synthesizer audio alerts using `OscillatorNode` (zero external MP3 files required):
  - **1–2 probes DOWN**: High-priority outage chime.
  - **≥3 probes DOWN simultaneously**: Critical triple-beep alarm + red container flash.
  - **DOWN → UP Recovery**: Pleasant ascending double-chime.

---

## 5. Privacy / Screenshot Mode (`?anonymize=1`)

Need to share a screenshot of your production dashboard in a bug report, presentation, or social media post without leaking internal hostnames or client URLs?

- Open **Settings ⚙️ → Display → Privacy Mode (Screenshot)** (or append `?anonymize=1` to the URL).
- Kato deterministically replaces all probe names, URLs, and groups with realistic infrastructure placeholders (`API Gateway Prod`, `PostgreSQL Primary`, `Redis Cache Cluster`) while **preserving your real statuses, latencies, 24h/7d uptimes, and source badges**.

---

## 6. Keyboard Shortcuts & Accessibility (WCAG AA)

Control the entire wallboard without touching a mouse:

| Key | Action |
| :--- | :--- |
| `Arrow Keys` | 2D spatial navigation across the probe grid |
| `Home` / `End` | Jump to the first (highest-priority DOWN) or last probe |
| `Enter` / `Space` | Open the 24-hour detail inspection panel for the focused probe |
| `F` | Toggle fullscreen mode |
| `M` | Toggle sound alerts |
| `N` | Toggle desktop notifications |
| `T` | Cycle color themes (`Dark` → `Light` → `AMOLED`) |
| `P` | Pause / resume the bottom incident marquee ticker |
| `?` | Open the built-in Help & Keyboard Shortcuts modal |
| `Escape` | Close active modal / exit TV fullscreen mode |
