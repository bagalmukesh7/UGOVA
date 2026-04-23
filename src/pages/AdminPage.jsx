import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, Briefcase, FileText, Activity, TrendingUp, Award, Cpu, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchAiStatus();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiStatus = async () => {
    try {
      const res = await axios.get('/api/ai/status');
      setAiStatus(res.data);
    } catch (err) {
      console.error('AI status fetch failed');
    }
  };

  const runAiFetch = async () => {
    try {
      const res = await axios.get('/api/ai/fetch');
      setAiStatus(prev => ({ ...prev, ...res.data }));
      fetchStats();
    } catch (err) {
      console.error('AI fetch failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saffron"></div>
      </div>
    );
  }

  const chartData = [
    { name: 'Schemes', value: stats?.totalSchemes || 0, color: '#FF671F' },
    { name: 'Jobs', value: stats?.totalJobs || 0, color: '#046A38' },
    { name: 'Exams', value: stats?.totalExams || 0, color: '#3B82F6' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'ai', label: 'AI System', icon: Cpu },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={28} className="text-saffron" />
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">System overview and management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'bg-saffron text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AdminStatCard icon={<Users size={20} className="text-blue-500" />} label="Users" value={stats?.totalUsers || 0} />
            <AdminStatCard icon={<Briefcase size={20} className="text-saffron" />} label="Applications" value={stats?.totalApplications || 0} />
            <AdminStatCard icon={<FileText size={20} className="text-purple-500" />} label="Opportunities" value={stats?.totalOpportunities || 0} />
            <AdminStatCard icon={<FileText size={20} className="text-saffron" />} label="Schemes" value={stats?.totalSchemes || 0} />
            <AdminStatCard icon={<Users size={20} className="text-green" />} label="Jobs" value={stats?.totalJobs || 0} />
            <AdminStatCard icon={<Award size={20} className="text-blue-500" />} label="Exams" value={stats?.totalExams || 0} />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold text-navy mb-4">Opportunity Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {chartData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ background: d.color }}></div>
                    <span className="text-sm text-slate-600">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="font-bold text-navy mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats?.recentApplications?.slice(0, 6).map((app, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="w-8 h-8 bg-saffron/10 rounded-full flex items-center justify-center">
                      <Activity size={14} className="text-saffron" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{app.user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{app.opportunity?.title}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {(!stats?.recentApplications || stats.recentApplications.length === 0) && (
                  <p className="text-center text-slate-400 py-8">No recent applications</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && <UsersTab stats={stats} />}

      {/* Applications Tab */}
      {activeTab === 'applications' && <ApplicationsTab />}

      {/* AI Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Cpu size={24} className="text-saffron" />
              <div>
                <h3 className="font-bold text-navy text-lg">AI Data Fetching System</h3>
                <p className="text-slate-500 text-sm">Automated opportunity collection from government portals</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                <p className="text-lg font-bold text-green mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green rounded-full animate-pulse"></span>
                  Active
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase font-semibold">Sources</p>
                <p className="text-lg font-bold text-navy mt-1">{aiStatus?.totalSources || 5}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase font-semibold">Opportunities</p>
                <p className="text-lg font-bold text-navy mt-1">{aiStatus?.opportunitiesInDb || 0}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase font-semibold">Uptime</p>
                <p className="text-lg font-bold text-navy mt-1">{aiStatus?.uptime || '99.9%'}</p>
              </div>
            </div>

            <button
              onClick={runAiFetch}
              className="btn-primary flex items-center gap-2"
            >
              <Cpu size={18} /> Run AI Fetch Now
            </button>
            <p className="text-xs text-slate-400 mt-3">Simulates fetching data from government portals (mock AI for demo)</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminStatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-2">
        {icon}
      </div>
      <p className="text-2xl font-bold text-navy">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function UsersTab({ stats }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Users fetch failed');
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-navy">Registered Users</h3>
        <span className="text-sm text-slate-500">{users.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Phone</th>
              <th className="pb-3 font-medium">Verified</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-3 font-medium text-navy">{user.name}</td>
                <td className="py-3 text-slate-600">{user.email}</td>
                <td className="py-3 text-slate-500">{user.phone || '-'}</td>
                <td className="py-3">
                  {user.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-green text-xs font-medium">
                      <CheckCircle size={12} /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                      <XCircle size={12} /> Pending
                    </span>
                  )}
                </td>
                <td className="py-3 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/admin/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Applications fetch failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status });
      fetchApplications();
    } catch (err) {
      console.error('Status update failed');
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-navy">All Applications</h3>
        <span className="text-sm text-slate-500">{applications.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Opportunity</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-3 font-medium text-navy">{app.user?.name || 'Unknown'}</td>
                <td className="py-3 text-slate-600 max-w-[200px] truncate">{app.opportunity?.title || '-'}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    app.opportunity?.type === 'scheme' ? 'bg-saffron/10 text-saffron' :
                    app.opportunity?.type === 'job' ? 'bg-green/10 text-green' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {app.opportunity?.type || 'N/A'}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'approved' ? 'bg-green/10 text-green' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button onClick={() => updateStatus(app.id, 'approved')} className="p-1 text-green hover:bg-green/10 rounded" title="Approve">
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => updateStatus(app.id, 'rejected')} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Reject">
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
