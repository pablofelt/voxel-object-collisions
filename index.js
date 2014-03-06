
module.exports = function(game,opts){
  return new ObjectCollisionMonitor(game,opts)
}

function ObjectCollisionMonitor(game,opts){
  opts = opts || {}
  // add this to game as item
  this.game = game
  this.game.addItem(this)
  this.timeout = opts.timeout || 0
  this.previous_collisions = {}
}

var proto = ObjectCollisionMonitor.prototype

proto.pairKey = function(o1,o2){
  return [o1.toString,o2.toString].sort()
}

proto.tick = function(dt){
  var o1,o2,pairkey,prev
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

      // check timeout for this pair
      pairkey = this.pairKey(o1,o2)
      prev = this.previous_collisions[pairkey] || 0
      if (Date.now()-prev > this.timeout){
        // collision?
        if (this.collides(o1,o2)){
          this.game.emit('object-collision',o1,o2)
          this.previous_collisions[pairkey] = Date.now()
        }
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

