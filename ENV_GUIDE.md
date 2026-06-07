# Guide d'obtention des clés d'environnement

## 1. API_KEY — Conversion de devises (freecurrencyapi)

Utilisé par les endpoints `/convert` et `/calculate` sur la page `/analyses`.

1. Aller sur https://freecurrencyapi.com
2. Créer un compte gratuit (100 requêtes/mois)
3. Récupérer la clé API dans le dashboard
4. Dans `backend/.env` :
   ```
   API_KEY=votre_clé_ici
   ```

---

## 2. MAIL_USERNAME / MAIL_PASSWORD — Notifications email (Gmail SMTP)

Utilisé pour envoyer des alertes par email quand une fraude est détectée.

### Obtenir un mot de passe d'application Gmail :

1. Activer **l'authentification à deux facteurs (2FA)** sur votre compte Google
   - https://myaccount.google.com/security
2. Aller dans **Mots de passe des applications**
   - https://myaccount.google.com/apppasswords
3. Sélectionner "Autre" comme application, donner un nom (ex: "SecureBank")
4. Copier le mot de passe généré (16 caractères, format `xxxx xxxx xxxx xxxx`)
5. Dans `backend/.env` :
   ```
   MAIL_USERNAME=votre.email@gmail.com
   MAIL_PASSWORD=xxxx xxxx xxxx xxxx
   MAIL_DEFAULT_SENDER=votre.email@gmail.com
   ADMIN_EMAIL=votre.email@gmail.com
   ```

**Note :** Gmail bloque les connexions sans mot de passe d'application si 2FA est activé. Si vous n'avez pas 2FA, activez "Accès aux applications moins sécurisées" (déprécié par Google).

---

## 3. VITE_API_URL — URL du backend (frontend)

Déjà configuré par défaut, pas besoin de changer sauf si le backend tourne sur un autre port/hôte.

Dans `.env` (racine du projet) :
```
VITE_API_URL=http://localhost:5000
```

---

## Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `backend/.env` | Clés backend (API_KEY, SMTP) |
| `.env` (racine) | Variables frontend (VITE_API_URL) |
| `backend/.env.example` | Template avec toutes les vars documentées |

Après avoir rempli les clés, redémarrer le backend :
```bash
cd backend
fuser -k 5000/tcp
nohup venv/bin/python run.py &
```
