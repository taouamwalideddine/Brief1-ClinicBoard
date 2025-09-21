import { Storage } from './storage.js';

export class AppointmentsComponent {
    constructor() {
        this.currentView = 'table';
    }

    loadAppointments() {
        const appointments = Storage.getData('appointments');
        this.renderAppointmentsTable(appointments);
        this.renderDailyView(appointments);
    }

    renderAppointmentsTable(appointments) {
        const tbody = document.getElementById('appointments-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${appointment.patient}</td>
                <td>${appointment.type}</td>
                <td>${this.formatDate(appointment.date)} ${appointment.time}</td>
                <td>
                    <button class="btn btn-danger" onclick="window.clinicBoard.appointmentsComponent.deleteAppointment(${appointment.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    renderDailyView(appointments) {
        const container = document.getElementById('daily-appointments');
        if (!container) return;
        
        const grouped = appointments.reduce((acc, appointment) => {
            const date = appointment.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(appointment);
            return acc;
        }, {});
        
        const sortedDates = Object.keys(grouped).sort();
        
        container.innerHTML = sortedDates.map(date => `
            <div class="daily-group">
                <div class="daily-header">${this.formatDate(date)}</div>
                <div class="daily-appointments-list">
                    ${grouped[date].map(appointment => `
                        <div class="appointment-item">
                            <div class="appointment-info">
                                <div class="appointment-time">${appointment.time}</div>
                                <div class="appointment-details">
                                    ${appointment.patient} - ${appointment.type}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    addAppointment() {
        const patient = document.getElementById('appointment-patient').value;
        const type = document.getElementById('appointment-type').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;

        if (!patient || !type || !date || !time) {
            window.clinicBoard.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        const appointments = Storage.getData('appointments');
        const newAppointment = {
            id: Date.now(),
            patient,
            practitioner: 'Dr. Martin',
            room: 'Salle 1',
            type,
            date,
            time,
            duration: 30,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        appointments.push(newAppointment);
        Storage.saveData('appointments', appointments);
        this.loadAppointments();
        window.clinicBoard.showNotification('Rendez-vous créé avec succès', 'success');
        window.clinicBoard.dashboardComponent.updateDashboard();
        document.getElementById('appointment-form').reset();
    }

    switchAppointmentView(view) {
        const tableView = document.getElementById('appointments-table-view');
        const dailyView = document.getElementById('appointments-daily-view');
        const tableBtn = document.getElementById('view-table');
        const dailyBtn = document.getElementById('view-daily');
        
        this.currentView = view;
        
        if (view === 'table') {
            if (tableView) tableView.classList.remove('hidden');
            if (dailyView) dailyView.classList.add('hidden');
            if (tableBtn) tableBtn.classList.add('active');
            if (dailyBtn) dailyBtn.classList.remove('active');
        } else {
            if (tableView) tableView.classList.add('hidden');
            if (dailyView) dailyView.classList.remove('hidden');
            if (tableBtn) tableBtn.classList.remove('active');
            if (dailyBtn) dailyBtn.classList.add('active');
        }
    }

    updatePatientSelect() {
        const select = document.getElementById('appointment-patient');
        const patients = Storage.getData('patients');
        
        if (select) {
            select.innerHTML = '<option value="">Select Patient</option>' +
                patients.map(patient => 
                    `<option value="${patient.name}">${patient.name}</option>`
                ).join('');
        }
    }

    deleteAppointment(appointmentId) {
        if (confirm('Are you sure you want to delete this appointment?')) {
            const appointments = Storage.getData('appointments');
            const filtered = appointments.filter(a => a.id !== appointmentId);
            Storage.saveData('appointments', filtered);
            this.loadAppointments();
            window.clinicBoard.showNotification('Appointment deleted successfully', 'success');
            window.clinicBoard.dashboardComponent.updateDashboard();
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
