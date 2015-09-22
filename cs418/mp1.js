
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;


// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();
var rotAngle = 0;
var lastTime = 0;
var x;


var squareXOffset = 0.0;
var squareYOffset = 0.0;
var squareZOffset = 0.0;

/*
    Sets values for 4x4 matrix to a uniform location 
*/
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}
    

/*
    This function converts degrees to radians to be used in trig functions
*/
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/*
    Sets up the WEBGL context - initializes necessary variables, creates canvas, sets the canvas height
*/

function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
      // make viewport smaller to zoom out. 
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/*
    Loads shader source through WebGL 
*/
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/*
    Initialize shader, get handle for uniform matrix in shader
*/
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
}


/*
    Creates buffers for both the wire frame and solid triangle colored versions of the 'I'. Includes vertex locations, and colors of the corresponding vertex location.
*/
function setupBuffers() {
    // top of the I 
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
      -0.25, 0.75, 0, 
      0.5, 0.75, 0, 
      0.5, 0.5, 0, 
      0, 0.5, 0, 
      -0.25, 0.5, 0, 
      -0.75, 0.5, 0, 
      -0.75, 0.75, 0
  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 7;
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.8, 1.0,
        0.0, 0.0, 0.5, 1.0,
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 7;  
//*************************************************
    // middle of the I 

      vertexPositionBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer2);
  var triangleVertices2 = [
    -0.25,    0.5,    0, 
        0,    0.5,    0, 
    -0.25,    -0.5,   0, 
        0,    -0.5,   0
  ];    
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices2), gl.STATIC_DRAW);
  vertexPositionBuffer2.itemSize = 3;
  vertexPositionBuffer2.numberOfItems = 4;
    
  vertexColorBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer2);
  var colors2= [
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors2), gl.STATIC_DRAW);
  vertexColorBuffer2.itemSize = 4;
  vertexColorBuffer2.numItems = 4; 
// ***************************************************
    // bottom of the I 
      vertexPositionBuffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer3);
  var triangleVertices3= [
      -0.25, -0.75, 0, 
      0.5, -0.75, 0, 
      0.5, -0.5, 0, 
      0, -0.5, 0, 
      -0.25, -0.5, 0,
      -0.75, -0.5, 0, 
      -0.75, -0.75, 0  
    ];    
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices3), gl.STATIC_DRAW);
  vertexPositionBuffer3.itemSize = 3;
  vertexPositionBuffer3.numberOfItems = 7;
    
  vertexColorBuffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer3);
  var colors3= [
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.1, 1.0,
        0.0, 0.0, 0.5, 1.0,
        0.0, 0.0, 0.1, 1.0,
        0.0, 0.0, 0.1, 1.0, 
        0.0, 0.0, 0.5, 1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors3), gl.STATIC_DRAW);
  vertexColorBuffer3.itemSize = 4;
  vertexColorBuffer3.numItems = 7; 
//=================================line skeleton ====================================
    // top of the I 
  linePositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
  var lineVertices = [
// TOP 
      -0.75, 0.75, 0, 
      -0.25, 0.75, 0, 
      
    -0.75, 0.75, 0,
      -0.75, 0.5, 0, 
      
      -0.75, 0.5, 0, 
      -0.25, 0.75, 0,
      
      -0.75, 0.5, 0, 
      -0.25, 0.5, 0,
      
      -0.25, 0.75, 0, 
      -0.25, 0.5, 0,
      
       -0.25, 0.75, 0, 
      0, 0.5, 0, 
      
     -0.25, 0.75, 0, 
      0.5, 0.5, 0, 

      -0.25, 0.75, 0,       
      0.5, 0.75, 0, 

      -0.25, 0.5, 0, 
      0, 0.5, 0, 
      
      0, 0.5, 0, 
      0.5, 0.5, 0,   
      
      0.5, 0.5, 0,   
      0.5, 0.75, 0, 
      
// MIDDLE 
    -0.25, 0.5, 0, 
     0, 0.5, 0, 
      
      0, 0.5, 0, 
      0, -0.5, 0, 
      
      0, 0.5, 0, 
      -0.25, -0.5, 0, 
      
      -0.25, 0.5, 0, 
      -0.25, -0.5, 0,
      
      -0.25, -0.5, 0, 
      0, -0.5, 0,  
      
// BOTTOM 
      -0.75, -0.75, 0, 
      -0.25, -0.75, 0, 
  
    -0.75, -0.75, 0,
      -0.75, -0.5, 0, 
      

      -0.75, -0.5, 0, 
      -0.25, -0.75, 0,
      

      -0.75, -0.5, 0, 
      -0.25, -0.5, 0,
      
      -0.25, -0.75, 0, 
      -0.25, -0.5, 0,
      
      
       -0.25, -0.75, 0, 
      0, -0.5, 0, 
    
     -0.25, -0.75, 0, 
      0.5, -0.5, 0, 

      -0.25, -0.75, 0,       
      0.5, -0.75, 0, 

      -0.25, -0.5, 0, 
      0, -0.5, 0, 
      
      0, -0.5, 0, 
      0.5, -0.5, 0,   
      
      0.5, -0.5, 0,   
      0.5, -0.75, 0,   
      
      
   
  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);
  linePositionBuffer.itemSize = 3;
  linePositionBuffer.numberOfItems = 54;
    
  lineColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
  var lineColor = [
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
        1.0, 0.0, 0.5, 1.0,
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineColor), gl.STATIC_DRAW);
  lineColorBuffer.itemSize = 4;
  lineColorBuffer.numItems = 54;  


}

/*
    Handles the drawing of, manipulation of the graphics. Controls which buffers are displayed when checkbox is checked on page. 
*/
function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);
    /* 1,  0,  0,  0,
     0,  1,  0,  0,
     0,  0,  1,  0,
     tx, ty, tz, 1 */
  mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle));
  mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle));
  mat4.scale(mvMatrix, mvMatrix, [1,Math.sin(degToRad(rotAngle))+1,1]);
    if (!(document.getElementById("myCheck").checked))
    {
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                             vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

      setMatrixUniforms();
      gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexPositionBuffer.numberOfItems);

        //*************************************************

     gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer2);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                             vertexPositionBuffer2.itemSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer2);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                                vertexColorBuffer2.itemSize, gl.FLOAT, false, 0, 0);

      setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer2.numberOfItems);

        //*************************************************

     gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer3);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                             vertexPositionBuffer3.itemSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer3);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                                vertexColorBuffer3.itemSize, gl.FLOAT, false, 0, 0);

      setMatrixUniforms();
      gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexPositionBuffer3.numberOfItems);
    }
    else
    {
        // TOP
           gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                             linePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                             lineColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

      setMatrixUniforms();
      gl.drawArrays(gl.LINES, 0, linePositionBuffer.numberOfItems);

  
    }
}

/*
    Keeps track of the elapsed time for animation purposes
    In this case used to continually loop rotation angle from 0 to 360
*/
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;    
        rotAngle= (rotAngle+1.0) % 360;
    }
    lastTime = timeNow;
}

/*
    Sets up the page for graphics animation, sets background, calls functions to start animation
*/
function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas); 
  setupShaders(); 
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  tick();
}

/*
    
*/
function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}

