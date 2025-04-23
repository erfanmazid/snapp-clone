import Button from "@/components/ui/Button";
import Link from "next/link";

function MainMain() {
  return (
    <main className="">
      <section className="bg-primary w-full h-96 flex flex-col gap-6 items-center px-5 py-10">
        <h2 className="text-2xl font-bold text-white text-center">
          تجربه‌ی زندگی راحت تر٬ سریع‌تر و به صرفه‌تر با اپلیکیشن اسنپ
        </h2>
        <p className="text-center text-white">
          از درخواست خودرو گرفته تا سفارش غذا، خرید سوپرمارکتی، خرید بلیط سفر،
          رزرو هتل و... را میتوانید با اسنپ انجام دهید.
        </p>
        <div className="w-full flex flex-col gap-3">
          <Link href="/login">
            <Button className="!bg-white !text-primary">
              ورود به اپلیکیشن
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="!bg-white !text-black">
              ثبت نام در اپلیکیشن
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default MainMain;
