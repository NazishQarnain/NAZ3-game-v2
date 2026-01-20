// Authentication and User Management
import { auth, db } from './firebase-config.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Login function
export async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get user balance from Firebase
        const userRef = db.ref('users/' + user.uid);
        const snapshot = await userRef.once('value');
        
        if (!snapshot.exists()) {
            // New user, create profile with initial balance
            await userRef.set({
                email: user.email,
                balance: 1000,
                createdAt: new Date().toISOString()
            });
        }
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Signup function
export async function signup(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user profile in Firebase with initial balance
        const userRef = db.ref('users/' + user.uid);
        await userRef.set({
            email: user.email,
            balance: 1000,
            createdAt: new Date().toISOString()
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout function
export async function logout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get user balance from Firebase
export async function getBalance() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user logged in');
        }
        
        const userRef = db.ref('users/' + user.uid);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();
        
        return userData ? userData.balance : 0;
    } catch (error) {
        console.error('Error getting balance:', error);
        return 0;
    }
}

// Update user balance in Firebase
export async function updateBalance(newBalance) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user logged in');
        }
        
        const userRef = db.ref('users/' + user.uid);
        await userRef.update({
            balance: newBalance
        });
        
        return { success: true, balance: newBalance };
    } catch (error) {
        console.error('Error updating balance:', error);
        return { success: false, error: error.message };
    }
}

// Check if user is authenticated
export function checkAuth() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve({ authenticated: true, user: user });
            } else {
                resolve({ authenticated: false });
            }
        });
    });
}

// Redirect to login if not authenticated
export async function requireAuth() {
    const authStatus = await checkAuth();
    if (!authStatus.authenticated) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize balance display on game pages
export async function initBalanceDisplay() {
    await requireAuth();
    
    const balance = await getBalance();
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance;
    }
}

// Setup logout button
export function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
        });
    }
}
