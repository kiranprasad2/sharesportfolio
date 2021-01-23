import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobMenu = () => setClick(false);

    return (
        <>
            <nav className='navbar'>
                <Link to='/' className='navbar-name'>
                    SHARES
                </Link>
                <div className='navbar-mob' onClick={handleClick}>
                    <i className={click ?'fas fa-times':'fas fa-bars' } />
                </div>
                <ul className={click ? 'na-menu active' : 'na-menu'}>
                    <li className='na-item'>
                        <Link to='/' className='na-links' onClick={closeMobMenu}>
                            Home
                        </Link>

                    </li>
                    <li className='na-item'>
                        <Link to='/contact-us' className='na-links' onClick={closeMobMenu}>
                            About Us
                        </Link>

                    </li>
                    <li className='na-item'>
                        <Link to='/DashBoard' className='na-links' onClick={closeMobMenu}>
                            DashBoard
                        </Link>

                    </li>
                    <li className='na-item'>
                        <Link to='/contact-us' className='na-links' onClick={closeMobMenu}>
                            Contact Us
                        </Link>

                    </li>
                    
                </ul>
                

            </nav>
        </>
    );
}
export default Navbar;