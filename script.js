
const ACCOUNT_KEY = "warmConnectAccount";
const CURRENT_USER_KEY = "warmConnectCurrentUser";

// SIGN UP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            alert("Please complete all fields.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            if (localStorage.getItem(ACCOUNT_KEY)) {
                alert("An account already exists in this demo. Please log in.");
                return;
            }

            const account = { name, email, password, bio: "" };

            localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
            localStorage.setItem(CURRENT_USER_KEY, email);

            alert("Account created successfully!");
            window.location.href = "profile.html";
        } catch (error) {
            alert("Unable to save your account in this browser.");
        }
    });
}

// LOG IN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        try {
            const savedAccount = localStorage.getItem(ACCOUNT_KEY);
            const account = savedAccount ? JSON.parse(savedAccount) : null;

            if (
                account &&
                account.email === email &&
                account.password === password
            ) {
                localStorage.setItem(CURRENT_USER_KEY, account.email);
                window.location.href = "profile.html";
            } else {
                alert("Invalid email or password. Please try again.");
            }
        } catch (error) {
            alert("Unable to read your account. Please try again.");
        }
    });
}

// LOAD PROFILE
const profileName = document.getElementById("profileName");

if (profileName) {
    try {
        const savedAccount = localStorage.getItem(ACCOUNT_KEY);
        const account = savedAccount ? JSON.parse(savedAccount) : null;
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);

        if (!account || account.email !== currentUser) {
            alert("Please log in first.");
            window.location.replace("login.html");
        } else {
            profileName.textContent = account.name;

            document.getElementById("profileEmail").textContent =
                account.email;

            document.getElementById("profileBio").textContent =
                account.bio || "Write something about yourself...";
        }
    } catch (error) {
        alert("Unable to load your profile.");
        window.location.replace("login.html");
    }
}

// EDIT PROFILE
document.addEventListener("DOMContentLoaded", () => {
    // 1. Target existing profile DOM nodes
    const editProfileBtn = document.getElementById("editProfileBtn");
    const profileInfoSection = document.querySelector(".profile-info");
    
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profileBio = document.getElementById("profileBio");

    // 2. Tab switching logic (Posts / Saved tabs toggle)
    const tabButtons = document.querySelectorAll(".tab-btn");
    const postsSection = document.getElementById("postsSection");
    const savedSection = document.getElementById("savedSection");
    

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const currentTab = button.getAttribute("data-tab");
            if (currentTab === "posts") {
                postsSection.classList.remove("hidden");
                savedSection.classList.add("hidden");
            } else if (currentTab === "saved") {
                savedSection.classList.remove("hidden");
                postsSection.classList.add("hidden");
            }
        });
    });

    // 3. Edit Profile Toggle Logic (In-Border Form Generation)
    let isEditing = false;

    editProfileBtn.addEventListener("click", () => {
        if (!isEditing) {
            // Switch to Edit Mode
            isEditing = true;
            editProfileBtn.textContent = "Save Changes";
            editProfileBtn.style.backgroundColor = "#4a3b32";
            editProfileBtn.style.color = "#ffffff";

            // Add an active border outline layout around the profile box wrapper
            profileInfoSection.style.border = "2px dashed #4a3b32";
            profileInfoSection.style.borderRadius = "12px";
            profileInfoSection.style.padding = "20px";

            // Replace interactive sections with input tags
            profileName.innerHTML = `<input type="text" id="editNameInput" value="${profileName.textContent}" style="width:90%; padding:6px; font-size:16px; font-family:inherit; border:1px solid #dbdbdb; border-radius:4px; margin-bottom:5px;">`;
            
            // Email is now rendered read-only, cursor-disabled, and tinted light gray
            profileEmail.innerHTML = `<input type="email" id="editEmailInput" value="${profileEmail.textContent}" readonly style="width:90%; padding:6px; font-size:13px; font-family:inherit; border:1px solid #dbdbdb; border-radius:4px; margin-bottom:5px; background-color:#f0f0f0; color:#8e8e8e; cursor:not-allowed;">`;
            
            profileBio.innerHTML = `<textarea id="editBioInput" style="width:95%; height:60px; padding:6px; font-size:14px; font-family:inherit; border:1px solid #dbdbdb; border-radius:4px; resize:none;">${profileBio.textContent}</textarea>`;

        } else {
            // Switch back to View Mode & Save
            isEditing = false;
            editProfileBtn.textContent = "Edit Profile";
            editProfileBtn.style.backgroundColor = "#ffffff";
            editProfileBtn.style.color = "#262626";

            // Extract values
            const updatedName = document.getElementById("editNameInput").value.trim();
            const updatedEmail = document.getElementById("editEmailInput").value.trim(); // Reads original unchanged value
            const updatedBio = document.getElementById("editBioInput").value.trim();

            // Render text layers back onto dashboard interface panels
            profileName.textContent = updatedName || "User Name";
            profileEmail.textContent = updatedEmail || "@user@example.com";
            profileBio.textContent = updatedBio || "Write something about yourself...";

            // Reset dynamic temporary edit container border safely
            profileInfoSection.style.border = "none";
            profileInfoSection.style.padding = "24px 20px 15px 20px";
        }
    });
});


// POSTS AND SAVED TABS
const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        tabButtons.forEach(function (tab) {
            tab.classList.remove("active");
        });

        button.classList.add("active");

        const showPosts = button.dataset.tab === "posts";

        document.getElementById("postsSection")
            .classList.toggle("hidden", !showPosts);

        document.getElementById("savedSection")
            .classList.toggle("hidden", showPosts);
    });
});

// LOG OUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(CURRENT_USER_KEY);
        window.location.href = "login.html";
    });
}
