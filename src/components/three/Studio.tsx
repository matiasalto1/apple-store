'use client'

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/** Iluminación de estudio: entorno suave + luz principal cálida + contraluz. */
export function Studio({ envIntensity = 0.42, keyIntensity = 1.7 }: { envIntensity?: number; keyIntensity?: number }) {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = envIntensity
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene, envIntensity])

  return (
    <>
      <ambientLight intensity={0.12} color="#fff7ec" />
      <directionalLight position={[-4, 6, 5]} intensity={keyIntensity} color="#fff3e2" />
      <directionalLight position={[5, 3, -4]} intensity={0.9} color="#e6eef0" />
      <directionalLight position={[2, -1, 6]} intensity={0.25} color="#ffffff" />
    </>
  )
}
