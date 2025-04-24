import Button from "@/components/ui/Button";
import Link from "next/link";

function MainMain() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary w-full min-h-[500px] flex flex-col gap-6 items-center px-5 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center max-w-3xl">
          تجربه‌ی زندگی راحت‌تر، سریع‌تر و به صرفه‌تر با اپلیکیشن اسنپ
        </h1>
        <p className="text-center text-white text-lg max-w-2xl">
          از درخواست خودرو گرفته تا سفارش غذا، خرید سوپرمارکتی، خرید بلیط سفر،
          رزرو هتل و... را میتوانید با اسنپ انجام دهید.
        </p>
        <div className="w-full max-w-md flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button className="!bg-white !text-primary w-full text-lg py-3">
              ورود به اپلیکیشن
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button className="!bg-white !text-black w-full text-lg py-3">
              ثبت نام در اپلیکیشن
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">خدمات اسنپ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">درخواست خودرو</h3>
              <p className="text-gray-600">
                سریع‌ترین و مطمئن‌ترین سرویس درخواست خودرو در شهر شما
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">سفارش غذا</h3>
              <p className="text-gray-600">
                سفارش آنلاین غذا از بهترین رستوران‌های شهر
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">خرید سوپرمارکتی</h3>
              <p className="text-gray-600">
                خرید آنلاین از سوپرمارکت‌های معتبر با ارسال سریع
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">دانلود اپلیکیشن اسنپ</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            اپلیکیشن اسنپ را دانلود کنید و از تمام خدمات ما بهره‌مند شوید. با
            اسنپ، زندگی روزمره شما ساده‌تر می‌شود.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="#" className="inline-block">
              <Button className="!bg-primary !text-white px-8 py-3 text-lg">
                دانلود از کافه‌بازار
              </Button>
            </Link>
            <Link href="#" className="inline-block">
              <Button className="!bg-black !text-white px-8 py-3 text-lg">
                دانلود از گوگل پلی
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <p>© ۱۴۰۴ اسنپ. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </main>
  );
}

export default MainMain;
