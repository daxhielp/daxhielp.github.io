import MagneticCursor from './components/MagneticCursor';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import SelectedWorks from './sections/SelectedWorks';
import Experience from './sections/Experience';
import Footer from './sections/Footer';

function App() {
  return (
    <main className="bg-background min-h-screen text-white selection:bg-emerald-500/30">
      <MagneticCursor />

      <div className="max-w-7xl mx-auto w-full">
        <Hero />
        <Experience />
        <SelectedWorks />
        <Footer />
      </div>
    </main>
  );
}

export default App;