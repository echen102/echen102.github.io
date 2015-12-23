
var nSize = 64; // this is the number of columns and rows in the square terrain
var zArray = new Array(nSize*nSize);
var scale = 50.0; // this is the scale that will continually decrement - used in the diamond square alg

var newNormal = new Array((n+1) * 3);
//-------------------------------------------------------------------------
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray)
{
    // initialize the array 
    for ( var i = 0; i < ((nSize+1)*(nSize+1)); i++)
    {
        zArray[i] = 0;
    }
    DS();
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           var toPush = currIndex(i,j);
           console.log(i);
           console.log(j);
           console.log(toPush);
           var randNum = Math.random();
           
           vertexArray.push(toPush);
           
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }

    var numT=0;
    
    for(var i=0;i<n;i++) 
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2;
       }
    
    // go through the faceArray to find the vectors to update normals for Phong Lighting scheme
        var total = faceArray.length/3;
       for (var i = 0; i < total; i++) {
        // find the values at each face array index for the points
        var fArrayVal1 = faceArray[i*3];
        var fArrayVal2 = faceArray[i*3+1];
        var fArrayVal3 = faceArray[i*3+2];
        
           // create vec3s to represent the points in the vectors - the points of each vertex in a triangle
        var tri1 = vec3.fromValues(vertexArray[(fArrayVal1*3)], vertexArray[(fArrayVal1*3)+1], vertexArray[(fArrayVal1*3)+2]);
        var tri2 = vec3.fromValues(vertexArray[(fArrayVal2*3)], vertexArray[(fArrayVal2*3)+1], vertexArray[(fArrayVal2*3)+2]);
        var tri3 = vec3.fromValues(vertexArray[(fArrayVal3*3)], vertexArray[(fArrayVal3*3)+1], vertexArray[(fArrayVal3*3)+2]);
        
        var cross1 = vec3.create();
        vec3.subtract(cross1, tri3, tri1);
           // normalize!
        vec3.normalize(cross1,cross1);
           
        var cross2 = vec3.create();
        vec3.subtract(cross2, tri2, tri3);
        
           // find the cross product of the two vectors
        var crossProduct = vec3.create();
        vec3.cross(crossProduct,cross1,cross2);
           // remember to normalize!
        vec3.normalize(crossProduct, crossProduct);
        
           // reassign the newly calculated normal vertex's x,y,z values to the corresponding normal in the array. 
        for (var count = 0; count <=2; count++) {
            var face_array = faceArray[i*3+count];
            normalArray[face_array*3] = crossProduct[0];
            normalArray[face_array*3+1] = crossProduct[1];
            normalArray[face_array*3+2] = crossProduct[2];
        }
    }
    return numT;
}

// function square diamond alg
// find the index in the array for a specific x and y value 
function currIndex(x,y)
{
    // finds array location 
    // if the requested array index is greater the parameters of the grid, return 0
    if ((y*(nSize+1)+x) > ((nSize+1)*(nSize+1)))
    {
        return 0;   
    }
    // if the requested array index is less than (0,0) , return 0 
    if ( y < 0 && x < 0)
    {
     return 0;   
    }
    // otherwise return the value at that array location 
    return zArray[y*(nSize+1)+x];
}

// sets the value at the array position indivated by the passed in x and y values 
function setVal(x,y,val)
{
    zArray[y*(nSize+1)+x] = val;   
}

// returns a random value between -1 and 1 
function randNum()
{
    return ((Math.random() * 2) - 1);   
}

function square (x,y,size,val)
{
    var half = size/2;
    
    var a =currIndex(x-half, y-half);
    var b =currIndex(x+half, y-half);
    var c =currIndex(x-half, y+half);
    var d =currIndex(x-half, y-half);
    
    setVal(x,y,((a+b+c+d)/4.0)+val);
}

function diamond (x,y,size,val)
{
    var half = size/2;
    
    var a = currIndex(x-half, y);
    var b = currIndex(x+half,y);
    var c = currIndex(x,y-half);
    var d = currIndex(x, y+half);
    
    setVal(x,y,((a+b+c+d)/4.0)+val);
}

function DS()
{   
    // this is the length of a side in points 
    var size = nSize+1;
    
    // initialize the corner values 
    // left up corner
    setVal(0,0, 10);
    setVal(0,size,10);
    setVal(size,0,10);
    setVal(size,size,10);

    for ( var overall = nSize; overall >=2; overall/=2)
    {
        for ( var tempX = 0; tempX < nSize; tempX+=overall)
        {
            for (var tempY = 0; tempY < nSize; tempY +=overall)
            {
                var rNum = randNum();
                square(tempX, tempY, overall, rNum * scale);
            }
        }

       for (var tempX2 = 0; tempX2 < nSize; tempX2+=(overall/2))
        {
          for (var tempY2 = (tempX2+(overall/2))%overall; tempY2 < nSize; tempY2+=overall)
          {
            var rNum = randNum();
            diamond(tempX2,tempY2,overall,rNum *scale);
          }
        } 

        // decrement the scale as we go 
        scale = scale / 2.0;
    }

}

//-------------------------------------------------------------------------
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}

//-------------------------------------------------------------------------


