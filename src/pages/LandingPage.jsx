import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, Shield, Cpu, Globe, FileText, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-saffron rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
                Government of India Initiative
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Unified Government<br />
                <span className="text-saffron">Opportunities</span> &<br />
                <span className="text-green">Verification</span> App
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-lg">
                Discover, apply, and track government schemes, jobs, and competitive exams — all in one secure platform powered by AI.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                      Get Started <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all font-semibold">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="card bg-white/10 border-white/20 backdrop-blur">
                    <FileText className="text-saffron mb-2" size={28} />
                    <h3 className="font-bold text-white">12,500+</h3>
                    <p className="text-slate-400 text-sm">Opportunities Listed</p>
                  </div>
                  <div className="card bg-white/10 border-white/20 backdrop-blur">
                    <Users className="text-green mb-2" size={28} />
                    <h3 className="font-bold text-white">2.8M+</h3>
                    <p className="text-slate-400 text-sm">Active Users</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="card bg-white/10 border-white/20 backdrop-blur">
                    <CheckCircle className="text-blue-400 mb-2" size={28} />
                    <h3 className="font-bold text-white">98.5%</h3>
                    <p className="text-slate-400 text-sm">User Satisfaction</p>
                  </div>
                  <div className="card bg-white/10 border-white/20 backdrop-blur">
                    <TrendingUp className="text-saffron mb-2" size={28} />
                    <h3 className="font-bold text-white">850K+</h3>
                    <p className="text-slate-400 text-sm">Applications Tracked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tricolor Divider */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-saffron"></div>
        <div className="flex-1 bg-white border-y border-slate-200"></div>
        <div className="flex-1 bg-green"></div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Everything You Need in One Platform</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">UGOVA simplifies access to government opportunities through smart automation and a citizen-first design.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield size={32} className="text-saffron" />}
              title="Verified & Secure"
              desc="OTP-based mobile verification, JWT authentication, and role-based access control for maximum security."
            />
            <FeatureCard
              icon={<Cpu size={32} className="text-green" />}
              title="AI-Powered Fetching"
              desc="Automated data collection from government portals ensures real-time updates with zero manual work."
            />
            <FeatureCard
              icon={<Globe size={32} className="text-blue-500" />}
              title="Unified Tracking"
              desc="Track all your applications in one dashboard — schemes, exams, and jobs with real-time status updates."
            />
          </div>
        </div>
      </section>

      {/* Opportunity Types Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Three Pillars of UGOVA</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Browse opportunities across all three major categories that matter to Indian citizens.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto bg-light-saffron rounded-2xl flex items-center justify-center mb-4">
                <FileText size={32} className="text-saffron" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Government Schemes</h3>
              <p className="text-slate-600 text-sm">Welfare programs, subsidies, and financial assistance schemes from central and state governments.</p>
            </div>
            <div className="card text-center group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Competitive Exams</h3>
              <p className="text-slate-600 text-sm">UPSC, SSC, Banking, Railway, and other entrance examinations with complete eligibility details.</p>
            </div>
            <div className="card text-center group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto bg-light-green rounded-2xl flex items-center justify-center mb-4">
                <Users size={32} className="text-green" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Government Jobs</h3>
              <p className="text-slate-600 text-sm">Central and state government job openings across all departments and ministries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-saffron rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Explore Government Opportunities?</h2>
          <p className="text-slate-300 text-lg mb-8">Join millions of citizens who trust UGOVA for their government opportunity discovery and tracking needs.</p>
          {!user && (
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Create Free Account <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
