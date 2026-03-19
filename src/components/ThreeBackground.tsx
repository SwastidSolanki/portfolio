import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const AbstractShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.2}>
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
  return (
    <div style={{ position: 'absolute', top: '10vh', right: '0', width: '45vw', height: '80vh', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ pointerEvents: 'auto' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
        
        <AbstractShape />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2 + 0.5}
          minPolarAngle={Math.PI / 2 - 0.5}
        />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
