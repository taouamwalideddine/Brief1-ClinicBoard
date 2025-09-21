import { renderAuth, mountAuth, unmountAuth, isAuthenticated } from './components/auth.js';
import { renderDashboard, mountDashboard, unmountDashboard } from './components/dashboard.js';
import { renderPatients, mountPatients, unmountPatients } from './components/patients.js';
import { renderAppointments, mountAppointments, unmountAppointments } from './components/appointments.js';
import { renderFinance, mountFinance, unmountFinance } from './components/finance.js';

const root = document.getElementById('root');
let currentComponent = null;

export function navigateTo(section) {
  if (currentComponent && currentComponent.unmount) currentComponent.unmount();
  root.innerHTML = '';

  switch (section) {
    case 'auth':
      root.innerHTML = renderAuth();
      mountAuth();
      currentComponent = { unmount: unmountAuth };
      break;
    case 'dashboard':
      if (!isAuthenticated()) return navigateTo('auth');
      root.innerHTML = renderDashboard();
      mountDashboard();
      currentComponent = { unmount: unmountDashboard };
      break;
    case 'patients':
      if (!isAuthenticated()) return navigateTo('auth');
      root.innerHTML = renderPatients();
      mountPatients();
      currentComponent = { unmount: unmountPatients };
      break;
    case 'appointments':
      if (!isAuthenticated()) return navigateTo('auth');
      root.innerHTML = renderAppointments();
      mountAppointments();
      currentComponent = { unmount: unmountAppointments };
      break;
    case 'finance':
      if (!isAuthenticated()) return navigateTo('auth');
      root.innerHTML = renderFinance();
      mountFinance();
      currentComponent = { unmount: unmountFinance };
      break;
    default:
      root.innerHTML = `<h2>404 - Section Not Found</h2>`;
  }
}

function setupNavigation() {
  document.body.addEventListener('click', (e) => {
    if(e.target.matches('.nav-item') || e.target.closest('.nav-item')) {
      let target = e.target.closest('.nav-item');
      e.preventDefault();
      let section = target.dataset.section;
      navigateTo(section);
    }
  });
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  if (isAuthenticated()) {
    navigateTo('dashboard');
  } else {
    navigateTo('auth');
  }
});
