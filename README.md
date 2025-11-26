# Crystal Forge Meets

🚀 **Project Overview: Simple Room and Meeting Management**

Crystal Forge Meets is designed to streamline meeting scheduling and
room booking within an organization. It provides a simple, yet
comprehensive solution for users to create, manage, and track meetings
while efficiently handling the allocation of available conference rooms.

## Approach

This a multiuser platofrm. A user can register an account and login. There are two user types - i.e member and admin. All users that
register an account will be assigned as member. Only the superAdmin (me), can create a new admin. Currently there is only one admin and
thier details are:

```bash
# Admin details
eamil: admin@cfm.com
password: admin123
```

There are three main data collections, - i.e Users, Rooms and Meetings all stored in the db.json file. Once logged in, the admin has
access to CRUD (Create, Read, Update and Delete) all the collections while the memeber users have access to CRUD Meetings, only read
from Rooms and Meeting. The API endpoints are integrated through a combination of Pinia and simple axios requests.
Pages from here on out use the DashboardLayout, which is defined using Vuetify's ready made components and Vueouter's router-view.
This give consistency and allows easy naviation betweeen pages.
The backed is trully extensive and thus has the ability to scale, especially as a SaaS (software as a Service)

## 🔑 Key Features

| Feature                 | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| **Meeting Management**  | Schedule, organize, edit, and delete meetings efficiently.                |
| **Room Booking**        | Book and manage meeting rooms with ease, linking a meeting to a resource. |
| **Team Collaboration**  | Facilitate collaboration by having a central system for meetings.         |
| **Analytics Dashboard** | Track meeting statistics and resource usage insights.                     |

---

## 🛠️ Tech Stack & Architecture

This project follows a standard decoupled architecture, splitting the
application into a **frontend client** and a **backend API**.

| Component            | Technology                  | Description                                                         |
| -------------------- | --------------------------- | ------------------------------------------------------------------- |
| **Frontend**         | **Vue 3 (Composition API)** | The reactive and component-based user interface.                    |
| **State Management** | **Pinia**                   | The intuitive, type-safe store for application state.               |
| **UI Framework**     | **Vuetify 3**               | Comprehensive and accessible component library for Material Design. |
| **Backend**          | **Node.js/Express**         | Handles API requests, business logic, and database interaction.     |
| **Database**         | **In-memory (db.json)**     | Stores user, meeting, and room data using a JSON file as storage.   |

---

## 🏃 Getting Started

The project structure is organized into two main directories: `backend`
and `frontend`.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ThembaMtshelwane/crystal-forge-meeting-manager.git
cd crystal-forge-meets
```

---

### 2️⃣ Backend Setup (Server API)

```bash
cd backend
npm install
npm run dev
```

🚀 Server listening on **http://localhost:5000**

### 3️⃣ Frontend Setup (Vue Application)

Open a refresh terminal. Make sure you're in the crystal-forge-meets folder

```bash
cd frontend
npm install
npm run dev
```

🚀 Access the application in your browser at:
**http://localhost:3000/**.

---

## 🧠 Key Learning & Takeaways

Building **Crystal Forge Meets** helped reinforce several modern
frontend development concepts:

### 🔹 Custom Events in Vue

Using `defineEmits` to create generic and reusable components that
communicate up to parent components---such as **ConfirmForm** and
**Modal**---without relying on global state unnecessarily.

### 🔹 Vuetify 3

Gained practical experience in building clean, accessible UI layouts
using Material Design components.

### 🔹 Pinia

Utilized Pinia for modular, type-safe state management---especially
helpful for fetching, caching, and updating room/meeting data across
multiple views.

---

## 📈 Future Improvements (Roadmap)

Several key enhancements are planned to improve the system:

### ✔ Data Isolation

Ensure users can only view, edit, or delete their own meetings (except
Admins).

### ✔ Enhanced Scheduling Checks

Prevent double-booking by querying for conflicting meetings before
saving.

### ✔ User Invitation System

Allow organizers to invite users and track RSVP statuses.

### ✔ Admin User Management

Add an Admin interface for managing user accounts, suspensions, and role
assignments.

---

## ⏳ Development Journey : 35hrs

This project was a new and exciting opportunity to explore both Vue and Vuetify in depth. I spent around 35 hours coding,
researching, and experimenting — and I’m genuinely proud of what I accomplished in that time.

The experience really boosted my confidence. It showed me that I’m capable of learning and adapting to any new
framework that comes my way. To be fair, about 80% felt familiar, but that remaining 20% was exactly the challenge I needed to grow.

## 🙌 Contributions

Pull requests and improvements are welcome!
