import { supabase } from './config.js';

export async function handleSignUp(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (error) {
        alert('Error: ' + error.message);
        return;
    }

    alert('Sign up successful! Please check your email to confirm.');
    showLoginForm();
}

export async function handleSignIn(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert('Error: ' + error.message);
        return;
    }

    window.location.href = 'index.html';
}

export async function handleSignOut(): Promise<void> {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

export async function checkAuth(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();

    const authForms = document.getElementById('auth-forms');
    const userDashboard = document.getElementById('user-dashboard');
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');

    if (user) {
        if (authForms) authForms.style.display = 'none';
        if (userDashboard) userDashboard.style.display = 'block';
        if (userNameEl) userNameEl.textContent = user.user_metadata.name || 'User';
        if (userEmailEl) userEmailEl.textContent = user.email || '';
    } else {
        if (authForms) authForms.style.display = 'block';
        if (userDashboard) userDashboard.style.display = 'none';
    }

    updateNavigation();
}

export async function updateNavigation(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const loginLinks = document.querySelectorAll('nav a[href="login.html"]');

    loginLinks.forEach(link => {
        if (user) {
            link.textContent = `Hello, ${user.user_metadata.name || 'User'}`;
        } else {
            link.textContent = 'Login';
        }
    });
}

function showLoginForm(): void {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
}

export function showSignupForm(): void {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
}

export function initAuthPage(): void {
    checkAuth();

    const loginForm = document.getElementById('login-form-element');
    const signupForm = document.getElementById('signup-form-element');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) loginForm.addEventListener('submit', handleSignIn);
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
    if (logoutBtn) logoutBtn.addEventListener('click', handleSignOut);
}