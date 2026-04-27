import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdLocationOn, MdStar, MdRestaurant, MdVerified, MdSearch, MdMyLocation,
  MdFeedback, MdFavorite, MdArrowForward, MdMenu, MdClose, MdDashboard, MdPerson, MdLogout, MdNotifications, MdExplore, MdSecurity, MdPayment
} from 'react-icons/md';
import Logo from '../components/common/Logo';
import UserActions from '../components/layout/UserActions';
import StudentSidebar from '../components/layout/StudentSidebar';
import toast from 'react-hot-toast';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const LandingPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [topPGs, setTopPGs] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const q = query(collection(db, 'hostels'), limit(3));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTopPGs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
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
          const addr = data.address;
          const locationName = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.city || addr.town || addr.village || data.display_name.split(',')[0] || "Current Location";
          
          setSearchQuery(locationName);
          toast.success(`Location: ${locationName}`);
          setTimeout(() => {
            navigate(`/student/search-results?lat=${latitude}&lng=${longitude}&radius=5&q=${encodeURIComponent(locationName)}`);
          }, 500);
        } catch (error) {
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
    <div style={{ background: '#f8f9fa', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── Premium Glass Navbar ── */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px', 
        background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 24px', zIndex: 1100, transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-icon mobile-only" onClick={() => setIsMenuOpen(true)} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
            <MdMenu size={22} color="#333" />
          </button>
          <Logo />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={`/${userRole}`} className="pc-only" style={{ background: 'var(--primary-gradient)', color: 'white', padding: '10px 20px', borderRadius: '14px', fontWeight: 800, fontSize: '13px', boxShadow: '0 8px 20px rgba(230,0,0,0.15)' }}>Go to Dashboard</Link>
              <UserActions />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" style={{ fontWeight: 700, color: '#333', fontSize: '14px', padding: '10px 20px', borderRadius: '14px', border: '1px solid #eee', background: 'white' }}>Login</Link>
              <Link to="/register" className="pc-only" style={{ background: 'var(--primary-gradient)', color: 'white', padding: '10px 24px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', boxShadow: '0 8px 20px rgba(230,0,0,0.15)' }}>Join Now</Link>
            </div>
          )}
        </div>
      </nav>

      <StudentSidebar sidebarOpen={isMenuOpen} setSidebarOpen={setIsMenuOpen} />
      
      {/* ── Hero Section ── */}
      <section style={{ 
        padding: '130px 24px 100px', textAlign: 'center', background: 'white',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #fff1f1 0%, #ffffff 50%)'
      }}>
        <div className="app-page-container">
          <div className="animate-slideUp">

            <h1 style={{ 
              fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 950, color: '#1a1a1a', 
              lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' 
            }}>
              Find Your Perfect <br/>
              <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PG/Hostel</span> Stay
            </h1>
            <p style={{ 
              fontSize: '18px', color: '#666', marginBottom: '48px', maxWidth: '700px', 
              margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500
            }}>
              Browse verified listings, read honest student reviews, and book your stay with a single click. No hidden fees, just pure transparency.
            </p>
          </div>

          {/* Premium Search Bar */}
          <form onSubmit={handleSearch} style={{ 
            background: 'white', borderRadius: '30px', padding: '10px', 
            display: 'flex', alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', 
            maxWidth: '750px', margin: '0 auto 40px', border: '1px solid #f0f0f0',
            position: 'relative', zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '16px' }}>
              <MdLocationOn size={26} color="var(--primary)" />
              <input 
                style={{ flex: 1, border: 'none', padding: '14px 12px', fontSize: '16px', outline: 'none', width: '100%', fontWeight: 600, color: '#1a1a1a' }} 
                placeholder={isDetecting ? "Detecting location..." : "Search city, location or college..."} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <button type="button" onClick={detectLocation} style={{ background: '#f8f9fa', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '12px', color: isDetecting ? 'var(--primary)' : '#888', marginRight: '8px' }}>
                <MdMyLocation size={22} />
              </button>
            </div>
            <button type="submit" style={{ 
              background: 'var(--primary-gradient)', color: 'white', border: 'none', 
              padding: '16px 32px', borderRadius: '24px', fontWeight: 800, cursor: 'pointer', 
              boxShadow: '0 8px 25px rgba(230,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'transform 0.2s'
            }} className="btn-hover-scale">
              <MdSearch size={24} /> <span className="pc-only">Find Now</span>
            </button>
          </form>

          {/* Quick City Tags */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            {['Lucknow', 'Delhi', 'Bangalore', 'Mumbai', 'Pune'].map(city => (
              <button 
                key={city} 
                onClick={() => handleCitySearch(city)} 
                style={{ 
                  background: 'white', border: '1px solid #f0f0f0', padding: '10px 24px', 
                  borderRadius: '16px', fontSize: '14px', fontWeight: 700, color: '#555', 
                  cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
                className="city-tag"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section (App Style Cards) ── */}
      <section style={{ padding: '0 24px 100px', marginTop: '-40px' }}>
        <div className="app-page-container">
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '16px', padding: '32px', background: 'var(--primary-gradient)',
            borderRadius: '32px', boxShadow: '0 20px 40px rgba(230,0,0,0.15)', color: 'white'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 950 }}>1,200+</div>
              <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Hostels</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 950 }}>15,000+</div>
              <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Students</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 950 }}>45,000+</div>
              <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Reviews</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 950 }}>320+</div>
              <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div className="app-page-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1a1a1a', marginBottom: '16px' }}>Why Choose HostelPass?</h2>
            <p style={{ fontSize: '17px', color: '#666', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>We put transparency at the center — every review, every mess score is real.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="app-card" style={{ padding: '40px 32px', border: '1px solid #f0f0f0' }}>
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '20px', background: 'var(--primary-bg)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                  fontSize: '28px', marginBottom: '24px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#1a1a1a' }}>{f.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Hostels ── */}
      <section style={{ padding: '100px 24px', background: '#ffffff' }}>
        <div className="app-page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1a1a1a', marginBottom: '8px' }}>Top Rated Hostels</h2>
              <p style={{ color: '#666', fontSize: '16px', fontWeight: 500 }}>Verified properties with the best student feedback.</p>
            </div>
            <Link to="/student/search-results" style={{ 
              color: 'var(--primary)', fontWeight: 800, fontSize: '15px', textDecoration: 'none', 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
              borderRadius: '12px', background: 'var(--primary-bg)'
            }}>
              View All <MdArrowForward />
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {topPGs.map(pg => (
              <div key={pg.id} className="app-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                <div style={{ height: '240px', position: 'relative' }}>
                  <img src={pg.images[0]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {pg.verified && (
                    <div style={{ 
                      position: 'absolute', top: '16px', left: '16px', background: 'white', 
                      padding: '8px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, 
                      color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', 
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)' 
                    }}>
                      <MdVerified size={16} /> VERIFIED
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, color: '#1a1a1a', backdropFilter: 'blur(4px)' }}>
                    ₹{pg.rent.toLocaleString()}/mo
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>{pg.name}</h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MdLocationOn size={18} color="var(--primary)" /> {pg.location}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><MdStar size={14} /> {pg.rating}</span>
                    <span style={{ background: '#fff7ed', color: '#c2410c', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><MdRestaurant size={14} /> Mess {pg.messRating}</span>
                  </div>
                  <Link to={`/student/pg/${pg.id}`} className="btn btn-primary w-full" style={{ borderRadius: '14px', fontWeight: 800 }}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="app-page-container">
          <div style={{ 
            background: 'var(--primary-gradient)', padding: '80px 40px', borderRadius: '40px', 
            color: 'white', boxShadow: '0 30px 60px rgba(230,0,0,0.2)', position: 'relative', overflow: 'hidden' 
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 950, marginBottom: '20px', letterSpacing: '-1px' }}>Ready to Find Your Home?</h2>
              <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>Join 15,000+ students and find your perfect PG with HostelPass today.</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={{ background: 'white', color: 'var(--primary)', padding: '18px 40px', borderRadius: '18px', fontWeight: 900, fontSize: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>Get Started Now</Link>
                <Link to="/student/search-results" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '18px 40px', borderRadius: '18px', fontWeight: 800, fontSize: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>Explore PGs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '80px 24px 40px', background: 'white', borderTop: '1px solid #f0f0f0' }}>
        <div className="app-page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '60px', marginBottom: '60px' }}>
            <div style={{ maxWidth: '300px' }}>
              <Logo />
              <p style={{ color: '#666', fontSize: '15px', marginTop: '20px', lineHeight: 1.6 }}>Making student living transparent, safe, and easy with real reviews and verified stays.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '60px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#666', fontWeight: 600 }}>
                  <Link to="/">About Us</Link>
                  <Link to="/">Privacy Policy</Link>
                  <Link to="/">Terms of Service</Link>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#666', fontWeight: 600 }}>
                  <Link to="/">Help Center</Link>
                  <Link to="/">Contact Us</Link>
                  <Link to="/">Partner Login</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#999', fontWeight: 600, margin: 0 }}>© 2026 HostelPass.</p>
            <p style={{ fontSize: '13px', color: '#999', fontWeight: 600, marginTop: '8px' }}>
              Built for Students By <span style={{ color: '#999', fontWeight: 800 }}>Team <span style={{ color: '#1a1a1a' }}>Hack</span><span style={{ color: '#9333ea' }}>Scouts</span></span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
