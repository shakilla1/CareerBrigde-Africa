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
    """Create an administrator account.

    Admins cannot sign themselves up through the website on purpose, so this
    command is the only way to create one.
    """
    email = email.strip().lower()

    if User.query.filter_by(email=email).first():
        click.echo(f"An account with the email {email} already exists.")
        click.echo("Use 'flask --app run.py reset-password' if you forgot its password.")
        return

    admin = User(full_name=full_name, email=email, role="admin")
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()

    click.echo(f"Admin account created for {email}.")


@click.command("list-users")
@click.option("--role", default=None, help="Filter by role: student, employer or admin.")
@with_appcontext
def list_users(role):
    """Show the accounts that exist in the database.

    Useful when you know you created an account but cannot remember the email.
    Passwords are hashed and cannot be displayed.
    """
    query = User.query

    if role:
        query = query.filter_by(role=role.strip().lower())

    users = query.order_by(User.role, User.id).all()

    if not users:
        click.echo("No accounts found.")
        return

    click.echo(f"{'ID':<5}{'ROLE':<12}{'STATUS':<12}{'EMAIL':<45}NAME")
    click.echo("-" * 100)

    for user in users:
        click.echo(
            f"{user.id:<5}{user.role:<12}{(user.status or 'active'):<12}"
            f"{user.email:<45}{user.full_name}"
        )

    click.echo(f"\n{len(users)} account(s).")


@click.command("reset-password")
@click.option("--email", prompt="Email of the account")
@click.option(
    "--password",
    prompt="New password",
    hide_input=True,
    confirmation_prompt=True,
)
@with_appcontext
def reset_password(email, password):
    """Set a new password for an existing account.

    There is no email based password reset yet, so this is how you recover an
    account whose password has been forgotten.
    """
    email = email.strip().lower()

    user = User.query.filter_by(email=email).first()

    if not user:
        click.echo(f"No account found with the email {email}.")
        click.echo("Run 'flask --app run.py list-users' to see what exists.")
        return

    if len(password) < 8:
        click.echo("Password must be at least 8 characters long.")
        return

    user.set_password(password)
    db.session.commit()

    click.echo(f"Password updated for {email} ({user.role}).")


@click.command("promote-to-admin")
@click.option("--email", prompt="Email of the account to promote")
@with_appcontext
def promote_to_admin(email):
    """Turn an existing account into an administrator."""
    email = email.strip().lower()

    user = User.query.filter_by(email=email).first()

    if not user:
        click.echo(f"No account found with the email {email}.")
        return

    if user.role == "admin":
        click.echo(f"{email} is already an administrator.")
        return

    user.role = "admin"
    db.session.commit()

    click.echo(f"{email} is now an administrator.")
