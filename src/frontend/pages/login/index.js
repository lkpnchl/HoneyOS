import React, { useState } from 'react';
import userIcon from "../../assets/img/user.png"
import styles from './login.module.css'; 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mic } from 'lucide-react';
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'

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
    // <div className={`${styles.loginContainer} justify-center text-center flex-col`}> 
    // <div className={styles.userIcon}>
    // <img src= {userIcon} />
    // </div>
    //   <div className={styles.welcomeText}>
    //   <h3 >Welcome, Barry!</h3>
    //   </div>
    //   <div>
    //   <Button className={`${styles.speechRecogBtn} rounded-full border-2 border-blue-700`} onClick={handleSpeechInput} variant="outline" size="icon">
    //     <Mic className={`${styles.speechRecogIcon} h-15 w-20`} />
    //   </Button></div>
    // </div>

    <div className={`${styles.loginContainer} flex flex-col items-center justify-center pb-1 mb-8`}>
      <div className={styles.userIcon}>
        <img src={userIcon} />
      </div>
          <div className='pt-3 flex flex-col items-center gap-5 w-full'>
      <Label className={`${styles.welcomeText} pt-3`}> <h2> Welcome, Barry! </h2> </Label>
      <Button className={`${styles.speechRecogBtn} drop-shadow-md rounded-full border-2 border-zinc-50 outline-yellow-50`} onClick={handleSpeechInput} variant="outline" size="icon">
      <Mic className={`${styles.speechRecogIcon} h-25 w-25`} />
            </Button>
          </div>
    </div>
  );
}

export default Login;

