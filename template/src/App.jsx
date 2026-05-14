import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import Welcome from './components/welcome';
import Command from './components/command';
import Example from './components/example';

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex-grow">
        <Header />
        <Welcome />
        <Command />
        <Example />
      </div>
      <Footer />
    </div>
  );
}

export default App;
