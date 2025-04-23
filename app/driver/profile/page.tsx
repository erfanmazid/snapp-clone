"use client";

import { useDriverDataById } from "@/hooks/useDriverDataById/useDriverDataById";
import { useUserById } from "@/hooks/useUserById/useUserById";
import { useUserId } from "@/hooks/useUserId/useUserId";
import { Avatar, Skeleton } from "@nextui-org/react";
import { Car, Phone, Mail, User, Hash, Palette } from "lucide-react";

function DriverProfilePage() {
  const userId = useUserId();

  const { driver, loading: driverLoading } = useDriverDataById(userId);
  const { user, loading: userLoading } = useUserById(userId);

  if (driverLoading || userLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="rounded-full w-24 h-24" />
          <div className="w-full space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!driver || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            خطا در دریافت اطلاعات
          </h3>
          <p className="text-gray-600">
            اطلاعات پروفایل یافت نشد. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-32 w-full relative bg-primary">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <Avatar
              isBordered
              color="primary"
              className="w-32 h-32 text-3xl border-4 border-white"
              src={user.profile_image || undefined}
              name={user.full_name || ""}
            />
          </div>
        </div>

        <div className="pt-20 pb-8 px-6">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            {user.full_name}
          </h2>
          <p className="text-center text-gray-500 mb-8">راننده</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileCard
              title="اطلاعات شخصی"
              icon={<User className="w-5 h-5 text-primary" />}
              items={[
                { label: "نام کامل", value: user.full_name },
                {
                  label: "شماره تلفن",
                  value: user.phone,
                  icon: <Phone className="w-4 h-4 text-primary" />,
                },
                {
                  label: "ایمیل",
                  value: user.email,
                  icon: <Mail className="w-4 h-4 text-primary" />,
                },
              ]}
              color={"#21aa58"}
            />

            <ProfileCard
              title="اطلاعات خودرو"
              icon={<Car className="w-5 h-5 text-primary" />}
              items={[
                { label: "مدل ماشین", value: driver.car_model },
                {
                  label: "رنگ ماشین",
                  value: driver.car_color,
                  icon: <Palette className="w-4 h-4 text-primary" />,
                },
                {
                  label: "پلاک",
                  value: driver.plate_number,
                  icon: <Hash className="w-4 h-4 text-primary" />,
                },
              ]}
              color={"#21aa58"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileCard = ({
  title,
  icon,
  items,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string | null; icon?: React.ReactNode }[];
  color: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
    <div className="flex items-center gap-2 mb-4">
      <div
        className="p-2 rounded-lg"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        {icon}
      </div>
      <h3 className="font-bold text-lg text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-500">
            {item.icon && <span style={{ color: color }}>{item.icon}</span>}
            <span>{item.label}:</span>
          </div>
          <span className="font-medium text-gray-800">
            {item.value || "---"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default DriverProfilePage;
