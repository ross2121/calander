"use client";
import React, { useEffect, useState } from "react";

type Event = {
  date: string; // ISO date string, e.g., "2024-11-20T18:30:00.000Z"
  time: string; // Time string, e.g., "13:23"
};

export const NotificationsComponent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState<{ [key: string]: number }>({});

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/getall");
      const data = await response.json();
      setEvents(data.getall || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  const sendNotification = (event: Event) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Event Reminder", {
        body: `Event scheduled for ${event.time} IST.`,
      });

      notification.onclick = () => notification.close();

      notification.onclose = () => {
        const snoozeKey = `${event.date}-${event.time}`;
        setSnoozedNotifications((prev) => ({
          ...prev,
          [snoozeKey]: Date.now() + 300000, // Snooze for 5 minutes
        }));
      };
    }
  };

  const checkForNotifications = () => {
    const now = new Date();
    const nowIST = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST

    events.forEach((event) => {
      const [year, month, day] = event.date.split("T")[0].split("-");
      const [hours, minutes] = event.time.split(":");
      const eventDateTimeIST = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)).getTime();

      const snoozeKey = `${event.date}-${event.time}`;
      if (
        eventDateTimeIST <= nowIST.getTime() + 60000 && // Notify if event is within the next 1 minute
        (!snoozedNotifications[snoozeKey] || snoozedNotifications[snoozeKey] <= now.getTime())
      ) {
        sendNotification(event);
      }
    });
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchEvents();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(checkForNotifications, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [events, snoozedNotifications]);

  return null;
};
