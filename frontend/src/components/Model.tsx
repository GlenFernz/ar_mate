import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Model = (props: any) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { animation } = props;

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Default idle animation
    mesh.current.rotation.y += delta * 0.5;

    // Animations
    if (animation === 'wave') {
      mesh.current.position.y = props.position.y + Math.sin(state.clock.elapsedTime * 5) * 0.1;
    } else if (animation === 'nod') {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.5;
    } else if (animation === 'comfort') {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      mesh.current.scale.set(scale, scale, scale);
    }
  });

  useEffect(() => {
    // Reset state when animation changes
    if (mesh.current) {
      mesh.current.position.y = props.position.y;
      mesh.current.rotation.x = 0;
      mesh.current.scale.set(1, 1, 1);
    }
  }, [animation, props.position.y]);

  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
};

export default Model;
