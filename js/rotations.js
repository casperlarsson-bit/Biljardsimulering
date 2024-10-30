import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'

let rotWorldMatrix
// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
	rotWorldMatrix = new THREE.Matrix4()
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians)

	// new code for Three.JS r55+:
	rotWorldMatrix.multiply(object.matrix) // pre-multiply

	object.matrix = rotWorldMatrix

	// code for r59+:
	object.rotation.setFromRotationMatrix(object.matrix)
}
// Code from https://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js

// To get a random number between min and max (int)
function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

export { rotateAroundWorldAxis }
