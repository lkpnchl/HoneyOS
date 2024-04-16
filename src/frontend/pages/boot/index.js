import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Label } from '../../components/ui/label';
import styles from './boot.module.css'; 


export const BootApp = () => {
  const history = useNavigate();

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', options);
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const nextPage = async () => {
    history('/desktop')
  }

  return (
    <div className={`${styles.bodyBackground} `} onClick={nextPage}>
      <Label className={styles.currentTime}>{currentTime}</Label>
      <Label className={styles.currentDate}>{currentDate}</Label>
    </div>
  );
};
