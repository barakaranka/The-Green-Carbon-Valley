import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Flame, 
  Rotate3d, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  Info, 
  Thermometer, 
  Wind, 
  Award,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PyrolysisLab3DProps {
  onBatchProduced?: (batch: {
    feedstock: string;
    biomassKg: number;
    biocharKg: number;
    co2eKg: number;
    quality: string;
  }) => void;
}

export default function PyrolysisLab3D({ onBatchProduced }: PyrolysisLab3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Game & Simulation State
  const [feedstock, setFeedstock] = useState<'hyacinth' | 'maize' | 'bagasse'>('hyacinth');
  const [temperature, setTemperature] = useState<number>(25); // Celsius
  const [targetHeatInput, setTargetHeatInput] = useState<number>(55); // 0-100%
  const [airflow, setAirflow] = useState<number>(15); // 0-100% (oxygen control)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleProgress, setCycleProgress] = useState<number>(0); // 0 to 100%
  const [biomassLoadKg, setBiomassLoadKg] = useState<number>(200); // 200 kg standard skid batch
  const [completedBatches, setCompletedBatches] = useState<number>(0);
  const [totalBiocharMade, setTotalBiocharMade] = useState<number>(0);
  const [totalCo2Sequestered, setTotalCo2Sequestered] = useState<number>(0);
  const [lastBatchReport, setLastBatchReport] = useState<{
    yieldKg: number;
    co2eKg: number;
    quality: string;
    message: string;
  } | null>(null);

  // References for Three.js animations
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const furnaceLightRef = useRef<THREE.PointLight | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const kilnMeshRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Simulation physics loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTemperature((prevTemp) => {
        // Temperature approaches target determined by heat input and airflow
        // High airflow causes combustion and extreme heat or heat loss depending on fire
        const equilibrium = 25 + targetHeatInput * 8.5 - (airflow > 40 ? (airflow - 40) * 4 : 0);
        const rate = 0.08;
        const newTemp = prevTemp + (equilibrium - prevTemp) * rate + (Math.random() * 4 - 2);
        return Math.max(25, Math.min(850, Math.round(newTemp)));
      });

      setCycleProgress((prev) => {
        if (prev >= 100) {
          // Finish cycle
          setIsRunning(false);
          return 100;
        }
        return prev + 1.25; // ~15 seconds per batch
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, targetHeatInput, airflow]);

  // When cycle completes, compute quality and yield
  useEffect(() => {
    if (cycleProgress >= 100 && isRunning === false && temperature > 300) {
      // Evaluate temperature zone
      let yieldFactor = 0.25;
      let quality = 'Grade A - Premium Agricultural Biochar';
      let message = 'Perfect temperature! High porosity, optimal cation exchange capacity, syngas fully recirculated.';

      if (feedstock === 'hyacinth') {
        yieldFactor = 0.26;
      } else if (feedstock === 'maize') {
        yieldFactor = 0.28;
      } else {
        yieldFactor = 0.24;
      }

      if (temperature < 420) {
        quality = 'Under-pyrolyzed (High Tar & Volatiles)';
        yieldFactor *= 0.85;
        message = 'Temperature was below the ideal 450°C window. Incomplete carbonization.';
      } else if (temperature > 650) {
        quality = 'Overheated / Partial Ash Conversion';
        yieldFactor *= 0.55;
        message = 'Excessive oxygen and temperature caused partial combustion into mineral ash, lowering stable carbon.';
      }

      const biocharKg = Math.round(biomassLoadKg * yieldFactor);
      const co2eKg = Math.round(biocharKg * 2.8);

      setTotalBiocharMade((prev) => prev + biocharKg);
      setTotalCo2Sequestered((prev) => prev + co2eKg);
      setCompletedBatches((prev) => prev + 1);

      const report = {
        yieldKg: biocharKg,
        co2eKg,
        quality,
        message
      };
      setLastBatchReport(report);

      if (onBatchProduced) {
        onBatchProduced({
          feedstock: feedstock === 'hyacinth' ? 'Water Hyacinth' : feedstock === 'maize' ? 'Maize Stover' : 'Sugarcane Bagasse',
          biomassKg: biomassLoadKg,
          biocharKg,
          co2eKg,
          quality
        });
      }
    }
  }, [cycleProgress, isRunning]);

  // Three.js 3D Scene Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c1116);
    scene.fog = new THREE.FogExp2(0x0c1116, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.5);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xdcfce7, 1.8);
    dirLight.position.set(6, 9, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    // Dynamic furnace point light (glows red/orange when kiln heats up)
    const furnaceLight = new THREE.PointLight(0xff4400, 0, 5);
    furnaceLight.position.set(0, 0.6, 0);
    scene.add(furnaceLight);
    furnaceLightRef.current = furnaceLight;

    // 5. Floor / Ground Plane
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111820,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Circular ground ring marker
    const ringGeo = new THREE.RingGeometry(2.4, 2.5, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // 6. Double Drum Skid-Mounted Retort Group
    const retortGroup = new THREE.Group();
    kilnMeshRef.current = retortGroup;

    // --- Steel Skid Base (I-Beams & Frame) ---
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5, metalness: 0.8 });
    const skidGeo1 = new THREE.BoxGeometry(3.4, 0.12, 0.15);
    const beam1 = new THREE.Mesh(skidGeo1, beamMat);
    beam1.position.set(0, 0.08, 0.85);
    beam1.castShadow = true;
    retortGroup.add(beam1);

    const beam2 = new THREE.Mesh(skidGeo1, beamMat);
    beam2.position.set(0, 0.08, -0.85);
    beam2.castShadow = true;
    retortGroup.add(beam2);

    const crossGeo = new THREE.BoxGeometry(0.15, 0.12, 1.85);
    const cross1 = new THREE.Mesh(crossGeo, beamMat);
    cross1.position.set(-1.4, 0.08, 0);
    retortGroup.add(cross1);

    const cross2 = new THREE.Mesh(crossGeo, beamMat);
    cross2.position.set(1.4, 0.08, 0);
    retortGroup.add(cross2);

    // --- Combustion Chamber Box (Bottom) ---
    const furnaceBoxGeo = new THREE.BoxGeometry(1.6, 0.6, 1.4);
    const furnaceMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.6, metalness: 0.4 });
    const furnaceBox = new THREE.Mesh(furnaceBoxGeo, furnaceMat);
    furnaceBox.position.set(0, 0.42, 0);
    furnaceBox.castShadow = true;
    furnaceBox.receiveShadow = true;
    retortGroup.add(furnaceBox);

    // Furnace viewing door with glowing slit
    const doorGeo = new THREE.BoxGeometry(0.04, 0.3, 0.45);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0.81, 0.42, 0);
    retortGroup.add(door);

    // --- Outer Drum (Insulation Jacket) ---
    const outerDrumGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.7, 32);
    const drumMat = new THREE.MeshStandardMaterial({
      color: 0x52525b,
      roughness: 0.35,
      metalness: 0.6
    });
    const outerDrum = new THREE.Mesh(outerDrumGeo, drumMat);
    outerDrum.rotation.z = Math.PI / 2;
    outerDrum.position.set(0, 1.35, 0);
    outerDrum.castShadow = true;
    retortGroup.add(outerDrum);

    // Outer Drum Reinforcing Steel Rings
    const ringSteelMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.8 });
    for (let i = -0.6; i <= 0.6; i += 0.4) {
      const ribGeo = new THREE.TorusGeometry(0.73, 0.02, 12, 32);
      const rib = new THREE.Mesh(ribGeo, ringSteelMat);
      rib.rotation.y = Math.PI / 2;
      rib.position.set(i, 1.35, 0);
      retortGroup.add(rib);
    }

    // --- Flue Gas Chimney Stack (Vertical with Syngas Return Pipe) ---
    const stackGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 16);
    const stackMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.7 });
    const stack = new THREE.Mesh(stackGeo, stackMat);
    stack.position.set(-0.6, 2.5, 0);
    stack.castShadow = true;
    retortGroup.add(stack);

    // Chimney Cowl
    const cowlGeo = new THREE.ConeGeometry(0.24, 0.2, 16);
    const cowl = new THREE.Mesh(cowlGeo, stackMat);
    cowl.position.set(-0.6, 3.35, 0);
    retortGroup.add(cowl);

    // Syngas Re-burn Recirculation Pipe (from top back into combustion base)
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 1.9, 0),
      new THREE.Vector3(0.9, 1.8, 0.4),
      new THREE.Vector3(0.9, 0.8, 0.4),
      new THREE.Vector3(0.6, 0.45, 0.2)
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 20, 0.04, 8, false);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.6 });
    const syngasPipe = new THREE.Mesh(pipeGeo, pipeMat);
    retortGroup.add(syngasPipe);

    // Front Charging Port / Hermetic Clamping Lid
    const lidGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 24);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.3, metalness: 0.7 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0.86, 1.35, 0);
    retortGroup.add(lid);

    // Hermetic Clamps
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      const clampGeo = new THREE.BoxGeometry(0.06, 0.1, 0.06);
      const clamp = new THREE.Mesh(clampGeo, ringSteelMat);
      clamp.position.set(0.88, 1.35 + Math.sin(a) * 0.48, Math.cos(a) * 0.48);
      retortGroup.add(clamp);
    }

    // Thermocouple Probe & Pressure Gauge
    const gaugeStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const gaugeStem = new THREE.Mesh(gaugeStemGeo, stackMat);
    gaugeStem.position.set(0, 2.2, 0);
    retortGroup.add(gaugeStem);

    const gaugeHeadGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16);
    const gaugeHead = new THREE.Mesh(gaugeHeadGeo, ringSteelMat);
    gaugeHead.rotation.x = Math.PI / 2;
    gaugeHead.position.set(0, 2.35, 0.06);
    retortGroup.add(gaugeHead);

    scene.add(retortGroup);

    // 7. Chimney Smoke Particle System (Procedural Points)
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = -0.6 + (Math.random() - 0.5) * 0.1;
      particlePositions[i * 3 + 1] = 3.3 + Math.random() * 1.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.15,
      transparent: true,
      opacity: 0.0
    });
    const smokeParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    // 8. Animation & Render Loop
    let angle = 0;
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      // Subtle slow turntable rotation for showcase
      angle += 0.003;
      retortGroup.rotation.y = Math.sin(angle) * 0.25;

      // Update furnace light intensity according to temperature
      if (furnaceLightRef.current) {
        if (temperature > 100) {
          const glow = Math.min(3.5, (temperature - 100) / 120);
          furnaceLightRef.current.intensity = glow;
          const hue = Math.max(0.02, 0.09 - (temperature / 12000));
          furnaceLightRef.current.color.setHSL(hue, 1.0, 0.5);
        } else {
          furnaceLightRef.current.intensity = 0;
        }
      }

      // Update chimney smoke
      if (smokeParticlesRef.current) {
        const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const active = temperature > 120;
        (smokeParticlesRef.current.material as THREE.PointsMaterial).opacity = active 
          ? (temperature > 500 ? 0.2 : 0.6) // Clean syngas reburn produces less visible smoke at high temp!
          : 0.0;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += 0.025; // drift upward
          positions[i * 3] += (Math.random() - 0.48) * 0.01;
          positions[i * 3 + 2] += (Math.random() - 0.48) * 0.01;

          if (positions[i * 3 + 1] > 5.0) {
            positions[i * 3] = -0.6 + (Math.random() - 0.5) * 0.1;
            positions[i * 3 + 1] = 3.35;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
          }
        }
        smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
    };
  }, []);

  const handleStartCycle = () => {
    setIsRunning(true);
    setCycleProgress(0);
    setLastBatchReport(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCycleProgress(0);
    setTemperature(25);
    setTargetHeatInput(55);
    setAirflow(15);
  };

  // Temperature status helper
  const getTempStatus = () => {
    if (temperature < 150) return { label: 'Pre-heating / Ambient', color: 'text-zinc-400', bg: 'bg-zinc-800' };
    if (temperature < 400) return { label: 'Moisture Drying & Torrefaction', color: 'text-amber-400', bg: 'bg-amber-950/60' };
    if (temperature <= 620) return { label: 'OPTIMAL PYROLYSIS (Sweet Spot)', color: 'text-emerald-400', bg: 'bg-emerald-950/60' };
    return { label: 'DANGER: Ash Burnout Zone', color: 'text-rose-400', bg: 'bg-rose-950/60' };
  };

  const tempStatus = getTempStatus();

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Simulation Top Bar */}
      <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Rotate3d className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                3D Interactive Lab & Simulator
              </span>
              <span className="text-xs text-zinc-500 font-mono">Skid-Mounted Retort</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Valley Pyrolysis Master</h3>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Batches: </span>
            <span className="text-white font-bold">{completedBatches}</span>
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Biochar: </span>
            <span className="text-emerald-400 font-bold">{totalBiocharMade} kg</span>
          </div>
          <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">CO₂e Locked: </span>
            <span className="text-cyan-400 font-bold">{totalCo2Sequestered} kg</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* 3D Canvas Area (7 cols on lg) */}
        <div className="lg:col-span-7 relative h-[420px] bg-[#0c1116] flex items-center justify-center">
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Overlay HUD indicators */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            <div className={`px-3 py-1.5 rounded-xl border border-zinc-700/60 backdrop-blur-md flex items-center gap-2 ${tempStatus.bg}`}>
              <Thermometer className={`w-4 h-4 ${tempStatus.color}`} />
              <span className="text-xs font-mono font-bold text-white">{temperature}°C</span>
              <span className={`text-[11px] font-medium ${tempStatus.color}`}>• {tempStatus.label}</span>
            </div>

            {isRunning && (
              <div className="px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                Pyrolysis Cycle: {Math.round(cycleProgress)}%
              </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 text-[10px] text-zinc-500 font-mono bg-zinc-950/70 px-2 py-1 rounded border border-zinc-800 pointer-events-none">
            Retort Model: Double-Drum Retort 200kg Skid
          </div>
        </div>

        {/* Interactive Controls & Game Interface (5 cols on lg) */}
        <div className="lg:col-span-5 p-6 bg-zinc-900/40 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Feedstock Selector */}
            <div>
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2">
                1. Select Feedstock Material
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFeedstock('hyacinth')}
                  disabled={isRunning}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    feedstock === 'hyacinth'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-[13px]">Water Hyacinth</div>
                  <div className="text-[10px] opacity-70">Lake Victoria</div>
                </button>
                <button
                  onClick={() => setFeedstock('maize')}
                  disabled={isRunning}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    feedstock === 'maize'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-[13px]">Maize Stover</div>
                  <div className="text-[10px] opacity-70">Makongi Eldoret</div>
                </button>
                <button
                  onClick={() => setFeedstock('bagasse')}
                  disabled={isRunning}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    feedstock === 'bagasse'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-[13px]">Sugar Bagasse</div>
                  <div className="text-[10px] opacity-70">Western Mills</div>
                </button>
              </div>
            </div>

            {/* Heat Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Burner Heat Input
                </span>
                <span className="font-mono text-white font-semibold">{targetHeatInput}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={targetHeatInput}
                onChange={(e) => setTargetHeatInput(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Low Torrefaction</span>
                <span className="text-emerald-400">Sweet Spot (450–600°C)</span>
                <span>Max Blast</span>
              </div>
            </div>

            {/* Airflow / Oxygen Damper Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-blue-400" /> Air Damper (Oxygen Supply)
                </span>
                <span className="font-mono text-white font-semibold">{airflow}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="75"
                value={airflow}
                onChange={(e) => setAirflow(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 leading-tight">
                *Keep airflow restricted (&lt;30%) for anoxic pyrolysis. Excessive air burns char into ash!
              </p>
            </div>

            {/* Cycle Status and Progress */}
            {isRunning && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Carbonization In Progress</span>
                  <span className="font-mono text-emerald-400">{Math.round(cycleProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${cycleProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Last Batch Result Card */}
            {lastBatchReport && !isRunning && (
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Batch Complete!
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">{lastBatchReport.quality}</span>
                </div>
                <p className="text-xs text-zinc-300">{lastBatchReport.message}</p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Biochar Yield</span>
                    <span className="text-white font-bold text-sm">+{lastBatchReport.yieldKg} kg</span>
                  </div>
                  <div className="bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] block">Net Carbon Sink</span>
                    <span className="text-emerald-400 font-bold text-sm">+{lastBatchReport.co2eKg} kg CO₂e</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
            {!isRunning ? (
              <button
                onClick={handleStartCycle}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" /> Fire Retort Batch
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-sm hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" /> Pause Retort
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/50"
              title="Reset Kiln"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
