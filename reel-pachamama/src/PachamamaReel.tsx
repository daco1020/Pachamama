import React from 'react';
import { 
    AbsoluteFill, 
    interpolate, 
    Sequence, 
    useCurrentFrame, 
    useVideoConfig,
    spring,
    staticFile,
    Img
} from 'remotion';

// --- Components ---

const GlassCard: React.FC<{
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}> = ({ children, style, className }) => {
    return (
        <div 
            className={`rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden ${className}`}
            style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                ...style
            }}
        >
            {children}
        </div>
    );
};

const ProductScene: React.FC<{
    image: string;
    name: string;
    description: string;
}> = ({ image, name, description }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12 }
    });

    const scale = interpolate(entrance, [0, 1], [0.8, 1]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);
    const y = interpolate(entrance, [0, 1], [50, 0]);

    return (
        <AbsoluteFill className="items-center justify-center p-12">
            <GlassCard 
                className="w-full aspect-[4/5] flex flex-col p-8"
                style={{
                    transform: `scale(${scale}) translateY(${y}px)`,
                    opacity
                }}
            >
                <div className="flex-1 rounded-2xl overflow-hidden mb-8">
                    <Img 
                        src={staticFile(image)} 
                        className="w-full h-full object-cover"
                        style={{
                            transform: `scale(${interpolate(frame, [0, 150], [1.1, 1])})`
                        }}
                    />
                </div>
                <div className="text-center">
                    <h2 className="text-white text-5xl font-bold mb-4 uppercase tracking-tighter">
                        {name}
                    </h2>
                    <p className="text-white/60 text-2xl font-medium tracking-tight">
                        {description}
                    </p>
                </div>
            </GlassCard>
        </AbsoluteFill>
    );
};

// --- Main Reel ---

export const PachamamaReel: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Global background
    const bgScale = interpolate(frame, [0, 450], [1, 1.2]);

    return (
        <AbsoluteFill className="bg-[#050505] font-sans">
            {/* Ambient background glow */}
            <div 
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(163, 194, 147, 0.15) 0%, transparent 70%)',
                    transform: `scale(${bgScale})`
                }}
            />

            {/* --- Scene 1: Intro (0s - 3s) --- */}
            <Sequence from={0} durationInFrames={90}>
                <IntroScene />
            </Sequence>

            {/* --- Scene 2: Products (3s - 12s) --- */}
            <Sequence from={90} durationInFrames={70}>
                <ProductScene 
                    image="detox-soap.jpg" 
                    name="Carbon Detox" 
                    description="Pureza profunda para tu piel" 
                />
            </Sequence>
            <Sequence from={160} durationInFrames={70}>
                <ProductScene 
                    image="relax-soap.jpg" 
                    name="Lavanda Relax" 
                    description="Calma y serenidad botánica" 
                />
            </Sequence>
            <Sequence from={230} durationInFrames={70}>
                <ProductScene 
                    image="renew-soap.png" 
                    name="Cacao Renew" 
                    description="Energía y nutrición vital" 
                />
            </Sequence>
            <Sequence from={300} durationInFrames={60}>
                <ProductScene 
                    image="ritual-basico.png" 
                    name="Kit Esencial" 
                    description="Tu ritual diario completo" 
                />
            </Sequence>

            {/* --- Scene 3: Outro (12s - 15s) --- */}
            <Sequence from={360} durationInFrames={90}>
                <OutroScene />
            </Sequence>
        </AbsoluteFill>
    );
};

const IntroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoSpring = spring({ frame, fps, config: { damping: 10 } });
    const textSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });

    return (
        <AbsoluteFill className="items-center justify-center p-12">
            <h1 
                className="text-white text-8xl font-black tracking-widest uppercase mb-8"
                style={{
                    transform: `scale(${interpolate(logoSpring, [0, 1], [0.5, 1])})`,
                    opacity: logoSpring
                }}
            >
                Pachamama
            </h1>
            <div 
                className="overflow-hidden"
                style={{ opacity: textSpring }}
            >
                <div 
                    className="text-white/50 text-4xl font-bold tracking-[0.2em] uppercase"
                    style={{
                        transform: `translateY(${interpolate(textSpring, [0, 1], [100, 0])}%)`
                    }}
                >
                    Artesanía Botánica
                </div>
            </div>
        </AbsoluteFill>
    );
};

const OutroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const reveal = spring({ frame, fps });

    return (
        <AbsoluteFill className="items-center justify-center p-12">
            <div className="text-center">
                <GlassCard className="px-12 py-8 mb-12">
                    <h2 className="text-white text-6xl font-bold mb-4">Únete al Ritual</h2>
                    <p className="text-white/60 text-3xl">Colección Limitada</p>
                </GlassCard>
                
                <div 
                    className="bg-white text-black text-3xl font-black px-12 py-5 rounded-full uppercase tracking-tighter"
                    style={{
                        transform: `scale(${interpolate(reveal, [0, 1], [0.8, 1])})`,
                        opacity: reveal
                    }}
                >
                    Pachamama.mx
                </div>
            </div>
        </AbsoluteFill>
    );
};
