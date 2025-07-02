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
    const keys = key.split('.');
    let value: any = translations[language];
    
    // Navigate through the nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
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