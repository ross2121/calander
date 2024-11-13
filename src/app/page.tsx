import { Form } from "@/components/(frontend)/calander";
import { NotificationsComponent } from "@/components/(frontend)/notification";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Event Scheduler</h1>
        <p className="text-gray-600 mt-2 max-w-md">
          Plan, manage, and get notified about your events effortlessly. Use the calendar below to schedule new events and view upcoming notifications.
        </p>
      </header>

      {/* Notification and Calendar Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-4xl">
        
        {/* Notifications Section */}
        <section className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Notifications</h2>
          <div className="overflow-y-auto max-h-96">
            <NotificationsComponent />
          </div>
        </section>

        {/* Calendar Section */}
        <section className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Schedule Events</h2>
          <div className="flex items-center justify-center">
            <Form />
          </div>
        </section>
      </div>
    </div>
  );
}
