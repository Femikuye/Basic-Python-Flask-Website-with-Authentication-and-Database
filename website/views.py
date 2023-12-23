from flask import Blueprint , render_template, request

from flask_login import login_required , current_user
from . import error_response , db , success_response
from .models import Note

views = Blueprint('views', __name__)


@views.route('/', methods=["GET", "POST"])
@login_required
def home():
    if request.method == "POST":
        note = request.form.get("note")
        if len(note) < 5:
            return error_response("Note must contain more than 4 characters")
        new_note = Note(user_id=current_user.id, data=note)
        db.session.add(new_note)
        db.session.commit()
        return success_response({"msg": "Note Added", "note": new_note.data})
    return render_template("home.html", user=current_user)

@views.route('/delete-note', methods=["POST"])
@login_required
def delete_note():
    note_id = request.form.get("note-id")
    note = Note.query.get(note_id)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
            return success_response({"msg": "Deleted"})
    return error_response("Error")
