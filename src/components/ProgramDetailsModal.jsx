import { useEffect, useRef } from 'react';

export default function ProgramDetailsModal({ program, onClose, courseName, trades, loadingTrades }) {
  const modalRef = useRef(null);

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

  if (!program) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-container">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{program.name}</h2>
            {/* <div className="program-badge">Course: {courseName}</div> */}
          </div>
        </div>
        <div className="modal-content">
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <p className="description-text">{program.description}</p>
          </div>
          <div className="divider"></div>
          <div className="trades-section">
            <h3 className="description-title">Trades</h3>
            {loadingTrades ? (
              <div className="text-gray-500 py-4">Loading trades...</div>
            ) : (
              trades && trades.length > 0 ? (
                <ul className="list-disc pl-6">
                  {trades.map(trade => (
                    <li key={trade.id} className="py-1 text-navy font-medium">{trade.name}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 py-4">No trades available for this program.</div>
              )
            )}
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
          max-width: 600px;
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
        .description-section {
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
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(0, 51, 102, 0.2), transparent);
          margin: 1.5rem 0;
        }
        .trades-section {
          margin-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .modal-header {
            padding: 1.5rem;
          }
          .modal-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
} 