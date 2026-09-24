const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-blue to-royal-blue/90 text-bone py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Connect. Collaborate. Create.
              </h1>
              <p className="text-xl text-powder-blue leading-relaxed">
                GigFlow brings together talented freelancers and ambitious clients. 
                Whether you're looking to hire or get hired, your next opportunity starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="/gigs">
                  <button className="px-8 py-4 bg-bone text-royal-blue rounded-lg font-bold text-lg hover:bg-powder-blue transition-all duration-200 shadow-xl cursor-pointer">
                    Browse Gigs
                  </button>
                </a>
                <a href="/create-gig">
                  <button className="px-8 py-4 bg-powder-blue text-royal-blue rounded-lg font-bold text-lg hover:bg-bone transition-all duration-200 shadow-xl cursor-pointer">
                    Post a Job
                  </button>
                </a>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="hidden md:block">
              <div className="bg-powder-blue rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-royal-blue rounded-full"></div>
                      <div className="flex-1 h-4 bg-powder-blue rounded"></div>
                    </div>
                    <div className="h-3 bg-powder-blue rounded mb-2"></div>
                    <div className="h-3 bg-powder-blue rounded w-2/3"></div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-royal-blue rounded-full"></div>
                      <div className="flex-1 h-4 bg-powder-blue rounded"></div>
                    </div>
                    <div className="h-3 bg-powder-blue rounded mb-2"></div>
                    <div className="h-3 bg-powder-blue rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-bone">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-royal-blue mb-4">Why Choose GigFlow?</h2>
            <p className="text-xl text-royal-blue opacity-80">
              Everything you need to succeed in the freelance marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-powder-blue hover:border-royal-blue transition-all duration-300">
              <div className="w-16 h-16 bg-powder-blue rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-royal-blue mb-3">Find Perfect Gigs</h3>
              <p className="text-royal-blue leading-relaxed">
                Browse through hundreds of job opportunities tailored to your skills and expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-powder-blue hover:border-royal-blue transition-all duration-300">
              <div className="w-16 h-16 bg-powder-blue rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-royal-blue mb-3">Hire Top Talent</h3>
              <p className="text-royal-blue leading-relaxed">
                Connect with skilled freelancers ready to bring your project to life.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-powder-blue hover:border-royal-blue transition-all duration-300">
              <div className="w-16 h-16 bg-powder-blue rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-royal-blue mb-3">Secure Platform</h3>
              <p className="text-royal-blue leading-relaxed">
                Work with confidence knowing your data and transactions are protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-royal-blue to-royal-blue/90 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-bone mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-powder-blue mb-8">
            Join thousands of freelancers and clients building their success story on GigFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="px-10 py-4 bg-bone text-royal-blue rounded-lg font-bold text-lg hover:bg-powder-blue transition-all duration-200 shadow-xl cursor-pointer">
                Sign Up Free
              </button>
            </a>
            <a href="/gigs">
              <button className="px-10 py-4 border-2 border-bone text-bone rounded-lg font-bold text-lg hover:bg-bone hover:text-royal-blue transition-all duration-200 cursor-pointer">
                Explore Gigs
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-powder-blue">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-royal-blue mb-2">1000+</div>
              <div className="text-royal-blue font-semibold">Active Gigs</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-royal-blue mb-2">5000+</div>
              <div className="text-royal-blue font-semibold">Freelancers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-royal-blue mb-2">2000+</div>
              <div className="text-royal-blue font-semibold">Clients</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-royal-blue mb-2">98%</div>
              <div className="text-royal-blue font-semibold">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
