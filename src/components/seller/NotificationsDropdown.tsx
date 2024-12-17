import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationsDropdown() {
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => [], // Replace with actual notifications fetch
    initialData: []
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={`
      p-4 border-b last:border-b-0
      ${notification.read ? "bg-white" : "bg-blue-50"}
    `}
    >
      <h4 className="font-medium">{notification.title}</h4>
      <p className="text-sm text-gray-600">{notification.message}</p>
      <span className="text-xs text-gray-500">
        {new Date(notification.createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
}