import { BackgroundPattern } from "@/components/background-pattern";
import { ModeToggle } from "@/components/mode-toggle";
import SelectDiabetesType from "@/components/select-diabetes-type";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b shadow-sm sticky top-0 z-50 backdrop-blur-3xl">
        <div
          className="flex items-center justify-center max-w-7xl         
    mx-auto">
          <div className="flex items-center gap-3">
            <Image
              className="object-cover"
              width={100}
              height={100}
              src={"/diabetes-meal-assistant.png"}
              alt="Website Logo"
            />
            <h1
              className=" hidden md:block text-2xl font-black                
    tracking-tight">
              Diabetes Meal Assistant
            </h1>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </header>

      <section className="relative flex-1 flex items-center w-full py-8 sm:py-12">
        <SelectDiabetesType />
        <BackgroundPattern />
      </section>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 backdrop-blur-3xl border-t">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-destructive">
            <span className="font-black">Disclaimer:</span> This tool provides general guidance and is not a substitute
            for professional medical advice.
            <br />
            Always consult with your doctor or a registered dietitian. Always consult with your doctor or a registered
            dietitian for personalized care.
          </p>
        </div>
      </footer>
    </div>
  );
}
