# Correctifs & Améliorations — SecureBank Admin

> **Auteur : Sara Assil**  
> Travail de correction, débogage et amélioration de la plateforme SecureBank Admin.

---

## 1. ID Verify — Caméra bloquée sur "Caméra active..."

**Problème :** La boucle de détection faciale (`runDetection`) capturait `cameraOn` (state React) dans sa closure. Appelée plus tard via `requestAnimationFrame`, la valeur était périmée → la boucle se terminait immédiatement sans rien détecter.

**Correctif :**  
- Remplacement de `cameraOn` (state) par `cameraActiveRef.current` (ref mutable)  
- La boucle lit toujours la valeur à jour, même en callback RAF asynchrone  
- `runDetection` stabilisée (deps `[]`) et synchronisée via `useEffect`

**Fichier :** `src/pages/IDVerify/IDVerify.jsx`

---

## 2. ID Verify — Thème incohérent (rouge/blanc vs plateforme sombre)

**Problème :** La page ID Verify utilisait des couleurs rouge (`#E2001A`) et fond clair (`#F2F2F7`) alors que la plateforme utilise un thème sombre gradient violet/bleu.

**Correctif :**  
- Fond : `#020617 → #040816` (gradient sombre)  
- Header : `#0A1936 → #162447` (bleu foncé)  
- Boutons : gradient purple (`#8B5CF6`) / success green (`#22C55E`)  
- Cadre caméra : bordure purple au lieu de rouge  
- Icônes, bordures, textes, inputs, badges — tous alignés sur le thème dark

**Fichiers :** `src/pages/IDVerify/IDVerify.jsx`, `src/pages/IDVerify/IDVerify.css`

---

## 3. ID Verify — Balises HTML rendues comme texte brut

**Problème :** Les balises `<strong>` dans les messages de résultat (autorisée/annulée) étaient dans des chaînes JS → React les affichait littéralement au lieu de les interpréter comme HTML.

**Correctif :** Utilisation de `dangerouslySetInnerHTML` pour les messages contenant du HTML.

**Fichier :** `src/pages/IDVerify/IDVerify.jsx`

---

## 4. Notifications — Page bloquée sur "Chargement..."

**Problème :** L'appel `axios.post(...)` n'avait pas de timeout → si le backend était temporairement indisponible, la requête pendait indéfiniment → `setLoading(false)` n'était jamais appelé.

**Correctif :**  
- Ajout de `{ timeout: 8000 }` à l'appel axios  
- `AbortController` avec timeout 8s pour l'appel `fetch()` dans `historique.jsx`  
- `JSON.parse(localStorage.getItem("user"))` protégé par `try/catch` pour éviter un crash silencieux  
- Garde `if (!user?.id) return` avant toute utilisation de `user.id`

**Fichiers :** `src/components/Notifications/notifications.jsx`, `src/components/reports/historique.jsx`

---

## 5. Lint — 40 erreurs → 0

| Fichier | Problème | Correctif |
|---------|----------|-----------|
| `Dashboard.jsx` | Icônes inutilisées, `setUser` inutilisé, `setState` synchrone dans `useEffect` | Lazy `useState` + navigation guard |
| `profile.jsx` | `IconButton`, `PhotoCameraIcon` inutilisés, `setState` synchrone | Lazy `useState` + imports supprimés |
| `AboutUs.jsx` | `import React` inutile (JSX transform auto) | Supprimé |
| `Login.jsx` | Imports inutilisés, `setIsRegister` jamais appelé, `inputStyle` inutilisé | Supprimés |
| `signup.jsx` | `TextField`, `MenuItem` inutilisés | Supprimés |
| `notifications.jsx` | `setState` dans effet + dépendance manquante | Fonction déplacée dans l'effet |
| `historique.jsx` | Dépendance `showToast` manquante | Ajoutée au tableau de dépendances |
| `biometric/app.js` | Legacy vanilla JS, `faceapi` non défini | `/* eslint-disable */` en tête |

---

## 6. Documents — Téléchargement / Visualisation

**Problème :** Les icônes "œil" et "téléchargement" sur la page Documents n'étaient pas câblées.

**Correctif :**  
- Œil → `GET /admin/documents/<id>/view` (nouvel onglet)  
- Téléchargement → `GET /admin/documents/<id>/download`

**Fichier :** `src/components/documents/documents.jsx`

---

## 7. Rapports — Graphique journalier

**Correctif :** Graphique à barres (Recharts) transactions vs fraudes par jour sur la page Reports. Requête backend `/daily-chart-data` avec données des 90 jours.

**Fichiers :** `src/pages/ReportsPage.jsx`, `src/components/reports/ReportsTable.jsx`, `backend/routes.py` (ligne 956)

---

## 8. Seed Data — 90 jours au lieu de quelques heures

**Problème :** Le filtre de période (7d/30d/90d) sur les rapports renvoyait toujours les mêmes données car les transactions étaient trop rapprochées.

**Correctif :** `minutes_ago` → `hours_ago` (plage 0–2160) pour couvrir 90 jours de données.

**Fichier :** `backend/seed.py`

---

## 9. Notifications temps réel — Socket.IO + Email SMTP

**Correctif :**  
- Backend Socket.IO (flask-socketio + eventlet) sur port 5000  
- Événements : `new_alert` (fraude), `alert_resolved` (résolution)  
- Email Gmail SMTP via `flask-mail` et `notify_fraud()`  
- Frontend `NotificationContext.jsx` : connexion Socket.IO, Snackbar toast, état des alertes  
- Toutes les routes enveloppées par `NotificationProvider`

**Fichiers :** `src/context/NotificationContext.jsx`, `src/routes/AppRoutes.jsx`, `backend/app.py`, `backend/routes.py`, `backend/config.py`

---

## 10. Suppression des `console.log` / `alert()`

**Problème :** 10+ fichiers contenaient des `console.log/error/warn` et des `alert()` natives, nuisibles en production.

**Correctif :**  
- Tous les `console.log/error/warn` → `showToast()` (NotificationContext)  
- Tous les `alert()` → Snackbar MUI stylisé (info, success, warning, error)

**Fichiers concernés :** `Dashboard.jsx`, `Login.jsx`, `signup.jsx`, `Sidebar.jsx`, `historique.jsx`, `notifications.jsx`, `documents.jsx`, `profile.jsx`, `parametres.jsx`, `SettingsPanel.jsx`

---

## 11. Démarrage — Script unifié

**Correctif :** Création de `start.sh` qui lance MySQL (Docker), backend Flask, et frontend Vite en séquence avec `setsid`/`nohup`.

**Fichier :** `start.sh`

---

## 12. Documentation & Configuration

**Correctif :**  
- `ENV_GUIDE.md` : où récupérer la clé freecurrencyapi et le mot de passe d'application Gmail  
- `backend/.env.example` + `backend/.env` avec variables SMTP et `API_KEY`  
- `.env` frontend avec `VITE_API_URL=http://localhost:5000`

---

## 13. Déploiement Git

- Commit `399e6a6` — 22 fichiers, 1201 insertions  
- Push vers GitHub

---

## Résumé des technologies

| Couche | Stack |
|--------|-------|
| Frontend | Vite 8, React 19, MUI 9, Recharts, socket.io-client, face-api.js (CDN) |
| Backend | Flask 3, flask-socketio 5, eventlet, flask-mail, PyMySQL |
| Base de données | MySQL 8 (Docker) |
| IA | face-api.js (TinyFaceDetector, FaceLandmark68, FaceRecognition) |
| API externe | freecurrencyapi |
| Email | Gmail SMTP (mot de passe d'application) |
