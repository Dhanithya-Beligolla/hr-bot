import React, { useEffect, useState } from 'react';
import './Bot.css';
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Footer from './Footer';
import logo from '../assets/logo-dfccbank.png';
import BotImg from '../assets/hr_text1-removebg.png';
import bgImg from '../assets/background.png';
import BgImg1 from '../assets/tp244-bg1-02.jpg'




function Bot() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "https://dfcccompliance.vercel.app/";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to refresh the page? If you refresh this you will be logged out.";
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!document.querySelector('script[src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  if (!scriptLoaded) {
    return <div>Loading...</div>;
  }

  return (
    
   <div >
      {/* <img src= {BgImg1} alt='bg'/> */}

        <div className="logo-image">
          <img src={logo} alt="DFCC Bank Logo" />
        </div>

        {userDetails ? (
        <div className="profile-card">
            
          <u><h1 style={{fontSize:"35px",fontWeight:"bold", paddingTop:"30px", paddingBottom:"20px",textAlign:"center" }}>Hello {userDetails.firstName} {userDetails.lastName} </h1></u>
        </div>
      ) : (
        <p>Loading...</p>
      )}
       <div className='container' style={{textAlign:"left"}}>
      <h1 style={{fontSize:"40px",fontWeight:"bold", paddingTop:"20px", paddingBottom:"20px" }}>Welcome to DFCC HR Support Assist</h1>
      <p className='p1'>Ask your HR related questions here.</p>
     </div>

        <div className="bot-image">
          <img src={BotImg} alt="Bot Image" />
        </div>
        
        <div className='bot-align'>
        <df-messenger
          project-id="noted-casing-438604-a8"
          agent-id="1ede874e-3cce-4577-8718-2ae0ed9bca66"
          language-code="en"
          max-query-length="-1"
          allow-feedback="all">
          <df-messenger-chat
          chat-title="Ask HR">
          </df-messenger-chat>
        </df-messenger>


        </div>
          <div className="profile-buttons">

            <button className="button" onClick={handleLogout}>Logout</button>
          </div>
          <br/>
          
          <Footer />
    </div>
   
  );
}

export default Bot;
