import React from 'react';
import { QrCode } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const QRCodeShowcase: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-white">
          <QrCode className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('landing.qr.title')}
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('landing.qr.subtitle')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('landing.qr.step1.title')}</h3>
              <p className="opacity-90">{t('landing.qr.step1.description')}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('landing.qr.step2.title')}</h3>
              <p className="opacity-90">{t('landing.qr.step2.description')}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('landing.qr.step3.title')}</h3>
              <p className="opacity-90">{t('landing.qr.step3.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeShowcase;
