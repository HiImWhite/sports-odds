# Sports Odds

This project uses scrapper to run throught website and put the records in a database.
Records are accessible through the backend service with specific routes.

---

## Features

- **Sports Odds Scraper**
- **Fastify REST API**
- **PostgreSQL**
- **Dockerized**

---

## Technologies Used

- **Backend**: Node.js (TypeScript) with Fastify.
- **Database**: PostgreSQL.
- **Scraper**: Playwright.
- **Containerization**: Docker and Docker Compose.
- **ORM**: Prisma.

---

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.

---

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/HiImWhite/sports-odds.git
   cd sports-odds
   ```

2. Create a `.env` file in the project root with the following variables:

   ```
   POSTGRES_USER=magicuser
   POSTGRES_PASSWORD=magicpassword
   POSTGRES_DB=postgres-sport-odds
   DATABASE_URL=postgresql://magicuser:magicpassword@db:5432/postgres-sport-odds
   ```

3. Ensure that script `start-scrapper.sh` in `./src/scraper/start-scrapper.sh` has LF end of line sequence.

4. Build and start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

---

## Usage

### REST API Endpoints

1. **Get All Today Matches**:

   - URL: `/matches`
   - Method: `GET`
   - Query Parameters:
     - `league` (optional): Filter matches by league.
   - Example:
     ```
     curl "http://localhost:3000/matches?league=KOSTARYKA:%20Primera%20División"
     ```

2. **Get Pre-Match Odds with History of Odds changes**:

   - URL: `/match/:matchId`
   - Method: `GET`
   - Example:
     ```
     curl "http://localhost:3000/match/17-01-20:00-Fleury91K-StEtienneK"
     ```

3. **Generate AKO Coupon**:
   - URL: `/ako-coupon`
   - Method: `POST`
   - Request Body:
     ```json
     {
       "coupon": [
         {
           "matchId": "17-01-20:00-Fleury91K-StEtienneK",
           "oddType": "home"
         },
         { "matchId": "other-id", "oddType": "draw" }
       ]
     }
     ```
   - Example:
     ```
     curl -X POST "http://localhost:3000/ako-coupon" \
          -H "Content-Type: application/json" \
          -d '{"coupon": [{"matchId": "17-01-20:00-Fleury91K-StEtienneK", "oddType": "home"}]}'
     ```

---

### Running the Scraper

1. **Manual Execution**:

   ```
   docker exec -it sports-odds-scraper-1 node /app/dist/src/scrapperRunner.js
   ```

2. **Scheduled Execution**:
   The scraper runs every 30 minutes using node-cron library.

---

## Troubleshooting

1. **Database Connection Issues**:

   - Ensure the `DATABASE_URL` in `.env` matches the database service in `docker-compose.yml`.

2. **Scraper Failing**:

   - Check if Playwright dependencies are installed:
     ```
     docker exec -it sports-odds-scraper-1 npx playwright install --with-deps
     ```

---
