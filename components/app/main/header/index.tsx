import Image from "next/image";

function MainHeader() {
  return (
    <header className="w-full h-16 flex items-center justify-between p-5">
      <div className="w-6 h-6">
        <i className="fa-solid fa-bars text-2xl"></i>
      </div>
      <Image src="/logo.svg" alt="logo" width={90} height={32} />
    </header>
  );
}

export default MainHeader;
