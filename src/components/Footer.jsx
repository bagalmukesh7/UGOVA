export default function Footer() {
  return (
    <footer className="bg-navy text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">UGOVA</h3>
            <p className="text-slate-400 text-sm">Unified Government Opportunities & Verification App — Empowering Indian citizens with easy access to government schemes, jobs, and exams.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li><a href="#" className="hover:text-saffron transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-saffron transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-slate-400 text-sm">support@ugova.gov.in</p>
            <p className="text-slate-400 text-sm">New Delhi, India</p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-6 pt-6 text-center text-sm text-slate-500">
          &copy; 2024 UGOVA. All rights reserved. Government of India Initiative.
        </div>
      </div>
    </footer>
  );
}
