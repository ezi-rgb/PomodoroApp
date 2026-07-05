# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | ✅                 |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please do **not** open a public issue. Instead, email the maintainers directly.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Time

We will acknowledge receipt within 48 hours and aim to provide a fix within 7 days.

## Security Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Sanitize all user inputs
- Validate API payloads with Zod
- Keep dependencies updated via Dependabot
