import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import {
  Closing,
  Games,
  Honesty,
  HowItWorks,
  Problem,
  Storage,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Storage />
        <Honesty />
        <Games />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
