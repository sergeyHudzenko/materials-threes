import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

console.log(RGBELoader)

/**
 * Debug
 */
const gui = new GUI() 

const textureLoader = new THREE.TextureLoader()
const tex = (path) => textureLoader.load(`${import.meta.env.BASE_URL}${path}`)

const doorColorTexture = tex('textures/door/color.jpg')
const doorAlphaTexture = tex('textures/door/alpha.jpg')
const doorHeightTexture = tex('textures/door/height.jpg')
const doorNormalTexture = tex('textures/door/normal.jpg')
const doorAmbientOcclusionTexture = tex('textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = tex('textures/door/metalness.jpg')
const doorRoughnessTexture = tex('textures/door/roughness.jpg')
const matcapTexture = tex('textures/matcaps/3.png')
const gradientTexture = tex('textures/gradients/3.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Shapes
 */
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture })
const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture
material.color = new THREE.Color('red')
material.transparent = true
material.opacity = 0.5
material.alphaMap = doorAlphaTexture
material.side = THREE.DoubleSide

// normal material
const normalMaterial = new THREE.MeshNormalMaterial()
// normalMaterial.wireframe = true
normalMaterial.flatShading = true

// mesh matcap material
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

// Mesh Depth material
const depthMaterial = new THREE.MeshDepthMaterial()

// Mesh Lamber Material
const lambertMaterial = new THREE.MeshLambertMaterial()

// Mesh Phong Material
const phongMaterial = new THREE.MeshPhongMaterial()
phongMaterial.shininess = 100
phongMaterial.specular = new THREE.Color('red')

const meshToonMaterial = new THREE.MeshToonMaterial()
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false
meshToonMaterial.side = THREE.DoubleSide
meshToonMaterial.gradientMap = gradientTexture

// Mesh Standard Material
const debbugObg = {
    normalMap: true,
    displacementMap: true,
    isClearcoat: true,
    isSheen: true,
    isIridesscence: true,
    isTransmission: true,

    isPhysical: true,
}


const standardMaterial = new THREE.MeshStandardMaterial()
standardMaterial.side = THREE.DoubleSide
standardMaterial.roughness = 1
standardMaterial.metalness = 1
standardMaterial.map = doorColorTexture
standardMaterial.aoMap = doorAmbientOcclusionTexture
standardMaterial.aoMapIntensity = 1
standardMaterial.displacementMap = debbugObg.displacementMap ? doorHeightTexture : null
standardMaterial.displacementScale = 0.1
standardMaterial.metalnessMap = doorMetalnessTexture
standardMaterial.roughnessMap = doorRoughnessTexture
standardMaterial.normalMap = debbugObg.normalMap ? doorNormalTexture : null
standardMaterial.normalScale.set(1, 1)
standardMaterial.transparent = true
standardMaterial.alphaMap =  standardMaterial.transparent ? doorAlphaTexture : null

gui.add(standardMaterial, 'roughness').min(0).max(1).step(0.001)
gui.add(standardMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(standardMaterial, 'aoMapIntensity').min(0).max(1).step(0.001)
gui.add(standardMaterial, 'displacementScale').min(0).max(1).step(0.001)
gui.add(standardMaterial, 'transparent').onChange(() => {
    standardMaterial.alphaMap = standardMaterial.transparent ? doorAlphaTexture : null
    standardMaterial.needsUpdate = true
})
gui.add(debbugObg, 'normalMap').onChange(() => {
    // refresh the material
    standardMaterial.normalMap = debbugObg.normalMap ? doorNormalTexture : null
    standardMaterial.needsUpdate = true
})
gui.add(debbugObg, 'displacementMap').onChange(() => {
    // refresh the material
    standardMaterial.displacementMap = debbugObg.displacementMap ? doorHeightTexture : null
    standardMaterial.needsUpdate = true
})


// Mesh Physical Material
const physicalMaterial = new THREE.MeshPhysicalMaterial()
physicalMaterial.side = THREE.DoubleSide
physicalMaterial.roughness = 1
physicalMaterial.metalness = 1
physicalMaterial.map = doorColorTexture
physicalMaterial.aoMap = doorAmbientOcclusionTexture
physicalMaterial.aoMapIntensity = 1
physicalMaterial.displacementMap = debbugObg.displacementMap ? doorHeightTexture : null
physicalMaterial.displacementScale = 0.1
physicalMaterial.metalnessMap = doorMetalnessTexture
physicalMaterial.roughnessMap = doorRoughnessTexture
physicalMaterial.normalMap = debbugObg.normalMap ? doorNormalTexture : null
physicalMaterial.normalScale.set(1, 1)
physicalMaterial.transparent = true
physicalMaterial.alphaMap =  physicalMaterial.transparent ? doorAlphaTexture : null

gui.add(physicalMaterial, 'roughness').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'aoMapIntensity').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'displacementScale').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'transparent').onChange(() => {
    physicalMaterial.alphaMap = physicalMaterial.transparent ? doorAlphaTexture : null
    physicalMaterial.needsUpdate = true
})
gui.add(debbugObg, 'normalMap').onChange(() => {
    // refresh the material
    physicalMaterial.normalMap = debbugObg.normalMap ? doorNormalTexture : null
    physicalMaterial.needsUpdate = true
})
gui.add(debbugObg, 'displacementMap').onChange(() => {
    // refresh the material
    physicalMaterial.displacementMap = debbugObg.displacementMap ? doorHeightTexture : null
    physicalMaterial.needsUpdate = true
})

// Clearcoat

physicalMaterial.clearcoat = debbugObg.isClearcoat ? 1 : null
physicalMaterial.clearcoatRoughness = debbugObg.isClearcoat ? 0 : null

gui.add(debbugObg, 'isClearcoat').onChange(() => {
    physicalMaterial.clearcoat = debbugObg.isClearcoat ? 1 : null
    physicalMaterial.clearcoatRoughness = debbugObg.isClearcoat ? 0 : null
    physicalMaterial.needsUpdate = true
}) 
gui.add(physicalMaterial, 'clearcoat').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'clearcoatRoughness').min(0).max(1).step(0.001)

// Sheen
physicalMaterial.sheen = debbugObg.isSheen ? 1 : null
physicalMaterial.sheenRoughness = debbugObg.isSheen ? 0 : null

gui.add(debbugObg, 'isSheen').onChange(() => {
    physicalMaterial.sheen = debbugObg.isSheen ? 1 : null
    physicalMaterial.sheenRoughness = debbugObg.isSheen ? 0 : null
    physicalMaterial.needsUpdate = true
})
gui.add(physicalMaterial, 'sheen').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'sheenRoughness').min(0).max(1).step(0.001)


// Iridesscence
physicalMaterial.iridescence = debbugObg.isIridesscence ? 1 : null
physicalMaterial.iridescenceIOR = debbugObg.isIridesscence ? 1.5 : null

gui.add(debbugObg, 'isIridesscence').onChange(() => {
    physicalMaterial.iridescence = debbugObg.isIridesscence ? 1 : null
    physicalMaterial.iridescenceIOR = debbugObg.isIridesscence ? 1.5 : null
    physicalMaterial.needsUpdate = true
})
gui.add(physicalMaterial, 'iridescence').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'iridescenceIOR').min(1).max(2.3333).step(0.001)


const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100 , 100)
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 64)

// Transmission
physicalMaterial.transmission = debbugObg.isTransmission ? 1 : null
physicalMaterial.ior = debbugObg.isTransmission ? 1.5 : null
physicalMaterial.thickness = debbugObg.isTransmission ? 1 : null

gui.add(debbugObg, 'isTransmission').onChange(() => {
    physicalMaterial.transmission = debbugObg.isTransmission ? 1 : null
    physicalMaterial.transmissionRoughness = debbugObg.isTransmission ? 0 : null
    physicalMaterial.needsUpdate = true
})
gui.add(physicalMaterial, 'transmission').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'ior').min(1).max(2.3333).step(0.001)
gui.add(physicalMaterial, 'thickness').min(0).max(1).step(0.001)


// Roughness

gui.add(physicalMaterial, 'roughness').min(0).max(1).step(0.001)
gui.add(physicalMaterial, 'metalness').min(0).max(1).step(0.001)

 


gui.add(debbugObg, 'isPhysical').onChange(() => {
    if (debbugObg.isPhysical) {
        physicalMaterial.visible = true
        physicalMaterial.needsUpdate = true
    } else {
        physicalMaterial.visible = false
        physicalMaterial.needsUpdate = true
    }
})

const mesh1 = new THREE.Mesh(planeGeometry, standardMaterial)
const mesh2 = new THREE.Mesh(sphereGeometry, standardMaterial)
const mesh3 = new THREE.Mesh(torusGeometry, standardMaterial)

const mesh4 = new THREE.Mesh(planeGeometry, physicalMaterial)
const mesh5 = new THREE.Mesh(sphereGeometry, physicalMaterial)
const mesh6 = new THREE.Mesh(torusGeometry, physicalMaterial)

mesh2.position.x = -2
mesh3.position.x = 2

mesh4.position.set(-2, -2, 0)
mesh5.position.set(2, -2, 0)
mesh6.position.set(0, -2, 0)

scene.add(mesh1, mesh2, mesh3, mesh4, mesh5, mesh6)

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1, 10)
pointLight.position.set(2, 3, 4)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 3, 4)
scene.add(directionalLight)
// scene.add(pointLight)

const rgbeloader = new RGBELoader()
rgbeloader.load(`${import.meta.env.BASE_URL}textures/environmentMap/2k.hdr`, (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    mesh1.rotation.y = 0.1 * elapsedTime
    mesh2.rotation.y = 0.1 * elapsedTime
    mesh3.rotation.y = 0.1 * elapsedTime

    mesh1.rotation.x = -0.15 * elapsedTime
    mesh2.rotation.x = -0.15 * elapsedTime
    mesh3.rotation.x = -0.15 * elapsedTime

    mesh4.rotation.y = 0.1 * elapsedTime
    mesh5.rotation.y = 0.1 * elapsedTime
    mesh6.rotation.y = 0.1 * elapsedTime

    mesh4.rotation.x = -0.15 * elapsedTime
    mesh5.rotation.x = -0.15 * elapsedTime
    mesh6.rotation.x = -0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()