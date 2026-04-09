"use client";

interface SpiralBindingProps {
  color: string;
  accent?: string;
}

export function SpiralBinding({ color, accent }: SpiralBindingProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center gap-[13px] -translate-y-[11px] z-20 pointer-events-none px-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="relative"
          style={{
            width: "15px",
            height: "20px",
            borderRadius: "50%",
            border: `2px solid ${color}`,
            background: "transparent",
            boxShadow: `
              inset 0 1px 3px rgba(0,0,0,0.14),
              0 1px 0 rgba(255,255,255,0.5),
              0 2px 4px rgba(0,0,0,0.08)
            `,
          }}
        >
          {/* Inner ring highlight */}
          <div
            style={{
              position: "absolute",
              inset: "2px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%)`,
              opacity: 0.6,
            }}
          />
          {/* Center pin */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              background: accent ?? color,
              transform: "translate(-50%, -50%)",
              opacity: 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
}