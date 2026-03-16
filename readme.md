## Running Deliva locally

### Prerequisites
- Docker Desktop installed
- Git

### Steps
1. Clone the repo
   git clone https://github.com/Katleho-codes/spaza-shop
   cd spaza-shop

2. Add env vars
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   # fill in your values

3. Run
   docker-compose up

4. Open
   Frontend: http://localhost:3000
   Backend:  http://localhost:8000