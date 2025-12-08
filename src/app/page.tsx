import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import TodaysPicks from "@/components/TodaysPicks";

export default function HomePage() {
  return (
    <main className="container">
      <Hero />
      <Categories />
      <TodaysPicks />
    </main>
  );
}
