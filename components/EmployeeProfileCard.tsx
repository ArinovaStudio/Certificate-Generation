"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  User,
  Calendar,
  ShieldAlert,
  Briefcase,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
export interface User {
  id: string;

  employeeId?: string | null;
  email?: string | null;
  designation?: string;
  department?: string;
  name: string;
  password: string;
  role: string;

  createdAt: Date;
}
export default function EmployeeProfileCard({
  employee,
  setIsEditOpen,
  setSelectedUser,
  setDeleteId,
  setDeleteOpen,
}: any) {
  return (
    <Card className="max-w-2xl border-white/10">
      <CardContent className="px-6 py-2">
        {/* Header */}
        <div className="flex max-md:flex-col max-md:items-center max-md:justify-center items-start gap-4">
          <Avatar className="h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600">
            <AvatarFallback className="text-lg font-semibold">
              {employee?.name?.[0] ?? "-"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 h-full">
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-6 text-sm ">
              <Info icon={Mail} text={employee.email} />
              <Info icon={User} text={employee.employeeId} />
              <Info
                icon={Calendar}
                text={`Joined: ${new Date(employee.startDate).toDateString()}`}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-white/10" />

        {/* Role & Bio */}
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium">
            {employee.designation ?? "-"} – {employee.department ?? "-"}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-1 text-gray-900">
            <div className="uppercase">Employee Type- </div>
            {employee.employeeType==="INTR" ? "INTERN":"FREELANCER"}
            </div>
        <div className="space-x-3 float-right mt-3 max-md:float-center">
          <Button
            type="button"
            onClick={() => {
              setSelectedUser(employee);
              setIsEditOpen(true);
            }}
            size={"icon"}
            className="bg-green-400 hover:bg-green-500"
          >
            <Edit />
          </Button>
          <Button
            type="button"
            onClick={() => {
              setDeleteId(employee.id);
              setDeleteOpen(true);
            }}
            size={"icon"}
            variant={"destructive"}
          >
            <Trash2 />
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 " />
      <span className="break-all">{text}</span>
    </div>
  );
}
