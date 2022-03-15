// Load billiard table from blender file
function loadGLTF() {
    const tableLoader = new THREE.GLTFLoader()
    // Load table
    tableLoader.load('./assets/pooltable.gltf', (gltf) => {
        poolTable = gltf.scene
        scene.add(poolTable)
        poolTable.castShadow = true
        poolTable.receiveShadow = true
        poolTable.position.set(0.01   , -radius, width / 2) // Position the table correctly and rotate
    })

    // Load cue
    const cueLoader = new THREE.GLTFLoader()
    cueLoader.load('./assets/poolcue.gltf', (gltf) => {
        poolCue = gltf.scene
        scene.add(poolCue)
        poolCue.castShadow = true
        poolCue.receiveShadow = true
        poolCue.position.set(0, 0, 0) // Position pool cue
        poolCue.rotation.set(0, 0, 0.2) // Rotate pool cue to look good
    })
    
    // Load room
    const roomLoader = new THREE.GLTFLoader()
    roomLoader.load('./assets/biljardRoom.gltf', (gltf) => {
        billiardRoom = gltf.scene
        scene.add(billiardRoom)
        billiardRoom.castShadow = true
        billiardRoom.receiveShadow = true
        billiardRoom.position.set(2, -0.25, 1)
    })

}
