import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'


@Component({
  selector: 'app-three-js-page12',
  templateUrl: './three-js-page12.component.html',
  styleUrls: ['./three-js-page12.component.css']
})
export class ThreeJsPage12Component implements AfterViewInit {

  constructor() { }
    ngAfterViewInit(): void {
      // Debug
      const gui = new dat.GUI()

      // Canvas
      const canvas = document.querySelector('canvas.webgl')

      // Scene
      const scene = new THREE.Scene()

      /**
       * Loaders
       */
      const gltfLoader = new GLTFLoader()
      const cubeTextureLoader = new THREE.CubeTextureLoader()
      const textureLoader = new THREE.TextureLoader()

      /**
       * Update all materials
       */
      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
          }
        })
      }

      /**
       * Environment map
       */
      const environmentMap = cubeTextureLoader.load([
        '../../../assets/textures/environmentMaps/0/px.jpg',
        '../../../assets/textures/environmentMaps/0/nx.jpg',
        '../../../assets/textures/environmentMaps/0/py.jpg',
        '../../../assets/textures/environmentMaps/0/ny.jpg',
        '../../../assets/textures/environmentMaps/0/pz.jpg',
        '../../../assets/textures/environmentMaps/0/nz.jpg'
      ])
      environmentMap.encoding = THREE.sRGBEncoding

      scene.background = environmentMap
      scene.environment = environmentMap

      /**
       * Models
       */
      gltfLoader.load(
        '../../../assets/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (gltf) => {
          gltf.scene.scale.set(2, 2, 2)
          gltf.scene.rotation.y = Math.PI * 0.5
          scene.add(gltf.scene)

          updateAllMaterials()
        }
      )


      /**
       * Lights
       */
      const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.set(1024, 1024)
      directionalLight.shadow.camera.far = 15
      directionalLight.shadow.normalBias = 0.05
      directionalLight.position.set(0.25, 3, - 2.25)
      scene.add(directionalLight)

      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Update Effect Composer
        effectComposer.setSize(sizes.width, sizes.height)
        effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      })

      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
      camera.position.set(4, 1, - 4)
      scene.add(camera)

      /**
       * Renderer
       */
      const renderer:any = new THREE.WebGLRenderer({
        canvas: canvas!,
        antialias: true
      })
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap
      renderer.physicallyCorrectLights = true
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ReinhardToneMapping
      renderer.toneMappingExposure = 1.5
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



      // Post Processing

      // Render Target
      const renderTarget = new THREE.WebGLRenderTarget(
        800,
        600,
        {
          samples: renderer.getPixelRatio() === 1 ? 2 : 0
        }
      );





      const effectComposer = new EffectComposer(renderer, renderTarget);
      effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      effectComposer.setSize(sizes.width, sizes.height);


      const renderPass = new RenderPass(scene, camera);
      effectComposer.addPass(renderPass);

      const dotScreenPass = new DotScreenPass();
      dotScreenPass.enabled = false;
      effectComposer.addPass(dotScreenPass);

      const glitchPass = new GlitchPass();
      glitchPass.goWild = false;
      glitchPass.enabled = false;
      effectComposer.addPass(glitchPass);

      const rgbShiftPass = new ShaderPass(RGBShiftShader);
      rgbShiftPass.enabled = false;
      effectComposer.addPass(rgbShiftPass);


      const unrealBloomPass = new UnrealBloomPass(
        new THREE.Vector2(sizes.width, sizes.height),
        0.3,
        1,
        0.6)
      unrealBloomPass.enabled = false;
      effectComposer.addPass(unrealBloomPass)



      // Tint Pass
      const TintShader = {
        uniforms: {
          tDiffuse: {value: null}

        },
        vertexShader: `
      
            varying vec2 vUv;

            void main()
            {
              vec4 modelPosition = modelMatrix * vec4(position, 1.0);
              vec4 viewPosition = viewMatrix * modelPosition;
              vec4 projectedPosition = projectionMatrix * viewPosition;

              gl_Position = projectedPosition;
              vUv = uv;
            }
            `,
        fragmentShader: `
              uniform sampler2D tDiffuse;
              varying vec2 vUv;
              void main()
              {
                vec4 color = texture2D(tDiffuse, vUv);
                gl_FragColor = color;


              }
              `
      }

      const tintPass = new ShaderPass(TintShader);
      effectComposer.addPass(tintPass)
















      const gammeCorrectionShader = new ShaderPass(GammaCorrectionShader);
      effectComposer.addPass(gammeCorrectionShader)

      // SMAA Pass
      if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
        const smaaPass = new SMAAPass(600, 800);
        effectComposer.addPass(smaaPass);
      }



      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true

      // DAT GUI
      gui.add(unrealBloomPass, "enabled");
      gui.add(unrealBloomPass, "strength").min(0).max(10).step(0.1).name("unrealStrength");
      gui.add(unrealBloomPass, "radius").min(0).max(10).step(0.1).name("unrealRadius");
      gui.add(unrealBloomPass, "threshold").min(0).max(10).step(0.1).name("unrealThreshold");


      /**
       * Animate
       */
      const clock = new THREE.Clock()

      const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        // Update controls
        controls.update()

        // Render
        //renderer.render(scene, camera)
        effectComposer.render();

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
      }

      tick()
    }

}
