import { AuthComponent } from './components/auth.js';
import { DashboardComponent } from './components/dashboard.js';
import { PatientsComponent } from './components/patients.js';
import { AppointmentsComponent } from './components/appointments.js';
import { FinanceComponent } from './components/finance.js';

class ClinicBoard {
    constructor() {
        this.currentSection = 'auth';
        this.isAuthenticated = false;
        this.user = null;
        
        this.authComponent = new AuthComponent();
        this.dashboardComponent = new DashboardComponent();
        this.patientsComponent = new PatientsComponent();
        this.appointmentsComponent = new AppointmentsComponent();
        this.financeComponent = new FinanceComponent();
        
        this.init();
    }

    init() {
        this.renderApp();
        this.setupEventListeners();
        this.checkExistingPassword();
        this.showSection('auth');
        this.dashboardComponent.loadSampleData();
    }

    renderApp() {
        const root = document.getElementById('root');
        root.innerHTML = this.getAppHTML();
    }

    getAppHTML() {
        return `
            <!-- Sidebar Navigation -->
            <div id="sidebar" class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <div class="logo-icon">+</div>
                        <h2>ClinicBoard</h2>
                    </div>
                </div>
                <nav class="sidebar-nav">
                    <button class="nav-item active" data-section="dashboard">📊 Dashboard</button>
                    <button class="nav-item" data-section="patients">👥 Patients</button>
                    <button class="nav-item" data-section="appointments">📅 Appointments</button>
                    <button class="nav-item" data-section="finance">💰 Finance</button>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <!-- Header -->
                <header class="header">
                    <div class="header-logo">
                        <div class="logo-icon">+</div>
                        <h1>ClinicApp</h1>
                    </div>
                </header>

                <!-- Auth Section -->
                <section id="auth-section" class="section">
                    <div class="auth-container">
                        <div class="auth-card login-card">
                            <div id="login-form">
                                <form class="auth-form">
                                    <div class="form-group">
                                        <label for="login-password">Password</label>
                                        <input type="password" id="login-password" placeholder="Password" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Log in</button>
                                    <div id="login-error" class="error-message hidden">
                                        <span class="error-icon">✕</span>
                                        <span class="error-text">Incorrect password. Remaining attempts: <span id="attempts-remaining">2/3</span></span>
                                    </div>
                                </form>
                            </div>
                            <div id="set-password-form" class="hidden">
                                <form class="auth-form">
                                    <div class="form-group">
                                        <label for="set-password">New password</label>
                                        <input type="password" id="set-password" required minlength="8">
                                    </div>
                                    <div class="form-group">
                                        <label for="confirm-password">Confirm password</label>
                                        <input type="password" id="confirm-password" required minlength="8">
                                    </div>
                                    <button type="submit" class="btn btn-primary">Create password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Dashboard Section -->
                <section id="dashboard-section" class="section hidden">
                    <div class="welcome-section">
                        <h1>Hello, Dr. Martin 👋</h1>
                        <p>Your activity for this month</p>
                    </div>
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header"><h4>REVENUE</h4></div>
                            <div class="kpi-value revenue" id="revenue-amount">€0</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-header"><h4>EXPENSES</h4></div>
                            <div class="kpi-value expense" id="expenses-amount">€0</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-header"><h4>NET MARGIN</h4></div>
                            <div class="kpi-value margin" id="margin-amount">€0</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-header"><h4>PATIENTS</h4></div>
                            <div class="kpi-value patients" id="patients-count">0</div>
                        </div>
                    </div>
                    <div class="dashboard-navigation">
                        <div class="nav-cards">
                            <button class="nav-card" data-section="patients">
                                <div class="nav-icon">👥</div>
                                <div class="nav-content">
                                    <div class="nav-title">New Patient</div>
                                    <div class="nav-subtitle">Add a patient</div>
                                </div>
                            </button>
                            <button class="nav-card" data-section="appointments">
                                <div class="nav-icon">📅</div>
                                <div class="nav-content">
                                    <div class="nav-title">New Appointment</div>
                                    <div class="nav-subtitle">Schedule appointment</div>
                                </div>
                            </button>
                            <button class="nav-card" data-section="finance">
                                <div class="nav-icon">💰</div>
                                <div class="nav-content">
                                    <div class="nav-title">Add transaction</div>
                                    <div class="nav-subtitle">Revenue or expense</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Patients Section -->
                <section id="patients-section" class="section hidden">
                    <div class="section-header">
                        <h2>Patient Management</h2>
                        <p>Manage patient information</p>
                    </div>

                    <div class="card">
                        <button id="add-patient-btn" class="btn btn-primary">+ New Patient</button>
                    </div>

                    <!-- Patients Table -->
                    <div class="card">
                        <div class="card-header">
                            <h3>Patient List</h3>
                        </div>
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Notes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="patients-table-body">
                                    <!-- Patients will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Appointments Section -->
                <section id="appointments-section" class="section hidden">
                    <div class="section-header">
                        <h2>Appointment Management</h2>
                        <p>Plan and manage appointments</p>
                    </div>

                    <div class="card">
                        <h3>New Appointment</h3>
                        <form id="appointment-form" class="appointment-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="appointment-patient">Patient</label>
                                    <select id="appointment-patient" required>
                                        <option value="">Select patient</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="appointment-type">Type</label>
                                    <select id="appointment-type" required>
                                        <option value="">Select type</option>
                                        <option value="Consultation générale">General consultation</option>
                                        <option value="Suivi post-op">Post-op follow-up</option>
                                        <option value="Contrôle routine">Routine check</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="appointment-date">Date</label>
                                    <input type="date" id="appointment-date" required>
                                </div>
                                <div class="form-group">
                                    <label for="appointment-time">Time</label>
                                    <input type="time" id="appointment-time" required>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Create appointment</button>
                        </form>
                    </div>

                    <div id="appointments-table-view" class="card">
                        <div class="card-header">
                            <h3>Appointments</h3>
                        </div>
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Type</th>
                                        <th>Date & Time</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="appointments-table-body">
                                    <!-- Appointments will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- Finance Section -->
                <section id="finance-section" class="section hidden">
                    <div class="section-header">
                        <h2>Revenue & Expenses</h2>
                        <p>Cabinet financial overview</p>
                    </div>

                    <!-- Add Revenue and Expense Forms -->
                    <div class="finance-forms">
                        <!-- Add Revenue Form -->
                        <div class="card">
                            <h3>Add Revenue</h3>
                            <form id="revenue-form" class="finance-form">
                                <div class="form-group">
                                    <label for="revenue-input-amount">Amount</label>
                                    <input type="number" id="revenue-input-amount" step="0.01" min="0" placeholder="0.00" required>
                                </div>
                                <div class="form-group">
                                    <label for="revenue-input-label">Description</label>
                                    <input type="text" id="revenue-input-label" placeholder="Consultation fee" required>
                                </div>
                                <div class="form-group">
                                    <label for="revenue-input-date">Date</label>
                                    <input type="date" id="revenue-input-date" required>
                                </div>
                                <button type="submit" class="btn btn-success">Add Revenue</button>
                            </form>
                        </div>

                        <!-- Add Expense Form -->
                        <div class="card">
                            <h3>Add Expense</h3>
                            <form id="expense-form" class="finance-form">
                                <div class="form-group">
                                    <label for="expense-amount">Amount</label>
                                    <input type="number" id="expense-amount" step="0.01" min="0" placeholder="0.00" required>
                                </div>
                                <div class="form-group">
                                    <label for="expense-label">Description</label>
                                    <input type="text" id="expense-label" placeholder="Office supplies" required>
                                </div>
                                <div class="form-group">
                                    <label for="expense-date">Date</label>
                                    <input type="date" id="expense-date" required>
                                </div>
                                <button type="submit" class="btn btn-danger">Add Expense</button>
                            </form>
                        </div>
                    </div>

                    <!-- Financial Transactions -->
                    <div class="card">
                        <div class="card-header">
                            <h3>Financial Transactions</h3>
                        </div>
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="finance-table-body">
                                    <!-- Financial transactions will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Patient Modal -->
            <div id="patient-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="patient-modal-title">Add Patient</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="patient-form" class="modal-form">
                        <div class="form-group">
                            <label for="patient-name">Full Name</label>
                            <input type="text" id="patient-name" required>
                        </div>
                        <div class="form-group">
                            <label for="patient-phone">Phone</label>
                            <input type="tel" id="patient-phone" required>
                        </div>
                        <div class="form-group">
                            <label for="patient-email">Email</label>
                            <input type="email" id="patient-email">
                        </div>
                        <div class="form-group">
                            <label for="patient-notes">Notes</label>
                            <textarea id="patient-notes" rows="3"></textarea>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" id="cancel-patient">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="save-patient">Save Patient</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Auth forms
        document.querySelector('#login-form form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.querySelector('#set-password-form form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSetPassword();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Patients
        document.getElementById('add-patient-btn')?.addEventListener('click', () => {
            this.patientsComponent.openPatientModal();
        });

        document.getElementById('patient-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.patientsComponent.savePatient();
        });

        document.getElementById('cancel-patient')?.addEventListener('click', () => {
            this.patientsComponent.closePatientModal();
        });

        document.querySelector('.modal-close')?.addEventListener('click', () => {
            this.patientsComponent.closePatientModal();
        });

        // Appointments
        document.getElementById('appointment-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.appointmentsComponent.addAppointment();
        });

        // Finance
        document.getElementById('revenue-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.financeComponent.addRevenue();
        });

        document.getElementById('expense-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.financeComponent.addExpense();
        });

        // Navigation cards
        document.querySelectorAll('.nav-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });
    }

    // Auth functions
    checkExistingPassword() {
        const hasPassword = this.authComponent.checkExistingPassword();
        const loginForm = document.getElementById('login-form');
        const setPasswordForm = document.getElementById('set-password-form');
        
        if (hasPassword) {
            if (loginForm) loginForm.classList.remove('hidden');
            if (setPasswordForm) setPasswordForm.classList.add('hidden');
        } else {
            if (loginForm) loginForm.classList.add('hidden');
            if (setPasswordForm) setPasswordForm.classList.remove('hidden');
        }
    }

    async handleLogin() {
        const password = document.getElementById('login-password').value;
        this.showLoading(true);
        
        const result = await this.authComponent.handleLogin(password);
        
        this.showLoading(false);
        
        if (result.success) {
            this.user = { name: 'Dr. Martin', role: 'admin' };
            this.isAuthenticated = true;
            this.showNotification(result.message, 'success');
            this.navigateToSection('dashboard');
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    async handleSetPassword() {
        const password = document.getElementById('set-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        this.showLoading(true);
        
        const result = await this.authComponent.handleSetPassword(password, confirmPassword);
        
        this.showLoading(false);
        
        if (result.success) {
            this.showNotification(result.message, 'success');
            this.checkExistingPassword();
            document.getElementById('set-password').value = '';
            document.getElementById('confirm-password').value = '';
        } else {
            this.showNotification(result.message, 'error');
        }
    }

    // Navigation functions
    navigateToSection(sectionId) {
        if (!this.isAuthenticated && sectionId !== 'auth') {
            this.showNotification('Veuillez vous connecter d\'abord', 'error');
            return;
        }

        this.currentSection = sectionId;
        this.showSection(sectionId);
        this.updateNavigation();
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        this.updateNavigationButtons(sectionId);

        if (sectionId === 'dashboard') {
            setTimeout(() => this.dashboardComponent.updateDashboard(), 100);
        } else if (sectionId === 'patients') {
            this.patientsComponent.loadPatients();
        } else if (sectionId === 'appointments') {
            this.appointmentsComponent.loadAppointments();
            this.appointmentsComponent.updatePatientSelect();
        } else if (sectionId === 'finance') {
            this.financeComponent.loadFinanceData();
        }
    }

    updateNavigationButtons(activeSection) {
        document.querySelectorAll('.nav-item').forEach(button => {
            const sectionId = button.getAttribute('data-section');
            button.classList.toggle('active', sectionId === activeSection);
        });
    }

    updateNavigation() {
        const addPatientBtn = document.getElementById('add-patient-btn');

        if (this.isAuthenticated) {
            if (addPatientBtn) addPatientBtn.classList.remove('hidden');
        } else {
            if (addPatientBtn) addPatientBtn.classList.add('hidden');
        }
    }

    // Utility functions
    showLoading(show) {
        const body = document.body;
        body.style.cursor = show ? 'wait' : 'default';
        body.style.opacity = show ? '0.7' : '1';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition duration-300 transform translate-x-full`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.clinicBoard = new ClinicBoard();
});
