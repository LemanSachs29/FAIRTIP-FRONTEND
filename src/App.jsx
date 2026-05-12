import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { FtTheme } from './components/ui/Theme.jsx';
import { FtSidebar } from './components/ui/Sidebar.jsx';
import { FtTopbar } from './components/ui/Topbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import {
  FtButton,
  FtCard,
  FtEmpty,
} from './components/ui/Primitives.jsx';
import { login, logout, register } from './services/auth.js';

import { FtLogin, FtRegister } from './pages/Auth.jsx';
import { FtDashboard } from './pages/Dashboard.jsx';
import { FtEmployees } from './pages/Employees.jsx';
import { FtEmployeeDetail } from './pages/EmployeeDetail.jsx';
import { FtDistributions, FtNewDistribution } from './pages/Distributions.jsx';
import { FtDistributionDetail } from './pages/DistributionDetail.jsx';

const NewDistributionContext = React.createContext({ openNewDistribution: () => {} });

const useNewDistribution = () => React.useContext(NewDistributionContext);

const FtApp = () => (
  <BrowserRouter>
    <FtTheme palette="charcoal" font="plex" />
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardRoute /></AppShell></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><AppShell><EmployeesRoute /></AppShell></ProtectedRoute>} />
      <Route path="/employees/:id" element={<ProtectedRoute><AppShell><EmployeeDetailRoute /></AppShell></ProtectedRoute>} />
      <Route path="/distributions" element={<ProtectedRoute><AppShell><DistributionsRoute /></AppShell></ProtectedRoute>} />
      <Route path="/distributions/:id" element={<ProtectedRoute><AppShell><DistributionDetailRoute /></AppShell></ProtectedRoute>} />
      <Route path="/absences" element={<ProtectedRoute><AppShell><AbsencesRoute /></AppShell></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppShell><SettingsRoute /></AppShell></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

const LoginRoute = () => {
  const navigate = useNavigate();

  return (
    <FtLogin
      onSwitch={(mode) => navigate(mode === 'register' ? '/register' : '/login')}
      onLogin={async (email, password) => {
        await login(email, password);
        navigate('/dashboard', { replace: true });
      }}
    />
  );
};

const RegisterRoute = () => {
  const navigate = useNavigate();

  return (
    <FtRegister
      onSwitch={(mode) => navigate(mode === 'login' ? '/login' : '/register')}
      onRegister={async (email, password) => {
        await register(email, password);
        navigate('/login', { replace: true });
      }}
    />
  );
};

const AppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNewDist, setShowNewDist] = React.useState(false);
  const route = getRouteState(location.pathname);

  const crumbs = React.useMemo(() => {
    switch (route.name) {
      case 'dashboard':     return ['Dashboard'];
      case 'employees':     return ['Employees'];
      case 'employee':      return ['Employees', 'Maria Lopez'];
      case 'distributions': return ['Distributions'];
      case 'distribution':  return ['Distributions', '#' + route.id.toString().padStart(4, '0')];
      case 'absences':      return ['Absences'];
      case 'settings':      return ['Settings'];
      default: return ['Dashboard'];
    }
  }, [route]);

  return (
    <NewDistributionContext.Provider value={{ openNewDistribution: () => setShowNewDist(true) }}>
      <div className="app">
        <FtSidebar active={route.active} onSignOut={() => {
          logout();
          navigate('/login', { replace: true });
        }} />
        <main className="main">
          <FtTopbar crumbs={crumbs} />
          <div className="page">{children}</div>
        </main>
        {showNewDist && (
          <FtNewDistribution
            onCancel={() => setShowNewDist(false)}
            onCreate={() => { setShowNewDist(false); navigate('/distributions/13'); }}
          />
        )}
      </div>
    </NewDistributionContext.Provider>
  );
};

const DashboardRoute = () => {
  const navigate = useNavigate();
  const { openNewDistribution } = useNewDistribution();

  return (
    <FtDashboard
      onNewDistribution={openNewDistribution}
      onOpenDistribution={(id) => navigate(`/distributions/${id}`)}
    />
  );
};

const EmployeesRoute = () => {
  const navigate = useNavigate();

  return <FtEmployees onOpenEmployee={(id) => navigate(`/employees/${id}`)} />;
};

const EmployeeDetailRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return <FtEmployeeDetail employeeId={id} onBack={() => navigate('/employees')} />;
};

const DistributionsRoute = () => {
  const navigate = useNavigate();
  const { openNewDistribution } = useNewDistribution();

  return (
    <FtDistributions
      onNew={openNewDistribution}
      onOpenDistribution={(id) => navigate(`/distributions/${id}`)}
    />
  );
};

const DistributionDetailRoute = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return <FtDistributionDetail distributionId={id} onBack={() => navigate('/distributions')} />;
};

const AbsencesRoute = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-h"><div className="titles"><h1>Absences</h1><div className="sub">All absences across employees.</div></div></div>
      <FtCard><FtEmpty icon="calendar-x" title="Calendar view coming soon."
        body="For now, register absences inside an employee's profile."
        action={<FtButton variant="primary" icon="users" onClick={() => navigate('/employees')}>Go to employees</FtButton>} />
      </FtCard>
    </div>
  );
};

const SettingsRoute = () => (
  <div>
    <div className="page-h"><div className="titles"><h1>Settings</h1><div className="sub">Workspace and currency.</div></div></div>
    <div className="grid-2">
      <FtCard title="Workspace">
        <div className="field" style={{marginBottom: 16}}>
          <label className="l">Display name</label>
          <input className="inp" defaultValue="Trattoria San Marco" />
        </div>
        <div className="field">
          <label className="l">Default currency</label>
          <select className="inp"><option>EUR — €</option><option>USD — $</option><option>GBP — £</option></select>
        </div>
      </FtCard>
      <FtCard title="Rounding">
        <div className="field" style={{marginBottom: 16}}>
          <label className="l">Display precision</label>
          <select className="inp"><option>2 decimals</option><option>4 decimals</option></select>
        </div>
        <div className="field">
          <label className="l">Apply remainder to</label>
          <select className="inp"><option>Largest share</option><option>Random employee</option><option>Carry over</option></select>
        </div>
      </FtCard>
    </div>
  </div>
);

const getRouteState = (pathname) => {
  if (pathname.startsWith('/employees/')) return { name: 'employee', active: 'employees', id: pathname.split('/')[2] || '' };
  if (pathname.startsWith('/distributions/')) return { name: 'distribution', active: 'distributions', id: pathname.split('/')[2] || '' };
  if (pathname.startsWith('/employees')) return { name: 'employees', active: 'employees' };
  if (pathname.startsWith('/distributions')) return { name: 'distributions', active: 'distributions' };
  if (pathname.startsWith('/absences')) return { name: 'absences', active: 'absences' };
  if (pathname.startsWith('/settings')) return { name: 'settings', active: 'settings' };

  return { name: 'dashboard', active: 'dashboard' };
};

export default FtApp;
