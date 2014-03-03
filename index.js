
module.exports = function(game){
  return new ObjectCollisionMonitor(game)
}

function ObjectCollisionMonitor(game){
  // add this to game as item
  this.game = game
  this.game.addItem(this)
}

var proto = ObjectCollisionMonitor.prototype

proto.tick = function(dt){
  var o1,o2
  // check n^2 game items for overlap

  // o1
  for (var i=0; i<this.game.items.length; i++){
    o1 = this.game.items[i]
    if (!this.isCollidable(o1)) continue

    // o2
    for (var j=0; j<this.game.items.length; j++){
      o2 = this.game.items[j]
      if (o1===o2) continue
      if (!this.isCollidable(o2)) continue

      // collision?
      if (this.collides(o1,o2)){
        this.game.emit('object-collision',o1,o2)
      }
      
    }
  } // end for
}

proto.isCollidable = function(object){
  return 'position' in object && 'aabb' in object
}

proto.collides = function(o1,o2){
  var aabb1 = o1.aabb()
  // var p1 = o1.position
  var aabb2 = o2.aabb()
  // var p2 = o2.position
  return aabb1.intersects(aabb2)
}

