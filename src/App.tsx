import Layout from './components/Layout';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import About from './components/About';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import SecretSystem from './components/simulation/SecretSystem';

function App() {
  return (
    <>
      <Layout>
        <Hero />
        <About />
        <Experience />
        <div id="ecosystem">
          <BentoGrid />
        </div>
        <TechStack />
      </Layout>
      <SecretSystem />
      <footer style={{ width: '100%', padding: '2rem', textAlign: 'center', color: '#475569', fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        Speak thy spell… and the path shall reveal itself
      </footer>
      <div 
        onClick={() => window.dispatchEvent(new CustomEvent('triggerSecretDirect'))}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          width: '8px',
          height: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        title="Quick Access"
      />
    </>
  );
}

export default App;
