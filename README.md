# SecureBank AI — Admin Platform

Plateforme intelligente de détection de fraude bancaire avec interface administrateur.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vite + React 19)               │
│  localhost:5173                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Admin Pages                        Customer Pages    │  │
│  │  ┌──────────┐ ┌──────────┐         ┌──────────────┐  │  │
│  │  │Dashboard │ │  Users   │         │ Dashboard    │  │  │
│  │  ├──────────┤ ├──────────┤         ├──────────────┤  │  │
│  │  │  Alerts  │ │Analyses  │         │  Historique  │  │  │
│  │  ├──────────┤ ├──────────┤         ├──────────────┤  │  │
│  │  │Documents │ │ Reports  │         │ Notifications│  │  │
│  │  ├──────────┤ ├──────────┤         ├──────────────┤  │  │
│  │  │ Settings │ │ Profile  │         │    Profile   │  │  │
│  │  └──────────┘ └──────────┘         └──────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                       axios / fetch                          │
└─────────────────────────────────┬───────────────────────────┘
                                  │ HTTP (localhost:5000)
┌─────────────────────────────────▼───────────────────────────┐
│                  Backend (Flask 3.x)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  routes.py                    app.py / config.py      │  │
│  │  ┌─────────────────────┐     ┌─────────────────────┐  │  │
│  │  │ Admin Endpoints:    │     │ CORS, DB init       │  │  │
│  │  │ GET /admin/stats    │     │ Bcrypt, Login       │  │  │
│  │  │ GET/POST /admin/... │     │ Session management  │  │  │
│  │  │ PUT /admin/users/:id│     └─────────────────────┘  │  │
│  │  │ POST /admin/alerts/ │                              │  │
│  │  │   :id/resolve       │     dbmodel.py               │  │
│  │  │ ... (25+ endpoints) │     ┌─────────────────────┐  │  │
│  │  └─────────────────────┘     │ User, Client        │  │  │
│  │                              │ Merchant, Transaction│  │  │
│  │  seed.py / train_model.py    │ AdminDocument       │  │  │
│  │  ┌─────────────────────┐     └─────────────────────┘  │  │
│  │  │ Seed data (7 clients │                              │  │
│  │  │ 10 merchants, 1      │     fraud_model.pkl          │  │
│  │  │ admin, 122 txns)     │     ├─ RandomForest (99%)    │  │
│  │  │ ML training (110K    │     label_encoder.pkl        │  │
│  │  │ Kaggle rows)         │     category_encoder.pkl     │  │
│  │  └─────────────────────┘                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                     SQLAlchemy + PyMySQL                     │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────┐
│              MySQL (Docker) localhost:3306                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  users   │ │ clients  │ │merchants │ │ transactions  │   │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────────┤   │
│  │ id (PK)  │ │client_id │ │merchant_ │ │transactions_  │   │
│  │ email    │ │ (PK)     │ │ id (PK)  │ │ id (PK)       │   │
│  │ password │ │user_id   │ │user_id   │ │client_id (FK) │   │
│  │ hash     │ │ (FK)     │ │ (FK)     │ │merchant_id(FK)│   │
│  │ role     │ │first_name│ │merchant_  │ │amount         │   │
│  │ created_ │ │last_name │ │ name      │ │transaction_   │   │
│  │ at       │ │city      │ │category   │ │ time          │   │
│  └──────────┘ │latitude  │ │city       │ │is_fraud       │   │
│               │longitude │ │latitude   │ │fraud_         │   │
│               │age       │ │longitude  │ │probability    │   │
│               │gender    │ │created_at │ │distance_km    │   │
│               └──────────┘ └──────────┘ └──────────────┘   │
│                                   ┌──────────────────┐     │
│                                   │ admin_documents  │     │
│                                   │ doc_id (PK)      │     │
│                                   │ user_id (FK)     │     │
│                                   │ filename         │     │
│                                   │ filetype         │     │
│                                   │ uploaded_at      │     │
│                                   └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## ML Pipeline

```
Kaggle Fraud Dataset (110K rows)
        │
        ▼
  19 features: amount, gender, hour, age, distance,
              14 one-hot category columns
        │
        ▼
  RandomForest Classifier
  ├─ Accuracy:  99.0%
  ├─ Precision: 91.0%
  └─ Recall:    99.0%
        │
        ▼
  fraud_model.pkl  →  Real-time fraud prediction
                       via POST /transaction endpoint
```

## Tech Stack

| Layer | Technologie |
|-------|------------|
| Frontend | React 19, Vite 8, MUI 9, Recharts 2 |
| Backend | Flask 3, SQLAlchemy, PyMySQL |
| ML | scikit-learn (RandomForest), joblib, pickle |
| OCR | easyOCR, OpenCV |
| Database | MySQL 8 (Docker) |
| Auth | flask-bcrypt, flask-login |
| Maps | Nominatim (OpenStreetMap) |

---

## Accounts de test

Tous les mots de passe sont : **`123456`**

### Admin
| Email | Rôle |
|-------|------|
| admin@test.com | Administrateur |

### Clients
| Email | Nom |
|-------|-----|
| alice@test.com | Alice Martin (Paris) |
| bob@test.com | Bob Bernard (Lyon) |
| charlie@test.com | Charlie Durand (Marseille) |
| diana@test.com | Diana Petit (Toulouse) |
| elise@test.com | Elise Moreau (Bordeaux) |
| farid@test.com | Farid Leroy (Nice) |
| gina@test.com | Gina Roux (Lille) |

### Commerçants
| Email | Commerce | Catégorie | Ville |
|-------|----------|-----------|-------|
| merchant@test.com | TechWorld | shopping_net | Paris |
| m2@test.com | LeBonMarché | grocery_pos | Lyon |
| m3@test.com | AutoService | transport | Marseille |
| m4@test.com | CaféCentral | food_dining | Toulouse |
| m5@test.com | BoutiqueChic | shopping_net | Bordeaux |
| m6@test.com | HôtelAzur | travel | Nice |
| m7@test.com | PharmaciePlus | health | Lille |
| m8@test.com | StationNord | fuel | Paris |
| m9@test.com | Boulangerie | food_dining | Lyon |
| m10@test.com | SportDirect | shopping_net | Marseille |

---

## Admin API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/stats` | Statistiques dashboard |
| GET | `/admin/users` | Liste des utilisateurs |
| POST | `/admin/users` | Créer un utilisateur |
| PUT | `/admin/users/<id>` | Modifier un utilisateur |
| DELETE | `/delete/<id>` | Supprimer un utilisateur |
| GET | `/admin/alerts` | Alertes fraude |
| POST | `/admin/alerts/<id>/resolve` | Résoudre une alerte |
| GET | `/admin/charts` | Données graphiques (7 jours) |
| GET | `/admin/analyses` | Analyses transactions |
| GET | `/admin/documents` | Documents utilisateurs |
| POST | `/admin/documents` | Uploader un document |
| GET | `/admin/reports?period=7d|30d|90d` | Rapports activité |
| GET | `/admin/settings` | Paramètres actuels |
| PUT | `/admin/settings` | Mettre à jour paramètres |
| PUT | `/admin/profile` | Modifier profil admin |
| POST | `/admin/change-password` | Changer mot de passe |

---

## Démarrage rapide

```bash
# Tout en un
chmod +x start.sh
./start.sh

# Ou manuellement :
# 1. MySQL (Docker)
docker start mysql-backend 2>/dev/null || docker run -d --name mysql-backend \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=flaskdb \
  -e MYSQL_USER=user2 \
  -e MYSQL_PASSWORD=1234 \
  -p 3306:3306 mysql:8

# 2. Backend
cd backend
cp .env.example .env          # éditer avec vos identifiants SMTP
venv/bin/pip install -r requirements.txt 2>/dev/null || true
venv/bin/python seed.py       # reset + seed DB
venv/bin/python run.py        # → http://127.0.0.1:5000

# 3. Frontend
cd ..
npm install
npm run dev                   # → http://localhost:5173
```

## Configuration

| Fichier | Variables |
|---------|-----------|
| `backend/.env` | `API_KEY` (freecurrencyapi), `MAIL_USERNAME`/`MAIL_PASSWORD` (Gmail SMTP) |
| `.env` (racine) | `VITE_API_URL=http://localhost:5000` |

Pour recevoir les notifications email de fraude, remplissez les vars SMTP Gmail dans `backend/.env` :
```
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx    # mot de passe d'application
```

## Real-time notifications (Socket.IO)

Le backend émet des événements en direct :
- `new_alert` — dès qu'une transaction frauduleuse est détectée (toast + email)
- `alert_resolved` — quand une alerte est résolue

L'icône de cloche dans l'AdminHeader et les toasts sont mis à jour automatiquement via Socket.IO.

## Admin UI

Connectez-vous sur `http://localhost:5173/loginadmin` avec `admin@test.com` / `123456`.
