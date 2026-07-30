import re


def validate_email(email):
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(pattern, email)


def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."

    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."

    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."

    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."

    return True, ""


def validate_full_name(full_name):
    full_name = full_name.strip()

    if len(full_name) < 3:
        return False

    if len(full_name) > 120:
        return False

    return True


def validate_company_name(company_name):
    company_name = company_name.strip()

    if len(company_name) < 2:
        return False

    if len(company_name) > 150:
        return False

    return True