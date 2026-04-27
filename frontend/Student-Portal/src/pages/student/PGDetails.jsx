import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import ReviewModal from '../../components/common/ReviewModal';
import { MOCK_PGS, MOCK_REVIEWS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdLocationOn, MdVerified, MdStar, MdRestaurant, MdWifi, MdFavorite, MdFavoriteBorder,
  MdPhone, MdReport, MdRateReview, MdArrowBack, MdCheckCircle, MdOutlineBedroomParent,
  MdFlashOn, MdHotel, MdFlag, MdCheck, MdAcUnit, MdFitnessCenter, MdLocalLaundryService,
  MdChevronLeft, MdChevronRight, MdClose
} from 'react-icons/md';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const RatingBar = ({ label, value, color = 'var(--primary)' }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
      <span style={{ color: 'var(--text-medium)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{(value || 0).toFixed(1)}</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${((value || 0) / 5) * 100}%`, background: color }} />
    </div>
  </div>
);

const OptionCard = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      flex: 1,
      padding: '14px', 
      borderRadius: '14px', 
      border: `2px solid ${active ? 'var(--primary)' : '#f0f0f0'}`,
      background: active ? '#FEF2F2' : 'white',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    <Icon size={20} color={active ? 'var(--primary)' : '#999'} />
    <span style={{ fontWeight: 700, fontSize: '13px', color: active ? 'var(--primary)' : '#666' }}>{label}</span>
  </div>
);

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReview, setShowReview] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(null);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const docRef = doc(db, 'hostels', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPg({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching PG:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [id]);
  
  const [complaint, setComplaint] = useState({ category: '', text: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  
  // Extended Booking Options
  const [bookingOptions, setBookingOptions] = useState({
    roomType: 'Triple', // Default fallback
    food: true,
    ac: false,
    gym: false,
    laundry: false
  });

  // Update roomType when PG is loaded
  useEffect(() => {
    if (pg?.roomOptions) {
      setBookingOptions(prev => ({ ...prev, roomType: pg.roomOptions.split(' / ')[0] }));
    }
  }, [pg]);

  // DYNAMIC RENT CALCULATION
  const calculatedRent = useMemo(() => {
    if (!pg) return 0;
    let total = pg.rent || 0; // Base Rent

    // Room Type Adjustments
    if (bookingOptions.roomType === 'Single') total += 2000;
    if (bookingOptions.roomType === 'Double') total += 1000;
    
    // AC Adjustment
    if (bookingOptions.ac) total += 1500;
    
    // Food Adjustment (Subtract if opted out)
    if (!bookingOptions.food) total -= 1000;
    
    // Extra Facilities
    if (bookingOptions.gym) total += 500;
    if (bookingOptions.laundry) total += 500;

    return total;
  }, [bookingOptions, pg?.rent]);

  React.useEffect(() => {
    const checkActiveBooking = async () => {
      if (!userData?.uid) return;
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userData.uid),
        where('status', 'in', ['pending', 'confirmed', 'checked-in'])
      );
      const snap = await getDocs(q);
      setHasActiveBooking(!snap.empty);
    };
    checkActiveBooking();
  }, [userData]);

  const handleBookNow = async () => {
    if (!userData) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    setIsBooking(true);
    try {
      const moveInDate = new Date();
      moveInDate.setDate(moveInDate.getDate() + 7);

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);

      await addDoc(collection(db, 'bookings'), {
        userId: userData.uid,
        hostelId: pg.id,
        hostelName: pg.name,
        location: pg.location,
        rent: calculatedRent, // Save the calculated rent
        baseRent: pg.rent,
        roomType: bookingOptions.roomType,
        foodAvailable: bookingOptions.food,
        ac: bookingOptions.ac,
        gym: bookingOptions.gym,
        laundry: bookingOptions.laundry,
        status: 'pending',
        paymentStatus: 'pending',
        moveInDate: moveInDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        nextDueDate: nextMonth.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: serverTimestamp(),
        hostelImage: pg.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
      });

      toast.success('Booking Request Sent!');
      setShowBookingModal(false);
      navigate('/student/dashboard');
    } catch (error) {
      console.error("Booking error:", error);
      toast.error('Failed to process booking');
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async (data) => {
    if (!userData) return;
    try {
      await addDoc(collection(db, 'reviews'), {
        pgId: id,
        userId: userData.uid,
        userName: userData.name || 'Anonymous',
        userImage: userData.photoURL || '',
        overallRating: data.overallRating,
        messRating: data.messRating,
        cleanlinessRating: data.cleanlinessRating,
        securityRating: data.securityRating,
        text: data.text,
        createdAt: serverTimestamp(),
      });
      toast.success('Review submitted successfully!');
      setShowReview(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error('Failed to submit review');
    }
  };

  const handleComplaint = () => {
    if (!complaint.text.trim()) { toast.error('Please describe the issue'); return; }
    toast.success('Complaint submitted!');
    setShowComplaint(false);
    setComplaint({ category: '', text: '' });
  };

  if (loading) return (
    <StudentLayout title="Loading...">
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#666' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏠</div>
        <p>Loading property details...</p>
      </div>
    </StudentLayout>
  );

  if (!pg) return (
    <StudentLayout title="Not Found">
      <div className="empty-state">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h3>PG Not Found</h3>
        <p>The property you are looking for doesn't exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/student/search-results')}>Back to Search</button>
      </div>
    </StudentLayout>
  );

  return (
    <StudentLayout title={pg.name}>
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '100px' }}>
        
        {/* Hero Image with Back Button */}
        <div style={{ position: 'relative', height: '300px', margin: '-16px -16px 0', overflow: 'hidden' }}>
          <img 
            src={pg.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <button 
            onClick={() => navigate(-1)}
            style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <MdArrowBack size={24} color="#333" />
          </button>
          <button 
            onClick={() => setIsFav(!isFav)}
            style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {isFav ? <MdFavorite size={24} color="var(--primary)" /> : <MdFavoriteBorder size={24} color="#333" />}
          </button>
        </div>

        {/* Floating Info Card */}
        <div className="app-card" style={{ marginTop: '-40px', position: 'relative', zIndex: 2, padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="pg-name-app" style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#1a1a1a' }}>{pg.name}</h1>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MdLocationOn color="var(--primary)" /> {pg.location}, {pg.city}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <MdStar color="#f59e0b" size={18} />
                <span style={{ fontSize: '16px', fontWeight: 800 }}>{pg.rating || (4.0 + (pg.id?.charCodeAt(0) % 10) / 10).toFixed(1)}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#aaa' }}>({pg.reviewsCount || (pg.id?.charCodeAt(1) % 200) + 50})</span>
            </div>
          </div>
        </div>

        {/* Photos Gallery */}
        <div className="section-header" style={{ marginTop: '24px' }}>
          <h3 className="section-title-app">Photos</h3>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
          {(pg.images || []).map((img, i) => (
            <div 
              key={i} 
              onClick={() => setPhotoIndex(i)}
              style={{ minWidth: '140px', height: '100px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}
            >
              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="section-header" style={{ marginTop: '24px' }}>
          <h3 className="section-title-app">Description</h3>
        </div>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: 0 }}>
          {pg.description || "A premium living space designed for students. Includes all modern amenities, 24/7 security, and high-speed internet. Located in a safe and accessible neighborhood near top colleges."}
        </p>

        {/* Facilities */}
        <div className="section-header" style={{ marginTop: '24px' }}>
          <h3 className="section-title-app">Facilities</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { icon: <MdWifi />, label: 'Wifi' },
            { icon: <MdRestaurant />, label: 'Food' },
            { icon: <MdLocalLaundryService />, label: 'Laundry' },
            { icon: <MdFitnessCenter />, label: 'Gym' },
            { icon: <MdAcUnit />, label: 'AC' },
            { icon: <MdFlashOn />, label: 'Power' },
            { icon: <MdCheckCircle />, label: 'Security' },
            { icon: <MdOutlineBedroomParent />, label: 'Beds' }
          ].map((item, i) => (
            <div key={i} className="action-item">
              <div className="action-icon" style={{ 
                width: '45px', height: '45px', fontSize: '18px', 
                background: '#f8f9fa', color: '#1a1a1a', border: 'none' 
              }}>
                {item.icon}
              </div>
              <span className="action-label" style={{ fontSize: '10px' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Resident Scores */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3 className="section-title-app">Detailed Ratings</h3>
        </div>
        <div className="app-card" style={{ padding: '24px', border: '1px solid #f2f2f2' }}>
          <RatingBar label="Food Quality" value={pg.foodRating || (3.5 + (pg.id?.charCodeAt(2) % 15) / 10)} color="#F59E0B" />
          <RatingBar label="Cleanliness" value={pg.cleanRating || (4.0 + (pg.id?.charCodeAt(3) % 10) / 10)} color="#10B981" />
          <RatingBar label="Safety & Security" value={pg.safetyRating || (4.5 + (pg.id?.charCodeAt(4) % 5) / 10)} color="#3B82F6" />
        </div>

        {/* Reviews Section */}
        <div className="section-header" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-title-app">Reviews & Ratings</h3>
          <button 
            onClick={() => setShowReview(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '13px' }}
          >
            Write Review
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(MOCK_REVIEWS || []).slice(0, 3).map((review, i) => (
            <div key={i} className="app-card" style={{ padding: '16px', border: '1px solid #f2f2f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                    {review.user?.[0] || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{review.user || 'Student User'}</div>
                    <div style={{ fontSize: '10px', color: '#aaa' }}>{review.date || '2 days ago'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#FFF7ED', padding: '4px 8px', borderRadius: '8px' }}>
                  <MdStar color="#f59e0b" size={14} />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#c2410c' }}>{review.rating}</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>{review.comment}</p>
            </div>
          ))}
          <button style={{ padding: '12px', background: '#f8f9fa', border: '1px solid #eee', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#666', marginTop: '8px' }}>
            View All Reviews
          </button>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky-bottom-bar">
          <div>
            <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Rent</div>
            <div style={{ fontSize: '20px', fontWeight: 950, color: '#1a1a1a' }}>
              ₹{calculatedRent.toLocaleString()} <span style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>/m</span>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ padding: '14px 40px', borderRadius: '16px', fontWeight: 800, fontSize: '15px', boxShadow: '0 8px 20px rgba(238,46,36,0.2)' }}
            onClick={() => setShowBookingModal(true)}
            disabled={hasActiveBooking}
          >
            {hasActiveBooking ? 'Already Booked' : 'Book Now'}
          </button>
        </div>

        {/* Booking Modal (Re-using the new style) */}
        {showBookingModal && (
          <div className="modal-overlay" style={{ zIndex: 2000, padding: 0, alignItems: 'flex-end' }}>
            <div className="modal animate-slideUp" style={{ maxWidth: '600px', width: '100%', borderRadius: '32px 32px 0 0', padding: 0, overflowY: 'auto', maxHeight: '90vh' }}>
              <div style={{ background: 'var(--primary-gradient)', padding: '32px', color: 'white', position: 'relative' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Select Facilities</h2>
                <p style={{ opacity: 0.9, fontSize: '14px' }}>Customize your stay at {pg.name}</p>
                <button onClick={() => setShowBookingModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>✕</button>
              </div>
              
              <div style={{ padding: '24px' }}>
                {/* Room Occupancy */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="section-title-app" style={{ fontSize: '14px', color: '#999', textTransform: 'uppercase' }}>Room Type</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    {pg.roomOptions?.split(' / ').map(option => (
                      <OptionCard 
                        key={option}
                        icon={MdHotel}
                        label={option}
                        active={bookingOptions.roomType === option}
                        onClick={() => setBookingOptions(prev => ({ ...prev, roomType: option }))}
                      />
                    ))}
                  </div>
                </div>

                {/* Facilities Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                  <OptionCard icon={MdAcUnit} label="AC Room" active={bookingOptions.ac} onClick={() => setBookingOptions(prev => ({ ...prev, ac: !bookingOptions.ac }))} />
                  <OptionCard icon={MdRestaurant} label="Include Food" active={bookingOptions.food} onClick={() => setBookingOptions(prev => ({ ...prev, food: !bookingOptions.food }))} />
                  <OptionCard icon={MdFitnessCenter} label="Gym Access" active={bookingOptions.gym} onClick={() => setBookingOptions(prev => ({ ...prev, gym: !bookingOptions.gym }))} />
                  <OptionCard icon={MdLocalLaundryService} label="Laundry" active={bookingOptions.laundry} onClick={() => setBookingOptions(prev => ({ ...prev, laundry: !bookingOptions.laundry }))} />
                </div>

                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#666' }}>Final Rent</span>
                    <span style={{ fontSize: '24px', fontWeight: 950, color: 'var(--primary)' }}>₹{calculatedRent.toLocaleString()}</span>
                  </div>
                </div>

                <button className="btn btn-primary w-full" style={{ padding: '18px', borderRadius: '16px', fontSize: '17px', fontWeight: 900 }}
                  onClick={handleBookNow} disabled={isBooking}>
                  {isBooking ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Modal */}
        {showReview && (
          <ReviewModal 
            pgName={pg.name}
            pgId={pg.id}
            onClose={() => setShowReview(false)}
            onSubmit={handleReviewSubmit}
          />
        )}

        {/* Lightbox / Photo Popup */}
        {photoIndex !== null && (
          <div 
            className="modal-overlay" 
            style={{ background: 'rgba(0,0,0,0.95)', zIndex: 3000, padding: 0 }} 
            onClick={() => setPhotoIndex(null)}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setPhotoIndex(null); }}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3001 }}
            >
              <MdClose size={24} />
            </button>

            {/* Navigation Buttons */}
            <button 
              onClick={(e) => { e.stopPropagation(); setPhotoIndex((photoIndex - 1 + pg.images.length) % pg.images.length); }}
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3001 }}
            >
              <MdChevronLeft size={32} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); setPhotoIndex((photoIndex + 1) % pg.images.length); }}
              style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', width: '50px', height: '50px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3001 }}
            >
              <MdChevronRight size={32} />
            </button>

            {/* Main Image */}
            <div 
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={pg.images[photoIndex]} 
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
                alt="Hostel"
              />
              <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>
                {photoIndex + 1} / {pg.images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default PGDetails;
