
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
  
var board = {
    position: {row: 0, column: 0},
    gameOver: false,
    init: function(id) {
      this.board = document.querySelector(id);
      this.rows = prompt('please enter rows');
      this.columns = prompt('please enter columns');
      this.drawBoard();
      this.renderMushrooms();
      this.renderMario();
    },
    steps: 0,
    mushrooms: [],
    rows: null,
    columns: null,
    drawBoard: function() {
      for (var i = 0; i < this.rows; i++) {
        var row = this.board.insertRow(i);
        for (var j = 0; j < this.columns; j++) {
          row.insertCell(j);
        }
      }
    },
    getCell: function(row, column) {
      return this.board.rows.item(row).cells.item(column);
    },
    addMushroom: function(row, column) {
      var cell = this.getCell(row, column);
      cell.classList.add('mushroom');
    },
    setMushrooms: function() {
     for (var i = 0; i < this.rows; i++) {
        this.mushrooms.push({
          row: getRandomNumber(this.rows),
          column: getRandomNumber(this.columns)
        });
     }
    },
    renderMushrooms: function() {
      this.setMushrooms();
      for (var i = 0; i < this.mushrooms.length; i++) {
        this.addMushroom(this.mushrooms[i].row, this.mushrooms[i].column, i);
      }
    },
    renderMario: function() {
      var mario = this.getCell(0, 0)
      if (this.mushroomExists(0, 0)) { 
        this.removeMushroom(0, 0);
        mario.classList.remove('mushroom');
      }
      mario.classList.add('mario');
    },
    mushroomExists: function(row, column) {
      var cell = this.getCell(row, column);
      return cell.classList.contains('mushroom');
    },
    removeMushroom: function(row, column) {
      this.mushrooms = this.mushrooms.filter(function(mushroom) {
        return JSON.stringify(mushroom) !== JSON.stringify({row: row, column: column});
      });
    },
    moveMario: function(direction) {
      if (this.gameOver) {
        return;
      }
      var position;
      switch(direction) {
        case 40: // down
          position = this.newPosition('row', '+');
          break;
        case 38: // up
          position = this.newPosition('row', '-');
          break;
        case 39:  // right
          position = this.newPosition('column', '+');
          break;
        case 37: // left
          position = this.newPosition('column', '-');
          break;
        default:
          return;
      }
      this.updateMario(position);
      
    },
    newPosition: function(key, operator) {
      var otherKey = key === 'row' ? 'column' : 'row';
      var newValue = operator === '+' ? this.position[key] + 1 : this.position[key] - 1;
      var obj = {};
      obj[key] = newValue;
      obj[otherKey] = this.position[otherKey];
      if (obj && (obj.row < 0 ||
        obj.row > this.rows - 1 ||
        obj.column < 0 ||
        obj.column > this.columns - 1)) {
        return this.goThroughCords(obj, key, operator);
      }
      return obj;
    },
    goThroughCords (position, key, operator) {
      const otherKey = key === 'row' ? 'columns' : 'rows';
      position[key] = operator === '+' ? 0 : this[otherKey] - 1;
      return position;
    },
    updateMario: function(position) {
      this.getCell(this.position.row, this.position.column).classList.remove('mario');
      var newCell = this.getCell(position.row, position.column);
      newCell.classList.add('mario');
      if (this.mushroomExists(position.row, position.column)) {
        this.removeMushroom(position.row, position.column);
        newCell.classList.remove('mushroom');
      }
      this.steps++;
      if (this.mushrooms.length === 0) {
        this.gameOver = true;
        alert('steps taken to eat ' + this.steps);
      }
      this.position = position;
  
    }
  }  

var mario = function(id) {
    board.init(id);
    document.addEventListener('keydown', function(event) {
        board.moveMario(event.keyCode);
    });
}



// draw a board
// draw mushrooms
