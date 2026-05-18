const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const nameGroup = document.getElementById('nameGroup');
const emailGroup = document.getElementById('emailGroup');
const passwordGroup = document.getElementById('passwordGroup');

fullNameInput.addEventListener('input', function() {
    clearError(nameGroup);
});

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

passwordInput.addEventListener('input', function() {
    const passwordValue = passwordInput.value.trim();
    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);

    if (passwordValue === "") {
        clearError(passwordGroup);
    } else if (passwordValue.length < 8) {
        showError(passwordGroup, "Password must be at least 8 characters");
    } else if (!hasLetter || !hasNumber) {
        showError(passwordGroup, "Password must include both letters and numbers");
    } else {
        clearError(passwordGroup);
    }
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const nameValue = fullNameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    let isFormValid = true;

    if (nameValue === "") {
        showError(nameGroup, "Full Name is required");
        isFormValid = false;
    } else if (nameGroup.classList.contains('error')) {
        isFormValid = false;
    }

    if (emailValue === "") {
        showError(emailGroup, "Email is required");
        isFormValid = false;
    } else if (emailGroup.classList.contains('error')) {
        isFormValid = false;
    }

    if (passwordValue === "") {
        showError(passwordGroup, "Password is required");
        isFormValid = false;
    } else if (passwordGroup.classList.contains('error')) {
        isFormValid = false;
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
            <h4>Sign Up Successful!</h4>
            <p>Your account has been successfully created.</p>
        </div>
    `;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        registerForm.reset(); 
        
        window.location.href = "/html/home.html"; 
    }, 2000);
}