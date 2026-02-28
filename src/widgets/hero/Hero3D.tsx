"use client";

import { createRef, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MathUtils, Vector3 } from "three";
import type { Group } from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── 스크롤 진행도를 Three.js 내부에서 읽기 위한 공유 ref ── */
const scrollProgressRef = createRef<{ value: number }>() as React.MutableRefObject<{
  value: number;
}>;
scrollProgressRef.current = { value: 0 };

/* ── React 로고 3D ── */
function ReactLogo() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.4;
    groupRef.current.rotation.x += delta * 0.1;

    // 스크롤 시 축소 (0~0.5 구간에서 1→0)
    const p = scrollProgressRef.current.value;
    const s = MathUtils.lerp(groupRef.current.scale.x, p < 0.3 ? 0.7 : 0, delta * 5);
    groupRef.current.scale.setScalar(s);
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

    // 스크롤 시 확대 (0.3~0.6 구간에서 0→0.9)
    const p = scrollProgressRef.current.value;
    const s = MathUtils.lerp(groupRef.current.scale.x, p > 0.4 ? 0.9 : 0, delta * 5);
    groupRef.current.scale.setScalar(s);
  });

  const nodeColor = "#a855f7";
  const edgeColor = "#7c3aed";

  return (
    <group ref={groupRef} scale={0}>
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

/* ── 씬 (하나의 Canvas 안에 두 모델) ── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a78bfa" />
      <pointLight position={[3, 3, 3]} intensity={0.4} color="#a855f7" />
      <ReactLogo />
      <AIBrain />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

const frontendSkills = ["React", "TypeScript", "Next.js", "Flutter"];
const backendSkills = ["Python", "FastAPI", "PHP", "NestJS", "Supabase"];
const aiMainSkills = [
  "Claude Code",
  "CLAUDE.md 설계",
  "MCP 서버 연동",
  "클로드 스킬 작성",
];
const aiSubSkills = ["Gemini"];

export default function Hero3D() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1) 초기 등장 애니메이션
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.6 })
        .from(".hero-title", { opacity: 0, y: 40, duration: 0.8 }, "-=0.3")
        .from(".hero-desc", { opacity: 0, y: 30, duration: 0.6 }, "-=0.3")
        .from(".hero-skills", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".canvas-wrap", { opacity: 0, scale: 0.8, duration: 1 }, "-=0.5");

      // 2) 스크롤 기반 전환 애니메이션 (반응형)
      const mm = gsap.matchMedia();

      // 데스크탑 (1024px+)
      mm.add("(min-width: 1024px)", () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".pin-wrapper",
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              scrollProgressRef.current.value = self.progress;
            },
          },
        });

        scrollTl
          .to(".hero-text", { opacity: 0, x: -80, duration: 1, ease: "power2.in" }, 0)
          .to(".canvas-wrap", { xPercent: -120, duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(
            ".ai-section",
            { opacity: 0, x: 100, pointerEvents: "none" },
            { opacity: 1, x: 0, pointerEvents: "auto", duration: 1, ease: "power2.out" },
            0.3,
          );
      });

      // 모바일 & 태블릿 (~1023px)
      mm.add("(max-width: 1023px)", () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".pin-wrapper",
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              scrollProgressRef.current.value = self.progress;
            },
          },
        });

        scrollTl
          .to(".hero-text", { opacity: 0, y: -60, duration: 1, ease: "power2.in" }, 0)
          .to(".canvas-wrap", { y: -80, duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(
            ".ai-section",
            { opacity: 0, y: 60, pointerEvents: "none" },
            { opacity: 1, y: 0, pointerEvents: "auto", duration: 1, ease: "power2.out" },
            0.3,
          );
      });
    },
    { scope: container },
  );

  return (
    <div id="home" ref={container} className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="pin-wrapper relative h-screen overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto flex flex-col items-center gap-6 px-6 lg:flex-row lg:gap-0">
            {/* 왼쪽: 히어로 텍스트 */}
            <div className="hero-text w-full shrink-0 space-y-4 lg:w-1/2 lg:space-y-6 lg:pr-8">
              <p className="hero-subtitle text-sm font-semibold tracking-widest text-cyan-400 uppercase">
                Full-Stack Developer
              </p>
              <h1 className="hero-title text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
                이성재
                <span className="mt-2 block bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-xl font-medium text-transparent sm:text-3xl lg:text-4xl">
                  Frontend &amp; Backend Developer
                </span>
              </h1>
              <p className="hero-desc max-w-md text-base leading-relaxed text-gray-400 sm:text-lg">
                사용자 경험을 최우선으로 생각하는 풀스택 개발자입니다.
                프론트엔드부터 백엔드까지, 완성도 높은 웹 서비스를 만듭니다.
              </p>
              <div className="hero-skills space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
                    Frontend
                  </span>
                  {frontendSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400/70">
                    Backend
                  </span>
                  {backendSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D 캔버스 (단일 Canvas) */}
            <div className="canvas-wrap w-full shrink-0 lg:w-1/2">
              <div className="mx-auto aspect-square max-w-[280px] sm:max-w-sm lg:max-w-lg">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Scene />
                </Canvas>
              </div>
            </div>

            {/* 오른쪽: AI 스킬 섹션 */}
            <div id="ai" className="ai-section pointer-events-none absolute inset-x-6 bottom-8 space-y-4 opacity-0 sm:space-y-6 lg:inset-x-auto lg:right-12 lg:bottom-auto lg:w-[45%]">
              <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase">
                AI-Driven Development
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                AI Skills
                <span className="mt-2 block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-medium text-transparent sm:text-2xl lg:text-3xl">
                  AI와 함께 개발하다
                </span>
              </h2>
              <p className="max-w-md text-base leading-relaxed text-gray-400 sm:text-lg">
                Claude Code를 메인 개발 도구로 활용합니다.
                CLAUDE.md로 프로젝트 컨텍스트를 체계적으로 설계하고,
                MCP 서버를 연동하여 외부 도구와 데이터를 연결하며,
                클로드 스킬(SKILL.md)을 직접 작성하여 반복 워크플로우를 자동화합니다.
              </p>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400/70">
                    Main
                  </span>
                  {aiMainSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-pink-400/70">
                    Sub
                  </span>
                  {aiSubSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-sm text-pink-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
