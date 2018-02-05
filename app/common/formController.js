"use strict";
(function() {
    const form = document.querySelector("#signup") ||
                document.querySelector("#login") ||
                document.querySelector("#changePassword");
    const passwordsInput = Array.from(document.querySelectorAll("input[type='password']"));
    form.onsubmit = e => {
        if (passwordsInput.length == 1) {
            const passwordInput = passwordsInput[0];
            if (passwordInput.value.length < 8) {
                e.preventDefault();
                alert("Password should have at least 8 symbols");
            }
        }
        else {
            const correctPasswords = passwordsInput.filter(val => val.value.length >= 8);
            if (correctPasswords.length != 2) {
                e.preventDefault();
                alert("Password should have at least 8 symbols");
            }
        }
    };
    
    
    const deleteAccountBtn = document.querySelector("#deleteAccount");
    if (deleteAccountBtn) deleteAccountBtn.onclick = () => {
        if (confirm("Are you sure?")) {
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest("DELETE", "/deleteAccount", status => {
                if (status == 200) location.reload(true);
            }));
        }
    };
    
})();