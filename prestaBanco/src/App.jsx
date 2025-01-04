import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Home from './components/Home';
import Register from './components/Register';
import Client from './components/Client';
import Loan from './components/Loan';
import Executive from './components/executive';
import ExecutiveNew from './components/ExecutiveNew';
import UserDetails from './components/UserDetails';
import Request from './components/Request';

function App() {
  return (
    <Router>
      <div className='Container'>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/Register' element={<Register/>} />
          <Route path='/Client' element={<Client/>} />
          <Route path='/Client/Loan' element={<Loan/>}/>
          <Route path='/Executive' element={<Executive/>}/>
          <Route path='/ExecutiveNew' element={<ExecutiveNew/>}/>
          <Route path='/user/:id' element={<UserDetails/>}/>
          <Route path='/Request/:rut' element={<Request/>}/>
          
        </Routes> 

      </div>
    </Router>
  )
}

export default App
