import { introLetter } from "@/data/identity";

export function IntroLetter() {
  return (
    <article className="pt-6 feed:pt-8 pb-2">
      {/* Greeting + wave emoji */}
      <div
        className="text-3xl feed:text-[38px] font-bold tracking-[-0.02em] leading-[1.1] bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(to right, #fff 30%, #a78bfa)",
        }}
      >
        {introLetter.greeting}{" "}
        <span
          className="inline-block"
          style={{
            WebkitTextFillColor: "initial",
            transformOrigin: "70% 70%",
            animation: "wave 2.4s ease-in-out infinite",
          }}
        >
          👋
        </span>
      </div>

      {/* Paragraphs */}
      {introLetter.paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="mt-[18px] text-[17px] leading-[1.65] text-white/80 max-w-[620px]"
        >
          {paragraph}
        </p>
      ))}

      {/* Signoff */}
      <div className="mt-[22px]">
        <span
          className="text-[22px] italic"
          style={{ color: "#a78bfa" }}
        >
          {introLetter.signoff}
        </span>
      </div>
    </article>
  );
}
