# Mini Forum
- This is for learning only
# Framework
- Frontend
  - React
- Backend
  - Container: Docker
  - Database: MySQL
  - Database: Redis
  - NodeJS
  - ORM: Prisma
# ER diagram

# Showcase

# Setup Database
- Install MySQL Community Server `https://dev.mysql.com/downloads/mysql/`
- Install DBeaver `https://dbeaver.io/download/`
- Use 'Docker'
- Create database container via Redis
```
docker pull Redis
docker run -d -p 6379:6379 Redis
```
# dotenv
```
DATABASE_URL="mysql://root:<your_root_pass>@localhost:3306/<your_database_name>"

SECRET="secureproject5433"
```
# To start
- backend: `npm install` then `npx prisma db push` then `npm start`
- frontend: `npm install` then `npm run dev`