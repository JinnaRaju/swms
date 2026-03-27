import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { languages } from '../i18n/translations';
import { 
  LockClosedIcon, GlobeAltIcon, SunIcon, MoonIcon, 
  ArrowRightOnRectangleIcon, BellIcon, TrashIcon, 
  EyeIcon, EyeSlashIcon, ArchiveBoxXMarkIcon 
} from '@heroicons/react/24/solid';

// Helper component for a toggle switch
const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between">
    <label className="text-gray-600 dark:text-gray-300">{label}</label>
    <button
      onClick={() => onChange(!enabled)}
      className={`${enabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
      aria-pressed={enabled}
    >
      <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </button>
  </div>
);

// Helper for password input with visibility toggle
const PasswordInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => {
  const [visible, setVisible] = useState(false);
  const inputClasses = "block w-full pr-10 pl-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition";

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        className={`mt-1 ${inputClasses}`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('password123'); // mock value
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // State for notifications
  const [notifications, setNotifications] = useState({
    complaints: true,
    awards: true,
    promotions: false,
  });

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (newPassword !== confirmPassword || newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: t('settings.password.error') });
      return;
    }
    // Mock update logic
    setPasswordMessage({ type: 'success', text: t('settings.password.success') });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
  };

  const checkPasswordStrength = useMemo(() => {
    const score = { level: '', color: '', text: '' };
    if (!newPassword) return score;

    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.match(/[a-z]/) && newPassword.match(/[A-Z]/)) strength++;
    if (newPassword.match(/\d/)) strength++;
    if (newPassword.match(/[^a-zA-Z\d]/)) strength++;
    
    if (strength < 2) {
      score.level = 'weak';
      score.color = 'bg-red-500';
      score.text = t('settings.password.strength.weak');
    } else if (strength < 4) {
      score.level = 'medium';
      score.color = 'bg-yellow-500';
      score.text = t('settings.password.strength.medium');
    } else {
      score.level = 'strong';
      score.color = 'bg-green-500';
      score.text = t('settings.password.strength.strong');
    }
    return score;
  }, [newPassword, t]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleClearHistory = () => {
    if (window.confirm(t('settings.data.clear_history_confirm'))) {
      // Mock clearing history
      alert('Complaint history cleared.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('settings.danger.delete_account_confirm'))) {
      // Mock account deletion
      alert('Account deleted.');
      logout();
    }
  }

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {icon} {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('settings.title')}</h2>

      {/* Password Section */}
      {renderSection(t('settings.password.title'), <LockClosedIcon className="w-5 h-5" />,
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <PasswordInput label={t('settings.password.current')} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <PasswordInput label={t('settings.password.new')} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          {newPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.password.strength')}</label>
              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${checkPasswordStrength.color}`} style={{ width: `${checkPasswordStrength.level === 'weak' ? 33 : checkPasswordStrength.level === 'medium' ? 66 : 100}%` }}></div>
              </div>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{checkPasswordStrength.text}</p>
            </div>
          )}
          <PasswordInput label={t('settings.password.confirm')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {passwordMessage.text && (
            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {passwordMessage.text}
            </p>
          )}
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{t('settings.password.update_button')}</button>
        </form>
      )}

      {/* Language & Theme in one card */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSection(t('settings.language.title'), <GlobeAltIcon className="w-5 h-5" />,
          <select value={language} onChange={e => setLanguage(e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition">
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        )}
        {renderSection(t('settings.theme.title'), theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />,
          <div className="flex gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            {(['light', 'dark', 'system'] as const).map(t_theme => (
              <button key={t_theme} onClick={() => setTheme(t_theme)} className={`w-full capitalize py-2 px-3 text-sm font-semibold rounded-md transition-colors ${theme === t_theme ? 'bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {t(`settings.theme.${t_theme}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications Section */}
      {renderSection(t('settings.notifications.title'), <BellIcon className="w-5 h-5" />, <>
        <ToggleSwitch label={t('settings.notifications.complaint_status')} enabled={notifications.complaints} onChange={val => setNotifications(p => ({...p, complaints: val}))} />
        <ToggleSwitch label={t('settings.notifications.award_updates')} enabled={notifications.awards} onChange={val => setNotifications(p => ({...p, awards: val}))} />
        <ToggleSwitch label={t('settings.notifications.promotional')} enabled={notifications.promotions} onChange={val => setNotifications(p => ({...p, promotions: val}))} />
      </>)}

       {/* Data Management & Session */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSection(t('settings.data.title'), <ArchiveBoxXMarkIcon className="w-5 h-5" />,
                <button onClick={handleClearHistory} className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {t('settings.data.clear_history')}
                </button>
            )}
            {renderSection(t('settings.session.title'), <ArrowRightOnRectangleIcon className="w-5 h-5" />,
                <button onClick={handleLogout} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t('settings.logout.button')}
                </button>
            )}
       </div>


      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-500/30">
        <h3 className="text-lg font-bold text-red-800 dark:text-red-300 flex items-center gap-2 mb-2">
            <TrashIcon className="w-5 h-5"/> {t('settings.danger.title')}
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{t('settings.danger.delete_account_desc')}</p>
        <button onClick={handleDeleteAccount} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            {t('settings.danger.delete_account')}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
