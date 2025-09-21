export class Storage {
    static getData(key) {
        const data = localStorage.getItem(`clinicApp:${key}`);
        return data ? JSON.parse(data) : [];
    }

    static saveData(key, data) {
        localStorage.setItem(`clinicApp:${key}`, JSON.stringify(data));
    }

    static getFinanceData() {
        const finance = localStorage.getItem('clinicApp:finance');
        return finance ? JSON.parse(finance) : { revenue: [], expenses: [] };
    }

    static saveFinanceData(financeData) {
        localStorage.setItem('clinicApp:finance', JSON.stringify(financeData));
    }

    static getPasswordHash() {
        return localStorage.getItem('clinicBoard_password');
    }

    static savePasswordHash(hash) {
        localStorage.setItem('clinicBoard_password', hash);
    }

    static clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('clinicApp:') || key.startsWith('clinicBoard_')) {
                localStorage.removeItem(key);
            }
        });
    }
}
