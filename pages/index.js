import Image from "next/image";
import { Inter } from "next/font/google";
import ObjectDetection from "@/components/object-detection";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
    <h1 className=" gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6 text-center">Thief Detection Alarm</h1>
  <ObjectDetection/>
    </main>
  );
}
