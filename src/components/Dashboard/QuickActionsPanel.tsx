import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, QrCode } from 'lucide-react';
import QuickActionButton from '@/components/UI/QuickActionButton';
import { useLanguage } from '@/contexts/LanguageContext';

const QuickActionsPanel: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
        {t('dashboard.quickActions')}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <QuickActionButton
          icon={Plus}
          label={t('dashboard.addCustomer')}
          onClick={() => navigate('/app/customers/new')}
          variant="primary"
        />
        <QuickActionButton
          icon={Calendar}
          label={t('dashboard.scheduleJob')}
          onClick={() => navigate('/app/jobs/new')}
          variant="secondary"
        />
        <QuickActionButton
          icon={Users}
          label={t('dashboard.viewCustomers')}
          onClick={() => navigate('/app/customers')}
          variant="secondary"
        />
        <QuickActionButton
          icon={QrCode}
          label={t('dashboard.scanQR')}
          onClick={() => navigate('/app/scan')}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default QuickActionsPanel;
