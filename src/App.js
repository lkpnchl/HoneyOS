// app.js
import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from "react-router-dom"
import "./App.css"
import { useCallback } from "react"
import { Desktop } from "./frontend/pages/desktop"
import { BootApp } from "./frontend/pages/boot"
import Login from './frontend/pages/login'; 


function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const handleLogin = () => {
	  setIsLoggedIn(true);
	}

	const handleLogout = () => {
		setIsLoggedIn(false)
	};
	
	return (
		<>
			{/* <div className='background'> */}
				<div className='App'>
					<Router>
						<Routes>
							<Route path="/" 
								element={<Navigate 
								to={isLoggedIn ? "/desktop" : "/boot"} />} />
							<Route path="/boot" 
									element={<BootApp onLogin={handleLogin} />} />
							<Route path="/login" 
								element={<Login/>} />
							<Route path="/desktop" 
								element={<Desktop/>} />
						</Routes>
					</Router>
				</div>
			{/* </div> */}
		</>
	)
}

export default App
