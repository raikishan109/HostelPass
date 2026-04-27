import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PartnerLayout from '../../components/layout/PartnerLayout';
import { AMENITY_OPTIONS, CITY_OPTIONS, PG_TYPES } from '../../data/mockData';
import toast from 'react-hot-toast';
import { MdAdd, MdClose, MdSave, MdCloudUpload } from 'react-icons/md';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToImgBB } from '../../utils/imageUpload';
const STEPS = ['Basic Info', 'Pricing', 'Amenities', 'Description'];

const AddListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', type: 'Boys', city: '', location: '', address: '',
    rent: '', deposit: '', sharingRent: '',
    amenities: [],
    description: '', rules: '',
    images: [],
  });

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleAmenity = a => setField('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);

  const next = () => {
    if (step === 0 && (!form.name || !form.city || !form.location)) { toast.error('Fill all required fields'); return; }
    if (step === 1 && !form.rent) { toast.error('Monthly rent is required'); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!form.description) { toast.error('Description is required'); return; }
    
    setIsSubmitting(true);
    const uploadToast = toast.loading('Uploading images and saving listing...');
    
    try {
      const imageUrls = [];
      
      // Upload images to ImgBB (Alternative to Firebase Storage)
      if (form.images && form.images.length > 0) {
        let count = 0;
        for (const imgObj of form.images) {
          count++;
          toast.loading(`Uploading image ${count}/${form.images.length}...`, { id: uploadToast });
          const downloadUrl = await uploadImageToImgBB(imgObj.file);
          imageUrls.push(downloadUrl);
        }
      }

      await addDoc(collection(db, 'hostels'), {
        name: form.name,
        type: form.type,
        city: form.city,
        location: form.location,
        address: form.address,
        rent: Number(form.rent),
        deposit: Number(form.deposit),
        sharingRent: Number(form.sharingRent) || 0,
        amenities: form.amenities,
        description: form.description,
        rules: form.rules,
        images: imageUrls, // Store real URLs
        partnerId: user.uid,
        partnerName: user.displayName || 'Partner',
        verified: false,
        rating: 0,
        messRating: 0,
        reviewCount: 0,
        complaintCount: 0,
        createdAt: serverTimestamp(),
      });

      toast.success('PG listing submitted successfully! 🎉', { id: uploadToast });
      navigate('/partner/listings');
    } catch (error) {
      console.error("Error adding listing:", error);
      toast.error('Failed to submit listing. Try again.', { id: uploadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PartnerLayout title="Add New PG Listing">
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {/* Stepper */}
            <div className="filter-chips" style={{ 
              display: 'flex', gap: '0', marginBottom: '32px', background: 'white', 
              borderRadius: '16px', padding: '16px 20px', border: '1px solid var(--border)',
              overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingRight: '12px' }} onClick={() => i < step && setStep(i)}>
                    <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', background: i === step ? 'var(--primary)' : i < step ? 'var(--verified-color)' : 'var(--bg)', color: i <= step ? 'white' : 'var(--text-light)', transition: 'all 0.2s' }}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', color: i === step ? 'var(--primary)' : i < step ? 'var(--verified-color)' : 'var(--text-light)' }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: '20px', height: 2, background: i < step ? 'var(--verified-color)' : 'var(--border)', marginRight: '12px', transition: 'background 0.3s' }} />}
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border)', padding: '32px' }}>
              {/* Step 0: Basic Info */}
              {step === 0 && (
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '24px' }}>Basic Information</h3>
                  <div className="form-group">
                    <label className="form-label">PG / Hostel Name *</label>
                    <input className="form-input" placeholder="e.g. Sunrise Boys PG" value={form.name} onChange={e => setField('name', e.target.value)} />
                  </div>
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">PG Type *</label>
                      <select className="form-select" value={form.type} onChange={e => setField('type', e.target.value)}>
                        {PG_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <select className="form-select" value={form.city} onChange={e => setField('city', e.target.value)}>
                        <option value="">Select city...</option>
                        {CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Locality / Area *</label>
                    <input className="form-input" placeholder="e.g. Koramangala, Near Forum Mall" value={form.location} onChange={e => setField('location', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address</label>
                    <textarea className="form-input form-textarea" placeholder="Complete address with landmarks" rows={2} value={form.address} onChange={e => setField('address', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Step 1: Pricing */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '24px' }}>Pricing Details</h3>
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Monthly Rent (₹) *</label>
                      <input className="form-input" type="number" placeholder="e.g. 8500" value={form.rent} onChange={e => setField('rent', e.target.value)} />
                      <div className="form-hint">For single occupancy</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Security Deposit (₹) *</label>
                      <input className="form-input" type="number" placeholder="e.g. 17000" value={form.deposit} onChange={e => setField('deposit', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sharing Room Rent (₹)</label>
                      <input className="form-input" type="number" placeholder="e.g. 6000" value={form.sharingRent} onChange={e => setField('sharingRent', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ background: 'var(--primary-bg)', borderRadius: '12px', padding: '16px', marginTop: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>
                      💡 Tip: Competitive pricing increases your listing visibility and inquiry rate.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Amenities */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>Amenities Offered</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '20px' }}>Select all amenities available at your PG</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {AMENITY_OPTIONS.map(a => (
                      <button key={a} onClick={() => toggleAmenity(a)} style={{
                        padding: '10px 14px', borderRadius: '10px', border: '2px solid',
                        borderColor: form.amenities.includes(a) ? 'var(--primary)' : 'var(--border)',
                        background: form.amenities.includes(a) ? 'var(--primary-bg)' : 'white',
                        color: form.amenities.includes(a) ? 'var(--primary)' : 'var(--text-medium)',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        {form.amenities.includes(a) && '✓'} {a}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-light)' }}>
                    {form.amenities.length} amenities selected
                  </div>
                </div>
              )}

              {/* Step 3: Description */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '24px' }}>Description & Photos</h3>
                  <div className="form-group">
                    <label className="form-label">PG Description *</label>
                    <textarea className="form-input form-textarea" placeholder="Describe your PG — food quality, neighbourhood, facilities, nearby landmarks..." rows={4} value={form.description} onChange={e => setField('description', e.target.value)} />
                    <div className="form-hint">Mention mess/food quality to attract more students</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">House Rules</label>
                    <textarea className="form-input form-textarea" placeholder="e.g. No smoking, quiet hours after 11pm, guests not allowed..." rows={3} value={form.rules} onChange={e => setField('rules', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Photos</label>
                    <input 
                      type="file" 
                      id="pg-photos" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length + (form.images?.length || 0) > 10) {
                          toast.error('Maximum 10 photos allowed');
                          return;
                        }
                        const newImages = files.map(file => ({
                          file,
                          preview: URL.createObjectURL(file)
                        }));
                        setField('images', [...(form.images || []), ...newImages]);
                      }}
                    />
                    <div 
                      style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)', transition: 'all 0.2s' }}
                      onClick={() => document.getElementById('pg-photos').click()}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-bg)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
                    >
                      <MdCloudUpload size={32} color="var(--text-light)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontWeight: 600, color: 'var(--text-medium)', marginBottom: '4px' }}>Click to upload photos</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>JPG, PNG up to 5MB each. Max 10 photos.</div>
                    </div>

                    {form.images && form.images.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
                        {form.images.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <img src={img.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setField('images', form.images.filter((_, i) => i !== idx));
                              }}
                              style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(238,46,36,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <MdClose size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}>
                  ← {step > 0 ? 'Back' : 'Cancel'}
                </button>
                {step < STEPS.length - 1
                  ? <button className="btn btn-primary btn-sm" onClick={next}>Next Step →</button>
                  : <button className="btn btn-primary" onClick={handleSubmit}><MdSave /> Submit Listing</button>
                }
              </div>
            </div>
          </div>
    </PartnerLayout>
  );
};

export default AddListing;
