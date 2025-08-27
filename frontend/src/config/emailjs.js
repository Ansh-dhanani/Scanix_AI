// EmailJS Configuration - Use environment variables for security
// Get these credentials from your EmailJS dashboard:
// 1. Service ID: Create an email service in EmailJS > Email Services
// 2. Template ID: Create a template in EmailJS > Email Templates  
// 3. User ID: Find in EmailJS > Account > API Keys (Public Key - should start with "user_")
export const emailjsConfig = {
  serviceID: import.meta.env.VITE_EMAILJS_SERVICE_ID ,
  templateID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ,
  userID: import.meta.env.VITE_EMAILJS_USER_ID ,
  toEmail: import.meta.env.VITE_CONTACT_EMAIL 
};
