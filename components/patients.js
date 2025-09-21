import { Storage } from './storage.js';

export class PatientsComponent {
    constructor() {
        this.editingPatientId = null;
    }

    loadPatients() {
        const patients = Storage.getData('patients');
        const tbody = document.getElementById('patients-table-body');
        
        if (!tbody) return;
        
        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.phone}</td>
                <td>${patient.email || '-'}</td>
                <td>${patient.notes || '-'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="window.clinicBoard.patientsComponent.editPatient(${patient.id})">Edit</button>
                    <button class="btn btn-danger" onclick="window.clinicBoard.patientsComponent.deletePatient(${patient.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    filterPatients(searchTerm) {
        const patients = Storage.getData('patients');
        const filtered = patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm)
        );
        
        const tbody = document.getElementById('patients-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = filtered.map(patient => `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.phone}</td>
                <td>${patient.email || '-'}</td>
                <td>${patient.notes || '-'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="window.clinicBoard.patientsComponent.editPatient(${patient.id})">Edit</button>
                    <button class="btn btn-danger" onclick="window.clinicBoard.patientsComponent.deletePatient(${patient.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    openPatientModal(patientId = null) {
        const modal = document.getElementById('patient-modal');
        const title = document.getElementById('patient-modal-title');
        const form = document.getElementById('patient-form');
        
        this.editingPatientId = patientId;
        
        if (patientId) {
            const patient = Storage.getData('patients').find(p => p.id === patientId);
            if (patient) {
                title.textContent = 'Edit Patient';
                document.getElementById('patient-name').value = patient.name;
                document.getElementById('patient-phone').value = patient.phone;
                document.getElementById('patient-email').value = patient.email || '';
                document.getElementById('patient-notes').value = patient.notes || '';
            }
        } else {
            title.textContent = 'Add Patient';
            form.reset();
        }
        
        modal.classList.remove('hidden');
    }

    closePatientModal() {
        const modal = document.getElementById('patient-modal');
        modal.classList.add('hidden');
        this.editingPatientId = null;
    }

    savePatient() {
        const name = document.getElementById('patient-name').value;
        const phone = document.getElementById('patient-phone').value;
        const email = document.getElementById('patient-email').value;
        const notes = document.getElementById('patient-notes').value;

        if (!name || !phone) {
            window.clinicBoard.showNotification('Name and phone are required', 'error');
            return;
        }

        const patients = Storage.getData('patients');
        
        if (this.editingPatientId) {
            const index = patients.findIndex(p => p.id === this.editingPatientId);
            if (index !== -1) {
                patients[index] = { ...patients[index], name, phone, email, notes };
                window.clinicBoard.showNotification('Patient updated successfully', 'success');
            }
        } else {
            const newPatient = {
                id: Date.now(),
                name,
                phone,
                email,
                notes,
                createdAt: new Date().toISOString()
            };
            patients.push(newPatient);
            window.clinicBoard.showNotification('Patient added successfully', 'success');
        }
        
        Storage.saveData('patients', patients);
        this.loadPatients();
        this.closePatientModal();
        window.clinicBoard.dashboardComponent.updateDashboard();
    }

    editPatient(patientId) {
        this.openPatientModal(patientId);
    }

    deletePatient(patientId) {
        if (confirm('Are you sure you want to delete this patient?')) {
            const patients = Storage.getData('patients');
            const filtered = patients.filter(p => p.id !== patientId);
            Storage.saveData('patients', filtered);
            this.loadPatients();
            window.clinicBoard.showNotification('Patient deleted successfully', 'success');
            window.clinicBoard.dashboardComponent.updateDashboard();
        }
    }
}
