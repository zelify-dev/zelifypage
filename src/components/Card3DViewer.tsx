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

  // Chip más realista con bordes redondeados
  const drawChip = (ctx: CanvasRenderingContext2D) => {
    const chipX = 50;
    const chipY = 220;
    const chipWidth = 120;
    const chipHeight = 90;
    const radius = 10;

    // Fondo dorado metálico del chip
    const chipGradient = ctx.createLinearGradient(chipX, chipY, chipX, chipY + chipHeight);
    chipGradient.addColorStop(0, '#D4AF37');    // Dorado más suave
    chipGradient.addColorStop(0.5, '#FFD700');  // Dorado brillante
    chipGradient.addColorStop(1, '#D4AF37');    // Dorado más suave
    
    // Dibujar el rectángulo redondeado para el chip
    ctx.beginPath();
    ctx.moveTo(chipX + radius, chipY);
    ctx.lineTo(chipX + chipWidth - radius, chipY);
    ctx.quadraticCurveTo(chipX + chipWidth, chipY, chipX + chipWidth, chipY + radius);
    ctx.lineTo(chipX + chipWidth, chipY + chipHeight - radius);
    ctx.quadraticCurveTo(chipX + chipWidth, chipY + chipHeight, chipX + chipWidth - radius, chipY + chipHeight);
    ctx.lineTo(chipX + radius, chipY + chipHeight);
    ctx.quadraticCurveTo(chipX, chipY + chipHeight, chipX, chipY + chipHeight - radius);
    ctx.lineTo(chipX, chipY + radius);
    ctx.quadraticCurveTo(chipX, chipY, chipX + radius, chipY);
    ctx.closePath();
    
    ctx.fillStyle = chipGradient;
    ctx.fill();

    // Líneas del chip EMV
    ctx.strokeStyle = '#B8860B';  // Dorado más oscuro para las líneas
    ctx.lineWidth = 1.5;

    // Divisiones horizontales (3 secciones)
    const h1 = chipY + chipHeight * 0.33;
    const h2 = chipY + chipHeight * 0.66;

    // Divisiones verticales
    const v1 = chipX + chipWidth * 0.33;
    const v2 = chipX + chipWidth * 0.66;

    // Dibujar las líneas
    ctx.beginPath();
    
    // Líneas horizontales principales
    ctx.moveTo(chipX, h1);
    ctx.lineTo(chipX + chipWidth, h1);
    ctx.moveTo(chipX, h2);
    ctx.lineTo(chipX + chipWidth, h2);

    // Líneas verticales
    ctx.moveTo(v1, chipY);
    ctx.lineTo(v1, h1);
    ctx.moveTo(v2, chipY);
    ctx.lineTo(v2, h1);

    // Línea vertical central en sección media
    ctx.moveTo(chipX + chipWidth/2, h1);
    ctx.lineTo(chipX + chipWidth/2, h2);

    // Líneas verticales en sección inferior
    ctx.moveTo(v1, h2);
    ctx.lineTo(v1, chipY + chipHeight);
    ctx.moveTo(v2, h2);
    ctx.lineTo(v2, chipY + chipHeight);

    ctx.stroke();

    // Efecto de brillo
    const highlightGradient = ctx.createLinearGradient(chipX, chipY, chipX + chipWidth, chipY + chipHeight);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    ctx.fillStyle = highlightGradient;
    ctx.fill();
  };

  // Crear el frente de la tarjeta
  const createCardTexture = (name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 648;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Gradiente plateado más oscuro para el fondo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(0.5, '#141414');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Añadir un sutil efecto de brillo
    const overlayGradient = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.3, 0,
      canvas.width * 0.5, canvas.height * 0.3, canvas.width * 0.8
    );
    overlayGradient.addColorStop(0, 'rgba(40, 40, 40, 0.2)');
    overlayGradient.addColorStop(0.5, 'rgba(30, 30, 30, 0.1)');
    overlayGradient.addColorStop(1, 'rgba(20, 20, 20, 0)');
    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Añadir un sutil patrón de puntos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }

    // Dibujar el logo
    ctx.save();
    // Escalar y posicionar el logo
    const scale = 0.15;
    ctx.translate(canvas.width - 300, 60); // Mover más cerca del borde derecho (era -400)
    ctx.scale(scale, scale);
    
    // Asegurar que el logo sea blanco puro y completamente opaco
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';

    // Añadir sombras en las esquinas para simular curvas
    const cornerRadius = 40;
    // Esquina superior izquierda
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cornerRadius, 0);
    ctx.lineTo(0, cornerRadius);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Esquina superior derecha
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width - cornerRadius, 0);
    ctx.lineTo(canvas.width, cornerRadius);
    ctx.fill();

    // Esquina inferior izquierda
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(cornerRadius, canvas.height);
    ctx.lineTo(0, canvas.height - cornerRadius);
    ctx.fill();

    // Esquina inferior derecha
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width - cornerRadius, canvas.height);
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    ctx.fill();

    // Restaurar el color blanco para el logo
    ctx.fillStyle = '#FFFFFF';
    
    // Dibujar el símbolo Z y el cuadrado (en verde en el original)
    const zPath = new Path2D('M290.551 5.49082H12.47V97.7695H212.569C108.767 113.4 25.242 190.879 0.796661 291.519H85.61C110.454 224.14 175.233 176.077 251.243 176.077C264.761 176.077 277.909 177.652 290.551 180.528V97.8095C290.462 97.7921 290.373 97.7868 290.282 97.7695H290.551V5.49082Z');
    ctx.fill(zPath);
    
    const squarePath = new Path2D('M198.272 291.523H290.551V199.244H198.272V291.523Z');
    ctx.fill(squarePath);

    // Dibujar "elify" (en azul en el original)
    const ePath = new Path2D('M795.452 168.977C795.446 168.987 795.434 169.005 795.424 169.015C789.316 177.091 773.573 181.154 751.117 180.487C717.688 179.467 690.508 185.649 665.434 202.075C663.858 189.981 665.092 169.935 665.092 169.935C670.428 142.833 691.37 119.839 739.409 119.839C769.796 119.839 793.496 131.457 797.194 161.483C797.52 164.113 797.044 166.858 795.452 168.977ZM833.28 139.571L833.258 139.577C818.418 100.095 779.446 80.8341 738.177 80.8341C667.557 80.8341 622.388 123.538 622.388 186.361C622.388 200.478 624.781 213.563 629.253 225.389C598.194 241.523 559.424 249.363 474.504 251.459L637.032 47.5781L640.73 7.74876H421.068L417.777 45.9354H584.476L420.658 252.049L416.96 290.65H419.868C419.868 290.645 419.873 290.645 419.873 290.639C556.033 290.515 607.761 281.347 649.982 258.129C670.83 279.71 702.344 292.293 740.637 292.293C773.074 292.293 807.977 286.127 825.63 277.917L813.721 241.787C796.892 247.537 768.966 253.286 741.461 253.286C714.549 253.286 696.201 246.623 684.129 236.21C706.429 222.323 726.032 218.765 749.94 219.493C786.412 220.609 812.197 211.53 826.544 192.547C833.358 183.547 836.044 174.043 836.733 165.591C837.332 156.322 836.301 147.775 833.432 140.019C833.37 139.846 833.32 139.683 833.28 139.571Z');
    ctx.fill(ePath);

    const lPath = new Path2D('M870.789 290.65H911.845V5.69767L870.789 8.163V290.65Z');
    ctx.fill(lPath);

    const iPath = new Path2D('M958.642 290.65H1000.11V84.5323L958.642 86.9923V290.65Z');
    ctx.fill(iPath);

    const iDotPath = new Path2D('M979.173 0.773339C965.213 0.773339 953.714 12.268 953.714 26.6373C953.714 40.5973 965.213 52.5 979.173 52.5C993.543 52.5 1005.04 40.5973 1005.04 26.6373C1005.04 12.268 993.543 0.773339 979.173 0.773339Z');
    ctx.fill(iDotPath);

    const fPath = new Path2D('M1063.34 79.6047V84.122H1028.44L1025.16 122.303H1063.34V290.649H1104.4V122.303H1192.67L1195.96 84.122H1104.4V79.6047C1104.4 53.326 1113.43 43.474 1153.67 43.474C1175.02 43.474 1193.9 46.758 1197.6 47.5767L1202.94 10.2127C1195.14 8.57137 1172.97 4.87803 1150.79 4.87803C1110.14 4.87803 1063.34 16.7874 1063.34 79.6047Z');
    ctx.fill(fPath);

    const yPath = new Path2D('M1368.81 86.1722L1310.09 251.637L1251.38 84.9388L1206.21 86.9908L1285.05 290.648H1293.67L1256.31 375.227H1303.11L1415.2 84.1215L1368.81 86.1722Z');
    ctx.fill(yPath);
    
    ctx.restore();

    // Dibujar el chip realista
    drawChip(ctx);

    // Símbolo contactless
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(220, 265, 20 + i * 15, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }

    // Nombre del titular más grande y centrado con sombra para mayor visibilidad
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'left';
    // Añadir sombra para mayor contraste
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#FFFFFF'; // Blanco puro
    ctx.fillText(name, 50, 500);
    // Resetear sombra
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Fecha de validez
    ctx.font = '32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('VALID THRU: 12/25', 50, 580);

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
    gradient.addColorStop(0, '#808080');
    gradient.addColorStop(0.5, '#505050');
    gradient.addColorStop(1, '#303030');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Banda magnética con efecto metálico
    const bandGradient = ctx.createLinearGradient(0, 100, 0, 180);
    bandGradient.addColorStop(0, 'rgba(50, 50, 50, 0.8)');
    bandGradient.addColorStop(0.5, 'rgba(70, 70, 70, 0.8)');
    bandGradient.addColorStop(1, 'rgba(50, 50, 50, 0.8)');
    ctx.fillStyle = bandGradient;
    ctx.fillRect(0, 100, canvas.width, 80);

    // Número de tarjeta
    ctx.font = 'bold 48px "Courier New"';  // Aumentado y en negrita
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('4242 4242 4242 4242', canvas.width / 2, 300);

    // Título "Security Code"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Security Code:', 50, 400);
    ctx.fillText('123', 300, 400);

    // Texto informativo
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('This card is a 3D rendering of a Zelify card.', 50, 480);
    ctx.fillText('For demonstration purposes only.', 50, 510);

    // Información adicional en la parte inferior
    ctx.font = '32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('zelify.com', 50, 580);
    ctx.textAlign = 'right';
    ctx.fillText('DEBIT CARD', canvas.width - 50, 580);

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

    // Crear geometría con bordes redondeados mejorados
    const radius = 0.15; // Radio de redondeo
    const segments = 64; // Segmentos para suavidad
    const cardGeometry = new RoundedBoxGeometry(3.37, 2.13, 0.02, radius, segments); // Reducido de 0.03 a 0.02

    // Suavizar normales para mejor efecto de redondeo
    cardGeometry.computeVertexNormals();
    
    const positionAttribute = cardGeometry.attributes.position;
    const normalAttribute = cardGeometry.attributes.normal;
    
    // Definir las dimensiones de la tarjeta para el cálculo de bordes
    const cardWidth = 3.37;
    const cardHeight = 2.13;
    const cardDepth = 0.02;
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
        
        // Factor de suavizado mejorado para los bordes con una curva más pronunciada
        const edgeFactor = Math.max(
          1 - Math.pow(Math.abs(Math.abs(position.x) - w2) / radius, 2),
          1 - Math.pow(Math.abs(Math.abs(position.y) - h2) / radius, 2),
          1 - Math.pow(Math.abs(Math.abs(position.z) - d2) / radius, 2)
        );
        
        // Aplicar un suavizado más pronunciado en los bordes
        normal.normalize().multiplyScalar(0.5 + 0.5 * Math.pow(edgeFactor, 3));
        normalAttribute.setXYZ(i, normal.x, normal.y, normal.z);
      }
    }

    // Ajustar los materiales para mejor reflejo en los bordes
    const materials = [
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.2, // Reducir la rugosidad
        clearcoat: 0.6, // Aumentar el clearcoat
        clearcoatRoughness: 0.1, // Reducir la rugosidad del clearcoat
        reflectivity: 1.0, // Aumentar la reflectividad
        envMapIntensity: 0.8, // Aumentar la intensidad del mapa de ambiente
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Right
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.2, // Reducir la rugosidad
        clearcoat: 0.6, // Aumentar el clearcoat
        clearcoatRoughness: 0.1, // Reducir la rugosidad del clearcoat
        reflectivity: 1.0, // Aumentar la reflectividad
        envMapIntensity: 0.8, // Aumentar la intensidad del mapa de ambiente
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Left
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.2, // Reducir la rugosidad
        clearcoat: 0.6, // Aumentar el clearcoat
        clearcoatRoughness: 0.1, // Reducir la rugosidad del clearcoat
        reflectivity: 1.0, // Aumentar la reflectividad
        envMapIntensity: 0.8, // Aumentar la intensidad del mapa de ambiente
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Top
      new THREE.MeshPhysicalMaterial({ 
        color: 0x505050,
        metalness: 0.9,
        roughness: 0.2, // Reducir la rugosidad
        clearcoat: 0.6, // Aumentar el clearcoat
        clearcoatRoughness: 0.1, // Reducir la rugosidad del clearcoat
        reflectivity: 1.0, // Aumentar la reflectividad
        envMapIntensity: 0.8, // Aumentar la intensidad del mapa de ambiente
        side: THREE.DoubleSide,
        flatShading: false,
      }), // Bottom
      frontTexture ? new THREE.MeshPhysicalMaterial({ 
        map: frontTexture,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0,
        envMapIntensity: 0.8,
        flatShading: false,
      }) : new THREE.MeshPhysicalMaterial(), // Front
      backTexture ? new THREE.MeshPhysicalMaterial({ 
        map: backTexture,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0,
        envMapIntensity: 0.8,
        flatShading: false,
      }) : new THREE.MeshPhysicalMaterial(), // Back
    ];

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