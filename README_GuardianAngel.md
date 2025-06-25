
# 🛡️ Guardian Angel – Emergency Alert System

**Guardian Angel** is a real-time emergency response application that allows users to send distress alerts to predefined contacts with their live location. It’s designed to enhance personal safety in critical situations.

---

## 🚀 Features

- 🚨 One-click SOS alert trigger
- 📍 Live GPS location sharing via Google Maps
- 📤 Sends SMS/notification to emergency contacts
- 📁 Logs all alerts with time and coordinates
- 🔐 User authentication (optional)
- ☁️ Backend-integrated alert storage (MongoDB/Node.js)

---

## 🛠️ Tech Stack

| Frontend | Backend | APIs & Services |
|----------|---------|------------------|
| HTML, CSS, JavaScript | Node.js, Express.js | Google Maps API, Twilio SMS API |
| Bootstrap | MongoDB (Mongoose) | RESTful APIs |

---

## 📂 Project Structure

```
guardian-angel/
├── client/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server/
│   ├── app.js
│   ├── routes/
│   │   └── alert.js
│   └── utils/
│       └── smsService.js
├── .env
├── package.json
└── README.md
```

---

## 📷 Screenshots

*Add demo images or a GIF of app usage here.*

---

## 🧪 How to Run Locally

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/guardian-angel
cd guardian-angel
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Start the Server**
```bash
node app.js
```

4. **Open Frontend**
Open `client/index.html` in your browser

---

## 🧠 Use Case Scenarios

- Personal safety for students, travelers, night workers
- Emergency use during medical issues, harassment, or accidents
- Easily extendable to mobile platforms or smartwatches

---

## 🙋‍♂️ Author

**Kundan Singh**  
📫 [LinkedIn](https://www.linkedin.com/in/kundan-singh-27b93327a)  
🌐 [GitHub](https://github.com/CodaholicCodes)

---

## 📝 License

This project is licensed under the MIT License.

> ⚡ *“Because sometimes, one alert can save a life.”*
