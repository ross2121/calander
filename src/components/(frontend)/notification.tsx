"use client";
import React, { useEffect, useState } from "react";

type Event = {
  date: string; 
  time: string; 
};

export const NotificationsComponent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState<{ [key: string]: number }>({});

  
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/getall");
      const data = await response.json();
      console.log("Fetched events:", data.getall); 
      setEvents(data.getall || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  const requestNotificationPermission = async () => {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission); 
    }
  };

  const sendNotification = (event: Event) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Event Reminder", {
        body: `Event scheduled for ${event.time}.`,
      });

      notification.onclick = () => notification.close();

      notification.onclose = () => {
        const snoozeKey = `${event.date}-${event.time}`;
        setSnoozedNotifications((prev) => ({
          ...prev,
          [snoozeKey]: Date.now() + 300000,
        }));
      };
    }
  };

  
  const checkForNotifications = () => {
    const now = new Date();
    console.log("Current time:", now); 

    events.forEach((event) => {
      const [day, month, year] = event.date.split("/");
      const [hours, minutes] = event.time.split(":");
      const eventDateTime = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes)
      ).getTime();

      console.log(`Checking event: ${event.date} ${event.time}, Event time: ${new Date(eventDateTime)}`); // Log event time

      const snoozeKey = `${event.date}-${event.time}`;
      if (
        eventDateTime <= now.getTime() &&
        eventDateTime > now.getTime() - 60000 && 
        (!snoozedNotifications[snoozeKey] || snoozedNotifications[snoozeKey] <= now.getTime())
      ) {
        console.log("Sending notification for event:", event); 
        sendNotification(event);
      }
    });
  };
console.log(checkForNotifications);
  useEffect(() => {
    requestNotificationPermission();
    fetchEvents();

  
  }, []);
  useEffect(() => {
  }, [events, snoozedNotifications]);

  return null;
};
