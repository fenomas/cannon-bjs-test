
module.exports = function() {
	return new Voxels()
}


function Voxels() {
	var size = 16
	var arr = new Int8Array(size * size * size)
	// props
	this.arr = arr
	this.size = size
	this.size2 = size * size

	// init
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			for (var k = 0; k < size; k++) {
				var val = 0
				if (j==0) val = 1
				if (i==0 && j<9) val = 1
				if (k==0 && j<9) val = 1
				this.set(i, j, k, val)
			}
		}
	}
}

Voxels.prototype.set = function(x, y, z, val) {
	this.arr[x * this.size2 + y * this.size + z] = val
}
Voxels.prototype.get = function(x, y, z) {
	if (x<0 || y<0 || z<0) return 0
	var s = this.size - 1
	if (x>s || y>s || z>s) return 0
	return this.arr[x * this.size2 + y * this.size + z]
}






