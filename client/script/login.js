function getValues() {
    let usr = document.getElementById("usr").value;
    let pwd = document.getElementById("pwd").value;
    let pwdElement = document.getElementById("pwd2");
    let mode = pwdElement ? "register" : "login";

    // further client side checking
    if (usr === "" || pwd === "" || (pwdElement && pwdElement.value === "")) {
        pwdError("Please fill in the missing fields!")
        return null;
    }

    if (!usr.match(/^[a-zA-Z0-9._\-+]*$/g)) {
        pwdError("Username must only contain upper- and lowercase letters, digits and the special characters \+\-\_\.");
        return null;
    }

    if (
        !(
            pwd.match(/[a-z]/g) &&
            pwd.match(/[A-Z]/g) &&
            pwd.match(/[0-9]/g) &&
            pwd.match(/\W/g) &&
            pwd.length >= 8
        )
    ) {
        pwdError("Password must have at least 8 characters, containing an upper- and lowercase letter, " +
            "digit and a special character");
        return null;
    }

    // compare passwords if register
    if (pwdElement && pwdElement.value !== pwd) {
        pwdError("Passwords doesn't match");
        return null;
    }
    pwdError("client side password ok");
    return {
        username: usr,
        password: pwd,
        mode: mode
    };
}

function pwdError(errorMessage) {
    document.getElementById("pwdError").innerHTML = errorMessage;

}
