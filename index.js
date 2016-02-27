
// blech
window.CANNON = require('cannon')

var shell = require('game-shell')({
	preventDefault: false,
})

var test

var voxels = require('./voxels')()

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
	var ground = BABYLON.Mesh.CreateGround('ground', 50, 50, 2, scene)
	ground.position.copyFromFloats(8, -20, 8)

	// voxels (models only, no physics)
	setupVoxelModels(scene)

	// physics
	scene.enablePhysics(new BABYLON.Vector3(0, -10, 0),
		new BABYLON.CannonJSPlugin(false, 3))
	ground.setPhysicsState({
		impostor: BABYLON.PhysicsEngine.BoxImpostor,
		mass: 0,
		friction: 0.5,
		restitution: 0.9,
	})
	// stuff
	for (var i = 0; i < 20; i++) addBall(scene)

	// 
	this.engine = engine
	this.scene = scene
}

function setupVoxelModels(scene) {
	var size = voxels.size
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				var val = voxels.get(i, j, k)
				if (val) {
					var box = BABYLON.Mesh.CreateBox('', 1, scene)
					box.position.copyFromFloats(i, j, k)
				}
			}
		}
	}
}


function addBall(scene) {
	var size = 0.25 * Math.random()
	var s = BABYLON.Mesh.CreateSphere('sphere', 8, 1 + size, scene)
	s.position.copyFromFloats(
		1 + 14 * Math.random(),
		5 + 5 * Math.random(),
		1 + 14 * Math.random()
	)
	s.setPhysicsState({
		impostor: BABYLON.PhysicsEngine.SphereImpostor,
		mass: 0.5,
		restitution: .5 * Math.random(),
	})
}



shell.on('tick', function() {

})


shell.on('render', function(frame_time) {
	test.scene.render()
})



