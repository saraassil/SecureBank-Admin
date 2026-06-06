from app import db
from datetime import datetime
from flask_login import UserMixin



class User(db.Model,UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)

    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), nullable=False)
    # "client", "merchant", "admin"

    created_at = db.Column(db.DateTime, default=datetime.utcnow)



class Client(db.Model, UserMixin):
    __tablename__ = "clients"

    client_id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    client_code = db.Column(db.String(20), unique=True)
    
    city = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    age=db.Column(db.Integer)
    gender = db.Column(db.String(255), nullable=False)
    
    inscription_date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("client_profile", uselist=False))
    transactions = db.relationship("Transaction", backref="client", lazy=True)

    def get_id(self):
        return str(self.client_id)
    
    


class Merchant(db.Model, UserMixin):
    __tablename__ = "merchants"

    merchant_id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)

    merchant_name = db.Column(db.String(150), nullable=False)
    merchant_code = db.Column(db.String(20), unique=True)
    
    category = db.Column(db.String(100))
    city = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship("User", backref=db.backref("merchant_profile", uselist=False))
    transactions = db.relationship("Transaction", backref="merchant", lazy=True)

    def get_id(self):
        return str(self.merchant_id)
    


class AdminDocument(db.Model):
    __tablename__ = "admin_documents"

    doc_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(512), nullable=True)
    filetype = db.Column(db.String(255), default="other")
    filesize = db.Column(db.Integer, default=0)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("documents", lazy=True))


class Transaction(db.Model):
    __tablename__ = "transactions"

    transactions_id = db.Column(db.Integer, primary_key=True,autoincrement=True)


    client_id = db.Column(
        db.Integer,
        db.ForeignKey("clients.client_id"),
        nullable=False
    )

    merchant_id = db.Column(
        db.Integer,
        db.ForeignKey("merchants.merchant_id"),
        nullable=False
    )

    amount = db.Column(db.Float, nullable=False)

    transaction_time = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    distance_km = db.Column(db.Float)

    fraud_probability = db.Column(db.Float)

    is_fraud = db.Column(db.Boolean, default=False)



  


