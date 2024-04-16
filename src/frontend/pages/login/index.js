import React, { useState } from 'react';
import userIcon from "../../assets/img/user.png"
import styles from './login.module.css'; 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mic } from 'lucide-react';
import { Button } from '../../components/ui/button'

function Login() {
  const [password, setPassword] = useState('');

  const handleSpeechInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = function(event) {
      const speechResult = event.results[0][0].transcript;
      setPassword(speechResult);
  
    };
    recognition.start();
  };

  return (
    <div className={styles.loginContainer}> 
    <div className={styles.userIcon}>
    <img src= {userIcon} />
    </div>
      
      <div className={styles.welcomeText}>Welcome, Barry!</div>
      <button onClick={handleSpeechInput} className={styles.speechRecogBtn}>
      <Button className="rounded-full border-2 border-blue-700" variant="outline" size="icon">
        <Mic className={`${styles.speechRecogIcon} h-15 w-20`} />
      </Button>
      </button>
    </div>
  );
}

export default Login;

