import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdLocationOn, MdStar, MdRestaurant, MdVerified, MdSearch,
  MdFeedback, MdFavorite, MdArrowForward, MdMenu, MdClose, MdDashboard, MdPerson, MdLogout, MdNotifications
} from 'react-icons/md';
import { MOCK_PGS } from '../data/mockData';
import Logo from '../components/common/Logo';
import UserActions from '../components/layout/UserActions';

const LandingPage = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const topPGs = MOCK_PGS.filter(p => p.rating >= 4.3).slice(0, 3);

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
      <nav className="landing-nav">
        <div className="nav-left">
          {/* Hamburger on Left for Mobile */}
          <button 
            className="btn btn-ghost btn-icon pc-only-hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MdMenu size={24} />
          </button>

          <Logo />
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to={`/${userRole}`} className="pc-only" style={{ 
                background: 'var(--primary-gradient)', color: 'white', padding: '8px 16px', 
                borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(230, 0, 0, 0.2)', marginRight: '4px'
              }}>Dashboard</Link>
              <UserActions />
            </>
          ) : (
            <div className="pc-only" style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" style={{ 
                fontWeight: 600, color: '#333', fontSize: '13px', textDecoration: 'none',
                padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee'
              }}>Login</Link>
              <Link to="/register" style={{ 
                background: 'var(--primary-gradient)', color: 'white', padding: '8px 16px', 
                borderRadius: '6px', fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(230, 0, 0, 0.2)'
              }}>Join Now</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1100,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '280px', height: '100%', background: 'white',
              padding: '24px', display: 'flex', flexDirection: 'column',
              gap: '24px', animation: 'slideIn 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/pwa-192x192.png" style={{ width: 28, height: 28 }} alt="" />
                <span style={{ fontWeight: 800, fontSize: '18px' }}>HostelPass</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#666' }}><MdClose size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {user ? (
                <>
                  <Link to={`/${userRole}`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: '#333', fontWeight: 600, background: '#f8f9fa' }}>
                    <MdDashboard color="var(--primary)" /> Dashboard
                  </Link>
                  <Link to={`/${userRole}/profile`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: '#333', fontWeight: 600 }}>
                    <MdPerson color="var(--primary)" /> My Profile
                  </Link>
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ee2e24', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                      <MdLogout /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '14px', borderRadius: '12px', border: '1px solid #eee', textDecoration: 'none', color: '#333', fontWeight: 600, textAlign: 'center' }}>Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', padding: '14px', borderRadius: '12px', background: 'var(--primary-gradient)', color: 'white', textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>Join Now</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="landing-hero" style={{ padding: '60px 24px 0', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 className="landing-title" style={{ fontSize: 'clamp(36px, 8vw, 68px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' }}>
            Find Your Perfect <br className="mobile-only" />
            <span style={{ color: '#1a1a1a' }}>PG/Hostel</span> <br className="pc-only" />
            <span style={{ 
              background: 'var(--primary-gradient)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>with Honest Review</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#666', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Don't just pick a PG based on photos. Read real student experiences, check the mess quality score, and choose where you truly belong.
          </p>
          <div className="landing-search-bar" style={{ background: 'white', borderRadius: '50px', padding: '8px 8px 8px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxWidth: '650px', margin: '0 auto 32px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <MdLocationOn size={24} color="var(--primary)" />
              <input style={{ flex: 1, border: 'none', padding: '12px 12px', fontSize: '16px', outline: 'none', width: '100%' }} placeholder="Search location or PG name..." />
            </div>
            <button style={{ 
              background: 'var(--primary-gradient)', 
              color: 'white', 
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '40px', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '6px', 
              cursor: 'pointer', 
              boxShadow: '0 4px 10px rgba(230, 0, 0, 0.2)' 
            }}>
              <MdSearch size={18} />
              <span>Search</span>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            {['Bangalore', 'Mumbai', 'Delhi', 'Pune'].map(city => (
              <button key={city} style={{ background: 'white', border: '1px solid #eee', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#555', cursor: 'pointer' }}>{city}</button>
            ))}
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="stats-bar" style={{ background: 'var(--primary-gradient)', padding: '40px 24px', color: 'white' }}>
          <div className="stats-bar-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', justifyContent: 'center', textAlign: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>1,200+</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>PGs Listed</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>15,000+</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Students</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>45,000+</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Reviews</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900 }}>320+</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section-padding" style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title" style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>Why Hostel<span style={{ color: 'var(--primary)' }}>Pass</span>?</h2>
            <p className="section-subtitle" style={{ fontSize: '17px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>We put transparency at the center — every review, every mess score is real.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '24px', borderRadius: '16px', background: '#fcfcfc', border: '1px solid #eee' }}>
                <div style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top PGs ── */}
      <section className="section-padding" style={{ padding: '80px 24px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>Top Rated PGs</h2>
              <p className="section-subtitle" style={{ color: '#666', fontSize: '14px' }}>Highest rated by students</p>
            </div>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View All <MdArrowForward /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {topPGs.map(pg => (
              <div key={pg.id} className="pg-card-landing" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee' }}>
                <div style={{ height: '180px', position: 'relative' }}>
                  <img src={pg.images[0]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {pg.verified && <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}><MdVerified size={12} /> VERIFIED</div>}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{pg.name}</h3>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdLocationOn size={16} /> {pg.location}</p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><MdStar size={12} /> {pg.rating}</span>
                    <span style={{ background: '#fff7ed', color: '#c2410c', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><MdRestaurant size={12} /> Mess {pg.messRating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900 }}>₹{pg.rent.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 400, color: '#666' }}>/mo</span></div>
                    <Link to="/login" className="btn btn-primary btn-sm" style={{ background: 'var(--primary-gradient)', border: 'none' }}>Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section" style={{ background: 'var(--primary-gradient)', padding: '60px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="cta-title" style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Ready to find your PG/Hostel?</h2>
          <p className="cta-subtitle" style={{ fontSize: '17px', opacity: 0.9, marginBottom: '32px' }}>Join 15,000+ students today.</p>
          <Link to="/register" className="cta-button" style={{ background: 'white', color: 'var(--primary)', padding: '14px 32px', borderRadius: '8px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Get Started</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '40px 24px', background: 'white', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: 24, height: 24, background: 'var(--primary)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: 'white' }}>HP</div>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#333' }}>Hostel<span style={{ color: 'var(--primary)' }}>Pass</span></span>
            </div>
            <p style={{ color: '#666', fontSize: '13px' }}>Real reviews for better living.</p>
          </div>
          <div style={{ color: '#999', fontSize: '12px' }}>© 2026 HostelPass. All rights reserved</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
