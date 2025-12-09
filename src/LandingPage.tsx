import { useQueryState } from "@/hooks/use-query-state";
import VariableFontCursorProximity from "@/components/fancy/text/variable-font-cursor-proximity";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "framer-motion";

type Assistant = {
  id: string;
  name: string;
  role: string;
  description: string;
  thumbnail: string;
  apiUrl?: string;
  externalUrl?: string;
};

const ASSISTANTS: Assistant[] = [
  {
    id: "bumper",
    name: "Demy",
    role: "Bumper Ad Specialist",
    description: "Punchy, short-form master designed to capture attention in seconds.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/b4fab85fc99697b983019143de220c657de87a25.png",
    apiUrl: "http://127.0.0.1:2024"
  },
  {
    id: "campaign",
    name: "Philippe",
    role: "Product Showcase",
    description: "Detailed, stylish storytelling that puts your product in the best light.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/e9774d4cc1fd5e776ad03c28e048ce78364d20ab.png",
    apiUrl: "http://127.0.0.1:2024"
  },
  {
    id: "agent",
    name: "Gabi",
    role: "Motion Graphics",
    description: "High-energy kinetic typography and visuals for modern branding.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/41ef2cf0a669585a476242377216f8655a3dfdcf.png",
    externalUrl: "https://gliakinetics-115926812817.us-west1.run.app/"
  },
  {
    id: "coming-soon",
    name: "More to Come",
    role: "",
    description: "We're continuously adding new specialized agents to enhance your creative projects.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/3672d1b760e9ec0fd565a151b61bbe3162150c7e.jpg"
  }
];

function ParallaxCard({ 
    assistant, 
    index, 
    containerRef 
}: { 
    assistant: Assistant;
    index: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(x, [-0.5, 0.5], ["-3deg", "3deg"]);
    
    // Parallax layers
    const imageX = useTransform(x, [-0.5, 0.5], ["-1px", "1px"]);
    const imageY = useTransform(y, [-0.5, 0.5], ["-1px", "1px"]);

    const textX = useTransform(x, [-0.5, 0.5], ["-2px", "2px"]);
    const textY = useTransform(y, [-0.5, 0.5], ["-2px", "2px"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            className="group relative flex-none w-[85vw] md:w-[350px] flex flex-col" 
            style={{ perspective: "1000px" }}
        >
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative flex flex-col h-full w-full rounded-3xl border border-transparent bg-transparent hover:bg-white/[0.02] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.05)] transition-colors duration-700 ease-out p-6 md:p-8 pointer-events-auto"
            >
                {/* Tech Markers */}
                <motion.div 
                    className="absolute top-8 left-8 z-20 flex flex-col gap-2"
                    style={{ x: textX, y: textY, translateZ: 20 }}
                >
                    <span className="text-xs font-outfit font-medium text-muted-foreground/40 group-hover:text-brand1 transition-colors duration-300">
                        0{index + 1}
                    </span>
                </motion.div>
                
                <motion.div 
                    className="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                    style={{ x: textX, y: textY, translateZ: 20 }}
                >
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand1">
                        <path d="M1 1H11V11" stroke="currentColor" strokeWidth="1"/>
                     </svg>
                </motion.div>

                {/* Content */}
                <div className="flex flex-col h-full z-10" style={{ transform: "translateZ(30px)" }}>
                    
                    {/* Top Section Group */}
                    <div className="w-full flex flex-col gap-6">
                        {/* Name */}
                         <motion.div 
                            className="mt-8 h-16 w-full flex items-center justify-start"
                            style={{ x: textX, y: textY }}
                         >
                            {assistant.role && (
                             <VariableFontCursorProximity
                                className={cn("text-5xl md:text-6xl font-cormorant font-normal text-foreground")}
                                fromFontVariationSettings="'wght' 100"
                                toFontVariationSettings="'wght' 900"
                                radius={90}
                                containerRef={containerRef}
                            >
                                {assistant.name}
                            </VariableFontCursorProximity>
                            )}
                            {!assistant.role && (
                                <h2 className="text-3xl mt-4 md:text-4xl font-cormorant font-light text-foreground">
                                    More Specialists comming soon
                                </h2>
                            )}
                        </motion.div>

                        {/* Image */}
                        <motion.div 
                            className="relative w-full h-[240px] flex items-center justify-center"
                            style={{ x: imageX, y: imageY, translateZ: -50 }}
                        >
                            <img 
                                src={assistant.thumbnail} 
                                alt={assistant.name}
                                className="w-full h-full object-cover transition-all duration-700 ease-out transform"
                            />
                        </motion.div>

                        {/* Text Info */}
                        <motion.div 
                            className="flex flex-col items-center gap-3 text-center"
                            style={{ x: textX, y: textY }}
                        >
                            {assistant.role && (
                                <div className="inline-block px-3 py-1 border border-white/10 rounded-full bg-white/[0.01] backdrop-blur-md group-hover:border-white/20 transition-colors duration-500">
                                     <p className="text-[10px] md:text-xs font-outfit tracking-[0.2em] uppercase text-foreground group-hover:text-foreground transition-colors duration-300">
                                        {assistant.role}
                                    </p>
                                </div>
                            )}
                           
                            <p className="text-sm font-light text-foreground/60 max-w-[240px] leading-relaxed transition-all duration-500">
                                {assistant.description}
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom Section - Button */}
                    <div className="mt-40 flex justify-center w-full">
                        {assistant.role && (
                            <Button 
                                   onClick={() => {
                                       if (assistant.externalUrl) {
                                           window.location.href = assistant.externalUrl;
                                       } else {
                                            const url = new URL(window.location.href);
                                            url.searchParams.set("assistantId", assistant.id);
                                            if (assistant.apiUrl) {
                                                url.searchParams.set("apiUrl", assistant.apiUrl);
                                            }
                                            window.location.href = url.toString();
                                       }
                                   }}
                                   variant="glass" 
                                   className="border-white/10 hover:border-white/50 hover:bg-white/10 text-xs px-6 h-9 rounded-full transition-all duration-300 pointer-events-auto"
                               >
                                   Work with {assistant.name}
                            </Button>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useQueryState("assistantId");
  const [showLeftMask, setShowLeftMask] = useState(false);
  const [showRightMask, setShowRightMask] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftMask(scrollLeft > 0);
        setShowRightMask(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftMask(scrollLeft > 0);
        setShowRightMask(scrollLeft < scrollWidth - clientWidth - 10);
      }
  };

  const maskImage = (() => {
      if (showLeftMask && showRightMask) return "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";
      if (showLeftMask) return "linear-gradient(to right, transparent 0%, black 10%, black 100%)";
      if (showRightMask) return "linear-gradient(to right, black 0%, black 90%, transparent 100%)";
      return "none";
  })();

  return (
    <div 
      className="relative flex min-h-screen w-full flex-col bg-transparent overflow-hidden selection:bg-brand1/20" 
      ref={containerRef}
    >
        {/* Dot Screen Shader Background */}
        <div className="absolute inset-0 z-0">
             <DotScreenShader />
        </div>

      {/* Navbar Island */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-2 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-[2px] pointer-events-auto">
          <span className="text-sm font-outfit font-medium text-foreground tracking-tight">GliaDirector</span>
          <a href="#" className="text-xs font-outfit text-muted-foreground/60 hover:text-foreground transition-colors">Pricing</a>
      </nav>

      {/* Header */}
      <header className="z-10 w-full px-8 py-6 md:px-12 md:py-6 flex flex-col md:flex-row justify-between items-start md:items-end mb-4 pointer-events-none">
        <div className="space-y-1 pointer-events-auto">
            <div className="flex items-center gap-2">
                <img src="glia_logo.svg" alt="Glia Logo" className="w-6 h-6 object-contain"/>
            </div>
        </div>
        
        <p className="hidden md:block text-xs font-outfit tracking-[0.3em] uppercase text-muted-foreground/90">
          From GliaCloud
        </p>
      </header>
      
      {/* Assistants Display */}
      <div className="z-0 flex-1 flex flex-col gap-4 md:flex-row w-full h-full overflow-hidden pb-8 md:pb-12 pointer-events-none">
        {/* Intro Copy */}
        <div className="flex-none w-auto md:w-[280px] flex flex-col justify-end pb-8 px-8 md:pl-12 md:pr-0 z-10">
            <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-outfit font-medium text-foreground">
                    GliaDirector
                </h1>
                <p className="text-sm font-outfit font-light text-muted-foreground/80">
                    GliaDirector is a series of agents specialized in their specific creative fields, coordinated together to produce video tailored to your desired scenario.
                </p>
            </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-end">
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-6 px-8 md:px-6 pb-4 -mb-4 pt-4 pointer-events-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ 
                    maskImage,
                    WebkitMaskImage: maskImage
                }}
            >
                {ASSISTANTS.map((assistant, index) => (
                    <ParallaxCard 
                        key={index} 
                        assistant={assistant} 
                        index={index} 
                        containerRef={containerRef}
                    />
                ))}
                <div className="w-12 flex-none" />
            </div>
        </div>
      </div>
    </div>
  );
}

//className="group relative flex-1 flex flex-col rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md cursor-pointer transition-all duration-500 hover:bg-white/[0.05] hover:border-white/30 overflow-hidden shadow-glass pointer-events-auto"
