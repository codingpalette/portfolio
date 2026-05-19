"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Vector3 } from "three";
import type { Group } from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── React 로고 3D ── */
function ReactLogo() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.4;
    groupRef.current.rotation.x += delta * 0.1;
  });

  const orbitColor = "#61dafb";

  return (
    <group ref={groupRef} scale={0.7}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={orbitColor}
          emissive={orbitColor}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.06, 16, 100]} />
        <meshStandardMaterial
          color={orbitColor}
          emissive={orbitColor}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[1.8, 0.06, 16, 100]} />
        <meshStandardMaterial
          color={orbitColor}
          emissive={orbitColor}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 3, 0, -Math.PI / 6]}>
        <torusGeometry args={[1.8, 0.06, 16, 100]} />
        <meshStandardMaterial
          color={orbitColor}
          emissive={orbitColor}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

/* ── AI 뉴럴 네트워크 3D ── */
const NODE_COUNT = 14;

function generateNodes(count: number) {
  const nodes: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    nodes.push([
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
    ]);
  }
  return nodes;
}

function generateEdges(nodes: [number, number, number][], maxDist: number) {
  const edges: [Vector3, Vector3][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = new Vector3(...nodes[i]);
      const b = new Vector3(...nodes[j]);
      if (a.distanceTo(b) < maxDist) {
        edges.push([a, b]);
      }
    }
  }
  return edges;
}

function AIBrain() {
  const groupRef = useRef<Group>(null);

  const { nodes, edges } = useMemo(() => {
    const n = generateNodes(NODE_COUNT);
    const e = generateEdges(n, 2.0);
    return { nodes: n, edges: e };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.x += delta * 0.05;
  });

  const nodeColor = "#a855f7";
  const edgeColor = "#7c3aed";

  return (
    <group ref={groupRef} scale={0.9}>
      {nodes.map((pos, i) => (
        <mesh key={`n-${i}`} position={pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#c084fc"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>
      {edges.map(([a, b], i) => (
        <Line
          key={`e-${i}`}
          points={[a, b]}
          color={edgeColor}
          transparent
          opacity={0.4}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

/* ── Builder 오케스트레이터 3D ── */
function BuilderOrchestrator() {
  const groupRef = useRef<Group>(null);
  const orbit1 = useRef<Group>(null);
  const orbit2 = useRef<Group>(null);
  const orbit3 = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.2;

    if (orbit1.current) orbit1.current.rotation.y += delta * 0.8;
    if (orbit2.current) orbit2.current.rotation.y += delta * 0.6;
    if (orbit3.current) orbit3.current.rotation.z += delta * 0.7;
  });

  const mainColor = "#f59e0b";
  const accent1 = "#f97316";
  const accent2 = "#fb923c";

  return (
    <group ref={groupRef} scale={0.8}>
      <mesh>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>
      <group ref={orbit1}>
        <mesh position={[1.8, 0, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial
            color={mainColor}
            emissive={mainColor}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Line
          points={[new Vector3(0, 0, 0), new Vector3(1.8, 0, 0)]}
          color={mainColor}
          transparent
          opacity={0.3}
          lineWidth={1}
        />
      </group>
      <group ref={orbit2} rotation={[0, (Math.PI * 2) / 3, 0]}>
        <mesh position={[1.6, 0, 0]}>
          <tetrahedronGeometry args={[0.2]} />
          <meshStandardMaterial
            color={accent1}
            emissive={accent1}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Line
          points={[new Vector3(0, 0, 0), new Vector3(1.6, 0, 0)]}
          color={accent1}
          transparent
          opacity={0.3}
          lineWidth={1}
        />
      </group>
      <group ref={orbit3} rotation={[Math.PI / 4, (Math.PI * 4) / 3, 0]}>
        <mesh position={[1.4, 0, 0]}>
          <octahedronGeometry args={[0.18]} />
          <meshStandardMaterial
            color={accent2}
            emissive={accent2}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Line
          points={[new Vector3(0, 0, 0), new Vector3(1.4, 0, 0)]}
          color={accent2}
          transparent
          opacity={0.3}
          lineWidth={1}
        />
      </group>
    </group>
  );
}

/* ── 각 섹션별 씬 ── */
function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a78bfa" />
      <ReactLogo />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

function AIScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a78bfa" />
      <pointLight position={[3, 3, 3]} intensity={0.4} color="#a855f7" />
      <AIBrain />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

function BuilderScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[0, -3, 5]} intensity={0.3} color="#f59e0b" />
      <BuilderOrchestrator />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

const frontendSkills = ["React", "TypeScript", "Next.js", "Flutter"];
const backendSkills = ["Python", "FastAPI", "PHP", "NestJS", "Supabase", "RubyonRails"];
const aiMainSkills = [
  "Claude Code",
  "CLAUDE.md 설계",
  "MCP 서버 연동",
  "클로드 스킬 작성",
];
const aiSubSkills = ["Gemini", "Codex"];
const builderSkills = ["시스템 아키텍처 설계", "프로덕트 센스", "프롬프트 엔지니어링"];

export default function Hero3D() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 초기 등장 애니메이션
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.6 })
        .from(".hero-title", { opacity: 0, y: 40, duration: 0.8 }, "-=0.3")
        .from(".hero-desc", { opacity: 0, y: 30, duration: 0.6 }, "-=0.3")
        .from(".hero-skills", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".hero-canvas", { opacity: 0, scale: 0.8, duration: 1 }, "-=0.5");

      // 스크롤 시 각 섹션 등장 애니메이션
      const sections = gsap.utils.toArray<HTMLElement>(".hero-section-item");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 85%" },
          },
        );
      });
    },
    { scope: container },
  );

  return (
    <div id="home" ref={container} className="bg-gradient-to-br from-background via-card to-background">
      {/* 배경 그라디언트 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* 섹션 1: Hero */}
      <section className="relative flex min-h-screen items-center pt-24 pb-20">
        <div className="container mx-auto flex flex-col items-center gap-6 px-6 lg:flex-row lg:gap-0">
          {/* 왼쪽: 히어로 텍스트 */}
          <div className="hero-text w-full space-y-4 lg:w-1/2 lg:space-y-6 lg:pr-8">
            <p className="hero-subtitle text-sm font-semibold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
              Full-Stack Developer
            </p>
            <h1 className="hero-title text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              이성재
              <span className="mt-2 block bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-xl font-medium text-transparent sm:text-3xl lg:text-4xl">
                Frontend &amp; Backend Developer
              </span>
            </h1>
            <p className="hero-desc max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              사용자 경험을 최우선으로 생각하는 풀스택 개발자입니다.
              프론트엔드부터 백엔드까지, 완성도 높은 웹 서비스를 만듭니다.
            </p>
            <div className="hero-skills space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600/70 dark:text-cyan-400/70">
                  Frontend
                </span>
                {frontendSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600/70 dark:text-indigo-400/70">
                  Backend
                </span>
                {backendSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-600 dark:text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 3D 캔버스 */}
          <div className="hero-canvas w-full lg:w-1/2">
            <div className="mx-auto aspect-square max-w-[280px] sm:max-w-sm lg:max-w-lg">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <HeroScene />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 2: AI Skills */}
      <section id="ai" className="hero-section-item relative py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -right-32 bottom-1/3 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center gap-8 px-6 lg:flex-row lg:gap-12">
          {/* 3D 캔버스 */}
          <div className="w-full lg:w-1/2">
            <div className="mx-auto aspect-square max-w-[250px] sm:max-w-xs lg:max-w-sm">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <AIScene />
              </Canvas>
            </div>
          </div>
          {/* 텍스트 */}
          <div className="w-full space-y-4 sm:space-y-6 lg:w-1/2">
            <p className="text-sm font-semibold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
              AI-Driven Development
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              AI Skills
              <span className="mt-2 block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-medium text-transparent sm:text-2xl lg:text-3xl">
                AI와 함께 개발하다
              </span>
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Claude Code를 메인 개발 도구로 활용합니다.
              CLAUDE.md로 프로젝트 컨텍스트를 체계적으로 설계하고,
              MCP 서버를 연동하여 외부 도구와 데이터를 연결하며,
              클로드 스킬(SKILL.md)을 직접 작성하여 반복 워크플로우를 자동화합니다.
            </p>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70">
                  Main
                </span>
                {aiMainSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-600/70 dark:text-pink-400/70">
                  Sub
                </span>
                {aiSubSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-sm text-pink-600 dark:text-pink-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 3: Builder */}
      <section id="builder" className="hero-section-item relative py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto flex flex-col items-center gap-8 px-6 lg:flex-row lg:gap-12">
          {/* 텍스트 */}
          <div className="w-full space-y-4 sm:space-y-6 lg:w-1/2">
            <p className="text-sm font-semibold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
              The New Role
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Builder
              <span className="mt-2 block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-xl font-medium text-transparent sm:text-2xl lg:text-3xl">
                AI를 지휘하여 제품을 완성하다
              </span>
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              코드를 직접 짜는 시대에서, 문제를 정의하고 AI를 오케스트레이션하여
              제품을 끝까지 완성해내는 빌더의 시대로.
              설계력과 프로덕트 센스로 AI 에이전트를 지휘합니다.
            </p>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70">
                  Core
                </span>
                {builderSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-600 dark:text-amber-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* 3D 캔버스 */}
          <div className="w-full lg:w-1/2">
            <div className="mx-auto aspect-square max-w-[250px] sm:max-w-xs lg:max-w-sm">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <BuilderScene />
              </Canvas>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
