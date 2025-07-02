# MyJobTrack

A modern, mobile-first job tracking application designed specifically for service providers. Manage customers, schedule jobs, and track payments with powerful QR code integration.

## 🚀 Features

### Core Functionality
- **Customer Management**: Add, edit, and organize customer information
- **Job Scheduling**: Schedule and track jobs with status updates
- **Payment Tracking**: Monitor paid/unpaid jobs and earnings
- **Dashboard**: Quick overview of today's jobs and key metrics

### QR Code Integration
- **Generate QR Codes**: Create unique QR codes for customers and jobs
- **Mobile Scanning**: Built-in QR scanner for on-site access
- **Instant Access**: Scan codes to quickly view customer/job details

### Modern Features
- **Progressive Web App (PWA)**: Install on mobile devices
- **Offline Support**: Works without internet connection
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for mobile and desktop

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **QR Codes**: qrcode + qr-scanner libraries
- **Date Handling**: date-fns
- **Storage**: Local Storage (client-side)

## 📱 Demo Account

The app includes a demo account for testing:
- **Email**: `demo@myjobtrack.app`
- **Password**: `demo123`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Customer/        # Customer-related components
│   ├── Job/             # Job-related components
│   ├── Layout/          # Layout and navigation
│   ├── QR/              # QR code functionality
│   └── UI/              # Generic UI components
├── contexts/            # React contexts (Auth, Theme)
├── data/                # Data layer
│   └── providers/       # Data providers and storage implementations
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── main.tsx            # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-job-track
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📋 Usage Guide

### Getting Started
1. **Sign Up/Login**: Create an account or use the demo account
2. **Add Customers**: Start by adding your first customer
3. **Schedule Jobs**: Create jobs for your customers
4. **Generate QR Codes**: Create QR codes from customer/job detail pages
5. **On-Site Scanning**: Use the scanner to access information quickly

### QR Code Workflow
1. **Generate**: Create QR codes for customers and jobs
2. **Print & Place**: Print codes and place them at customer locations
3. **Scan On-Site**: Use the mobile scanner to access info instantly
4. **Update Status**: Mark jobs as in-progress or completed

## 🎯 Target Users

Perfect for service providers including:
- Landscapers & Lawn Care
- House Cleaning Services
- Handyman Services
- Pool Maintenance
- Pest Control
- HVAC Technicians
- Plumbers & Electricians
- And many more!

## 🔧 Configuration

### PWA Settings
The app is configured as a PWA with:
- Offline caching via service worker
- Install prompts on mobile devices
- Standalone app experience

### Data Storage
- All data stored locally using browser localStorage
- No server required - fully client-side
- Data persists between sessions

## 🚀 Deployment

MyJobTrack includes comprehensive deployment scripts for different scenarios:

```bash
# Production deployment (recommended for releases)
./scripts/deployment/deploy.sh production

# Fresh deployment with cache busting
./scripts/deployment/deploy.sh fresh

# Quick deployment for testing
./scripts/deployment/deploy.sh quick
```

**Deployment Features:**
- ✅ Automated build versioning with git hash
- ✅ Icon cache busting for fresh updates
- ✅ Multiple deployment strategies
- ✅ Build validation and linting
- ✅ Production optimization

For detailed deployment instructions, see [`scripts/deployment/README.md`](scripts/deployment/README.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the user guide in the app settings
- Review the feature documentation

## 🔮 Roadmap

- [ ] Backend API integration
- [ ] Multi-user support
- [ ] Advanced reporting
- [ ] Calendar integration
- [ ] SMS/Email notifications
- [ ] Photo attachments for jobs
- [ ] Time tracking
- [ ] Invoice generation

---

**Made with ❤️ for service providers who need simple, effective job tracking.**
