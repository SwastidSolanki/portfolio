import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const AbstractShape = ({ onTrigger }: { onTrigger: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const clickTimes = useRef<number[]>([]);
  const triggered = useRef(false);

  // Click tracking logic (10 clicks within 8 seconds)
  const handleClick = (e: any) => {
    // Only register primary clicks and stop propagation if needed.
    e.stopPropagation();
    if (triggered.current) return;

    const now = Date.now();
    
    // Filter out clicks older than 8 seconds
    clickTimes.current = clickTimes.current.filter(t => now - t < 8000);
    clickTimes.current.push(now);

    // Click animation (fun punch effect)
    if (meshRef.current) {
      gsap.killTweensOf(meshRef.current.scale);
      gsap.fromTo(meshRef.current.scale, 
        { x: 1.05, y: 1.05, z: 1.05 },
        { x: 1.2, y: 1.2, z: 1.2, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
      );
    }

    if (clickTimes.current.length >= 10) {
      triggered.current = true;
      // Reset so it doesn't fire continuously if user keeps clicking
      clickTimes.current = [];
      onTrigger();
    }
  };

  useFrame((_state, delta) => {
    if (meshRef.current && !triggered.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.2} onClick={handleClick}>
        <torusKnotGeometry args={[1.2, 0.4, 128, 64]} />
        <MeshDistortMaterial 
          color="#06b6d4" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.1} 
          metalness={0.8}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
};

const ThreeBackground: React.FC = () => {
  const [isHalted, setIsHalted] = React.useState(false);

  React.useEffect(() => {
    const handleHalt = () => setIsHalted(true);
    const handleResume = () => setIsHalted(false);
    
    window.addEventListener('haltThreeJS', handleHalt);
    window.addEventListener('resumeThreeJS', handleResume);
    return () => {
      window.removeEventListener('haltThreeJS', handleHalt);
      window.removeEventListener('resumeThreeJS', handleResume);
    };
  }, []);

  const triggerSecretSystem = () => {
    // Dispatch the custom event to the global window
    window.dispatchEvent(new CustomEvent('triggerSecretSystem'));
    setIsHalted(true); // Halt self immediately
  };

  if (isHalted) return null; // Unmount entirely to preserve performance

  return (
    <div style={{ position: 'absolute', top: '10vh', right: '0', width: '45vw', height: '80vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        style={{ pointerEvents: 'auto' }}
        gl={{ 
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]} // limit pixel ratio for performance
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
        
        <AbstractShape onTrigger={triggerSecretSystem} />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2 + 0.5}
          minPolarAngle={Math.PI / 2 - 0.5}
        />
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.6} 
          scale={10} 
          blur={2.5} 
          far={4} 
          color="#000000"
          resolution={256}
        />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
