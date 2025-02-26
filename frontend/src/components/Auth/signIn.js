import { useState } from "react" 
import { useNavigate, Link } from "react-router-dom"
import { FaHome, FaLock } from 'react-icons/fa';
import './Auth.css'
const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  
  const navigate = useNavigate()
  const API_URL = 'http://127.0.0.1:5000'
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    if (!username || !password) {
      setError('Username and Password must be provided');
      setIsLoading(false); // Stop loading
      return;
    }
    
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Parsed response data:', data);
        localStorage.setItem('user', data.is_admin)
        localStorage.setItem('user_id', data.id)
        const { is_admin, access_token, email } = data
        
        if (access_token) {
          localStorage.setItem('accessToken', access_token);
        } else {
          console.error('Access token is missing in the response.');
          setError('Access token missing. Try again.');
          setIsLoading(false); // Stop loading
          return;
        }
        
        if (is_admin !== undefined) {
          console.log('user.is_admin:', is_admin);
          
          if (parseInt(is_admin, 10) === 1) {
            console.log('Navigating to admin dashboard');
            navigate('/admin-dashboard', { state: { is_admin } });
          } else {
            console.log('Navigating to user dashboard');
            navigate('/user-dashboard', { state: { is_admin } });
          }
        } else {
          setError('User data is missing or incomplete.');
        }
        
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.msg}`);
      }
    } catch (error) {
      setError('Sign in failed. Please try again.');
      console.error('Error during sign up:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="auth-container">
      <button className="home-icon" onClick={() => navigate('/')}>
        <FaHome />
      </button>
      <div className="auth-box">
        <div className="auth-image" />
        <div className="auth-form">
          <div className="avatar">
            <FaLock />
          </div>
          <h1>Sign In</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                value="remember"
              />
              Remember me
            </label>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="links">
              <Link to="#">Forgot password?</Link>
              <Link to="/register">Don't have an account? Sign Up</Link>
            </div>
            <div className="google-auth-container">
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn;