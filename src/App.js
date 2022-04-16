import React from 'react';
import Items from './components/Items';
import NavBar from './components/NavBar';
import CreateItem from './components/CreateItem';
import Profile from './components/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Items/>}></Route>
          <Route path="/create" element={<CreateItem/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
