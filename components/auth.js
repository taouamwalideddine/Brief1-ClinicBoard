import { Storage } from './storage.js';

export class AuthComponent {
    constructor() {
        this.failedAttempts = 0;
        this.maxFailedAttempts = 3;
        this.lockoutDuration = 30000;
        this.lockoutEndTime = null;
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    isLockedOut() {
        return this.lockoutEndTime && Date.now() < this.lockoutEndTime;
    }

    getRemainingLockoutTime() {
        if (this.lockoutEndTime && Date.now() < this.lockoutEndTime) {
            return Math.ceil((this.lockoutEndTime - Date.now()) / 1000);
        }
        return 0;
    }

    async handleLogin(password) {
        if (this.isLockedOut()) {
            const remainingTime = this.getRemainingLockoutTime();
            return { success: false, message: `Account locked. Try again in ${remainingTime} seconds.` };
        }

        if (!password) {
            return { success: false, message: 'Please enter your password' };
        }

        try {
            const storedPasswordHash = Storage.getPasswordHash();
            
            if (!storedPasswordHash) {
                return { success: false, message: 'No password set. Please set a password first.' };
            }

            const enteredPasswordHash = await this.hashPassword(password);
            
            if (enteredPasswordHash === storedPasswordHash) {
                this.failedAttempts = 0;
                this.lockoutEndTime = null;
                return { success: true, message: 'Login successful!' };
            } else {
                this.failedAttempts++;
                
                if (this.failedAttempts >= this.maxFailedAttempts) {
                    this.lockoutEndTime = Date.now() + this.lockoutDuration;
                    this.startLockoutTimer();
                    return { success: false, message: 'Too many failed attempts. Account locked for 30 seconds.' };
                } else {
                    const remainingAttempts = this.maxFailedAttempts - this.failedAttempts;
                    return { success: false, message: `Incorrect password. ${remainingAttempts} attempts remaining.` };
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    }

    async handleSetPassword(password, confirmPassword) {
        if (!password || !confirmPassword) {
            return { success: false, message: 'Please fill all fields' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        if (password.length < 8) {
            return { success: false, message: 'Password must be at least 8 characters' };
        }

        try {
            const passwordHash = await this.hashPassword(password);
            Storage.savePasswordHash(passwordHash);
            return { success: true, message: 'Password created successfully!' };
        } catch (error) {
            console.error('Set password error:', error);
            return { success: false, message: 'An error occurred while creating password' };
        }
    }

    startLockoutTimer() {
        const timer = setInterval(() => {
            const remainingTime = this.getRemainingLockoutTime();
            
            if (remainingTime <= 0) {
                clearInterval(timer);
                this.lockoutEndTime = null;
                this.failedAttempts = 0;
            }
        }, 1000);
    }

    checkExistingPassword() {
        return Storage.getPasswordHash() !== null;
    }
}
