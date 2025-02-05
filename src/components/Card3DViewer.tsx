import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Clase para crear una geometría de caja con bordes redondeados
class RoundedBoxGeometry extends THREE.BoxGeometry {
  constructor(width: number, height: number, depth: number, radius: number, segments: number = 2) {
    super(width, height, depth);

    const geometry = this;
    const pos = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    const w2 = width / 2;
    const h2 = height / 2;
    const d2 = depth / 2;

    const positions = [];
    const normalsArray = [];

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      let nx = normals.getX(i);
      let ny = normals.getY(i);
      let nz = normals.getZ(i);

      // Redondear las esquinas en 3D
      if ((Math.abs(x) === w2 && Math.abs(y) === h2) ||
          (Math.abs(x) === w2 && Math.abs(z) === d2) ||
          (Math.abs(y) === h2 && Math.abs(z) === d2)) {
        
        const direction = new THREE.Vector3(
          Math.abs(x) === w2 ? Math.sign(x) : 0,
          Math.abs(y) === h2 ? Math.sign(y) : 0,
          Math.abs(z) === d2 ? Math.sign(z) : 0
        ).normalize();

        const point = new THREE.Vector3(
          Math.abs(x) === w2 ? (x > 0 ? w2 - radius : -w2 + radius) : x,
          Math.abs(y) === h2 ? (y > 0 ? h2 - radius : -h2 + radius) : y,
          Math.abs(z) === d2 ? (z > 0 ? d2 - radius : -d2 + radius) : z
        );

        const spherePoint = new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius);
        point.add(spherePoint);
        
        x = point.x;
        y = point.y;
        z = point.z;
        
        // Actualizar normales
        const normal = new THREE.Vector3(x, y, z).normalize();
        nx = normal.x;
        ny = normal.y;
        nz = normal.z;
      }

      positions.push(x, y, z);
      normalsArray.push(nx, ny, nz);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normalsArray, 3));
  }
}

const Card3DViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cardRef = useRef<THREE.Group | null>(null);
  const [cardName, setCardName] = useState('JOHN DOE');
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const createCardTexture = (name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 648;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Gradiente dorado más brillante para el fondo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');  // Dorado más brillante
    gradient.addColorStop(0.5, '#FDB931'); // Dorado medio
    gradient.addColorStop(1, '#F0B014');  // Dorado más cálido
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Patrón de puntos más visible
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        ctx.beginPath();
        ctx.arc(i * 20, j * 20, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Logo Zelify
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Zelify', canvas.width - 50, 80);

    // Chip y símbolo contactless
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(50, 200, 80, 60);
    
    // Símbolo contactless
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(170, 230, 15 + i * 10, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }

    // Número de tarjeta
    ctx.font = '36px "Courier New"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText('**** **** **** 4242', 50, 400);

    // Nombre del titular
    ctx.font = '32px Arial';
    ctx.fillText(name, 50, 500);

    // Fecha de validez
    ctx.font = '24px Arial';
    ctx.fillText('VALID THRU: 12/25', 50, 550);

    return new THREE.CanvasTexture(canvas);
  };

  const createBackTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 648;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fondo dorado similar al frente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');  // Dorado más brillante
    gradient.addColorStop(0.5, '#FDB931'); // Dorado medio
    gradient.addColorStop(1, '#F0B014');  // Dorado más cálido
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Patrón de puntos similar al frente
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        ctx.beginPath();
        ctx.arc(i * 20, j * 20, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Banda magnética con efecto metálico
    const bandGradient = ctx.createLinearGradient(0, 100, 0, 180);
    bandGradient.addColorStop(0, 'rgba(50, 50, 50, 0.8)');
    bandGradient.addColorStop(0.5, 'rgba(70, 70, 70, 0.8)');
    bandGradient.addColorStop(1, 'rgba(50, 50, 50, 0.8)');
    ctx.fillStyle = bandGradient;
    ctx.fillRect(0, 100, canvas.width, 80);

    // Título "Security Code"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Security Code:', 50, 300);
    ctx.font = 'bold 36px Arial';
    ctx.fillText('123', 300, 300);

    // Texto informativo
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('This is not a physical card, but a 3D rendering similar to a Zelify card,', 50, 380);
    ctx.fillText('providing a visual reference of the physical product.', 50, 410);

    // Información adicional en la parte inferior
    ctx.font = '32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('zelify.com', 50, 550);
    ctx.textAlign = 'right';
    ctx.fillText('DEBIT CARD', canvas.width - 50, 550);

    return new THREE.CanvasTexture(canvas);
  };

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
    camera.position.z = 4.5;
    camera.position.y = 0;
    cameraRef.current = camera;

    // Renderer setup con mejor calidad
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Iluminación mejorada
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Luces de acento para mejor definición
    const pointLight1 = new THREE.PointLight(0x4477ff, 2);
    pointLight1.position.set(0, 5, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff7744, 2);
    pointLight2.position.set(5, 0, 3);
    scene.add(pointLight2);

    // Luz trasera para mejor visibilidad
    const backLight = new THREE.PointLight(0xffffff, 1);
    backLight.position.set(-5, 0, -5);
    scene.add(backLight);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 3;
    controlsRef.current = controls;

    // Create card with rounded edges
    const cardGeometry = new RoundedBoxGeometry(3.37, 2.13, 0.06, 0.2, 8);
    const frontTexture = createCardTexture(cardName);
    const backTexture = createBackTexture();
    textureRef.current = frontTexture;

    // Materiales mejorados
    const materials = [
      new THREE.MeshPhysicalMaterial({ 
        color: 0xFFD700,  // Dorado más brillante
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      }), // Right
      new THREE.MeshPhysicalMaterial({ 
        color: 0xFFD700,  // Dorado más brillante
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      }), // Left
      new THREE.MeshPhysicalMaterial({ 
        color: 0xFFD700,  // Dorado más brillante
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      }), // Top
      new THREE.MeshPhysicalMaterial({ 
        color: 0xFFD700,  // Dorado más brillante
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      }), // Bottom
      frontTexture ? new THREE.MeshPhysicalMaterial({ 
        map: frontTexture,
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      }) : new THREE.MeshPhysicalMaterial(), // Front
      backTexture ? new THREE.MeshPhysicalMaterial({ 
        map: backTexture,
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      }) : new THREE.MeshPhysicalMaterial(), // Back
    ];

    const card = new THREE.Mesh(cardGeometry, materials);
    const cardGroup = new THREE.Group();
    cardGroup.add(card);
    scene.add(cardGroup);
    cardRef.current = cardGroup;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (cardRef.current) {
        cardRef.current.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [cardName]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FDB931]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="inline-block text-sm font-semibold text-[#FFD700] bg-[#FFD700]/10 px-4 py-1 rounded-full mb-4">
              Physical Banking Experience
            </span>
          </div>
          <h2 className="text-6xl font-bold text-white mb-6">
            Physical <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#F0B014] text-transparent bg-clip-text">Cards</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Experience the tangible luxury of our physical cards, crafted with precision for your everyday banking needs
          </p>

          {/* Card name input with improved styling */}
          <div className="inline-block bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <label className="text-white/80 text-sm font-medium">Customize your card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="Enter your name"
                className="w-64 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 
                  focus:outline-none focus:border-[#FFD700]/50 focus:ring-2 focus:ring-[#FFD700]/20 
                  transition-all duration-300 text-center font-medium"
                maxLength={20}
              />
              <p className="text-white/40 text-xs">
                The name will appear on your Premium card
              </p>
            </div>
          </div>
        </div>

        {/* 3D Card Viewer */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden bg-transparent -mt-8">
          <div 
            ref={mountRef} 
            className="absolute inset-0 bg-transparent"
          />
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: "✨",
              title: "Premium Design",
              description: "Metallic finish with golden details"
            },
            {
              icon: "🔒",
              title: "Maximum Security",
              description: "Advanced chip technology and contactless"
            },
            {
              icon: "💳",
              title: "Exclusive Benefits",
              description: "Access to special services and offers"
            }
          ].map((feature) => (
            <div key={feature.title} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card3DViewer; 