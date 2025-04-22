"use client";

import { useState } from "react";
import UserInfo from "@/components/app/profile-completion/userInfo/UserInfo";

function ProfileCompletionPage() {
  const [role, setRole] = useState<string | null>(null);

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightBlue p-5">
      <div className="bg-white max-w-[600px] w-full rounded-lg p-5 flex flex-col gap-12">
        <h1 className="text-2xl text-primary font-semibold">تکمیل پروفایل</h1>

        {<UserInfo handleRoleSelection={handleRoleSelection} role={role} />}
      </div>
    </div>
  );
}

export default ProfileCompletionPage;
