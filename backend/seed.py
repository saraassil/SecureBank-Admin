from app import create_app, db
from dbmodel import User, Client, Merchant, Transaction
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import random

app = create_app()
bcrypt = Bcrypt(app)

pw = bcrypt.generate_password_hash("123456").decode("utf-8")

clients_data = [
    ("alice@test.com", "Alice", "Martin", "Paris", 48.8566, 2.3522, 28, "F", "CLT-001"),
    ("bob@test.com", "Bob", "Bernard", "Lyon", 45.7640, 4.8357, 35, "M", "CLT-002"),
    ("charlie@test.com", "Charlie", "Durand", "Marseille", 43.2965, 5.3698, 42, "M", "CLT-003"),
    ("diana@test.com", "Diana", "Petit", "Toulouse", 43.6047, 1.4442, 26, "F", "CLT-004"),
    ("elise@test.com", "Elise", "Moreau", "Bordeaux", 44.8378, -0.5792, 33, "F", "CLT-005"),
    ("farid@test.com", "Farid", "Leroy", "Nice", 43.7102, 7.2620, 45, "M", "CLT-006"),
    ("gina@test.com", "Gina", "Roux", "Lille", 50.6292, 3.0573, 29, "F", "CLT-007"),
]

merchants_data = [
    ("merchant@test.com", "TechWorld", "MER-001", "shopping_net", "Paris", 48.8566, 2.3522),
    ("m2@test.com", "LeBonMarché", "MER-002", "grocery_pos", "Lyon", 45.7640, 4.8357),
    ("m3@test.com", "AutoService", "MER-003", "transport", "Marseille", 43.2965, 5.3698),
    ("m4@test.com", "CaféCentral", "MER-004", "food_dining", "Toulouse", 43.6047, 1.4442),
    ("m5@test.com", "BoutiqueChic", "MER-005", "shopping_net", "Bordeaux", 44.8378, -0.5792),
    ("m6@test.com", "HôtelAzur", "MER-006", "travel", "Nice", 43.7102, 7.2620),
    ("m7@test.com", "PharmaciePlus", "MER-007", "health", "Lille", 50.6292, 3.0573),
    ("m8@test.com", "StationNord", "MER-008", "fuel", "Paris", 48.8566, 2.3522),
    ("m9@test.com", "Boulangerie", "MER-009", "food_dining", "Lyon", 45.7640, 4.8357),
    ("m10@test.com", "SportDirect", "MER-010", "shopping_net", "Marseille", 43.2965, 5.3698),
]

with app.app_context():
    db.drop_all()
    db.create_all()

    client_list = []
    for email, fn, ln, city, lat, lon, age, gender, code in clients_data:
        u = User(email=email, password_hash=pw, role="Client")
        db.session.add(u); db.session.flush()
        c = Client(user_id=u.id, first_name=fn, last_name=ln, city=city,
                   latitude=lat, longitude=lon, age=age, gender=gender, client_code=code)
        db.session.add(c); db.session.flush()
        client_list.append(c)

    merchant_list = []
    for email, name, code, cat, city, lat, lon in merchants_data:
        u = User(email=email, password_hash=pw, role="Merchant")
        db.session.add(u); db.session.flush()
        m = Merchant(user_id=u.id, merchant_name=name, merchant_code=code,
                     category=cat, city=city, latitude=lat, longitude=lon)
        db.session.add(m); db.session.flush()
        merchant_list.append(m)

    admin_user = User(email="admin@test.com", password_hash=pw, role="admin")
    db.session.add(admin_user)
    db.session.flush()

    now = datetime.utcnow()
    for i in range(120):
        client = random.choice(client_list)
        merchant = random.choice(merchant_list)
        amount = round(random.uniform(5, 1500), 2)
        hours_ago = random.randint(0, 2160)
        ts = now - timedelta(hours=hours_ago)
        dist = round(random.uniform(0.1, 50), 2)
        is_fraud = amount > 800 and random.random() < 0.3
        prob = round(random.uniform(0, 1), 4) if is_fraud else round(random.uniform(0, 0.3), 4)
        if is_fraud and prob < 0.5:
            prob = round(random.uniform(0.5, 0.99), 4)
        t = Transaction(
            client_id=client.client_id,
            merchant_id=merchant.merchant_id,
            amount=amount,
            transaction_time=ts,
            distance_km=dist,
            fraud_probability=prob,
            is_fraud=is_fraud,
        )
        db.session.add(t)

    db.session.commit()
    print("Database reset and populated!")
    print(f"  {len(client_list)} clients")
    print(f"  {len(merchant_list)} merchants")
    print(f"  1 admin")
    print(f"  120 transactions (fraudulent ones: {Transaction.query.filter_by(is_fraud=True).count()})")
    print()
    print("All users password: 123456")
    print("  Client:   alice@test.com")
    print("  Merchant: merchant@test.com")
    print("  Admin:    admin@test.com")
