"use client"

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { FaLaptopCode, FaStethoscope, FaChartLine, FaMapMarkerAlt, FaStar, 
  FaCheck, FaClock, FaChartBar, FaFacebookF, FaTwitter, FaInstagram, 
  FaLinkedinIn, FaEnvelope, FaPhone, FaArrowRight, FaQuoteLeft, FaCode, 
  FaHeartbeat, FaBusinessTime, FaGavel, FaUniversity, FaBook, FaUsers, 
  FaShieldAlt, FaChevronLeft, FaChevronRight, FaCalendar } from 'react-icons/fa';
import { HiMenu, HiX, HiArrowRight } from 'react-icons/hi';
import axios from "axios";

const page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    degree: '',
    course: '',
    highestQualification: '',
    percentageScore: '',
    specialization: '',
    location: '',
    budget: ''
  });

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Colleges', href: '#colleges' },
    { name: 'Courses', href: '#courses' },
    { name: 'Programs', href: '#programs' },
    // { name: 'Reviews', href: '#testimonials' },
    { name: 'Counseling', href: '#counseling' },
    { name: 'Suggest in 2 mins', href: '/suggestpage' }
  ];

  // Form options
  const degreeOptions = [
    { id: 'pg', label: 'PG Courses' },
    { id: 'ug', label: 'UG Courses' },
    { id: 'phd', label: 'Doctorate/Ph.D.' },
    { id: 'executive', label: 'Executive Education' },
    { id: 'law', label: 'Law/LL.M.' },
    { id: 'diploma', label: 'Advanced Diploma' },
    { id: 'certificate', label: 'Skilling & Certificate' }
  ];

  const courseOptions = {
    pg: ['MBA', 'MCA', 'M.Tech', 'M.Sc', 'MA', 'M.Com'],
    ug: ['B.Tech', 'BBA', 'BCA', 'B.Sc', 'BA', 'B.Com'],
    phd: ['Ph.D. in Engineering', 'Ph.D. in Management', 'Ph.D. in Science', 'Ph.D. in Arts'],
    executive: ['Executive MBA', 'Executive PG Diploma', 'Certificate Programs'],
    law: ['LL.B', 'LL.M', 'Diploma in Law'],
    diploma: ['Diploma in Engineering', 'Diploma in Management', 'Diploma in IT'],
    certificate: ['Certificate in Digital Marketing', 'Certificate in Data Science', 'Certificate in Web Development']
  };

  const highestQualificationOptions = ['10th', '12th', 'Diploma', 'Bachelors', 'Masters'];
  const percentageScoreOptions = ['Below 50%', '50% to 80%', 'Above 80%'];

  const specializationOptions = {
    MBA: ['Finance', 'Marketing', 'HR', 'Operations', 'IT'],
    'B.Tech': ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics'],
    'M.Tech': ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics'],
    // Add more specializations for other courses as needed
  };

  const locationOptions = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'International'];
  
  const budgetOptions = ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', 'Above ₹5,00,000'];

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

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 6) { // Updated to 6 steps
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    // For now, we'll just redirect to login
    router.push('/login');
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / 5) * 100; // Updated to 5 segments for 6 steps

  return (
    <div>
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

      {/* Main Content - Step Form */}
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {/* Progress Bar */}
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-center mb-4">Find Your Perfect University</h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span className={currentStep >= 1 ? 'font-semibold text-blue-600' : ''}>Degree</span>
                <span className={currentStep >= 2 ? 'font-semibold text-blue-600' : ''}>Course</span>
                <span className={currentStep >= 3 ? 'font-semibold text-blue-600' : ''}>Qualification</span>
                <span className={currentStep >= 4 ? 'font-semibold text-blue-600' : ''}>Specialization</span>
                <span className={currentStep >= 5 ? 'font-semibold text-blue-600' : ''}>Location</span>
                <span className={currentStep >= 6 ? 'font-semibold text-blue-600' : ''}>Summary</span>
              </div>
            </div>

            {/* Form Steps */}
            <div className="p-6">
              {/* Step 1: Degree Selection */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4">Which degree are you interested in?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {degreeOptions.map((option) => (
                      <div 
                        key={option.id}
                        onClick={() => handleInputChange('degree', option.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.degree === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.degree === option.id ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.degree === option.id && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Course Selection */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4">Which course would you like to pursue?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseOptions[formData.degree]?.map((course) => (
                      <div 
                        key={course}
                        onClick={() => handleInputChange('course', course)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.course === course ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.course === course ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.course === course && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{course}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Highest Qualification and Percentage */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4">Your Highest Qualification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highestQualificationOptions.map((qualification) => (
                      <div 
                        key={qualification}
                        onClick={() => handleInputChange('highestQualification', qualification)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.highestQualification === qualification ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.highestQualification === qualification ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.highestQualification === qualification && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{qualification}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-4">Percentage Score in Last Qualification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {percentageScoreOptions.map((score) => (
                      <div 
                        key={score}
                        onClick={() => handleInputChange('percentageScore', score)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.percentageScore === score ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.percentageScore === score ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.percentageScore === score && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Specialization Selection */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4">Have a particular specialization in mind?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specializationOptions[formData.course]?.map((specialization) => (
                      <div 
                        key={specialization}
                        onClick={() => handleInputChange('specialization', specialization)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.specialization === specialization ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.specialization === specialization ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.specialization === specialization && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{specialization}</span>
                        </div>
                      </div>
                    ))}
                    <div 
                      onClick={() => handleInputChange('specialization', 'Not decided')}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.specialization === 'Not decided' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.specialization === 'Not decided' ? 'border-blue-500' : 'border-gray-300'}`}>
                          {formData.specialization === 'Not decided' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                        </div>
                        <span className="ml-3">Not decided yet</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Location Preference */}
              {currentStep === 5 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4">Preferred location for your studies?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {locationOptions.map((location) => (
                      <div 
                        key={location}
                        onClick={() => handleInputChange('location', location)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.location === location ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.location === location ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.location === location && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-4">What's your budget range?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgetOptions.map((budget) => (
                      <div 
                        key={budget}
                        onClick={() => handleInputChange('budget', budget)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.budget === budget ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.budget === budget ? 'border-blue-500' : 'border-gray-300'}`}>
                            {formData.budget === budget && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                          </div>
                          <span className="ml-3">{budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Summary */}
              {currentStep === 6 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4">Your University Preferences</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Degree:</span>
                        <span>{degreeOptions.find(d => d.id === formData.degree)?.label || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Course:</span>
                        <span>{formData.course || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Highest Qualification:</span>
                        <span>{formData.highestQualification || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Percentage Score:</span>
                        <span>{formData.percentageScore || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Specialization:</span>
                        <span>{formData.specialization || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{formData.location || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Budget:</span>
                        <span>{formData.budget || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-600 mb-4">By submitting, you'll be redirected to login to view university recommendations based on your preferences.</p>
                    <button 
                      onClick={handleSubmit}
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit and View Recommendations
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button 
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <FaChevronLeft className="mr-2" /> Previous
                  </button>
                )}
                {currentStep < 6 && ( // Updated to 6 steps
                  <button 
                    onClick={handleNextStep}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ml-auto ${!formData[Object.keys(formData)[currentStep-1]] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!formData[Object.keys(formData)[currentStep-1]]}
                  >
                    Next <FaChevronRight className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page