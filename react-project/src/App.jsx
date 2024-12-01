import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/SignIn';

function App() {
  return (
    <Router>
      <nav className='bg-gray-800 max-w-[500px] mx-auto text-white p-4 rounded-lg mb-4'>
        <div className='container mx-auto flex justify-center'>
          <div className='flex space-x-4'>
            <Link to='/signpage' className='hover:underline'>התחברות לאדמין</Link>
            <Link to='/' className='hover:underline'>לוח המודעות</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signpage' element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;