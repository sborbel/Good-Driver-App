# services/server/project/api/events/admin.py


from flask import current_app

from project import bcrypt
from flask_admin.contrib.sqla import ModelView


class EventsAdminView(ModelView):
    column_searchable_list = (
        "description",
        "points",
    )
    column_editable_list = (
        "description",
        "points",
        "created_date",
    )
    column_filters = (
        "description",
        "points",
    )
    column_sortable_list = (
        "description",
        "points",
        "created_date",
    )
    column_default_sort = ("created_date", True)

    # def on_model_change(self, form, model, is_created):
    #     model.password = bcrypt.generate_password_hash(
    #         model.password, current_app.config.get("BCRYPT_LOG_ROUNDS")
    #     ).decode()
