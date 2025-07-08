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
    'nav.getStarted': 'Get Started',
    
    // Landing Page
    'landing.title': 'Simple CRM for Service Professionals',
    'landing.subtitle': 'Built for landscapers, handymen, contractors & service pros. Track jobs, manage customers, and get paid faster.',
    'landing.cta.primary': 'Get Started Free',
    'landing.cta.secondary': 'Try Demo',
    'landing.features.title': 'Everything You Need to Run Your Business',
    'landing.features.subtitle': 'Simple tools that actually work for service professionals',
    'landing.features.customers.title': 'Customer Management',
    'landing.features.customers.description': 'Keep track of customer details, contact info, and service history in one place',
    'landing.features.jobs.title': 'Job Scheduling',
    'landing.features.jobs.description': 'Schedule jobs, track progress, and manage your daily workload effortlessly',
    'landing.features.payments.title': 'Payment Tracking',
    'landing.features.payments.description': 'Know exactly who owes what and when payments are due',
    'landing.features.qr.title': 'QR Code Integration',
    'landing.features.qr.description': 'Generate QR codes for jobs and customers for quick on-site access',
    'landing.benefits.title': 'Why Service Professionals Choose MyJobTrack',
    'landing.benefits.subtitle': 'Designed by service providers, for service providers. Simple, fast, and effective.',
    'landing.benefits.simple.title': 'Simple & Easy to Use',
    'landing.benefits.simple.description': 'No complicated features. Just what you need to run your business.',
    'landing.benefits.mobile.title': 'Mobile-First Design',
    'landing.benefits.mobile.description': 'Works perfectly on your phone, tablet, or computer.',
    'landing.benefits.offline.title': 'Works Offline',
    'landing.benefits.offline.description': 'Access your data even without internet connection.',
    'landing.hero.badgeText': 'Free Forever',
    'landing.cta.title': 'Ready to Transform Your Service Business?',
    'landing.cta.description': 'Join thousands of service providers who have streamlined their operations with MyJobTrack.',
    'landing.cta.demo': 'Try Demo',
    'landing.cta.start': 'Start Using MyJobTrack',
    'landing.cta.demoNote': 'Demo mode • No signup required',
    'landing.cta.signupNote': 'Sign up to use • Works offline',
    
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
    
    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    
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
    'nav.getStarted': 'Comenzar',
    
    // Landing Page
    'landing.title': 'CRM Simple para Profesionales de Servicios',
    'landing.subtitle': 'Construido para jardineros, técnicos, contratistas y profesionales de servicios. Rastrea trabajos, gestiona clientes y cobra más rápido.',
    'landing.cta.primary': 'Comenzar Gratis',
    'landing.cta.secondary': 'Probar Demo',
    'landing.features.title': 'Todo lo que Necesitas para Manejar tu Negocio',
    'landing.features.subtitle': 'Herramientas simples que realmente funcionan para profesionales de servicios',
    'landing.features.customers.title': 'Gestión de Clientes',
    'landing.features.customers.description': 'Mantén registro de detalles de clientes, información de contacto e historial de servicios en un lugar',
    'landing.features.jobs.title': 'Programación de Trabajos',
    'landing.features.jobs.description': 'Programa trabajos, rastrea progreso y gestiona tu carga de trabajo diaria sin esfuerzo',
    'landing.features.payments.title': 'Seguimiento de Pagos',
    'landing.features.payments.description': 'Sabe exactamente quién debe qué y cuándo vencen los pagos',
    'landing.features.qr.title': 'Integración de Código QR',
    'landing.features.qr.description': 'Genera códigos QR para trabajos y clientes para acceso rápido en el sitio',
    'landing.benefits.title': 'Por qué los Profesionales de Servicios Eligen MyJobTrack',
    'landing.benefits.subtitle': 'Diseñado por proveedores de servicios, para proveedores de servicios. Simple, rápido y efectivo.',
    'landing.benefits.simple.title': 'Simple y Fácil de Usar',
    'landing.benefits.simple.description': 'Sin funciones complicadas. Solo lo que necesitas para manejar tu negocio.',
    'landing.benefits.mobile.title': 'Diseño Móvil Primero',
    'landing.benefits.mobile.description': 'Funciona perfectamente en tu teléfono, tableta o computadora.',
    'landing.benefits.offline.title': 'Funciona Sin Conexión',
    'landing.benefits.offline.description': 'Accede a tus datos incluso sin conexión a internet.',
    'landing.hero.badgeText': 'Gratis para Siempre',
    'landing.cta.title': '¿Listo para Transformar tu Negocio de Servicios?',
    'landing.cta.description': 'Únete a miles de proveedores de servicios que han optimizado sus operaciones con MyJobTrack.',
    'landing.cta.demo': 'Probar Demo',
    'landing.cta.start': 'Comenzar a Usar MyJobTrack',
    'landing.cta.demoNote': 'Modo demo • No requiere registro',
    'landing.cta.signupNote': 'Regístrate para usar • Funciona sin conexión',
    
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
    
    // Authentication
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    'auth.login': 'Ingresar',
    'auth.logout': 'Cerrar Sesión',
    
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