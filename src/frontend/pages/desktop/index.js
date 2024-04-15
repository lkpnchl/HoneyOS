import React, { useState } from 'react'
import Notepad from '../../components/notepad/Notepad';
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ArrowRightFromLineIcon,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import styles from './desktop.module.css'
export const Desktop = ({ }) => {
  return (
    <>
    <div className={`${styles.container} flex align-left h-screen`}>
      <aside className="w-12 bg-gradient drop-shadow-md flex flex-col justify-between">
        <div className="h-12 flex items-center justify-center border-b-2 border-white-250">
          <Button variant="link" size="icon">
            <Link to="/desktop">
              <HomeIcon className="h-7 w-7 text-white" />
            </Link>
          </Button>
        </div> 
        <div className="h-12 flex items-center justify-center border-t-2 border-white-250">
          <Button variant="link" size="icon">
            <Link to="/">
              <ArrowRightFromLineIcon className="h-7 w-7 text-white" />
            </Link>
          </Button>
        </div>
      </aside>
    </div>
    <div className={`items-center justify-center pb-12 mb-12`}>
      <Label className={`${styles.welcomeText} pt-4`}> Display Something here</Label>
      <Label className={`${styles.welcomeText} pt-4`}> Desktop Area</Label>
    </div>
    <Notepad />

    </>
  )
}
