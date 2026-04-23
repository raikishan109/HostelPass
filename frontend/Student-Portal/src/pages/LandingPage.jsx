import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdLocationOn, MdStar, MdRestaurant, MdVerified, MdSearch,
  MdFeedback, MdFavorite, MdArrowForward
} from 'react-icons/md';
import { MOCK_PGS } from '../data/mockData';

const LandingPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

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
    <div style={{ background: '#fcfcfc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Navbar ── */}
      <nav style={{
        background: 'white', borderBottom: '1px solid #eee', padding: '0 40px',
        height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 32, height: 32, background: '#EE2E24', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '16px', color: 'white',
          }}>HP</div>
          <span style={{ fontWeight: 800, fontSize: '22px', color: '#333', letterSpacing: '-0.5px' }}>
            Hostel<span style={{ color: '#EE2E24' }}>Pass</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <Link to={`/${userRole}`} style={{ 
              background: '#EE2E24', color: 'white', padding: '10px 20px', 
              borderRadius: '4px', fontWeight: 700, fontSize: '14px', textDecoration: 'none'
            }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ 
                fontWeight: 600, color: '#333', fontSize: '14px', textDecoration: 'none',
                padding: '8px 16px', borderRadius: '4px', border: '1px solid #eee'
              }}>Login</Link>
              <Link to="/register" style={{ 
                background: '#EE2E24', color: 'white', padding: '10px 20px', 
                borderRadius: '4px', fontWeight: 700, fontSize: '14px', textDecoration: 'none'
              }}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ padding: '80px 20px 0', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: '#fff1f0', color: '#EE2E24', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', marginBottom: '24px', border: '1px solid #ffccc7' }}>
            🏢 REAL REVIEWS. REAL MESS SCORES. REAL CHOICES.
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 68px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' }}>
            Find Your Perfect PG<br /><span style={{ color: '#EE2E24' }}>With Honest Reviews</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            Don't just pick a PG based on photos. Read real student experiences, check the mess quality score, and choose where you truly belong.
          </p>
          <div style={{ background: 'white', borderRadius: '50px', padding: '8px 8px 8px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxWidth: '650px', margin: '0 auto 32px', border: '1px solid #eee' }}>
            <MdLocationOn size={24} color="#999" />
            <input style={{ flex: 1, border: 'none', padding: '12px 16px', fontSize: '16px', outline: 'none' }} placeholder="Search by location, college or PG name..." />
            <button style={{ background: '#EE2E24', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '40px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <MdSearch size={20} /> Search
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            {['Bangalore', 'Mumbai', 'Hyderabad', 'Delhi', 'Pune'].map(city => (
              <button key={city} style={{ background: 'white', border: '1px solid #eee', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#555', cursor: 'pointer' }}>{city}</button>
            ))}
          </div>
        </div>

        {/* ── Stats Bar (Directly below hero content) ── */}
        <div style={{ background: '#EE2E24', padding: '40px 0', color: 'white', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900 }}>1,200+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>PGs Listed</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900 }}>15,000+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Happy Students</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900 }}>45,000+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Honest Reviews</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 900 }}>320+</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Verified PGs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: '100px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>Why Students Choose Hostel-Pass</h2>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>We put transparency at the center — every review, every mess score, every complaint is real.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '32px', borderRadius: '16px', background: '#fcfcfc', border: '1px solid #eee' }}>
                <div style={{ fontSize: '32px', color: '#EE2E24', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top PGs ── */}
      <section style={{ padding: '100px 24px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Top Rated PGs</h2>
              <p style={{ color: '#666' }}>Highest rated PGs based on student reviews</p>
            </div>
            <Link to="/login" style={{ color: '#EE2E24', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View All <MdArrowForward /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {topPGs.map(pg => (
              <div key={pg.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={pg.images[0]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {pg.verified && <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><MdVerified size={14} /> VERIFIED</div>}
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>{pg.name}</h3>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdLocationOn size={16} /> {pg.location}</p>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><MdStar size={14} /> {pg.rating}</span>
                    <span style={{ background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><MdRestaurant size={14} /> Mess {pg.messRating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#1a1a1a' }}>₹{pg.rent.toLocaleString()}<span style={{ fontSize: '14px', fontWeight: 400, color: '#666' }}>/mo</span></div>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }}>View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ background: '#EE2E24', padding: '80px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '20px' }}>Ready to Find Your Perfect PG?</h2>
          <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '40px' }}>Join 15,000+ students who found their home through Hostel-Pass.</p>
          <Link to="/register" style={{ background: 'white', color: '#EE2E24', padding: '16px 40px', borderRadius: '8px', fontWeight: 800, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>Get Started Now</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '60px 40px', background: 'white', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: 24, height: 24, background: '#EE2E24', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: 'white' }}>HP</div>
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#333' }}>Hostel<span style={{ color: '#EE2E24' }}>Pass</span></span>
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>Transparent reviews for better student living.</p>
          </div>
          <div style={{ color: '#999', fontSize: '14px' }}>© 2025 Hostel-Pass. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
