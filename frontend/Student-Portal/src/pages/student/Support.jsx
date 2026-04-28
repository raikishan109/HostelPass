import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { 
  MdHeadsetMic, 
  MdEmail, 
  MdPhone, 
  MdWhatsapp, 
  MdHelpOutline, 
  MdArrowForward,
  MdReportProblem,
  MdQuestionAnswer
} from 'react-icons/md';

const SupportCard = ({ icon: Icon, title, desc, action, color }) => (
  <div className="app-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ 
      width: '48px', height: '48px', borderRadius: '14px', 
      background: `${color}15`, color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px'
    }}>
      <Icon />
    </div>
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{desc}</p>
    </div>
    <button 
      onClick={action}
      style={{ 
        marginTop: '8px', padding: '12px', borderRadius: '12px', border: '1px solid #f0f0f0',
        background: 'white', fontWeight: 700, fontSize: '13px', color: '#333',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        cursor: 'pointer', transition: 'all 0.2s'
      }}
      className="btn-hover-scale"
    >
      Contact Now <MdArrowForward size={16} />
    </button>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', padding: '16px 0' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>{question}</h4>
        <MdArrowForward style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s', color: '#999' }} />
      </div>
      {isOpen && <p style={{ fontSize: '13px', color: '#666', marginTop: '12px', lineHeight: 1.6 }}>{answer}</p>}
    </div>
  );
};

const Support = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: "How do I book a PG?", a: "Find your preferred PG, click on 'Book Now', select your facilities and confirm. The owner will then approve your request." },
    { q: "Can I cancel my booking?", a: "Yes, you can cancel a pending booking from your dashboard. For confirmed bookings, please contact support or the owner." },
    { q: "How is the mess rating calculated?", a: "Mess ratings are averaged from verified reviews of students currently staying or who have stayed in that PG." },
    { q: "What is a Verified Badge?", a: "The Verified badge is given to hostels that have been physically inspected by our team for safety and hygiene." }
  ];

  return (
    <StudentLayout title="Support" subtitle="We're here to help you 24/7">
      <div className="animate-fadeIn app-page-container" style={{ paddingBottom: '40px' }}>
        
        {/* Support Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <SupportCard 
            icon={MdWhatsapp} 
            title="WhatsApp Support" 
            desc="Quick chat for any immediate booking or payment queries." 
            color="#25D366"
            action={() => window.open('https://wa.me/91XXXXXXXXXX')}
          />
          <SupportCard 
            icon={MdHeadsetMic} 
            title="Customer Helpline" 
            desc="Talk to our student support experts for help with your stay." 
            color="var(--primary)"
            action={() => window.location.href = 'tel:+91XXXXXXXXXX'}
          />
          <SupportCard 
            icon={MdEmail} 
            title="Email Support" 
            desc="Drop us a line for documentation or listing related issues." 
            color="#3B82F6"
            action={() => window.location.href = 'mailto:support@hostelpass.com'}
          />
        </div>

        {/* Quick Help Section */}
        <div className="section-header">
          <h3 className="section-title-app">Self Help</h3>
        </div>
        <div className="app-card" style={{ padding: '24px', marginBottom: '40px' }}>
          <div 
            onClick={() => navigate('/student/complaints')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
              background: '#FEF2F2', borderRadius: '16px', cursor: 'pointer', marginBottom: '16px'
            }}
          >
            <div style={{ fontSize: '24px', color: 'var(--primary)' }}><MdReportProblem /></div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Raise a Complaint</h4>
              <p style={{ fontSize: '12px', color: '#666' }}>Report issues with food, cleaning or owner behaviour.</p>
            </div>
            <MdArrowForward color="#999" />
          </div>
          
          <div 
            onClick={() => navigate('/student/bookings')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
              background: '#EFF6FF', borderRadius: '16px', cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '24px', color: '#3B82F6' }}><MdHelpOutline /></div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Manage Bookings</h4>
              <p style={{ fontSize: '12px', color: '#666' }}>Track your booking status or request a move-in date change.</p>
            </div>
            <MdArrowForward color="#999" />
          </div>
        </div>

        {/* FAQs */}
        <div className="section-header">
          <h3 className="section-title-app">Frequently Asked Questions</h3>
        </div>
        <div className="app-card" style={{ padding: '8px 24px' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '48px', padding: '24px', opacity: 0.6 }}>
          <MdHeadsetMic size={32} style={{ marginBottom: '12px', color: 'var(--primary)' }} />
          <p style={{ fontSize: '13px', fontWeight: 600 }}>HostelPass Support is active 10 AM - 8 PM IST</p>
          <p style={{ fontSize: '11px', marginTop: '4px' }}>© 2026 HostelPass India Private Limited</p>
        </div>

      </div>
    </StudentLayout>
  );
};

export default Support;
