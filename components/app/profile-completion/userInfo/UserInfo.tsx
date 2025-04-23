"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input/Input";
import { UserDate } from "@/hooks/useUserById/type";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Role = "driver" | "passenger";

const formSchema = z.object({
  full_name: z
    .string()
    .min(3, "نام و نام خانوادگی باید حداقل شامل ۳ حرف باشد."),
  phone: z.string().min(11, "شماره موبایل باید حداقل شامل ۱۱ حرف باشد."),
});

type FormData = z.infer<typeof formSchema>;

function UserInfo({
  handleRoleSelection,
  role,
}: {
  handleRoleSelection: (role: Role) => void;
  role: string | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserDate | null>(null); // وضعیت برای ذخیره‌سازی کاربر
  const router = useRouter();

  useEffect(() => {
    // بررسی اینکه آیا در محیط مرورگر هستیم یا نه
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("sb-lwzyvmumnplvtbptahti-auth-token");
      if (data) {
        const userData = JSON.parse(data);
        setUser(userData.user); // تنظیم اطلاعات کاربر
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      phone: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!role) {
      toast.error("لطفاً نقش خود را انتخاب کنید.");
      return;
    }

    if (!user) {
      toast.error("خطا در دریافت اطلاعات کاربر.");
      return;
    }

    setLoading(true);
    const newUser = {
      full_name: data.full_name,
      phone: data.phone,
      id: user.id,
      email: user.email,
      role,
    };

    try {
      const { error } = await supabase.from("users").insert([newUser]);

      if (error) {
        toast.error(`خطا در ثبت اطلاعات: ${error.message}`);
        throw error;
      }

      toast.success("اطلاعات شما با موفقیت ثبت شد.");
      if (role === "driver") {
        router.push("/driver/register-car");
      } else if (role === "passenger") {
        router.push("/passenger/profile");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
    setLoading(false);
  };

  if (!user) {
    return <div>در حال بارگذاری اطلاعات...</div>;
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="نام و نام خانوادگی :"
        {...register("full_name")}
        error={errors.full_name?.message}
        type="text"
      />
      <Input
        label="شماره موبایل :"
        {...register("phone")}
        error={errors.phone?.message}
        type="text"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg">نقش خود را انتخاب کنید:</h2>
        <div className="flex justify-between gap-3">
          <Button
            onClick={() => handleRoleSelection("driver")}
            className={`w-[48%] bg-gray-400 hover:bg-primary ${
              role === "driver" ? "!bg-primary" : ""
            }`}
          >
            راننده
          </Button>
          <Button
            onClick={() => handleRoleSelection("passenger")}
            className={`w-[48%] bg-gray-400 hover:bg-primary ${
              role === "passenger" ? "!bg-primary" : ""
            }`}
          >
            مسافر
          </Button>
        </div>
      </div>

      <Button type="submit" loading={loading} className="!bg-primary">
        تکمیل پروفایل
      </Button>
    </form>
  );
}

export default UserInfo;
