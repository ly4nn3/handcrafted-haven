import Hero from "@/components/hero";
import Categories from "@/components/categories";
import TodaysPicks from "@/components/todaysPicks";

export default function HomePage() {
  return (
    <main className="container">
      <Hero />
      <Categories />
      <TodaysPicks />
    </main>
  );
}
