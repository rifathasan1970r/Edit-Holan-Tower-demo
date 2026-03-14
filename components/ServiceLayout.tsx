import React from 'react';
import EmergencyNoticeBox from '../src/components/EmergencyNoticeBox';

interface ServiceLayoutProps {
  children: React.ReactNode;
  setView: (view: string) => void;
}

export const ServiceLayout: React.FC<ServiceLayoutProps> = ({ children, setView }) => {
  return (
    <div className="pb-24 relative">
      <EmergencyNoticeBox onClick={() => setView('EMERGENCY_NOTICE_DETAIL')} />
      {children}
    </div>
  );
};
