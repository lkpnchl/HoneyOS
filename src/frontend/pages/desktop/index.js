import React, { useState, useEffect } from 'react';
import Notepad from '../../components/notepad/Notepad';
import BusyBee from '../../components/pcb';
import Camera from '../../components/camera/Camera';
import ReplacementAlgo from '../../components/replacementAlgo';
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, Power } from 'lucide-react';
import { Button } from '../../components/ui/button';
import styles from './desktop.module.css';
import { VoiceRecog } from '../../components/voiceRecog';
import beeLogo from '../../assets/img/bee.png';
import buzzpadLogo from '../../assets/img/buzzpad.png';
import './desktop.module.css'

export const Desktop = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [showPowerOptions, setShowPowerOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePowerButtonClick = () => {
    setShowPowerOptions(!showPowerOptions);
  };

  const handlePowerOff = () => {
    navigate('/shutdown');
  };

  const handleSignOut = () => {
    navigate('/boot'); // Navigate to boot page
  };

  return (
    <>
      <div className={`${styles.taskbar} flex items-center justify-between fixed bottom-0 w-full h-25 shadow-lg p-4`}>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className={`${styles.appIconButton} transparent`}>
            <Link to="/boot">
              <HomeIcon/>
            </Link>
          </Button>
          {/* <Button variant="link" size="icon">
            <Link to="/PCB">
              <img src={beeLogo} alt="PCB" className="h-10 w-10" />
            </Link>
          </Button> */}
          <BusyBee />
          {/* <Button variant="link" size="icon">
            <img src={buzzpadLogo} alt="Notepad" className="h-7 w-7" />
          </Button> */}
          <Notepad />
          <Camera />
          <ReplacementAlgo />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-neutral-900 text-lg ">{currentTime}</span>
          <Button variant="ghost" size="icon">
            <VoiceRecog />
          </Button>
        </div>
      </div>
      <div className="fixed bottom-8 right-5">
        <Button variant="link" size="icon" onClick={handlePowerButtonClick}>
          <Power className="h-5 w-5 text-neutral-900 hover:text-neutral-50" />
        </Button>
        {showPowerOptions && (
          <div className="absolute right-0 bottom-12 w-40 bg-neutral-50 shadow-lg rounded-lg z-50">
            <ul>
              <li className="px-4 py-3 hover:bg-gray-200 hover:rounded-lg cursor-pointer border-b border-gray-300" onClick={handleSignOut}>Sign Out</li>
              <li className="px-4 py-3 hover:bg-gray-200 hover:rounded-lg cursor-pointer" onClick={handlePowerOff}>Power Off</li>
            </ul>
          </div>
        )}
      </div>
      {/* <Notepad /> */}
      {/* <PCB /> */}
    </>
  );
};