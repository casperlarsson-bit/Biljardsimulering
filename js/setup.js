import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

import { scene, camera, width, height, controls, renderer } from './main.js'

// Set up camera and background of the scene
function init() {
	scene.background = new THREE.Color('pink')

	camera.position.set(width / 2, 2, height / 2) // Place camera in the middle of the table and 2 units above
	controls.target = new THREE.Vector3(width / 2, 0, height / 2) // Point camera at center of table
	controls.enablePan = false // false removes ability to pan the camera
	controls.maxDistance = 4.5 // max zoom out, inf is max
	controls.minDistance = 3 // max zoom in, 0 is min
	controls.maxPolarAngle = Math.PI / 2.3 // max angle rotation
	controls.saveState() // save position to be able to get here later

	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
}

// Set up ambient and a point light to the scene
function setLight() {
	const light = new THREE.AmbientLight(0xffffff, 0.2) // soft white light; color, intensity
	scene.add(light)
	const pointLight = new THREE.PointLight(0xffffff, 1, 0) // Color, near, far
	pointLight.position.set(width / 2, 3, height / 2) // Position the point light
	pointLight.shadow.mapSize.width = 1024 // Shadow quality
	pointLight.shadow.mapSize.height = 1024
	pointLight.castShadow = true
	scene.add(pointLight)
}

export { init, setLight }
