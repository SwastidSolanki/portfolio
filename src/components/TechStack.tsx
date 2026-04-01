import React, { useState } from 'react';
import styles from './TechStack.module.css';

const tools = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Redux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg' },
  { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg', invertInDark: true },
  { name: 'Framer Motion', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', invertInDark: true },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', invertInDark: true },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-plain.svg' },
  { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' },
  { name: 'Cloudinary', icon: 'https://cdn.simpleicons.org/cloudinary/0078FF' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', invertInDark: true },
  { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' },
  { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg' },
  { name: 'Bash', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg', invertInDark: true },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', invertInDark: true },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'Framer', icon: 'https://cdn.simpleicons.org/framer/0055FF' },
  { name: 'Notion', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/notion/notion-original.svg', invertInDark: true },
  { name: 'Chart.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chartjs/chartjs-original.svg' },
  { name: 'Premiere Pro', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/premierepro/premierepro-original.svg' },
  { name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg' },
  { name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg' },
  { name: 'GSAP', icon: 'https://cdn.simpleicons.org/greensock/88CE02' },
];


const TechStack: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Duplicate for seamless loop
  const doubled = [...tools, ...tools];

  const handleToolClick = (name: string) => {
    setActiveTool(activeTool === name ? null : name);
  };

  return (
    <section className={styles.section} id="tech">
      <h2 className={styles.heading}>
        Tools & Technologies <span className="text-gradient">I Work With</span>
      </h2>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {doubled.map((tool, i) => (
            <div
              key={`${tool.name}-${i}`}
              className={`${styles.toolCard} ${i >= tools.length ? styles.desktopOnly : ''} ${activeTool === tool.name ? styles.active : ''}`}
              onClick={() => handleToolClick(tool.name)}
            >
              <img
                src={tool.icon}
                alt={tool.name}
                className={`${styles.toolIcon} ${tool.invertInDark ? styles.invertInDark : ''}`}
                loading="lazy"
              />
              <span className={`${styles.toolName} ${activeTool === tool.name ? styles.showTooltip : ''}`}>
                {tool.name}
              </span>
            </div>


          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
