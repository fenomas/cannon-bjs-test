
module.exports = function(_CANNON) {

	CANNON.Shape.types.VOXELS = 512



	var Narrowphase = CANNON.Narrowphase
	var Shape = CANNON.Shape


	/**
	 * @method sphereVoxels
	 * @param  {Shape}      si
	 * @param  {Shape}      sj
	 * @param  {Vec3}       xi
	 * @param  {Vec3}       xj
	 * @param  {Quaternion} qi
	 * @param  {Quaternion} qj
	 * @param  {Body}       bi
	 * @param  {Body}       bj
	 */
	Narrowphase.prototype[Shape.types.SPHERE | Shape.types.VOXELS] =
		Narrowphase.prototype.sphereVoxels = sphereVoxels_impl
	function sphereVoxels_impl(si, sj, xi, xj, qi, qj, bi, bj) {
		// sphere is i, voxels is j
		var i0 = Math.floor(xi.x - si.radius)
		var i1 = Math.floor(xi.x + si.radius)
		var j0 = Math.floor(xi.y - si.radius)
		var j1 = Math.floor(xi.y + si.radius)
		var k0 = Math.floor(xi.z - si.radius)
		var k1 = Math.floor(xi.z + si.radius)
		var query = sj.query


		for (var i = i0; i < i1; ++i) {
			for (var j = j0; j < j1; ++j) {
				for (var k = k0; k < k1; ++k) {
					if (!query(i, j, k)) continue

					// implement as sphere-Sphere

					// distance check
					var vpos = new CANNON.Vec3()
					vpos.set(i + 0.5, j + 0.5, k + 0.5)
					var radsum = si.radius + 0.5
					if (xi.distanceSquared(vpos) > radsum * radsum) continue

					deferToSphereSphere(this, si, sj, xi, vpos, qi, qj, bi, bj)

					// manualSphereSphere(this, si, sj, xi, vpos, qi, qj, bi, bj)


				}
			}
		}
	}

}



function deferToSphereSphere(self, si, sj, xi, xj, qi, qj, bi, bj) {
	sj.radius = 0.5
	
	self.sphereSphere(si, sj, xi, xj, qi, qj, bi, bj)
}

function manualSphereSphere(self, si, sj, xi, xj, qi, qj, bi, bj) {
	sj.radius = 0.5
	
	// copied from sphereSphere
	var r = self.createContactEquation(bi, bj, si, sj);

    // Contact normal
    xj.vsub(xi, r.ni);
    r.ni.normalize();

    // Contact point locations
    r.ri.copy(r.ni);
    r.rj.copy(r.ni);
    r.ri.mult(si.radius, r.ri);
    r.rj.mult(-sj.radius, r.rj);

    r.ri.vadd(xi, r.ri);
    r.ri.vsub(bi.position, r.ri);

    r.rj.vadd(xj, r.rj);
    r.rj.vsub(bj.position, r.rj);

    self.result.push(r);
	
    self.createFrictionEquationsFromContact(r, self.frictionResult);
}

