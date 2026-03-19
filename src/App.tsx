import Layout from './components/Layout';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import About from './components/About';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <div id="ecosystem">
        <BentoGrid />
      </div>
    </Layout>
  );
}

export default App;
