import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/UI/ThemeToggle';
import Logo from '@/components/UI/Logo';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  QrCode, 
  Smartphone, 
  ArrowRight,
  Star,
  Shield,
  Zap,
  LogIn
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Simple Customer Tracking',
      description: 'Add customers in seconds. Track their info, job history, and payment status. No complicated forms or endless fields.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Calendar,
      title: 'Easy Job Scheduling',
      description: 'Schedule jobs with a few taps. See your day at a glance. Perfect for landscapers and handymen on the go.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: QrCode,
      title: 'QR Code Magic',
      description: 'Generate QR codes for job sites. Scan to instantly pull up customer info and job details. Works offline too.',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: DollarSign,
      title: 'Get Paid Faster',
      description: 'Track who owes you money at a glance. Mark jobs as paid with one tap. Never lose track of payments again.',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: 'Built for Your Phone',
      description: 'Large buttons, simple navigation. Use it with gloves on. Works great even in bright sunlight.'
    },
    {
      icon: Shield,
      title: 'No Learning Curve',
      description: 'If you can text, you can use MyJobTrack. Set up in 5 minutes. Start tracking jobs immediately.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Add customers in 30 seconds. Schedule jobs in 1 minute. Built for busy landscapers and handymen.'
    }
  ];

  const testimonials = [
    {
      name: 'Mike Johnson',
      business: 'Johnson Landscaping',
      quote: 'Finally, software that actually makes sense! No confusing menus, just simple job tracking.',
      rating: 5
    },
    {
      name: 'Sarah Martinez',
      business: 'Fix-It Handyman Services', 
      quote: 'I went from paper chaos to organized in one afternoon. The QR codes save me so much time on job sites.',
      rating: 5
    },
    {
      name: 'Tom Wilson', 
      business: 'Wilson Contracting',
      quote: 'Been using this for 6 months. Simple, fast, and it just works. No more lost paperwork!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MyJobTrack",
            "url": "https://myjobtrack.app",
            "description": "Simple CRM software built specifically for landscapers, handymen, contractors and service professionals. Easy job tracking, customer management, and payment tracking without the complexity.",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "creator": {
              "@type": "Organization",
              "name": "MyJobTrack"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Landscapers, Handymen, Contractors, Service Professionals"
            }
          })
        }}
      />

      {/* Top Navigation Bar */}
      <nav className="relative z-10 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Logo 
              size="md"
              variant="horizontal"
              theme="colored"
              clickable={false}
            />

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle size="sm" />
              
              {/* Sign In Button */}
              <button
                onClick={() => navigate('/login')}
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 border border-gray-300 dark:border-dark-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <header className="relative overflow-hidden" role="banner">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero.png"
            alt="MyJobTrack app interface showing job tracking, customer management, and payment features"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-purple-900/85 dark:from-blue-950/90 dark:via-blue-900/85 dark:to-purple-950/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo 
                size="xl"
                variant="icon-only"
                theme="white"
                clickable={false}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30"
              />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span itemProp="name">MyJobTrack</span>
              <span className="sr-only">- Simple CRM for Landscapers, Handymen & Service Pros</span>
            </h1>
            <h2 className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              <span className="text-green-300 font-semibold">Simple CRM</span> built for 
              <span className="font-semibold text-white"> Landscapers, Handymen & Contractors</span>
            </h2>
            <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Track jobs, manage customers, and get paid faster. <strong className="text-white">No complexity, no learning curve</strong> - 
              just what you need to run your landscaping, handyman, or contracting business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/app')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center group border-2 border-green-500 hover:border-green-400"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-blue-100 hover:text-white px-4 py-2 text-lg font-medium transition-colors duration-200 underline decoration-2 underline-offset-4 decoration-blue-300 hover:decoration-white"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
              Everything You Need to Run Your Service Business
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
              Built specifically for landscapers, cleaners, handymen, and other service providers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200 border border-transparent dark:border-dark-600">
                <div className={`${feature.color} mb-4`}>
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code Showcase */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <QrCode className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Revolutionary QR Code Integration
            </h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Generate QR codes for customers and jobs. Stick them on properties, 
              scan on-site for instant access. It's like magic for your workflow.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Generate QR Codes</h3>
                <p className="opacity-90">Create unique QR codes for each customer and job automatically.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Place On-Site</h3>
                <p className="opacity-90">Print and stick QR codes at customer properties for easy access.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Scan & Work</h3>
                <p className="opacity-90">Scan to instantly access customer info and mark jobs complete.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
              Why Service Providers Love MyJobTrack
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
              Designed by service providers, for service providers. Simple, fast, and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                  <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
              Trusted by Service Providers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-200">
              See what our users have to say about MyJobTrack.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-8 border border-transparent dark:border-dark-600 transition-colors duration-200">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic transition-colors duration-200">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">{testimonial.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-950 dark:to-dark-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Service Business?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 leading-relaxed">
            Join thousands of service providers who have streamlined their operations with MyJobTrack.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/app')}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center group"
            >
              Start Using MyJobTrack
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-gray-400 dark:text-gray-500">
              No signup required • Works offline • Free forever
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-950 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo 
                size="md"
                variant="horizontal"
                theme="white"
                clickable={false}
              />
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-center md:text-right transition-colors duration-200">
              <p>Built for service providers who value simplicity.</p>
              <p className="mt-1">© 2024 MyJobTrack. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;