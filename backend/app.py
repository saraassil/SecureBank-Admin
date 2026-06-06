from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_mail import Mail

db = SQLAlchemy()
socketio = SocketIO()
mail = Mail()

def create_app():
    app=Flask(__name__)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user2:1234@localhost/flaskdb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "fdnbjdfnb"

    from config import MAIL_SERVER, MAIL_PORT, MAIL_USE_TLS, MAIL_USERNAME, MAIL_PASSWORD, MAIL_DEFAULT_SENDER
    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
    app.config['MAIL_DEFAULT_SENDER'] = MAIL_DEFAULT_SENDER

    db.init_app(app)
    socketio.init_app(app, cors_allowed_origins="http://localhost:5173")
    mail.init_app(app)

    login_manager=LoginManager()
    login_manager.init_app(app)

    from dbmodel import Client,User

    @login_manager.user_loader
    def load_user(id):
        id=User.query.get(int(id))
        return id

    bcrypt=Bcrypt(app)

    from routes import register_routes
    register_routes(app,db,bcrypt,socketio,mail)

    migrate=Migrate(app,db)

    return app
