import { introLetter } from "@/data/identity";

export function IntroLetter() {
  return (
    <div className="crt-bezel mt-2 mb-6 feed:mb-8 max-w-[720px]">
      <div className="crt-screen-area">
        <article className="crt-screen relative">
      {/* Greeting + wave — emoji is a sibling of the gradient span, not a
         descendant, so it isn't masked by the parent's bg-clip:text. */}
      <div className="text-3xl feed:text-[38px] font-bold tracking-[-0.02em] leading-[1.1] text-white">
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, #fff 30%, #a78bfa)",
          }}
        >
          {introLetter.greeting}
        </span>{" "}
        <span
          className="inline-block"
          style={{
            transformOrigin: "70% 70%",
            animation: "wave 2.4s ease-in-out infinite",
          }}
        >
          👋
        </span>
      </div>

      {/* Paragraphs — the blinking cursor sits at the end of the very last
         paragraph with a small gap from the trailing period. The last word
         and the cursor are wrapped in a whitespace-nowrap span so the cursor
         can never wrap onto a new line by itself when the paragraph fills
         its max width. */}
      {introLetter.paragraphs.map((paragraph, index) => {
        const isLast = index === introLetter.paragraphs.length - 1;
        if (!isLast) {
          return (
            <p
              key={index}
              className="mt-[18px] text-[17px] leading-[1.65] text-white/80"
            >
              {paragraph}
            </p>
          );
        }
        const m = paragraph.match(/^(.*\s)(\S+)$/);
        const head = m ? m[1] : "";
        const tail = m ? m[2] : paragraph;
        return (
          <p
            key={index}
            className="mt-[18px] text-[17px] leading-[1.65] text-white/80"
          >
            {head}
            <span className="whitespace-nowrap">
              {tail}
              <Cursor />
            </span>
          </p>
        );
      })}

      {/* Signoff */}
      <div className="mt-[22px] text-right">
        <span className="text-[22px] italic" style={{ color: "#a78bfa" }}>
          {introLetter.signoff}
        </span>
      </div>
        </article>
      </div>
      <div className="crt-bezel-foot">
        <span>Howar31 // Broadcast</span>
        <span className="crt-power-led" aria-hidden />
      </div>
    </div>
  );
}

function Cursor() {
  return (
    <span
      aria-hidden
      className="inline-block w-[2px] ml-[6px] bg-current align-baseline"
      style={{
        height: "1em",
        verticalAlign: "-0.12em",
        animation: "cursorBlink 1.1s steps(1) infinite",
      }}
    />
  );
}
