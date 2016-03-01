
// blech
window.CANNON = require('cannon')

// add voxels shape type to cannon
require('./addVoxels')(CANNON)

// new voxels shape type class
var VoxelShape = require('./voxels')

// demo code
var shell = require('game-shell')({ preventDefault: false, })
var voxels = require('./voxelData')()


var useVoxel = false
var numballs = 1
var voxelRest = 0


// voxels.set(8, 1, 8, 1)
// voxels.set(12, 1, 8, 1)




var test

shell.on('init', function() {
	canvas = document.createElement('canvas')
	canvas.width = 400
	canvas.height = 300
	shell.element.appendChild(canvas)
	test = new Test(canvas)
})


function Test(canvas) {
	var engine = new BABYLON.Engine(canvas, true)
	var scene = new BABYLON.Scene(engine)
	scene.clearColor = new BABYLON.Color3(.8, .8, .9)
	var camera = new BABYLON.ArcRotateCamera('cam', .5, 1.1, 35, BABYLON.Vector3.Zero(), scene)
	// var camera = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 5, -10), scene)
	camera.setTarget(new BABYLON.Vector3(7, 4, 7))
	camera.attachControl(canvas, true)
	var light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
	light.intensity = .5

	// physics
	scene.enablePhysics(new BABYLON.Vector3(0, -10, 0),
		new BABYLON.CannonJSPlugin(false, 10))

	// add balls
	for (var i = 0; i < numballs; i++) addBall(scene)

	// 
	this.engine = engine
	this.scene = scene
	window.scene = scene
	var world = scene.getPhysicsEngine()._physicsPlugin.world
	this.world = world
	window.world = world

	// add voxel physics bodies and/or models
	messWithPhysics(world)
}



function addBall(scene) {
	var size = 1.5
	var s = BABYLON.Mesh.CreateSphere('sphere', 8, size, scene)
	s.position.copyFromFloats(
		3.55, 3, 3.6
	)
	s.setPhysicsState({
		impostor: BABYLON.PhysicsEngine.SphereImpostor,
		mass: 1.0,
		restitution: voxelRest,
	})
}


function messWithPhysics(world) {

	if (useVoxel) {
		// add custom voxel shape/body
		var body = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(0, 0, 0),
			shape: new VoxelShape(function(i, j, k) {
				return voxels.get(i, j, k)
			}),
			material: new CANNON.Material({
				restitution: voxelRest,
				friction: 0,
			}),
		});
		world.addBody(body);
	}

	// add models and/or sphere bodies
	var mat = new CANNON.Material({
		restitution: voxelRest,
		friction: 0,
	})

	var size = voxels.size
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				var val = voxels.get(i, j, k)
				if (val) {
					var sph = BABYLON.Mesh.CreateSphere('', 8, 1, scene)
					sph.position.copyFromFloats(i + 0.5, j + 0.5, k + 0.5)

					if (!useVoxel) {
						var body = new CANNON.Body({
							mass: 0,
							position: new CANNON.Vec3(i + 0.5, 0.5, k + 0.5),
							shape: new CANNON.Sphere(0.5),
							material: mat,
						});
						world.addBody(body)
					}
				}
			}
		}
	}




}





/*******************************************/

shell.on('tick', function() {

})


var ct = 0
var logtimes = 50
shell.on('render', function(frame_time) {
	// if (ct++ > 500) return
	test.scene.render()
	if (world.contacts.length && logtimes-- > 0) {
		console.log('contacts: ', world.contacts.length)
		world.contacts.forEach(function(c) {
			console.log(cdat(c))
		})
	}
})

function cdat(c) {
	var pi = c.bi.position.vadd(c.ri)
	var pj = c.bj.position.vadd(c.rj)
	return [
		'    ni: ' + vecstr(c.ni),
		'    bi.pos+ri: ' + vecstr(pi),
		'    bj.pos+rj: ' + vecstr(pj),
		'    diff: ' + vecstr(pi.vsub(pj)),
		'---------'
	].join('\n')
}

function vecstr(v) {
	return v.x.toFixed(5) + ', ' +
		v.y.toFixed(5) + ', ' +
		v.z.toFixed(5)
}



