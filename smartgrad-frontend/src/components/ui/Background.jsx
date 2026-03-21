export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0d1117_0%,_#03050a_70%)]" />

      {/* Animated blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] animate-blob" />
      <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[100px] animate-blob animation-delay-4000" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#03050a_100%)]" />
    </div>
  )
}
