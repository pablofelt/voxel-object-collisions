voxel-object-collisions
=======================

Causes voxeljs games to emit 'object-collision' events. This can disappear after object-object collisions are implemented in the main voxeljs framework.

Monitors all game items that have position and aabb attributes.

Usage
=======================

game = require('voxel-engine').createGame()

// start monitoring
require('voxel-object-collisions')(game)

game.on('object-collision',function(object1,object2){
  // do something
})

