function MersenneTwisterObject(seed, seedArray) {
	var N = 624,
		mask = 0xffffffff,
		mt = [],
		mti = NaN,
		m01 = [0, 0x9908b0df]
	var M = 397,
		N1 = N - 1,
		NM = N - M,
		MN = M - N,
		U = 0x80000000,
		L = 0x7fffffff,
		R = 0x100000000

	function dmul0(m, n) {
		var H = 0xffff0000,
			L = 0x0000ffff,
			R = 0x100000000,
			m0 = m & L,
			m1 = (m & H) >>> 16,
			n0 = n & L,
			n1 = (n & H) >>> 16,
			p0, p1, x
		p0 = m0 * n0, p1 = p0 >>> 16, p0 &= L, p1 += m0 * n1, p1 &= L, p1 += m1 * n0, p1 &= L, x = (p1 << 16) | p0
		return (x < 0 ? x + R : x)
	}

	function init0(seed) {
		var x = (arguments.length > 0 && isFinite(seed) ? seed & mask : 4357),
			i
		for (mt = [x], mti = N, i = 1; i < N; mt[i++] = x = (69069 * x) & mask) {}
	}

	function init(seed) {
		var x = (arguments.length > 0 && isFinite(seed) ? seed & mask : 5489),
			i
		for (mt = [x], mti = N, i = 1; i < N; mt[i] = x = dmul0(x ^ (x >>> 30), 1812433253) + i++) {}
	}

	function initByArray(seedArray, seed) {
		var N1 = N - 1,
			L = seedArray.length,
			x, i, j, k
		init(arguments.length > 1 && isFinite(seed) ? seed : 19650218)
		x = mt[0], i = 1, j = 0, k = Math.max(N, L)
		for (; k; j %= L, k--) {
			mt[i] = x = ((mt[i++] ^ dmul0(x ^ (x >>> 30), 1664525)) + seedArray[j] + j++) & mask
			if (i > N1) {
				mt[0] = x = mt[N1];
				i = 1
			}
		}
		for (k = N - 1; k; k--) {
			mt[i] = x = ((mt[i] ^ dmul0(x ^ (x >>> 30), 1566083941)) - i++) & mask
			if (i > N1) {
				mt[0] = x = mt[N1];
				i = 1
			}
		}
		mt[0] = 0x80000000
	}

	function skip(n) {
		mti = (n <= 0 ? -1 : mti + n)
	}

	function randomInt32() {
		var y, k
		while (mti >= N || mti < 0) {
			mti = Math.max(0, mti - N)
			for (k = 0; k < NM; y = (mt[k] & U) | (mt[k + 1] & L), mt[k] = mt[k + M] ^ (y >>> 1) ^ m01[y & 1], k++) {}
			for (; k < N1; y = (mt[k] & U) | (mt[k + 1] & L), mt[k] = mt[k + MN] ^ (y >>> 1) ^ m01[y & 1], k++) {}
			y = (mt[N1] & U) | (mt[0] & L), mt[N1] = mt[M - 1] ^ (y >>> 1) ^ m01[y & 1]
		}
		y = mt[mti++], y ^= (y >>> 11), y ^= (y << 7) & 0x9d2c5680, y ^= (y << 15) & 0xefc60000, y ^= (y >>> 18)
		return (y < 0 ? y + R : y)
	}

	function randomInt53() {
		var two26 = 0x4000000
		return (randomInt32() >>> 5) * two26 + (randomInt32() >>> 6)
	}

	function randomReal32() {
		var two32 = 0x100000000
		return randomInt32() / two32
	}

	function randomReal53() {
		var two53 = 0x20000000000000
		return randomInt53() / two53
	}

	function randomString(len) {
		var i, r, x = "",
			C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
		for (i = 0; i < len; x += C.charAt((((i++) % 5) > 0 ? r : r = randomInt32()) & 63), r >>>= 6) {};
		return x
	}
	if (arguments.length > 1) initByArray(seedArray, seed)
	else if (arguments.length > 0) init(seed)
	else init()
	return randomReal53;
}