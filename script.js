class ClinicBoard {
    constructor() {
        this.currentSection = 'auth';
        this.isAuthenticated = false;
        this.user = null;
        this.failedAttempts = 0;
        this.maxFailedAttempts = 3;
        this.lockoutDuration = 30000;
        this.lockoutEndTime = null;
        this.editingPatientId = null;
        this.financialChart = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingPassword();
        this.showSection('auth');
        this.loadSampleData();
    }
        setupEventListeners() {
        // auth forms
        document.querySelector('#login-form form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.querySelector('#set-password-form form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSetPassword();
        });
        // navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
                this.closeMobileMenu();
            });
        });
    }
}