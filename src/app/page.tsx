import Hero from "@/app/components/Hero";
import Categories from "@/app/components/Categories";
import TodaysPicks from "@/app/components/TodaysPicks";

export default function HomePage() {
  return (
    <main className="container">
      <Hero />
      <Categories />
      <TodaysPicks />
    </main>
  );
}
