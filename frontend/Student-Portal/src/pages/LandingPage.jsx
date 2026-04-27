import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdLocationOn, MdStar, MdRestaurant, MdVerified, MdSearch, MdMyLocation,
  MdFeedback, MdFavorite, MdArrowForward, MdMenu, MdClose, MdDashboard, MdPerson, MdLogout, MdNotifications
} from 'react-icons/md';
import { MOCK_PGS } from '../data/mockData';
import Logo from '../components/common/Logo';
import UserActions from '../components/layout/UserActions';
import StudentSidebar from '../components/layout/StudentSidebar';
import toast from 'react-hot-toast';

import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';

const LandingPage = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [topPGs, setTopPGs] = useState([]);

  React.useEffect(() => {
    // Fetch Top Rated PGs (verified or high rating)
    const q = query(collection(db, 'hostels'), limit(6));
    const unsubscribe = onSnapshot(q, (snap) => {
      const pgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopPGs(pgs.slice(0, 3));
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/student/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleCitySearch = (city) => {
    navigate(`/student/search-results?q=${encodeURIComponent(city)}`);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          
          // Try to get a specific neighborhood or suburb, fallback to city, then display name
          const addr = data.address;
          const locationName = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.city || addr.town || addr.village || data.display_name.split(',')[0] || "Current Location";
          
          setSearchQuery(locationName);
          toast.success(`Location: ${locationName}`);
          
          // Navigate with lat/lng, 5km radius, and the detected location name
          setTimeout(() => {
            navigate(`/student/search-results?lat=${latitude}&lng=${longitude}&radius=5&q=${encodeURIComponent(locationName)}`);
          }, 500);
        } catch (error) {
          console.error("Error detecting address:", error);
          setSearchQuery("Current Location");
          navigate(`/student/search-results?lat=${latitude}&lng=${longitude}&radius=5`);
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        toast.error("Unable to retrieve location");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const features = [
    { icon: <MdRestaurant />, title: 'Mess Quality Score', desc: 'Our unique food rating system aggregates real student reviews to give you an honest mess score.' },
    { icon: <MdStar />, title: 'Verified Reviews', desc: 'Only current or past residents can review. No fake ratings. Transparent, honest, and trustworthy.' },
    { icon: <MdVerified />, title: 'Verified PG Badge', desc: 'PGs that meet our quality standards get a Verified badge — safer and better living conditions.' },
    { icon: <MdSearch />, title: 'Smart Filters', desc: 'Filter by price, location, type, amenities, and mess rating to find your perfect match.' },
    { icon: <MdFeedback />, title: 'Complaint System', desc: 'Raise complaints directly through the platform. Track resolution status and keep owners accountable.' },
    { icon: <MdFavorite />, title: 'Save Favorites', desc: 'Shortlist PGs you love and compare them side by side before making the final decision.' },
  ];

  return (
    <div className="landing-container" style={{ background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', paddingTop: '60px' }}>
      
      {/* ── Navbar ── */}
      <nav className="landing-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 1000 }}>
        <div className="nav-left" style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
          <button 
            className="btn btn-ghost btn-icon mobile-only" 
            onClick={() => setIsMenuOpen(true)}
            style={{ 
              padding: 0, 
              minWidth: '40px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#333'
            }}
          >
            <MdMenu size={24} />
          </button>
          <Logo />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <><Link to={`/${userRole}`} className="pc-only" style={{ background: 'var(--primary-gradient)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', boxShadow: '0 4px 10px rgba(230, 0, 0, 0.2)', marginRight: '4px' }}>Dashboard</Link><UserActions /></>
          ) : (
            <div className="pc-only" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/login" style={{ fontWeight: 600, color: '#333', fontSize: '13px', textDecoration: 'none', padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee' }}>Login</Link>
              <Link to="/register" style={{ background: 'var(--primary-gradient)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', boxShadow: '0 4px 10px rgba(230, 0, 0, 0.2)', marginLeft: '12px' }}>Join Now</Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── Dashboard Sidebar (Unified UI) ── */}
      <StudentSidebar sidebarOpen={isMenuOpen} setSidebarOpen={setIsMenuOpen} />
      
      {/* Mobile Backdrop for Sidebar */}
      {isMenuOpen && (
        <div 
          className="modal-overlay pc-only-hidden" 
          onClick={() => setIsMenuOpen(false)}
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 999,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}

      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: '80px 24px 0', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 className="landing-title" style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 950, color: '#1a1a1a', lineHeight: 1.2, marginBottom: '24px', letterSpacing: '-1px' }}>
            Find Your Perfect <br className="mobile-only" />
            <span style={{ color: '#1a1a1a' }}>PG/Hostel</span> <br className="pc-only" />
            <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', paddingBottom: '8px' }}>Near Your College</span>
          </h1>
          <p className="landing-desc" style={{ fontSize: '18px', color: '#666', marginBottom: '40px', maxWidth: '750px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Browse verified listings, read honest student reviews, and book your stay with a single click. No hidden fees, just pure transparency.
          </p>

          <form onSubmit={handleSearch} className="landing-search-bar" style={{ background: 'white', borderRadius: '50px', padding: '8px 8px 8px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', maxWidth: '700px', margin: '0 auto 32px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <MdLocationOn size={26} color="var(--primary)" />
              <input style={{ flex: 1, border: 'none', padding: '12px 12px', fontSize: '16px', outline: 'none', width: '100%', fontWeight: 500 }} placeholder={isDetecting ? "Detecting..." : "Search city, location or college..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="button" onClick={detectLocation} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', color: isDetecting ? 'var(--primary)' : '#999' }}><MdMyLocation size={22} /></button>
            </div>
            <button type="submit" className="landing-search-btn" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '40px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 18px rgba(238,46,36,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdSearch size={22} /> <span className="pc-only">Search</span>
            </button>
          </form>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
            {['Lucknow', 'Delhi', 'Bangalore', 'Mumbai', 'Pune'].map(city => (
              <button key={city} onClick={() => handleCitySearch(city)} style={{ background: 'white', border: '1px solid #eee', padding: '10px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: 600, color: '#555', cursor: 'pointer' }}>{city}</button>
            ))}
          </div>
        </div>

        <div className="stats-bar" style={{ background: 'var(--primary-gradient)', padding: '60px 24px', color: 'white' }}>
          <div className="stats-bar-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', justifyContent: 'center', textAlign: 'center', gap: '40px' }}>
            <div><div style={{ fontSize: '36px', fontWeight: 950 }}>1,200+</div><div style={{ fontSize: '15px', opacity: 0.9 }}>Hostels</div></div>
            <div><div style={{ fontSize: '36px', fontWeight: 950 }}>15,000+</div><div style={{ fontSize: '15px', opacity: 0.9 }}>Students</div></div>
            <div><div style={{ fontSize: '36px', fontWeight: 950 }}>45,000+</div><div style={{ fontSize: '15px', opacity: 0.9 }}>Reviews</div></div>
            <div><div style={{ fontSize: '36px', fontWeight: 950 }}>320+</div><div style={{ fontSize: '15px', opacity: 0.9 }}>Verified</div></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="lp-section" style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title-sm" style={{ fontSize: '36px', fontWeight: 900, color: '#1a1a1a', marginBottom: '12px' }}>Why Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>?</h2>
            <p className="section-subtitle-sm" style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>We put transparency at the center — every review, every mess score is real.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ padding: '32px', borderRadius: '24px', background: '#fff5f5', border: '1px solid #fee2e2' }}>
                <div className="icon" style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top PGs */}
      <section className="lp-section" style={{ padding: '100px 24px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 className="section-title-sm" style={{ fontSize: '32px', fontWeight: 900, color: '#1a1a1a', marginBottom: '4px' }}>Top Rated Hostels</h2>
              <p className="section-subtitle-sm" style={{ color: '#666', fontSize: '16px' }}>Verified properties with the best student feedback.</p>
            </div>
            <Link to="/student/search-results" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '15px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>View All Hostels <MdArrowForward /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }} className="lp-hostel-grid">
            {topPGs.map(pg => (
              <div key={pg.id} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ height: '220px', position: 'relative' }}>
                  <img src={pg.images[0]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {pg.verified && <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><MdVerified size={14} /> VERIFIED</div>}
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>{pg.name}</h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}><MdLocationOn size={18} color="var(--primary)" /> {pg.location}</p>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><MdStar size={14} /> {pg.rating}</span>
                    <span style={{ background: '#fff7ed', color: '#c2410c', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><MdRestaurant size={14} /> Mess {pg.messRating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: 950, color: 'var(--primary)' }}>₹{pg.rent.toLocaleString()}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>per month</div>
                    </div>
                    <Link to={`/student/pg/${pg.id}`} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: 800 }}>View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lp-section" style={{ background: 'var(--primary-gradient)', padding: '80px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="cta-title-sm" style={{ fontSize: '40px', fontWeight: 950, marginBottom: '20px', letterSpacing: '-1px' }}>Ready to find your PG/Hostel?</h2>
          <p className="cta-subtitle-sm" style={{ fontSize: '20px', opacity: 0.9, marginBottom: '40px' }}>Join 15,000+ students today and experience transparent living.</p>
          <Link to="/register" className="cta-btn-sm" style={{ background: 'white', color: 'var(--primary)', padding: '18px 40px', borderRadius: '14px', fontWeight: 900, fontSize: '18px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>Get Started Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 24px', background: 'white', borderTop: '1px solid #eee' }}>
        <div className="flex-mobile-col" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
          <div className="mobile-text-center" style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-start' }} className="mobile-justify-center">
              <Logo />
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>Real reviews for better student living.</p>
          </div>
          
          <div className="mobile-text-center" style={{ color: '#999', fontSize: '13px', fontWeight: 600, lineHeight: 1.8, textAlign: 'right' }}>
            <div>© 2026 HostelPass.</div>
            <div>Built for Students,</div>
            <div style={{ fontWeight: 800, color: '#666' }}>By Team <span style={{ color: '#9333ea' }}>Hack</span>Scouts</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
