"use client";

import { motion, useReducedMotion } from "framer-motion";

const BAR_COUNT = 11;

export function AuthAnimatedLaptop() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <motion.div
        className="auth-laptop-motion"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={
          reduceMotion
            ? { rotateX: 10, rotateY: -12, rotateZ: 0, y: 0 }
            : {
                rotateX: [9, 14, 7, 11, 9],
                rotateY: [-18, 12, -14, 8, -18],
                rotateZ: [-1.2, 0.8, -0.4, 0.6, -1.2],
                y: [0, -10, 6, -4, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0.3 }
            : {
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        {/* Bezel + screen */}
        <div
          className="rounded-[1.15rem] border p-[7px] shadow-2xl"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background:
              "linear-gradient(165deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 40%, rgba(2,6,23,0.99) 100%)",
            boxShadow:
              "0 24px 80px -20px rgba(34, 211, 238, 0.22), 0 12px 40px -15px rgba(59, 130, 246, 0.18), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              background:
                "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(30, 58, 138, 0.35) 0%, transparent 50%), linear-gradient(180deg, #0a1020 0%, #060a14 100%)",
              aspectRatio: "16 / 10",
            }}
          >
            {/* Title bar — traffic lights */}
            <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-sm ring-1 ring-black/20" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-sm ring-1 ring-black/20" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-sm ring-1 ring-black/20" aria-hidden />
            </div>

            {/* Visualizer area */}
            <div className="relative flex flex-1 flex-col px-4 pb-5 pt-4">
              {/* Baseline */}
              <div
                className="pointer-events-none absolute left-6 right-6 top-[58%] z-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.35), rgba(59,130,246,0.25), transparent)",
                }}
                aria-hidden
              />

              <div className="relative z-10 flex h-[min(11rem,28vw)] min-h-[7.5rem] w-full items-end justify-between gap-[5px] sm:gap-1.5">
                {Array.from({ length: BAR_COUNT }).map((_, i) => (
                  <div key={i} className="flex h-full min-h-0 flex-1 flex-col justify-end">
                    <div
                      className="auth-analyzer-bar w-full rounded-full"
                      style={{
                        animationDelay: `${i * 0.11}s`,
                        height: `${36 + ((i * 17) % 48)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle light sweep */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden>
              <div className="auth-screen-sweep absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            </div>
          </div>
        </div>

        {/* Keyboard wedge */}
        <div
          className="relative z-0 mx-auto mt-0 h-4 w-[108%] max-w-[108%] -translate-x-[3.7%] rounded-b-xl"
          style={{
            background: "linear-gradient(180deg, rgba(51,65,85,0.85) 0%, rgba(15,23,42,0.95) 100%)",
            boxShadow: "0 16px 32px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        />
        <div
          className="mx-auto -mt-px h-1.5 w-[96%] rounded-b-md opacity-80"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(30,41,59,0.9), transparent)",
          }}
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
