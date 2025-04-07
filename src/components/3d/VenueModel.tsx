import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

interface VenueModelProps {
  selectedSection: string;
}

export default function VenueModel({ selectedSection }: VenueModelProps) {
  const stageRef = useRef<Mesh>(null);
  const seatsRef = useRef<Mesh>(null);

  useFrame(() => {
    if (stageRef.current) {
      stageRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Stage */}
      <mesh ref={stageRef} position={[0, -1, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      {/* Seating Sections */}
      <group ref={seatsRef} position={[0, 0, 0]}>
        {/* VIP Section */}
        <mesh position={[0, -0.5, -2]} scale={[4, 0.1, 1]}>
          <boxGeometry />
          <meshStandardMaterial 
            color={selectedSection === 'vip' ? '#4f46e5' : '#9ca3af'} 
          />
        </mesh>

        {/* Premium Section */}
        <mesh position={[0, -0.6, -3.5]} scale={[5, 0.1, 1]}>
          <boxGeometry />
          <meshStandardMaterial 
            color={selectedSection === 'premium' ? '#4f46e5' : '#d1d5db'} 
          />
        </mesh>

        {/* Standard Section */}
        <mesh position={[0, -0.7, -5]} scale={[6, 0.1, 1]}>
          <boxGeometry />
          <meshStandardMaterial 
            color={selectedSection === 'standard' ? '#4f46e5' : '#e5e7eb'} 
          />
        </mesh>
      </group>
    </group>
  );
}