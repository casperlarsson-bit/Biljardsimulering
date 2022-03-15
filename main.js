// Declare renderer, camera and create scene
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.3, 10000) // FOV, window ratio, near, far
const scene = new THREE.Scene()
const controls = new THREE.OrbitControls(camera, renderer.domElement) // create orbit controls
let poolTable
let poolCue
let billiardRoom
let ballTable

// Billiard ball properties
const radius = 0.0525
const m = 0.220
const g = 9.82
const my = 0.55
const theta = 0.02
const motionOfInertia = 5 / 7

// Billiard table inner size
const width = 2.24 * 2
const height = 1.12 * 2

// User player variables
const maxPower = 200
const minPower = 0
const forceChange = 10
const angleChange = Math.PI / 180

// Texture
const texLoader = new THREE.TextureLoader()

const size = 0.5
const geometryPosters = new THREE.PlaneGeometry(3 * size, 4 * size) // 4:3 aspect ratio for pics
const posterMaterials = Array.from({ length: 8 }, () => (new THREE.MeshStandardMaterial({})))
const posters = []

let posterCounter = 0

// Create meshes for posters as planes
for (let i = 0; i < posterMaterials.length; ++i) {
  posterMaterials[i].map = texLoader.load('textures/poster' + i + '.jpg') // jpeg

  posters.push(new THREE.Mesh(geometryPosters, posterMaterials[i]))
  posters[i].castShadow = true
  posters[i].receiveShadow = true
  scene.add(posters[i])
}

// Position posters, 4 on each side
for (let i = 0; i < posterMaterials.length / 2; ++i) {
  posters[i].position.set(posterCounter - 2, 1.5, -4.1)
  posterCounter += 3
}

let posterConuter2 = 0

for (let i = posterMaterials.length / 2; i < posterMaterials.length; ++i) {
  posters[i].rotation.y = Math.PI
  posters[i].position.set(posterConuter2 - 2, 1.5, 6.05)
  posterConuter2 += 3
}

// Create sphere and its properties
const geometryBall = new THREE.SphereGeometry(radius, 42, 42) // Radius, width Segments, height Segments
const materials = Array.from({ length: 16 }, () => (new THREE.MeshStandardMaterial({}))) // Create array with material compability for balls

// create empty array for balls
const spheres = []

// Initialize each ball and add texture to it and add it to the scene
// Let shadows cast and fall from/on balls
for (let i = 0; i < materials.length; ++i) {
  materials[i].map = texLoader.load('textures/' + i + '.jpg') // Set texture from file, file must be named as the number of the ball, white ball is 0

  spheres.push(new THREE.Mesh(geometryBall, materials[i]))
  spheres[i].castShadow = true
  spheres[i].receiveShadow = true
  spheres[i].rotation.set(2 * Math.PI * Math.random(), 2 * Math.PI * Math.random(), 2 * Math.PI * Math.random())
  scene.add(spheres[i])
}

// Since shadows don't want to work on the table a plane is created in level with the table
// to make shadows fall on it. If solution of real shadows is found, remove this!
// The plane is invisible except where shadows are created, ShadowMaterial
const planeGeometry = new THREE.PlaneGeometry(width + 4 * radius, height + 4 * radius, 32, 32)
const planeMaterial = new THREE.ShadowMaterial({})
const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial)
shadowPlane.receiveShadow = true
shadowPlane.rotation.x = -Math.PI / 2
shadowPlane.position.set(width / 2, -0.05, height / 2)
scene.add(shadowPlane)

// Work around to make table cast shadows, same reason as above
const length = height, width2 = width

const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width2)
shape.lineTo(length, width2)
shape.lineTo(length, 0)
shape.lineTo(0, 0)

const extrudeSettings = {
  steps: 2,
  depth: length,
  bevelEnabled: true,
  bevelThickness: 0.3,
  bevelSize: 0.5,
  bevelOffset: 0,
  bevelSegments: 10
}

const tableBlockGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings) //new THREE.BoxGeometry(width*1.1, 0.3, height*1.1)
const tableBlockMaterial = new THREE.ShadowMaterial({})
const tableBlock = new THREE.Mesh(tableBlockGeometry, tableBlockMaterial)
tableBlock.castShadow = true
tableBlock.rotation.z = -Math.PI / 2
tableBlock.scale.set(0.1, 0.9, 0.91)
tableBlock.position.set(0.25, -0.2, 0.06)
scene.add(tableBlock)

const floorShadowGeometry = new THREE.PlaneGeometry(8, 4, 1)
const floorShadowMaterial = new THREE.ShadowMaterial({})
floorShadowMaterial.opacity = 0.4
floorShadowMaterial.transparent = true
const floorShadow = new THREE.Mesh(floorShadowGeometry, floorShadowMaterial)
floorShadow.rotation.x = -Math.PI / 2
floorShadow.receiveShadow = true
floorShadow.position.set(width / 2, -1.6, height / 2)
scene.add(floorShadow)

// Velocity and position vectors of the first ball
const v = new Array(spheres.length).fill(new THREE.Vector2(0, 0))
const p = [new THREE.Vector2(width / 6, height / 2)]

// Create the standard billiard setup
const row = 5
const space = 2.2
let nrow = 0
for (let n = 1; n <= row; ++n) {
  ++nrow
  for (let m = 1; m <= nrow; ++m) {
    p.push(new THREE.Vector2(2 / 3 * width + (nrow) * radius * space, height / 2 + space / 2 * (nrow - 1) * radius - space * radius * (m - 1)))
  }
}

const standPosition = [...p]

// Each ball's friction
const Friction = new Array(spheres.length).fill(0)
Friction[0] = m * g * my

// Declaration of first velocity balls get and the position of the previous iteration
const initialVelocity = new Array(spheres.length).fill(0)
const prevPosition = new Array(spheres.length).fill(0)

// Create the array with ball angles
const tau = new Array(spheres.length).fill(0)
tau[0] = -Math.PI / 180 * (0)

// Initial Force on the first ball, move? Later in the UI
let Force = 200 * 0
let Force_temp = 100
let firstBall = true

// Load the billiard table
loadGLTF()

// The render loop
function render() {

  // Loop through each ball
  for (let i = 0; i < spheres.length; ++i) {
    prevPosition[i] = p[i]

    // Iterate position and velocity
    const eulerOut = euler(v[i], p[i], i)
    v[i] = eulerOut[0]
    p[i] = eulerOut[1]

    // Edge collision
    const edgeOut = edgeDetection(p[i], prevPosition[i], v[i], i)
    v[i] = edgeOut[0]
    p[i] = edgeOut[1]

    // Ball collision
    for (let j = i + 1; j < spheres.length; ++j) {
      ballOut = ballCollision(v[i], v[j], p[i], p[j], prevPosition[i], prevPosition[j], i, j)
      v[i] = ballOut[0]
      v[j] = ballOut[1]
      p[i] = ballOut[2]
      p[j] = ballOut[3]
    }

    // Store initial velocity for the first ball, could be a better way?
    if (firstBall) {
      initialVelocity[i] = v[i].length()
      firstBall = false
    }

    // Go over to rolling friction when velocity goes under 5/7
    if (v[i].length() < motionOfInertia * initialVelocity[i] && v[i].length() != 0) {
      Friction[i] = motionOfInertia * m * g * theta // Rolling
      const rotVector = new THREE.Vector3(v[i].y, 0, -v[i].x) // Vector perpendicular https://mathworld.wolfram.com/PerpendicularVector.html
      rotateAroundWorldAxis(spheres[i], rotVector, v[i].length() / radius * h) // Rotate as ball is moving, v = wr
    }
    else if (v[i].length() > motionOfInertia * initialVelocity[i]) {
      Friction[i] = m * g * my // Sliding
    }

    // render pool cue if all balls are stationary
    if (v.reduce((partialSum, a) => partialSum + a.length(), 0) == 0 && i == spheres.length - 1 && poolCue) {
      poolCue.visible = true
      poolCue.position.set(p[0].x - Force_temp / 1000 * Math.cos(tau[0]), 0.01, p[0].y - Force_temp / 1000 * Math.sin(tau[0]))
      poolCue.rotation.y = Math.PI - tau[0]
    }

    // Handle user inputs to play
    userInputs(i)

    // OBS! Balls move along x- and z axes, table is in x,y
    spheres[i].position.x = p[i].x
    spheres[i].position.z = p[i].y
  }
  renderer.render(scene, camera)
}

function animate() {
  controls.update() // update camera position for OrbitControls
  setTimeout(function () { // setTimeout to limit fps
    requestAnimationFrame(animate)

  }, 1000 * h)
  setTimeout(function () { // Set timeout because of the time it takes to load the billiard table, can be removed when UI exists
    render()
  }, 20)
}

// Call needed functions
init()
setLight()
animate()
