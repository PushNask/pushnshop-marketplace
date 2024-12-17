import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';

export function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}