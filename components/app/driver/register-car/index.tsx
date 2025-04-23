"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input/Input";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { useUserId } from "@/hooks/useUserId/useUserId";

const formSchema = z.object({
  car_model: z.string().min(2, "مدل ماشین را وارد کنید."),
  car_color: z.string().min(2, "رنگ ماشین را وارد کنید."),
  plate_number: z.string().min(5, "پلاک معتبر وارد کنید."),
});

type FormData = z.infer<typeof formSchema>;

function RegisterCarForm() {
  const userId = useUserId();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      car_model: "",
      car_color: "",
      plate_number: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: FormData) => {
    if (!userId) {
      toast.error("شناسه کاربر موجود نیست.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("drivers").insert({
      user_id: userId,
      car_model: formData.car_model,
      car_color: formData.car_color,
      plate_number: formData.plate_number,
    });

    setLoading(false);

    if (error) {
      toast.error(`خطا در ثبت اطلاعات ماشین: ${error.message}`);
    } else {
      toast.success("ماشین با موفقیت ثبت شد.");
      router.push("/driver/profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="مدل ماشین :"
        {...register("car_model")}
        error={errors.car_model?.message}
        type="text"
      />
      <Input
        label="رنگ ماشین :"
        {...register("car_color")}
        error={errors.car_color?.message}
        type="text"
      />
      <Input
        label="پلاک ماشین :"
        {...register("plate_number")}
        error={errors.plate_number?.message}
        type="text"
      />
      <Button type="submit" loading={loading} className="!bg-primary">
        ثبت اطلاعات ماشین
      </Button>
    </form>
  );
}

export default RegisterCarForm;
