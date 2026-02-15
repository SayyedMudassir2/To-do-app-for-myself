
import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DeepWork } from './components/DeepWork';
import { Identity } from './components/Identity';
import { useAppState } from './store';

const App: React.FC = () => {
  const { state, updateToday, getDayData, setTab, updateIdentity, today, streak, exportToCSV } = useAppState();

  const renderContent = () => {
    switch (state.activeTab) {
      case 'dashboard':
        return <Dashboard data={getDayData(today)} onUpdate={updateToday} identity={state.identity} />;
      case 'focus':
        return <DeepWork onUpdate={updateToday} />;
      case 'identity':
        return <Identity profile={state.identity} onUpdate={updateIdentity} />;
      default:
        return <Dashboard data={getDayData(today)} onUpdate={updateToday} identity={state.identity} />;
    }
  };

  return (
    <Layout 
      activeTab={state.activeTab} 
      onTabChange={setTab} 
      level={state.identity.level} 
      streak={streak}
      onExport={exportToCSV}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
