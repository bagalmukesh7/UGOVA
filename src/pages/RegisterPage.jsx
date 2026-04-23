import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserPlus, Mail, Lock, User, BookOpen, MapPin, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    education: '',
    state: '',
    city: '',
    age: '',
    category: 'General',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        return 'All fields are required';
      }
      if (form.password !== form.confirmPassword) {
        return 'Passwords do not match';
      }
      if (form.password.length < 6) {
        return 'Password must be at least 6 characters';
      }
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = form;
      const res = await axios.post('/api/auth/register', submitData);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
  ];

  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-saffron rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-navy">Create Your Account</h1>
          <p className="text-slate-500 text-sm mt-1">Step {step} of 2 — Complete your profile</p>

          {/* Progress bar */}
          <div className="flex gap-2 mt-4 max-w-xs mx-auto">
            <div className={`h-2 rounded-full flex-1 ${step >= 1 ? 'bg-saffron' : 'bg-slate-200'}`}></div>
            <div className={`h-2 rounded-full flex-1 ${step >= 2 ? 'bg-saffron' : 'bg-slate-200'}`}></div>
          </div>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" className="input-field pl-10" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field pl-10" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="input-field pl-10" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className="input-field pl-10" required />
                  </div>
                </div>
                <button type="button" onClick={handleNext} className="w-full btn-primary flex items-center justify-center gap-2">
                  Next Step <ChevronRight size={18} />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className="input-field" maxLength={10} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="education" value={form.education} onChange={handleChange} placeholder="e.g., Bachelor of Engineering" className="input-field pl-10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select name="state" value={form.state} onChange={handleChange} className="input-field pl-10 appearance-none">
                        <option value="">Select</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" className="input-field pl-10" min={18} max={100} />
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
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium flex items-center justify-center gap-1">
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? 'Creating...' : <><UserPlus size={18} /> Create Account</>}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-saffron font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
