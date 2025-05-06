const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
 // Check if there is a session with user data
 if (req.session && req.session.user) {
    // Session exists, now verify the JWT token if it's provided
    const token = req.session.user.token || req.headers['authorization']; // Assuming token is stored in session or headers
    
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' }); // No token found
    }
    
    // Verify the token
    jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' }); // Token invalid
        }
        
        // If token is valid, attach decoded user info to request object for downstream use
        req.user = decoded;
        next(); // Allow access to the next route handler
    });
} else {
    // If no session user data exists, deny access
    return res.status(401).json({ message: 'Unauthorized: No valid session found' });
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
