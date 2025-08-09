document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeIcon = document.getElementById('dark-mode-icon');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedDarkMode = localStorage.getItem('darkMode');

  if (darkModeToggle && darkModeIcon) {
    if (savedDarkMode === 'enabled' || (savedDarkMode === null && prefersDarkScheme.matches)) {
      document.body.classList.add('dark-mode');
      darkModeIcon.src = '/asset/light-mode-icon.svg';
      darkModeIcon.alt = 'Light Mode Icon';
    }

    darkModeToggle.addEventListener('click', () => {
      const isDarkMode = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
      darkModeIcon.src = isDarkMode ? '/asset/light-mode-icon.svg' : '/asset/dark-mode-icon.svg';
      darkModeIcon.alt = isDarkMode ? 'Light Mode Icon' : 'Dark Mode Icon';
    });
  }

  function showToast(message, type = 'success') {
    const customToast = document.getElementById('custom-toast');
    if (customToast) {
      customToast.textContent = message;
      customToast.classList.remove('success', 'error');
      customToast.classList.add('custom-toast', 'show', type);

      setTimeout(() => {
        customToast.classList.remove('show');
      }, 3000);
    }
  }

  function setButtonLoadingState(button, isLoading) {
    if (!button) return;
    if (isLoading) {
      button.disabled = true;
      button.classList.add('loading');
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
      }
      button.innerHTML = '<div class="dots-loader"><span></span></div>';
    } else {
      button.disabled = false;
      button.classList.remove('loading');
      if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  function handleFormSubmit(form, url, successCallback) {
    if (!form) return;

    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required]');

      inputs.forEach(input => {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.classList.remove('visible');
        }
        input.classList.remove('input-error');

        if (!input.value.trim()) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = `${input.placeholder} is required`;
            errorElement.classList.add('visible');
          }
          input.classList.add('input-error');
        }
      });

      if (isValid) {
        setButtonLoadingState(button, true);

        const formData = {};
        new FormData(form).forEach((value, key) => {
          formData[key] = value;
        });

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          setButtonLoadingState(button, false);
          if (data.success) {
            if (successCallback) {
              successCallback(data, formData);
            }
          } else {
            showToast(data.message || 'An unexpected error occurred. Please try again.', 'error');
          }
        })
        .catch(error => {
          setButtonLoadingState(button, false);
          showToast('A network error occurred. Please check your internet connection and try again.', 'error');
        });
      }
    });
  }

  handleFormSubmit(document.getElementById('login-form'), '/api/auth/login', (data) => {
    showToast(data.message);
    if (data.data && data.data.session) {
        localStorage.setItem('access_token', data.data.session.access_token);
    }
    window.location.href = '/';
  });

  handleFormSubmit(document.getElementById('signup-form'), '/api/auth/signup', (data, formData) => {
    showToast(`A verification OTP has been sent to ${formData.email}.`);
    document.getElementById('signup-form').style.display = 'none';
    const verifyOtpForm = document.getElementById('verify-otp-form');
    verifyOtpForm.style.display = 'block';
    document.getElementById('otp-email').value = formData.email;
  });

  handleFormSubmit(document.getElementById('verify-otp-form'), '/api/auth/verify-otp', (data) => {
      showToast('Your email has been verified successfully! You are now logged in.');
      if (data.data && data.data.session) {
          localStorage.setItem('access_token', data.data.session.access_token);
      }
      window.location.href = '/';
  });

  handleFormSubmit(document.getElementById('forgot-form'), '/api/auth/forgot-password', (data, formData) => {
    showToast(`A password reset link has been sent to ${formData.email}.`);
  });

});