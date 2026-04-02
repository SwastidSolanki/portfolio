import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    role: "Freelancer",
    company: "Freelancing",
    duration: "Feb 2021 - Dec 2025",
    description: "As a Full-stack developer, I build complete, custom web applications, Shopify stores and more. Previously, I also worked as a freelance video editor for various clients.",
    tech: ["Video Editing", "Fullstack Development"]
  },
  {
    id: 2,
    role: "Assistant System Engineer",
    company: "TCS (Tata Consultancy Services)",
    duration: "Jan 2026 - Present",
    description: "Working on enterprise-level applications, leveraging Python, SQL, ETL pipelines, and AWS services to build scalable architectures and ensure efficient data processing across distributed systems.",
    tech: ["AWS", "SQL", "Python", "ETL Pipelines"]
  }
];

const Experience: React.FC = () => {
  const container = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.exp-item');

      items.forEach((item: any) => {
        gsap.fromTo(item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className={styles.experienceSection} ref={container}>
      <h2 className={styles.heading}>
        My <span className="text-gradient">Experience</span>
      </h2>

      <div className={styles.timeline}>
        {experiences.map((exp) => (
          <div key={exp.id} className={`exp-item ${styles.timelineItem}`}>
            <div className={styles.timelineDot}></div>
            <div className={styles.content}>
              <div className={styles.header}>
                <h3 className={styles.role}>{exp.role}</h3>
                <span className={styles.duration}>{exp.duration}</span>
              </div>
              <h4 className={styles.company}>{exp.company}</h4>
              <p className={styles.description}>{exp.description}</p>
              <div className={styles.techStack}>
                {exp.tech.map((tech, index) => (
                  <span key={index} className={styles.techBadge}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
