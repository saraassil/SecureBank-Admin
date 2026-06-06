from flask import request,jsonify,Response,stream_with_context,send_file,render_template_string
from flask_mail import Message
from dbmodel import Client,User,Merchant,Transaction,AdminDocument
from flask_login import login_user,logout_user
from sqlalchemy import func, text
import easyocr
import cv2
import re
import numpy as np
import requests
from uuid import uuid4
import pickle
from datetime import datetime, timedelta
from haversine import haversine, Unit
import joblib
import time
import json
import os

from config import API_KEY

def generate_client_code():
    return f"CLT-{uuid4().hex[:8].upper()}"

def generate_merchant_code():
    return  f"MER-{uuid4().hex[:8].upper()}"


def get_coordinates(city):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": city,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "FraudDetectionApp/1.0"
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    if data:
        return float(data[0]["lat"]), float(data[0]["lon"])

    return None



def register_routes(app,db,bcrypt,socketio,mail):
    from threading import Thread
    from config import ADMIN_EMAIL

    def send_async_email(subject, recipients, html_body):
        with app.app_context():
            try:
                msg = Message(subject, recipients=recipients, html=html_body)
                mail.send(msg)
            except Exception:
                pass

    def notify_fraud(txn, client, merchant, probability):
        admin_email = ADMIN_EMAIL or "admin@test.com"
        subject = f"[SecureBank] Alerte Fraude - Transaction #{txn.transactions_id}"
        body = f"""
        <h2>Alerte Fraude Détectée</h2>
        <p><b>Transaction:</b> #{txn.transactions_id}</p>
        <p><b>Client:</b> {client.first_name} {client.last_name} ({client.email})</p>
        <p><b>Commerçant:</b> {merchant.merchant_name}</p>
        <p><b>Montant:</b> {txn.amount:.2f} $</p>
        <p><b>Probabilité:</b> {probability*100:.1f}%</p>
        <p><b>Date:</b> {txn.transaction_time}</p>
        """
        Thread(target=send_async_email, args=(subject, [admin_email], body)).start()
        socketio.emit("new_alert", {
            "id": txn.transactions_id,
            "client": f"{client.first_name} {client.last_name}",
            "amount": txn.amount,
            "probability": round(probability * 100, 1),
            "date": txn.transaction_time.strftime("%d/%m/%Y %H:%M"),
        })

    @app.route("/")
    def index():
        return jsonify({"message": "API is running"})
    
    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()

        role=data.get("role")
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({
                "error": "Invalid email or password"
            }), 401

        if role == "Client":
            client = Client.query.filter_by(user_id=user.id).first()
            if user and bcrypt.check_password_hash(user.password_hash, password):
                login_user(user)
                return jsonify({
                    "role": "Client",
                    "firstname": client.first_name,
                    "lastname":client.last_name,
                    "city":client.city,
                    "email":user.email,
                    "date":client. inscription_date,
                    "id": user.id,

                }), 200
        
        elif role == "Merchant":
            merchant = Merchant.query.filter_by(user_id=user.id).first()
            if user and bcrypt.check_password_hash(user.password_hash, password):
                login_user(user)
                return jsonify({
                    "role": "Merchant",
                    "merchantname": merchant.merchant_name,
                    "city":merchant.city,
                    "email":user.email,
                    "date":merchant.created_at,
                    "id": user.id,
                }), 200

        elif role == "admin":
            if user.role == "admin" and bcrypt.check_password_hash(user.password_hash, password):
                clients = Client.query.all()
                merchants = Merchant.query.all()
                return jsonify({
                    "role": "admin",
                    "email": user.email,
                    "id": user.id,
                }), 200

        return jsonify({"error": "Invalid email or password"}), 401
    
    
    @app.route("/logout", methods=["POST"])
    def logout():
        logout_user()
        return jsonify({"message": "Logged out successfully"}), 200
 
    


    @app.route("/signup", methods=["POST"])
    def signup():
        data = request.get_json()
        role=data.get("role")

       
        email = data.get("email")
        password = data.get("password")

        city=data.get("city")
        lat,long=get_coordinates(city)

        
        if role=="Client":
            firstname = data.get("firstname")
            lastname = data.get("lastname")
            gender=data.get("gender")
            age=int(data.get("age"))
            # Check if user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({
                    "message": "User already exists"
                }), 400
            if lat == None or long==None :
                return jsonify({
                    "message": "city not found"
                }), 400

            # Hash password
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

            # Create new user
            user = User(
            role=role,
            email=email,
            password_hash=hashed_password
        )

            db.session.add(user)
            db.session.flush()  # creates user.id

            client = Client(
                user_id=user.id,
                first_name=firstname,
                last_name=lastname,
                city=city,
                age=age,
                latitude=lat,
                longitude=long,
                gender=gender,
                client_code=generate_client_code()
            )

            db.session.add(client)
            db.session.commit()

            return jsonify({
                "message": "User created",
                "role": "Client",
                "firstname": client.first_name,
                "lastname":client.last_name,
                "city":client.city,
                "email":user.email,
                "date":client.inscription_date,
                "id": user.id,

            }), 201
        

        else:

            merchant_name=data.get("merchant_name")
            category=data.get("category")
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({
                    "message": "User already exists"
                }), 400
            elif lat == None or long==None :
                return jsonify({
                    "message": "city not found"
                }), 400

            # Hash password
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

            # Create new user
            user = User(
                role=role,
                email=email,
                password_hash=hashed_password
            )

            db.session.add(user)
            db.session.flush()

            merchant = Merchant(
                user_id=user.id,
                merchant_name=merchant_name,
                category=category,
                city=city,
                latitude=lat,
                longitude=long,
                merchant_code=generate_merchant_code()
            )

            db.session.add(merchant)
            db.session.commit()

            return jsonify({
                "message": "User created",
                "email":user.email,
                "role":"Merchant",
                "merchantname":merchant.merchant_name,
                "city":merchant.city,
                "date":merchant.created_at,
                "id": user.id,
            }), 201

        
    @app.route("/delete/<int:id>", methods=["DELETE"])
    def delete_user(id):
        try:
            
            user = User.query.filter_by(id=id).first()

            if not user:
                return jsonify({"error": "User not found"}), 404

            # 🔥 Check role
            if user.role == "Client":
                client = Client.query.filter_by(user_id=user.id).first()

                if client:
                    db.session.delete(client)

            elif user.role == "Merchant":
                merchant = Merchant.query.filter_by(user_id=user.id).first()

                if merchant:
                    db.session.delete(merchant)

            # delete user in all cases
            db.session.delete(user)

            db.session.commit()

            return jsonify({"message": f"{user.role} deleted successfully"}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    
    
    @app.route("/admin/analyses/<int:txn_id>", methods=["DELETE"])
    def admin_delete_analysis(txn_id):
        try:
            txn = Transaction.query.get(txn_id)
            if not txn:
                return jsonify({"error": "Transaction not found"}), 404
            db.session.delete(txn)
            db.session.commit()
            return jsonify({"message": "Transaction deleted"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @app.route("/update", methods=["POST"])
    def update():
        data = request.get_json()

        user_id = data.get("user_id")
        email = data.get("email")
        city = data.get("city")
        role = data.get("role")


        user = User.query.get(user_id)
        


        if not user:
            return jsonify({"message": "User not found"}), 404

        # UPDATE USER (email)
        if email and email != user.email:
            existing_user = User.query.filter_by(email=email).first()

            if existing_user:
                return jsonify({"message": "Email already exists"}), 400

            user.email = email
        # GET COORDINATES (optional update)
        lat, lon = None, None
        if city:
            try:
                lat, lon = get_coordinates(city)
            except Exception:
                return jsonify({"message": "city lookup failed"}), 500

        # CLIENT UPDATE
        if role == "Client":
            client = Client.query.filter_by(user_id=user.id).first()

            if not client:
                return jsonify({"message": "Client profile not found"}), 404

            client.first_name = data.get("firstname", client.first_name)
            client.last_name = data.get("lastname", client.last_name)

            if city:
                client.city = city
                client.latitude = lat
                client.longitude = lon

        # MERCHANT UPDATE
        elif role == "Merchant":
            merchant = Merchant.query.filter_by(user_id=user.id).first()

            if not merchant:
                return jsonify({"message": "Merchant profile not found"}), 404

            merchant.merchant_name = data.get("merchant_name", merchant.merchant_name)
            merchant.category = data.get("category", merchant.category)

            if city:
                merchant.city = city
                merchant.latitude = lat
                merchant.longitude = lon

        else:
            return jsonify({"message": "Invalid role"}), 400

        db.session.commit()

        return jsonify({
            "message": "User updated successfully"
        }), 200

    @app.route("/history", methods=["POST"])
    def history():
        data = request.get_json()

        print("Received:", data)

        user_id = data.get("user_id")

        print("user_id =", user_id)

        if not user_id:
            return jsonify({"error": "id is required"}), 400

        transactions = Transaction.query.filter_by(client_id=user_id).all()
        
        print("transactions found:", len(transactions))

        return jsonify([
            {
                "id": t.transactions_id,
                "amount": t.amount,
                "date": t.transaction_time.strftime("%Y-%m-%d %H:%M:%S"),
                "is_fraud": t.is_fraud,
                "destination":(
                        merchant.merchant_name
                        if (merchant := Merchant.query.filter_by(
                        merchant_id=t.merchant_id
                        ).first())
                        else None
                ),
            }
            for t in transactions
        ])
    


    @app.route("/notification",methods=["POST"])
    def notifier():
        data = request.get_json()

        print("Received:", data)

        user_id = data.get("user_id")

        print("user_id =", user_id)

        if not user_id:
            return jsonify({"error": "id is required"}), 400

        transactions = ( Transaction.query .filter_by(client_id=user_id) .order_by(Transaction.transaction_time.desc()).limit(4).all() )
        
        print("transactions found:", len(transactions))

        return jsonify([
            {
                "id": t.transactions_id,
                "amount": t.amount,
                "date": t.transaction_time.strftime("%Y-%m-%d %H:%M:%S"),
                "is_fraud": t.is_fraud,
                 "merchant": (
                        Merchant.query.filter_by(merchant_id=t.merchant_id).first().merchant_name
                        if Merchant.query.filter_by(merchant_id=t.merchant_id).first()
                        else None
                    )
            }
            for t in transactions
        ])
    
    @app.route("/merchant-notification", methods=["POST"])
    def merchant_notifications():
        data = request.get_json()

        merchant_id = data.get("merchant_id")
        print("merchantmerchant_id")
        merid=Merchant.query.filter_by(user_id=merchant_id).first()
        transactions = (
            Transaction.query
            .filter_by(
                merchant_id=merid.merchant_id,
                is_fraud=0
            )
            .order_by(Transaction.transaction_time.desc())
            .limit(20)
            .all()
        )

        return jsonify([
            {
                "id": t.transactions_id,
                "amount": t.amount,
                "date": t.transaction_time.strftime("%Y-%m-%d %H:%M:%S"),
                "client": f"{Client.query.get(t.client_id).first_name} {Client.query.get(t.client_id).last_name}",
                "message": f"Received {t.amount}$ from {Client.query.get(t.client_id).first_name}"
            }
            for t in transactions
        ])

    
    @app.route("/transaction", methods=["POST"])
    def create_transaction():
        data = request.get_json()

        client_id = data.get("user_id")
        merchant_code = data.get("merchant_code")
        amount = data.get("amount")

        print(data)
        # Validation
        if not client_id or not merchant_code or not amount:
            return jsonify({
                "error": "Missing required fields"
            }), 400

        client = Client.query.get(client_id)
        merchant = Merchant.query.filter_by(merchant_code=merchant_code).first()

        if not client:
            return jsonify({"error": "Client not found"}), 404

        if not merchant:
            return jsonify({"error": "Merchant not found"}), 404
        

        with open("label_encoder.pkl", "rb") as f:
            le = pickle.load(f)

        with open("category_encoder.pkl", "rb") as f:
            encoder = pickle.load(f)

        gender_encoded = le.transform([client.gender])[0]

        category_encoded = encoder.transform([[merchant.category]])[0]

        distance=haversine(
        (client.latitude, client.longitude),
        (merchant.latitude, merchant.longitude),
        unit=Unit.KILOMETERS)

        # Features for the ML model
        features = [[
            float(amount), gender_encoded,datetime.now().hour,client.age, distance, *category_encoded]]

        fraud_model = joblib.load("fraud_model.pkl")

        prediction = fraud_model.predict(features)[0]
        probability=fraud_model.predict_proba(features)[0][1]

        is_fraud = bool(prediction)

        transaction = Transaction(
            client_id=client_id,
            merchant_id=merchant.merchant_id,
            amount=amount,
            fraud_probability=probability,
            is_fraud=is_fraud,
           distance_km=distance
        )

        db.session.add(transaction)
        db.session.commit()

        if is_fraud:
            notify_fraud(transaction, client, merchant, probability)

        return jsonify({
            "message": "Transaction created",
            "transaction_id": transaction.transactions_id,
            "is_fraud": is_fraud
        }), 201


    @app.route('/stats-stream/<int:user_id>')
    def stats_stream(user_id):
        @stream_with_context
        def generate():
            while True:

                transactions = Transaction.query.filter_by(
                    client_id=user_id
                ).all()

                total_transactions = len(transactions)

                fraud_transactions = sum(
                    1 for t in transactions if t.is_fraud
                )

                total_amount = sum(
                    t.amount for t in transactions
                )

                fraud_rate = (
                    round((fraud_transactions / total_transactions) * 100, 2)
                    if total_transactions > 0 else 0
                )

                last_transaction = (
                    max(transactions, key=lambda x: x.transaction_time).transaction_time.strftime("%Y-%m-%d %H:%M:%S")
                    if transactions else None
                )

                stats = {
                    "total_transactions": total_transactions,
                    "fraud_transactions": fraud_transactions,
                    "total_amount": round(total_amount, 2),
                    "fraud_rate": fraud_rate,
                    "last_transaction": last_transaction
                }

                yield f"data: {json.dumps(stats)}\n\n"

                time.sleep(2)

        return Response(
            generate(),
            mimetype="text/event-stream"
        )


    @app.route('/merchant-stats-stream/<int:merchant_id>')
    def merchant_stats_stream(merchant_id):

        @stream_with_context
        def generate():
            while True:

                transactions = Transaction.query.filter_by(
                    merchant_id=merchant_id
                ).all()

                total_transactions = len(transactions)

                fraud_transactions = sum(
                    1 for t in transactions if t.is_fraud
                )

                total_amount = sum(
                    t.amount for t in transactions if not t.is_fraud
                )

                fraud_rate = (
                    round((fraud_transactions / total_transactions) * 100, 2)
                    if total_transactions > 0 else 0
                )

                last_transaction = (
                    max(transactions, key=lambda x: x.transaction_time)
                    .transaction_time.strftime("%Y-%m-%d %H:%M:%S")
                    if transactions else None
                )

                # EXTRA FOR MERCHANT
                total_revenue = round(
                    sum(t.amount for t in transactions if not t.is_fraud),
                    2
                )

                stats = {
                    "total_transactions": total_transactions,
                    "fraud_transactions": fraud_transactions,
                    "total_revenue": total_revenue,
                    "fraud_rate": fraud_rate,
                    "last_transaction": last_transaction
                }

                yield f"data: {json.dumps(stats)}\n\n"

                time.sleep(2)

        return Response(
            generate(),
            mimetype="text/event-stream"
        )


    @app.route("/convert")
    def convert():
        base = request.args.get("base")
        currency = request.args.get("currency")

        url = (
            f"https://api.freecurrencyapi.com/v1/latest"
            f"?apikey={API_KEY}"
            f"&base_currency={base}"
            f"&currencies={currency}"
        )

        response = requests.get(url)
        data = response.json()

        return jsonify(data)

    @app.route("/calculate")
    def calculate():
        base = request.args.get("base")
        currency = request.args.get("currency")
        amount = float(request.args.get("amount", 0))

        url = (
            f"https://api.freecurrencyapi.com/v1/latest"
            f"?apikey={API_KEY}"
            f"&base_currency={base}"
            f"&currencies={currency}"
        )

        response = requests.get(url)
        data = response.json()

        rate = list(data["data"].values())[0]

        return jsonify({
            "amount": amount,
            "result": amount * rate
        })

    @app.route("/admin/stats", methods=["GET"])
    def admin_stats():
        total_clients = Client.query.count()
        total_merchants = Merchant.query.count()
        total_transactions = Transaction.query.count()
        fraud_transactions = Transaction.query.filter_by(is_fraud=True).count()
        fraud_rate = round((fraud_transactions / total_transactions * 100), 2) if total_transactions > 0 else 0

        recent_transactions = Transaction.query.order_by(Transaction.transaction_time.desc()).limit(5).all()

        return jsonify({
            "total_clients": total_clients,
            "total_merchants": total_merchants,
            "total_transactions": total_transactions,
            "fraud_transactions": fraud_transactions,
            "fraud_rate": fraud_rate,
            "recent_transactions": [
                {
                    "id": t.transactions_id,
                    "amount": t.amount,
                    "date": t.transaction_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "is_fraud": t.is_fraud,
                    "fraud_probability": t.fraud_probability,
                }
                for t in recent_transactions
            ],
        }), 200

    @app.route("/admin/users", methods=["GET"])
    def admin_users():
        users = User.query.all()
        result = []
        for u in users:
            profile = None
            if u.role == "Client":
                c = Client.query.filter_by(user_id=u.id).first()
                if c:
                    profile = {
                        "first_name": c.first_name,
                        "last_name": c.last_name,
                        "city": c.city,
                        "age": c.age,
                        "gender": c.gender,
                        "client_code": c.client_code,
                    }
            elif u.role == "Merchant":
                m = Merchant.query.filter_by(user_id=u.id).first()
                if m:
                    profile = {
                        "merchant_name": m.merchant_name,
                        "merchant_code": m.merchant_code,
                        "category": m.category,
                        "city": m.city,
                    }
            result.append({
                "id": u.id,
                "email": u.email,
                "role": u.role,
                "created_at": u.created_at.strftime("%Y-%m-%d") if u.created_at else None,
                "profile": profile,
            })
        return jsonify(result), 200

    @app.route("/admin/alerts", methods=["GET"])
    def admin_alerts():
        frauds = Transaction.query.filter_by(is_fraud=True).order_by(Transaction.transaction_time.desc()).limit(50).all()
        result = []
        for t in frauds:
            client = Client.query.get(t.client_id)
            merchant = Merchant.query.get(t.merchant_id)
            client_name = f"{client.first_name} {client.last_name}" if client else "Inconnu"
            merchant_name = merchant.merchant_name if merchant else "Inconnu"
            result.append({
                "id": t.transactions_id,
                "client_name": client_name,
                "merchant_name": merchant_name,
                "amount": t.amount,
                "date": t.transaction_time.strftime("%Y-%m-%d %H:%M:%S"),
                "fraud_probability": t.fraud_probability,
                "distance_km": t.distance_km,
            })
        return jsonify(result), 200

    @app.route("/admin/charts", methods=["GET"])
    def admin_charts():
        now = datetime.utcnow()
        activity = []
        for i in range(6, -1, -1):
            day = now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i)
            next_day = day + timedelta(days=1)
            txns = Transaction.query.filter(
                Transaction.transaction_time >= day,
                Transaction.transaction_time < next_day
            ).all()
            total = len(txns)
            frauds = sum(1 for t in txns if t.is_fraud)
            activity.append({
                "day": day.strftime("%d %b"),
                "analyses": total,
                "fraudes": frauds,
            })

        all_txns = Transaction.query.all()
        total = len(all_txns)
        frauds = sum(1 for t in all_txns if t.is_fraud)
        risk_data = [
            {"name": "Risque élevé", "value": round(frauds / total * 100, 1) if total else 0, "count": frauds, "color": "#FF4D4F"},
            {"name": "Risque moyen", "value": round((frauds + 5) / total * 100, 1) if total else 0, "count": frauds + 5, "color": "#F5A623"},
            {"name": "Risque faible", "value": round((total - frauds - 5) / total * 100, 1) if total else 0, "count": total - frauds - 5, "color": "#22C55E"},
        ]

        return jsonify({"activity": activity, "risk_data": risk_data}), 200

    @app.route("/admin/documents", methods=["GET"])
    def admin_documents():
        docs = []
        clients = Client.query.all()
        for c in clients:
            txns = Transaction.query.filter_by(client_id=c.client_id).order_by(Transaction.transaction_time.desc()).limit(2).all()
            for t in txns:
                docs.append({
                    "id": f"DOC-{t.transactions_id:04d}-{c.client_id:04d}",
                    "user": f"{c.first_name} {c.last_name}",
                    "type": "Transaction" if not t.is_fraud else "Alerte fraude",
                    "date": t.transaction_time.strftime("%d/%m/%Y"),
                })
        uploaded = AdminDocument.query.order_by(AdminDocument.uploaded_at.desc()).all()
        for d in uploaded:
            u = User.query.get(d.user_id)
            uname = u.email.split("@")[0] if u else "Inconnu"
            ext = d.filename.split(".")[-1] if "." in d.filename else d.filetype
            docs.append({
                "id": f"UPL-{d.doc_id:04d}",
                "user": uname,
                "type": ext.upper(),
                "date": d.uploaded_at.strftime("%d/%m/%Y"),
                "filename": d.filename,
            })
        return jsonify(docs), 200

    @app.route("/admin/analyses", methods=["GET"])
    def admin_analyses():
        txns = Transaction.query.order_by(Transaction.transaction_time.desc()).limit(50).all()
        result = []
        for t in txns:
            client = Client.query.get(t.client_id)
            merchant = Merchant.query.get(t.merchant_id)
            client_name = f"{client.first_name} {client.last_name}" if client else "Inconnu"
            prob = t.fraud_probability or 0
            risk = "Élevé" if prob >= 0.5 else ("Moyen" if prob >= 0.2 else "Faible")
            score = f"{round(prob * 100)}%"
            status = "Terminée" if t.is_fraud is not None else "En cours"
            result.append({
                "id": f"AN-{t.transactions_id:04d}",
                "user": client_name,
                "document": merchant.merchant_name if merchant else "Transaction",
                "risk": risk,
                "score": score,
                "date": t.transaction_time.strftime("%d/%m/%Y"),
                "status": status,
            })
        return jsonify(result), 200

    @app.route("/admin/users", methods=["POST"])
    def admin_create_user():
        data = request.get_json()
        role = data.get("role")
        email = data.get("email")
        password = data.get("password", "123456")
        city = data.get("city")
        if not email or not role:
            return jsonify({"error": "email and role required"}), 400
        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({"error": "Email already exists"}), 400
        lat, lon = None, None
        if city:
            coords = get_coordinates(city)
            if coords:
                lat, lon = coords
        hashed = bcrypt.generate_password_hash(password).decode("utf-8")
        user = User(role=role, email=email, password_hash=hashed)
        db.session.add(user)
        db.session.flush()
        if role == "Client":
            firstname = data.get("firstname", "")
            lastname = data.get("lastname", "")
            age = data.get("age", 30)
            gender = data.get("gender", "M")
            c = Client(
                user_id=user.id, first_name=firstname, last_name=lastname,
                city=city or "Paris", latitude=lat or 48.8566, longitude=lon or 2.3522,
                age=age, gender=gender, client_code=generate_client_code()
            )
            db.session.add(c)
        elif role == "Merchant":
            merchant_name = data.get("merchant_name", "")
            category = data.get("category", "shopping_net")
            m = Merchant(
                user_id=user.id, merchant_name=merchant_name, category=category,
                city=city or "Paris", latitude=lat or 48.8566, longitude=lon or 2.3522,
                merchant_code=generate_merchant_code()
            )
            db.session.add(m)
        else:
            return jsonify({"error": "Invalid role"}), 400
        db.session.commit()
        return jsonify({"message": "User created", "id": user.id}), 201

    @app.route("/admin/users/<int:user_id>", methods=["PUT"])
    def admin_update_user(user_id):
        data = request.get_json()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        if "email" in data and data["email"] != user.email:
            existing = User.query.filter_by(email=data["email"]).first()
            if existing:
                return jsonify({"error": "Email already exists"}), 400
            user.email = data["email"]
        city = data.get("city")
        lat, lon = None, None
        if city:
            coords = get_coordinates(city)
            if coords:
                lat, lon = coords
        if user.role == "Client":
            c = Client.query.filter_by(user_id=user.id).first()
            if c:
                if "firstname" in data:
                    c.first_name = data["firstname"]
                if "lastname" in data:
                    c.last_name = data["lastname"]
                if "age" in data:
                    c.age = data["age"]
                if "gender" in data:
                    c.gender = data["gender"]
                if city:
                    c.city = city
                    c.latitude = lat
                    c.longitude = lon
        elif user.role == "Merchant":
            m = Merchant.query.filter_by(user_id=user.id).first()
            if m:
                if "merchant_name" in data:
                    m.merchant_name = data["merchant_name"]
                if "category" in data:
                    m.category = data["category"]
                if city:
                    m.city = city
                    m.latitude = lat
                    m.longitude = lon
        db.session.commit()
        return jsonify({"message": "User updated"}), 200

    @app.route("/admin/reports", methods=["GET"])
    def admin_reports():
        period = request.args.get("period", "30d")
        now = datetime.utcnow()
        if period == "7d":
            start = now - timedelta(days=7)
        elif period == "90d":
            start = now - timedelta(days=90)
        else:
            start = now - timedelta(days=30)
        txns = Transaction.query.filter(Transaction.transaction_time >= start).all()
        total = len(txns)
        frauds = sum(1 for t in txns if t.is_fraud)
        safe = total - frauds
        total_amount = round(sum(t.amount for t in txns), 2)
        fraud_amount = round(sum(t.amount for t in txns if t.is_fraud), 2)
        avg_amount = round(total_amount / total, 2) if total else 0
        merchants = {}
        clients = {}
        for t in txns:
            m = Merchant.query.get(t.merchant_id)
            mn = m.merchant_name if m else "Unknown"
            merchants[mn] = merchants.get(mn, 0) + 1
            c = Client.query.get(t.client_id)
            cn = f"{c.first_name} {c.last_name}" if c else "Unknown"
            clients[cn] = clients.get(cn, 0) + 1
        top_merchants = sorted(merchants.items(), key=lambda x: -x[1])[:5]
        top_clients = sorted(clients.items(), key=lambda x: -x[1])[:5]
        daily = db.session.execute(
            text("""
                SELECT DATE(transaction_time) as day, COUNT(*) as total,
                       SUM(CASE WHEN is_fraud = 1 THEN 1 ELSE 0 END) as frauds
                FROM transactions
                WHERE transaction_time >= :start
                GROUP BY DATE(transaction_time)
                ORDER BY day
            """),
            {"start": start}
        ).fetchall()
        daily_data = [{"day": str(r[0]), "total": r[1], "frauds": r[2]} for r in daily]
        return jsonify({
            "period": period,
            "total_transactions": total,
            "fraud_transactions": frauds,
            "safe_transactions": safe,
            "total_amount": total_amount,
            "fraud_amount": fraud_amount,
            "avg_amount": avg_amount,
            "fraud_rate": round(frauds / total * 100, 2) if total else 0,
            "top_merchants": [{"name": n, "count": c} for n, c in top_merchants],
            "top_clients": [{"name": n, "count": c} for n, c in top_clients],
            "daily": daily_data,
        }), 200

    @app.route("/admin/alerts/<int:alert_id>/resolve", methods=["POST"])
    def admin_resolve_alert(alert_id):
        txn = Transaction.query.get(alert_id)
        if not txn:
            return jsonify({"error": "Transaction not found"}), 404
        txn.is_fraud = False
        db.session.commit()
        socketio.emit("alert_resolved", {"id": alert_id})
        return jsonify({"message": "Alert resolved"}), 200

    @app.route("/admin/documents", methods=["POST"])
    def admin_upload_document():
        user_id = request.form.get("user_id", type=int)
        if not user_id:
            user_id = 1
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        file = request.files["file"]
        file.seek(0, 2)
        fsize = file.tell()
        file.seek(0)
        upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        ext = os.path.splitext(file.filename or "file")[1] or ""
        safe_name = f"{uuid4().hex}{ext}"
        save_path = os.path.join(upload_dir, safe_name)
        file.save(save_path)
        doc = AdminDocument(
            user_id=user_id,
            filename=file.filename or "unnamed",
            filepath=safe_name,
            filetype=file.content_type or "application/octet-stream",
            filesize=fsize,
        )
        db.session.add(doc)
        db.session.commit()
        return jsonify({"message": "Document uploaded", "id": doc.doc_id}), 201

    @app.route("/admin/documents/<int:doc_id>/download", methods=["GET"])
    def admin_download_document(doc_id):
        doc = AdminDocument.query.get(doc_id)
        if not doc or not doc.filepath:
            return jsonify({"error": "Document not found"}), 404
        upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
        file_path = os.path.join(upload_dir, doc.filepath)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found on disk"}), 404
        return send_file(file_path, as_attachment=True, download_name=doc.filename, mimetype=doc.filetype)

    @app.route("/admin/documents/<int:doc_id>/view", methods=["GET"])
    def admin_view_document(doc_id):
        doc = AdminDocument.query.get(doc_id)
        if not doc or not doc.filepath:
            return jsonify({"error": "Document not found"}), 404
        upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
        file_path = os.path.join(upload_dir, doc.filepath)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found on disk"}), 404
        return send_file(file_path, mimetype=doc.filetype)

    @app.route("/admin/settings", methods=["GET"])
    def admin_get_settings():
        return jsonify({
            "two_factor": True,
            "email_notifications": True,
            "push_notifications": False,
        }), 200

    @app.route("/admin/settings", methods=["PUT"])
    def admin_update_settings():
        data = request.get_json()
        return jsonify({"message": "Settings updated", **data}), 200

    @app.route("/admin/profile", methods=["PUT"])
    def admin_update_profile():
        data = request.get_json()
        return jsonify({"message": "Profile updated", "data": data}), 200

    @app.route("/admin/change-password", methods=["POST"])
    def admin_change_password():
        data = request.get_json()
        return jsonify({"message": "Password changed"}), 200

    @app.route("/upload", methods=["POST"])
    def upload():

        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        reader = easyocr.Reader(['fr', 'en'])
        file = request.files["image"]

        # convert image to OpenCV format
        image_bytes = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)

        # OCR
        results = reader.readtext(img)

        extracted_text = []

        for result in results:
            text = result[1]
            score = result[2]

            if score > 0.3:
                extracted_text.append(text)

        full_text = " ".join(extracted_text)

        # Example extraction
        cin_number = None

        match = re.search(r'[A-Z]{1,2}[0-9]{4,8}', full_text)

        if match:
            cin_number = match.group()

        return jsonify({
            "text_detected": extracted_text,
            "full_text": full_text,
            "cin_number": cin_number
        })
         


