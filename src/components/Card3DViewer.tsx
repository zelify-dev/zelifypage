import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

declare global {
  interface Window {
    isSpanish: boolean;
  }
}

// Clase para crear una geometría de caja con bordes redondeados
class RoundedBoxGeometry extends THREE.BoxGeometry {
  constructor(width: number, height: number, depth: number, radius: number = 0.1, segments: number = 2) {
    super(width, height, depth);

    const geometry = this;
    const pos = geometry.attributes.position;
    const normals = geometry.attributes.normal;

    if (!pos || !normals) return;

    const w2 = width / 2;
    const h2 = height / 2;
    const d2 = depth / 2;

    const positions: number[] = [];
    const normalsArray: number[] = [];

    // Helper function para redondeo mejorado
    const roundPoint = (x: number, y: number, z: number): THREE.Vector3 => {
      const point = new THREE.Vector3(x, y, z);
      const direction = point.clone().normalize();

      // Aumentar significativamente el factor de redondeo
      const moveIn = Math.min(radius * 3.5, Math.min(width, height, depth) / 2);

      // Función de suavizado personalizada para mejor redondeo
      const smoothStep = (x: number) => {
        return x * x * (3 - 2 * x);
      };

      // Si es un borde o esquina, aplicar redondeo mejorado
      if (Math.abs(Math.abs(x) - w2) < 0.001 ||
        Math.abs(Math.abs(y) - h2) < 0.001 ||
        Math.abs(Math.abs(z) - d2) < 0.001) {

        // Mejorar la transición del redondeo con función suavizada
        if (Math.abs(x) === w2) {
          const yFactor = smoothStep(Math.abs(y / h2));
          const zFactor = smoothStep(Math.abs(z / d2));
          const factor = Math.pow(yFactor, 2) + Math.pow(zFactor, 2);
          point.x = Math.sign(x) * (w2 - moveIn * Math.min(1, factor));
        }
        if (Math.abs(y) === h2) {
          const xFactor = smoothStep(Math.abs(x / w2));
          const zFactor = smoothStep(Math.abs(z / d2));
          const factor = Math.pow(xFactor, 2) + Math.pow(zFactor, 2);
          point.y = Math.sign(y) * (h2 - moveIn * Math.min(1, factor));
        }
        if (Math.abs(z) === d2) {
          const xFactor = smoothStep(Math.abs(x / w2));
          const yFactor = smoothStep(Math.abs(y / h2));
          const factor = Math.pow(xFactor, 2) + Math.pow(yFactor, 2);
          point.z = Math.sign(z) * (d2 - moveIn * Math.min(1, factor));
        }

        // Mejorar el componente esférico con más intensidad
        const sphericalOffset = direction.multiplyScalar(moveIn * 1.5);
        point.add(sphericalOffset);

        // Suavizado adicional para las esquinas
        if (Math.abs(Math.abs(x) - w2) < 0.001 &&
          Math.abs(Math.abs(y) - h2) < 0.001 &&
          Math.abs(Math.abs(z) - d2) < 0.001) {
          const cornerFactor = 0.8; // Factor de suavizado para esquinas
          const cornerOffset = direction.multiplyScalar(moveIn * cornerFactor);
          point.add(cornerOffset);
        }
      }

      return point;
    };

    // Process each vertex
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      const roundedPoint = roundPoint(x, y, z);
      positions.push(roundedPoint.x, roundedPoint.y, roundedPoint.z);

      // Calcular normales más suaves con mayor intensidad
      const normal = roundedPoint.clone().normalize();
      normal.multiplyScalar(1.5); // Aumentar el efecto de las normales
      normalsArray.push(normal.x, normal.y, normal.z);
    }

    // Update geometry
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normalsArray, 3));

    // Compute vertex normals for smooth shading
    geometry.computeVertexNormals();
  }
}

const Card3DViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const [cardName, setCardName] = useState('JOHN COOPER');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2, 1.5, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Obtener dimensiones del contenedor
    const containerWidth = mountRef.current.clientWidth;
    const containerHeight = mountRef.current.clientHeight;

    // Configurar el renderer y la cámara
    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();

    if (mountRef.current.children.length === 0) {
      mountRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(0, 8, 6);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(0, 2, -6);
    scene.add(backLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(0, -4, 8);
    scene.add(fillLight);

    const leftLight = new THREE.PointLight(0xffffff, 0.4);
    leftLight.position.set(-5, 2, 0);
    scene.add(leftLight);

    const rightLight = new THREE.PointLight(0xffffff, 0.4);
    rightLight.position.set(5, 2, 0);
    scene.add(rightLight);

    const topLight = new THREE.PointLight(0xffffff, 0.3);
    topLight.position.set(0, 5, 0);
    scene.add(topLight);

    const bottomLight = new THREE.PointLight(0xffffff, 0.3);
    bottomLight.position.set(0, -5, 0);
    scene.add(bottomLight);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // Eliminar restricciones de rotación para permitir giro completo
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // Cargar el modelo GLB
    const loader = new GLTFLoader();
    loader.load(
      '/models/Card.glb',
      (gltf) => {
        const model = gltf.scene;

        // Ajustar la escala y posición del modelo si es necesario
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);

        // Guardar referencia del modelo
        modelRef.current = model;
        scene.add(model);

        // Ajustar la posición de la cámara basada en el tamaño del modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = maxDim / (2 * Math.tan(fov / 2));

        camera.position.set(
          center.x + cameraDistance * 0.5,
          center.y + cameraDistance * 0.3,
          center.z + cameraDistance
        );
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#00223E] py-20 font-nata">
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16">
          <p className="text-white/80 text-sm mb-4 font-nata">
            Physical Banking Experience
          </p>
          <h2 className="text-6xl font-bold text-[#B0FF51] mb-6 font-nata">
            Physical Cards
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 font-nata">
            Experience the tangible luxury of our physical cards, crafted with precision for your everyday banking needs
          </p>
        </div>

        {/* 3D Card Viewer */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a365d] to-[#2d3748] shadow-2xl mb-16">
          <div
            ref={mountRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-[#B0FF51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ),
              title: "Premium Design",
              description: "Metallic finish with silver details"
            },
            {
              icon: (
                <svg className="w-8 h-8 text-[#B0FF51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              title: "Maximum Security",
              description: "Advanced chip technology and contactless"
            },
            {
              icon: (
                <svg className="w-8 h-8 text-[#B0FF51]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
              title: "Exclusive Benefits",
              description: "Access to special services and offers"
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-[#B0FF51] text-lg font-semibold mb-2 font-nata">{feature.title}</h3>
              <p className="text-white/80 text-sm font-nata">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card3DViewer; 