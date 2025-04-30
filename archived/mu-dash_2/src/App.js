import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Lab from './pages/Lab';

function App() {
  const runtimeEnv = process.env.REACT_APP_RUNTIME_ENV || 'unknown';

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <p>Environment: <strong>{runtimeEnv}</strong></p>

          {/* Simple navigation */}
          <nav>
            <Link to="/">Home</Link> | <Link to="/lab">Lab</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lab" element={<Lab />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Temporary home page
function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to MU-Dash</h1>
      <p>Choose a section from the nav above.</p>
    </div>
  );
}

export default App;