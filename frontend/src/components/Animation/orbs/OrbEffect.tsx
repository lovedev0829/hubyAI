import React, { useEffect } from "react";
import * as THREE from "three";

const OrbEffect: React.FC = () => {
   useEffect(() => {
      const container = document.getElementById("orb-container");
      if (!container) return;

      let scene: THREE.Scene;
      let camera: THREE.PerspectiveCamera;
      let renderer: THREE.WebGLRenderer;
      let orbs: THREE.Mesh[] = [];
      let time: number;

      const initialize = () => {
         scene = new THREE.Scene();
         camera = new THREE.PerspectiveCamera(
            75,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
         );
         camera.position.z = 5;

         renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
         });
         renderer.setSize(container.offsetWidth, container.offsetHeight);

         // Clear previous content and append the renderer
         container.innerHTML = "";
         container.appendChild(renderer.domElement);

         orbs = [];
         time = 0;
      };

      const createOrbs = () => {
         const orbMaterial = new THREE.ShaderMaterial({
            uniforms: {
               uTime: { value: 0 },
            },
            vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
            fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;

          void main() {
            vec2 center = vec2(0.5);
            float dist = length(vUv - center);
            float core = exp(-dist * 8.0);
            float mid = exp(-dist * 4.0);
            float outer = exp(-dist * 2.0);
            float glow = core + 0.6 * mid + 0.3 * outer;
            float edgeFade = 1.0 - smoothstep(0.0, 0.8, dist);
            float final = glow * edgeFade * (sin(uTime * 0.5) * 0.1 + 0.9);
            gl_FragColor = vec4(vec3(1.0, 0.8, 0.3) * final, final);
          }
        `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
         });

         const LARGE_ORB_COUNT = 3;
         const TOTAL_ORBS = 30;
         const LARGE_SIZE_MIN = 5.0;
         const LARGE_SIZE_RANGE = 8.0;
         const NORMAL_SIZE_MIN = 0.5;
         const NORMAL_SIZE_RANGE = 3.0;
         const POSITION_RANGE = 10;
         const Z_RANGE = -5;
         const SEGMENTS = 64;

         for (let i = 0; i < TOTAL_ORBS; i++) {
            const size =
               i < LARGE_ORB_COUNT
                  ? Math.random() * LARGE_SIZE_RANGE + LARGE_SIZE_MIN
                  : Math.random() * NORMAL_SIZE_RANGE + NORMAL_SIZE_MIN;

            const geometry = new THREE.CircleGeometry(size / 2, SEGMENTS);
            const orb = new THREE.Mesh(geometry, orbMaterial.clone());

            const posX = (Math.random() - 0.5) * POSITION_RANGE;
            const posY = (Math.random() - 0.5) * POSITION_RANGE;

            orb.position.set(posX, posY, Math.random() * Z_RANGE);

            orb.userData = {
               originalX: posX,
               originalY: posY,
               speedX: Math.random() * 0.4 - 0.2,
               speedY: Math.random() * 0.4 - 0.2,
               speedZ: Math.random() * 0.2 - 0.1,
               wobbleSpeed: Math.random() * 0.3 + 0.2,
               delay: Math.random() * Math.PI * 2,
               amplitude: Math.random() * 0.8 + 0.4,
            };

            orbs.push(orb);
            scene.add(orb);
         }
      };

      const animate = () => {
         requestAnimationFrame(animate);

         time = performance.now() * 0.001;

         for (const orb of orbs) {
            const userData = orb.userData as {
               originalX: number;
               originalY: number;
               speedX: number;
               speedY: number;
               speedZ: number;
               wobbleSpeed: number;
               delay: number;
               amplitude: number;
            };

            orb.position.x =
               userData.originalX +
               Math.sin(time * userData.speedX + userData.delay) * userData.amplitude +
               Math.cos(time * userData.wobbleSpeed) * 0.3;

            orb.position.y =
               userData.originalY +
               Math.sin(time * userData.speedY + userData.delay) * userData.amplitude +
               Math.sin(time * userData.wobbleSpeed) * 0.3;

            orb.position.z = Math.sin(time * userData.speedZ + userData.delay) * 0.5;

            (orb.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
         }

         renderer.render(scene, camera);
      };

      const resize = () => {
         const aspect = container.offsetWidth / container.offsetHeight;
         camera.aspect = aspect;
         camera.updateProjectionMatrix();
         renderer.setSize(container.offsetWidth, container.offsetHeight);
      };

      const startEffect = () => {
         initialize();
         createOrbs();
         animate();
         window.addEventListener("resize", resize);
      };

      startEffect();

      // Cleanup on unmount
      return () => {
         window.removeEventListener("resize", resize);
         container.innerHTML = ""; // Clear the container
         renderer.dispose();
      };
   }, []);

   return <div id="orb-container" className="w-full h-screen" />;
};

export default OrbEffect;
