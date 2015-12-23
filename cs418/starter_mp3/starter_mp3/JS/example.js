var tpShaderProgram;
var shaderProgramt;
var cubeMap;
// Create a place to store terrain geometry
var tVertexPositionBuffer;

//Create a place to store normals for shading
var tVertexNormalBuffer;

// Create a place to store the terrain triangles
var tIndexTriBuffer;

var terrainVertexBuffer;
var terrainFacesBuffer;
var vertexNormalAttribute;

// variables to hold the buffers being created 
var basicObj;
var basicFace;
var basicNormal;

var texXCoordsBuffer = null;
var texZCoordsBuffer = null;

// setting up the matricies for the camera and model matricies
var cameraMatrix = null;
var viewMatrix = null;
var mMatrix = null;

//Create a place to store the traingle edges
var tIndexEdgeBuffer;

function exampleLoad() {
    this.RL = null; //  The Resource Loader
    this.shaderProgram = null; //  The Shader Program
}

exampleLoad.prototype.loadResources = function () {

    //  Request Resourcess
    this.RL = new ResourceLoader(this.resourcesLoaded, this);
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/default_vert.txt");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/default_frag.txt");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/teapot_0.obj");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/default_terrain_vertex_shader.txt");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/default_terrain_fragment_shader.txt");

    // requests for images 
    // request for height map image 
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/Final.jpg");
    // request for cube map images 
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/neg-x.jpg");
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/neg-y.jpg");
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/neg-z.jpg");
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/pos-x.jpg");
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/pos-y.jpg");
    this.RL.addResourceRequest("IMAGE", "JS/Assets/IMAGE/pos-z.jpg");

    this.RL.loadRequestedResources();
};

exampleLoad.prototype.resourcesLoaded = function (exampleLoadReference) {
    // This will only run after the resouces have been loaded.
    exampleLoadReference.completeCheck();
    exampleLoadReference.begin();
};


exampleLoad.prototype.completeCheck = function () {
    //  Run a quick check
    console.log("check");

    // loads the string that was just read in into the variable 
    var tpStr = this.RL.RLStorage.TEXT[2];

    // want to store the string into an array, so split by spaces right now
    var tpArr = tpStr.replace(/\s\s+/g, " ");

    tpArr = tpArr.split(" ");

    // loop through the array , and store the values into two separate arrays based on the letter that came before it. 
    // put next 3 array locations if V, if F, put next four
    var i = 0;
    var count = 0;

    // two arrays - one for verticies one for faces and counters for each one

    var arrLength = tpArr.length;

    i = 0;
    console.log("here we go");
    while (i < arrLength) {

        if (tpArr[i] == 'v') {

            for (count = 0; count < 3; count++) {
                i++;

                tpVert.push(tpArr[i]);
            }
        }
        // if it's f push four items
        else if (tpArr[i] == 'f') {

            for (count = 0; count < 3; count++) {
                i++;
                tpFace.push(tpArr[i] - 1);
            }
        }
        i++;

    }
    console.log("endcheck");

    //    // check to make sure contents of arrays are correct
    var numVert = tpVert.length;
    var numFace = tpFace.length;

    var numColor = (numFace / 3) * 4; // the total number of individual verticies , each vertex needs four color elements, total num elements in
    // loop through and push
    for (count = 0; count < numColor; count++) {
        // check for the modulous - this will tell me if it's r, g, b , a value 0,1,2,3 respectively   
        // set r value 
        if (count % 4 == 0) {
            tpColors.push(0.0 / 255.0);
        }
        // set g value
        else if (count % 4 == 1) {
            tpColors.push(0.0 / 255.0);
        }
        // set b value
        else if (count % 4 == 2) {
            tpColors.push(0.0 / 255);
        }
        // set a value
        else {
            tpColors.push(1.0);
        }
    }

    // checking the vertex and face arrays 
    console.log(numVert);
    console.log(numFace);

    console.log("check2");

    // calculate the face normals and the vertex normals. 
    // create a better face array 


};

exampleLoad.prototype.begin = function () {
    // Begin running the program.  
    this.initShaders();
    this.initPerspectiveBuffers(shaderProgramt);
    this.initPerspectiveBuffers(tpShaderProgram);
    // calculate normals, upload shaders and set up buffers
    calculate_normals();
    gl.useProgram(tpShaderProgram);
    uploadLightsToShader();
    this.initSetupBuffers();

    render(0.0);
};

exampleLoad.prototype.initShaders = function () {

    //  Initialize shaders - we're using that have been loaded in.
    var vertexShadertp = this.createShader(this.RL.RLStorage.TEXT[0], gl.VERTEX_SHADER); //  
    var fragmentShadertp = this.createShader(this.RL.RLStorage.TEXT[1], gl.FRAGMENT_SHADER); //    

    // create teapot shader program 
    tpShaderProgram = gl.createProgram(); //  
    gl.attachShader(tpShaderProgram, vertexShadertp); //  
    gl.attachShader(tpShaderProgram, fragmentShadertp); //  
    gl.linkProgram(tpShaderProgram); //  

    // create the vertex and fragment shaders for terrain 
    var terrainVertexShader = this.createShader(this.RL.RLStorage.TEXT[3], gl.VERTEX_SHADER); //  
    var terrainFragmentShader = this.createShader(this.RL.RLStorage.TEXT[4], gl.FRAGMENT_SHADER); //
    shaderProgramt = gl.createProgram(); //  
    gl.attachShader(shaderProgramt, terrainVertexShader); //  
    gl.attachShader(shaderProgramt, terrainFragmentShader); //  
    gl.linkProgram(shaderProgramt); //  
    if (!gl.getProgramParameter(shaderProgramt, gl.LINK_STATUS)) //  
    {
        alert("Unable to initialize the shader program."); //  
    }
    if (!gl.getProgramParameter(tpShaderProgram, gl.LINK_STATUS)) //  
    {
        alert("Unable to initialize the tp shader program."); //  
    }

};

exampleLoad.prototype.createShader = function (shaderSource, shaderType) {
    //  Create a shader, given the source and the type
    var shader = gl.createShader(shaderType); //  
    gl.shaderSource(shader, shaderSource); //  
    gl.compileShader(shader); //  

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) //  
    {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)); //
        return null; //
    }

    return shader; //
};

exampleLoad.prototype.initPerspectiveBuffers = function (shaderProgram) {
    gl.useProgram(shaderProgram);

    //  Create the matrix
    cameraMatrix = mat4.create();

    // Load it with a perspective matrix.
    mat4.perspective(cameraMatrix, Math.PI / 3, 16.0 / 9.0, 0.1, 60.0);

    //  Create a view matrix
    viewMatrix = mat4.create();
    //  An identity view matrix
    mat4.identity(viewMatrix);

    mMatrix = mat4.create();
    //  Set the view matrix - we are 20 units away from all the axes.
    mat4.lookAt(viewMatrix, vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1.0, 0));

    //  Get the perspective matrix location
    var pMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    //  Get the view matrix location
    var vMatrixUniform = gl.getUniformLocation(shaderProgram, "viewMatrix");

    var mMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");


    //  Send the perspective matrix
    gl.uniformMatrix4fv(pMatrixUniform, false, cameraMatrix);
    //  Send the view matrix
    gl.uniformMatrix4fv(vMatrixUniform, false, viewMatrix);
    //  Send the model Matrix.
    gl.uniformMatrix4fv(mMatrixUniform, false, mMatrix);

}

exampleLoad.prototype.initSetupBuffers = function () {

    //  Set up buffers!
    // set up verticies and colors 
    /*    var vertices = [0, 0, 0, 1.0,
                        1.0, 0, 0, 1.0,
                        0, 0, 1.0, 1.0,
                        1.0, 0, 1.0, 1.0];*/

    this.createCubeMap();

    //set buffers for verticies and colors for tea pot
    var vertices = tpVert;

    gl.useProgram(tpShaderProgram);
    basicObj = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, basicObj);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    basicObj.itemSize = 3;
    basicObj.numItems = (tpVert.length) / 3;


    vertexPositionAttribute = gl.getAttribLocation(tpShaderProgram, "vPosition"); //
    gl.bindBuffer(gl.ARRAY_BUFFER, basicObj); //  
    gl.enableVertexAttribArray(vertexPositionAttribute); //  
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0); //  

    var colors = tpColors;

    console.log(" COLOR TEST HERE");

    basicColors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, basicColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    basicColors.itemSize = 4;
    basicColors.numItems = (tpColors.length) / 4;

    // add in normals ===============================
    var tpNormals = vertNormal;
    basicNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, basicNormal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tpNormals), gl.STATIC_DRAW);
    basicNormal.itemSize = 3;
    basicNormal.numItems = (tpVert.length) / 3;

    vertexNormalAttribute = gl.getAttribLocation(tpShaderProgram, "vNormal");
    gl.bindBuffer(gl.ARRAY_BUFFER, basicNormal); //  
    gl.enableVertexAttribArray(vertexNormalAttribute); //  
    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    //=================================================



    // set up face buffer 
    var faces = tpFace;
    // Specify faces of the terrain 
    basicFace = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basicFace);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
    basicFace.itemSize = 1;
    basicFace.numItems = (tpFace.length);

    this.setupTerrainBuffers();
}


exampleLoad.prototype.draw = function () {
    //    console.log (" TPSHADERHERE");
    //  Draw function - called from render in index.js
    gl.clearColor(0.1, 0.1, 0.1, 1.0); //  Set the clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //  Clear the color as well as the depth buffer

    this.updateCameraMatrices();
    // draw terrain
    this.drawTerrain();
    this.drawTeapot();


}

exampleLoad.prototype.updateCameraMatrices = function () {

    mat4.rotateY(mMatrix, mMatrix, 0.01);

    //  Get the perspective matrix location
    var pMatrixUniform = gl.getUniformLocation(tpShaderProgram, "projectionMatrix");
    //  Get the view matrix location
    var vMatrixUniform = gl.getUniformLocation(tpShaderProgram, "viewMatrix");

    var mMatrixUniform = gl.getUniformLocation(tpShaderProgram, "modelMatrix");

    var normalMatrixUniform = gl.getUniformLocation(tpShaderProgram, "normalMatrix");

    //  Send the perspective matrix
    gl.uniformMatrix4fv(pMatrixUniform, false, cameraMatrix);
    //  Send the view matrix
    gl.uniformMatrix4fv(vMatrixUniform, false, viewMatrix);
    //  Send the model Matrix.
    gl.uniformMatrix4fv(mMatrixUniform, false, mMatrix);

    var mVMatrix = mat4.create();
    mat4.multiply(mVMatrix, viewMatrix, mMatrix);
    var nMatrix = mat3.create();

    mat3.normalFromMat4(nMatrix, mVMatrix);

    gl.uniformMatrix3fv(normalMatrixUniform, false, nMatrix);



};


exampleLoad.prototype.drawTerrain = function () {

    // drawing the terrain - texcoords computed directly in the shader 
    gl.useProgram(shaderProgramt);
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
    terrainVertexAttribute = gl.getAttribLocation(shaderProgramt, "vPosition"); //
    gl.enableVertexAttribArray(terrainVertexAttribute); //  
    gl.vertexAttribPointer(terrainVertexAttribute, 3, gl.FLOAT, false, 0, 0); //  


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.drawElements(gl.TRIANGLES, tIndexTriBuffer.numItems, gl.UNSIGNED_SHORT, 0); //



};

exampleLoad.prototype.drawTeapot = function () {

    gl.useProgram(tpShaderProgram); //	Bind teapot shader
    gl.bindBuffer(gl.ARRAY_BUFFER, basicObj); //  Bind array of vertices
    var vertexPositionAttribute = gl.getAttribLocation(tpShaderProgram, "vPosition"); // Get vertex position attribute location
    gl.enableVertexAttribArray(vertexPositionAttribute); //  Bind vertex position attribute location
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0); //  Tell WebGL how to interpret this array buffer

    //normals
    gl.bindBuffer(gl.ARRAY_BUFFER, basicNormal); //  Bind array of vertices
    var normalPositionAttribute = gl.getAttribLocation(tpShaderProgram, "vNormal"); // Get vertex position attribute location
    gl.enableVertexAttribArray(normalPositionAttribute); //  Bind vertex position attribute location
    gl.vertexAttribPointer(normalPositionAttribute, 3, gl.FLOAT, false, 0, 0); //  Tell WebGL how to interpret this array buffer

    //Similar for colors and then later normals

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basicFace); //	Bind the indices array
    gl.drawElements(gl.TRIANGLES, basicFace.numItems, gl.UNSIGNED_SHORT, 0); // Draw the teapot

};

// lighting phong lighting 
function calculate_normals() {
    // initialize faceNormal array and vertNormal array to 0 
    var j;
    for (j = 0; j < tpFace.length; j++) {
        faceNormal[j] = 0;
    }

    for (j = 0; j < tpVert.length; j++) {
        vertNormal[j] = 0;
        //        console.log(vertNormal[j]);
    }

    // go through the teapot face to find the vectors to update normals for Phong Lighting scheme
    // this calculates the FACE NORMALS 
    var total = tpFace.length / 3;

    for (var i = 0; i < total; i++) {
        // find the values at each face array index for the points - the index of the verticies
        // decrement by 1 since all are indexed starting from 1, while our array starts at 0
        var fArrayVal1 = tpFace[i * 3];
        var fArrayVal2 = tpFace[i * 3 + 1];
        var fArrayVal3 = tpFace[i * 3 + 2];

        // create vec3s to represent the points in the vectors - the points of each vertex in a triangletpVert
        var tri1 = vec3.fromValues(tpVert[(fArrayVal1 * 3)], tpVert[(fArrayVal1 * 3) + 1], tpVert[(fArrayVal1 * 3) + 2]);
        var tri2 = vec3.fromValues(tpVert[(fArrayVal2 * 3)], tpVert[(fArrayVal2 * 3) + 1], tpVert[(fArrayVal2 * 3) + 2]);
        var tri3 = vec3.fromValues(tpVert[(fArrayVal3 * 3)], tpVert[(fArrayVal3 * 3) + 1], tpVert[(fArrayVal3 * 3) + 2]);

        var cross1 = vec3.create();
        vec3.subtract(cross1, tri3, tri1);
        // normalize!
        var cross2 = vec3.create();
        vec3.subtract(cross2, tri3, tri2);

        // find the cross product of the two vectors
        var crossProduct = vec3.create();
        vec3.cross(crossProduct, cross1, cross2);
        // remember to normalize!
        vec3.normalize(crossProduct, crossProduct);

        // assign the corresponding face index to the x, y, z value 
        faceNormal[i * 3] = crossProduct[0];
        faceNormal[i * 3 + 1] = crossProduct[1];
        faceNormal[i * 3 + 2] = crossProduct[2];
    }

    // NOW MUST CALCULATE VERTEX NORMALS 
    // Loop through the faces, and for each vertex in a specific face, add the face normal to the accumulator vertNormal. 
    for (var i = 0; i < total; i++) {
        // find the values at each face array index for the points - the index of the verticies
        // decrement by 1 since all are indexed starting from 1, while our array starts at 0
        var fArrayVal1 = tpFace[i * 3];
        var fArrayVal2 = tpFace[i * 3 + 1];
        var fArrayVal3 = tpFace[i * 3 + 2];

        // now that we have the verticies, index into the vertNormal for each of the three verticies 
        // add the x,y,z components of the faceNormal array into the vertNormal
        vertNormal[fArrayVal1 * 3] += faceNormal[i * 3];
        vertNormal[fArrayVal1 * 3 + 1] += faceNormal[i * 3 + 1];
        vertNormal[fArrayVal1 * 3 + 2] += faceNormal[i * 3 + 2];

        vertNormal[fArrayVal2 * 3] += faceNormal[i * 3];
        vertNormal[fArrayVal2 * 3 + 1] += faceNormal[i * 3 + 1];
        vertNormal[fArrayVal2 * 3 + 2] += faceNormal[i * 3 + 2];

        vertNormal[fArrayVal3 * 3] += faceNormal[i * 3];
        vertNormal[fArrayVal3 * 3 + 1] += faceNormal[i * 3 + 1];
        vertNormal[fArrayVal3 * 3 + 2] += faceNormal[i * 3 + 2];

    }

    // loop through vertNormal and normalize each one

    var current_normal = vec3.create();
    for (var i = 0; i < vertNormal.length / 3; i++) {

        current_normal = vec3.fromValues(vertNormal[i * 3], vertNormal[i * 3 + 1], vertNormal[i * 3 + 2]);
        vec3.normalize(current_normal, current_normal);
        vertNormal[i * 3] = current_normal[0];
        vertNormal[i * 3 + 1] = current_normal[1];
        vertNormal[i * 3 + 2] = current_normal[2];
    }
}

function uploadLightsToShader() {
        tpShaderProgram.uniformLightPositionLoc = gl.getUniformLocation(tpShaderProgram, "uLightPosition");
        tpShaderProgram.uniformAmbientLightColorLoc = gl.getUniformLocation(tpShaderProgram, "uAmbientLightColor");
        tpShaderProgram.uniformDiffuseLightColorLoc = gl.getUniformLocation(tpShaderProgram, "uDiffuseLightColor");
        tpShaderProgram.uniformSpecularLightColorLoc = gl.getUniformLocation(tpShaderProgram, "uSpecularLightColor");

        gl.uniform3fv(tpShaderProgram.uniformLightPositionLoc, vec3.fromValues(10, 10, 10));
        gl.uniform3fv(tpShaderProgram.uniformAmbientLightColorLoc, vec3.fromValues(1.0, 0.0, 1.0));

        gl.uniform3fv(tpShaderProgram.uniformDiffuseLightColorLoc, vec3.fromValues(0.745, 0.737, 0.839));
        gl.uniform3fv(tpShaderProgram.uniformSpecularLightColorLoc, vec3.fromValues(1.0, 1.0, 1.0));

    }
    //-------------------------------------------------------------------------
exampleLoad.prototype.setupTerrainBuffers = function () {

    gl.useProgram(shaderProgramt);

    var vTerrain = [];
    var fTerrain = [];
    var nTerrain = [];
    var eTerrain = [];
    var texXTerrain = [];
    var texZTerrain = [];
    var gridN = 64;

    var numT = terrainFromIteration(gridN, -10, 10, -10, 10, vTerrain, fTerrain, texXTerrain, texZTerrain);
    console.log("Generated ", numT, " triangles");
    console.log(vTerrain);


    tVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTerrain), gl.STATIC_DRAW);
    tVertexPositionBuffer.itemSize = 3;
    tVertexPositionBuffer.numItems = (gridN + 1) * (gridN + 1);
    terrainVertexAttribute = gl.getAttribLocation(shaderProgramt, "vPosition"); //
    gl.enableVertexAttribArray(terrainVertexAttribute); //  
    gl.vertexAttribPointer(terrainVertexAttribute, 3, gl.FLOAT, false, 0, 0); //  


    console.log(texXTerrain);
    console.log(texZTerrain);

    /*
    // Tex Coords
    texXCoordsBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, texXCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texXTerrain), gl.DYNAMIC_DRAW);
    var vertexXAttribute = gl.getAttribLocation(shaderProgramt, "x");
    gl.enableVertexAttribArray(vertexXAttribute); //  
    gl.vertexAttribPointer(vertexXAttribute, 1, gl.FLOAT, false, 0, 0);

    texZCoordsBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, texZCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texZTerrain), gl.DYNAMIC_DRAW);
    var vertexZAttribute = gl.getAttribLocation(shaderProgramt, "z");
    gl.enableVertexAttribArray(vertexZAttribute); //  
    gl.vertexAttribPointer(vertexZAttribute, 1, gl.FLOAT, false, 0, 0);
    */


    this.createHeightMapFunction(this.RL.RLStorage.IMAGE[0]);

    // Specify faces of the terrain
    tIndexTriBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fTerrain),
        gl.STATIC_DRAW);
    tIndexTriBuffer.numItems = numT * 3;




}

function load_cube_map() {
    //    var cubeTexture  = gl.createTexture();
    //    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
    //    
    //    // for each face do this : 
    //    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); 
    //    gl.bindTexture(gl.TEXTURE_CUBE_MAP,  cubeTexture);
    //    gl.texImage2D(cube_face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    //
    //    // When you are done with that…
    //    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
    //    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    var red = new Uint8Array([255, 0, 0, 255]);
    var green = new Uint8Array([0, 255, 0, 255]);
    var blue = new Uint8Array([0, 0, 255, 255]);
    var cyan = new Uint8Array([0, 255, 255, 255]);
    var magenta = new Uint8Array([255, 0, 255, 255]);
    var yellow = new Uint8Array([255, 255, 0, 255]);

    gl.useProgram(tpShaderProgram);
    cubeMap = gl.createTexture();
    //    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap); 

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, red);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, green);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, blue);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, cyan);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, yellow);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, magenta);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    // gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(tpShaderProgram, "texMap"), 0);
}



//  Create the terrain
function terrainFromIteration(n, minX, maxX, minY, maxY, vertexArray, faceArray, texCoordsArrayX, texCoordsArrayY) {
    var deltaX = (maxX - minX) / n;
    var deltaY = (maxY - minY) / n;
    for (var i = 0; i <= n; i++)
        for (var j = 0; j <= n; j++) {
            vertexArray.push(minX + deltaX * j);
            vertexArray.push(-2.5);
            vertexArray.push(minY + deltaY * i);

            texCoordsArrayX.push(i / n);
            texCoordsArrayY.push(j / n);
        }

    console.log(vertexArray.length / 3);

    var numT = 0;
    for (var i = 0; i < n; i++)
        for (var j = 0; j < n; j++) {
            var vid = i * (n + 1) + j;
            faceArray.push(vid);
            faceArray.push(vid + 1);
            faceArray.push(vid + n + 1);

            faceArray.push(vid + 1);
            faceArray.push(vid + 1 + n + 1);
            faceArray.push(vid + n + 1);
            numT += 2;
        }

    return numT;

}


exampleLoad.prototype.createHeightMapFunction = function (image) {

    this.HeightMapTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.HeightMapTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(shaderProgramt, "uSampler"), this.HeightMapTexture);


    shaderProgramt.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgramt, "uAmbientLightColor");

    gl.uniform3fv(shaderProgramt.uniformAmbientLightColorLoc, vec3.fromValues(1.0, 1.0, 1.0));

};

// create cube map - mapping from textures and spliced from sources online 
exampleLoad.prototype.createCubeMap = function () {

    this.cubeMapTexture = gl.createTexture();
    var cubeFaces = [gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_Z
                    ];

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMapTexture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    for (var i = 0; i < cubeFaces.length; i++) {

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMapTexture)
        gl.texImage2D(cubeFaces[i], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.RL.RLStorage.IMAGE[i + 1]);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMapTexture);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);


    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMapTexture);
    gl.uniform1i(gl.getUniformLocation(tpShaderProgram, "cube_texture"), this.cubeMapTexture);

};