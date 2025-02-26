import {Link,useNavigate} from 'react-router-dom'
import './landingpage.css'
import heroImage from './images/16088.jpg'; 
import Features from './features';
const LandingPage = () =>{
      const navigate = useNavigate()
    return(
      <>
        <section className="hero">
        <img src={heroImage} alt="Hero Background" className="hero-image" />
        <div className="hero-content">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>K$h 0ut</h1>
<p style={{ fontSize: '1.5rem' }}>Point Of $ale</p>

        </div>
        <div className="button-container">
          <button
            className="primary-button"
            onClick={() => navigate('/register')}  // Navigate to Sign Up
          >
            Sign Up
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate('/sign-in')}  // Navigate to Login
          >
            Login
          </button>
        </div>
      </section>
      <Features/>
      
    </>
    )
}
export default LandingPage