import { GlowCard } from "@/components/ui/spotlight-card";

export function Default() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10 custom-cursor bg-[#080808]">
      <GlowCard glowColor="blue">
        <div className="flex flex-col justify-between h-full p-4 text-white">
          <span className="text-xs font-mono text-cyan-400">01 // SPOTLIGHT</span>
          <h4 className="text-lg font-bold">Spectral Indigo</h4>
        </div>
      </GlowCard>
      <GlowCard glowColor="orange">
        <div className="flex flex-col justify-between h-full p-4 text-white">
          <span className="text-xs font-mono text-orange-400">02 // SPOTLIGHT</span>
          <h4 className="text-lg font-bold">Solar Flare</h4>
        </div>
      </GlowCard>
      <GlowCard glowColor="purple">
        <div className="flex flex-col justify-between h-full p-4 text-white">
          <span className="text-xs font-mono text-purple-400">03 // SPOTLIGHT</span>
          <h4 className="text-lg font-bold">Nebula Violet</h4>
        </div>
      </GlowCard>
    </div>
  );
}

export default Default;
