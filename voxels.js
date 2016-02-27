
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
				var val = (j < 2) ? 1 : 0
				if (j == 2) {
					if (Math.random() < 0.3) val = 1
				}
				if (j == 3) {
					if (i*k==0 || i==15 || k==15) val = 1
				}
				this.set(i, j, k, val)
			}
		}
	}
}

Voxels.prototype.set = function(x, y, z, val) {
	this.arr[x * this.size2 + y * this.size + z] = val
}
Voxels.prototype.get = function(x, y, z) {
	return this.arr[x * this.size2 + y * this.size + z]
}






