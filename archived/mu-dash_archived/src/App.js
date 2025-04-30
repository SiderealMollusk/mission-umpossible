import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Lab from './pages/Lab';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;