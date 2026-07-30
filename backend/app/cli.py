import click
from flask.cli import with_appcontext
from app.extensions import db
from app.models.user import User


@click.command("create-admin")
@click.option("--full-name", prompt="Full name")
@click.option("--email", prompt="Email")
@click.option("--password", prompt="Password", hide_input=True, confirmation_prompt=True)
@with_appcontext
def create_admin(full_name, email, password):
    if User.query.filter_by(email=email).first():
        click.echo(f"An account with the email {email} already exists.")
        return

    admin = User(full_name=full_name, email=email, role="admin")
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()

    click.echo(f"Admin account created for {email}.")