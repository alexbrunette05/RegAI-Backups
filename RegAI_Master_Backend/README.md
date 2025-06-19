# Reg AI – Backend Services (Ports 5001–5030)

This repository contains the complete microservice backend architecture for **Reg AI**, a multilingual compliance automation platform.

---

## 🧱 Included Services (30 Total)

Each service is isolated by port and functionality:

- **5001–5014** – Core Modules (WhiteLabel, Fleet, HR, SDS, Alerts)  
- **5015–5020** – Advanced Tools (Incidents, Posters, Region Alerts)  
- **5021–5030** – Enterprise Stack (Jobs, LMS, Messaging, Aerospace, AI Legal Disclaimers)

---

## 📦 Deployment

Each service includes:
- `server.js`
- `.env` with unique `PORT` + `MONGO_URI`
- MongoDB schema(s)
- RESTful endpoints (POST, GET)
- Built with `express`, `mongoose`, `dotenv`, `cors`, `body-parser`

---

## 🛠️ How to Run

```bash
cd [FolderName]
npm install
npm start

