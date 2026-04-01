import Layout from './components/Layout';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import About from './components/About';
import TechStack from './components/TechStack';
import Experience from './components/Experience';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Experience />
      <div id="ecosystem">
        <BentoGrid />
      </div>
      <TechStack />
    </Layout>
  );
}

export default App;
