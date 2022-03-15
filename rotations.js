let rotWorldMatrix
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4()
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians)

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    rotWorldMatrix.multiply(object.matrix);               // pre-multiply

    object.matrix = rotWorldMatrix

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix)
}
// Code from https://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js


// To get a random number between min and max (int)
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}