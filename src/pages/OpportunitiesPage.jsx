import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ExternalLink, CheckCircle, X, SlidersHorizontal } from 'lucide-react';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    search: '',
  });
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchOpportunities();
    fetchApplications();
  }, [filters.type, filters.location]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.location !== 'all') params.location = filters.location;
      const res = await axios.get('/api/opportunities', { params });
      setOpportunities(res.data);
    } catch (err) {
      console.error('Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/applications');
      const ids = new Set(res.data.map(a => a.opportunityId));
      setAppliedIds(ids);
    } catch (err) {
      console.error('Failed to fetch applications');
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const filtered = opportunities.filter(o =>
    !filters.search ||
    o.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    o.organization.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleApply = async (opportunity) => {
    if (appliedIds.has(opportunity.id)) return;
    try {
      const res = await axios.post('/api/applications', { opportunityId: opportunity.id });
      setAppliedIds(new Set([...appliedIds, opportunity.id]));
      setNotification('Application recorded! Check your email and dashboard.');
      // Open official URL in new tab
      if (opportunity.url) {
        window.open(opportunity.url, '_blank');
      }
      setTimeout(() => setNotification(''), 5000);
    } catch (err) {
      if (err.response?.data?.message?.includes('Already applied')) {
        setNotification('You have already applied for this opportunity.');
      } else {
        setNotification('Failed to record application. Please try again.');
      }
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const typeColors = {
    scheme: { bg: 'bg-light-saffron', text: 'text-saffron', badge: 'bg-saffron/10' },
    job: { bg: 'bg-light-green', text: 'text-green', badge: 'bg-green/10' },
    exam: { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">Government Opportunities</h1>
        <p className="text-slate-500">Browse and apply for schemes, jobs, and competitive exams</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mb-6 bg-green/10 border border-green/30 text-green rounded-lg px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">{notification}</span>
          <button onClick={() => setNotification('')} className="ml-auto text-green hover:text-green/80">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search by title or organization..."
            className="input-field pl-10 w-full"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
        >
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input-field appearance-none"
              >
                <option value="all">All Types</option>
                <option value="scheme">Schemes</option>
                <option value="job">Jobs</option>
                <option value="exam">Exams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="input-field appearance-none"
              >
                <option value="all">All Locations</option>
                <option value="All India">All India</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Type Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'scheme', 'job', 'exam'].map(t => (
          <button
            key={t}
            onClick={() => setFilters({ ...filters, type: t })}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filters.type === t
                ? 'bg-saffron text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-full mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Filter size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No opportunities found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(opp => {
            const colors = typeColors[opp.type] || typeColors.job;
            const isApplied = appliedIds.has(opp.id);
            return (
              <div key={opp.id} className="card flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize ${colors.badge} ${colors.text}`}>
                    {opp.type}
                  </span>
                  <span className="text-xs text-slate-400">{opp.location}</span>
                </div>
                <h3 className="font-bold text-navy text-lg mb-1 leading-snug">{opp.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{opp.organization}</p>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">{opp.description}</p>

                <div className="space-y-2 mb-4 text-xs text-slate-500">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-slate-600 min-w-[60px]">Eligible:</span>
                    <span className="line-clamp-2">{opp.eligibility}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-600 min-w-[60px]">Deadline:</span>
                    <span className="text-red-600 font-medium">{new Date(opp.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleApply(opp)}
                    disabled={isApplied}
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1 ${
                      isApplied
                        ? 'bg-green/10 text-green cursor-default'
                        : 'bg-saffron text-white hover:bg-orange-600 shadow-sm'
                    }`}
                  >
                    {isApplied ? <><CheckCircle size={16} /> Applied</> : 'Apply Now'}
                  </button>
                  {opp.url && (
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 transition-all"
                      title="View Official Website"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
