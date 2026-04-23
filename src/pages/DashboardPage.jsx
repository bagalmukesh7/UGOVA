import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Briefcase, FileCheck, Clock, Award, ArrowRight, TrendingUp, FileText, Users, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/user/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Dashboard fetch failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saffron"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-navy rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-slate-300">Here's what's happening with your applications today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Briefcase size={20} className="text-saffron" />} label="Total" value={stats?.totalApplications || 0} />
        <StatCard icon={<Clock size={20} className="text-blue-500" />} label="Pending" value={stats?.pending || 0} />
        <StatCard icon={<FileCheck size={20} className="text-green" />} label="Applied" value={stats?.applied || 0} />
        <StatCard icon={<Award size={20} className="text-purple-500" />} label="Approved" value={stats?.approved || 0} />
      </div>

      {/* Profile Completion + Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="card md:col-span-1">
          <h3 className="font-bold text-navy mb-4">Profile Completion</h3>
          <div className="relative h-3 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-saffron rounded-full transition-all duration-500"
              style={{ width: `${stats?.profileComplete || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500 mb-4">{stats?.profileComplete || 0}% complete</p>
          <Link to="/profile" className="text-sm text-saffron font-medium hover:underline flex items-center gap-1">
            Complete Profile <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="card md:col-span-2">
          <h3 className="font-bold text-navy mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to="/opportunities?type=scheme" className="flex items-center gap-3 p-4 rounded-xl bg-light-saffron hover:bg-orange-100 transition-colors">
              <div className="w-10 h-10 bg-saffron/20 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-saffron" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Browse Schemes</p>
                <p className="text-xs text-slate-500">Find government schemes</p>
              </div>
            </Link>
            <Link to="/opportunities?type=job" className="flex items-center gap-3 p-4 rounded-xl bg-light-green hover:bg-emerald-100 transition-colors">
              <div className="w-10 h-10 bg-green/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-green" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Find Jobs</p>
                <p className="text-xs text-slate-500">Government job openings</p>
              </div>
            </Link>
            <Link to="/opportunities?type=exam" className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">Upcoming Exams</p>
                <p className="text-xs text-slate-500">Competitive examinations</p>
              </div>
            </Link>
            <Link to="/opportunities" className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm">View All</p>
                <p className="text-xs text-slate-500">All opportunities</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-navy">Recent Applications</h3>
          <Link to="/opportunities" className="text-sm text-saffron font-medium hover:underline flex items-center gap-1">
            Browse More <ArrowRight size={14} />
          </Link>
        </div>
        {stats?.recentApplications?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Opportunity</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Organization</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentApplications.map(app => (
                  <tr key={app.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-navy">{app.opportunity?.title || 'Unknown'}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        app.opportunity?.type === 'scheme' ? 'bg-saffron/10 text-saffron' :
                        app.opportunity?.type === 'job' ? 'bg-green/10 text-green' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {app.opportunity?.type || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{app.opportunity?.organization || '-'}</td>
                    <td className="py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No applications yet. Start browsing opportunities!</p>
            <Link to="/opportunities" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
              Browse Opportunities <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold text-navy">{value}</span>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    applied: 'bg-blue-100 text-blue-700',
    approved: 'bg-green/10 text-green',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}
