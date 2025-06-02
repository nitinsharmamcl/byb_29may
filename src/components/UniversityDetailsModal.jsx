import { useEffect, useRef, useState } from 'react';
import { FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UniversityDetailsModal({ university, onClose, countries = [], selectedDegreeType }) {
  const modalRef = useRef(null);
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch programs when the modal opens
  useEffect(() => {
    if (selectedDegreeType) {
      setLoading(true);
      // In a real implementation, you would fetch programs from your API
      // This is a mock implementation
      const start_api = process.env.NEXT_PUBLIC_API_URL || "";
      axios.get(`${start_api}/api/programs`)
        .then(res => {
          // Filter programs based on degree type
          // In a real implementation, you would have a proper filtering mechanism
          // This is just a simulation
          const allPrograms = res.data.programs || [];
          const filteredPrograms = allPrograms.filter(program => {
            if (selectedDegreeType === 'bachelor') {
              return program.name.toLowerCase().includes('bachelor') || 
                     program.description.toLowerCase().includes('bachelor') || 
                     program.name.toLowerCase().includes('undergraduate');
            } else if (selectedDegreeType === 'master') {
              return program.name.toLowerCase().includes('master') || 
                     program.description.toLowerCase().includes('master') || 
                     program.name.toLowerCase().includes('postgraduate');
            }
            return true;
          });
          setPrograms(filteredPrograms);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching programs:', error);
          setLoading(false);
        });
    }
  }, [selectedDegreeType]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.classList.add('active');
      }
    }, 10);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [onClose]);

  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove('active');
      modalRef.current.classList.add('closing');
      setTimeout(onClose, 300);
    }
  };

  if (!university) return null;

  // Helper to get country name by id
  const getCountryName = (id) => {
    const country = countries.find((c) => c.id === id);
    return country ? country.name : "Unknown Country";
  };

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-container">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
        <div className="modal-header">
          <div className="university-badge">
            {university.uni_image ? (
              <img src={university.uni_image} alt={university.name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <FaUniversity className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h2 className="modal-title">{university.name}</h2>
            {selectedDegreeType && (
              <div className="program-badge">
                {selectedDegreeType === 'bachelor' ? 'Bachelor Programs' : 'Master Programs'}
              </div>
            )}
          </div>
        </div>
        <div className="modal-content">
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">Location</div>
              <div className="detail-value flex items-center"><FaMapMarkerAlt className="mr-1" />{university.location}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Campus</div>
              <div className="detail-value flex items-center"><FaBuilding className="mr-1" />{university.campus}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Annual Fee</div>
              <div className="detail-value"><FaMoneyBillWave className="mr-1" />₹{university.annual_fees || university.fees}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">Country</div>
              <div className="detail-value">{getCountryName(university.university_country_id)}</div>
            </div>
          </div>
          
          {selectedDegreeType && (
            <>
              <div className="divider"></div>
              <div className="programs-section">
                <h3 className="description-title">
                  {selectedDegreeType === 'bachelor' ? 'Bachelor Programs' : 'Master Programs'}
                </h3>
                {loading ? (
                  <div className="loading-indicator">Loading programs...</div>
                ) : programs.length > 0 ? (
                  <div className="programs-grid">
                    {programs.map((program) => (
                      <div key={program.id} className="program-card">
                        <div className="program-icon">
                          <FaGraduationCap />
                        </div>
                        <div className="program-details">
                          <h4 className="program-name">{program.name}</h4>
                          <p className="program-description">{program.description}</p>
                          <button className="program-button">
                            <span>View Details</span>
                            <FaArrowRight className="arrow-icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-programs">
                    No {selectedDegreeType} programs available for this university.
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="divider"></div>
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">{university.description}</p>
          </div>
          <div className="action-buttons">
            <button onClick={() => router.push("/login")} className="action-button apply-button">Apply Now</button>
            {/* <button className="action-button save-button">Save University</button> */}
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-container {
          background-color: white;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transform: translateY(20px);
          opacity: 0;
          transition:
            transform 0.3s ease,
            opacity 0.3s ease;
          position: relative;
        }
        .modal-container.active {
          transform: translateY(0);
          opacity: 1;
        }
        .modal-container.closing {
          transform: translateY(20px);
          opacity: 0;
        }
        .close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a5568;
          z-index: 10;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
        }
        .close-button:hover {
          color: #2d3748;
          background-color: rgba(255, 255, 255, 1);
        }
        .modal-header {
          padding: 25px 30px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, #4a6baf 0%, #263c66 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }
        .university-badge {
          width: 60px;
          height: 60px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .modal-title {
          margin: 0 0 5px 0;
        }
        .program-badge {
          display: inline-block;
          background: rgba(251, 2, 0, 0.9);
          color: white;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .modal-content {
          padding: 2rem;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .detail-item {
          background: rgba(0, 51, 102, 0.03);
          padding: 1rem;
          border-radius: 8px;
          border-left: 3px solid #003366;
        }
        .detail-label {
          font-size: 0.875rem;
          color: #536B88;
          margin-bottom: 0.5rem;
        }
        .detail-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #003366;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(0, 51, 102, 0.2), transparent);
          margin: 1.5rem 0;
        }
        .description-section, .programs-section {
          margin-bottom: 2rem;
        }
        .description-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #003366;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }
        .description-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(to right, #FB0200, #003366);
          border-radius: 1.5px;
        }
        .description-text {
          color: #536B88;
          line-height: 1.6;
        }
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .program-card {
          display: flex;
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        .program-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e0;
        }
        .program-icon {
          font-size: 1.5rem;
          color: #003366;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .program-details {
          flex: 1;
        }
        .program-name {
          font-weight: 600;
          color: #003366;
          margin-bottom: 0.5rem;
        }
        .program-description {
          font-size: 0.875rem;
          color: #536B88;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .program-button {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #FB0200;
          font-weight: 500;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .program-button:hover {
          color: #003366;
        }
        .arrow-icon {
          margin-left: 0.5rem;
          font-size: 0.75rem;
          transition: transform 0.2s ease;
        }
        .program-button:hover .arrow-icon {
          transform: translateX(3px);
        }
        .loading-indicator, .no-programs {
          text-align: center;
          padding: 2rem;
          color: #536B88;
          font-style: italic;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .action-button {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .apply-button {
          background: linear-gradient(to right, #FB0200, #FF4444);
          color: white;
          box-shadow: 0 4px 12px rgba(251, 2, 0, 0.2);
        }
        .apply-button:hover {
          background: linear-gradient(to right, #E50200, #E53E3E);
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(251, 2, 0, 0.3);
        }
        .save-button {
          background: white;
          color: #003366;
          border: 2px solid #003366;
        }
        .save-button:hover {
          background: rgba(0, 51, 102, 0.05);
          transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .modal-header {
            padding: 1.5rem;
          }
          .modal-content {
            padding: 1.5rem;
          }
          .university-badge {
            width: 50px;
            height: 50px;
          }
          .modal-title {
            font-size: 1.5rem;
          }
          .action-buttons {
            flex-direction: column;
          }
          .programs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

UniversityDetailsModal.propTypes = {
  university: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  selectedDegreeType: PropTypes.string,
};