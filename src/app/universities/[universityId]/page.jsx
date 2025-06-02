'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation'; // Added useRouter
import axios from 'axios';
import { FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaGraduationCap, FaArrowRight, FaSpinner, FaInfoCircle, FaBookOpen, FaChevronLeft } from 'react-icons/fa'; // Added FaInfoCircle, FaBookOpen, FaChevronLeft
// import Header from '@/components/Header'; // Assuming you have a Header component
// import Footer from '@/components/Footer'; // Assuming you have a Footer component

const UniversityDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const { universityId } = params;
  const degreeType = searchParams.get('degreeType'); // Re-enable reading degreeType

  const [university, setUniversity] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  const start_api = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    axios.post(`${start_api}/api/countries/allcountries`)
      .then(res => setCountries(res.data || []))
      .catch(err => console.error("Error fetching countries:", err));
  }, [start_api]);

  useEffect(() => {
    // Fetch University Details (remains largely the same)
    if (universityId) {
      setLoading(true);
      setError(null);
      console.log('[Debug] Fetching university details for ID:', universityId);
      console.log('[Debug] Degree Type from URL for filtering:', degreeType);

      axios.post(`${start_api}/api/universities/getuniversitybyid`, { id: universityId })
        .then(res => {
          if (res.data && res.data.university) {
            setUniversity(res.data.university);
            console.log('[Debug] University data:', res.data.university);
          } else {
            setError('University not found.');
            console.warn('[Debug] University not found for ID:', universityId);
          }
        })
        .catch(err => {
          console.error('[Debug] Error fetching university details:', err);
          setError('Failed to load university details.');
        });
    }

    // Fetch and filter programs based on degreeType from URL
    setLoading(true); // Manage loading state for programs
    axios.get(`${start_api}/api/programs`)
      .then(res => {
        const allPrograms = res.data.programs || [];
        console.log('[Debug] All programs fetched (globally):', allPrograms.length > 0 ? { firstProgram: allPrograms[0], total: allPrograms.length } : { firstProgram: 'empty array', total: 0 });
        
        let relevantPrograms = []; // Initialize as empty

        if (degreeType) {
          console.log('[Debug] Filtering ALL programs by degreeType from URL:', degreeType);
          const targetDegreeType = degreeType.toLowerCase();

          relevantPrograms = allPrograms.filter(program => {
            // const nameLower = program.name ? program.name.toLowerCase() : '';
            // const descLower = program.description ? program.description.toLowerCase() : '';
            // // console.log(`[Debug] Checking program for degreeType: ID=${program.id}, Name='${nameLower}', Desc='${descLower}' for ${targetDegreeType}`); // Log can be verbose, keep if needed
            let matches = false;

            // if (targetDegreeType === 'bachelor') {
            //   matches = nameLower.includes('bachelor') || descLower.includes('bachelor') || nameLower.includes('undergraduate') || descLower.includes('undergraduate');
            // } else if (targetDegreeType === 'master') {
            //   matches = nameLower.includes('master') || descLower.includes('master') || nameLower.includes('postgraduate') || descLower.includes('postgraduate');
            // }


            if (targetDegreeType === 'bachelor') {
              matches =  program.name.toLowerCase().includes('bachelor') || 
                     program.description.toLowerCase().includes('bachelor') || 
                     program.name.toLowerCase().includes('undergraduate');
            } else if (targetDegreeType === 'master') {
              matches =  program.name.toLowerCase().includes('master') || 
                     program.description.toLowerCase().includes('master') || 
                     program.name.toLowerCase().includes('postgraduate');
            }
            // If targetDegreeType is something else, 'matches' remains false.
            // if(matches) console.log(`[Debug] Program ID=${program.id} MATCHED for ${targetDegreeType}`);
            // else console.log(`[Debug] Program ID=${program.id} DID NOT MATCH for ${targetDegreeType}`);
            return matches;
          });
          console.log(`[Debug] Programs after GLOBAL ${targetDegreeType} filter:`, relevantPrograms.length > 0 ? { firstProgram: relevantPrograms[0], total: relevantPrograms.length } : { firstProgram: 'empty array', total: 0 });
        } else {
          console.log('[Debug] No degreeType in URL. As per new logic, no programs will be shown unless degreeType is specified for filtering.');
          // relevantPrograms remains empty as initialized, so no programs are shown if degreeType is missing.
        }
        setPrograms(relevantPrograms);
        console.log('[Debug] Final relevant programs for display (globally filtered by degreeType if present):', relevantPrograms.length > 0 ? { firstProgram: relevantPrograms[0], total: relevantPrograms.length } : { firstProgram: 'empty array', total: 0 });
      })
      .catch(err => {
        console.error('[Debug] Error fetching programs:', err);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after both university and programs are attempted
      });

  }, [universityId, degreeType, start_api]); // Add degreeType back to dependency array

  const getCountryName = (id) => {
    const country = countries.find((c) => c.id === id);
    return country ? country.name : "Unknown Country";
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-navy mb-4" />
        <p className="text-xl text-gray-700">Loading University Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center px-4">
        <FaInfoCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-2xl text-red-600 font-semibold mb-2">{error}</p>
        <p className="text-gray-600 mb-6">We couldn't fetch the details for this university. Please try again later.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center">
          <FaChevronLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center px-4">
        <FaUniversity className="text-6xl text-gray-400 mb-4" />
        <p className="text-2xl text-gray-700 font-semibold mb-2">University Not Found</p>
        <p className="text-gray-600 mb-6">The university you are looking for does not exist or the link is incorrect.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center">
          <FaChevronLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* <Header /> */}
      <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-24">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-navy hover:text-red-600 transition-colors group text-sm font-medium"
          >
            <FaChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Universities
          </button>

          {/* University Header Card - Lighter Theme */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-10">
            <div 
              className="h-48 sm:h-64 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${university.uni_image || '/images/bg.png'})` }} // Keep image, maybe lighten overlay if needed
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6 sm:p-8"> {/* Slightly lighter overlay */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white shadow-sm">{university.name}</h1>
                  {degreeType && (
                    <span className="mt-2 inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md"> {/* Changed from red to blue for a lighter feel */}
                      {degreeType.charAt(0).toUpperCase() + degreeType.slice(1)} Programs
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Details Grid - Lighter Theme */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-gray-200">
              {[ 
                { icon: FaMapMarkerAlt, label: "Location", value: university.location },
                { icon: FaBuilding, label: "Campus", value: university.campus },
                { icon: FaMoneyBillWave, label: "Annual Fee", value: `₹${university.annual_fees || university.fees}` },
                { icon: FaUniversity, label: "Country", value: getCountryName(university.university_country_id) }
              ].map(detail => (
                <div key={detail.label} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <detail.icon className="h-6 w-6 text-blue-700 mt-1 flex-shrink-0" /> {/* Blue icon color */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{detail.label}</h3>
                    <p className="text-md font-medium text-gray-800">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description Section - Lighter Theme */}
          {university.description && (
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-10">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="h-7 w-7 text-blue-700 mr-3" /> {/* Blue icon color */}
                <h2 className="text-2xl font-semibold text-gray-800">About {university.name}</h2>
              </div>
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line"> {/* prose-blue for lighter accents */}
                {university.description}
              </div>
            </div>
          )}

          {/* Programs Section - Lighter Theme */}
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <FaBookOpen className="h-7 w-7 text-blue-700 mr-3" /> {/* Blue icon color */}
              <h2 className="text-2xl font-semibold text-gray-800">
                {degreeType ? `${degreeType.charAt(0).toUpperCase() + degreeType.slice(1)} Programs (All Universities)` : 'Programs (Specify Degree Type in URL to Filter)'}
              </h2>
            </div>
            {programs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programs.map((program) => (
                    <div 
                      key={program.id} 
                      className="bg-slate-50 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center mb-3">
                          <FaGraduationCap className="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" /> {/* Blue icon color */}
                          <h3 className="text-lg font-semibold text-gray-800 leading-tight">{program.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{program.description}</p>
                      </div>
                      <button 
                      onClick={() => router.push("/login")}
                        className="mt-auto w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 group" // Blue button
                      >
                        Apply Now <FaArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-10">
                    <FaInfoCircle className="text-4xl text-gray-400 mb-3 mx-auto" />
                    <p className="text-gray-600 text-lg">
                        {degreeType 
                            ? `No ${degreeType.charAt(0).toUpperCase() + degreeType.slice(1)} programs found across all universities.` 
                            : 'Please specify a degree type (e.g., ?degreeType=bachelor) in the URL to see programs.'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Make sure the degree type is spelled correctly.</p>
                 </div>
              )}
            </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default UniversityDetailPage;