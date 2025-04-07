
import React from 'react';
import Navbar from './Navbar';
import './App.css'; // Import your App.css if needed
import oneImage from './assets/1.jpg';
import twoImage from './assets/2.jpg';
import threeImage from './assets/3.jpg';
function App() {
  return (
    <div>
      <Navbar />
      <div id="home" className="home-section">
        <div className="overlay"></div>
             <h1>Welcome to the Event Management Website</h1>
            <p>Your one-stop solution for managing events seamlessly.</p>
          </div>
      <div id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          We are dedicated to providing the best event management services. Our team has years of experience in organizing events, ensuring everything runs smoothly and efficiently. Whether it's a corporate event, wedding, or party, we have the expertise to make it memorable.
        </p>
      </div>
      <div id="events" className="events-section">
        <h2>Upcoming Events</h2>
        <div className="event">
          <img src={oneImage} alt="Event 1" />
          <h3>Event 1</h3>
          <p>Date: March 25, 2024</p>
          <p>Description: Join us for an exciting event where you can network and learn.</p>
        </div>
        <div className="event">
          <img src={twoImage} alt="Event 2" />
          <h3>Event 2</h3>
          <p>Date: April 15, 2024</p>
          <p>Description: A fun-filled day with activities and entertainment for everyone.</p>
        </div>
        <div className="event">
          <img src={threeImage} alt="Event 3" />
          <h3>Event 3</h3>
          <p>Date: May 10, 2024</p>
          <p>Description: A workshop focused on improving your skills and knowledge.</p>
        </div>
      </div>
      <div id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions or need assistance, feel free to reach out!</p>
        <p>Email: info@eventmanagement.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>
  );
}
export default App;