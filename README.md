# uuid7-flask

this repository serves two purposes:
1) to demonstrate the flask/nginx/cloudflare tunnel pattern
2) as the actual repository for the https://uuid7.com site

large write up of the pattern:
https://austinsnerdythings.com/2023/11/01/using-github-actions-to-deploy-a-flask-nginx-cloudflared-tunnel-docker-compose-stack/

This pattern also is used to deploy the landing page for the [MonchMatch - Tinder for Food](https://monchmatch.com/) app.

----

added signal and testing containers

---

# Useful Commands

## Useful Commands

### 🐳 Docker / Compose
- Start services in background:  
  ```bash
  docker-compose up -d
  ```

- Stop all services:  
  ```bash
  docker-compose down
  ```

- Restart just the Flask container:  
  ```bash
  docker-compose restart flask
  ```

- View logs for Nginx:  
  ```bash
  docker-compose logs -f nginx
  ```

### 🧪 Running Tests
- Run all tests:  
  ```bash
  docker-compose run --rm test-runner
  ```

- Run only Flask tests:  
  ```bash
  docker-compose run --rm test-runner pytest tests/flask
  ```

- Watch test output live (using ptw):  
  ```bash
  docker-compose run --rm test-runner ptw
  ```

### 🌐 Service Checks
- Check Nginx via browser:  
  Visit [http://localhost:8755](http://localhost:8755)

- Test Signal API manually:  
  ```bash
  curl http://localhost:8756/v1/about
  ```