"""Seed the database with realistic demo data.

Run it locally:      flask --app run.py seed-data
Run it on Render:    add SEED_PASSWORD as an env var, then use the shell:
                     flask --app run.py seed-data

Every account created here uses the same password so the demo is easy to
drive. Override it with --password or the SEED_PASSWORD environment variable.
Running it twice is safe: existing rows are skipped, not duplicated.
"""

import os
from datetime import date, timedelta

import click
from flask.cli import with_appcontext

from app.extensions import db
from app.models.user import User
from app.models.student_profile import StudentProfile, EducationEntry
from app.models.employer_profile import EmployerProfile
from app.models.opportunity import Opportunity
from app.models.application import Application
from app.models.mentorship_resource import MentorshipResource
from app.models.report import Report

DEFAULT_PASSWORD = "Career2026"

ADMIN = {
    "full_name": "Shakilla Uwamahoro",
    "email": "admin@careerbridge.africa",
}

EMPLOYERS = [
    {
        "full_name": "Aline Mukamana",
        "email": "hr@rwandawomenintech.org",
        "company_name": "Rwanda Women in Tech Network",
        "industry": "Technology and Advocacy",
        "location": "Kigali, Rwanda",
        "about": (
            "A community driven organisation supporting women and young graduates "
            "building careers in technology across Rwanda through training, "
            "mentorship and job placement."
        ),
    },
    {
        "full_name": "Eric Habimana",
        "email": "careers@ictyouthhub.rw",
        "company_name": "ICT Youth Innovation Hub",
        "industry": "Technology and Innovation",
        "location": "Kigali, Rwanda",
        "about": (
            "A hub connecting young Rwandan innovators with real projects, "
            "internships and industry mentors to help them launch careers in "
            "software and digital services."
        ),
    },
    {
        "full_name": "Claudine Uwase",
        "email": "recruitment@kigaliagritech.rw",
        "company_name": "Kigali AgriTech Solutions",
        "industry": "Agriculture Technology",
        "location": "Musanze, Rwanda",
        "about": (
            "We build digital tools that help cooperatives across the Northern "
            "Province track harvests, manage payments and reach buyers."
        ),
    },
]

OPPORTUNITIES = [
    {
        "company": "Rwanda Women in Tech Network",
        "title": "Junior Backend Developer",
        "description": (
            "Join our engineering team to build and maintain REST APIs used by "
            "thousands of users across East Africa. You will work closely with "
            "senior engineers on real production systems, take part in code "
            "reviews, and help improve our deployment process."
        ),
        "location": "Kigali, Rwanda",
        "employment_type": "full_time",
        "category": "Software Engineering",
        "salary_min": 400,
        "salary_max": 700,
        "required_skills": "Python, Flask, SQL, Git",
        "deadline_in_days": 30,
    },
    {
        "company": "Rwanda Women in Tech Network",
        "title": "Frontend Developer Intern",
        "description": (
            "A three month internship for a student who wants hands on experience "
            "building real interfaces with React. You will pair with our frontend "
            "lead on live features and ship your work to production."
        ),
        "location": "Remote",
        "employment_type": "internship",
        "category": "Software Engineering",
        "salary_min": 100,
        "salary_max": 200,
        "required_skills": "React, JavaScript, CSS",
        "deadline_in_days": 21,
    },
    {
        "company": "ICT Youth Innovation Hub",
        "title": "Social Media Coordinator",
        "description": (
            "Manage content calendars and grow engagement for a portfolio of "
            "African brand clients. A good fit for someone early in their "
            "marketing career who is comfortable with both data and creativity."
        ),
        "location": "Kigali, Rwanda",
        "employment_type": "full_time",
        "category": "Marketing",
        "salary_min": 250,
        "salary_max": 400,
        "required_skills": "Content creation, Analytics, Communication",
        "deadline_in_days": 14,
    },
    {
        "company": "ICT Youth Innovation Hub",
        "title": "Graphic Design Intern",
        "description": (
            "Support our design team on client projects ranging from social "
            "campaigns to brand identity work. Your portfolio matters more to us "
            "than years of experience."
        ),
        "location": "Kigali, Rwanda",
        "employment_type": "internship",
        "category": "Design",
        "salary_min": 80,
        "salary_max": 150,
        "required_skills": "Adobe Illustrator, Photoshop, Figma",
        "deadline_in_days": 25,
    },
    {
        "company": "Kigali AgriTech Solutions",
        "title": "Data Analyst",
        "description": (
            "Turn harvest and payment records from cooperatives into dashboards "
            "that managers actually use. You will clean messy field data, build "
            "reports and present findings to non technical colleagues."
        ),
        "location": "Musanze, Rwanda",
        "employment_type": "full_time",
        "category": "Data and Analytics",
        "salary_min": 350,
        "salary_max": 600,
        "required_skills": "Excel, SQL, Power BI, Statistics",
        "deadline_in_days": 40,
    },
    {
        "company": "Kigali AgriTech Solutions",
        "title": "Field Support Officer",
        "description": (
            "Travel to partner cooperatives, train members on our mobile app and "
            "collect feedback for the product team. Kinyarwanda and English are "
            "both required for this role."
        ),
        "location": "Northern Province, Rwanda",
        "employment_type": "part_time",
        "category": "Operations",
        "salary_min": 200,
        "salary_max": 320,
        "required_skills": "Kinyarwanda, English, Training, Customer support",
        "deadline_in_days": 18,
    },
]

STUDENTS = [
    {
        "full_name": "Jean Baptiste Niyonzima",
        "email": "jean.niyonzima@student.alu.edu",
        "skills": "Python, Flask, MySQL, Git",
        "career_interests": "Backend development, cloud infrastructure",
        "education": {
            "institution": "African Leadership University",
            "field_of_study": "Software Engineering",
            "start_year": 2023,
            "end_year": 2026,
        },
        "applies_to": ["Junior Backend Developer", "Data Analyst"],
    },
    {
        "full_name": "Divine Ingabire",
        "email": "divine.ingabire@student.alu.edu",
        "skills": "React, JavaScript, Figma, CSS",
        "career_interests": "Frontend development, product design",
        "education": {
            "institution": "University of Rwanda",
            "field_of_study": "Computer Science",
            "start_year": 2022,
            "end_year": 2026,
        },
        "applies_to": ["Frontend Developer Intern"],
    },
]

MENTORSHIP_RESOURCES = [
    {
        "title": "Building a Professional CV",
        "category": "Career Guide",
        "resource_type": "video",
        "link": "https://www.youtube.com/watch?v=R3abknwWX7k",
    },
    {
        "title": "Preparing for Job Interviews",
        "category": "Interview Tips",
        "resource_type": "video",
        "link": "https://www.youtube.com/watch?v=LCWr-TJrc0k",
    },
    {
        "title": "Career Growth Essentials",
        "category": "Professional Development",
        "resource_type": "article",
        "link": "https://www.peoplegoal.com/blog/career-development-essentials/",
    },
    {
        "title": "Writing a Cover Letter That Gets Read",
        "category": "Career Guide",
        "resource_type": "article",
        "link": "https://www.themuse.com/advice/how-to-write-a-cover-letter-31-tips-you-need-to-know",
    },
]

REPORTS = [
    {
        "category": "Job Posting",
        "reason": "The salary in the advert does not match what the employer said during the call.",
        "target_type": "opportunity",
    },
    {
        "category": "Employer Profile",
        "reason": "This company asked applicants to pay a registration fee before an interview.",
        "target_type": "employer",
    },
]


def get_or_create_user(full_name, email, role, password):
    user = User.query.filter_by(email=email).first()

    if user:
        return user, False

    user = User(full_name=full_name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    return user, True


@click.command("seed-data")
@click.option(
    "--password",
    default=None,
    help="Password for every seeded account. Defaults to SEED_PASSWORD or Career2026.",
)
@with_appcontext
def seed_data(password):
    password = password or os.environ.get("SEED_PASSWORD") or DEFAULT_PASSWORD

    db.create_all()

    # --- administrator -------------------------------------------------
    admin, created = get_or_create_user(
        ADMIN["full_name"], ADMIN["email"], "admin", password
    )
    click.echo(
        f"{'Created' if created else 'Found'} admin {ADMIN['email']}"
    )

    # --- employers -----------------------------------------------------
    profiles_by_company = {}

    for employer in EMPLOYERS:
        user, created = get_or_create_user(
            employer["full_name"], employer["email"], "employer", password
        )

        profile = user.employer_profile

        if not profile:
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

        profiles_by_company[employer["company_name"]] = profile
        click.echo(
            f"{'Created' if created else 'Found'} employer {employer['email']}"
        )

    # --- opportunities -------------------------------------------------
    opportunities_by_title = {}

    for item in OPPORTUNITIES:
        profile = profiles_by_company.get(item["company"])

        if not profile:
            continue

        existing = Opportunity.query.filter_by(
            employer_id=profile.id, title=item["title"]
        ).first()

        if existing:
            opportunities_by_title[item["title"]] = existing
            continue

        posting = Opportunity(
            employer_id=profile.id,
            title=item["title"],
            description=item["description"],
            location=item["location"],
            employment_type=item["employment_type"],
            category=item["category"],
            salary_min=item["salary_min"],
            salary_max=item["salary_max"],
            required_skills=item["required_skills"],
            deadline=date.today() + timedelta(days=item["deadline_in_days"]),
            status="open",
        )
        db.session.add(posting)
        db.session.flush()

        opportunities_by_title[item["title"]] = posting
        click.echo(f"Created opportunity: {item['title']}")

    # --- students ------------------------------------------------------
    for student in STUDENTS:
        user, created = get_or_create_user(
            student["full_name"], student["email"], "student", password
        )

        profile = user.student_profile

        if not profile:
            profile = StudentProfile(
                user_id=user.id,
                skills=student["skills"],
                career_interests=student["career_interests"],
            )
            db.session.add(profile)
            db.session.flush()

            education = student["education"]
            db.session.add(EducationEntry(
                student_profile_id=profile.id,
                institution=education["institution"],
                field_of_study=education["field_of_study"],
                start_year=education["start_year"],
                end_year=education["end_year"],
            ))

        click.echo(
            f"{'Created' if created else 'Found'} student {student['email']}"
        )

        for title in student["applies_to"]:
            posting = opportunities_by_title.get(title)

            if not posting:
                continue

            already_applied = Application.query.filter_by(
                student_id=profile.id, opportunity_id=posting.id
            ).first()

            if already_applied:
                continue

            db.session.add(Application(
                student_id=profile.id,
                opportunity_id=posting.id,
                cover_letter=(
                    f"I am very interested in the {title} role and believe my "
                    f"background in {student['skills'].split(',')[0].strip()} "
                    "makes me a strong fit."
                ),
                status="submitted",
            ))
            click.echo(f"  applied to {title}")

    # --- mentorship resources -----------------------------------------
    for resource in MENTORSHIP_RESOURCES:
        existing = MentorshipResource.query.filter_by(
            title=resource["title"]
        ).first()

        if existing:
            continue

        db.session.add(MentorshipResource(
            title=resource["title"],
            category=resource["category"],
            resource_type=resource["resource_type"],
            content=resource["link"],
            published_by=admin.id,
        ))
        click.echo(f"Created resource: {resource['title']}")

    # --- reported items ------------------------------------------------
    reporter = User.query.filter_by(role="student").first()

    if reporter:
        for index, report in enumerate(REPORTS):
            existing = Report.query.filter_by(reason=report["reason"]).first()

            if existing:
                continue

            db.session.add(Report(
                reporter_id=reporter.id,
                category=report["category"],
                reason=report["reason"],
                target_type=report["target_type"],
                target_id=index + 1,
                status="new",
            ))
            click.echo(f"Created report: {report['category']}")

    db.session.commit()

    click.echo("")
    click.echo("Seed data complete. Demo accounts:")
    click.echo(f"  admin     {ADMIN['email']}")
    for employer in EMPLOYERS:
        click.echo(f"  employer  {employer['email']}")
    for student in STUDENTS:
        click.echo(f"  student   {student['email']}")
    click.echo(f"  password  {password}")
