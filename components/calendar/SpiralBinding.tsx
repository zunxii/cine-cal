"use client";

interface SpiralBindingProps {
  color: string;
}

export function SpiralBinding({ color }: SpiralBindingProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center gap-[14px] -translate-y-[10px] z-20 pointer-events-none px-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="w-4 h-5 rounded-full border-2 relative"
          style={{
            borderColor: color,
            background: "transparent",
            boxShadow: `inset 0 1px 2px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.4)`,
          }}
        >
          {/* Inner ring highlight */}
          <div
            className="absolute inset-[2px] rounded-full opacity-30"
            style={{ background: `linear-gradient(135deg, white, transparent)` }}
          />
        </div>
      ))}
    </div>
  );
}