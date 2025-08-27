import { ARCanvas, DefaultXRControllers, useXR } from '@react-three/xr'
import { ReactNode, useState } from 'react'
import Model from './Model'
import { Vector3 } from 'three'

interface ARViewProps {
  children: ReactNode;
  animation: string;
}

const ARPlacement = ({ animation }: { animation: string }) => {
  const [position, setPosition] = useState(new Vector3(0, 0, -1));
  const { isPresenting } = useXR();

  const handleSelect = (event: any) => {
    if (event.intersection) {
      const { point } = event.intersection;
      setPosition(new Vector3(point.x, point.y, point.z));
    }
  };

  return (
    <>
      {isPresenting && (
        <mesh onSelect={handleSelect}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      )}
      <Model position={position} animation={animation} />
    </>
  );
}


const ARView = ({ children, animation }: ARViewProps) => {
  return (
    <ARCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      <ARPlacement animation={animation} />
      {children}
    </ARCanvas>
  );
};

export default ARView;
