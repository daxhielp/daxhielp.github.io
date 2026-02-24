import MagneticCursor from './components/MagneticCursor';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import SelectedWorks from './sections/SelectedWorks';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  return (
    <main className="bg-background min-h-screen text-white selection:bg-emerald-500/30">
      <MagneticCursor />

      <div className="relative w-full overflow-hidden">
        {/* Background spans the entire content area except footer */}
        <InteractiveBackground 
          particleColor="rgba(100, 255, 218, 0.15)" 
          lineColor="rgba(100, 255, 218, 0.05)"
          particleCount={150}
        />
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <Hero />
          <Experience />
          <SelectedWorks />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <Footer />
      </div>
    </main>
  );
}

export default App;