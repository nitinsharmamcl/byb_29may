"use client"

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { FaLaptopCode, FaStethoscope, FaChartLine, FaMapMarkerAlt, FaStar, 
  FaCheck, FaClock, FaChartBar, FaFacebookF, FaTwitter, FaInstagram, 
  FaLinkedinIn, FaEnvelope, FaPhone, FaArrowRight, FaQuoteLeft, FaCode, 
  FaHeartbeat, FaBusinessTime, FaGavel, FaUniversity, FaBook, FaUsers, 
  FaShieldAlt, FaChevronLeft, FaChevronRight, FaCalendar } from 'react-icons/fa';
import { HiMenu, HiX, HiArrowRight } from 'react-icons/hi';
import UniversityDetailsModal from "../components/UniversityDetailsModal";
import ProgramDetailsModal from "../components/ProgramDetailsModal";
import axios from "axios";

// Add types
const University = {
  id: 0,
  name: '',
  location: '',
  campus: '',
  annual_fees: '',
  fees: '',
  uni_image: '',
  university_country_id: 0,
  entry_type: 0,
};
const Country = {
  id: 0,
  name: '',
};
const Program = {
  id: 0,
  name: '',
  description: '',
  course_id: 0,
};
const Course = {
  id: 0,
  name: '',
};
const Trade = {
  id: 0,
  name: '',
};

// Add types for counseling form
const CounselingFormData = {
  name: '',
  email: '',
  phone: '',
  coursePreference: '',
  message: '',
};
const CounselingFormErrors = {
  name: '',
  email: '',
  phone: '',
  coursePreference: '',
};

const AnimatedCounter = ({ target, duration, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="inline-block">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className="h-4 w-4" />);
  }
  
  if (hasHalfStar) {
    stars.push(
      <svg key="half-star" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" className="text-yellow-400" />
        <path d="M10 14.44V2.83c-.36.28-.75.51-1.01 1.52L7.88 7.84c-.23.71-1.01.79-1.26.86H3.38c-1.62 0-1.94 2.24-.83 3.07l2.76 2.02c.65.48.9 1.3.57 2l-1.07 3.32c-.34 1.12.91 2.22 1.95 1.4l2.75-2c.37-.3.92-.3 1.29 0" className="text-transparent" />
      </svg>
    );
  }
  
  return <div className="flex text-yellow-400">{stars}</div>;
};

// Main LandingPage Component
const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);
  const [formData, setFormData] = useState(CounselingFormData);
  const [searchFormData, setSearchFormData] = useState({
    course: '',
    location: '',
    type: '',
    fees: ''
  });

  const start_api = process.env.NEXT_PUBLIC_API_URL || "";

  const router = useRouter();
  
  const [formErrors, setFormErrors] = useState(CounselingFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Colleges', href: '#colleges' },
    { name: 'Courses', href: '#courses' },
    { name: 'Programs', href: '#programs' },
    // { name: 'Reviews', href: '#testimonials' },
    { name: 'Counseling', href: '#counseling' },
    { name: 'Suggest in 2 mins', href: '/suggestpage' }
  ];

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navigation click handler with smooth scroll
  const handleNavClick = (href) => {
    if (href === '/suggestpage') {
      router.push('/suggestpage');
    }
    else if (href === '#') {
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



  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('Select', '');
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }

  const handleChange = (
    e
  ) => {
    const { id, value } = e.target;
    const fieldName = id.replace('Input', '').replace('Preference', '').replace('Select', '');

    if (id.includes('Select')) {
      setSearchFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));

      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
      if (formErrors[fieldName]) {
        setFormErrors(prev => ({
          ...prev,
          [fieldName]: undefined
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name';
      isValid = false;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email';
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Phone validation
    const phonePattern = /^\d{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter your phone number';
      isValid = false;
    } else if (!phonePattern.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }
    
    // Course preference validation
    if (!formData.coursePreference) {
      errors.coursePreference = 'Please select a course preference';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);

      console.log('Form data:', formData);
      

      axios.post(`${start_api}/admin/api/enquiry`, formData).then((res) => {
        console.log('Form submitted successfully:', res.data);
        setIsSubmitting(false);
         setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          coursePreference: '',
          message: ''
        });
      }).catch((error) => {
        console.error('Error submitting form:', error);
      })
      
    }
  };
   
  // Search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search form submitted:', searchFormData);
    // Here you'd typically handle the search form submission, like redirecting to search results
  };

  // Testimonial navigation
  const testimonials = [
    {
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      name: "Priya Singh",
      course: "B.Tech, Punjab Engineering College",
      text: "UniSearch helped me find the perfect engineering college that aligned with my career goals. The detailed information and personalized recommendations made my decision much easier.",
      rating: 5,
    },
    {
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      name: "Arjun Sharma",
      course: "MBBS, Government Medical College",
      text: "The counseling service was a game-changer in my medical college search. Their guidance saved me countless hours and helped me secure admission to a top medical program.",
      rating: 4,
    },
    {
      img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      name: "Simran Kaur",
      course: "MBA, Lovely Professional University",
      text: "The detailed comparison tools on UniSearch programs.programs From curriculum to campus facilities, I found everything I needed to make an informed choice.",
      rating: 5,
    },
  ];

  const prevTestimonial = () => {
    setActiveTestimonial(prev => (prev > 0 ? prev - 1 : prev));
  };
  
  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev < testimonials.length - 1 ? prev + 1 : prev));
  };

  // University state
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isUniversityModalOpen, setIsUniversityModalOpen] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [countries, setCountries] = useState([]);
  const [selectedDegreeType, setSelectedDegreeType] = useState(null); // Add this state for degree type filtering

  useEffect(() => {
    // Fetch universities for landing page
    
    axios.get(`${start_api}/api/universities`).then((res) => {
      setUniversities(res.data.universities || []);
      setLoadingUniversities(false);
    }).catch(() => setLoadingUniversities(false));
    // Fetch all countries
    axios.post(`${start_api}/api/countries/allcountries`).then((res) => {
      setCountries(res.data || []);
    });
  }, []);

  const openUniversityModal = (university, degreeType = null) => {
    setSelectedUniversity(university);
    setSelectedDegreeType(degreeType); // Set the selected degree type
    setIsUniversityModalOpen(true);
   
  };

  const openUniversityProgramsNextPage = (university, degreeType = null) => {
    let path = `/universities/${university.id}`;
    if (degreeType) {
      path += `?degreeType=${degreeType}`;
    }
    router.push(path);
  }


  const closeUniversityModal = () => {
    setIsUniversityModalOpen(false);
    setSelectedUniversity(null);
    setSelectedDegreeType(null); // Reset the selected degree type
  };



  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [programScrollIndex, setProgramScrollIndex] = useState(0);

  useEffect(() => {
    axios.get(`${start_api}/api/programs`).then(res => {
      setPrograms(res.data.programs || [])
    });
    // axios.post("/api/fetchcoursetrades", { id: null }).then(res => setCourses(res.data.trades || []));

  }, []);

  const getCourseName = (course_id) => {
    const course = courses.find(c => c.id === course_id);
    return course ? course.name : 'Unknown Course';
  };

  const openProgramModal = (program) => {
    setSelectedProgram(program);
    setIsProgramModalOpen(true);
    setLoadingTrades(true);
    axios.post(`${start_api}/api/fetchcoursetrades`, { id: program.id })
      .then(res => setTrades(res.data.trades || []))
      .finally(() => setLoadingTrades(false));
  };
  const closeProgramModal = () => {
    setIsProgramModalOpen(false);
    setSelectedProgram(null);
    setTrades([]);
  };

  const visiblePrograms = programs.slice(programScrollIndex, programScrollIndex + 3);
  const canScrollLeft = programScrollIndex > 0;
  const canScrollRight = programScrollIndex + 3 < programs.length;

  return (
    <div className="landing-page">
      {/* Header */}
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

      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-navy-to-light relative">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 opacity-20 w-1/2 animate-float">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FB0200" d="M42.8,-67.9C53.4,-60.5,58.9,-45.4,62.5,-31.3C66.1,-17.3,67.8,-4.4,66.4,8.3C65,21,60.6,33.4,51.8,41.8C43,50.1,29.9,54.4,16.6,58.2C3.3,62,-10.1,65.4,-22.5,62.6C-34.9,59.8,-46.2,51,-56.1,39.6C-66.1,28.3,-74.6,14.1,-75.8,-0.7C-77,-15.6,-70.9,-31.1,-60.8,-41.9C-50.7,-52.7,-36.5,-58.8,-23.1,-64.3C-9.6,-69.8,3.1,-74.8,16.8,-73.8C30.5,-72.7,32.1,-75.3,42.8,-67.9Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 opacity-10 w-1/3 animate-float-delayed">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#003366" d="M53.6,-64.5C66.2,-53.3,71.2,-32.1,70.9,-13.4C70.6,5.3,65,21.5,55.2,33.9C45.4,46.3,31.5,54.8,14.6,64.1C-2.3,73.4,-22.1,83.4,-38.2,78.7C-54.3,74,-66.6,54.6,-73.3,34.1C-79.9,13.6,-81,8,-78.3,-15.4C-75.6,-38.8,-69.1,-80,-50.1,-91.3C-31.1,-102.5,0.4,-83.8,19.3,-70.7C38.2,-57.6,41,-75.7,53.6,-64.5Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left Column: Hero Content */}
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-gradient-red-navy">Find Your Dream</span><br/>
                  <span className="text-navy">University With Ease</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                  Discover top universities tailored to your academic goals and preferences. Your journey to higher education starts here.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#colleges" 
                    className="px-6 py-3 bg-gradient-red-to-navy text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center"
                  >
                    <span>Explore Colleges</span>
                    <HiArrowRight className="h-5 w-5 ml-2" />
                  </a>
                  <a 
                    href="#counseling" 
                    className="px-6 py-3 bg-white text-red font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center"
                  >
                    <span>Get Counseling</span>
                    <FaCalendar className="h-5 w-5 ml-2" />
                  </a>
                </div>
              </div>
              
              {/* Right Column: Search Form */}
              <div className="animate-fade-in-scale">
              <div className="bg-gradient-to-br from-white/10 to-black/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-800/50 border border-white/20" style={{marginRight:"90px"}}>

                  <h3 className="text-2xl font-bold text-navy mb-6">Find Your Ideal University</h3>
                  <form onSubmit={handleSearchSubmit} id="searchForm">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <select 
                          id="courseSelect" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30 transition-all"
                          value={searchFormData.course}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select a course</option>
                          {
                            programs.map((course) => (
                              <option key={course.id} value={course.name}>{course.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="locationSelect" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select 
                          id="locationSelect" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30 transition-all"
                          value={searchFormData.location}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select a location</option>
                          {
                            universities.map((country) => (
                              <option key={country.id} value={country.name}>{country.location}</option>
                            ))
                          }
                        </select>
                      </div>
                      
                      {/* <div>
                        <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
                        <select 
                          id="typeSelect" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30 transition-all"
                          value={searchFormData.type}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select type</option>
                          <option value="government">Government</option>
                          <option value="private">Private</option>
                          <option value="deemed">Deemed</option>
                          <option value="autonomous">Autonomous</option>
                        </select>
                      </div>
                       */}
                      <div>
                        <label htmlFor="feesSelect" className="block text-sm font-medium text-gray-700 mb-1">Fees Range</label>
                        <select 
                          id="feesSelect" 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30 transition-all"
                          value={searchFormData.fees}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select fees range</option>
                          <option value="0-50000">₹0 - ₹50,000</option>
                          <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                          <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                          <option value="200000+">Above ₹2,00,000</option>
                        </select>
                      </div>
                      
                      <button 
                        type="submit" 
                        onClick={() => {router.push('/register')}}
                        
                        className="w-full py-3 bg-gradient-red-to-navy text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-[1.02]"
                      >
                        Register 
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
  <div className="container mx-auto px-4 md:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {[
        {
          icon: <FaUniversity className="h-10 w-10 text-red transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:text-red-600 group-hover:drop-shadow-lg" />,
          value: 500,
          suffix: "+",
          label: "Universities"
        },
        {
          icon: <FaBook className="h-10 w-10 text-red transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:text-purple-600 group-hover:drop-shadow-lg" />,
          value: 2500,
          suffix: "+",
          label: "Courses"
        },
        {
          icon: <FaUsers className="h-10 w-10 text-navy transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:text-blue-600 group-hover:drop-shadow-lg" />,
          value: 50000,
          suffix: "+",
          label: "Students"
        },
        {
          icon: <FaShieldAlt className="h-10 w-10 text-navy transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:text-green-600 group-hover:drop-shadow-lg" />,
          value: 95,
          suffix: "%",
          label: "Placement Rate"
        }
      ].map((stat, index) => (
        <div 
          key={index} 
          className="group flex flex-col items-center justify-center text-center p-6 bg-white shadow-md rounded-xl transition-all duration-300 hover:shadow-2xl"
        >
          <div className="mb-2">{stat.icon}</div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            <AnimatedCounter 
              target={stat.value} 
              duration={2000} 
              suffix={stat.suffix} 
            />
          </h3>
          <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Colleges Section */}
        <section id="colleges" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-navy">Top Universities</h2>
                {/* Elegant Red Line with Curved Ends */}
                <div className="relative flex justify-center items-center">
                  <div className="w-24 h-[3px] bg-red-500 rounded-full"></div>
                  <div className="w-40 h-[4px] bg-red-500 rounded-full mx-2"></div>
                  <div className="w-24 h-[3px] bg-red-500 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700 mt-4">
                  Discover the highest-rated universities that offer excellent education and career opportunities.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingUniversities ? (
                <div className="col-span-3 text-center py-10">Loading...</div>
              ) : (
                universities.slice(0, 3).map((university, index) => (
                  <div
                    key={university.id}
                    className="bg-white rounded-xl shadow-custom overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                      {university?.uni_image ? (
                        <img
                        onClick={() => router.push(`/universities/programs/${university.id}`)}
                          src={university?.uni_image}
                          alt={`${university.name} campus`}
                          className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-110 duration-700"
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
                      <div onClick={() => router.push(`/universities/programs/${university.id}`)} className="flex justify-between items-start mb-4 cursor-pointer ">
                        <h3 className="text-xl font-bold text-navy">{university.name}</h3>
                        {/* Optionally add a rating or badge here */}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {/* {university.campus && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-navy">{university.campus}</span>
                        )}
                        {university.university_country_id && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600">
                            {getCountryName(university.university_country_id)}
                          </span>
                        )} */}
                        {/* Add degree type badges */}
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            openUniversityProgramsNextPage(university, 'bachelor');
                          }}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-600 cursor-pointer hover:bg-purple-100 transition-colors"
                        >
                          Bachelor
                        </span>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            openUniversityProgramsNextPage(university, 'master');
                          }}
                          className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-600 cursor-pointer hover:bg-orange-100 transition-colors"
                        >
                          Master
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="text-gray-700">
                          <span className="font-semibold text-red">₹{university.annual_fees || university.fees}</span>
                          <span className="text-xs text-gray-500 ml-1">/year</span>
                        </div>
                        <button
                          className="flex items-center text-sm font-semibold text-navy hover:text-red transition-colors group"
                          onClick={() => openUniversityModal(university)} // Updated to navigate
                        >
                          <span>View Details</span>
                          <FaArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => router.push("/universities")}
                className="inline-flex items-center px-6 py-3 border border-red text-red font-semibold rounded-full hover:bg-red hover:bg-opacity-10 transition-colors transform hover:scale-105"
              >
                <span>View All Universities</span>
                <FaArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
            {isUniversityModalOpen && selectedUniversity && (
              <UniversityDetailsModal 
                university={selectedUniversity} 
                onClose={closeUniversityModal} 
                countries={countries} 
                selectedDegreeType={selectedDegreeType} // Pass the selected degree type
              />
            )}
          </div>
        </section>

        {/* Programs Section */}
 

  <section
    id="programs"
    className="py-16 md:py-24 bg-white"
 
  >

          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-navy">Academic Programs</h2>
                {/* Elegant Red Lines with Curved Ends */}
                <div className="relative flex justify-center items-center">
                  <div className="w-24 h-[3px] bg-red-500 rounded-full"></div>
                  <div className="w-40 h-[4px] bg-red-500 rounded-full mx-2"></div>
                  <div className="w-24 h-[3px] bg-red-500 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700 mt-4">
                  Explore various academic programs designed to help you achieve your career goals.
                </p>
              </div>
            </div>
            <div className="relative">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 disabled:opacity-30"
                onClick={() => setProgramScrollIndex(i => Math.max(0, i - 1))}
                disabled={!canScrollLeft}
              >
                <span className="sr-only">Scroll Left</span>
                &#8592;
              </button>
              <div className="overflow-x-auto flex space-x-6 px-12">
                {visiblePrograms.map((program, index) => (
                  <div
                    key={program.id}
                    className="min-w-[320px] bg-gradient-navy-to-light rounded-xl p-6 border border-navy border-opacity-10 hover:shadow-lg transition-all transform hover:-translate-y-2 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-red mb-4 text-3xl transform transition-transform hover:scale-110 hover:rotate-5">
                      <div className="text-4xl">
                        {/* You can add an icon here if you want */}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-navy mb-3">{program.name}</h3>
                    <p className="text-gray-700 mb-2">{program.description}</p>
                    {/* <div className="mb-4 text-sm text-navy font-semibold">Course: {getCourseName(program.course_id)}</div> */}
                    <button
                      onClick={() => openProgramModal(program)}
                      className="flex items-center text-red font-semibold hover:text-navy transition-colors group border border-red rounded-full px-4 py-2 mt-2"
                    >
                      <span>Explore Program</span>
                      <span className="ml-2">&#8594;</span>
                    </button>
                  </div>
                ))}

                       
              </div>
                   <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => router.push("/programs")}
                className="inline-flex items-center px-6 py-3 border border-red text-red font-semibold rounded-full hover:bg-red hover:bg-opacity-10 transition-colors transform hover:scale-105"
              >
                <span>View All Programs</span>
                <FaArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 disabled:opacity-30"
                onClick={() => setProgramScrollIndex(i => Math.min(programs.length - 3, i + 1))}
                disabled={!canScrollRight}
              >
                <span className="sr-only">Scroll Right</span>
                &#8594;
              </button>
            </div>
            {isProgramModalOpen && selectedProgram && (
              <ProgramDetailsModal
                program={selectedProgram}
                onClose={closeProgramModal}
                courseName={getCourseName(selectedProgram.course_id)}
                trades={trades}
                loadingTrades={loadingTrades}
              />
            )}
          </div>
        </section>

        {/* Courses Section */}
        {/* <section id="courses" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy">Top Courses</h2>
              <p className="text-lg text-gray-700">
                Discover the most popular and in-demand courses for your career advancement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: <FaCode />,
                  title: "B.Tech ",
                  duration: "4 Year • Full Time",
                  rating: "4.8",
                  fees: "₹1.2L",
                  colleges: "15+ Colleges",
                  color: "navy"
                },
                {
                  icon: <FaHeartbeat />,
                  title: "MBBS",
                  duration: "5.5 Year • Full Time",
                  rating: "4.9",
                  fees: "₹5L",
                  colleges: "10+ Colleges",
                  color: "red"
                },
                {
                  icon: <FaBusinessTime />,
                  title: "MBA",
                  duration: "2 Year • Full Time",
                  rating: "4.7",
                  fees: "₹2.5L",
                  colleges: "25+ Colleges",
                  color: "navy"
                },
                {
                  icon: <FaGavel />,
                  title: "LLB",
                  duration: "3 Year • Full Time",
                  rating: "4.6",
                  fees: "₹1.8L",
                  colleges: "12+ Colleges",
                  color: "red"
                }
              ].map((course, index) => {
                const bgClass = course.color === 'navy' ? 'bg-navy bg-opacity-10' : 'bg-red bg-opacity-10';
                const textClass = course.color === 'navy' ? 'text-navy' : 'text-red';
                
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-custom overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-2 animate-fade-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="p-5">
                      <div className="mb-4 transform transition-transform hover:scale-110 hover:rotate-5">
                        <div className={`p-3 rounded-full ${bgClass} ${textClass} inline-block`}>
                          <div className="text-white">
                            {course.icon}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-navy mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{course.duration}</p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center text-yellow-500 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-navy font-bold">
                          {course.fees}
                        </div>
                        <div className="text-sm text-gray-600">
                          {course.colleges}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${bgClass} p-4`}>
                      <a 
                        href="#" 
                        className={`flex justify-center explore items-center text-white font-semibold ${textClass} hover:opacity-80 transition-opacity `}
                      >
                        <span>Explore Course</span>
                        <FaArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-10 animate-fade-in-up" style={{animationDelay: "0.4s"}}>
              <a 
                href="#" 
                className="inline-flex items-center px-6 py-3 border border-red text-red font-semibold rounded-full hover:bg-red hover:bg-opacity-10 transition-colors transform hover:scale-105"
              >
                <span>Browse All Courses</span>
                <FaArrowRight className="h-5 w-5 ml-2" />
              </a>
            </div>
          </div>
        </section> */}


        {/* Counseling Section */}
        <section id="counseling" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Image and Text */}
              <div className="animate-fade-in-left">
                <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8 transform transition-transform hover:scale-[1.02]">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Educational counselor with student" 
                    className="w-full h-96 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-50"></div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy ">Get Expert Counseling</h2>
                
                
                <div className="space-y-4">
                  <div className="flex items-start transform transition-transform hover:translate-x-1">
                    <div className="bg-red bg-opacity-10 p-2 rounded-full mr-4 mt-1">
                      <FaCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-navy">Personalized Guidance</h4>
                      <p className="text-gray-700">Tailored advice based on your academic background, interests, and career goals.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start transform transition-transform hover:translate-x-1">
                    <div className="bg-red bg-opacity-10 p-2 rounded-full mr-4 mt-1">
                      <FaClock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-navy">Admission Assistance</h4>
                      <p className="text-gray-700">Help with application processes, deadlines, and documentation requirements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start transform transition-transform hover:translate-x-1">
                    <div className="bg-red bg-opacity-10 p-2 rounded-full mr-4 mt-1">
                      <FaChartBar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-navy">Career Planning</h4>
                      <p className="text-gray-700">Insights into job prospects, industry trends, and future career paths.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Form */}
              <div className="animate-fade-in-right">
                <div className="bg-gradient-to-br from-gray-50 to-navy-light rounded-2xl p-8 shadow-lg border border-navy border-opacity-10">
                  <h3 className="text-2xl font-bold text-navy mb-6">Register for Free Counseling</h3>
                  
                  {isSubmitted ? (
                    <div className="text-center py-8 animate-fade-in-scale">
                      <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 inline-flex items-center justify-center">
                        <FaCheck className="h-8 w-8" />
                      </div>
                      <h4 className="text-xl font-bold text-navy mb-2">Thank You!</h4>
                      <p className="text-gray-700">Your request has been submitted successfully. Our counselor will contact you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} id="counselingForm" className="space-y-5">
                      <div>
                        <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input 
                          type="text" 
                          id="nameInput" 
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red focus:border-red focus:ring-red focus:ring-opacity-30' : 'border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30'} transition-all`}
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {formErrors.name && (
                          <p className="text-red text-sm mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          id="emailInput" 
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red focus:border-red focus:ring-red focus:ring-opacity-30' : 'border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30'} transition-all`}
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {formErrors.email && (
                          <p className="text-red text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phoneInput" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phoneInput" 
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors.phone ? 'border-red focus:border-red focus:ring-red focus:ring-opacity-30' : 'border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30'} transition-all`}
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {formErrors.phone && (
                          <p className="text-red text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="coursePreference" className="block text-sm font-medium text-gray-700 mb-1">Course Preference</label>
                        <select 
                          id="coursePreference" 
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors.coursePreference ? 'border-red focus:border-red focus:ring-red focus:ring-opacity-30' : 'border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30'} transition-all`}
                          value={formData.coursePreference}
                          onChange={handleSelectChange}
                        >
                          {/* <option value="" disabled>Select a course</option>
                          <option value="btech">B.Tech</option>
                          <option value="mtech">M.Tech</option>
                          <option value="mba">MBA</option>
                          <option value="mbbs">MBBS</option>
                          <option value="bba">BBA</option>
                          <option value="other">Other</option> */}

                          {programs.map((course) => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                          ))}

                        </select>
                        {formErrors?.coursePreference && (
                          <p className="text-red text-sm mt-1">{formErrors?.coursePreference}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="messageInput" className="block text-sm font-medium text-gray-700 mb-1">Additional Information <span className="text-gray-500">(Optional)</span></label>
                        <textarea 
                          id="messageInput" 
                          rows={3} 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-2 focus:ring-red focus:ring-opacity-30 transition-all" 
                          placeholder="Tell us more about your requirements..."
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          type="submit" 
                          className="w-full py-3 bg-gradient-red-to-navy text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] flex justify-center items-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            "Submit Request"
                          )}
                        </button>
                      </div>
                      
                      <p className="text-center text-gray-600 text-sm">Our counselor will contact you within 24 hours.</p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Logo and About */}
            <div className="animate-fade-in-up">
              <div className="text-2xl font-extrabold mb-6">
                <span className="text-white">BringYour</span><span className="text-red">Buddy</span>
              </div>
              <p className="text-blue-100 mb-6">
                Helping students find their perfect educational path for a successful career and bright future.
              </p>
              <div className="flex space-x-4">
                {
                [{Icon : FaFacebookF, link : "https://www.facebook.com/"},
                   {Icon : FaTwitter, link : "https://x.com/"},
                    {Icon : FaInstagram, link : "https://www.instagram.com/"}, 
                    {Icon : FaLinkedinIn, link : "https://in.linkedin.com/"}
                  ]
                .map((Icon, index) => (
                  <a 
                    key={index}
                    href={Icon.link} 
                    className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all transform hover:-translate-y-1"
                  >
                    <Icon.Icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div className="animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <h4 className="text-lg font-bold mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {navItems.map((link, index) => (
                  <li 
                    key={index}
                    className="transform transition-transform hover:translate-x-1"
                  >
                    <a 
                      onClick={() => handleNavClick(link.href)}
                      className="text-blue-100 hover:text-white transition-colors cursor-pointer inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3: Other Links */}
            <div className="animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <h4 className="text-lg font-bold mb-5">Resources</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Admission Guide', href: '#' },
                  { name: 'Career Guidance', href: '#' },
                  { name: 'Scholarship News', href: '#' },
                  { name: 'Entrance Exams', href: '#' },
                  { name: 'Study Abroad', href: '#' },
                  { name: 'Education Loans', href: '#' }
                ].map((resource, index) => (
                  <li 
                    key={index}
                    className="transform transition-transform hover:translate-x-1"
                  >
                    <a href={resource.href} className="text-blue-100 hover:text-white transition-colors">
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 4: Contact */}
            <div className="animate-fade-in-up" style={{animationDelay: "0.3s"}}>
              <h4 className="text-lg font-bold mb-5">Contact Us</h4>
              <ul className="space-y-4">
                {[
                  { icon: <FaMapMarkerAlt />, text: "123 Education Street, Knowledge City, India" },
                  { icon: <FaEnvelope />, text: "contact@BringYourBuddy.com" },
                  { icon: <FaPhone />, text: "+91 1234567890" }
                ].map((contact, index) => (
                  <li 
                    key={index}
                    className="flex items-start transform transition-transform hover:translate-x-1"
                  >
                    <div className="text-red mr-3 mt-0.5">
                      {contact.icon}
                    </div>
                    <span className="text-blue-100">{contact.text}</span>
                  </li>
                ))}
              </ul>
              
              {/* <div className="mt-6">
                <h5 className="font-semibold mb-3">Subscribe to Newsletter</h5>
                <form className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red" 
                  />
                  <button 
                    className="bg-red hover:bg-red-dark px-4 py-2 rounded-r-lg text-white transition-colors transform hover:scale-[1.02]"
                  >
                    Subscribe
                  </button>
                </form>
              </div> */}
            </div>
          </div>
          
          <div className="border-t border-navy-light mt-12 pt-8 text-center text-blue-200 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <p>© {new Date().getFullYear()} BringYourBuddy. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;