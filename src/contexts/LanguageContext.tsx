import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.customers': 'Customers',
    'nav.jobs': 'Jobs',
    'nav.payments': 'Payments',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.scan': 'Scan QR Code',
    'nav.signIn': 'Sign In',
    
    // Landing Page
    'landing.title': 'MyJobTrack - Simple CRM for Landscapers, Handymen & Service Pros',
    'landing.subtitle': 'Track customers, schedule jobs, and manage payments. Built specifically for service professionals who need simple tools that actually work.',
    'landing.qr.title': 'Revolutionary QR Code Integration',
    'landing.qr.subtitle': 'Generate QR codes for customers and jobs. Stick them on properties, scan on-site for instant access. It\'s like magic for your workflow.',
    'landing.qr.step1.title': 'Generate QR Codes',
    'landing.qr.step1.description': 'Create unique QR codes for each customer and job automatically.',
    'landing.qr.step2.title': 'Place On-Site',
    'landing.qr.step2.description': 'Print and stick QR codes at customer properties for easy access.',
    'landing.qr.step3.title': 'Scan & Work',
    'landing.qr.step3.description': 'Scan to instantly access customer info and mark jobs complete.',
    'landing.features.title': 'Everything You Need to Run Your Business',
    'landing.features.subtitle': 'Simple tools that actually work for service professionals',
    'landing.features.customers.title': 'Customer Management',
    'landing.features.customers.description': 'Keep track of customer details, contact info, and service history in one place',
    'landing.features.jobs.title': 'Job Scheduling',
    'landing.features.jobs.description': 'Schedule jobs, track progress, and manage your daily workload effortlessly',
    'landing.features.qr.title': 'QR Code Integration',
    'landing.features.qr.description': 'Generate QR codes for jobs and customers for quick on-site access',
    'landing.features.payments.title': 'Payment Tracking',
    'landing.features.payments.description': 'Know exactly who owes what and when payments are due',
    'landing.benefits.title': 'Why Service Professionals Choose MyJobTrack',
    'landing.benefits.subtitle': 'Built by professionals, for professionals. Simple, reliable, and designed for real-world use.',
    'landing.benefits.mobile.title': 'Mobile-First Design',
    'landing.benefits.mobile.description': 'Access your business from anywhere. Works perfectly on phones, tablets, and desktops.',
    'landing.benefits.simple.title': 'Simple & Intuitive',
    'landing.benefits.simple.description': 'No complicated setup or training required. Start managing your business in minutes.',
    'landing.benefits.offline.title': 'Works Offline',
    'landing.benefits.offline.description': 'Your data is always available, even without internet. Syncs when you\'re back online.',
    'landing.cta.title': 'Ready to Streamline Your Business?',
    'landing.cta.description': 'Join thousands of service professionals who trust MyJobTrack to manage their daily operations.',
    'landing.cta.demo': 'Try Demo',
    'landing.cta.start': 'Get Started',
    'landing.cta.secondary': 'Learn More',
    'landing.cta.demoNote': 'No signup required - explore all features instantly',
    'landing.cta.waitlist': 'Join Waitlist & Test Now',
    'landing.cta.earlyAccess': 'Get early access and test the app with local data storage',
    'landing.cta.testTitle': 'Ready to Test Job Track?',
    'landing.cta.testDescription': 'Join our waitlist and start testing immediately with local data storage.',
    'landing.cta.backToMain': '← Back to main page',
    
    // Authentication
    'auth.leftSideTitle': 'Everything You Need in One Place',
    'auth.leftSideSubtitle': 'Simple tools that work for real service professionals',
    'auth.features.customers': 'Customer Management',
    'auth.features.customersDesc': 'Keep track of customer details and service history',
    'auth.features.jobs': 'Job Scheduling',
    'auth.features.jobsDesc': 'Schedule and track jobs with ease',
    'auth.features.qr': 'QR Code Integration',
    'auth.features.qrDesc': 'Quick access with QR codes on-site',
    'auth.features.payments': 'Payment Tracking',
    'auth.features.paymentsDesc': 'Know who owes what and when',
    'auth.leftSideFeatures': 'Free to use with local data storage',
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInToAccount': 'Sign in to your account',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.emailRequired': 'Email is required',
    'auth.emailInvalid': 'Please enter a valid email',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.passwordRequired': 'Password is required',
    'auth.signIn': 'Sign In',
    'auth.signingIn': 'Signing In...',
    'auth.loginError': 'Invalid email or password',
    'auth.noAccount': "Don't have an account?",
    'auth.signUp': 'Sign Up',
    'auth.demo.title': 'Demo Account',
    'auth.demo.description': 'Try MyJobTrack with sample data. No registration required.',
    'auth.demo.autoFill': 'Auto-fill Demo Credentials',
    'auth.backToHome': 'Back to Home',
    
    // Dashboard
    'dashboard.welcome': 'Welcome Back!',
    'dashboard.todaysJobs': "Today's Jobs",
    'dashboard.thisWeek': 'This Week',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.addCustomer': 'Add Customer',
    'dashboard.scheduleJob': 'Schedule Job',
    'dashboard.viewCustomers': 'View Customers',
    'dashboard.scanQR': 'Scan QR Code',
    'dashboard.noJobsToday': 'No jobs scheduled for today',
    'dashboard.scheduleAJob': 'Schedule a Job',
    'dashboard.unpaid': 'Unpaid',
    'dashboard.notifications': 'Notifications',
    
    // Settings
    'settings.title': 'Settings',
    'settings.description': 'Manage your app preferences and data',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.languageDescription': 'Choose your preferred language',
    'settings.theme': 'Theme',
    'settings.themeDescription': 'Currently using {mode} mode',
    'settings.dataManagement': 'Data Management',
    'settings.exportData': 'Export Data',
    'settings.exportDescription': 'Download a backup of all your customers and jobs',
    'settings.importData': 'Import Data',
    'settings.importDescription': 'Restore data from a backup file',
    'settings.clearAllData': 'Clear All Data',
    'settings.clearDescription': 'Permanently delete all customers and jobs',
    'settings.appPreferences': 'App Preferences',
    'settings.notifications': 'Notifications',
    'settings.notificationsDescription': 'Enable push notifications for reminders',
    'settings.cacheManagement': 'Cache Management',
    'settings.cacheDescription': 'Clear cached data and check for updates',
    'settings.helpSupport': 'Help & Support',
    'settings.userGuide': 'User Guide',
    'settings.userGuideDescription': 'Learn how to use MyJobTrack',
    'settings.contactSupport': 'Contact Support',
    'settings.contactDescription': 'Get help with technical issues',
    'settings.featureRequests': 'Feature Requests',
    'settings.featureDescription': 'Suggest new features or improvements',
    'settings.appStatistics': 'App Statistics',
    'settings.aboutMyJobTrack': 'About MyJobTrack',
    'settings.features': 'Features',
    'settings.technicalInfo': 'Technical Info',
    'settings.version': 'Version',
    'settings.dataStorage': 'Data Storage: Local Browser',
    'settings.platform': 'Platform: Progressive Web App',
    'settings.lastUpdated': 'Last Updated',
    'settings.builtWith': 'Built with React & TypeScript',
    'settings.themeMode': 'Theme: {mode} Mode',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.total': 'Total',
    'common.customers': 'Customers',
    'common.jobs': 'Jobs',
    'common.paid': 'Paid',
    'common.unpaid': 'Unpaid',
    'common.completed': 'Completed',
    'common.scheduled': 'Scheduled',
    'common.inProgress': 'In Progress',
    'common.dark': 'Dark',
    'common.light': 'Light',
    'common.english': 'English',
    'common.spanish': 'Spanish',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.customers': 'Clientes',
    'nav.jobs': 'Trabajos',
    'nav.payments': 'Pagos',
    'nav.settings': 'Configuración',
    'nav.profile': 'Perfil',
    'nav.scan': 'Escanear QR',
    'nav.signIn': 'Iniciar Sesión',
    
    // Landing Page
    'landing.title': 'MyJobTrack - CRM Simple para Paisajistas, Técnicos y Profesionales de Servicios',
    'landing.subtitle': 'Rastrea clientes, programa trabajos y gestiona pagos. Construido específicamente para profesionales de servicios que necesitan herramientas simples que realmente funcionen.',
    'landing.qr.title': 'Integración Revolucionaria de Códigos QR',
    'landing.qr.subtitle': 'Genera códigos QR para clientes y trabajos. Pégalos en propiedades, escanea en el sitio para acceso instantáneo. Es como magia para tu flujo de trabajo.',
    'landing.qr.step1.title': 'Generar Códigos QR',
    'landing.qr.step1.description': 'Crea códigos QR únicos para cada cliente y trabajo automáticamente.',
    'landing.qr.step2.title': 'Colocar en el Sitio',
    'landing.qr.step2.description': 'Imprime y pega códigos QR en propiedades de clientes para fácil acceso.',
    'landing.qr.step3.title': 'Escanear y Trabajar',
    'landing.qr.step3.description': 'Escanea para acceder instantáneamente a información del cliente y marcar trabajos completos.',
    'landing.features.title': 'Todo lo que Necesitas para Manejar tu Negocio',
    'landing.features.subtitle': 'Herramientas simples que realmente funcionan para profesionales de servicios',
    'landing.features.customers.title': 'Gestión de Clientes',
    'landing.features.customers.description': 'Mantén registro de detalles de clientes, información de contacto e historial de servicios en un lugar',
    'landing.features.jobs.title': 'Programación de Trabajos',
    'landing.features.jobs.description': 'Programa trabajos, rastrea progreso y gestiona tu carga de trabajo diaria sin esfuerzo',
    'landing.features.qr.title': 'Integración de Código QR',
    'landing.features.qr.description': 'Genera códigos QR para trabajos y clientes para acceso rápido en el sitio',
    'landing.features.payments.title': 'Seguimiento de Pagos',
    'landing.features.payments.description': 'Sabe exactamente quién debe qué y cuándo vencen los pagos',
    'landing.benefits.title': 'Por Qué los Profesionales de Servicios Eligen MyJobTrack',
    'landing.benefits.subtitle': 'Construido por profesionales, para profesionales. Simple, confiable y diseñado para uso en el mundo real.',
    'landing.benefits.mobile.title': 'Diseño Mobile-First',
    'landing.benefits.mobile.description': 'Accede a tu negocio desde cualquier lugar. Funciona perfectamente en teléfonos, tabletas y computadoras.',
    'landing.benefits.simple.title': 'Simple e Intuitivo',
    'landing.benefits.simple.description': 'No se requiere configuración complicada o entrenamiento. Comienza a gestionar tu negocio en minutos.',
    'landing.benefits.offline.title': 'Funciona Sin Conexión',
    'landing.benefits.offline.description': 'Tus datos están siempre disponibles, incluso sin internet. Se sincroniza cuando vuelves a estar en línea.',
    'landing.cta.title': '¿Listo para Optimizar tu Negocio?',
    'landing.cta.description': 'Únete a miles de profesionales de servicios que confían en MyJobTrack para gestionar sus operaciones diarias.',
    'landing.cta.demo': 'Probar Demo',
    'landing.cta.start': 'Comenzar',
    'landing.cta.secondary': 'Saber Más',
    'landing.cta.demoNote': 'No se requiere registro - explora todas las funciones al instante',
    'landing.cta.waitlist': 'Unirse a Lista de Espera y Probar Ahora',
    'landing.cta.earlyAccess': 'Obtén acceso anticipado y prueba la aplicación con almacenamiento de datos local',
    'landing.cta.testTitle': '¿Listo para Probar Job Track?',
    'landing.cta.testDescription': 'Únete a nuestra lista de espera y comienza a probar inmediatamente con almacenamiento de datos local.',
    'landing.cta.backToMain': '← Volver a la página principal',
    
    // Authentication
    'auth.leftSideTitle': 'Todo lo que Necesitas en Un Solo Lugar',
    'auth.leftSideSubtitle': 'Herramientas simples que funcionan para profesionales de servicios reales',
    'auth.features.customers': 'Gestión de Clientes',
    'auth.features.customersDesc': 'Mantén registro de detalles de clientes e historial de servicios',
    'auth.features.jobs': 'Programación de Trabajos',
    'auth.features.jobsDesc': 'Programa y rastrea trabajos con facilidad',
    'auth.features.qr': 'Integración de Código QR',
    'auth.features.qrDesc': 'Acceso rápido con códigos QR en el sitio',
    'auth.features.payments': 'Seguimiento de Pagos',
    'auth.features.paymentsDesc': 'Sabe quién debe qué y cuándo',
    'auth.leftSideFeatures': 'Gratis de usar con almacenamiento de datos local',
    'auth.welcomeBack': 'Bienvenido de Vuelta',
    'auth.signInToAccount': 'Inicia sesión en tu cuenta',
    'auth.email': 'Correo Electrónico',
    'auth.emailPlaceholder': 'Ingresa tu correo electrónico',
    'auth.emailRequired': 'El correo electrónico es requerido',
    'auth.emailInvalid': 'Por favor ingresa un correo electrónico válido',
    'auth.password': 'Contraseña',
    'auth.passwordPlaceholder': 'Ingresa tu contraseña',
    'auth.passwordRequired': 'La contraseña es requerida',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signingIn': 'Iniciando Sesión...',
    'auth.loginError': 'Correo electrónico o contraseña inválidos',
    'auth.noAccount': '¿No tienes una cuenta?',
    'auth.signUp': 'Registrarse',
    'auth.demo.title': 'Cuenta de Demostración',
    'auth.demo.description': 'Prueba MyJobTrack con datos de muestra. No se requiere registro.',
    'auth.demo.autoFill': 'Auto-llenar Credenciales de Demo',
    'auth.backToHome': 'Volver al Inicio',
    
    // Dashboard
    'dashboard.welcome': '¡Bienvenido de Vuelta!',
    'dashboard.todaysJobs': 'Trabajos de Hoy',
    'dashboard.thisWeek': 'Esta Semana',
    'dashboard.quickActions': 'Acciones Rápidas',
    'dashboard.addCustomer': 'Agregar Cliente',
    'dashboard.scheduleJob': 'Programar Trabajo',
    'dashboard.viewCustomers': 'Ver Clientes',
    'dashboard.scanQR': 'Escanear QR',
    'dashboard.noJobsToday': 'No hay trabajos programados para hoy',
    'dashboard.scheduleAJob': 'Programar un Trabajo',
    'dashboard.unpaid': 'Sin Pagar',
    'dashboard.notifications': 'Notificaciones',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.description': 'Administra las preferencias de tu aplicación y datos',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma',
    'settings.languageDescription': 'Elige tu idioma preferido',
    'settings.theme': 'Tema',
    'settings.themeDescription': 'Actualmente usando modo {mode}',
    'settings.dataManagement': 'Gestión de Datos',
    'settings.exportData': 'Exportar Datos',
    'settings.exportDescription': 'Descargar una copia de seguridad de todos tus clientes y trabajos',
    'settings.importData': 'Importar Datos',
    'settings.importDescription': 'Restaurar datos desde un archivo de respaldo',
    'settings.clearAllData': 'Borrar Todos los Datos',
    'settings.clearDescription': 'Eliminar permanentemente todos los clientes y trabajos',
    'settings.appPreferences': 'Preferencias de la Aplicación',
    'settings.notifications': 'Notificaciones',
    'settings.notificationsDescription': 'Habilitar notificaciones push para recordatorios',
    'settings.cacheManagement': 'Gestión de Caché',
    'settings.cacheDescription': 'Limpiar datos en caché y buscar actualizaciones',
    'settings.helpSupport': 'Ayuda y Soporte',
    'settings.userGuide': 'Guía del Usuario',
    'settings.userGuideDescription': 'Aprende cómo usar MyJobTrack',
    'settings.contactSupport': 'Contactar Soporte',
    'settings.contactDescription': 'Obtener ayuda con problemas técnicos',
    'settings.featureRequests': 'Solicitudes de Funciones',
    'settings.featureDescription': 'Sugerir nuevas funciones o mejoras',
    'settings.appStatistics': 'Estadísticas de la Aplicación',
    'settings.aboutMyJobTrack': 'Acerca de MyJobTrack',
    'settings.features': 'Características',
    'settings.technicalInfo': 'Información Técnica',
    'settings.version': 'Versión',
    'settings.dataStorage': 'Almacenamiento de Datos: Navegador Local',
    'settings.platform': 'Plataforma: Aplicación Web Progresiva',
    'settings.lastUpdated': 'Última Actualización',
    'settings.builtWith': 'Construido con React y TypeScript',
    'settings.themeMode': 'Tema: Modo {mode}',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.warning': 'Advertencia',
    'common.info': 'Información',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.total': 'Total',
    'common.customers': 'Clientes',
    'common.jobs': 'Trabajos',
    'common.paid': 'Pagado',
    'common.unpaid': 'Sin Pagar',
    'common.completed': 'Completado',
    'common.scheduled': 'Programado',
    'common.inProgress': 'En Progreso',
    'common.dark': 'Oscuro',
    'common.light': 'Claro',
    'common.english': 'Inglés',
    'common.spanish': 'Español',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('myjobtrack_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      return savedLanguage;
    }
    
    // Check browser language
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('es')) {
      return 'es';
    }
    
    return 'en';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('myjobtrack_language', language);
    
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    // Get translation directly from flat object using the key
    let value = (translations[language] as Record<string, string>)[key];
    
    // If not found in current language, fallback to English
    if (!value) {
      value = (translations.en as Record<string, string>)[key];
    }
    
    // If still not found, return the key
    if (!value) {
      return key;
    }
    
    // If we have a string value, interpolate parameters
    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] || match;
        });
      }
      return value;
    }
    
    return key; // Return key if translation not found
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};