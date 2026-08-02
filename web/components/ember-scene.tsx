"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The ember scene.
 *
 * The delivered identity is pixel art — a blocky flame inside a dashed sync
 * frame — so the scene is built from voxels rather than smooth geometry. A
 * lathe-turned sphere next to that logo would read as two different brands.
 *
 * What is on screen is the product's one invariant, drawn literally. A voxel
 * ember sits at the centre. A pulse travels a dashed ring and hands the light
 * from node to node. Exactly one node is lit at a time, because exactly one
 * machine is ever authoritative.
 */

const NODE_COUNT = 3;
const RING_RADIUS = 1.95;
/** Seconds for the pulse to travel one full circuit of the ring. */
const CIRCUIT_SECONDS = 9;
/** Edge length of one voxel, in world units. */
const VOXEL = 0.105;

type Palette = {
  ember: THREE.Color;
  emberDeep: THREE.Color;
  emberBright: THREE.Color;
  emberCore: THREE.Color;
  ash: THREE.Color;
  cold: THREE.Color;
  gold: THREE.Color;
};

/**
 * Read the palette from the CSS custom properties defined in globals.css, so
 * the 3D scene and the page cannot drift apart. Falls back to the logo hexes
 * only if the stylesheet has not applied.
 */
function readPalette(): Palette {
  const fallback: Record<keyof Palette, string> = {
    ember: "#f27903",
    emberDeep: "#d34610",
    emberBright: "#fca91c",
    emberCore: "#fcd68d",
    ash: "#a7adb4",
    cold: "#5687b8",
    gold: "#f3b64a",
  };

  const varName: Record<keyof Palette, string> = {
    ember: "--color-ember",
    emberDeep: "--color-ember-deep",
    emberBright: "--color-ember-bright",
    emberCore: "--color-ember-core",
    ash: "--color-ash",
    cold: "--color-cold",
    gold: "--color-gold",
  };

  const styles =
    typeof window === "undefined"
      ? null
      : getComputedStyle(document.documentElement);

  const out = {} as Palette;
  for (const key of Object.keys(fallback) as (keyof Palette)[]) {
    const value = styles?.getPropertyValue(varName[key]).trim();
    out[key] = new THREE.Color(value || fallback[key]);
  }
  return out;
}

/** Angle of each node on the ring, evenly spaced, first one at the top. */
function nodeAngle(index: number) {
  return (index / NODE_COUNT) * Math.PI * 2 + Math.PI / 2;
}

/**
 * The flame, as a pixel map.
 *
 * Digits are shade steps on the logo's own ramp: 1 deep, 2 ember, 3 bright,
 * 4 pale core. A dot is empty. Read top row first.
 *
 * This is drawn rather than generated because a distance field produces a
 * blob — the mark's flame has a tapered tip and a wide base, and that shape is
 * the recognisable part.
 */
const FLAME = [
  "....1....",
  "...12....",
  "...123...",
  "..12331..",
  "..123321.",
  ".1233321.",
  ".1234321.",
  "112344211",
  "112344211",
  "112344211",
  ".11233211",
] as const;

/** How many voxels deep the flame is extruded. */
const FLAME_DEPTH = 3;

/**
 * The world core: a voxel ember built from FLAME.
 *
 * Extruded a few voxels deep, with the outer layers stepped one shade darker
 * so it rounds off instead of reading as a flat sticker.
 */
function VoxelEmber({ palette }: { palette: Palette }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  const cells = useMemo(() => {
    const out: { pos: THREE.Vector3; shade: number }[] = [];
    const rows = FLAME.length;
    const cols = FLAME[0].length;
    const halfZ = (FLAME_DEPTH - 1) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const char = FLAME[row][col];
        if (char === ".") continue;
        const shade = Number(char);

        for (let z = 0; z < FLAME_DEPTH; z += 1) {
          out.push({
            pos: new THREE.Vector3(
              (col - (cols - 1) / 2) * VOXEL,
              ((rows - 1) / 2 - row) * VOXEL,
              (z - halfZ) * VOXEL,
            ),
            /*
              Every layer keeps the map's full shade. Dimming by depth hid the
              pale core behind a darker front slice and flattened the whole
              flame to one brown mass; pixel art is flat-shaded anyway, and the
              lighting supplies the form.
            */
            shade,
          });
        }
      }
    }
    return out;
  }, []);

  // Colours are per-instance and never change, so write them once.
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();

    cells.forEach((cell, i) => {
      dummy.position.copy(cell.pos);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);

      const ramp = [
        palette.emberDeep, // 1
        palette.ember, // 2
        palette.emberBright, // 3
        palette.emberCore, // 4
      ];
      mesh.current!.setColorAt(i, ramp[cell.shade - 1] ?? palette.ember);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [cells, palette]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    /*
      The flame is a sprite with depth, so it must never turn edge-on — a full
      spin would flatten it to a line and lose the shape entirely. It sways
      instead, which also reads calmer than a rotating object.
    */
    group.current.rotation.y = Math.sin(t * 0.34) * 0.42;
    group.current.rotation.x = Math.sin(t * 0.22) * 0.07;
    // Breathe, never flicker.
    group.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.025);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[VOXEL, VOXEL, VOXEL]} />
        {/*
          No `vertexColors` here. InstancedMesh applies `instanceColor`
          automatically once setColorAt has run; turning on vertexColors makes
          the shader look for a per-vertex colour attribute that BoxGeometry
          does not have, and every cube falls back to one flat tone.
        */}
        <meshStandardMaterial
          emissive={palette.ember}
          emissiveIntensity={0.5}
          roughness={0.65}
          metalness={0}
          flatShading
        />
      </instancedMesh>

      <pointLight
        position={[0, 0, 0]}
        color={palette.ember}
        intensity={6}
        distance={5.5}
        decay={2}
      />
    </group>
  );
}

/**
 * The sync path the lease travels, drawn as a dashed ring of small cubes —
 * the same dashed frame the mark puts around its flame.
 */
function DashedRing({ palette }: { palette: Palette }) {
  const SEGMENTS = 48;

  const dashes = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < SEGMENTS; i += 1) {
      // Every third cube, so the ring reads as dashes rather than a line.
      if (i % 3 !== 0) continue;
      const angle = (i / SEGMENTS) * Math.PI * 2;
      out.push([Math.cos(angle) * RING_RADIUS, Math.sin(angle) * RING_RADIUS, 0]);
    }
    return out;
  }, []);

  return (
    <group>
      {dashes.map((position, i) => (
        <mesh key={i} position={position}>
          <boxGeometry args={[0.11, 0.11, 0.11]} />
          <meshBasicMaterial color={palette.ash} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * A machine on the ring. It lights when the pulse reaches it and cools after —
 * a host taking the world, then handing it on.
 */
function Node({ index, palette }: { index: number; palette: Palette }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const angle = useMemo(() => nodeAngle(index), [index]);

  const position = useMemo<[number, number, number]>(
    () => [Math.cos(angle) * RING_RADIUS, Math.sin(angle) * RING_RADIUS, 0],
    [angle],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Where the pulse is, as a fraction of the circuit.
    const pulse = (t % CIRCUIT_SECONDS) / CIRCUIT_SECONDS;
    const mine = index / NODE_COUNT;

    // Shortest distance around the loop between the pulse and this node.
    let d = Math.abs(pulse - mine);
    if (d > 0.5) d = 1 - d;

    // Warm sharply as the pulse arrives, cool gently as it leaves.
    const heat = Math.max(0, 1 - d * 6);

    if (material.current) {
      material.current.emissiveIntensity = 0.12 + heat * 1.4;
      material.current.color.lerpColors(palette.cold, palette.ember, heat);
      material.current.emissive.lerpColors(palette.cold, palette.emberBright, heat);
    }
    if (mesh.current) {
      mesh.current.scale.setScalar(1 + heat * 0.5);
      mesh.current.rotation.y = t * 0.4;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.17, 0.17, 0.17]} />
      <meshStandardMaterial
        ref={material}
        color={palette.cold}
        emissive={palette.cold}
        emissiveIntensity={0.12}
        roughness={0.5}
        flatShading
      />
    </mesh>
  );
}

/** The lease in flight. */
function Pulse({ palette }: { palette: Palette }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const angle = (t / CIRCUIT_SECONDS) * Math.PI * 2 + Math.PI / 2;
    mesh.current.position.set(
      Math.cos(angle) * RING_RADIUS,
      Math.sin(angle) * RING_RADIUS,
      0,
    );
    mesh.current.rotation.z = t * 0.8;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[0.085, 0.085, 0.085]} />
      <meshBasicMaterial color={palette.emberCore} />
    </mesh>
  );
}

/** Sparse embers drifting up. Continuity, not a fire. */
function Motes({ palette }: { palette: Palette }) {
  const points = useRef<THREE.Points>(null);
  /*
    Sparse and dim on purpose. At higher counts the motes are the same size
    and colour family as the ring dashes, and the ring stops reading as a
    ring.
  */
  const COUNT = 14;

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
      speeds[i] = 0.06 + Math.random() * 0.12;
    }
    return { positions, speeds };
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    // Clamp delta so a backgrounded tab does not teleport every mote on return.
    const step = Math.min(delta, 0.05);

    for (let i = 0; i < COUNT; i += 1) {
      array[i * 3 + 1] += speeds[i] * step;
      if (array[i * 3 + 1] > 3.6) {
        array[i * 3 + 1] = -3.6;
        array[i * 3] = (Math.random() - 0.5) * 9;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Untextured GL points render as squares, which suits the pixel art. */}
      <pointsMaterial
        color={palette.ember}
        size={0.035}
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Drift the whole rig toward the cursor, and sit it beside the copy rather
 * than under it.
 *
 * On wide screens the rig moves right of the headline column. On narrow ones
 * it centres and shrinks — there is no room beside anything, so it becomes a
 * backdrop behind the gradient instead.
 */
function Parallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { width } = useThree((state) => state.viewport);
  const wide = width > 8;

  const offsetX = wide ? width * 0.22 : 0;
  const scale = wide ? 0.92 : 0.66;

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.22 - group.current.rotation.y) * 0.03;
    group.current.rotation.x += (-y * 0.14 - group.current.rotation.x) * 0.03;
  });

  return (
    <group position={[offsetX, 0, 0]} scale={scale}>
      <group ref={group}>{children}</group>
    </group>
  );
}

export default function EmberScene() {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setPalette(readPalette());

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Wait for the palette so the first painted frame is already brand-correct.
  if (!palette) return null;

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={[1, 1.75]}
      /*
        Reduced motion still gets the scene — it just stops moving. A single
        rendered frame is a picture, and a picture is not a motion hazard.
      */
      frameloop={reduced ? "demand" : "always"}
      /*
        R3F applies ACES tone mapping by default, which desaturates the logo's
        orange into a washed tan. The palette is read from the brand tokens; it
        should render as those tokens.
      */
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 4]} intensity={0.6} color={palette.ash} />

      {/* Motes drift across the whole frame, so they stay outside the rig. */}
      <Motes palette={palette} />

      <Parallax>
        <VoxelEmber palette={palette} />
        <DashedRing palette={palette} />
        {Array.from({ length: NODE_COUNT }, (_, i) => (
          <Node key={i} index={i} palette={palette} />
        ))}
        <Pulse palette={palette} />
      </Parallax>
    </Canvas>
  );
}
