from app import create_app, socketio

if __name__=="__main__":
    app = create_app()
    socketio.run(app, debug=True, use_reloader=False, allow_unsafe_werkzeug=True)
