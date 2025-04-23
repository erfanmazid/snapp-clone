import RegisterCarForm from "@/components/app/driver/register-car";

function RegisterCarPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-lightBlue p-5">
      <div className="bg-white max-w-[600px] w-full rounded-lg p-5 flex flex-col gap-12">
        <h1 className="text-2xl text-primary font-semibold">
          تکمیل اطلاعات وسیله نقلیه
        </h1>

        {<RegisterCarForm />}
      </div>
    </div>
  );
}

export default RegisterCarPage;
