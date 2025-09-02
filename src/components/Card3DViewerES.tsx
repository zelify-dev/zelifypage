import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

declare global {
  interface Window {
    isSpanish: boolean;
  }
}

const Card3DViewerES = () => {
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
    <div className="relative min-h-screen bg-[#00213C] py-20 font-nata">
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16">
          <p className="text-white/80 text-sm mb-4 font-nata">
            Experiencia Bancaria Física
          </p>
          <h2 className="text-6xl font-bold text-[#B0FF51] mb-6 font-nata">
            Tarjetas Físicas
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto mb-12 font-nata">
            Experimenta el lujo tangible de nuestras tarjetas físicas, elaboradas con precisión<br />
            para tus necesidades bancarias diarias
          </p>
        </div>

        {/* 3D Card Viewer */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden bg-[#00213C] mb-16">
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
                <div className="w-12 h-12 bg-[#B0FF51] rounded-full flex items-center justify-center">
                  <img src="/assets/icons/icon_1_stars.svg" alt="Diseño Premium" className="w-6 h-6" />
                </div>
              ),
              title: "Diseño Premium",
              description: (
                <>
                  Acabado metálico con<br />
                  detalles plateados
                </>
              )
            },
            {
              icon: (
                <div className="w-12 h-12 bg-[#B0FF51] rounded-full flex items-center justify-center">
                  <img src="/assets/icons/icon_2_security.svg" alt="Máxima Seguridad" className="w-6 h-6" />
                </div>
              ),
              title: "Máxima Seguridad",
              description: "Tecnología de chip avanzada y sin contacto"
            },
            {
              icon: (
                <div className="w-12 h-12 bg-[#B0FF51] rounded-full flex items-center justify-center">
                  <img src="/assets/icons/icon_3_present.svg" alt="Beneficios Exclusivos" className="w-6 h-6" />
                </div>
              ),
              title: "Beneficios Exclusivos",
              description: "Acceso a servicios y ofertas especiales"
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-[#B0FF51] text-xl font-bold mb-2 font-nata">{feature.title}</h3>
              <p className="text-white/80 text-xl font-nata">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card3DViewerES; 
