let counter = 0 // Counter to place the balls
let rowCounter = 0

// Detect if the ball is colliding with a wall or goes into a hole
// Then it mirrors the velocity in that axis, or teleport the ball to the side
// @param inP is the current position, prevPos is the position from last iteration, inV is the current velocity, n is the slot in the spheres array
// @return outV is the velocity after edge collision, or the same, outP is the position after edge collision
function edgeDetection(inP, prevPos, inV, n) {
    // Non elastic collision
    const elast = 0.5

    // Declare out variables
    let outV = new THREE.Vector2()
    let outP = new THREE.Vector2()

    // Test if ball goes in hole, then teleport en remove velocity
    if (inP.distanceTo(new THREE.Vector2(0, -2 * radius)) <= 2.9 * radius || (inP.distanceTo(new THREE.Vector2(width + 2 * radius, -2 * radius)) <= 2.9 * radius ||
        (inP.distanceTo(new THREE.Vector2(width + 2 * radius, height)) <= 2.9 * radius)) || (inP.distanceTo(new THREE.Vector2(0, height)) <= 2.9 * radius) ||
        (inP.distanceTo(new THREE.Vector2(width / 2 + radius, -2 * radius)) <= 3.5 * radius / 2) || (inP.distanceTo(new THREE.Vector2(width / 2 + radius, height)) <= 3.5 * radius / 2)) {
        if (n == 0) {
            // If white ball goes in, do something different
            outP = new THREE.Vector2(width / 6, height / 2)
            out = new THREE.Vector2(0, 0)
            Friction[n] = 0
        }
        else {
            // Regular ball goes into hole
            outP = new THREE.Vector2(5 + rowCounter, counter + 0.5)
            out = new THREE.Vector2(0, 0)
            Friction[n] = 0
            counter += 2.5 * radius
            spheres[n].rotation.set(0, 0, 1 * Math.PI / 3)

            if (counter / (2.5 * radius) > 8) {
                rowCounter = 2.5 * radius
                counter = 0
            }


        }
    }
    // Ball collides with top or bottom
    else if ((inP.y >= height - radius || inP.y <= -radius) && (inP.x < width / 2 + radius - 3.5 * radius / 2 || inP.x > width / 2 + radius + 3.5 * radius / 2)) {
        outV = new THREE.Vector2(elast * inV.x, -elast * inV.y)
        outP = prevPos
        tau[n] = -tau[n] // See note for proof

    }
    // Ball collides left or right
    else if (inP.x >= width + radius || inP.x <= radius) {
        outV = new THREE.Vector2(-elast * inV.x, elast * inV.y)
        outP = prevPos
        tau[n] = Math.PI - tau[n] // See note for proof

    }
    // Do nothing
    else {
        outV = inV
        outP = inP
    }

    return [outV, outP]
}


// Two balls collide with each other
// @param v1 and v2 are current velocity of the balls, p1 and p2 are current positions of the balls, prevPos1-2 are positions of the two balls from last iteration, n and k are the slots in the spheres array
// @return outV1 and outV2 are the velocity after collision, outP1 and outP2 are the positions after collision
function ballCollision(v1, v2, p1, p2, prevPos1, prevPos2, n, k) {
    // Non elastic collision
    const elast = 0.95

    // Return variables
    let outV1 = new THREE.Vector2()
    let outV2 = new THREE.Vector2()
    let outPos1 = new THREE.Vector2()
    let outPos2 = new THREE.Vector2()
    let vDiff1 = new THREE.Vector2()
    let vDiff2 = new THREE.Vector2()
    let pDiff1 = new THREE.Vector2()
    let pDiff2 = new THREE.Vector2()

    // To not change data of inputs create copies since vectors are objects => passed by reference
    v1Copy = v1.clone()
    v2Copy = v2.clone()
    p1Copy = p1.clone()
    p2Copy = p2.clone()

    // Test if distance between balls are less than 2 radius
    if (p1Copy.distanceTo(p2Copy) < 2 * radius) {
        // To make code more readable create difference variables
        vDiff1.subVectors(v1Copy, v2Copy)
        pDiff1.subVectors(p1Copy, p2Copy)
        vDiff2.subVectors(v2Copy, v1Copy)
        pDiff2.subVectors(p2Copy, p1Copy)

        // Calculate new velocity vectors and correct tau for the new velocity
        outV1.subVectors(v1Copy, pDiff1.multiplyScalar(vDiff1.dot(pDiff1)).divideScalar(p1Copy.distanceToSquared(p2Copy))).multiplyScalar(elast)
        outPos1 = prevPos1
        tau[n] = outV1.angle()

        outV2.subVectors(v2Copy, pDiff2.multiplyScalar(vDiff2.dot(pDiff2)).divideScalar(p2Copy.distanceToSquared(p1Copy))).multiplyScalar(elast)
        outPos2 = prevPos2
        tau[k] = outV2.angle()

        // Test if one of the balls were still, then store initial velocity to later decide rolling or sliding
        if (v1.length() == 0) {
            Friction[n] = m * g * my
            initialVelocity[n] = outV1.length()
        }
        else if (v2.length() == 0) {
            Friction[k] = m * g * my
            initialVelocity[k] = outV2.length()
        }
    }
    // Do nothing
    else {
        outV1 = v1Copy
        outV2 = v2Copy
        outPos1 = p1Copy
        outPos2 = p2Copy
    }

    return [outV1, outV2, outPos1, outPos2]
}