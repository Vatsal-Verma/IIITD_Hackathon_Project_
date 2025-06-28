import React from "react";

const Features = () => {
  const timelineData = [
  {
    title: "Awareness",
    text: "We provide health tips, symptom guides, and preventive care info to raise early awareness and promote healthier choices.",
  },
  {
    title: "Assistant",
    text: "Our AI assistant supports users with symptom checks, medication reminders, and appointment scheduling — anytime, anywhere.",
  },
  {
    title: "Analysis",
    text: "We analyze symptoms, history, and reports to detect patterns and deliver insights that aid faster diagnosis.",
  },
  {
    title: "Recommendation",
    text: "Based on analysis, we suggest lifestyle tips, tests, or specialists to guide users on the next best step.",
  },
  {
    title: "Simulation",
    text: "Users can explore potential health outcomes and treatment impacts through interactive simulations and visualizations.",
  },
];


  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");

        :root {
          --white: #fff;
          --black: #323135;
          --crystal: #a8dadd;
          --columbia-blue: #f0f0f0; /* CHANGED to gray background */
          --midnight-green: #01565b;
          --yellow: #e5f33d;
          --timeline-gradient: rgba(240, 240, 240, 1) 0%, rgba(240, 240, 240, 1) 50%, rgba(240, 240, 240, 0) 100%;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font: normal 16px/1.5 "Inter", sans-serif;
          background: var(--columbia-blue);
          color: var(--black);
          margin-bottom: 50px;
        }

        .section {
          padding: 50px 0;
        }

        .container {
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .section h1 {
          font-size: 2.5rem;
        }

        .section h2 {
          font-size: 1.3rem;
        }

        .timeline {
          position: relative;
          white-space: nowrap;
          max-width: 1400px;
          padding: 0 10px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px auto;
          grid-gap: 20px;
        }

        .timeline::before,
        .timeline::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 30px;
          width: 100px;
          z-index: 2;
        }

        .timeline::after {
          right: 0;
          background: linear-gradient(270deg, var(--timeline-gradient));
        }

        .timeline::before {
          left: 340px;
          background: linear-gradient(90deg, var(--timeline-gradient));
        }

        .timeline .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 40px;
          color: var(--white);
          background: var(--midnight-green);
          white-space: normal;
          border-radius: 10px;
        }

        .timeline .info img {
          margin-bottom: 20px;
        }

        .timeline .info p {
          margin-top: 10px;
          color: var(--crystal);
        }

        .timeline .info a {
          text-decoration: none;
        }

        .timeline ol {
          font-size: 0;
          padding: 250px 0;
          transition: all 1s;
          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          scrollbar-color: var(--yellow) var(--midnight-green);
        }

        .timeline ol::-webkit-scrollbar {
          height: 12px;
        }

        .timeline ol::-webkit-scrollbar-thumb {
          background: var(--midnight-green);
          border-radius: 92px;
        }

        .timeline ol::-webkit-scrollbar-track {
          background: var(--yellow);
          border-radius: 92px;
        }

        .timeline ol li {
          position: relative;
          display: inline-block;
          list-style-type: none;
          width: 160px;
          height: 5px;
          background: var(--white);
          scroll-snap-align: start;
        }

        .timeline ol li:last-child {
          width: 340px;
        }

        .timeline ol li:not(:first-child) {
          margin-left: 14px;
        }

        .timeline ol li:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 50%;
          left: calc(100% + 1px);
          width: 16px;
          height: 16px;
          transform: translateY(-50%);
          border-radius: 50%;
          background: var(--midnight-green);
          z-index: 1;
        }

        .timeline ol li div {
          position: absolute;
          left: calc(100% + 7px);
          width: 280px;
          padding: 15px;
          font-size: 1rem;
          color: var(--black);
          background: var(--white);
          border-radius: 0 10px 10px 10px;
          word-wrap: break-word;
          white-space: normal;
        }

        .timeline ol li:nth-child(odd) div {
          top: -16px;
          transform: translateY(-100%);
          border-radius: 10px 10px 10px 0;
        }

        .timeline ol li:nth-child(odd) div::before {
          content: "";
          position: absolute;
          top: 100%;
          border-width: 8px 8px 0 0;
          border-style: solid;
          border-color: var(--white) transparent transparent transparent;
        }

        .timeline ol li:nth-child(even) div {
          top: calc(100% + 16px);
        }

        .timeline ol li:nth-child(even) div::before {
          content: "";
          position: absolute;
          top: -8px;
          border-width: 8px 0 0 8px;
          border-style: solid;
          border-color: transparent transparent transparent var(--white);
        }

        time {
          display: block;
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 8px;
          color: var(--midnight-green);
        }

        @media screen and (max-width: 800px) {
          .timeline {
            display: block;
          }
          .timeline::before,
          .timeline::after {
            width: 50px;
          }
          .timeline::before {
            left: 0;
          }
          .timeline .info {
            display: none;
          }
        }

        .page-footer {
          position: fixed;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          padding: 5px;
          z-index: 2;
          color: var(--black);
          background: var(--columbia-blue);
        }

        .page-footer a {
          display: flex;
          margin-left: 4px;
        }
      `}</style>

      <section className="section intro">
        <div className="container">
          <h1>
            Features
          </h1>
          {/* <p>
            Timeline v1{" "}
            <a
              href="https://codepen.io/tutsplus/full/ZKpNwm"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </p> */}
        </div>
      </section>

      <section className="timeline">
        <div className="info">
          <img
            width="50"
            height="50"
            src="https://assets.codepen.io/210284/face.svg"
            alt=""
          />
          <h2>Our Journey</h2>
            `<p>
            Founded with a mission to revolutionize healthcare through innovation, MedVision has been at the forefront of developing intelligent medical solutions. Our journey began with a simple idea — to make healthcare more accessible, efficient, and patient-centered using technology.
            </p>
            <p>
            <a href="/">Learn more &gt;</a>
            </p>`

        </div>

        <ol>
          {timelineData.map((item, index) => (
            <li key={index}>
              <div>
                <time>{item.title}</time> {item.text}
              </div>
            </li>
          ))}
          <li></li>
        </ol>
      </section>

     
    </>
  );
};

export default Features;
