import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'

import { scene, radius, width } from './main.js'

let poolTable
let poolCue
let billiardRoom

// Load billiard table from blender file
function loadGLTF() {
	const tableLoader = new GLTFLoader()
	// Load table
	tableLoader.load('./assets/pooltable.gltf', (gltf) => {
		const poolTable = gltf.scene
		scene.add(poolTable)
		poolTable.castShadow = true
		poolTable.receiveShadow = true
		poolTable.position.set(0.01, -radius, width / 2) // Position the table correctly and rotate
	})

	// Load cue
	const cueLoader = new GLTFLoader()
	cueLoader.load('./assets/poolcue.gltf', (gltf) => {
		poolCue = gltf.scene
		scene.add(poolCue)
		poolCue.castShadow = true
		poolCue.receiveShadow = true
		poolCue.position.set(0, 0, 0) // Position pool cue
		poolCue.rotation.set(0, 0, 0.2) // Rotate pool cue to look good
	})

	// Load room
	const roomLoader = new GLTFLoader()
	roomLoader.load('./assets/biljardRoom.gltf', (gltf) => {
		billiardRoom = gltf.scene
		scene.add(billiardRoom)
		billiardRoom.castShadow = true
		billiardRoom.receiveShadow = true
		billiardRoom.position.set(2, -0.25, 1)
	})
}

export { loadGLTF, poolTable, poolCue, billiardRoom }
