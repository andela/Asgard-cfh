/* eslint-disable */
if (window.location.hash == '#_=_') window.location.hash = '#!';

// Decode token to determine if user is logged in and token hasn't expired
const userToken = localStorage.getItem('token');
if (userToken) {
    const checkAuthenticationStatus = (token) => {
        const decoded = jwt_decode(token);
        try {
            const timeLeft = decoded.exp - (Date.now() / 1000);
            if (timeLeft <= 0) {
                // token has expired, user isn't logged in
                return localStorage.setItem('token', '');
            }
        } catch (e) {
            // error in decoding token, user isn't logged in
            return localStorage.setItem('token', '');
        }
        window.user = decoded;
    };
    checkAuthenticationStatus(userToken);
}
