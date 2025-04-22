"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

function ConfirmEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            setError("مشکلی در تأیید ایمیل پیش آمد.");
          } else {
            toast.success("ورود با موفقیت انجام شد!");
            setLoading(false);
            const interval = setInterval(() => {
              setRedirectCountdown((prev) => {
                if (prev === 1) {
                  clearInterval(interval);
                  router.push("/profile-completion");
                }
                return prev - 1;
              });
            }, 1000);
          }
        })
        .catch(() => {
          setError("خطا در تایید نشست کاربر.");
          setLoading(false);
        });
    } else {
      setError("پارامترهای لازم یافت نشد.");
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        {loading ? (
          <p className="text-blue-600 font-semibold text-lg">
            در حال تایید ایمیل...
          </p>
        ) : error ? (
          <p className="text-red-500 font-medium text-base">{error}</p>
        ) : (
          <>
            <p className="text-green-600 font-semibold text-lg mb-2">
              ایمیل شما با موفقیت تایید شد!
            </p>
            <p className="text-gray-700">
              تا {redirectCountdown} ثانیه دیگر به داشبورد هدایت می‌شوید...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmEmailPage;
