import VariableFontCursorProximity from "@/components/fancy/text/variable-font-cursor-proximity";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, type MotionValue, AnimatePresence } from "framer-motion";

type Assistant = {
  id: string;
  name: string;
  role: string;
  description: string;
  thumbnail: string;
  apiUrl?: string;
  externalUrl?: string;
  videos?: string[];
  length?: string;
  useCase?: string;

};

const ASSISTANTS: Assistant[] = [
  {
    id: "bumper",
    name: "Demy",
    role: "Bumper Ad Specialist",
    description: "Punchy, short-form videos designed to capture attention in seconds.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/b4fab85fc99697b983019143de220c657de87a25.png",
    apiUrl: "http://127.0.0.1:2024",
    videos: [
      "https://static-gstudio.gliacloud.com/10903/files/c41597e0b6ab8cac129f8fef5ea5a4460c004ab0.mp4",
      "https://static-gstudio.gliacloud.com/10903/files/97c3a537c036362693c1f4fcaf27322e05c608a1.mp4",
      "https://static-gstudio.gliacloud.com/10903/files/ce9c969b91a7875b8bf57fbeb4374e728cd96e25.mp4"
    ],
    length: "5-8 seconds",
    useCase: "Banners, Social Feeds, Pre-roll"
  },
  {
    id: "campaign",
    name: "Philippe",
    role: "Product Showcase",
    description: "Detailed storytelling that puts your product in the best light. Allows for more control over the narrative.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/e9774d4cc1fd5e776ad03c28e048ce78364d20ab.png",
    apiUrl: "http://127.0.0.1:2024",
    videos: [
      "https://static-gstudio.gliacloud.com/10903/files/9ac212f31135ab34d23e2852b25e34476164a67c.mp4",
      "https://static-gstudio.gliacloud.com/10903/files/ce9c969b91a7875b8bf57fbeb4374e728cd96e25.mp4",
      "https://static-gstudio.gliacloud.com/10903/files/0d2f60a4448779232b8515a979582c313bfec38d.mp4"
    ],
    length: "15-30 seconds",
    useCase: "Product Launches, Feature Highlights, Explainers"
  },
  {
    id: "agent",
    name: "Gabi",
    role: "Motion Graphics",
    description: "Versatile motion graphic designs and visuals for modern branding. Elevate your own assets with dynamic text animations.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/41ef2cf0a669585a476242377216f8655a3dfdcf.png",
    externalUrl: "https://gliakinetics-115926812817.us-west1.run.app/",
    videos: [
      "https://static-gstudio.gliacloud.com/10903/files/f4083b4b982534a70d14ba0a3bf8de7790c3a474.mp4",
      "https://static-gstudio.gliacloud.com/10903/files/f5e4585bab26b858cb26c5c96118f88b88ec413b.mp4",
      "https://static-gstudio.gliacloud.com/10903/files/4a657d53679988602bd80696f19eb5206275d45f.mp4"
    ],
    length: "custom",
    useCase: "Brand Videos, Social Media, Intros"
  },
  {
    id: "coming-soon",
    name: "More to Come",
    role: "",
    description: "We're continuously adding new specialized agents to enhance your creative projects.",
    thumbnail: "https://static-gstudio.gliacloud.com/10903/files/3672d1b760e9ec0fd565a151b61bbe3162150c7e.jpg",
  }
];

function BackgroundVideo({ 
  assistant, 
  x, 
  y,
  randX,
  randY
}: { 
  assistant: Assistant; 
  x: MotionValue<number>; 
  y: MotionValue<number>;
  randX: number;
  randY: number;
}) {
  const rotateX = useTransform(y, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-3deg", "3deg"]);
  const moveX = useTransform(x, [-0.5, 0.5], ["-10px", "10px"]);
  const moveY = useTransform(y, [-0.5, 0.5], ["-10px", "10px"]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[40vw] aspect-video transition-all duration-500 ease-out"
        style={{
            left: `${50 + randX}%`,
            top: `${50 + randY}%`
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            rotateX,
            rotateY,
            x: moveX,
            y: moveY,
            perspective: 1000
          }}
          className="w-full h-full relative"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-2xl shadow-2xl opacity-40 blur-xl"
            src={assistant.videos?.[0]}
          />
        </motion.div>
      </div>
    </div>
  );
}

function ParallaxCard({ 
    assistant, 
    index, 
    containerRef,
    onHover
}: { 
    assistant: Assistant;
    index: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onHover: (data: { assistant: Assistant; x: MotionValue<number>; y: MotionValue<number> } | null) => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isFlipped, setIsFlipped] = useState(false);
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
        onHover(null);
    };

    const handleMouseEnter = () => {
        onHover({ assistant, x, y });
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
                onMouseEnter={handleMouseEnter}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative flex flex-col h-full w-full transition-colors duration-700 ease-out pointer-events-auto"
            >
                {/* Flip Container */}
                <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* Front Face */}
                    <div 
                        className="relative flex flex-col h-full w-full rounded-3xl border border-transparent bg-transparent backdrop-blur-xl group-hover:shadow-[0_0_6px_-15px_rgba(255,255,255,0.01)] transition-colors duration-700 ease-out p-6 md:p-8"
                        style={{ backfaceVisibility: "hidden", pointerEvents: isFlipped ? "none" : "auto" }}
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
                                            More Specialists coming soon
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

                            {/* Bottom Section - Buttons */}
                            <div className="mt-auto pt-32 flex justify-center items-center gap-3 w-full">
                                {assistant.role && (
                                    <>
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
                                            className={cn("border-white/10 hover:border-white/50 hover:bg-white/10 text-xs px-6 h-9 rounded-full transition-all duration-300", isFlipped ? "pointer-events-none" : "pointer-events-auto")}
                                        >
                                            Work with {assistant.name}
                                        </Button>
                                        <Button 
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                setIsFlipped(true);
                                            }}
                                            variant="glass" 
                                            size="sm"
                                            className={cn("border-white/10 hover:border-white/50 hover:bg-white/10 text-xs px-3 h-9 rounded-full transition-all duration-300", isFlipped ? "pointer-events-none" : "pointer-events-auto")}
                                        >
                                            View more
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Back Face */}
                    <div 
                        className="absolute inset-0 h-full w-full"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", pointerEvents: isFlipped ? "auto" : "none" }}
                    >
                         {/* Background Layer */}
                         <div className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-black/80 backdrop-blur-[2px]" />

                         {/* Content Layer */}
                         <div className="relative flex flex-col h-full w-full p-6 md:p-8">
                             <div className="flex flex-col h-full gap-4">
                            {/* Header */}
                            <div className="flex justify-between items-center flex-shrink-0">
                                <h3 className="text-4xl font-cormorant italic font-light text-foreground">{assistant.name}</h3>
                                <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-outfit tracking-widest uppercase text-muted-foreground">{assistant.role}</p>
                                </div>
                            </div>

                            {/* Length & Features */}
                            <div className="flex flex-col gap-3 py-4 flex-shrink-0">
                                <div className="grid grid-cols-2 gap-4">
                                    {assistant.length && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-space">Length</span>
                                            <span className="text-xs text-foreground/90 font-space">{assistant.length}</span>
                                        </div>
                                    )}
                                    {assistant.useCase && (
                                        <div className="flex flex-col gap-1">
                                             <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-space">Features</span>
                                             <div className="flex flex-wrap gap-1">
                                                {assistant.useCase.split(',').map((feature, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[10px] text-foreground/80 font-space">
                                                        {feature.trim()}
                                                    </span>
                                                ))}
                                             </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Videos Container - Scrollable */}
                            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {assistant.videos?.map((video, i) => (
                                    <div key={i} className="relative w-full aspect-video rounded-sm overflow-hidden border border-white/10 bg-black/50 flex-shrink-0">
                                         <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className={cn("w-full h-full object-cover", i > 0 && "opacity-80")}
                                            src={video}
                                        />
                                    </div>
                                ))}
                            </div>

                             {/* Back Button */}
                             <div className="flex justify-end w-full pt-4 flex-shrink-0">
                                <Button 
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        setIsFlipped(false);
                                    }}
                                    variant="glass" 
                                    className={cn("border-white/10 hover:border-white/50 hover:bg-white/10 text-xs px-6 h-9 rounded-full transition-all duration-300", !isFlipped ? "pointer-events-none" : "pointer-events-auto")}
                                >
                                    Back
                                </Button>
                             </div>
                         </div>
                       </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftMask, setShowLeftMask] = useState(false);
  const [showRightMask, setShowRightMask] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<{ 
    assistant: Assistant; 
    x: MotionValue<number>; 
    y: MotionValue<number>;
    randX: number;
    randY: number;
  } | null>(null);

  const handleHover = (data: { assistant: Assistant; x: MotionValue<number>; y: MotionValue<number> } | null) => {
    if (data) {
        setHoveredCard({
            ...data,
            randX: Math.random() * 45 - 15,
            randY: Math.random() * 45 - 15
        });
    } else {
        setHoveredCard(null);
    }
  };

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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      // Check if the scroll target is within a nested scrollable element
      let currentTarget = e.target as HTMLElement | null;
      let isNestedScrollable = false;

      while (currentTarget && currentTarget !== container) {
        const style = window.getComputedStyle(currentTarget);
        const overflowY = style.overflowY;
        const isScrollableY = (overflowY === 'auto' || overflowY === 'scroll') && 
                             currentTarget.scrollHeight > currentTarget.clientHeight;
        
        if (isScrollableY) {
          isNestedScrollable = true;
          break;
        }
        currentTarget = currentTarget.parentElement;
      }

      if (!isNestedScrollable) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
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
        
        {/* Background Video Layer */}
        <AnimatePresence>
            {hoveredCard && hoveredCard.assistant.videos?.[0] && (
                <BackgroundVideo 
                    key={hoveredCard.assistant.id}
                    assistant={hoveredCard.assistant}
                    x={hoveredCard.x}
                    y={hoveredCard.y}
                    randX={hoveredCard.randX}
                    randY={hoveredCard.randY}
                />
            )}
        </AnimatePresence>

      {/* Navbar Island */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-2 rounded-full border border-white/8 bg-white/2 backdrop-blur-[2px] pointer-events-auto">
          <a href="#glia-director" className="text-xs font-outfit hover:text-foreground transition-colors">GliaDirector</a>
          <a href="#pricing" className="text-xs font-outfit text-muted-foreground/60 hover:text-foreground transition-colors">Pricing</a>
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
                        onHover={handleHover}
                    />
                ))}
                <div className="w-12 flex-none" />
            </div>
        </div>
      </div>
    </div>
  );
}