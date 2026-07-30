import "./Contact.css";

function Contact() {
  return (
    <section className="contact">

      <div className="contact__hero">

        <h1>Contact Us</h1>

        <p>
          We'd love to hear from you. Whether you have questions, feedback, or
          partnership opportunities, our team is here to help.
        </p>

      </div>

      <div className="contact__container">

        <div className="contact__info">

          <h2>Get in Touch</h2>

          <div className="contact__item">
            <h3>Email</h3>
            <p>cyberhubtech@gmail.com</p>
          </div>

          <div className="contact__item">
            <h3>Phone</h3>
            <p>+250 787958849</p>
          </div>

          <div className="contact__item">
            <h3>Location</h3>
            <p>Kigali, Rwanda</p>
          </div>

          <div className="contact__item">
            <h3>Working Hours</h3>
            <p>Monday – Friday</p>
            <p>8:00 AM – 5:00 PM</p>
          </div>

        </div>

        <div className="contact__form">

          <h2>Send Us a Message</h2>

          <form>

            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              rows="6"
              placeholder="Write your message..."
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>

      <section className="contact__faq">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-grid">

          <div className="faq-card">
            <h3>How do I apply for opportunities?</h3>
            <p>
              Create an account, complete your profile, and apply directly
              through the platform.
            </p>
          </div>

          <div className="faq-card">
            <h3>How can employers post jobs?</h3>
            <p>
              Employers register, complete verification, and can then post job
              or internship opportunities.
            </p>
          </div>

          <div className="faq-card">
            <h3>Is CareerBridge Africa free?</h3>
            <p>
              Students and graduates can browse opportunities and mentorship
              resources at no cost.
            </p>
          </div>

        </div>

      </section>

    </section>
  );
}

export default Contact;