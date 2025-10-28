document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.querySelector('[data-tab="login"]');
  const signupTab = document.querySelector('[data-tab="signup"]');
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginContent = document.getElementById("loginTab");
  const signupContent = document.getElementById("signupTab");
  const messageBox = document.getElementById("messageBox");

  // Tab switching
  loginTab.addEventListener("click", () => {
    switchTab("login");
  });

  signupTab.addEventListener("click", () => {
    switchTab("signup");
  });

  function switchTab(tab) {
    if (tab === "login") {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginContent.classList.add("active");
      signupContent.classList.remove("active");
    } else {
      signupTab.classList.add("active");
      loginTab.classList.remove("active");
      signupContent.classList.add("active");
      loginContent.classList.remove("active");
    }
    clearMessage();
  }

  // Login Form Submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      // Get users from db.json
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      // Find user
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Set logged in user in db.json
        await fetch('http://localhost:3000/currentUser', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            loggedInAt: new Date().toISOString()
          })
        });

        showMessage("Login successful! Redirecting...", "success");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        showMessage("Invalid email or password. Please try again.", "error");
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage("Error connecting to server. Please try again.", "error");
    }
  });

  // Sign Up Form Submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

    // Validate passwords match
    if (password !== confirmPassword) {
      showMessage("Passwords do not match!", "error");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long!", "error");
      return;
    }

    try {
      // Get existing users from db.json
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      // Check if email already exists
      if (users.find(u => u.email === email)) {
        showMessage("Email already registered! Please login instead.", "error");
        return;
      }

      // Add new user to db.json
      await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          createdAt: new Date().toISOString()
        })
      });

      showMessage("Account created successfully! Please login.", "success");

      // Reset form
      signupForm.reset();

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        switchTab("login");
        document.getElementById("loginEmail").value = email;
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      showMessage("Error connecting to server. Please try again.", "error");
    }
  });

  // Helper functions
  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = "block";
  }

  function clearMessage() {
    messageBox.textContent = "";
    messageBox.style.display = "none";
  }

  // Check if already logged in
  (async () => {
    try {
      const response = await fetch('http://localhost:3000/currentUser');
      const currentUser = await response.json();
      if (currentUser && currentUser.name) {
        showMessage(`Logged in as ${currentUser.name}. Redirecting...`, "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      }
    } catch (error) {
      // No current user or server not running, continue normally
    }
  })();
});
