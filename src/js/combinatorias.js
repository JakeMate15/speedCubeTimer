var aux = (function() {
    var fact = [1];

	for (var i = 0; i < 32; ++i) {
		fact[i + 1] = fact[i] * (i + 1);
	}

    function getNPerm(arr, n) {
		var i, idx, j;
		idx = 0;
		for (i = 0; i < n; ++i) {
			idx *= n - i;
			for (j = i + 1; j < n; ++j) {
				arr[j] < arr[i] && ++idx;
			}
		}
		return idx;
	}


    function setNPerm(arr, idx, n) {
		var i, j;
		arr[n - 1] = 0;
		for (i = n - 2; i >= 0; --i) {
			arr[i] = idx % (n - i);
			idx = ~~(idx / (n - i));
			for (j = i + 1; j < n; ++j) {
				arr[j] >= arr[i] && ++arr[j];
			}
		}
	}

    function set8Perm(arr, idx, n, even) {
		n = (n || 8) - 1;
		var val = 0x76543210;
		var prt = 0;
		if (even < 0) {
			idx <<= 1;
		}
		for (var i = 0; i < n; ++i) {
			var p = fact[n - i];
			var v = ~~(idx / p);
			prt ^= v;
			idx %= p;
			v <<= 2;
			arr[i] = val >> v & 7;
			var m = (1 << v) - 1;
			val = (val & m) + (val >> 4 & ~m);
		}
		if (even < 0 && (prt & 1) != 0) {
			arr[n] = arr[n - 1];
			arr[n - 1] = val & 7;
		} else {
			arr[n] = val & 7;
		}
		return arr;
	}

    function getNParity(idx, n) {
		var i, p;
		p = 0;
		for (i = n - 2; i >= 0; --i) {
			p ^= idx % (n - i);
			idx = ~~(idx / (n - i));
		}
		return p & 1;
	}

    var randGen = (function() {
		var rndFunc;
		var rndCnt;
		var seedStr;

		function random() {
			rndCnt++;
			return rndFunc();
		}

		function getSeed() {
			return [rndCnt, seedStr];
		}

		function setSeed(_rndCnt, _seedStr) {
			if (_seedStr && (_seedStr != seedStr || rndCnt > _rndCnt)) {
				var seed = [];
				for (var i = 0; i < _seedStr.length; i++) {
					seed[i] = _seedStr.charCodeAt(i);
				}
				rndFunc = new MersenneTwisterObject(seed[0], seed);
				rndCnt = 0;
				seedStr = _seedStr;
			}
			while (rndCnt < _rndCnt) {
				rndFunc();
				rndCnt++;
			}
		}

		// setSeed(0, '1576938267035');
		setSeed(0, '' + new Date().getTime());

		return {
			random: random,
			getSeed: getSeed,
			setSeed: setSeed
		};
	})();


    function rn(n) {
		return ~~(randGen.random() * n)
	}

    function rndEl(x) {
		return x[~~(randGen.random() * x.length)];
	}

    return{
        fact: fact,
        setNPerm: setNPerm,
        getNPerm: getNPerm,
        set8Perm: set8Perm,
        rn: rn,
        getSeed: randGen.getSeed,
		setSeed: randGen.setSeed,
        getNParity: getNParity,
        rndEl: rndEl,
    }
    
})();