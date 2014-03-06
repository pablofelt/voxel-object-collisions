voxel-object-collisions
=======================

Causes voxeljs games to emit 'object-collision' events. This can disappear after object-object collisions are implemented in the main voxeljs framework.

Monitors collisions among all game items that have a position property and aabb() function. A timeout may be set via opts so that collisions between the same two objects are not reported until more than timeout milliseconds after the previous collision between those same two objects. The uniqueness of objects is determined by their toString() method. So timeout will only be effective if you override this method on all game items with position and aabb().

Usage
=======================

game = require('voxel-engine').createGame()

// start monitoring
require('voxel-object-collisions')(game,{'timeout':1000})

game.on('object-collision',function(object1,object2){
  // do something
})

