import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const NeonEffect: React.FC = () => {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      let scene: THREE.Scene;
      let camera: THREE.PerspectiveCamera;
      let renderer: THREE.WebGLRenderer;
      let mesh: THREE.Mesh;
      let particles: THREE.Points;
      let material: THREE.ShaderMaterial;
      const particleCount = 8000;
      let positions: Float32Array;
      let speeds: Float32Array;
      let angles: Float32Array;
      let baseRadii: Float32Array;

      const initialize = () => {
         scene = new THREE.Scene();

         camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
         );
         camera.position.z = 2;

         renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
         });
         renderer.setSize(window.innerWidth, window.innerHeight);
         renderer.setPixelRatio(window.devicePixelRatio);
         if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
         }
      };

      const createScene = () => {
         material = new THREE.ShaderMaterial({
            uniforms: {
               uTime: { value: 0 },
            },
            vertexShader: `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              vec3 pos = position;
              pos.y += sin(pos.x * 2.0) * 0.05;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
            fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          void main() {
              float timeFactor = sin(uTime * 0.4) * 0.3 + 1.0;
              float bulgeFactor = 1.0 + 3.0 * smoothstep(0.0, 0.3, (0.3 - vUv.x));
              float midX = 0.5;
              float distFromMid = abs(vUv.x - midX);
              float midFactor = 1.0 + 1.2 * max(0.0, 1.0 - 2.5 * (distFromMid * distFromMid));
              float combinedFactor = bulgeFactor * midFactor * timeFactor;
              float baseCurve = mix(1.5, 0.2, pow(vUv.x, 0.4));
              float baseWidth = baseCurve * combinedFactor;
              float center = 0.5 + sin(uTime * 0.15 + vUv.x * 1.5) * 0.01;
              float dist = abs(vUv.y - center) / baseWidth;
              vec3 coreColor = vec3(0.8, 0.9, 1.0);
              vec3 glowColor = vec3(0.2, 0.4, 1.0);
              float core = exp(-dist * 100.0);
              float glow1 = exp(-dist * 50.0) * 0.4;
              float glow2 = exp(-dist * 25.0) * 0.3;
              float glow3 = exp(-dist * 12.5) * 0.2;
              float glow4 = exp(-dist * 6.25) * 0.1;
              float outerExpansion = 0.8 + 0.6 * timeFactor;
              float distOuter = dist / (1.0 + outerExpansion);
              float outerFade = smoothstep(0.0, 3.0, dist);
              float softGlow1 = exp(-distOuter * 3.0) * 0.07 * outerFade;
              float softGlow2 = exp(-distOuter * 1.5) * 0.05 * outerFade;
              float softGlow3 = exp(-distOuter * 0.7) * 0.03 * outerFade;
              float brightness = core + glow1 + glow2 + glow3 + glow4
                                + softGlow1 + softGlow2 + softGlow3;
              float verticalGrad = pow(1.0 - vUv.x, 2.0);
              brightness *= (1.0 + verticalGrad * 0.8);
              float colorMix = smoothstep(0.0, 1.0, dist);
              vec3 finalColor = mix(coreColor, glowColor, colorMix);
              float flicker = 1.0 + sin(uTime * 0.4) * 0.1;
              brightness *= flicker;
              gl_FragColor = vec4(finalColor * brightness, brightness);
          }
        `,
            transparent: true,
            blending: THREE.AdditiveBlending,
         });
      };

      const createMesh = () => {
         const geometry = new THREE.PlaneGeometry(5, 1.4, 200, 1); // Horizontal plane
         mesh = new THREE.Mesh(geometry, material);
         scene.add(mesh);
      };

      const createParticles = () => {
         positions = new Float32Array(particleCount * 3);
         speeds = new Float32Array(particleCount);
         angles = new Float32Array(particleCount);
         baseRadii = new Float32Array(particleCount);

         const baseRadius = 0.008;
         const radiusVariance = 0.006;

         for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * 5 - 3.0; // from -3 to 2
            const sineCoreY = Math.sin(x * 2.0) * 0.05;

            angles[i] = Math.random() * Math.PI * 2;

            const xFactor = (x + 3.0) / 5.0;
            const radiusScale = 1.0 - xFactor;
            const midSpread = 1.0 + 1.2 * Math.max(0, 1.0 - 0.5 * Math.abs(x + 0.5));
            const totalScale = radiusScale * 1.5 + midSpread;

            const r = baseRadius + Math.random() * radiusVariance;
            baseRadii[i] = r * totalScale * 0.25;

            const initY = sineCoreY + baseRadii[i] * Math.sin(angles[i]);
            const initZ = baseRadii[i] * Math.cos(angles[i]);

            positions[i * 3] = x;
            positions[i * 3 + 1] = initY;
            positions[i * 3 + 2] = initZ;

            speeds[i] = 0.003 + Math.random() * 0.002;
         }

         const geometry = new THREE.BufferGeometry();
         geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

         const particleTexture = makeRadialTexture();
         const particleMaterial = new THREE.PointsMaterial({
            size: 0.01,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.8,
         });

         particles = new THREE.Points(geometry, particleMaterial);
         scene.add(particles);
      };

      const makeRadialTexture = (): THREE.Texture => {
         const size = 32;
         const canvas = document.createElement("canvas");
         canvas.width = size;
         canvas.height = size;
         const ctx = canvas.getContext("2d")!;

         const gradient = ctx.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
         );
         gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
         gradient.addColorStop(0.3, "rgba(220, 230, 255, 0.5)");
         gradient.addColorStop(1, "rgba(200, 220, 255, 0)");

         ctx.fillStyle = gradient;
         ctx.fillRect(0, 0, size, size);

         const texture = new THREE.Texture(canvas);
         texture.needsUpdate = true;
         return texture;
      };

      const animate = () => {
         requestAnimationFrame(animate);
         material.uniforms.uTime.value += 0.016;

         for (let i = 0; i < particleCount; i++) {
            let x = positions[i * 3];
            x -= speeds[i];
            if (x < -3.0) {
               x = 2.0;
            }
            positions[i * 3] = x;

            angles[i] += 0.02;

            const coreY = Math.sin(x * 2.0) * 0.05;
            const angle = angles[i];
            const newY = coreY + baseRadii[i] * Math.sin(angle);
            const newZ = baseRadii[i] * Math.cos(angle);

            positions[i * 3 + 1] = newY;
            positions[i * 3 + 2] = newZ;
         }

         particles.geometry.attributes.position.needsUpdate = true;
         renderer.render(scene, camera);
      };

      const resize = () => {
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
         renderer.setSize(window.innerWidth, window.innerHeight);
      };

      // Initialize scene
      initialize();
      createScene();
      createMesh();
      createParticles();
      animate();

      // Event listeners
      window.addEventListener("resize", resize);

      // Cleanup on unmount
      return () => {
         window.removeEventListener("resize", resize);
         renderer.dispose();
         if (containerRef.current) {
            containerRef.current.innerHTML = ""; // Clear any leftover canvas
         }
      };
   }, []);

   return <div ref={containerRef} />;
};

export default NeonEffect;
