import React,{ useEffect,useState } from 'react';
import './App.css';

import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { Routes, Route, Link } from "react-router-dom";
import { DistrictDetails } from './Components/DistrictDetails';
import { NavComp } from './Components/NavComp';
import { Admin } from './Components/Admin';

function App() {
  const [loggedInUser, setloggedInUser] = useState(null);
  useEffect(()=>{
    let user=JSON.parse(localStorage.getItem("loggedInUser"))
    setloggedInUser(user)
  },[]);
  return (
    <div className="App">
      <NavComp/>
      
      
      <div className='container'>
        <Routes>
          <Route path="" element={<DistrictDetails/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<Admin/>} />

        </Routes>

      </div>

    </div>


  );
}

export default App;
