import click
from flask.cli import with_appcontext
from app.extensions import db
from app.models.user import User
from app.models.employer_profile import EmployerProfile
from app.models.opportunity import Opportunity

EMPLOYERS = [
    {
        "full_name": "Rwanda Women in Tech Network",
        "email": "hr@rwandawomenintech.org",
        "company_name": "Rwanda Women in Tech Network",
        "industry": "Technology & Advocacy",
        "location": "Kigali, Rwanda",
        "about": "A community driven organization supporting women and young graduates building careers in technology across Rwanda through training, mentorship, and job placement.",
    },
    {
        "full_name": "ICT Youth Innovation Hub",
        "email": "careers@ictyouthhub.rw",
        "company_name": "ICT Youth Innovation Hub",
        "industry": "Technology & Innovation",
        "location": "Kigali, Rwanda",
        "about": "A hub connecting young Rwandan innovators with real projects, internships, and industry mentors to help them launch careers in software and digital services.",
    },
]

OPPORTUNITIES = [
    {
        "company": "Rwanda Women in Tech Network",
        "title": "Junior Backend Developer",
        "description": "Join our engineering team to build and maintain REST APIs used by thousands of users across East Africa. You will work closely with senior engineers on real production systems.",
        "location": "Kigali, Rwanda",
        "employment_type": "full_time",
        "salary_min": 400,
        "salary_max": 700,
        "required_skills": "Python, Flask, SQL",
    },
    {
        "company": "Rwanda Women in Tech Network",
        "title": "Frontend Developer Intern",
        "description": "A three month internship for a student who wants hands on experience building real interfaces with React. You will pair with our frontend lead on live features.",
        "location": "Remote",
        "employment_type": "internship",
        "salary_min": 100,
        "salary_max": 200,
        "required_skills": "React, JavaScript, CSS",
    },
    {
        "company": "ICT Youth Innovation Hub",
        "title": "Social Media Coordinator",
        "description": "Manage content calendars and grow engagement for a portfolio of African brand clients. Great fit for someone early in their marketing career who is comfortable with data and creativity.",
        "location": "Kigali, Rwanda",
        "employment_type": "full_time",
        "salary_min": 250,
        "salary_max": 400,
        "required_skills": "Content creation, Analytics, Communication",
    },
    {
        "company": "ICT Youth Innovation Hub",
        "title": "Graphic Design Intern",
        "description": "Support our design team on client projects ranging from social campaigns to brand identity work. Portfolio matters more than years of experience here.",
        "location": "Kigali, Rwanda",
        "employment_type": "internship",
        "salary_min": 80,
        "salary_max": 150,
        "required_skills": "Adobe Illustrator, Photoshop, Figma",
    },
]


@click.command("seed-data")
@click.option("--password", prompt="Password for seeded employer accounts", hide_input=True)
@with_appcontext
def seed_data(password):
    company_to_profile = {}

    for employer in EMPLOYERS:
        existing = User.query.filter_by(email=employer["email"]).first()

        if existing:
            click.echo(f"{employer['email']} already exists, skipping.")
            company_to_profile[employer["company_name"]] = existing.employer_profile
            continue

        user = User(full_name=employer["full_name"], email=employer["email"], role="employer")
        user.set_password(password)
        db.session.add(user)
        db.session.flush()

        profile = EmployerProfile(
            user_id=user.id,
            company_name=employer["company_name"],
            industry=employer["industry"],
            location=employer["location"],
            about=employer["about"],
            verification_status="approved",
        )
        db.session.add(profile)
        db.session.flush()

        company_to_profile[employer["company_name"]] = profile
        click.echo(f"Created employer {employer['email']}")

    for opportunity in OPPORTUNITIES:
        profile = company_to_profile.get(opportunity["company"])

        if not profile:
            continue

        existing = Opportunity.query.filter_by(
            employer_id=profile.id, title=opportunity["title"]
        ).first()

        if existing:
            continue

        posting = Opportunity(
            employer_id=profile.id,
            title=opportunity["title"],
            description=opportunity["description"],
            location=opportunity["location"],
            employment_type=opportunity["employment_type"],
            salary_min=opportunity["salary_min"],
            salary_max=opportunity["salary_max"],
            required_skills=opportunity["required_skills"],
        )
        db.session.add(posting)
        click.echo(f"Created opportunity: {opportunity['title']}")

    db.session.commit()
    click.echo("Seed data complete.")