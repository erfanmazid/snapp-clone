"use client";

import { useUserById } from "@/hooks/useUserById/useUserById";
import { Avatar, Skeleton } from "@nextui-org/react";
import { User, Phone, Mail, CreditCard, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
// import { useUserId } from "@/hooks/useUserId/useUserId";

function PassengerProfilePage() {
  // const userId = useUserId();
  const userId = "8922523a-c6b2-4372-8487-492317e303f2";

  const { user, loading: userLoading } = useUserById(userId);

  if (userLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="rounded-full w-24 h-24" />
          <div className="w-full space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
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
    <div className="max-w-3xl mx-auto my-8 px-4 pb-20">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* هدر با رنگ پرایمری */}
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

        {/* محتوای پروفایل */}
        <div className="pt-20 pb-8 px-6">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            {user.full_name}
          </h2>
          <p className="text-center text-gray-500 mb-8">مسافر</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اطلاعات شخصی */}
            <ProfileCard
              title="اطلاعات شخصی"
              icon={<User className="w-5 h-5" />}
              items={[
                { label: "نام کامل", value: user.full_name },
                {
                  label: "شماره تلفن",
                  value: user.phone,
                  icon: <Phone className="w-4 h-4" />,
                },
                {
                  label: "ایمیل",
                  value: user.email,
                  icon: <Mail className="w-4 h-4" />,
                },
              ]}
              color={"#21aa58"}
            />

            {/* اطلاعات پرداخت و آدرس */}
            <ProfileCard
              title="اطلاعات اضافی"
              icon={<CreditCard className="w-5 h-5" />}
              items={[
                {
                  label: "آدرس",
                  value: "",
                  icon: <MapPin className="w-4 h-4" />,
                },
                {
                  label: "روش پرداخت",
                  value: "نقدی",
                  icon: <CreditCard className="w-4 h-4" />,
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
    <div className="fixed bottom-0 left-0 right-0 bg-white p-5 border-t rounded-t-2xl shadow-lg z-[1000] animate-slideUp">
      <Link href={"/passenger/request"}>
        <Button className="w-full bg-primary text-white py-3 text-lg rounded-xl hover:bg-teal-700">
          ثبت درخواست سفر
        </Button>
      </Link>
    </div>
  </div>
);

export default PassengerProfilePage;
