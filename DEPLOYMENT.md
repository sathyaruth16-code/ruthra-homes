# Configuration & Deployment Guide

## Environment Configuration

### Backend .env File

Create `backend/.env` file with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruthrahomes

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Application Environment
NODE_ENV=development
```

### Environment Variables Explained

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Port on which Express server runs |
| DB_USER | postgres | PostgreSQL username |
| DB_PASSWORD | password | PostgreSQL password |
| DB_HOST | localhost | PostgreSQL server hostname |
| DB_PORT | 5432 | PostgreSQL server port |
| DB_NAME | ruthrahomes | Database name |
| JWT_SECRET | (required) | Secret key for signing JWT tokens |
| JWT_EXPIRE | 7d | Token expiration time (7 days) |
| NODE_ENV | development | Environment mode |

## Database Configuration

### PostgreSQL Connection String
The application uses connection pooling with pg library:

```javascript
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ruthrahomes'
});
```

### Database Backup

```bash
# Backup the database
pg_dump -U postgres -d ruthrahomes -f backup.sql

# Restore from backup
psql -U postgres -d ruthrahomes -f backup.sql
```

### Database Maintenance

```bash
# Connect to database
psql -U postgres -d ruthrahomes

# Check database size
SELECT pg_database.datname, 
  pg_size_pretty(pg_database_size(pg_database.datname)) 
FROM pg_database;

# Check table sizes
SELECT tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname = 'public';

# Vacuum and analyze (optimization)
VACUUM ANALYZE;
```

## Frontend Configuration

### API Base URL
The frontend API calls are configured in `frontend/js/api.js`:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

To change this for production, update:
- In development: `http://localhost:5000/api`
- In production: `https://your-domain.com/api`

### CORS Configuration
Current CORS setup in backend allows all origins. For production, update in `server.js`:

```javascript
// Current (development)
app.use(cors());

// Production (restrict to specific domain)
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## Production Deployment

### Prerequisites
- Node.js v14+ installed on server
- PostgreSQL v12+ installed and running
- HTTPS certificate (SSL/TLS)
- Domain name

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### Step 2: Clone Application

```bash
cd /var/www
sudo git clone <your-repo-url> ruthrahomes
cd ruthrahomes/backend
sudo npm install
```

### Step 3: Database Setup

```bash
# As postgres user
sudo -u postgres psql

# Inside psql
CREATE DATABASE ruthrahomes;
\q

# Import schema
sudo -u postgres psql -d ruthrahomes -f database.sql
```

### Step 4: Configure Environment

```bash
sudo nano backend/.env
```

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruthrahomes
JWT_SECRET=your_very_secure_random_string_here_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=production
```

### Step 5: Create Systemd Service

Create `/etc/systemd/system/ruthrahomes.service`:

```ini
[Unit]
Description=Ruther Homes Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ruthrahomes/backend
ExecStart=/usr/bin/node /var/www/ruthrahomes/backend/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog

Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable ruthrahomes
sudo systemctl start ruthrahomes
sudo systemctl status ruthrahomes
```

### Step 6: Nginx Configuration

Create `/etc/nginx/sites-available/ruthrahomes`:

```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-domain.com.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/ruthrahomes/frontend;
    index index.html;

    # API requests
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend SPA
    location / {
        try_files $uri /index.html;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/ruthrahomes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

Update Nginx config with certificate paths:
```nginx
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

### Step 8: Update Frontend API URL

Edit `frontend/js/api.js`:
```javascript
const API_BASE = 'https://your-domain.com/api';
```

### Step 9: Firewall Configuration

```bash
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### Step 10: Monitoring Logs

```bash
# Backend logs
sudo journalctl -u ruthrahomes -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
```

## Docker Deployment (Optional)

### Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ruthrahomes
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DB_USER: postgres
      DB_PASSWORD: password
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ruthrahomes
      JWT_SECRET: your_secret_here
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html
    ports:
      - "80:80"

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

## Performance Optimization

### Database Optimization
- Indexes are already created on:
  - users(email)
  - tenants(user_id, room_id, status)
  - rent_payments(tenant_id, rent_month, status)
  - rooms(room_number)

### Caching (Future Enhancement)
Install Redis:
```bash
npm install redis
```

### Load Balancing
Use Nginx upstream with multiple backend instances:

```nginx
upstream backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}
```

## Security Hardening

### 1. HTTPS/SSL
- Use Let's Encrypt for free certificates
- Redirect HTTP to HTTPS
- Use HSTS headers

### 2. JWT Security
```javascript
// In production, use very long random strings
JWT_SECRET=use_a_cryptographically_secure_random_string_at_least_32_characters
```

Generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Password Requirements
Add password complexity validation in auth.js

### 4. Rate Limiting
```bash
npm install express-rate-limit
```

Add to routes:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/auth/', limiter);
```

### 5. Input Validation
Already implemented with express-validator

### 6. SQL Injection Prevention
Using parameterized queries with pg:
```javascript
pool.query('SELECT * FROM users WHERE email = $1', [email])
```

### 7. CORS Security
Restrict to specific domains in production

## Backup Strategy

### Automated Daily Backup

Create `/home/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ruthrahomes"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump -U postgres -d ruthrahomes | gzip > "$BACKUP_DIR/ruthrahomes_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

Add to crontab:
```bash
crontab -e

# Add this line to run daily at 2 AM
0 2 * * * /home/backup-db.sh
```

## Monitoring & Alerts

### Health Check Endpoint
```
GET /api/health
```

Use monitoring services:
- Uptime Robot
- New Relic
- Datadog
- Sentry (error tracking)

## Troubleshooting Production Issues

### Application won't start
```bash
sudo journalctl -u ruthrahomes -n 50
```

### Database connection error
```bash
sudo -u postgres psql -d ruthrahomes -c "SELECT 1"
```

### Nginx not proxying
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Out of memory
```bash
free -h
ps aux --sort=-%mem | head
```

### High database load
```sql
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC LIMIT 10;
```

## Scaling Considerations

For 1000+ users:
1. Implement database read replicas
2. Add caching layer (Redis)
3. Use CDN for frontend assets
4. Implement pagination
5. Add query optimization
6. Use connection pooling
7. Implement rate limiting
8. Add monitoring and logging

## CI/CD Pipeline (Optional)

Using GitHub Actions:

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/ruthrahomes
            git pull origin main
            cd backend
            npm install
            sudo systemctl restart ruthrahomes
```
