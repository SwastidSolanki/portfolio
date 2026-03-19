import Layout from './components/Layout';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import About from './components/About';
import TechStack from './components/TechStack';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <div id="ecosystem">
        <BentoGrid />
      </div>
      <TechStack />
    </Layout>
  );
}

export default App;
