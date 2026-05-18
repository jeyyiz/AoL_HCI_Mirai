const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const emailGroup = document.getElementById('emailGroup');
const passwordGroup = document.getElementById('passwordGroup');

emailInput.addEventListener('input', function() {
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        clearError(emailGroup);
    } 
    else if (!emailPattern.test(emailValue)) {
        showError(emailGroup, "Please enter a valid email address (e.g. name@example.com)");
    } 
    else {
        clearError(emailGroup);
    }
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    let isFormValid = true;

    if (emailValue === "") {
        showError(emailGroup, "Email is required");
        isFormValid = false;
    } else if (emailGroup.classList.contains('error')) {
        isFormValid = false;
    }

    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);

    if (passwordValue === "") {
        showError(passwordGroup, "Password is required");
        isFormValid = false;
    } 
    else if (passwordValue.length < 8 || !hasLetter || !hasNumber) {
        showError(passwordGroup, "Incorrect password");
        isFormValid = false;
    } 
    else {
        clearError(passwordGroup);
    }

    if (isFormValid) {
        showToastAndRedirect();
    }
});

function showError(inputGroup, message) {
    inputGroup.classList.add('error');
    const errorMsg = inputGroup.querySelector('.error-message');
    errorMsg.innerText = message;
}

function clearError(inputGroup) {
    inputGroup.classList.remove('error');
}

function showToastAndRedirect() {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <div class="toast-content">
            <h4>Sign In Successful!</h4>
            <p>Welcome back to your account.</p>
        </div>
    `;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        loginForm.reset(); 
        
        window.location.href = "/html/home.html"; 
    }, 2000);
}