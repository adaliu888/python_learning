package utils

import (
	"fmt"
	"newworld-project/config"

	"gopkg.in/gomail.v2"
)

func SendEmail(to, subject, body string) error {
	cfg := config.ConfigInstance.Email

	m := gomail.NewMessage()
	m.SetHeader("From", cfg.From)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(cfg.Host, cfg.Port, cfg.Username, cfg.Password)

	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

func SendVerificationEmail(email, username, token string) error {
	cfg := config.ConfigInstance.App
	
	subject := "Verify Your Email - " + cfg.Name
	verificationURL := fmt.Sprintf("%s/verify-email?token=%s", cfg.FrontendURL, token)
	
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>Welcome to %s!</h2>
			<p>Hi %s,</p>
			<p>Thank you for registering with us. Please click the link below to verify your email address:</p>
			<p><a href="%s">Verify Email Address</a></p>
			<p>If the link doesn't work, copy and paste this URL into your browser:</p>
			<p>%s</p>
			<p>This link will expire in 24 hours.</p>
			<p>Best regards,<br>The %s Team</p>
		</body>
		</html>
	`, cfg.Name, username, verificationURL, verificationURL, cfg.Name)

	return SendEmail(email, subject, body)
}

func SendPasswordResetEmail(email, username, token string) error {
	cfg := config.ConfigInstance.App
	
	subject := "Reset Your Password - " + cfg.Name
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", cfg.FrontendURL, token)
	
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>Password Reset Request</h2>
			<p>Hi %s,</p>
			<p>We received a request to reset your password. Click the link below to create a new password:</p>
			<p><a href="%s">Reset Password</a></p>
			<p>If the link doesn't work, copy and paste this URL into your browser:</p>
			<p>%s</p>
			<p>This link will expire in 1 hour.</p>
			<p>If you didn't request this password reset, please ignore this email.</p>
			<p>Best regards,<br>The %s Team</p>
		</body>
		</html>
	`, username, resetURL, resetURL, cfg.Name)

	return SendEmail(email, subject, body)
} 