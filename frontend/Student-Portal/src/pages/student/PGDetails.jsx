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
  MdFlashOn, MdHotel, MdFlag, MdCheck, MdAcUnit, MdFitnessCenter, MdLocalLaundryService
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

  const handleReviewSubmit = (data) => {
    toast.success('Review submitted successfully!');
    setShowReview(false);
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
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        <MdArrowBack /> Back to Search
      </button>

      {/* Hero Image Area */}
      <div className="pg-details-hero" style={{ background: 'var(--bg)', borderRadius: '24px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        {pg.images && pg.images.length > 0 ? (
          <img src={pg.images[0]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '72px', opacity: 0.3 }}>🏠</span>
        )}
        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
          {pg.verified && <span className="badge badge-verified" style={{ background: 'white', color: 'var(--verified-color)' }}><MdVerified size={11} /> Verified PG</span>}
          <span className="badge badge-grey" style={{ background: 'rgba(255,255,255,0.9)' }}>{pg.type}</span>
        </div>
        <button style={{ position: 'absolute', top: '16px', right: '16px', width: 44, height: 44, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '20px' }}
          onClick={() => setIsFav(!isFav)}>
          {isFav ? <MdFavorite color="var(--primary)" /> : <MdFavoriteBorder />}
        </button>
      </div>

      <div className="pg-details-content-container" style={{ width: '100%' }}>
        
        {/* Main Info Row */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'stretch' }}>
          
          {/* PG Content Column */}
          <div style={{ flex: '2 1 650px', background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '10px', color: '#1A1A1A' }}>{pg.name}</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '17px' }}>
                  <MdLocationOn size={22} color="var(--primary)" />{pg.location}, {pg.city}
                </div>
                {pg.roomOptions && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '16px' }}>
                    <MdHotel size={22} color="#666" />{pg.roomOptions}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fffbeb', padding: '12px 20px', borderRadius: '14px' }}>
                <MdStar color="#f59e0b" size={22} /> <span style={{ fontWeight: 800, fontSize: '18px' }}>{pg.rating || 0}</span>
                <span style={{ color: 'var(--text-light)', fontSize: '15px' }}>({pg.reviewCount || 0} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff7ed', padding: '12px 20px', borderRadius: '14px' }}>
                <MdRestaurant color="#ea580c" size={22} /> <span style={{ fontWeight: 800, fontSize: '18px' }}>Mess {pg.messRating || 0}</span>
              </div>
            </div>

            <div className="divider" style={{ margin: '28px 0', height: '1px', background: '#f0f0f0' }}></div>
            
            <h4 style={{ fontWeight: 800, fontSize: '15px', color: '#999', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '16px' }}>Property Overview</h4>
            <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.9 }}>{pg.description}</p>
          </div>

          {/* Sidebar Card */}
          <div style={{ flex: '1 1 380px' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '0', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.04)', position: 'sticky', top: '80px' }}>
              
              <div style={{ padding: '32px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{ fontSize: '14px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Base Rent Starts From</div>
                  <div style={{ fontSize: '44px', fontWeight: 950, color: 'var(--primary)', lineHeight: 1 }}>₹{pg.rent?.toLocaleString() || '0'}</div>
                  <div style={{ fontSize: '15px', color: 'var(--verified-color)', fontWeight: 700, marginTop: '10px' }}>Deposit: ₹{pg.deposit?.toLocaleString() || '0'}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9f9f9', padding: '18px', borderRadius: '18px' }}>
                  <div className="avatar avatar-md" style={{ width: '52px', height: '52px' }}>{pg.partnerName?.charAt(0) || 'P'}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '17px', color: '#1A1A1A' }}>{pg.partnerName || 'Verified Partner'}</div>
                    <div style={{ fontSize: '13px', color: 'var(--verified-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MdVerified size={15} /> Verified Owner
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" style={{ flex: 2, padding: '18px', borderRadius: '14px', fontSize: '16px', fontWeight: 800 }} 
                    onClick={() => hasActiveBooking ? toast.error('Active booking exists') : setShowBookingModal(true)}>
                    <MdFlashOn /> BOOK NOW
                  </button>
                  <a href={`tel:${pg.phone}`} className="btn btn-outline" style={{ flex: 1.2, padding: '18px', borderRadius: '14px' }}>
                    <MdPhone /> CALL
                  </a>
                </div>
                <button className="btn" style={{ width: '100%', padding: '14px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2', borderRadius: '14px', fontWeight: 700 }} onClick={() => setShowComplaint(true)}>
                  <MdFlag size={18} /> REPORT LISTING
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs area */}
        <div className="tabs" style={{ marginBottom: '24px' }}>
          {['overview', 'amenities', 'reviews'].map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        <div style={{ marginBottom: '60px' }}>
          {activeTab === 'overview' && (
            <div className="grid-2" style={{ gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 900, marginBottom: '24px', fontSize: '20px' }}>🍽️ Mess & Food</h3>
                <RatingBar label="Food Variety" value={pg.messRating - 0.1} color="#f59e0b" />
                <RatingBar label="Hygiene" value={pg.messRating + 0.1} color="var(--verified-color)" />
                <RatingBar label="Timings" value={pg.messRating - 0.2} color="var(--info)" />
              </div>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 900, marginBottom: '24px', fontSize: '20px' }}>Property Stats</h3>
                <RatingBar label="Cleanliness" value={4.0} color="var(--verified-color)" />
                <RatingBar label="Security" value={4.2} color="var(--info)" />
                <RatingBar label="Value for Money" value={3.8} color="#f59e0b" />
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 900, marginBottom: '24px', fontSize: '20px' }}>Amenities</h3>
              <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '18px' }}>
                {pg.amenities.map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px', background: 'var(--bg)', borderRadius: '16px' }}>
                    <MdCheckCircle color="var(--verified-color)" size={20} />
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- BOOKING MODAL (With Dynamic Rent) --- */}
      {showBookingModal && (
        <div className="modal-overlay" style={{ zIndex: 2000, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal" style={{ maxWidth: '500px', width: '100%', borderRadius: '28px', padding: '0', overflowY: 'auto', maxHeight: '95vh', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '32px', color: 'white', position: 'relative' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Price Calculator</h2>
              <p style={{ opacity: 0.9, fontSize: '15px' }}>Rent adjusts as you select facilities</p>
              <button onClick={() => setShowBookingModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ padding: '32px' }}>
              {/* Room Occupancy */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>Room Occupancy</label>
                <div style={{ display: 'flex', gap: '10px' }}>
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

              {/* AC Preference */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>AC Preference (+₹1,500)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <OptionCard icon={MdAcUnit} label="AC Room" active={bookingOptions.ac} onClick={() => setBookingOptions(prev => ({ ...prev, ac: true }))} />
                  <OptionCard icon={MdAcUnit} label="Non-AC" active={!bookingOptions.ac} onClick={() => setBookingOptions(prev => ({ ...prev, ac: false }))} />
                </div>
              </div>

              {/* Food Preference */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>Food Facility (-₹1,000 if No)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <OptionCard icon={MdRestaurant} label="Included" active={bookingOptions.food} onClick={() => setBookingOptions(prev => ({ ...prev, food: true }))} />
                  <OptionCard icon={MdRestaurant} label="No Food" active={!bookingOptions.food} onClick={() => setBookingOptions(prev => ({ ...prev, food: false }))} />
                </div>
              </div>

              {/* Extra Facilities */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>Add-ons (+₹500 each)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <OptionCard icon={MdFitnessCenter} label="Gym" active={bookingOptions.gym} onClick={() => setBookingOptions(prev => ({ ...prev, gym: !bookingOptions.gym }))} />
                  <OptionCard icon={MdLocalLaundryService} label="Laundry" active={bookingOptions.laundry} onClick={() => setBookingOptions(prev => ({ ...prev, laundry: !bookingOptions.laundry }))} />
                </div>
              </div>

              {/* FINAL CALCULATION BOX */}
              <div style={{ background: '#f5f5f5', padding: '24px', borderRadius: '24px', border: '1px solid #eee', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#666', fontSize: '15px', fontWeight: 600 }}>Total Estimated Rent</span>
                  <span style={{ fontWeight: 950, fontSize: '28px', color: 'var(--primary)' }}>₹{calculatedRent.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}>Per Month (Exclusive of Deposit)</div>
              </div>

              <button className="btn btn-primary w-full" style={{ padding: '20px', borderRadius: '18px', fontSize: '17px', fontWeight: 900, background: 'var(--primary-gradient)', border: 'none', boxShadow: '0 8px 20px rgba(238,46,36,0.3)' }}
                onClick={handleBookNow} disabled={isBooking}>
                {isBooking ? 'Processing...' : 'Confirm & Request Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReview && <ReviewModal pgName={pg.name} pgId={pg.id} onClose={() => setShowReview(false)} onSubmit={handleReviewSubmit} />}
    </StudentLayout>
  );
};

export default PGDetails;
