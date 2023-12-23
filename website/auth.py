from flask import Blueprint, render_template, request , url_for , redirect
from . import error_response , success_response
from .models import User
from werkzeug.security import generate_password_hash , check_password_hash
from . import db
from flask_login import login_user , login_required , logout_user , current_user


auth = Blueprint('auth', __name__)

@auth.route("/login", methods=["POST", "GET"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        user = User.query.filter_by(email=email).first()
        if not user:
            return error_response("User does not exist")
        if not check_password_hash(user.password, password):
            return error_response("Incorrect username or password")
        login_user(user, remember=True)
        return success_response({"msg": "Logged in Successfully!", "redirect": url_for('views.home')})
    
    return render_template("login.html", user=current_user)


@auth.route("/sign-up", methods=["POST", "GET"])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    if request.method == "GET":
        return render_template("signup.html", user=current_user)
    elif request.method == "POST":
        form = request.form
        first_name = form.get("first-name")
        last_name = form.get("last-name")
        user_name = form.get("user-name")
        email = form.get("email")
        password = form.get("password")
        password2 = form.get("password2")
        user = User.query.filter_by(email=email).first()
        if user:
            return error_response("User already exist")
        if not first_name or first_name == "":
            return error_response("First name must not be empty")
        if not last_name or last_name == "":
            return error_response("Last name must not be empty")
        if not user_name or len(user_name) < 8:
            return error_response("User name must have at least 8 characters")
        if not email or email == "":
            return error_response("Email must not be empty")
        from . import check_email
        if not check_email(email):
            return error_response("Email is not valid")
        if not password or password == "":
            return error_response("Password can not be empty")
        if not password2 or password2 == "":
            return error_response("Please confirm password")
        if password2 != password:
            return error_response("Password do not match")
        new_user = User(email=email, first_name=first_name, 
                        last_name=last_name, user_name=user_name, 
                        password=generate_password_hash(password, method='sha256'))
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)
    return success_response({"msg": "User created successfull!", "redirect": url_for('views.home')})
        
        

@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home'))

