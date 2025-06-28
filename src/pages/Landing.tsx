import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  QrCode, 
  Smartphone, 
  ArrowRight,
  Star,
  Shield,
  Zap
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Keep track of all your customers with their contact info, service history, and payment status.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Calendar,
      title: 'Job Scheduling',
      description: 'Schedule and track jobs with ease. See your daily schedule at a glance.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: QrCode,
      title: 'QR Code Integration',
      description: 'Generate QR codes for customers and jobs. Scan on-site for instant access to information.',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: DollarSign,
      title: 'Payment Tracking',
      description: 'Track payments and see which jobs are still unpaid. Never miss a payment again.',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Designed specifically for mobile use with large buttons and simple navigation.'
    },
    {
      icon: Shield,
      title: 'Works Offline',
      description: 'Your data is stored locally on your device. No internet required after setup.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Add customers and schedule jobs in under 2 minutes. Built for speed.'
    }
  ];

  const testimonials = [
    {
      name: 'Mike Johnson',
      business: 'Johnson Landscaping',
      quote: 'This app has transformed how I manage my business. The QR codes are a game-changer!',
      rating: 5
    },
    {
      name: 'Sarah Davis',
      business: 'Clean & Shine Services',
      quote: 'So simple to use. I can track all my jobs and payments without any hassle.',
      rating: 5
    },
    {
      name: 'Tom Wilson',
      business: 'Wilson Handyman',
      quote: 'Perfect for small service businesses. Everything I need in one place.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-600 dark:bg-blue-500 p-4 rounded-2xl shadow-lg">
                <Calendar className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
              MyJobTrack
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-200">
              The simple job tracking app designed for service providers. Manage customers, schedule jobs, 
              and track payments with powerful QR code integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/app')}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white hover:bg-gray-50 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500 transition-all duration-200"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

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
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg mr-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MyJobTrack</span>
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