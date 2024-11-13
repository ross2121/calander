Calendar App
A simple Calendar app to manage scheduled events and receive timely notifications when an event is due. This app is designed for setting, viewing, and receiving alerts for your events directly from your browser.

Features
Event Scheduling: Add events with a                                                 
Automatic Notifications: Receive browser notifications when an event time arrives.
Snooze Option: Allows you to snooze notifications for 5 minutes if you're not ready to act.
Dismiss Notifications: Easily dismiss notifications that no longer require your attention.
Installation
Clone the Repository:

bash
Copy code
git clone https://github.com/yourusername/calendar-app.git
Install Dependencies:

bash
Copy code
npm install
Add env:
Create a file env and add a  database URL(Postsql)

Start the App:

npm run start
Open in Browser: Visit http://localhost:3000 to access the app.
  ![Screenshot 2024-11-13 195123](https://github.com/user-attachments/assets/2967ee81-6964-46d9-b97b-23f754b3b510)
title, date, time, and optional image.

Usage
Add Events: Use the interface to create new events, specifying the title, date, and time.
Receive Notifications: Notifications appear at the scheduled time, alerting you of upcoming events.
Snooze or Dismiss Notifications: You can either dismiss the notification or snooze it for 5 minutes, if desired.
Notification Permissions
Upon starting the app, you may be asked to allow notifications. Please enable this to receive alerts. Notifications are essential to the functionality of the Calendar App.
