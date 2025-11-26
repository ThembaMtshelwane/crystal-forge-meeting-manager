# Crystal Forge Meets

## Assumptions

    1. The system will be designed as a SaaS (Software as a Service): It will have the ability
     to host rooms, meetings and users from diffrent organizations.
    2. The system will have two user types : admin and members
    3. Only admins can create, update and delete a room.
    4. Only admins have access to the full details of a user.


## Tradeoffs

    1. The use of Pinia provides consitent and realtime data updates but its implementation 
    could be considered overkill for this project. 



## 📈 Future Improvements (Roadmap)

Several key enhancements are planned to improve the system:

### ✔ Enhanced Scheduling Checks

Prevent double-booking by querying for conflicting meetings before
saving.

### ✔ User Invitation System

Allow organizers to invite users and track RSVP statuses.

### ✔ Admin User Management

Add an Admin interface for managing user accounts, suspensions, and role
assignments.

---
