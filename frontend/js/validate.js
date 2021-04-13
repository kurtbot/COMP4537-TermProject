// Checks if email is valid format
// RegEx obtained from: https://ui.dev/validate-email-address-javascript/
function emailIsValid (email) {
    console.log("Checking: " + email);
    const format = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return format.test(email);
}