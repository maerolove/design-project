import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const SceneHelpers: React.FC = () => {
  return (
    <>
      {/* Grid and axes helpers */}
      {/* size in meters, Y-up convention */}
      <gridHelper args={[20, 20, '#4b5563', '#1f2937']} />
      <axesHelper args={[1.5]} />
    </>
  );
};

export const Viewport: React.FC = () => {
  return (
    <div className="viewport">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 60, near: 0.1, far: 1000, position: [6, 6, 6] }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[0x0b0d10]} />
        <SceneHelpers />
        <OrbitControls makeDefault enableDamping target={[0, 0, 0]} />
      </Canvas>
      <div className="overlay">Y-up • meters • Orbit: drag + mouse</div>
    </div>
  );
};
