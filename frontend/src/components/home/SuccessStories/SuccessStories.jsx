import "./SuccessStories.css";
import successStories from "../../../data/successStories";

function SuccessStories() {
  return (
    <section className="success-stories">
      <div className="success-stories__container">

        <div className="success-stories__header">
          <h2>Success Stories</h2>

          <p>
            Discover how CareerBridge Africa is helping students and graduates
            take the next step in their careers.
          </p>
        </div>

        <div className="success-stories__grid">
          {successStories.map((story) => (
            <div
              key={story.id}
              className="success-stories__card"
            >
              <p className="success-stories__message">
                "{story.message}"
              </p>

              <h3>{story.name}</h3>

              <span>{story.role}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default SuccessStories;