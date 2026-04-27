import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PartnerLayout from '../../components/layout/PartnerLayout';
import { AMENITY_OPTIONS, CITY_OPTIONS, PG_TYPES } from '../../data/mockData';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack, MdCloudUpload, MdClose, MdDelete } from 'react-icons/md';
import { db, storage } from '../../firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToImgBB } from '../../utils/imageUpload';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    type: 'Boys',
    city: 'Bangalore',
    location: '',
    address: '',
    rent: '',
    deposit: '',
    sharingRent: '',
    amenities: [],
    description: '',
    rules: '',
    existingImages: [],
    newImages: [] // { file, url }
  });

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const docRef = doc(db, 'hostels', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security check: only owner can edit
          if (data.partnerId !== user.uid) {
            toast.error("You don't have permission to edit this listing");
            navigate('/partner/listings');
            return;
          }
          setForm({
            ...data,
            rent: data.rent || '',
            deposit: data.deposit || '',
            sharingRent: data.sharingRent || '',
            existingImages: data.images || [],
            newImages: [],
            amenities: data.amenities || []
          });
        } else {
          toast.error("Listing not found");
          navigate('/partner/listings');
        }
      } catch (error) {
        console.error("Error fetching PG:", error);
        toast.error("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPG();
  }, [id, user, navigate]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const toggleAmenity = a => {
    setField('amenities', form.amenities.includes(a) 
      ? form.amenities.filter(x => x !== a) 
      : [...form.amenities, a]
    );
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (form.existingImages.length + form.newImages.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setForm(prev => ({ ...prev, newImages: [...prev.newImages, ...newPhotos] }));
  };

  const removeExistingImage = (url) => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== url)
    }));
  };

  const removeNewImage = (url) => {
    setForm(prev => ({
      ...prev,
      newImages: prev.newImages.filter(img => img.url !== url)
    }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!form.name || !form.location || !form.rent) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSaving(true);
    let saveToast = toast.loading('Initializing save...');

    try {
      console.log("Starting save process for ID:", id);
      let finalImages = [...(form.existingImages || [])];

      // Upload new images if any
      if (form.newImages && form.newImages.length > 0) {
        toast.loading(`Uploading images (0/${form.newImages.length})...`, { id: saveToast });
        
        let count = 0;
        for (const imgObj of form.newImages) {
          if (!imgObj.file) continue;
          
          count++;
          toast.loading(`Uploading image ${count}/${form.newImages.length}...`, { id: saveToast });
          
          const downloadUrl = await uploadImageToImgBB(imgObj.file);
          finalImages.push(downloadUrl);
        }
      }

      toast.loading('Updating property details...', { id: saveToast });
      const docRef = doc(db, 'hostels', id);
      
      const updateData = {
        name: (form.name || '').trim(),
        type: form.type || 'Boys',
        city: form.city || 'Bangalore',
        location: (form.location || '').trim(),
        address: (form.address || '').trim(),
        rent: Number(form.rent) || 0,
        deposit: Number(form.deposit) || 0,
        sharingRent: Number(form.sharingRent) || 0,
        amenities: form.amenities || [],
        description: (form.description || '').trim(),
        rules: (form.rules || '').trim(),
        images: finalImages,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      
      toast.success('Listing updated successfully! 🎉', { id: saveToast });
      // Small delay before redirect
      setTimeout(() => {
        navigate('/partner/listings');
      }, 1000);

    } catch (error) {
      console.error("Critical Save Error:", error);
      toast.error(`Error: ${error.message || 'Failed to save changes'}`, { id: saveToast });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <PartnerLayout title="Edit Listing"><div style={{ padding: '40px', textAlign: 'center' }}>Loading listing details...</div></PartnerLayout>;

  return (
    <PartnerLayout title="Edit Listing" subtitle={form.name}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
        <MdArrowBack /> Back to Listings
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }} className="flex-mobile-col">
        {/* Main Form */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', padding: '32px' }} className="p-16">
          <h3 style={{ fontWeight: 800, marginBottom: '24px' }}>Property Details</h3>
          
          <div className="form-group">
            <label className="form-label">PG/Hostel Name *</label>
            <input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Royal Executive PG" />
          </div>

          <div className="grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-select" value={form.type} onChange={e => setField('type', e.target.value)}>
                {PG_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <select className="form-select" value={form.city} onChange={e => setField('city', e.target.value)}>
                {CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Locality/Area *</label>
            <input className="form-input" value={form.location} onChange={e => setField('location', e.target.value)} placeholder="e.g. Near Amity University" />
          </div>

          <div className="grid-3" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Base Rent (₹) *</label>
              <input className="form-input" type="number" value={form.rent} onChange={e => setField('rent', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Deposit (₹) *</label>
              <input className="form-input" type="number" value={form.deposit} onChange={e => setField('deposit', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sharing Rent (₹)</label>
              <input className="form-input" type="number" value={form.sharingRent} onChange={e => setField('sharingRent', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {AMENITY_OPTIONS.map(a => (
                <button key={a} onClick={() => toggleAmenity(a)} style={{
                  padding: '10px', borderRadius: '10px', border: '2px solid',
                  borderColor: form.amenities.includes(a) ? 'var(--primary)' : 'var(--border)',
                  background: form.amenities.includes(a) ? 'var(--primary-bg)' : 'white',
                  color: form.amenities.includes(a) ? 'var(--primary)' : 'var(--text-medium)',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                }}>
                  {form.amenities.includes(a) ? '✓ ' : '+ '}{a}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" rows={4} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Describe your property, mess quality, timings, etc." />
          </div>
        </div>

        {/* Image Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', padding: '24px' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '16px' }}>Property Photos</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Upload up to 10 photos of your PG (rooms, mess, entrance).</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {/* Existing Images */}
              {form.existingImages.map((url, i) => (
                <div key={`old-${i}`} style={{ position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="PG" />
                  <button onClick={() => removeExistingImage(url)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                    <MdDelete size={14} />
                  </button>
                </div>
              ))}
              
              {/* New Images */}
              {form.newImages.map((img, i) => (
                <div key={`new-${i}`} style={{ position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--primary)', boxShadow: '0 0 0 2px var(--primary-bg)' }}>
                  <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="New PG" />
                  <button onClick={() => removeNewImage(img.url)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>
                    <MdClose size={14} />
                  </button>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'var(--primary)', color: 'white', fontSize: '8px', textAlign: 'center', padding: '2px', fontWeight: 800 }}>NEW</div>
                </div>
              ))}

              {form.existingImages.length + form.newImages.length < 10 && (
                <label style={{ height: '100px', borderRadius: '12px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '4px', color: '#999', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <MdCloudUpload size={24} />
                  <span style={{ fontSize: '10px', fontWeight: 700 }}>Add Photo</span>
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </label>
              )}
            </div>

            <button className="btn btn-primary w-full" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : <><MdSave /> Save Changes</>}
            </button>
            <button className="btn btn-ghost w-full" style={{ marginTop: '12px' }} onClick={() => navigate(-1)}>Cancel</button>
          </div>

          <div style={{ background: '#FEF2F2', borderRadius: '24px', border: '1px solid #FCA5A5', padding: '20px', color: '#991B1B' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>Security Note</h4>
            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>Changes to rent or location may require re-verification by the HostelPass admin team.</p>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
};

export default EditListing;
