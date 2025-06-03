"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUniversity, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import UniversityDetailsModal from "../../components/UniversityDetailsModal";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from 'next/navigation';

export default function AllUniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("/api/universities").then((res) => {
      setUniversities(res.data.universities || []);
      setFiltered(res.data.universities || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    // Fetch all countries
    axios.post("/api/countries/allcountries").then((res) => {
      setCountries(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(universities);
    } else {
      setFiltered(
        universities.filter(
          (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.location?.toLowerCase().includes(search.toLowerCase()) ||
            u.fees?.includes(search) ||
            u.annual_fees?.includes(search)
        )
      );
    }
  }, [search, universities]);

    const router = useRouter();
    

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

  const openModal = (university) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
  };

  // Helper to get country name by id
  const getCountryName = (id) => {
    const country = countries.find((c) => c.id === id);
    return country ? country.name : "Unknown Country";
  };
    const handleNavClick = (href) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = document.querySelector('header')?.offsetHeight || 0;
        const topOffset = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

    const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Colleges', href: '#colleges' },
    { name: 'Courses', href: '#courses' },
    { name: 'Programs', href: '#programs' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Counseling', href: '#counseling' }
  ];

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'navbar-sticky' : 'bg-transparent'}`}>
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <nav className="flex items-center justify-between py-3">
                  {/* Logo */}
                  <div onClick={() => router.push("/")} className="flex items-center animate-fade-in">
                    <div className="text-3xl font-extrabold">
                   <img src="./images/logo.png" alt=""  style={{width:"150px",marginRight:"50px",marginLeft:"-65px"}}/>
                    </div>
                  </div>
                  
                  {/* Desktop Navigation */}
                 
                  
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6 text-center">All Universities</h1>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by name, location or budget..."
            className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No universities found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((university, index) => (
              <div
                key={university.id}
                className="bg-white rounded-xl shadow-custom overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                  {university.uni_image ? (
                    <img
                    onClick={() => router.push(`/universities/programs/${university.id}`)}
                      src={university.uni_image}
                      alt={`${university.name} campus`}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                    />
                  ) : (
                    <FaUniversity className="w-20 h-20 text-navy opacity-30" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center text-white">
                      <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                      <span className="text-sm">{university.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 onClick={() => router.push(`/universities/programs/${university.id}`)} className="text-xl font-bold text-navy">{university.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {university.campus && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-navy">{university.campus}</span>
                    )}
                    {university.university_country_id && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600">
                        {getCountryName(university.university_country_id)}
                      </span>
                    )}
                    {university.entry_type !== undefined && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red bg-opacity-10 text-white">{university.entry_type === 1 ? 'Automated' : 'Manual'}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-gray-700">
                      <span className="font-semibold text-red">₹{university.annual_fees || university.fees}</span>
                      <span className="text-xs text-gray-500 ml-1">/year</span>
                    </div>
                    <button
                      className="flex items-center text-sm font-semibold text-navy hover:text-red transition-colors group"
                      onClick={() => openModal(university)}
                    >
                      <span>View Details</span>
                      <FaArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isModalOpen && selectedUniversity && (
          <UniversityDetailsModal university={selectedUniversity} onClose={closeModal} countries={countries} />
        )}
      </div>
    </div>
  );
} 