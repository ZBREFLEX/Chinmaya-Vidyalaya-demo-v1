import campus from "../../assets/images/hero/campus.jpeg";
import "./Hero.css";
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div
        className="hero__visual"
        role="img"
        aria-label="Chinmaya Vidyalaya campus buildings and tree-lined courtyard"
      >
        <svg
          className="hero__campus-desktop"
          viewBox="0 0 1536 630"
          preserveAspectRatio="xMaxYMid slice"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="campus-curve">
              <path d="M600 0 C530 95 511 178 570 290 C620 390 729 469 623 630 C830 642 991 540 1150 548 C1300 540 1410 585 1536 630 L1536 0Z" />
            </clipPath>
          </defs>
          <image
            href={campus}
            x="530"
            y="0"
            width="1006"
            height="630"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#campus-curve)"
          />
        </svg>
        <svg
          className="hero__campus-mobile"
          viewBox="0 0 1280 963"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <image href={campus} width="1280" height="963" />
        </svg>
      </div>
      <div className="hero__copy">
        <p className="eyebrow">
          Values &nbsp;|&nbsp; Learning &nbsp;|&nbsp; Brighter tomorrows
        </p>
        <h1 id="hero-title">
          A brighter
          <br />
          <span>beginning</span>
          <br />
          for every child.
        </h1>
        <p className="hero__description">
          At Chinmaya Vidyalaya, Kolazhy, we nurture young minds through
          value-based and holistic education, inspiring intellectual growth,
          compassion and a strong sense of Indian culture.
        </p>
        <div className="hero__actions">
          <a
            className="button button--primary"
            href="mailto:chinvidhya@gmail.com?subject=Admission%20enquiry"
          >
            Enquire Now <span aria-hidden="true">⟶</span>
          </a>
          <button
            className="button button--outline"
            type="button"
            onClick={() => {
              window.location.href =
                "mailto:chinvidhya@gmail.com?subject=Campus%20tour%20enquiry";
            }}
          >
            Take a Campus Tour{" "}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m10 8 6 4-6 4Z" />
            </svg>
          </button>
        </div>
        <p className="hero__welcome">
          Rooted in values.
          <br />
          <strong>Growing towards brighter tomorrows.</strong>
        </p>
      </div>
    </section>
  );
}
