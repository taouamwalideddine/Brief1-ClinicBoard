import { Storage } from './storage.js';

export class DashboardComponent {
    constructor() {
        this.user = { name: 'Dr. Martin', role: 'admin' };
    }

    updateDashboard() {
        const patients = Storage.getData('patients');
        const financeData = Storage.getFinanceData();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyRevenue = financeData.revenue
            .filter(item => {
                const d = new Date(item.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, item) => sum + item.amount, 0);

        const monthlyExpenses = financeData.expenses
            .filter(item => {
                const d = new Date(item.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            })
            .reduce((sum, item) => sum + item.amount, 0);

        const margin = monthlyRevenue - monthlyExpenses;

        const revEl = document.getElementById('revenue-amount');
        const expEl = document.getElementById('expenses-amount');
        const marEl = document.getElementById('margin-amount');
        const patEl = document.getElementById('patients-count');

        if (revEl) revEl.textContent = `€${monthlyRevenue.toLocaleString()}`;
        if (expEl) expEl.textContent = `€${monthlyExpenses.toLocaleString()}`;
        if (marEl) marEl.textContent = `€${margin.toLocaleString()}`;
        if (patEl) patEl.textContent = patients.length.toLocaleString();
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Il y a quelques secondes';
        if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
        if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
        if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;
        return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
    }

    updateRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        if (!container) return;
        
        const patients = Storage.getData('patients');
        const appointments = Storage.getData('appointments');
        const financeData = Storage.getFinanceData();
        
        const activities = [];
        
        const recentPatients = patients
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        
        recentPatients.forEach(patient => {
            const timeAgo = this.getTimeAgo(new Date(patient.createdAt));
            activities.push({
                message: `Nouveau patient ajouté: ${patient.name}`,
                time: timeAgo,
                color: 'green',
                date: new Date(patient.createdAt)
            });
        });
        
        const recentAppointments = appointments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        
        recentAppointments.forEach(appointment => {
            const timeAgo = this.getTimeAgo(new Date(appointment.createdAt));
            activities.push({
                message: `Rendez-vous confirmé: ${appointment.patient} (${appointment.time})`,
                time: timeAgo,
                color: 'blue',
                date: new Date(appointment.createdAt)
            });
        });
        
        const allTransactions = [...financeData.revenue, ...financeData.expenses]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);
        
        allTransactions.forEach(transaction => {
            const timeAgo = this.getTimeAgo(new Date(transaction.createdAt));
            const type = transaction.type === 'revenue' ? 'Recette' : 'Dépense';
            const amount = transaction.type === 'revenue' ? `+€${transaction.amount}` : `-€${transaction.amount}`;
            activities.push({
                message: `${type} enregistrée: ${amount} - ${transaction.label}`,
                time: timeAgo,
                color: transaction.type === 'revenue' ? 'green' : 'red',
                date: new Date(transaction.createdAt)
            });
        });
        
        const sortedActivities = activities
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);
        
        container.innerHTML = sortedActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-dot ${activity.color}"></div>
                <div class="activity-content">
                    <div class="activity-message">${activity.message}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    loadSampleData() {
        if (Storage.getData('patients').length === 0) {
            const samplePatients = [
                {
                    id: 1,
                    name: 'Marie Dupont',
                    phone: '06 12 34 56 78',
                    email: 'marie.dupont@email.com',
                    notes: 'Consultation générale',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Jean Michel',
                    phone: '06 96 76 54 32',
                    email: 'jean.michel@email.com',
                    notes: 'Suivi post-op',
                    createdAt: new Date().toISOString()
                }
            ];
            Storage.saveData('patients', samplePatients);
        }
        
        if (Storage.getData('appointments').length === 0) {
            const sampleAppointments = [
                {
                    id: 1,
                    patient: 'Marie Dupont',
                    practitioner: 'Dr. Martin',
                    room: 'Salle 1',
                    type: 'Consultation générale',
                    date: '2025-09-16',
                    time: '09:30',
                    duration: 30,
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                }
            ];
            Storage.saveData('appointments', sampleAppointments);
        }
    }
}
