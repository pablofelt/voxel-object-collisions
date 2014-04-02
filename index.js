
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
  this.ignore_objects = {}
}

var proto = ObjectCollisionMonitor.prototype

proto.pairKey = function(o1,o2){
  return [o1.toString(),o2.toString()].sort()
}

proto.tick = function(dt){
  var o1,o2,pairkey,prev,now,delta
  // check n^2 game items for overlap

  // o1
  for (var i=0; i<this.game.items.length; i++){
    o1 = this.game.items[i]
    if (!this.isCollidable(o1)) continue

    // o2
    for (var j=0; j<this.game.items.length; j++){
      // this is a symmetric matrix, so ignore 
      // the diagonal (self-self colisions don't make
      // sense) and all of the lower diagonal elements
      // to avoid repeat considerations
      if (j<=i) continue 

      o2 = this.game.items[j]
      if (!this.isCollidable(o2)) continue

      // check timeout for this pair
      pairkey = this.pairKey(o1,o2)
      prev = this.previous_collisions[pairkey] || 0
      now = Date.now()
      delta = now-prev
      if (delta > this.timeout){
        // collision?
        if (this.collides(o1,o2)){
          this.previous_collisions[pairkey] = Date.now()
          this.game.emit('object-collision',o1,o2)
        }
      }
      
    } // end for o2
  } // end for o1
}

proto.isCollidable = function(object){
  return 'position' in object 
    && 'aabb' in object 
    && !(object in this.ignore_objects)
}

proto.collides = function(o1,o2){
  var aabb1 = o1.aabb()
  var aabb2 = o2.aabb()
  return aabb1.intersects(aabb2)
}

proto.ignoreObject = function(object){
  this.ignore_objects[object] = true
}

// Ignore interations betwen o1 and o2 for the specified 
// amount of time. Duration overrides the default timeout.
proto.ignoreCollisions = function(duration,o1,o2){
  var adjusted_ts = Date.now() - this.timeout + duration
  this.previous_collisions[this.pairKey(o1,o2)] = adjusted_ts
}

