// import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Options from './components/Options';
import Machine1 from './components/CNC01';
import Machine2 from './components/CNC02'

function App() {


  return (
    <div>
      <Routes>
          <Route path='/' element={<Signup/>} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/Options' element={<Options/>} />
          <Route path='/page1' element={<Machine1/>} />
          <Route path='/page2' element={<Machine2/>} />
      </Routes>
    </div>
  );
}

export default App;
