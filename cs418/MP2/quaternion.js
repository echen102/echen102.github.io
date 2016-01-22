
function processMovement()
{
/*    eyePt[2]-=0.001;
    viewPt[2] -=0.001;*/
/*    up[0] += 0.05;
    vec3.normalize(up,up);*/
   // moveFoward();
    // if the left arrow key was pressed                        
    if (keysDown[37])
    {   
        roll(-1);    
    }
    // if the right arrow key was pressed
    if (keysDown[39])
    {
        
        roll(1);
        console.log("right");
    }
    
    // if up arrow key is pressed
    if (keysDown[38])
    {
        console.log("up");
        pitch(1);   
    }
    // if down arrow key is pressed 
    if (keysDown[40])
    {
        console.log("down");
        pitch(-1);   
    }
}

/* This function pitches "plane" by rotating the camera about the crossVec , and updates the other vectors accordingly */
function pitch(degrees) {
    console.log("pitch");
    // create quaternion to hold the rotation quaternion to be applied later
    var rotateQuat = quat.create();
    // create vector that will hold the cross product of the up and viewdir vectors
    var crossVec = vec3.create();
    // find cross product
    vec3.cross(crossVec,viewDir,up);

    // set rotation quaternion to the rotating a certain number of degrees around the cross vector
    quat.setAxisAngle(rotateQuat, crossVec, degToRad(degrees));
    quat.normalize(rotateQuat,rotateQuat);
    
    // apply rotation quaternion to up vector
    vec3.transformQuat(up, up, rotateQuat);
    // apply same rotation quaternion to viewDir vector
    vec3.transformQuat(viewDir,viewDir, rotateQuat);
    
}
/* This function rolls "plane" by rotating the camera about the viewDir , and updates the other vectors accordingly */
function roll(degrees) {
    console.log("roll");
    // create quaternion to hold the rotation quaternion to be applied later
    var rotateQuat = quat.create();    
    // create vector that will hold the cross product of the up and viewdir vectors
    var crossVec = vec3.create();
    
    // find cross product
    vec3.cross(crossVec,viewDir,up);
    
    // set rotation quaternion to the rotating a certain number of degrees around the cross vector

    quat.setAxisAngle(rotateQuat, viewDir, degToRad(degrees));
    quat.normalize(rotateQuat, rotateQuat);
    
    // apply rotation quaternion to up vector and view direction vector to keep both orthogonal
    vec3.transformQuat(up, up, rotateQuat);
    vec3.transformQuat(viewDir,viewDir, rotateQuat);

}
/* This function moves the eyept and viewpt in the direction of viewDir - moves forward in whatever orientation 
the camera is in */
function moveFoward()
{
    var tempViewDir = vec3.create();
    var tempViewDir = vec3.clone(viewDir);
    vec3.scale(tempViewDir,viewDir,0.01);
    vec3.add(eyePt,eyePt,tempViewDir);
    vec3.add(viewPt, viewPt,tempViewDir);
   
}