import React from 'react';
import './App.css';
import Nav from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ContactUs from './components/pages/ContactsUs';
import Home from './components/pages/Home';
import DashBoard from './components/pages/DashBoard';
import Footer from './components/Footer1';
function App() {
  return (
    <Router>
          <Nav />
          <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/contact-us' exact component={ContactUs} />
              <Route path='/Dashboard' exact component={DashBoard} />
              
          </Switch>
          <Footer/>
    </Router>
  );
}

export default App;
