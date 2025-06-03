"use client"

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaBookOpen } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import axios from "axios";

const ProgramsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [university, setUniversity] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const navItems = [
    { name: 'Home', href: '/' }, // Assuming home is at root
    { name: 'Colleges', href: '/colleges' }, // Assuming a colleges page
    { name: 'Courses', href: '/courses' }, // Assuming a courses page
    { name: 'Programs', href: '/programs' },
    { name: 'Counseling', href: '/counseling' }, // Assuming a counseling page
    { name: 'Suggest in 2 mins', href: '/suggestpage' }
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/programs/getalldetails'); 
        setPrograms(response.data.programs || []);
        setUniversity(response.data.universities || []);
        console.log("Fetched programs:", response.data);
 
        setError(null);
      } catch (err) {
        console.error("Failed to fetch programs:", err);
        setError('Failed to load programs. Please try again later.');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (href) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const filteredPrograms = programs.filter(program =>
    program.name && program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
         <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'navbar-sticky' : 'bg-transparent'}`}>
             <div className="container mx-auto px-4 md:px-6 lg:px-8">
               <nav className="flex items-center justify-between py-3">
                 {/* Logo */}
                 <a href="#" className="flex items-center animate-fade-in">
                   <div className="text-3xl font-extrabold">
                  <img src="./images/logo.png" alt=""  style={{width:"150px",marginRight:"50px",marginLeft:"-65px"}}/>
                   </div>
                 </a>
                 
                 {/* Desktop Navigation */}
                 <div className="hidden lg:flex items-center space-x-6 animate-slide-down text-black">
                   {navItems.map((item, index) => (
                     <a 
                       key={index}
                       onClick={() => handleNavClick(item.href)}
                       className={`font-semibold ${item.name === 'Home' ? 'text-black' : 'text-navy hover:text-black'} transition-colors cursor-pointer`}
                     >
                       {item.name}
                     </a>
                   ))}
                 </div>
                 
                 {/* Action Buttons */}
                 <div className="flex items-center space-x-3 animate-fade-in">
                   <span 
                     onClick={() => {router.push('/login')}}
                     className="hidden md:inline-block px-5 py-2 rounded-full text-black font-semibold hover:bg-red hover:bg-opacity-10 transition-all cursor-pointer"
                   >
                     Login
                   </span>
                   <span
                     onClick={() => {router.push('/register')}}
                     className="px-5 py-2 bg-gradient-red-to-navy text-white font-semibold rounded-full hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                   style={{marginRight:"-65px"}}>
                     Sign Up
                   </span>
                   
                   {/* Mobile Menu Button */}
                   <button 
                     className="lg:hidden focus:outline-none" 
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     aria-label="Toggle menu"
                   >
                     {isMenuOpen ? (
                       <HiX className="h-6 w-6 text-navy" />
                     ) : (
                       <HiMenu className="h-6 w-6 text-navy" />
                     )}
                   </button>
                 </div>
               </nav>
             </div>
             
             {/* Mobile Menu */}
             <div className={`lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 ${isMenuOpen ? 'block animate-slide-down' : 'hidden'}`}>
               <div className="container mx-auto px-4 py-2">
                 <div className="flex flex-col space-y-3 py-3">
                   {navItems.map((item, index) => (
                     <a 
                       key={index}
                       onClick={() => handleNavClick(item.href)}
                       className={`font-semibold ${item.name === 'Home' ? 'text-red' : 'text-navy hover:text-red'} py-2 transition-colors cursor-pointer`}
                     >
                       {item.name}
                     </a>
                   ))}
                   <a 
                     href="#"
                     className="py-2 font-semibold text-red cursor-pointer"
                   >
                     Login
                   </a>
                 </div>
               </div>
             </div>
           </header>

      <main className="pt-24 md:pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              Explore Our Programs
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect program to kickstart your career. Search by name or browse through our comprehensive list.
            </p>
          </div>

          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm transition-shadow hover:shadow-md"
              />
              <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {loading && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading programs...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-red-600 font-semibold">Error</p>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && filteredPrograms.length === 0 && (
            <div className="text-center py-10">
              <FaBookOpen className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">
                {programs.length > 0 ? 'No programs match your search.' : 'No programs available at the moment.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredPrograms.length  && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                
                university.map((uni) => (
                  uni.program_id === program.id && 
                  <div key={uni.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            
                    <div className="p-6">
                      <img src={uni.uni_image || ''} alt={uni.name} className="w-full h-48 object-cover mb-4 rounded-md"/> 
                      
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2 truncate" title={uni.name}>{uni.name}</h3>
                      <h6 className="text-2xl font-semibold text-gray-800 mb-2 truncate" title={program.name}>{program.name}</h6>
                      <p className="text-gray-600 text-sm mb-3 h-16 overflow-hidden">
                        {program.description || 'No description available.'}
                      </p>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => router.push(`/login`)} 
                          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                )) 
  
                
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} BringYourBuddy. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Your trusted partner in finding the best educational opportunities.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProgramsPage;