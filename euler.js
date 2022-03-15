// Euler's method variables
const h = 1 / 60 // Because frame rate is 60 fps => 1/60

// Iterate position and velocity according to Euler's method
// @param inV is current velocity, inP is current position, n is slot of spheres array
// @return outV is velocity of next frame, outP is position of next frame
function euler(inV, inP, n) {
    // Calculate acceleration accordint to ODE v' = (F-F_friction)/m
    const a = new THREE.Vector2((Force - Friction[n]) * Math.cos(tau[n]) / m, (Force - Friction[n]) * Math.sin(tau[n]) / m)

    // Iterate next velocity according to Euler's method
    const outV = new THREE.Vector2()
    outV.x = inV.x + a.x * h
    outV.y = inV.y + a.y * h

    // Iterate next position according to Euler's method
    const outP = new THREE.Vector2()
    outP.x = inP.x + outV.x * h
    outP.y = inP.y + outV.y * h

    // Test if ball should stop, then remove friction and set velocity to 0
    if (outV.x * Math.cos(tau[n]) < 0) {
        Friction[n] = 0
        outV.x = 0
        outV.y = 0
    }

    if (inV.length() == 0) {
        initialVelocity[n] = outV.length()
    }

    Force = 0 // Only force pushing the ball in the first frame, @TODO find a better solution?
    return [outV, outP]
}
