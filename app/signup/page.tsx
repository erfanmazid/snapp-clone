"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input/Input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("لطفاً یک ایمیل معتبر وارد کنید."),
  password: z.string().min(8, "رمز عبور باید حداقل شامل ۸ حرف باشد."),
});

type FormValues = z.infer<typeof formSchema>;

function SignupPage() {
  const { signUp, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const { error, data: user } = await signUp(
      data.email,
      data.password,
      "http://localhost:3000/auth/confirm"
    );
    if (!error) {
      console.log(user);
      return toast.success(
        "ثبت نام با موفقیت انجام شد! ایمیل خود را تایید کنید",
        { duration: 7000 }
      );
    } else {
      return toast.error(error.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightBlue p-5">
      <div className="bg-white max-w-[500px] w-full rounded-lg p-5 flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl text-primary font-semibold">ثبت نام در اسنپ</h1>
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
            ثبت نام
          </Button>
        </form>
        <div>
          <p className="text-sm">
            حساب کاربری دارید؟{" "}
            <Link href="/login">
              <span className="text-blue-600">ورود به حساب کاربری</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
