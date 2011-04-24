Cell = function(x,y, dead) {
     this.x = x;
     this.y = y;
     this.dead = dead ? dead : true;
}

Grid = function(containerId, dimension, sizeOfACell) {
  this.containerId = containerId;
  this.dimension = dimension;
  this.cellSize = sizeOfACell;
  this.cells = new Array();
  for (var k=0; k < this.dimension; k++){
    this.cells[k] = new Array();
  }

  for (var y=0; y < this.dimension; y++){
    for (var x=0; x < this.dimension; x++){
      this.cells[x][y] = new Cell(x,y);
    }
  }
}

Grid.prototype = {
  
  getEmptyGrid: function(){
    var arr = new Array();
    for (var k=0; k < this.dimension; k++){
      arr[k] = new Array();
    }

    for (var y=0; y < this.dimension; y++){
      for (var x=0; x < this.dimension; x++){
        arr[x][y] = new Cell(x,y);
      }
    }
    return arr;
  },
  
  draw: function() {
      $('#gol-table').remove();
      $('#' + this.containerId).append($('<table/>', {'border':1, 'id':'gol-table'}));
      for (var y=0; y < this.dimension; y++){
        var tr = $('<tr/>', {'id':y});
        $('#gol-table').append(tr);
        for (x=0; x < this.dimension; x++){
          var currentGrid = this;
          var currentCell = currentGrid.cells[x][y];
          var td = $('<td/>', {'id': x.toString() + ',' + y.toString(), 'height': this.cellSize, 'width': this.cellSize})
                    .addClass(currentCell.dead ? 'dead' : 'alive');
          $(td).click(function(){
            var coord = $(this).attr('id').split(',');
            var coordx = parseInt(coord[0], 10);
            var coordy = parseInt(coord[1], 10);
            $(this).toggleClass('dead alive');
            if($(this).hasClass('dead')){
              currentGrid.cells[coordx][coordy].dead = true;
            } else {
              currentGrid.cells[coordx][coordy].dead = false;
            }
          });
          $(tr).append(td);
        }
      }
  },

  start: function(interval){
    var that = this;
    setInterval(function(){
      that.run();
    }, interval);
  },
  
  run: function() {
      this.draw();
      var futureCells = this.getEmptyGrid();
      for (var y=0; y < this.dimension; y++){
        for (var x=0; x < this.dimension; x++){
          var neighboors = this.liveNeighboors(x,y);
          if(this.cells[x][y].dead){
            if(neighboors.length == 3){
              futureCells[x][y].dead = false;
            } else {
              futureCells[x][y].dead = true;
            } 
          } else if(! this.cells[x][y].dead) {
            if(neighboors.length == 2 || neighboors.length == 3){
              futureCells[x][y].dead = false;
            } else { 
              futureCells[x][y].dead = true;
            }
          }
          
        }
      }
      for (var y=0; y < this.dimension; y++){
        for (var x=0; x < this.dimension; x++){
          this.cells[x][y].dead = futureCells[x][y].dead;
        }
      }
  },
  
  liveNeighboors: function(x,y) {
    var neigh = [];
    var xMinus1=0, yMinus1=0, xPlus1=0, yPlus1=0;
    if(x==0){
      xMinus1 = this.dimension-1;
    } else {
      xMinus1 = x-1;
    }
    if(y==0){
      yMinus1 = this.dimension-1;
    } else {
      yMinus1 = y-1;
    }
    if(x==this.dimension-1){
      xPlus1 = 0;
    } else {
      xPlus1 = x+1;
    }
    if(y==this.dimension-1){
      yPlus1 = 0;
    } else {
      yPlus1 = y+1;
    }

    var one = this.cells[xMinus1][yMinus1];
    var two = this.cells[x][yMinus1];
    var three = this.cells[xPlus1][yMinus1];
    var four = this.cells[xPlus1][y];

    var five = this.cells[xPlus1][yPlus1];
    var six = this.cells[x][yPlus1];
    var seven = this.cells[xMinus1][yPlus1];
    var height = this.cells[xMinus1][y];
    
    if(!one.dead) neigh.push('one');
    if(!two.dead) neigh.push('two');
    if(!three.dead) neigh.push('three');
    if(!four.dead) neigh.push('four');
    if(!five.dead) neigh.push('five');
    if(!six.dead) neigh.push('six');
    if(!seven.dead) neigh.push('seven');
    if(!height.dead) neigh.push('height');
    
    return neigh;
  },
  
  allDead: function(){
    for (var y=0; y < this.dimension; y++){
      for (var x=0; x < this.dimension; x++){
        if(! this.cells[x][y].dead) {
          return false;
        }
      }
    }
    return true;
  }
  
}