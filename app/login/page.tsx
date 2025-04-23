"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input/Input";
import { useAuth } from "@/hooks/useAuth";
import { useUserById } from "@/hooks/useUserById/useUserById";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("لطفاً یک ایمیل معتبر وارد کنید."),
  password: z.string().min(8, "رمز عبور باید حداقل شامل ۸ حرف باشد."),
});

type FormValues = z.infer<typeof formSchema>;

function LoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const { error, data: userData } = await signIn(data.email, data.password);
    if (!error && userData?.user?.id) {
      toast.success("ورود موفقیت‌آمیز بود.");
      setUserId(userData.user.id); // آی‌دی رو ذخیره کن
    } else {
      toast.error("ورود ناموفق بود.");
    }
  };

  const { user, loading: userLoading, error: userError } = useUserById(userId);

  useEffect(() => {
    if (user) {
      console.log("اطلاعات یوزر:", user);
      console.log(userLoading, userError);
      if (user.role === "driver") {
        router.push("/driver/profile");
      } else if (user.role === "passenger") {
        router.push("/passenger/profile");
      }
    }
  }, [router, user, userError, userLoading]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightBlue p-5">
      <div className="bg-white max-w-[500px] w-full rounded-lg p-5 flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl text-primary font-semibold">
          ورود به اپلیکیشن اسنپ
        </h1>
        <form
          className="w-full flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="ایمیل :"
            type="text"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="رمزعبور :"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button
            className="w-full !bg-primary"
            type="submit"
            loading={loading}
          >
            ورود به حساب کاربری
          </Button>
        </form>

        <div>
          <p className="text-sm">
            حساب کاربری ندارید؟{" "}
            <Link href="/signup">
              <span className="text-blue-600">ایجاد حساب کاربری</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
