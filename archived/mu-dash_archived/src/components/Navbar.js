import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/lab" style={styles.link}>Lab</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.user}>Hi, {user.email}</span>
            <button onClick={onLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.buttonLink}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#333',
    color: 'white',
  },
  left: {
    display: 'flex',
    gap: '1rem'
  },
  right: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  user: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  button: {
    background: '#555',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  },
  buttonLink: {
    background: '#555',
    color: 'white',
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    borderRadius: '4px'
  }
};

export default Navbar;