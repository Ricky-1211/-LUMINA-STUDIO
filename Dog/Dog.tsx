import React, { useEffect, useRef, useMemo } from 'react'
import * as THREE from "three"
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { GLTF } from 'three-stdlib'

// Register GSAP plugins outside the component
gsap.registerPlugin(ScrollTrigger)

// Define types for the custom uniforms
interface DogMaterialUniforms {
  uMatcap1: { value: THREE.Texture | null }
  uMatcap2: { value: THREE.Texture | null }
  uProgress: { value: number }
}

// Extend THREE.MeshMatcapMaterial to include onBeforeCompile
interface ExtendedMatcapMaterial extends THREE.MeshMatcapMaterial {
  onBeforeCompile?: (parameters: THREE.Shader, renderer: THREE.WebGLRenderer) => void;
}

const Dog: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)

  const model = useGLTF("/models/dog.drc.glb") as GLTF & {
    scene: THREE.Group
    animations: THREE.AnimationClip[]
  }

  const { gl, camera } = useThree()

  // Configure Three.js renderer and camera on mount
  useEffect(() => {
    camera.position.z = 0.55
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl, camera])

  const { actions } = useAnimations(model.animations, model.scene)

  useEffect(() => {
    const action = actions["Take 001"]
    if (action) {
      action.play()
    }
  }, [actions])

  // Normal map texture
  const [normalMap] = useTexture(["/dog_normals.jpg"]).map(texture => {
    texture.flipY = false
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  // Branch textures
  const [branchMap, branchNormalMap] = useTexture([
    "/branches_diffuse.jpeg",
    "/branches_normals.jpeg"
  ]).map(texture => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  // Matcap textures
  const matcaps = useTexture([
    "/matcap/mat-1.png", "/matcap/mat-2.png", "/matcap/mat-3.png", "/matcap/mat-4.png", "/matcap/mat-5.png",
    "/matcap/mat-6.png", "/matcap/mat-7.png", "/matcap/mat-8.png", "/matcap/mat-9.png", "/matcap/mat-10.png",
    "/matcap/mat-11.png", "/matcap/mat-12.png", "/matcap/mat-13.png", "/matcap/mat-14.png", "/matcap/mat-15.png",
    "/matcap/mat-16.png", "/matcap/mat-17.png", "/matcap/mat-18.png", "/matcap/mat-19.png", "/matcap/mat-20.png",
  ])

  matcaps.forEach(texture => {
    texture.colorSpace = THREE.SRGBColorSpace
  })

  const [
    mat1, mat2, mat3, mat4, mat5,
    mat6, mat7, mat8, mat9, mat10,
    mat11, mat12, mat13, mat14, mat15,
    mat16, mat17, mat18, mat19, mat20
  ] = matcaps

  // Material uniforms ref
  const materialUniforms = useRef<DogMaterialUniforms>({
    uMatcap1: { value: mat19 },
    uMatcap2: { value: mat2 },
    uProgress: { value: 1.0 }
  })

  // Create materials using useMemo for performance
  const { dogMaterial, branchMaterial } = useMemo(() => {
    const dogMat = new THREE.MeshMatcapMaterial({
      normalMap: normalMap,
      matcap: mat2
    }) as ExtendedMatcapMaterial

    const branchMat = new THREE.MeshMatcapMaterial({
      normalMap: branchNormalMap,
      map: branchMap
    }) as ExtendedMatcapMaterial

    dogMat.onBeforeCompile = (shader) => {
      shader.uniforms.uMatcapTexture1 = materialUniforms.current.uMatcap1
      shader.uniforms.uMatcapTexture2 = materialUniforms.current.uMatcap2
      shader.uniforms.uProgress = materialUniforms.current.uProgress

      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
      )

      shader.fragmentShader = shader.fragmentShader.replace(
        "vec4 matcapColor = texture2D( matcap, uv );",
        `
        vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
        vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
        float transitionFactor  = 0.2;
        
        float progress = smoothstep(uProgress - transitionFactor, uProgress, (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5);

        vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);
        `
      )
    }

    return { dogMaterial: dogMat, branchMaterial: branchMat }
  }, [normalMap, branchMap, branchNormalMap, mat2])

  // Apply materials to model once
  useEffect(() => {
    model.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.includes("DOG")) {
          child.material = dogMaterial
        } else {
          child.material = branchMaterial
        }
      }
    })
  }, [model.scene, dogMaterial, branchMaterial])

  // GSAP animation
  useGSAP(() => {
    if (!groupRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-3",
        start: "top top",
        end: "bottom bottom",
        markers: false,
        scrub: true,
        invalidateOnRefresh: true
      }
    })

    tl
      .to(groupRef.current.position, {
        z: "-=0.75",
        y: "+=0.1",
        duration: 1
      })
      .to(groupRef.current.rotation, {
        x: `+=${Math.PI / 15}`,
        duration: 1
      })
      .to(groupRef.current.rotation, {
        y: `-=${Math.PI}`,
        duration: 1
      }, "third")
      .to(groupRef.current.position, {
        x: "-=0.5",
        z: "+=0.6",
        y: "-=0.05",
        duration: 1
      }, "third")

    // Cleanup happens automatically with useGSAP
  }, { dependencies: [model.scene] })

  // Mouse event listeners for material transitions
  useEffect(() => {
    const handleMouseEnter = (selector: string, matcapTexture: THREE.Texture) => {
      const element = document.querySelector(selector)
      if (!element) return

      const handler = () => {
        materialUniforms.current.uMatcap1.value = matcapTexture
        gsap.to(materialUniforms.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialUniforms.current.uMatcap2.value = materialUniforms.current.uMatcap1.value
            materialUniforms.current.uProgress.value = 1.0
          }
        })
      }

      element.addEventListener('mouseenter', handler)
      return () => element.removeEventListener('mouseenter', handler)
    }

    const handleMouseLeave = (selector: string) => {
      const element = document.querySelector(selector)
      if (!element) return

      const handler = () => {
        materialUniforms.current.uMatcap1.value = mat2
        gsap.to(materialUniforms.current.uProgress, {
          value: 0.0,
          duration: 0.3,
          onComplete: () => {
            materialUniforms.current.uMatcap2.value = materialUniforms.current.uMatcap1.value
            materialUniforms.current.uProgress.value = 1.0
          }
        })
      }

      element.addEventListener('mouseleave', handler)
      return () => element.removeEventListener('mouseleave', handler)
    }

    // Setup event listeners
    const cleanups: (void | (() => void))[] = [
      handleMouseEnter('.title[img-title="tomorrowland"]', mat19),
      handleMouseEnter('.title[img-title="navy-pier"]', mat8),
      handleMouseEnter('.title[img-title="msi-chicago"]', mat9),
      handleMouseEnter('.title[img-title="phone"]', mat12),
      handleMouseEnter('.title[img-title="kikk"]', mat10),
      handleMouseEnter('.title[img-title="kennedy"]', mat8),
      handleMouseEnter('.title[img-title="opera"]', mat13),
      handleMouseLeave('.titles')
    ]

    return () => {
      cleanups.forEach(cleanup => {
        if (typeof cleanup === 'function') cleanup()
      })
    }
  }, [mat2, mat8, mat9, mat10, mat12, mat13, mat19])

  return (
    <group
      ref={groupRef}
      position={[0.25, -0.55, 0]}
      rotation={[0, Math.PI / 3.9, 0]}
    >
      <primitive object={model.scene} />
      <directionalLight
        position={[0, 5, 5]}
        color={0xFFFFFF}
        intensity={10}
      />
    </group>
  )
}

export default Dog