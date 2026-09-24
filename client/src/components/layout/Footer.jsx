const Footer = () => {
  return (
    <footer className="bg-royal-blue mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-powder-blue rounded-lg px-4 py-2 inline-block mb-4">
              <span className="text-2xl font-bold text-royal-blue">GigFlow</span>
            </div>
            <p className="text-bone mb-4 leading-relaxed">
              Your trusted platform for connecting talented freelancers with exciting projects. 
              Build your career or grow your business with GigFlow.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-powder-blue rounded-full flex items-center justify-center hover:bg-bone transition-colors duration-200">
                <span className="text-royal-blue font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-powder-blue rounded-full flex items-center justify-center hover:bg-bone transition-colors duration-200">
                <span className="text-royal-blue font-bold">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-powder-blue rounded-full flex items-center justify-center hover:bg-bone transition-colors duration-200">
                <span className="text-royal-blue font-bold">X</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-powder-blue font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/gigs" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  Browse Gigs
                </a>
              </li>
              <li>
                <a href="/create-gig" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="/my-gigs" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  My Gigs
                </a>
              </li>
              <li>
                <a href="/my-bids" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  My Bids
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-powder-blue font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-bone hover:text-blue-600 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-powder-blue mt-8 pt-8 text-center">
          <p className="text-bone text-sm">
            © 2026 GigFlow. All rights reserved. Built with ❤️ for freelancers and clients.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
