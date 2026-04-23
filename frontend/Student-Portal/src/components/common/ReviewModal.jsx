import React, { useState } from 'react';
import { MdStar, MdRestaurant, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';

const StarPicker = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ fontSize: '13px', color: 'var(--text-medium)', minWidth: '120px' }}>{label}</span>
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
            color: i <= value ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s',
          }}
        >★</button>
      ))}
    </div>
    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>
      {value ? `${value}/5` : '—'}
    </span>
  </div>
);

const ReviewModal = ({ pgName, pgId, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    overallRating: 0, messRating: 0, cleanlinessRating: 0, securityRating: 0, text: '',
  });

  const handleSubmit = () => {
    if (!form.overallRating) { toast.error('Please provide an overall rating'); return; }
    if (!form.text.trim()) { toast.error('Please write a review'); return; }
    if (form.text.trim().length < 20) { toast.error('Review must be at least 20 characters'); return; }
    onSubmit({ ...form, pgId });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Write a Review</div>
            <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>{pgName}</div>
          </div>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <StarPicker label="Overall Rating *" value={form.overallRating} onChange={v => setForm(f => ({ ...f, overallRating: v }))} />
            <StarPicker label="Mess / Food" value={form.messRating} onChange={v => setForm(f => ({ ...f, messRating: v }))} />
            <StarPicker label="Cleanliness" value={form.cleanlinessRating} onChange={v => setForm(f => ({ ...f, cleanlinessRating: v }))} />
            <StarPicker label="Security" value={form.securityRating} onChange={v => setForm(f => ({ ...f, securityRating: v }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Your Experience *</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Describe your experience — food quality, cleanliness, owner behaviour, WiFi, etc."
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              rows={4}
            />
            <div className="form-hint">{form.text.length} / 500 characters</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <MdStar /> Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
