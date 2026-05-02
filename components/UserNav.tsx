import { logoutAction } from "@/app/actions/authActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-0 w-full h-full rounded-full bg-trust-dark flex items-center justify-center">
          <User size={40} className="w-4 h-4 text-slate-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-12 mt-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
          <Link href="/dashboard/assessments">
            <DropdownMenuItem className="cursor-pointer">
              <List /> Assessments
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logoutAction}>
            <LogOut />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
