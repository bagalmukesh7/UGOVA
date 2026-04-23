import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Phone, BookOpen, MapPin, Calendar, Shield, CheckCircle, AlertCircle, Send, KeyRound } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    education: user?.profile?.education || '',
    state: user?.profile?.state || '',
    city: user?.profile?.city || '',
    age: user?.profile?.age || '',
    category: user?.profile?.category || 'General',
  });
  const [otpForm, setOtpForm] = useState({ phone: '', otp: '', otpSent: false, otpVerified: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.put('/api/auth/profile', form);
      updateUser(res.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!otpForm.phone || otpForm.phone.length !== 10) {
      setMessage({ type: 'error', text: 'Enter a valid 10-digit mobile number' });
      return;
    }
    try {
      await axios.post('/api/auth/otp/send', { phone: otpForm.phone });
      setOtpForm({ ...otpForm, otpSent: true });
      setMessage({ type: 'success', text: 'OTP sent! Check console for demo OTP.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send OTP' });
    }
  };

  const verifyOtp = async () => {
    if (!otpForm.otp || otpForm.otp.length !== 6) {
      setMessage({ type: 'error', text: 'Enter 6-digit OTP' });
      return;
    }
    try {
      await axios.post('/api/auth/otp/verify', { otp: otpForm.otp });
      setOtpForm({ ...otpForm, otpVerified: true });
      setMessage({ type: 'success', text: 'Phone verified successfully!' });
      // Refresh user data
      const res = await axios.get('/api/auth/me');
      updateUser(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid OTP' });
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-navy mb-2">My Profile</h1>
      <p className="text-slate-500 mb-6">Manage your personal information and verification status</p>

      {message && (
        <div className={`mb-6 rounded-lg px-4 py-3 flex items-center gap-2 text-sm ${
          message.type === 'success' ? 'bg-green/10 border border-green/30 text-green' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* Verification Status Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={24} className="text-saffron" />
          <h2 className="text-lg font-bold text-navy">Account Status</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge icon={<CheckCircle size={14} />} label="Email Verified" active={true} />
          <StatusBadge icon={<Phone size={14} />} label="Phone Verified" active={user?.isVerified} />
          <StatusBadge icon={<KeyRound size={14} />} label="KYC Pending" active={false} />
        </div>
      </div>

      {/* Profile Form */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-navy mb-4">Personal Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" value={user?.email || ''} disabled className="input-field pl-10 bg-slate-50 text-slate-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Education</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" name="education" value={form.education} onChange={handleChange} placeholder="e.g., Bachelor of Technology" className="input-field pl-10" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select name="state" value={form.state} onChange={handleChange} className="input-field pl-10 appearance-none">
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className="input-field" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="number" name="age" value={form.age} onChange={handleChange} min={18} max={100} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field appearance-none">
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Phone Verification */}
      <div className="card">
        <h2 className="text-lg font-bold text-navy mb-4">Mobile Number Verification</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                value={otpForm.phone}
                onChange={(e) => setOtpForm({ ...otpForm, phone: e.target.value })}
                placeholder="Enter 10-digit mobile number"
                className="input-field pl-10"
                maxLength={10}
                disabled={otpForm.otpVerified}
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={otpForm.otpSent || otpForm.otpVerified}
              className="px-4 py-3 bg-green text-white rounded-lg font-medium hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center gap-1"
            >
              <Send size={16} /> {otpForm.otpSent ? 'Sent' : 'Send OTP'}
            </button>
          </div>

          {otpForm.otpSent && !otpForm.otpVerified && (
            <div className="flex gap-3">
              <div className="relative flex-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={otpForm.otp}
                  onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                  placeholder="Enter 6-digit OTP"
                  className="input-field pl-10"
                  maxLength={6}
                />
              </div>
              <button
                onClick={verifyOtp}
                className="px-4 py-3 bg-saffron text-white rounded-lg font-medium hover:bg-orange-600 transition-all"
              >
                Verify
              </button>
            </div>
          )}

          {otpForm.otpVerified && (
            <div className="flex items-center gap-2 text-green font-medium text-sm">
              <CheckCircle size={18} /> Phone number verified successfully!
            </div>
          )}

          <p className="text-xs text-slate-400">
            {user?.phone ? `Current phone: ${user.phone}` : 'No phone number linked yet.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ icon, label, active }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
      active ? 'bg-green/10 text-green' : 'bg-slate-100 text-slate-500'
    }`}>
      {icon}
      {label}
    </div>
  );
}
