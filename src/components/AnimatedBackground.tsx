import React, {useMemo, useEffect, useState} from 'react';
import {motion} from 'motion/react';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

export default function AnimatedBackground() {
  const [windowSize, setWindowSize] = useState({width: 1200, height: 800});

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({width: window.innerWidth, height: window.innerHeight});
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nodes: Node[] = useMemo(() => {
    const nodeCount = 40;
    const res: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
        res.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            connections: []
        });
    }
    
    // Connect each node to its 2 nearest neighbors
    res.forEach((node, i) => {
        const sorted = [...res]
            .filter(n => n.id !== node.id)
            .sort((a, b) => {
                const distA = Math.hypot(a.x - node.x, a.y - node.y);
                const distB = Math.hypot(b.x - node.x, b.y - node.y);
                return distA - distB;
            });
        node.connections = sorted.slice(0, 2).map(n => n.id);
    });
    
    return res;
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Lines */}
        {nodes.map(node => (
          node.connections.map(connId => {
            const target = nodes.find(n => n.id === connId);
            if (!target) return null;
            return (
              <motion.line
                key={`line-${node.id}-${connId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke="white"
                strokeWidth="0.05"
                initial={{pathLength: 0, opacity: 0}}
                animate={{pathLength: 1, opacity: 0.2}}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
              />
            );
          })
        ))}
        
        {/* Pulsing particles */}
        {nodes.map(node => (
            <motion.circle
                key={`node-${node.id}`}
                cx={node.x}
                cy={node.y}
                r="0.2"
                fill="var(--color-brand-neon)"
                animate={{
                    r: [0.1, 0.3, 0.1],
                    opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        ))}

        {/* Traveling particles on lines */}
        {nodes.slice(0, 15).map((node, i) => (
            node.connections.map((connId, j) => {
                const target = nodes.find(n => n.id === connId);
                if (!target) return null;
                return (
                    <motion.circle
                        key={`pulse-${i}-${j}`}
                        r="0.15"
                        fill="var(--color-brand-neon)"
                        initial={{ cx: node.x, cy: node.y }}
                        animate={{ cx: target.x, cy: target.y }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                );
            })
        ))}
      </svg>
      
      {/* Fog effect */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-bg-deep/50 to-bg-deep shadow-inner" />
    </div>
  );
}
