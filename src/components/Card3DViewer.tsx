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

  // Detectar idioma
  const isSpanish = typeof window !== 'undefined' && window.location.pathname.startsWith('/es');

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
    // Deshabilitar zoom pero permitir rotación
    controls.enableZoom = false;
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
          center.z + cameraDistance * 0.7
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
    <div className="relative min-h-screen bg-[#00213C] py-8 sm:py-12 md:py-20 font-nata w-full overflow-x-hidden">
      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto overflow-hidden">
        {/* Header section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
          <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-4 font-nata">
            {isSpanish ? 'Experiencia Bancaria Física' : 'Physical Banking Experience'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#B0FF51] mb-4 sm:mb-6 font-nata">
            {isSpanish ? 'Tarjetas Físicas' : 'Physical Cards'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto mb-8 sm:mb-12 font-nata">
            {isSpanish ? (
              <>
                Experimenta el lujo tangible de nuestras tarjetas físicas, elaboradas con precisión<br className="hidden sm:block" />
                para tus necesidades bancarias diarias
              </>
            ) : (
              <>
                Experience the tangible luxury of our physical cards, crafted with precision<br className="hidden sm:block" />
                for your everyday banking needs
              </>
            )}
          </p>
        </div>

        {/* 3D Card Viewer */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#00213C] mb-8 sm:mb-12 md:mb-16 mx-4 sm:mx-6">
          <div
            ref={mountRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-6 w-full">
          {[
            {
              icon: (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B0FF51] rounded-full flex items-center justify-center">
                  <img src="/assets/icons/icon_1_stars.svg" alt={isSpanish ? "Diseño Premium" : "Premium Design"} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              ),
              title: isSpanish ? "Diseño Premium" : "Premium Design",
              description: isSpanish ? (
                <>
                  Acabado metálico con<br className="hidden sm:block" />
                  detalles plateados
                </>
              ) : (
                <>
                  Metallic finish with<br className="hidden sm:block" />
                  silver details
                </>
              )
            },
            {
              icon: (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B0FF51] rounded-full flex items-center justify-center">
                  <img src="/assets/icons/icon_2_security.svg" alt={isSpanish ? "Máxima Seguridad" : "Maximum Security"} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              ),
              title: isSpanish ? "Máxima Seguridad" : "Maximum Security",
              description: isSpanish ? "Tecnología de chip avanzada y sin contacto" : "Advanced chip technology and contactless"
            },
            {
              icon: (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B0FF51] rounded-full flex items-center justify-center">
                  <img src="/assets/icons/icon_3_present.svg" alt={isSpanish ? "Beneficios Exclusivos" : "Exclusive Benefits"} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              ),
              title: isSpanish ? "Beneficios Exclusivos" : "Exclusive Benefits",
              description: isSpanish ? "Acceso a servicios y ofertas especiales" : "Access to special services and offers"
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                {feature.icon}
              </div>
              <h3 className="text-[#B0FF51] text-lg sm:text-xl font-bold mb-2 font-nata">{feature.title}</h3>
              <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl font-nata break-words">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card3DViewer; 