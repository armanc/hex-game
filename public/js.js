// game status - playing vs game_over
var game_status = "playing";

// board size setting
var radius = 3;
document.getElementById("radius").innerHTML = radius;

// position board and saving rows count accordingly to radius
var rows = [];
if (radius == 4) { 
  rows = ["-1","0","1"]; 
  document.getElementById("game_container").style.marginTop = "120px";
  document.getElementById("game_container").style.marginLeft = "120px";
}
if (radius == 3) {
  rows = ["-2","-1","0","1","2"];
  document.getElementById("game_container").style.marginTop = "190px";
  document.getElementById("game_container").style.marginLeft = "180px";
}
if (radius == 4) {
  rows = ["-3","-2","-1","0","1","2","-3",]; 
  document.getElementById("game_container").style.marginTop = "270px";
  document.getElementById("game_container").style.marginLeft = "270px";
}
if (radius == 5) {
  rows = ["-4","-3","-2","-1","0","1","2","-3","-4"]; 
  document.getElementById("game_container").style.marginTop = "370px";
  document.getElementById("game_container").style.marginLeft = "350px";
}

var vx = Math.sin(Math.PI/3);
var vy = Math.cos(Math.PI/3);

// calculating game board and values
function hexGrid(edgeLength){
  arr = []
  var neg_radius = -Math.abs(radius);

  for (let x = neg_radius+1; x < radius; x++) {
    for (let y = neg_radius+1; y < radius; y++) {
      for (let z = neg_radius+1; z < radius; z++) {
        if (z==-x-y) {
          arr.push({
            "x": x,
            "y": y,
            "z": z,
            "value": 0
          });
        } 
      } 
    }
  }
  return arr;
}

var cells = hexGrid(radius);

// re-draw new board after getting new positions from server
draw_cells();

function draw_cells (){
  cells.forEach((pos, i) => {
    //visualize the grid
    var node = document.createElement("div");
    node.className = "hexagon";

    x_px= vx*arr[i].y;
    y_px= vy*arr[i].y + arr[i].x;

    //scale the values before applying
    node.style.top = y_px * 86 + "px";
    node.style.left = x_px * 86 + "px";

    document.getElementById("game_container").appendChild(node);
    node.appendChild(document.createTextNode(pos.value));

    // add corresponding colors
    if (pos.value == 2){node.classList.add("hexagon_color_2");}
    if (pos.value == 4){node.classList.add("hexagon_color_4");}
    if (pos.value == 8){node.classList.add("hexagon_color_8");}
    if (pos.value == 16){node.classList.add("hexagon_color_16");}
    if (pos.value == 32){node.classList.add("hexagon_color_32");}
    if (pos.value == 64){node.classList.add("hexagon_color_64");}
    if (pos.value == 128){node.classList.add("hexagon_color_128");}
    if (pos.value == 256){node.classList.add("hexagon_color_256");}
    if (pos.value == 512){node.classList.add("hexagon_color_512");}
    if (pos.value == 1024){node.classList.add("hexagon_color_1024");}
    if (pos.value == 2048){node.classList.add("hexagon_color_2048");}
  });
}

update(arr);

function update(myArray){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://hex2048szb9jquj-hex15.functions.fnc.fr-par.scw.cloud/"+radius, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // create array of full cells
  var arr_full_cells = [];
  
  for(var i=0; i<myArray.length; i++) {
    if(myArray[i].value !== 0) {
      arr_full_cells.push(myArray[i]);
    }
  } 

  xhr.send(JSON.stringify(arr_full_cells));

  xhr.onload = function () {
    //console.log("XHR RESPONSE: "+xhr.response);
    var rnd_parsed = JSON.parse(xhr.response);
    //console.log(rnd_parsed);
    
    for(var i=0; i<myArray.length; i++){
      for(var j=0; j<rnd_parsed.length; j++){
        if(myArray[i].x == rnd_parsed[j].x && myArray[i].y == rnd_parsed[j].y && myArray[i].z == rnd_parsed[j].z) {
          Object.assign(myArray[i], rnd_parsed[j]);
          draw_cells();
        }
      }
    }
  }

}

document.addEventListener('keydown', (event) => {
  var name = event.code;

  // UP (y axis)
  if (name === 'KeyW') {
    //create multidimensional array for UP
    var arr_y_up = [[],[]];
    for (let i = 0; i < rows.length; i++) {
      arr_y_up[i]=[]; 
      var k=0;
      for (let j = 0; j < arr.length; j++) {     
      if (rows[i] == arr[j].y){
        //console.log("arr_y_up["+i+"]["+j+"] = "+JSON.stringify(arr_y_up[i][k]));
        arr_y_up[i][k] = arr[j];
        k++;
      }
    }
  }
  moves(arr_y_up);
  }

  // DOWN (y axis)
  if (name === 'KeyS') {
    //create multidimensional array for UP
    var arr_y_down = [[],[]];
    for (let i = 0; i < rows.length; i++) {
      arr_y_down[i]=[]; 
      var k=0;
      for (let j = arr.length-1; j >-1 ; j--) {     
      if (rows[i] == arr[j].y){
        //console.log("arr_y_up["+i+"]["+j+"] = "+JSON.stringify(arr_y_up[i][k]));
        arr_y_down[i][k] = arr[j];
        k++;
      }
    }
  }
  moves(arr_y_down);
  }

    // LEFT DOWN (z axis)
  if (name === 'KeyA') {
    //create multidimensional array for UP
    var arr_z_down = [[],[]];
    for (let i = 0; i < rows.length; i++) {
      arr_z_down[i]=[]; 
      var k=0;
      for (let j = arr.length-1; j >-1 ; j--) {     
      if (rows[i] == arr[j].z){
        //console.log("arr_y_up["+i+"]["+j+"] = "+JSON.stringify(arr_y_up[i][k]));
        arr_z_down[i][k] = arr[j];
        k++;
      }
    }
  }
  moves(arr_z_down);
  }

  // UP RIGHT (z axis)
  if (name === 'KeyE') {
    //create multidimensional array for UP
    var arr_z_up = [[],[]];
    for (let i = 0; i < rows.length; i++) {
      arr_z_up[i]=[]; 
      var k=0;
      for (let j = 0; j <arr.length ; j++) {     
      if (rows[i] == arr[j].z){
        //console.log("arr_y_up["+i+"]["+j+"] = "+JSON.stringify(arr_y_up[i][k]));
        arr_z_up[i][k] = arr[j];
        k++;
      }
    }
  }
  moves(arr_z_up);
  }

  // RIGHT DOWN (x asis)
  if (name === 'KeyD') {
    //create multidimensional array for UP
    var arr_x_down = [[],[]];
    for (let i = 0; i < rows.length; i++) {
      arr_x_down[i]=[]; 
      var k=0;
      for (let j = arr.length-1; j >-1 ; j--) {     
        if (rows[i] == arr[j].x){
        //console.log("arr_y_up["+i+"]["+j+"] = "+JSON.stringify(arr_y_up[i][k]));
        arr_x_down[i][k] = arr[j];
        k++;
      }
    }
  }
  moves(arr_x_down);
  }

  // UP LEFT (x asis)
  if (name === 'KeyQ') {
    //create multidimensional array for UP
    var arr_x_up = [[],[]];
    for (let i = 0; i < rows.length; i++) {
      arr_x_up[i]=[]; 
      var k=0;
      for (let j = 0; j <arr.length ; j++) {     
        if (rows[i] == arr[j].x){
          //console.log("arr_y_up["+i+"]["+j+"] = "+JSON.stringify(arr_y_up[i][k]));
          arr_x_up[i][k] = arr[j];
          k++;
        }
      }
    }
  moves(arr_x_up);
  }

  update(arr);
}, false);

function moves(arr_y_up){

// Walk through array from end to start. If the current element is equal to the next,
// replace it with the sum of both and move to the element after the replacement,
// then perform this check again for that element and the next. Repeat until the
// beginning of the array is reached. Meanwhile hop over zero value cells.

// bugs/todo:
// * disallow action if no valid moves.
// * in case of 3 or 4 equal cells in a row, sum needs to start from other direction.
// * add visal indicator of newly created cells. 
// * detect end of game status
// * 

  for (let r = 0; r < rows.length; r++){
    for (let r = 0; r < rows.length; r++){
      for (let i=arr_y_up[r].length-1; i>0; i--){
        var n = i-1;
        var m = n-1;

        // sum bystanding cells if value is equal
        if (arr_y_up[r][i].value == arr_y_up[r][n].value){
          arr_y_up[r][n].value = arr_y_up[r][n].value * 2;
          arr_y_up[r][i].value = 0;
                   
          //move cell if next cell is empty
          if (arr_y_up[r][m] !== undefined){
            if(arr_y_up[r][m].value == 0){
              arr_y_up[r][m].value = arr_y_up[r][n].value;
              arr_y_up[r][n].value = 0; 
            }
          }
          i--;//to avoid multi-summing cells in 1 move
        }
            // move cell 
        for (let ii=0; ii<radius; ii++){
          if (arr_y_up[r][i].value > arr_y_up[r][n].value){
            //if next cell is empty
            if(arr_y_up[r][n].value == 0){
              arr_y_up[r][n].value = arr_y_up[r][i].value;
              arr_y_up[r][i].value = 0; 
            }
          }
        }
      }
    }
  }
}

// nothing