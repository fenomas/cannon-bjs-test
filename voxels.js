module.exports = Voxels;

var Shape = CANNON.Shape // require('cannon/src/shapes/Shape');
var Vec3 =  CANNON.Vec3 // require('cannon/src/math/Vec3');

function Voxels(queryFn) {
	Shape.call(this);

	/**
	 * @property {Function} query
	 */
	this.query = queryFn
	this.type = Shape.types.VOXELS;

	// remove
	this.radius = 10;

	if (!queryFn) {
		throw new Error('Voxel shape needs a voxel-solidity query function.');
	}

	this.updateBoundingSphereRadius();
}
Voxels.prototype = new Shape();
Voxels.prototype.constructor = Voxels;


Voxels.prototype.calculateLocalInertia = function(mass, target) {
	target = target || new Vec3();
	target.set(0, 0, 0);
	return target;
};

Voxels.prototype.volume = function() {
	// infinite terrain
	return Number.MAX_VALUE;
};

Voxels.prototype.updateBoundingSphereRadius = function() {
	// infinite terrain
	this.boundingSphereRadius = Number.MAX_VALUE;
};

Voxels.prototype.calculateWorldAABB = function(pos, quat, min, max) {
	// infinite terrain
	min.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
	max.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
};



