import "./HowItWorks.css";
import { FiUserPlus, FiSearch, FiCheckCircle } from "react-icons/fi";

function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: <FiUserPlus />,
      title: "Create an Account",
      description:
        "Register as a student, graduate or employer to access the CareerBridge Africa platform.",
    },
    {
      id: 2,
      icon: <FiSearch />,
      title: "Explore Opportunities",
      description:
        "Browse verified jobs, internships and mentorship resources that match your interests.",
    },
    {
      id: 3,
      icon: <FiCheckCircle />,
      title: "Apply & Grow",
      description:
        "Submit applications, follow your progress and continue learning through career resources.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-it-works__container">

        <div className="how-it-works__header">
          <h2>How CareerBridge Africa Works</h2>

          <p>
            A simple process to help students, graduates and employers connect
            through one platform.
          </p>
        </div>

        <div className="how-it-works__cards">

          {steps.map((step) => (
            <div className="how-it-works__card" key={step.id}>

              <div className="how-it-works__icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;