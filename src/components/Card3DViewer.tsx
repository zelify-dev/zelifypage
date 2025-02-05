import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
          const yFactor = smoothStep(Math.abs(y/h2));
          const zFactor = smoothStep(Math.abs(z/d2));
          const factor = Math.pow(yFactor, 2) + Math.pow(zFactor, 2);
          point.x = Math.sign(x) * (w2 - moveIn * Math.min(1, factor));
        }
        if (Math.abs(y) === h2) {
          const xFactor = smoothStep(Math.abs(x/w2));
          const zFactor = smoothStep(Math.abs(z/d2));
          const factor = Math.pow(xFactor, 2) + Math.pow(zFactor, 2);
          point.y = Math.sign(y) * (h2 - moveIn * Math.min(1, factor));
        }
        if (Math.abs(z) === d2) {
          const xFactor = smoothStep(Math.abs(x/w2));
          const yFactor = smoothStep(Math.abs(y/h2));
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
  const cardRef = useRef<THREE.Group | null>(null);
  const [cardName, setCardName] = useState('JOHN DOE');
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const createCardTexture = (name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 648;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Gradiente plateado más oscuro para el fondo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#808080');  // Plateado oscuro
    gradient.addColorStop(0.5, '#505050'); // Plateado muy oscuro
    gradient.addColorStop(1, '#303030');  // Casi negro
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Patrón de puntos más visible con efecto metálico
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

    // Fondo plateado similar al frente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#808080');  // Plateado oscuro
    gradient.addColorStop(0.5, '#505050'); // Plateado muy oscuro
    gradient.addColorStop(1, '#303030');  // Casi negro
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Patrón de puntos similar al frente con efecto metálico
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
    camera.position.set(2, 1.5, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup con mejor calidad
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
    
    // Configurar el renderer y la cámara con las dimensiones correctas
    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    
    // Asegurarse de que el canvas se añada al DOM
    if (mountRef.current.children.length === 0) {
      mountRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Ajustar el tamaño del canvas
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    // Iluminación mejorada y sutil
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Luz principal suave y amplia desde arriba - más intensa y más cercana
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(0, 8, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 512;
    mainLight.shadow.mapSize.height = 512;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 500;
    scene.add(mainLight);

    // Luz de relleno suave y amplia - más intensa
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(0, -4, 8);
    scene.add(fillLight);

    // Luz lateral izquierda más intensa
    const leftLight = new THREE.PointLight(0xffffff, 0.3);
    leftLight.position.set(-5, 2, 4);
    scene.add(leftLight);

    // Luz lateral derecha más intensa
    const rightLight = new THREE.PointLight(0xffffff, 0.3);
    rightLight.position.set(5, 2, 4);
    scene.add(rightLight);

    // Luz trasera más intensa para definición
    const backLight = new THREE.PointLight(0xffffff, 0.2);
    backLight.position.set(0, 0, -4);
    scene.add(backLight);

    // Luz de área más intensa y más cercana
    const areaLight = new THREE.RectAreaLight(0xffffff, 0.4, 20, 20);
    areaLight.position.set(0, 6, 6);
    areaLight.lookAt(0, 0, 0);
    scene.add(areaLight);

    // Controls setup con límites más restrictivos
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // Create card with rounded edges
    const frontTexture = createCardTexture(cardName);
    const backTexture = createBackTexture();
    textureRef.current = frontTexture;

    // Materiales mejorados con menos brillo
    const materials = [
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 0.8,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Right
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 0.8,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Left
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 0.8,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Top
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 0.8,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Bottom
      frontTexture ? new THREE.MeshPhysicalMaterial({ 
        map: frontTexture,
        metalness: 0.7,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 0.6,
        envMapIntensity: 0.3,
        flatShading: false,
      }) : new THREE.MeshPhysicalMaterial(), // Front
      backTexture ? new THREE.MeshPhysicalMaterial({ 
        map: backTexture,
        metalness: 0.7,
        roughness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 0.6,
        envMapIntensity: 0.3,
        flatShading: false,
      }) : new THREE.MeshPhysicalMaterial(), // Back
    ];

    // Crear geometría con bordes mucho más redondeados
    const radius = 1.2; // Radio de redondeo aumentado significativamente
    const segments = 1024; // Muchos más segmentos para mayor suavidad
    const cardGeometry = new RoundedBoxGeometry(3.37, 2.13, 0.12, radius, segments);

    // Suavizar normales para mejor efecto de redondeo
    cardGeometry.computeVertexNormals();
    
    const positionAttribute = cardGeometry.attributes.position;
    const normalAttribute = cardGeometry.attributes.normal;
    
    // Definir las dimensiones de la tarjeta para el cálculo de bordes
    const cardWidth = 3.37;
    const cardHeight = 2.13;
    const cardDepth = 0.12;
    const w2 = cardWidth / 2;
    const h2 = cardHeight / 2;
    const d2 = cardDepth / 2;
    
    if (positionAttribute && normalAttribute) {
      // Aplicar suavizado adicional a las normales
      for (let i = 0; i < positionAttribute.count; i++) {
        const normal = new THREE.Vector3();
        normal.fromBufferAttribute(normalAttribute, i);
        
        // Suavizar las normales para mejor reflejo en los bordes
        const position = new THREE.Vector3();
        position.fromBufferAttribute(positionAttribute, i);
        const edgeFactor = Math.max(
          1 - Math.abs(Math.abs(position.x) - w2),
          1 - Math.abs(Math.abs(position.y) - h2),
          1 - Math.abs(Math.abs(position.z) - d2)
        );
        
        normal.normalize().multiplyScalar(0.8 + 0.2 * edgeFactor);
        normalAttribute.setXYZ(i, normal.x, normal.y, normal.z);
      }
    }

    const card = new THREE.Mesh(cardGeometry, materials);
    const cardGroup = new THREE.Group();
    cardGroup.add(card);
    
    // Rotación inicial de la tarjeta para mejor iluminación
    cardGroup.rotation.set(-0.2, 0.5, 0.1);
    scene.add(cardGroup);
    cardRef.current = cardGroup;

    // Animation loop con rotación más suave
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (cardRef.current) {
        // Rotación más suave y sutil
        cardRef.current.rotation.y += 0.0005;
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#505050]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#505050]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="inline-block text-sm font-semibold text-[#505050] bg-[#505050]/10 px-4 py-1 rounded-full mb-4">
              Physical Banking Experience
            </span>
          </div>
          <h2 className="text-6xl font-bold text-white mb-6">
            Physical <span className="bg-gradient-to-r from-[#808080] via-[#505050] to-[#303030] text-transparent bg-clip-text">Cards</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Experience the tangible luxury of our physical cards, crafted with precision for your everyday banking needs
          </p>

          {/* Card name input with improved styling */}
          <div className="inline-block bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <label className="text-white/80 text-sm font-medium">Customize your card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="Enter your name"
                className="w-64 bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 
                  focus:outline-none focus:border-[#505050]/50 focus:ring-2 focus:ring-[#505050]/20 
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
        <div className="relative h-[700px] rounded-3xl overflow-hidden bg-black/30 backdrop-blur-lg border border-white/10">
          <div 
            ref={mountRef} 
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {[
            {
              icon: "✨",
              title: "Premium Design",
              description: "Metallic finish with silver details"
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
            <div key={feature.title} className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
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