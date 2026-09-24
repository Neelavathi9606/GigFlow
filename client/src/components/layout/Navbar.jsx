import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/authContext";
import { useState } from "react";
import { logout as logoutService } from "../../service/service";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutService();
      logout();
      setShowDropdown(false);
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
      logout();
      navigate('/');
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-royal-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <NavLink to="/" className="bg-powder-blue rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-royal-blue">GigFlow</span>
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({isActive})=>`text-bone hover:text-blue-600 transition-colors duration-200 font-medium ${isActive ? "underline" : ""}`}>
              Home
            </NavLink>
            <NavLink to="/gigs" className={({isActive})=>`text-bone hover:text-blue-600 transition-colors duration-200 font-medium ${isActive ? "underline" : ""}`}>
              Browse Gigs
            </NavLink>
            <NavLink to="/create-gig" className={({isActive})=>`text-bone hover:text-blue-600 transition-colors duration-200 font-medium ${isActive ? "underline" : ""}`}>
              Post a Job
            </NavLink>
            <NavLink to="/my-gigs" className={({isActive})=>`text-bone hover:text-blue-600 transition-colors duration-200 font-medium ${isActive ? "underline" : ""}`}>
              My Gigs
            </NavLink>
            <NavLink to="/my-bids" className={({isActive})=>`text-bone hover:text-blue-600 transition-colors duration-200 font-medium ${isActive ? "underline" : ""}`}>
              My Bids
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <NavLink to="/login">
                  <button className="px-6 py-2 text-royal-blue bg-bone hover:bg-powder-blue transition-colors duration-200 rounded-lg font-medium cursor-pointer">
                    Login
                  </button>
                </NavLink>
                <NavLink to="/register">
                  <button className="px-6 py-2 bg-powder-blue text-royal-blue hover:bg-bone transition-colors duration-200 rounded-lg font-medium cursor-pointer">
                    Sign Up
                  </button>
                </NavLink>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-bone hover:text-blue-600 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-powder-blue rounded-full flex items-center justify-center">
                    <span className="text-royal-blue font-bold text-lg">{getInitials(user?.name)}</span>
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                    <NavLink 
                      to="/my-gigs" 
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-royal-blue hover:bg-powder-blue transition-colors"
                    >
                      My Gigs
                    </NavLink>
                    <NavLink 
                      to="/my-bids" 
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-royal-blue hover:bg-powder-blue transition-colors"
                    >
                      My Bids
                    </NavLink>
                    <hr className="my-2 border-powder-blue" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-powder-blue transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-bone hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <NavLink to="/" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                Home
              </NavLink>
              <NavLink to="/gigs" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                Browse Gigs
              </NavLink>
              {isLoggedIn && (
                <>
                  <NavLink to="/create-gig" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                    Post a Job
                  </NavLink>
                  <NavLink to="/my-gigs" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                    My Gigs
                  </NavLink>
                  <NavLink to="/my-bids" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                    My Bids
                  </NavLink>
                </>
              )}
              <hr className="border-powder-blue my-2" />
              {!isLoggedIn ? (
                <>
                  <NavLink to="/login" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={() => setShowMobileMenu(false)} className="text-bone hover:text-blue-600 transition-colors py-2">
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="text-powder-blue font-bold py-2">
                    {user?.name}
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                    className="text-left text-red-400 hover:text-red-300 transition-colors py-2"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
