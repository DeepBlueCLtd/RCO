import {
	h as Oa,
	am as po,
	r as l,
	aA as go,
	aB as wa,
	aC as Ca,
	aD as Ta,
	aE as Sa,
	aF as Ea,
	aG as $a,
	aH as vo,
	aI as rt,
	aJ as bo,
	aK as Ia,
	ay as mo,
	aL as Ra,
	aM as ka,
	aN as Ht,
	an as ye,
	aO as Fa,
	aP as Aa,
	aQ as ho,
	aR as yo,
	aS as Na,
	aT as _o,
	aU as xo,
	aV as ja,
	aW as Po,
	aX as Oo,
	aY as qt,
	aZ as La,
	b as wo,
	a_ as Ut,
	a$ as at,
	b0 as Co,
	u as To,
	a as X,
	c as K,
	d as nt,
	f as Ma,
	g as So,
	i as Eo,
	n as $o,
	b1 as fe,
	k as R,
	P as le,
	N as ie,
	s as j,
	b2 as Ba,
	Q as W,
	_ as I,
	Z as Y,
	U as se,
	K as Z,
	j as N,
	M as ce,
	b3 as Wt,
	b4 as Io,
	at as Da,
	Y as ot,
	$ as za,
	a0 as Ro,
	b5 as ve,
	ae as lt,
	b6 as ko,
	b7 as Pe,
	b8 as hr,
	b9 as Fo,
	ba as Ao,
	o as Te,
	q as Se,
	t as Ee,
	w as Va,
	ad as Ha,
	L as yr,
	p as i,
	B as Ne,
	bb as No,
	l as qa,
	al as _r,
	bc as Gt,
	ak as J,
	v as jo,
	R as Lo,
	ao as Mo,
	aa as Ot,
	ax as Bo,
	bd as Kt,
	X as ze,
	x as Do,
	be as it,
	bf as Ua,
	bg as zo,
	bh as Vo,
	bi as Qt,
	bj as Wa,
	bk as Ga,
	bl as Ho,
	bm as qo,
	bn as Uo,
	bo as Wo,
	bp as Go,
	bq as Ko,
	br as Qo,
	bs as Xo,
	bt as Jo,
	a1 as Yo,
	bu as Zo,
	bv as el,
	a6 as Ve,
	bw as Me,
	bx as tl,
	y as Ka,
	T as rl,
	by as Qa,
	bz as al,
	C as nl,
} from './index-091859a0.js';
import { a as Xt, d as Jt, u as Xa } from './useResourceDefinition-e2399b95.js';
import {
	h as ol,
	_ as ll,
	a as il,
	p as Yt,
	u as sl,
	S as cl,
	C as ul,
	d as Ja,
	D as Ya,
	b as Za,
	c as en,
	e as tn,
	f as dl,
} from './Confirm-edcfa802.js';
import { T as rn } from './TopToolbar-a353fcbf.js';
import { q as Zt } from './index-fa9b5ce0.js';
var Oe =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Oe =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Oe.apply(this, arguments)
			);
		},
	fl = function (e, t, r) {
		t === void 0 && (t = {});
		var a = t.pagination,
			n = a === void 0 ? { page: 1, perPage: 25 } : a,
			o = t.sort,
			c = o === void 0 ? { field: 'id', order: 'DESC' } : o,
			u = t.filter,
			d = u === void 0 ? {} : u,
			s = t.meta,
			f = Xt(),
			p = Oa(),
			g = po(
				[e, 'getList', { pagination: n, sort: c, filter: d, meta: s }],
				function () {
					return f
						.getList(e, { pagination: n, sort: c, filter: d, meta: s })
						.then(function (b) {
							var x = b.data,
								y = b.total,
								v = b.pageInfo;
							return { data: x, total: y, pageInfo: v };
						});
				},
				Oe(Oe({}, r), {
					onSuccess: function (b) {
						var x = b.data;
						x.forEach(function (y) {
							p.setQueryData(
								[e, 'getOne', { id: String(y.id), meta: s }],
								function (v) {
									return v ?? y;
								}
							);
						}),
							r != null && r.onSuccess && r.onSuccess(b);
					},
				})
			);
		return l.useMemo(
			function () {
				var b, x, y;
				return g.data
					? Oe(Oe({}, g), {
							data: (b = g.data) === null || b === void 0 ? void 0 : b.data,
							total: (x = g.data) === null || x === void 0 ? void 0 : x.total,
							pageInfo:
								(y = g.data) === null || y === void 0 ? void 0 : y.pageInfo,
					  })
					: g;
			},
			[g]
		);
	};
function pl(e, t, r, a) {
	for (var n = e.length, o = r + (a ? 1 : -1); a ? o-- : ++o < n; )
		if (t(e[o], o, e)) return o;
	return -1;
}
var gl = pl;
function vl(e) {
	return e !== e;
}
var bl = vl;
function ml(e, t, r) {
	for (var a = r - 1, n = e.length; ++a < n; ) if (e[a] === t) return a;
	return -1;
}
var hl = ml,
	yl = gl,
	_l = bl,
	xl = hl;
function Pl(e, t, r) {
	return t === t ? xl(e, t, r) : yl(e, _l, r);
}
var Ol = Pl,
	wl = Ol;
function Cl(e, t) {
	var r = e == null ? 0 : e.length;
	return !!r && wl(e, t, 0) > -1;
}
var an = Cl;
function Tl(e, t, r) {
	for (var a = -1, n = e == null ? 0 : e.length; ++a < n; )
		if (r(t, e[a])) return !0;
	return !1;
}
var nn = Tl;
function Sl() {}
var El = Sl,
	vt = go,
	$l = El,
	Il = wa,
	Rl = 1 / 0,
	kl =
		vt && 1 / Il(new vt([, -0]))[1] == Rl
			? function (e) {
					return new vt(e);
			  }
			: $l,
	Fl = kl,
	Al = Ca,
	Nl = an,
	jl = nn,
	Ll = Ta,
	Ml = Fl,
	Bl = wa,
	Dl = 200;
function zl(e, t, r) {
	var a = -1,
		n = Nl,
		o = e.length,
		c = !0,
		u = [],
		d = u;
	if (r) (c = !1), (n = jl);
	else if (o >= Dl) {
		var s = t ? null : Ml(e);
		if (s) return Bl(s);
		(c = !1), (n = Ll), (d = new Al());
	} else d = t ? [] : u;
	e: for (; ++a < o; ) {
		var f = e[a],
			p = t ? t(f) : f;
		if (((f = r || f !== 0 ? f : 0), c && p === p)) {
			for (var g = d.length; g--; ) if (d[g] === p) continue e;
			t && d.push(p), u.push(f);
		} else n(d, p, r) || (d !== u && d.push(p), u.push(f));
	}
	return u;
}
var Vl = zl,
	Hl = Ea,
	ql = Sa,
	Ul = Vl,
	Wl = $a,
	Gl = ql(function (e) {
		return Ul(Hl(e, 1, Wl, !0));
	}),
	Kl = Gl,
	Ql = vo,
	Xl = function () {
		return Ql.Date.now();
	},
	Jl = Xl,
	Yl = /\s/;
function Zl(e) {
	for (var t = e.length; t-- && Yl.test(e.charAt(t)); );
	return t;
}
var ei = Zl,
	ti = ei,
	ri = /^\s+/;
function ai(e) {
	return e && e.slice(0, ti(e) + 1).replace(ri, '');
}
var ni = ai,
	oi = ni,
	xr = rt,
	li = bo,
	Pr = 0 / 0,
	ii = /^[-+]0x[0-9a-f]+$/i,
	si = /^0b[01]+$/i,
	ci = /^0o[0-7]+$/i,
	ui = parseInt;
function di(e) {
	if (typeof e == 'number') return e;
	if (li(e)) return Pr;
	if (xr(e)) {
		var t = typeof e.valueOf == 'function' ? e.valueOf() : e;
		e = xr(t) ? t + '' : t;
	}
	if (typeof e != 'string') return e === 0 ? e : +e;
	e = oi(e);
	var r = si.test(e);
	return r || ci.test(e) ? ui(e.slice(2), r ? 2 : 8) : ii.test(e) ? Pr : +e;
}
var fi = di,
	pi = rt,
	bt = Jl,
	Or = fi,
	gi = 'Expected a function',
	vi = Math.max,
	bi = Math.min;
function mi(e, t, r) {
	var a,
		n,
		o,
		c,
		u,
		d,
		s = 0,
		f = !1,
		p = !1,
		g = !0;
	if (typeof e != 'function') throw new TypeError(gi);
	(t = Or(t) || 0),
		pi(r) &&
			((f = !!r.leading),
			(p = 'maxWait' in r),
			(o = p ? vi(Or(r.maxWait) || 0, t) : o),
			(g = 'trailing' in r ? !!r.trailing : g));
	function b(_) {
		var O = a,
			T = n;
		return (a = n = void 0), (s = _), (c = e.apply(T, O)), c;
	}
	function x(_) {
		return (s = _), (u = setTimeout(m, t)), f ? b(_) : c;
	}
	function y(_) {
		var O = _ - d,
			T = _ - s,
			S = t - O;
		return p ? bi(S, o - T) : S;
	}
	function v(_) {
		var O = _ - d,
			T = _ - s;
		return d === void 0 || O >= t || O < 0 || (p && T >= o);
	}
	function m() {
		var _ = bt();
		if (v(_)) return P(_);
		u = setTimeout(m, y(_));
	}
	function P(_) {
		return (u = void 0), g && a ? b(_) : ((a = n = void 0), c);
	}
	function w() {
		u !== void 0 && clearTimeout(u), (s = 0), (a = d = n = u = void 0);
	}
	function C() {
		return u === void 0 ? c : P(bt());
	}
	function h() {
		var _ = bt(),
			O = v(_);
		if (((a = arguments), (n = this), (d = _), O)) {
			if (u === void 0) return x(d);
			if (p) return clearTimeout(u), (u = setTimeout(m, t)), b(d);
		}
		return u === void 0 && (u = setTimeout(m, t)), c;
	}
	return (h.cancel = w), (h.flush = C), h;
}
var hi = mi;
function wr(e, t) {
	return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var on = function (e, t) {
		if (wr(e, t)) return !0;
		if (
			typeof e != 'object' ||
			e === null ||
			typeof t != 'object' ||
			t === null
		)
			return !1;
		var r = Object.keys(e),
			a = Object.keys(t);
		if (r.length !== a.length) return !1;
		for (var n = 0; n < r.length; n++)
			if (
				!Object.prototype.hasOwnProperty.call(t, r[n]) ||
				!wr(e[r[n]], t[r[n]])
			)
				return !1;
		return !0;
	},
	He =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(He =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				He.apply(this, arguments)
			);
		},
	yi = function (e) {
		return e && Object.prototype.toString.call(e) === '[object Object]';
	},
	_i = function (e) {
		return e instanceof Date
			? !1
			: e === '' || e === null || e === void 0 || on(e, {});
	},
	ln = function (e) {
		return Object.keys(e).reduce(function (t, r) {
			var a,
				n = e[r];
			return (
				yi(e[r]) && (n = ln(e[r])),
				_i(n) ? t : He(He({}, t), ((a = {}), (a[r] = n), a))
			);
		}, {});
	};
const wt = ln;
var Cr = function (e, t) {
		return Object.keys(e).reduce(function (r, a) {
			var n;
			return a !== t ? Object.assign({}, r, ((n = {}), (n[a] = e[a]), n)) : r;
		}, {});
	},
	sn = function (e, t) {
		var r,
			a = t.split('.');
		if (a.length === 1) return Cr(e, t);
		var n = a[0];
		if (e[n] === void 0) return e;
		var o = sn(e[n], a.slice(1).join('.'));
		return Object.keys(o).length === 0
			? Cr(e, n)
			: Object.assign({}, e, ((r = {}), (r[n] = o), r));
	};
const xi = sn;
var q =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(q =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				q.apply(this, arguments)
			);
		},
	cn = 'SET_SORT',
	st = 'ASC',
	Tr = 'DESC',
	Ct = 'SET_PAGE',
	un = 'SET_PER_PAGE',
	Tt = 'SET_FILTER',
	dn = 'SHOW_FILTER',
	fn = 'HIDE_FILTER',
	Pi = function (e) {
		return e === Tr ? st : Tr;
	},
	Oi = function (e, t) {
		var r;
		switch (t.type) {
			case cn:
				return t.payload.field === e.sort
					? q(q({}, e), { order: Pi(e.order), page: 1 })
					: q(q({}, e), {
							sort: t.payload.field,
							order: t.payload.order || st,
							page: 1,
					  });
			case Ct:
				return q(q({}, e), { page: t.payload });
			case un:
				return q(q({}, e), { page: 1, perPage: t.payload });
			case Tt:
				return q(q({}, e), {
					page: 1,
					filter: t.payload.filter,
					displayedFilters: t.payload.displayedFilters
						? t.payload.displayedFilters
						: e.displayedFilters,
				});
			case dn:
				return e.displayedFilters && e.displayedFilters[t.payload.filterName]
					? e
					: q(q({}, e), {
							filter:
								typeof t.payload.defaultValue < 'u'
									? Ia(e.filter, t.payload.filterName, t.payload.defaultValue)
									: e.filter,
							displayedFilters: q(
								q({}, e.displayedFilters),
								((r = {}), (r[t.payload.filterName] = !0), r)
							),
					  });
			case fn:
				return q(q({}, e), {
					filter: wt(xi(e.filter, t.payload)),
					displayedFilters: e.displayedFilters
						? Object.keys(e.displayedFilters).reduce(function (a, n) {
								var o;
								return n !== t.payload
									? q(q({}, a), ((o = {}), (o[n] = !0), o))
									: a;
						  }, {})
						: e.displayedFilters,
				});
			default:
				return e;
		}
	};
const Sr = Oi;
var pn = `
`,
	pe = {};
pe.isFunction = function (e) {
	var t = {};
	return e && t.toString.call(e) === '[object Function]';
};
pe.isArray = function (e) {
	return Array.isArray(e);
};
pe.isObject = function (e) {
	return e instanceof Object;
};
pe.isString = function (e) {
	return typeof e == 'string';
};
pe.isNumber = function (e) {
	return typeof e == 'number';
};
pe.isBoolean = function (e) {
	return typeof e == 'boolean';
};
pe.isDate = function (e) {
	return e instanceof Date;
};
var wi = pn,
	Ci = pe,
	Ti = function (t, r) {
		if (!t || !Ci.isArray(t))
			throw new TypeError(
				'Invalid params "rows" for joinRows. Must be an array of string.'
			);
		var a = t.join(
			r ||
				wi ||
				`
`
		);
		return a;
	},
	gn =
		typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
			? function (e) {
					return typeof e;
			  }
			: function (e) {
					return e &&
						typeof Symbol == 'function' &&
						e.constructor === Symbol &&
						e !== Symbol.prototype
						? 'symbol'
						: typeof e;
			  },
	Si = (function () {
		function e(t, r) {
			for (var a = 0; a < r.length; a++) {
				var n = r[a];
				(n.enumerable = n.enumerable || !1),
					(n.configurable = !0),
					'value' in n && (n.writable = !0),
					Object.defineProperty(t, n.key, n);
			}
		}
		return function (t, r, a) {
			return r && e(t.prototype, r), a && e(t, a), t;
		};
	})();
function Ei(e, t) {
	if (!(e instanceof t))
		throw new TypeError('Cannot call a class as a function');
}
var mt = pe,
	$i = (function () {
		function e(t) {
			Ei(this, e),
				(this._options = t),
				(this._options.typeHandlers = this._options.typeHandlers || {});
		}
		return (
			Si(e, [
				{
					key: '_setHeaders',
					value: function (r, a) {
						var n = this;
						return a
							? r.map(function (o) {
									return (
										(o.item = o.item
											? a + n._options.headerPathString + o.item
											: a),
										o
									);
							  })
							: r;
					},
				},
				{
					key: 'castValue',
					value: function (r, a, n, o) {
						var c = this._options.typeHandlers;
						for (var u in c)
							if (ki(r, u)) {
								r = c[u].call(c, r, n, o);
								break;
							}
						return r;
					},
				},
				{
					key: 'checkComplex',
					value: function (r, a) {
						if (mt.isDate(r))
							return [
								{
									item: a,
									value: (this._options.handleDate || this._handleDate)(r, a),
								},
							];
						if (mt.isArray(r)) {
							var n = this._handleArray(r, a);
							return this._setHeaders(n, a);
						} else if (mt.isObject(r)) {
							var o = this._handleObject(r);
							return this._setHeaders(o, a);
						}
						return [{ item: a, value: '' }];
					},
				},
				{
					key: 'check',
					value: function (r, a, n, o) {
						switch (
							((r = this.castValue(r, a, n, o)),
							typeof r > 'u' ? 'undefined' : gn(r))
						) {
							case 'string':
								return [{ item: a, value: this._handleString(r, a) }];
							case 'number':
								return [{ item: a, value: this._handleNumber(r, a) }];
							case 'boolean':
								return [
									{ item: a, value: this._handleBoolean.bind(this)(r, a) },
								];
						}
						return this.checkComplex(r, a);
					},
				},
				{
					key: '_handleObject',
					value: function (r) {
						var a = [];
						for (var n in r) {
							var o = r[n],
								c = this.check(o, n, n, r);
							a = a.concat(c);
						}
						return a;
					},
				},
				{
					key: '_handleArray',
					value: function (r) {
						for (var a = this, n = [], o, c = 0; c < r.length; ++c) {
							var u = r[c],
								d = a.check(u, null, c, r);
							if (d.length !== 0) {
								var s = d[0];
								if (!s.item && o !== void 0) {
									o.value += a._options.arrayPathString + s.value;
									continue;
								} else d.length > 0 && !s.item && o === void 0 && (o = s);
								n = n.concat(d);
							}
						}
						return n;
					},
				},
				{
					key: '_handleBoolean',
					value: function (r) {
						var a;
						return (
							r
								? (a = this._options.booleanTrueString || 'true')
								: (a = this._options.booleanFalseString || 'false'),
							a
						);
					},
				},
				{
					key: '_handleString',
					value: function (r) {
						return r;
					},
				},
				{
					key: '_handleNumber',
					value: function (r) {
						return r;
					},
				},
				{
					key: '_handleDate',
					value: function (r) {
						return r.toLocaleDateString();
					},
				},
			]),
			e
		);
	})(),
	Ii = $i,
	Ri = typeof window > 'u' ? mo : window;
function ki(e, t) {
	if (e instanceof Ri[t]) return !0;
	switch (typeof e > 'u' ? 'undefined' : gn(e)) {
		case 'string':
			return t === 'String';
		case 'boolean':
			return t === 'Boolean';
		case 'number':
			return t === 'Number';
	}
	return !1;
}
var ht, Er;
function Fi() {
	return (
		Er ||
			((Er = 1),
			(ht = function (t, r, a) {
				var n = `
`;
				if (typeof t != 'string')
					throw new TypeError(
						'Invalid param "textDelimiter", must be a string.'
					);
				if (typeof r != 'string')
					throw new TypeError(
						'Invalid param "rowDelimiter", must be a string.'
					);
				var o = new RegExp('\\' + t, 'g'),
					c = t + t,
					u =
						t === '"'
							? function (d) {
									return (
										d.indexOf(r) >= 0 ||
										d.indexOf(n) >= 0 ||
										d.indexOf('"') >= 0
									);
							  }
							: function (d) {
									return d.indexOf(r) >= 0 || d.indexOf(n) >= 0;
							  };
				return function (d) {
					return (
						a && (d = '' + d),
						d.replace &&
							((d = d.replace(o, c)), (a || u(d)) && (d = t + d + t)),
						d
					);
				};
			})),
		ht
	);
}
var Ai = (function () {
	function e(t, r) {
		for (var a = 0; a < r.length; a++) {
			var n = r[a];
			(n.enumerable = n.enumerable || !1),
				(n.configurable = !0),
				'value' in n && (n.writable = !0),
				Object.defineProperty(t, n.key, n);
		}
	}
	return function (t, r, a) {
		return r && e(t.prototype, r), a && e(t, a), t;
	};
})();
function Ni(e, t) {
	if (!(e instanceof t))
		throw new TypeError('Cannot call a class as a function');
}
var $r = Ti,
	ji = Ii,
	Ir = pe,
	Li = (function () {
		function e(t) {
			Ni(this, e),
				(this._options = t || {}),
				(this._handler = new ji(this._options)),
				(this._headers = this._options.headers || []),
				(this._escape = Fi()(
					this._options.textDelimiter,
					this._options.rowDelimiter,
					this._options.forceTextDelimiter
				));
		}
		return (
			Ai(e, [
				{
					key: 'parse',
					value: function (r, a, n) {
						return Ir.isArray(r)
							? a(null, this._parseArray(r, n))
							: Ir.isObject(r)
							? a(null, this._parseObject(r))
							: a(
									new Error(
										'Unable to parse the JSON object, its not an Array or Object.'
									)
							  );
					},
				},
				{
					key: '_checkRows',
					value: function (r) {
						var a = null,
							n = [],
							o = function (x, y) {
								return x === '' || x === void 0 ? a[y] : x;
							},
							c = !0,
							u = !1,
							d = void 0;
						try {
							for (
								var s = r[Symbol.iterator](), f;
								!(c = (f = s.next()).done);
								c = !0
							) {
								var p = f.value,
									g = this._headers.length - p.length;
								g > 0 && (p = p.concat(Array(g).join('.').split('.'))),
									a && this._options.fillGaps && (p = p.map(o)),
									n.push(p.join(this._options.rowDelimiter)),
									(a = p);
							}
						} catch (b) {
							(u = !0), (d = b);
						} finally {
							try {
								!c && s.return && s.return();
							} finally {
								if (u) throw d;
							}
						}
						return n;
					},
				},
				{
					key: '_parseArray',
					value: function (r, a) {
						var n = this;
						this._headers = this._headers || [];
						var o = [],
							c = void 0,
							u = function (v) {
								var m = n._headers.indexOf(v);
								return (
									m === -1 && (n._headers.push(v), (m = n._headers.indexOf(v))),
									m
								);
							};
						c = function (v) {
							var m = [],
								P = function (M) {
									return m.push(
										M.map(function (G) {
											return G ?? '';
										})
									);
								},
								w = function () {
									return new Array(n._headers.length).fill(null);
								},
								C = {},
								h = w(),
								_ = !0,
								O = !1,
								T = void 0;
							try {
								for (
									var S = v[Symbol.iterator](), E;
									!(_ = (E = S.next()).done);
									_ = !0
								) {
									var F = E.value,
										A = u(F.item);
									if (
										(h[A] != null && (P(h), (h = w())),
										(C[A] = C[A] || 0),
										n._options.fillTopRow && C[A] < m.length)
									) {
										(m[C[A]][A] = n._escape(F.value)), (C[A] += 1);
										continue;
									}
									(h[A] = n._escape(F.value)), (C[A] += 1);
								}
							} catch (L) {
								(O = !0), (T = L);
							} finally {
								try {
									!_ && S.return && S.return();
								} finally {
									if (O) throw T;
								}
							}
							h.length > 0 && P(h), (o = o.concat(n._checkRows(m)));
						};
						var d = !0,
							s = !1,
							f = void 0;
						try {
							for (
								var p = r[Symbol.iterator](), g;
								!(d = (g = p.next()).done);
								d = !0
							) {
								var b = g.value,
									x = n._handler.check(b, n._options.mainPathItem, b, r);
								c(x);
							}
						} catch (y) {
							(s = !0), (f = y);
						} finally {
							try {
								!d && p.return && p.return();
							} finally {
								if (s) throw f;
							}
						}
						return (
							!a && n._options.includeHeaders && o.unshift(this.headers),
							$r(o, n._options.endOfLine)
						);
					},
				},
				{
					key: '_parseObject',
					value: function (r) {
						var a = this,
							n = [],
							o = [],
							c = void 0,
							u = [[], []];
						c = function (p) {
							var g =
								p.value || p.value === 0
									? p.value.toString()
									: a._options.undefinedString;
							if (((g = a._escape(g)), a._options.verticalOutput)) {
								var b = [p.item, g];
								n.push(b.join(a._options.rowDelimiter));
							} else u[0].push(p.item), u[1].push(g);
						};
						for (var d in r) {
							var s = '';
							this._options.mainPathItem &&
								(s =
									this._options.mainPathItem + this._options.headerPathString),
								(o = this._handler.check(r[d], s + d, d, r)),
								o.forEach(c);
						}
						return (
							this._options.verticalOutput ||
								(n.push(u[0].join(this._options.rowDelimiter)),
								n.push(u[1].join(this._options.rowDelimiter))),
							$r(n, this._options.endOfLine)
						);
					},
				},
				{
					key: 'headers',
					get: function () {
						var r = this,
							a = this._headers;
						return (
							this._options.rename &&
								this._options.rename.length > 0 &&
								(a = a.map(function (n) {
									return r._options.rename[r._options.headers.indexOf(n)] || n;
								})),
							this._options.forceTextDelimiter &&
								(a = a.map(function (n) {
									return (
										'' + r._options.textDelimiter + n + r._options.textDelimiter
									);
								})),
							this._options.mapHeaders && (a = a.map(this._options.mapHeaders)),
							a.join(this._options.rowDelimiter)
						);
					},
				},
			]),
			e
		);
	})(),
	Mi = Li,
	Bi = function (e) {
		throw new Error(
			'jsonexport called without third argument as a callback and is required'
		);
	},
	Di = Bi,
	Rr =
		typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
			? function (e) {
					return typeof e;
			  }
			: function (e) {
					return e &&
						typeof Symbol == 'function' &&
						e.constructor === Symbol &&
						e !== Symbol.prototype
						? 'symbol'
						: typeof e;
			  },
	kr = Mi,
	Fr = Di,
	zi = pn,
	Vi = function () {
		var e = {
				headers: [],
				rename: [],
				headerPathString: '.',
				rowDelimiter: ',',
				textDelimiter: '"',
				arrayPathString: ';',
				undefinedString: '',
				endOfLine: zi,
				mainPathItem: null,
				booleanTrueString: null,
				booleanFalseString: null,
				includeHeaders: !0,
				fillGaps: !1,
				verticalOutput: !0,
				forceTextDelimiter: !1,
			},
			t = void 0,
			r = void 0,
			a = void 0;
		if (arguments.length === 3) {
			var n = Array.prototype.slice.call(arguments);
			(t = n[0]), (r = n[1]), (a = n[2]);
		} else if (arguments.length === 2) {
			var o = void 0,
				c = Array.prototype.slice.call(arguments);
			(t = c[0]),
				(o = c[1]),
				typeof o == 'function'
					? (a = o)
					: (typeof o > 'u' ? 'undefined' : Rr(o)) === 'object' && (r = o);
		} else if (arguments.length === 1) {
			var u = Array.prototype.slice.call(arguments),
				d = u[0];
			if ((typeof d > 'u' ? 'undefined' : Rr(d)) === 'object') {
				var s = Object.keys(e),
					f = Object.keys(d),
					p = f.every(function (x) {
						return s.includes(x);
					});
				f.length > 0 && p ? (r = d) : (t = d);
			} else t = d;
		} else return new Fr(new kr(e));
		var g = Object.assign({}, e, r),
			b = new kr(g);
		return t
			? new Promise(function (x, y) {
					b.parse(t, function (v, m) {
						if (a) return a(v, m);
						if (v) return y(v);
						if (y) return x(m);
					});
			  })
			: new Fr();
	};
const Hi = Vi,
	qi = function (e, t) {
		var r = document.createElement('a');
		(r.style.display = 'none'), document.body.appendChild(r);
		var a = new Blob([e], { type: 'text/csv;charset=utf-8' });
		window.navigator && window.navigator.msSaveOrOpenBlob
			? window.navigator.msSaveOrOpenBlob(a, ''.concat(t, '.csv'))
			: (r.setAttribute('href', URL.createObjectURL(a)),
			  r.setAttribute('download', ''.concat(t, '.csv')),
			  r.click());
	};
var Ui = function (e, t, r, a) {
	return Hi(e, function (n, o) {
		return qi(o, a);
	});
};
const Wi = Ui;
var Gi = function (e) {
		return function (t, r, a) {
			return e.getMany(a, { ids: Ki(t, r) }).then(function (n) {
				var o = n.data;
				return o.reduce(function (c, u) {
					return (c[u.id] = u), c;
				}, {});
			});
		};
	},
	Ki = function (e, t) {
		return Array.from(
			new Set(
				e
					.filter(function (r) {
						return r[t] != null;
					})
					.map(function (r) {
						return r[t];
					})
					.reduce(function (r, a) {
						return r.concat(a);
					}, [])
			)
		);
	};
const Qi = Gi;
var Xi = Ra,
	Ji = ka,
	Yi = 1,
	Zi = 2;
function es(e, t, r, a) {
	var n = r.length,
		o = n,
		c = !a;
	if (e == null) return !o;
	for (e = Object(e); n--; ) {
		var u = r[n];
		if (c && u[2] ? u[1] !== e[u[0]] : !(u[0] in e)) return !1;
	}
	for (; ++n < o; ) {
		u = r[n];
		var d = u[0],
			s = e[d],
			f = u[1];
		if (c && u[2]) {
			if (s === void 0 && !(d in e)) return !1;
		} else {
			var p = new Xi();
			if (a) var g = a(s, f, d, e, t, p);
			if (!(g === void 0 ? Ji(f, s, Yi | Zi, a, p) : g)) return !1;
		}
	}
	return !0;
}
var ts = es,
	rs = rt;
function as(e) {
	return e === e && !rs(e);
}
var vn = as,
	ns = vn,
	os = Ht;
function ls(e) {
	for (var t = os(e), r = t.length; r--; ) {
		var a = t[r],
			n = e[a];
		t[r] = [a, n, ns(n)];
	}
	return t;
}
var is = ls;
function ss(e, t) {
	return function (r) {
		return r == null ? !1 : r[e] === t && (t !== void 0 || e in Object(r));
	};
}
var bn = ss,
	cs = ts,
	us = is,
	ds = bn;
function fs(e) {
	var t = us(e);
	return t.length == 1 && t[0][2]
		? ds(t[0][0], t[0][1])
		: function (r) {
				return r === e || cs(r, e, t);
		  };
}
var ps = fs,
	gs = ka,
	vs = ye,
	bs = ol,
	ms = Fa,
	hs = vn,
	ys = bn,
	_s = Aa,
	xs = 1,
	Ps = 2;
function Os(e, t) {
	return ms(e) && hs(t)
		? ys(_s(e), t)
		: function (r) {
				var a = vs(r, e);
				return a === void 0 && a === t ? bs(r, e) : gs(t, a, xs | Ps);
		  };
}
var ws = Os;
function Cs(e) {
	return function (t) {
		return t == null ? void 0 : t[e];
	};
}
var Ts = Cs,
	Ss = ho;
function Es(e) {
	return function (t) {
		return Ss(t, e);
	};
}
var $s = Es,
	Is = Ts,
	Rs = $s,
	ks = Fa,
	Fs = Aa;
function As(e) {
	return ks(e) ? Is(Fs(e)) : Rs(e);
}
var Ns = As,
	js = ps,
	Ls = ws,
	Ms = yo,
	Bs = Na,
	Ds = Ns;
function zs(e) {
	return typeof e == 'function'
		? e
		: e == null
		? Ms
		: typeof e == 'object'
		? Bs(e)
			? Ls(e[0], e[1])
			: js(e)
		: Ds(e);
}
var Vs = zs,
	Hs = _o,
	qs = xo,
	Us = ja,
	Ws = Po,
	Gs = Object.getOwnPropertySymbols,
	Ks = Gs
		? function (e) {
				for (var t = []; e; ) Hs(t, Us(e)), (e = qs(e));
				return t;
		  }
		: Ws,
	mn = Ks,
	Qs = Oo,
	Xs = mn,
	Js = qt;
function Ys(e) {
	return Qs(e, Js, Xs);
}
var hn = Ys,
	Zs = La,
	ec = Vs,
	tc = ll,
	rc = hn;
function ac(e, t) {
	if (e == null) return {};
	var r = Zs(rc(e), function (a) {
		return [a];
	});
	return (
		(t = ec(t)),
		tc(e, r, function (a, n) {
			return t(a, n[0]);
		})
	);
}
var nc = ac,
	be =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(be =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				be.apply(this, arguments)
			);
		},
	Ar =
		(globalThis && globalThis.__spreadArray) ||
		function (e, t, r) {
			if (r || arguments.length === 2)
				for (var a = 0, n = t.length, o; a < n; a++)
					(o || !(a in t)) &&
						(o || (o = Array.prototype.slice.call(t, 0, a)), (o[a] = t[a]));
			return e.concat(o || Array.prototype.slice.call(t));
		},
	oc = function (e) {
		var t = e.debounce,
			r = t === void 0 ? 500 : t,
			a = e.disableSyncWithLocation,
			n = a === void 0 ? !1 : a,
			o = e.filterDefaultValues,
			c = e.perPage,
			u = c === void 0 ? 10 : c,
			d = e.resource,
			s = e.sort,
			f = s === void 0 ? uc : s,
			p = e.storeKey,
			g = p === void 0 ? ''.concat(d, '.listParams') : p,
			b = wo(),
			x = Ut(),
			y = l.useState(Mr),
			v = y[0],
			m = y[1],
			P = at(g, Mr),
			w = P[0],
			C = P[1],
			h = l.useRef(),
			_ = Co(),
			O = [
				b.search,
				d,
				g,
				JSON.stringify(n ? v : w),
				JSON.stringify(o),
				JSON.stringify(f),
				u,
				n,
			],
			T = n ? {} : ic(b),
			S = l.useMemo(function () {
				return cc({
					queryFromLocation: T,
					params: n ? v : w,
					filterDefaultValues: o,
					sort: f,
					perPage: u,
				});
			}, O);
		l.useEffect(
			function () {
				Object.keys(T).length > 0 && C(S);
			},
			[b.search]
		);
		var E = l.useCallback(function (D) {
				_.current &&
					(h.current
						? (h.current = Sr(h.current, D))
						: ((h.current = Sr(S, D)),
						  setTimeout(function () {
								n
									? m(h.current)
									: x(
											{
												search: '?'.concat(
													Zt.stringify(
														be(be({}, h.current), {
															filter: JSON.stringify(h.current.filter),
															displayedFilters: JSON.stringify(
																h.current.displayedFilters
															),
														})
													)
												),
											},
											{ state: { _scrollToTop: D.type === Ct } }
									  ),
									(h.current = void 0);
						  }, 0)));
			}, Ar(Ar([], O, !0), [x], !1)),
			F = l.useCallback(
				function (D) {
					return E({ type: cn, payload: D });
				},
				[E]
			),
			A = l.useCallback(
				function (D) {
					return E({ type: Ct, payload: D });
				},
				[E]
			),
			L = l.useCallback(
				function (D) {
					return E({ type: un, payload: D });
				},
				[E]
			),
			M = S.filter || Lr,
			G = S.displayedFilters || Lr,
			B = hi(function (D, re) {
				E({ type: Tt, payload: { filter: wt(D), displayedFilters: re } });
			}, r),
			k = l.useCallback(
				function (D, re, U) {
					return (
						U === void 0 && (U = !0),
						U
							? B(D, re)
							: E({
									type: Tt,
									payload: { filter: wt(D), displayedFilters: re },
							  })
					);
				},
				[E]
			),
			te = l.useCallback(
				function (D) {
					E({ type: fn, payload: D });
				},
				[E]
			),
			ne = l.useCallback(
				function (D, re) {
					E({ type: dn, payload: { filterName: D, defaultValue: re } });
				},
				[E]
			);
		return [
			be({ displayedFilters: G, filterValues: M, requestSignature: O }, S),
			{
				changeParams: E,
				setPage: A,
				setPerPage: L,
				setSort: F,
				setFilters: k,
				hideFilter: te,
				showFilter: ne,
			},
		];
	},
	lc = ['page', 'perPage', 'sort', 'order', 'filter', 'displayedFilters'],
	Nr = function (e, t) {
		if (e[t] && typeof e[t] == 'string')
			try {
				e[t] = JSON.parse(e[t]);
			} catch {
				delete e[t];
			}
	},
	ic = function (e) {
		var t = e.search,
			r = nc(Zt.parse(t), function (a, n) {
				return lc.indexOf(n) !== -1;
			});
		return Nr(r, 'filter'), Nr(r, 'displayedFilters'), r;
	},
	sc = function (e) {
		return (
			e &&
			e.filter &&
			(Object.keys(e.filter).length > 0 ||
				e.order != null ||
				e.page !== 1 ||
				e.perPage != null ||
				e.sort != null)
		);
	},
	cc = function (e) {
		var t = e.queryFromLocation,
			r = e.params,
			a = e.filterDefaultValues,
			n = e.sort,
			o = e.perPage,
			c =
				Object.keys(t).length > 0 ? t : sc(r) ? be({}, r) : { filter: a || {} };
		return (
			c.sort || ((c.sort = n.field), (c.order = n.order)),
			c.perPage == null && (c.perPage = o),
			c.page == null && (c.page = 1),
			be(be({}, c), { page: jr(c.page, 1), perPage: jr(c.perPage, 10) })
		);
	},
	jr = function (e, t) {
		var r = typeof e == 'string' ? parseInt(e, 10) : e;
		return isNaN(r) ? t : r;
	},
	Lr = {},
	uc = { field: 'id', order: st },
	Mr = {},
	_e =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(_e =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				_e.apply(this, arguments)
			);
		},
	dc =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	fc = function (e) {
		e === void 0 && (e = {});
		var t = e.debounce,
			r = t === void 0 ? 500 : t,
			a = e.disableAuthentication,
			n = e.disableSyncWithLocation,
			o = e.exporter,
			c = o === void 0 ? Wi : o,
			u = e.filter,
			d = e.filterDefaultValues,
			s = e.perPage,
			f = s === void 0 ? 10 : s,
			p = e.queryOptions,
			g = p === void 0 ? {} : p,
			b = e.sort,
			x = b === void 0 ? pc : b,
			y = e.storeKey;
		To({ enabled: !a });
		var v = X(e),
			m = g.meta,
			P = dc(g, ['meta']);
		if (!v)
			throw new Error(
				'<List> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.'
			);
		if (u && l.isValidElement(u))
			throw new Error(
				'<List> received a React element as `filter` props. If you intended to set the list filter elements, use the `filters` (with an s) prop instead. The `filter` prop is internal and should not be set by the developer.'
			);
		var w = K(),
			C = nt(),
			h = oc({
				debounce: r,
				disableSyncWithLocation: n,
				filterDefaultValues: d,
				perPage: f,
				resource: v,
				sort: x,
				storeKey: y,
			}),
			_ = h[0],
			O = h[1],
			T = il(v),
			S = T[0],
			E = T[1],
			F = fl(
				v,
				{
					pagination: { page: _.page, perPage: _.perPage },
					sort: { field: _.sort, order: _.order },
					filter: _e(_e({}, _.filter), u),
					meta: m,
				},
				_e(
					{
						keepPreviousData: !0,
						retry: !1,
						onError: function (U) {
							return C(
								(U == null ? void 0 : U.message) ||
									'ra.notification.http_error',
								{
									type: 'error',
									messageArgs: { _: U == null ? void 0 : U.message },
								}
							);
						},
					},
					P
				)
			),
			A = F.data,
			L = F.pageInfo,
			M = F.total,
			G = F.error,
			B = F.isLoading,
			k = F.isFetching,
			te = F.refetch;
		l.useEffect(
			function () {
				if (
					_.page <= 0 ||
					(!k &&
						_.page > 1 &&
						(A == null || (A == null ? void 0 : A.length) === 0))
				) {
					O.setPage(1);
					return;
				}
				if (M != null) {
					var U = Math.ceil(M / _.perPage) || 1;
					!k && _.page > U && O.setPage(U);
				}
			},
			[k, _.page, _.perPage, A, O, M]
		);
		var ne = l.useMemo(
				function () {
					return { field: _.sort, order: _.order };
				},
				[_.sort, _.order]
			),
			D = Ma(),
			re = w('ra.page.list', { name: D(v, 2) });
		return {
			sort: ne,
			data: A,
			defaultTitle: re,
			displayedFilters: _.displayedFilters,
			error: G,
			exporter: c,
			filter: u,
			filterValues: _.filterValues,
			hideFilter: O.hideFilter,
			isFetching: k,
			isLoading: B,
			onSelect: E.select,
			onToggleItem: E.toggle,
			onUnselectItems: E.clearSelection,
			page: _.page,
			perPage: _.perPage,
			refetch: te,
			resource: v,
			selectedIds: S,
			setFilters: O.setFilters,
			setPage: O.setPage,
			setPerPage: O.setPerPage,
			setSort: O.setSort,
			showFilter: O.showFilter,
			total: M,
			hasNextPage: L
				? L.hasNextPage
				: M != null
				? _.page * _.perPage < M
				: void 0,
			hasPreviousPage: L ? L.hasPreviousPage : _.page > 1,
		};
	},
	pc = { field: 'id', order: st },
	gc = [
		'sort',
		'data',
		'defaultTitle',
		'displayedFilters',
		'error',
		'exporter',
		'filterValues',
		'hideFilter',
		'isFetching',
		'isLoading',
		'onSelect',
		'onToggleItem',
		'onUnselectItems',
		'page',
		'perPage',
		'refetch',
		'refresh',
		'resource',
		'selectedIds',
		'setFilters',
		'setPage',
		'setPerPage',
		'setSort',
		'showFilter',
		'total',
		'totalPages',
	],
	ke = function (e) {
		return Object.keys(e)
			.filter(function (t) {
				return !gc.includes(t);
			})
			.reduce(function (t, r) {
				var a;
				return _e(_e({}, t), ((a = {}), (a[r] = e[r]), a));
			}, {});
	},
	er = l.createContext({
		sort: null,
		data: null,
		defaultTitle: null,
		displayedFilters: null,
		exporter: null,
		filterValues: null,
		hasNextPage: null,
		hasPreviousPage: null,
		hideFilter: null,
		isFetching: null,
		isLoading: null,
		onSelect: null,
		onToggleItem: null,
		onUnselectItems: null,
		page: null,
		perPage: null,
		refetch: null,
		resource: null,
		selectedIds: void 0,
		setFilters: null,
		setPage: null,
		setPerPage: null,
		setSort: null,
		showFilter: null,
		total: null,
	});
er.displayName = 'ListContext';
var yn = l.createContext({
		displayedFilters: null,
		filterValues: null,
		hideFilter: null,
		setFilters: null,
		showFilter: null,
		resource: null,
	}),
	vc = function (e) {
		return l.useMemo(
			function () {
				return Yt(e, [
					'displayedFilters',
					'filterValues',
					'hideFilter',
					'setFilters',
					'showFilter',
					'resource',
				]);
			},
			[
				e.displayedFilters,
				e.filterValues,
				e.hideFilter,
				e.setFilters,
				e.showFilter,
			]
		);
	};
yn.displayName = 'ListFilterContext';
var _n = l.createContext({ sort: null, setSort: null, resource: null }),
	bc = function (e) {
		return l.useMemo(
			function () {
				return Yt(e, ['sort', 'setSort', 'resource']);
			},
			[e.sort, e.setSort]
		);
	};
_n.displayName = 'ListSortContext';
var tr = l.createContext({
	isLoading: null,
	page: null,
	perPage: null,
	setPage: null,
	setPerPage: null,
	hasPreviousPage: null,
	hasNextPage: null,
	total: void 0,
	resource: null,
});
tr.displayName = 'ListPaginationContext';
var mc = function (e) {
		return l.useMemo(
			function () {
				return Yt(e, [
					'isLoading',
					'hasPreviousPage',
					'hasNextPage',
					'page',
					'perPage',
					'setPage',
					'setPerPage',
					'total',
					'resource',
				]);
			},
			[
				e.isLoading,
				e.hasPreviousPage,
				e.hasNextPage,
				e.page,
				e.perPage,
				e.setPage,
				e.setPerPage,
				e.total,
			]
		);
	},
	hc = function (e) {
		var t = e.value,
			r = e.children;
		return l.createElement(
			er.Provider,
			{ value: t },
			l.createElement(
				yn.Provider,
				{ value: vc(t) },
				l.createElement(
					_n.Provider,
					{ value: bc(t) },
					l.createElement(tr.Provider, { value: mc(t) }, r)
				)
			)
		);
	},
	yc =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	_c = function (e) {
		var t = e.children,
			r = yc(e, ['children']);
		return l.createElement(
			So,
			{ value: r.resource },
			l.createElement(hc, { value: fc(r) }, t)
		);
	},
	ee = function (e) {
		var t = l.useContext(er);
		return l.useMemo(
			function () {
				return Jt({}, e != null ? xc(e) : {}, t);
			},
			[t, e]
		);
	},
	xc = function (e) {
		var t = e.sort,
			r = e.data,
			a = e.defaultTitle,
			n = e.displayedFilters,
			o = e.exporter,
			c = e.filterValues,
			u = e.hasCreate,
			d = e.hideFilter,
			s = e.isFetching,
			f = e.isLoading,
			p = e.onSelect,
			g = e.onToggleItem,
			b = e.onUnselectItems,
			x = e.page,
			y = e.perPage,
			v = e.refetch,
			m = e.resource,
			P = e.selectedIds,
			w = e.setFilters,
			C = e.setPage,
			h = e.setPerPage,
			_ = e.setSort,
			O = e.showFilter,
			T = e.total;
		return {
			sort: t,
			data: r,
			defaultTitle: a,
			displayedFilters: n,
			exporter: o,
			filterValues: c,
			hasCreate: u,
			hideFilter: d,
			isFetching: s,
			isLoading: f,
			onSelect: p,
			onToggleItem: g,
			onUnselectItems: b,
			page: x,
			perPage: y,
			refetch: v,
			resource: m,
			selectedIds: P,
			setFilters: w,
			setPage: C,
			setPerPage: h,
			setSort: _,
			showFilter: O,
			total: T,
		};
	},
	Pc = function (e) {
		var t = l.useContext(tr);
		return l.useMemo(
			function () {
				return Jt({}, e != null ? Oc(e) : {}, t);
			},
			[t, e]
		);
	},
	Oc = function (e) {
		var t = e.isLoading,
			r = e.page,
			a = e.perPage,
			n = e.setPage,
			o = e.setPerPage,
			c = e.hasPreviousPage,
			u = e.hasNextPage,
			d = e.total,
			s = e.resource;
		return {
			isLoading: t,
			page: r,
			perPage: a,
			setPage: n,
			setPerPage: o,
			hasPreviousPage: c,
			hasNextPage: u,
			total: d,
			resource: s,
		};
	},
	Le =
		(globalThis && globalThis.__spreadArray) ||
		function (e, t, r) {
			if (r || arguments.length === 2)
				for (var a = 0, n = t.length, o; a < n; a++)
					(o || !(a in t)) &&
						(o || (o = Array.prototype.slice.call(t, 0, a)), (o[a] = t[a]));
			return e.concat(o || Array.prototype.slice.call(t));
		},
	wc = function (e, t, r) {
		r === void 0 && (r = !1);
		var a = at(''.concat(e, '.datagrid.expanded'), []),
			n = a[0],
			o = a[1],
			c = Array.isArray(n)
				? n
						.map(function (d) {
							return d == t;
						})
						.indexOf(!0) !== -1
				: !1,
			u = l.useCallback(
				function () {
					o(function (d) {
						if (!Array.isArray(d)) return [t];
						var s = d.findIndex(function (f) {
							return f == t;
						});
						return s > -1
							? r
								? []
								: Le(Le([], d.slice(0, s), !0), d.slice(s + 1), !0)
							: r
							? [t]
							: Le(Le([], d, !0), [t], !1);
					});
				},
				[o, t, r]
			);
		return [c, u];
	},
	Cc = function (e, t) {
		var r = at(''.concat(e, '.datagrid.expanded'), []),
			a = r[0],
			n = r[1],
			o = Array.isArray(a)
				? a.some(function (u) {
						return t.some(function (d) {
							return d == u;
						});
				  })
				: !1,
			c = l.useCallback(
				function () {
					var u = a.filter(function (d) {
						return !t.some(function (s) {
							return s == d;
						});
					});
					n(o ? u : u.concat(t));
				},
				[a, n, o, t]
			);
		return [o, c];
	},
	de =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(de =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				de.apply(this, arguments)
			);
		},
	Br =
		(globalThis && globalThis.__awaiter) ||
		function (e, t, r, a) {
			function n(o) {
				return o instanceof r
					? o
					: new r(function (c) {
							c(o);
					  });
			}
			return new (r || (r = Promise))(function (o, c) {
				function u(f) {
					try {
						s(a.next(f));
					} catch (p) {
						c(p);
					}
				}
				function d(f) {
					try {
						s(a.throw(f));
					} catch (p) {
						c(p);
					}
				}
				function s(f) {
					f.done ? o(f.value) : n(f.value).then(u, d);
				}
				s((a = a.apply(e, t || [])).next());
			});
		},
	Dr =
		(globalThis && globalThis.__generator) ||
		function (e, t) {
			var r = {
					label: 0,
					sent: function () {
						if (o[0] & 1) throw o[1];
						return o[1];
					},
					trys: [],
					ops: [],
				},
				a,
				n,
				o,
				c;
			return (
				(c = { next: u(0), throw: u(1), return: u(2) }),
				typeof Symbol == 'function' &&
					(c[Symbol.iterator] = function () {
						return this;
					}),
				c
			);
			function u(s) {
				return function (f) {
					return d([s, f]);
				};
			}
			function d(s) {
				if (a) throw new TypeError('Generator is already executing.');
				for (; r; )
					try {
						if (
							((a = 1),
							n &&
								(o =
									s[0] & 2
										? n.return
										: s[0]
										? n.throw || ((o = n.return) && o.call(n), 0)
										: n.next) &&
								!(o = o.call(n, s[1])).done)
						)
							return o;
						switch (((n = 0), o && (s = [s[0] & 2, o.value]), s[0])) {
							case 0:
							case 1:
								o = s;
								break;
							case 4:
								return r.label++, { value: s[1], done: !1 };
							case 5:
								r.label++, (n = s[1]), (s = [0]);
								continue;
							case 7:
								(s = r.ops.pop()), r.trys.pop();
								continue;
							default:
								if (
									((o = r.trys),
									!(o = o.length > 0 && o[o.length - 1]) &&
										(s[0] === 6 || s[0] === 2))
								) {
									r = 0;
									continue;
								}
								if (s[0] === 3 && (!o || (s[1] > o[0] && s[1] < o[3]))) {
									r.label = s[1];
									break;
								}
								if (s[0] === 6 && r.label < o[1]) {
									(r.label = o[1]), (o = s);
									break;
								}
								if (o && r.label < o[2]) {
									(r.label = o[2]), r.ops.push(s);
									break;
								}
								o[2] && r.ops.pop(), r.trys.pop();
								continue;
						}
						s = t.call(e, r);
					} catch (f) {
						(s = [6, f]), (n = 0);
					} finally {
						a = o = 0;
					}
				if (s[0] & 5) throw s[1];
				return { value: s[0] ? s[1] : void 0, done: !0 };
			}
		},
	Tc =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	yt =
		(globalThis && globalThis.__spreadArray) ||
		function (e, t, r) {
			if (r || arguments.length === 2)
				for (var a = 0, n = t.length, o; a < n; a++)
					(o || !(a in t)) &&
						(o || (o = Array.prototype.slice.call(t, 0, a)), (o[a] = t[a]));
			return e.concat(o || Array.prototype.slice.call(t));
		},
	xn = function (e, t, r) {
		t === void 0 && (t = {}), r === void 0 && (r = {});
		var a = Xt(),
			n = Oa(),
			o = t.ids,
			c = r.mutationMode,
			u = c === void 0 ? 'pessimistic' : c,
			d = Tc(r, ['mutationMode']),
			s = l.useRef(u),
			f = l.useRef({}),
			p = l.useRef([]),
			g = function (y) {
				var v = y.resource,
					m = y.ids,
					P = Date.now(),
					w = s.current === 'undoable' ? P + 5 * 1e3 : P,
					C = function (h) {
						if (h) {
							var _ = yt([], h, !0);
							return (
								m.forEach(function (O) {
									var T = _.findIndex(function (S) {
										return S.id == O;
									});
									T !== -1 &&
										(_ = yt(yt([], _.slice(0, T), !0), _.slice(T + 1), !0));
								}),
								_
							);
						}
					};
				n.setQueriesData(
					[v, 'getList'],
					function (h) {
						if (!h || !h.data) return h;
						var _ = C(h.data),
							O = _.length < h.data.length;
						return O
							? {
									data: _,
									total: h.total
										? h.total - (h.data.length - _.length)
										: void 0,
									pageInfo: h.pageInfo,
							  }
							: h;
					},
					{ updatedAt: w }
				),
					n.setQueriesData(
						[v, 'getMany'],
						function (h) {
							return h && h.length > 0 ? C(h) : h;
						},
						{ updatedAt: w }
					),
					n.setQueriesData(
						[v, 'getManyReference'],
						function (h) {
							if (!h || !h.data) return h;
							var _ = C(h.data),
								O = _.length < h.data.length;
							return O
								? { data: _, total: h.total - (h.data.length - _.length) }
								: h;
						},
						{ updatedAt: w }
					);
			},
			b = sl(
				function (y) {
					var v = y === void 0 ? {} : y,
						m = v.resource,
						P = m === void 0 ? e : m,
						w = v.ids,
						C = w === void 0 ? f.current.ids : w,
						h = v.meta,
						_ = h === void 0 ? f.current.meta : h;
					return a.deleteMany(P, { ids: C, meta: _ }).then(function (O) {
						var T = O.data;
						return T;
					});
				},
				de(de({}, d), {
					onMutate: function (y) {
						return Br(void 0, void 0, void 0, function () {
							var v;
							return Dr(this, function (m) {
								switch (m.label) {
									case 0:
										return d.onMutate ? [4, d.onMutate(y)] : [3, 2];
									case 1:
										return (
											(v = m.sent() || {}), [2, de({ snapshot: p.current }, v)]
										);
									case 2:
										return [2, { snapshot: p.current }];
								}
							});
						});
					},
					onError: function (y, v, m) {
						if (
							(v === void 0 && (v = {}),
							(s.current === 'optimistic' || s.current === 'undoable') &&
								m.snapshot.forEach(function (P) {
									var w = P[0],
										C = P[1];
									n.setQueryData(w, C);
								}),
							d.onError)
						)
							return d.onError(y, v, m);
					},
					onSuccess: function (y, v, m) {
						if ((v === void 0 && (v = {}), s.current === 'pessimistic')) {
							var P = v.resource,
								w = P === void 0 ? e : P,
								C = v.ids,
								h = C === void 0 ? o : C;
							g({ resource: w, ids: h }), d.onSuccess && d.onSuccess(y, v, m);
						}
					},
					onSettled: function (y, v, m, P) {
						if (
							(m === void 0 && (m = {}),
							(s.current === 'optimistic' || s.current === 'undoable') &&
								P.snapshot.forEach(function (w) {
									var C = w[0];
									n.invalidateQueries(C);
								}),
							d.onSettled)
						)
							return d.onSettled(y, v, m, P);
					},
				})
			),
			x = function (y, v, m) {
				return (
					y === void 0 && (y = e),
					v === void 0 && (v = {}),
					m === void 0 && (m = {}),
					Br(void 0, void 0, void 0, function () {
						var P, w, C, h, _, O, T;
						return Dr(this, function (S) {
							switch (S.label) {
								case 0:
									return (
										(P = m.mutationMode),
										(w = m.onSuccess),
										(C = m.onSettled),
										(h = m.onError),
										(f.current = t),
										P && (s.current = P),
										s.current === 'pessimistic'
											? [
													2,
													b.mutate(de({ resource: y }, v), {
														onSuccess: w,
														onSettled: C,
														onError: h,
													}),
											  ]
											: ((_ = v.ids),
											  (O = _ === void 0 ? o : _),
											  (T = [
													[y, 'getList'],
													[y, 'getMany'],
													[y, 'getManyReference'],
											  ]),
											  (p.current = T.reduce(function (E, F) {
													return E.concat(n.getQueriesData(F));
											  }, [])),
											  [
													4,
													Promise.all(
														p.current.map(function (E) {
															var F = E[0];
															return n.cancelQueries(F);
														})
													),
											  ])
									);
								case 1:
									return (
										S.sent(),
										g({ resource: y, ids: O }),
										w &&
											setTimeout(function () {
												return w(O, de({ resource: y }, v), {
													snapshot: p.current,
												});
											}, 0),
										d.onSuccess &&
											setTimeout(function () {
												return d.onSuccess(O, de({ resource: y }, v), {
													snapshot: p.current,
												});
											}, 0),
										s.current === 'optimistic'
											? [
													2,
													b.mutate(de({ resource: y }, v), {
														onSettled: C,
														onError: h,
													}),
											  ]
											: ($o.once('end', function (E) {
													var F = E.isUndo;
													F
														? p.current.forEach(function (A) {
																var L = A[0],
																	M = A[1];
																n.setQueryData(L, M);
														  })
														: b.mutate(de({ resource: y }, v), {
																onSettled: C,
																onError: h,
														  });
											  }),
											  [2])
									);
							}
						});
					})
				);
			};
		return [Eo(x), b];
	};
const Sc = fe(
		R('path', {
			d: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
		}),
		'CheckBoxOutlineBlank'
	),
	Ec = fe(
		R('path', {
			d: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
		}),
		'CheckBox'
	),
	$c = fe(
		R('path', {
			d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z',
		}),
		'IndeterminateCheckBox'
	);
function Ic(e) {
	return ie('MuiCheckbox', e);
}
const Rc = le('MuiCheckbox', [
		'root',
		'checked',
		'disabled',
		'indeterminate',
		'colorPrimary',
		'colorSecondary',
	]),
	_t = Rc,
	kc = [
		'checkedIcon',
		'color',
		'icon',
		'indeterminate',
		'indeterminateIcon',
		'inputProps',
		'size',
		'className',
	],
	Fc = (e) => {
		const { classes: t, indeterminate: r, color: a } = e,
			n = { root: ['root', r && 'indeterminate', `color${W(a)}`] },
			o = ce(n, Ic, t);
		return I({}, t, o);
	},
	Ac = j(cl, {
		shouldForwardProp: (e) => Ba(e) || e === 'classes',
		name: 'MuiCheckbox',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [
				t.root,
				r.indeterminate && t.indeterminate,
				r.color !== 'default' && t[`color${W(r.color)}`],
			];
		},
	})(({ theme: e, ownerState: t }) =>
		I(
			{ color: (e.vars || e).palette.text.secondary },
			!t.disableRipple && {
				'&:hover': {
					backgroundColor: e.vars
						? `rgba(${
								t.color === 'default'
									? e.vars.palette.action.activeChannel
									: e.vars.palette.primary.mainChannel
						  } / ${e.vars.palette.action.hoverOpacity})`
						: Y(
								t.color === 'default'
									? e.palette.action.active
									: e.palette[t.color].main,
								e.palette.action.hoverOpacity
						  ),
					'@media (hover: none)': { backgroundColor: 'transparent' },
				},
			},
			t.color !== 'default' && {
				[`&.${_t.checked}, &.${_t.indeterminate}`]: {
					color: (e.vars || e).palette[t.color].main,
				},
				[`&.${_t.disabled}`]: { color: (e.vars || e).palette.action.disabled },
			}
		)
	),
	Nc = R(Ec, {}),
	jc = R(Sc, {}),
	Lc = R($c, {}),
	Mc = l.forwardRef(function (t, r) {
		var a, n;
		const o = se({ props: t, name: 'MuiCheckbox' }),
			{
				checkedIcon: c = Nc,
				color: u = 'primary',
				icon: d = jc,
				indeterminate: s = !1,
				indeterminateIcon: f = Lc,
				inputProps: p,
				size: g = 'medium',
				className: b,
			} = o,
			x = Z(o, kc),
			y = s ? f : d,
			v = s ? f : c,
			m = I({}, o, { color: u, indeterminate: s, size: g }),
			P = Fc(m);
		return R(
			Ac,
			I(
				{
					type: 'checkbox',
					inputProps: I({ 'data-indeterminate': s }, p),
					icon: l.cloneElement(y, {
						fontSize: (a = y.props.fontSize) != null ? a : g,
					}),
					checkedIcon: l.cloneElement(v, {
						fontSize: (n = v.props.fontSize) != null ? n : g,
					}),
					ownerState: m,
					ref: r,
					className: N(P.root, b),
				},
				x,
				{ classes: P }
			)
		);
	}),
	qe = Mc;
function Bc(e) {
	return ie('MuiFab', e);
}
const Dc = le('MuiFab', [
		'root',
		'primary',
		'secondary',
		'extended',
		'circular',
		'focusVisible',
		'disabled',
		'colorInherit',
		'sizeSmall',
		'sizeMedium',
		'sizeLarge',
		'info',
		'error',
		'warning',
		'success',
	]),
	zr = Dc,
	zc = [
		'children',
		'className',
		'color',
		'component',
		'disabled',
		'disableFocusRipple',
		'focusVisibleClassName',
		'size',
		'variant',
	],
	Vc = (e) => {
		const { color: t, variant: r, classes: a, size: n } = e,
			o = {
				root: ['root', r, `size${W(n)}`, t === 'inherit' ? 'colorInherit' : t],
			},
			c = ce(o, Bc, a);
		return I({}, a, c);
	},
	Hc = j(Wt, {
		name: 'MuiFab',
		slot: 'Root',
		shouldForwardProp: (e) => Ba(e) || e === 'classes',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [
				t.root,
				t[r.variant],
				t[`size${W(r.size)}`],
				r.color === 'inherit' && t.colorInherit,
				t[W(r.size)],
				t[r.color],
			];
		},
	})(
		({ theme: e, ownerState: t }) => {
			var r, a;
			return I(
				{},
				e.typography.button,
				{
					minHeight: 36,
					transition: e.transitions.create(
						['background-color', 'box-shadow', 'border-color'],
						{ duration: e.transitions.duration.short }
					),
					borderRadius: '50%',
					padding: 0,
					minWidth: 0,
					width: 56,
					height: 56,
					zIndex: (e.vars || e).zIndex.fab,
					boxShadow: (e.vars || e).shadows[6],
					'&:active': { boxShadow: (e.vars || e).shadows[12] },
					color: e.vars
						? e.vars.palette.text.primary
						: (r = (a = e.palette).getContrastText) == null
						? void 0
						: r.call(a, e.palette.grey[300]),
					backgroundColor: (e.vars || e).palette.grey[300],
					'&:hover': {
						backgroundColor: (e.vars || e).palette.grey.A100,
						'@media (hover: none)': {
							backgroundColor: (e.vars || e).palette.grey[300],
						},
						textDecoration: 'none',
					},
					[`&.${zr.focusVisible}`]: { boxShadow: (e.vars || e).shadows[6] },
				},
				t.size === 'small' && { width: 40, height: 40 },
				t.size === 'medium' && { width: 48, height: 48 },
				t.variant === 'extended' && {
					borderRadius: 48 / 2,
					padding: '0 16px',
					width: 'auto',
					minHeight: 'auto',
					minWidth: 48,
					height: 48,
				},
				t.variant === 'extended' &&
					t.size === 'small' && {
						width: 'auto',
						padding: '0 8px',
						borderRadius: 34 / 2,
						minWidth: 34,
						height: 34,
					},
				t.variant === 'extended' &&
					t.size === 'medium' && {
						width: 'auto',
						padding: '0 16px',
						borderRadius: 40 / 2,
						minWidth: 40,
						height: 40,
					},
				t.color === 'inherit' && { color: 'inherit' }
			);
		},
		({ theme: e, ownerState: t }) =>
			I(
				{},
				t.color !== 'inherit' &&
					t.color !== 'default' &&
					(e.vars || e).palette[t.color] != null && {
						color: (e.vars || e).palette[t.color].contrastText,
						backgroundColor: (e.vars || e).palette[t.color].main,
						'&:hover': {
							backgroundColor: (e.vars || e).palette[t.color].dark,
							'@media (hover: none)': {
								backgroundColor: (e.vars || e).palette[t.color].main,
							},
						},
					}
			),
		({ theme: e }) => ({
			[`&.${zr.disabled}`]: {
				color: (e.vars || e).palette.action.disabled,
				boxShadow: (e.vars || e).shadows[0],
				backgroundColor: (e.vars || e).palette.action.disabledBackground,
			},
		})
	),
	qc = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiFab' }),
			{
				children: n,
				className: o,
				color: c = 'default',
				component: u = 'button',
				disabled: d = !1,
				disableFocusRipple: s = !1,
				focusVisibleClassName: f,
				size: p = 'large',
				variant: g = 'circular',
			} = a,
			b = Z(a, zc),
			x = I({}, a, {
				color: c,
				component: u,
				disabled: d,
				disableFocusRipple: s,
				size: p,
				variant: g,
			}),
			y = Vc(x);
		return R(
			Hc,
			I(
				{
					className: N(y.root, o),
					component: u,
					disabled: d,
					focusRipple: !s,
					focusVisibleClassName: N(y.focusVisible, f),
					ownerState: x,
					ref: r,
				},
				b,
				{ classes: y, children: n }
			)
		);
	}),
	Uc = qc;
function Wc(e) {
	return ie('MuiPagination', e);
}
le('MuiPagination', ['root', 'ul', 'outlined', 'text']);
const Gc = [
	'boundaryCount',
	'componentName',
	'count',
	'defaultPage',
	'disabled',
	'hideNextButton',
	'hidePrevButton',
	'onChange',
	'page',
	'showFirstButton',
	'showLastButton',
	'siblingCount',
];
function Kc(e = {}) {
	const {
			boundaryCount: t = 1,
			componentName: r = 'usePagination',
			count: a = 1,
			defaultPage: n = 1,
			disabled: o = !1,
			hideNextButton: c = !1,
			hidePrevButton: u = !1,
			onChange: d,
			page: s,
			showFirstButton: f = !1,
			showLastButton: p = !1,
			siblingCount: g = 1,
		} = e,
		b = Z(e, Gc),
		[x, y] = Io({ controlled: s, default: n, name: r, state: 'page' }),
		v = (S, E) => {
			s || y(E), d && d(S, E);
		},
		m = (S, E) => {
			const F = E - S + 1;
			return Array.from({ length: F }, (A, L) => S + L);
		},
		P = m(1, Math.min(t, a)),
		w = m(Math.max(a - t + 1, t + 1), a),
		C = Math.max(Math.min(x - g, a - t - g * 2 - 1), t + 2),
		h = Math.min(
			Math.max(x + g, t + g * 2 + 2),
			w.length > 0 ? w[0] - 2 : a - 1
		),
		_ = [
			...(f ? ['first'] : []),
			...(u ? [] : ['previous']),
			...P,
			...(C > t + 2 ? ['start-ellipsis'] : t + 1 < a - t ? [t + 1] : []),
			...m(C, h),
			...(h < a - t - 1 ? ['end-ellipsis'] : a - t > t ? [a - t] : []),
			...w,
			...(c ? [] : ['next']),
			...(p ? ['last'] : []),
		],
		O = (S) => {
			switch (S) {
				case 'first':
					return 1;
				case 'previous':
					return x - 1;
				case 'next':
					return x + 1;
				case 'last':
					return a;
				default:
					return null;
			}
		},
		T = _.map((S) =>
			typeof S == 'number'
				? {
						onClick: (E) => {
							v(E, S);
						},
						type: 'page',
						page: S,
						selected: S === x,
						disabled: o,
						'aria-current': S === x ? 'true' : void 0,
				  }
				: {
						onClick: (E) => {
							v(E, O(S));
						},
						type: S,
						page: O(S),
						selected: !1,
						disabled:
							o ||
							(S.indexOf('ellipsis') === -1 &&
								(S === 'next' || S === 'last' ? x >= a : x <= 1)),
				  }
		);
	return I({ items: T }, b);
}
function Qc(e) {
	return ie('MuiPaginationItem', e);
}
const Xc = le('MuiPaginationItem', [
		'root',
		'page',
		'sizeSmall',
		'sizeLarge',
		'text',
		'textPrimary',
		'textSecondary',
		'outlined',
		'outlinedPrimary',
		'outlinedSecondary',
		'rounded',
		'ellipsis',
		'firstLast',
		'previousNext',
		'focusVisible',
		'disabled',
		'selected',
		'icon',
	]),
	ae = Xc,
	Ue = fe(
		R('path', {
			d: 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
		}),
		'FirstPage'
	),
	We = fe(
		R('path', {
			d: 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
		}),
		'LastPage'
	),
	Vr = fe(
		R('path', { d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' }),
		'NavigateBefore'
	),
	Hr = fe(
		R('path', { d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' }),
		'NavigateNext'
	),
	Jc = [
		'className',
		'color',
		'component',
		'components',
		'disabled',
		'page',
		'selected',
		'shape',
		'size',
		'slots',
		'type',
		'variant',
	],
	Pn = (e, t) => {
		const { ownerState: r } = e;
		return [
			t.root,
			t[r.variant],
			t[`size${W(r.size)}`],
			r.variant === 'text' && t[`text${W(r.color)}`],
			r.variant === 'outlined' && t[`outlined${W(r.color)}`],
			r.shape === 'rounded' && t.rounded,
			r.type === 'page' && t.page,
			(r.type === 'start-ellipsis' || r.type === 'end-ellipsis') && t.ellipsis,
			(r.type === 'previous' || r.type === 'next') && t.previousNext,
			(r.type === 'first' || r.type === 'last') && t.firstLast,
		];
	},
	Yc = (e) => {
		const {
				classes: t,
				color: r,
				disabled: a,
				selected: n,
				size: o,
				shape: c,
				type: u,
				variant: d,
			} = e,
			s = {
				root: [
					'root',
					`size${W(o)}`,
					d,
					c,
					r !== 'standard' && `${d}${W(r)}`,
					a && 'disabled',
					n && 'selected',
					{
						page: 'page',
						first: 'firstLast',
						last: 'firstLast',
						'start-ellipsis': 'ellipsis',
						'end-ellipsis': 'ellipsis',
						previous: 'previousNext',
						next: 'previousNext',
					}[u],
				],
				icon: ['icon'],
			};
		return ce(s, Qc, t);
	},
	Zc = j('div', {
		name: 'MuiPaginationItem',
		slot: 'Root',
		overridesResolver: Pn,
	})(({ theme: e, ownerState: t }) =>
		I(
			{},
			e.typography.body2,
			{
				borderRadius: 32 / 2,
				textAlign: 'center',
				boxSizing: 'border-box',
				minWidth: 32,
				padding: '0 6px',
				margin: '0 3px',
				color: (e.vars || e).palette.text.primary,
				height: 'auto',
				[`&.${ae.disabled}`]: {
					opacity: (e.vars || e).palette.action.disabledOpacity,
				},
			},
			t.size === 'small' && {
				minWidth: 26,
				borderRadius: 26 / 2,
				margin: '0 1px',
				padding: '0 4px',
			},
			t.size === 'large' && {
				minWidth: 40,
				borderRadius: 40 / 2,
				padding: '0 10px',
				fontSize: e.typography.pxToRem(15),
			}
		)
	),
	eu = j(Wt, {
		name: 'MuiPaginationItem',
		slot: 'Root',
		overridesResolver: Pn,
	})(
		({ theme: e, ownerState: t }) =>
			I(
				{},
				e.typography.body2,
				{
					borderRadius: 32 / 2,
					textAlign: 'center',
					boxSizing: 'border-box',
					minWidth: 32,
					height: 32,
					padding: '0 6px',
					margin: '0 3px',
					color: (e.vars || e).palette.text.primary,
					[`&.${ae.focusVisible}`]: {
						backgroundColor: (e.vars || e).palette.action.focus,
					},
					[`&.${ae.disabled}`]: {
						opacity: (e.vars || e).palette.action.disabledOpacity,
					},
					transition: e.transitions.create(['color', 'background-color'], {
						duration: e.transitions.duration.short,
					}),
					'&:hover': {
						backgroundColor: (e.vars || e).palette.action.hover,
						'@media (hover: none)': { backgroundColor: 'transparent' },
					},
					[`&.${ae.selected}`]: {
						backgroundColor: (e.vars || e).palette.action.selected,
						'&:hover': {
							backgroundColor: e.vars
								? `rgba(${e.vars.palette.action.selected} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`
								: Y(
										e.palette.action.selected,
										e.palette.action.selectedOpacity +
											e.palette.action.hoverOpacity
								  ),
							'@media (hover: none)': {
								backgroundColor: (e.vars || e).palette.action.selected,
							},
						},
						[`&.${ae.focusVisible}`]: {
							backgroundColor: e.vars
								? `rgba(${e.vars.palette.action.selected} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`
								: Y(
										e.palette.action.selected,
										e.palette.action.selectedOpacity +
											e.palette.action.focusOpacity
								  ),
						},
						[`&.${ae.disabled}`]: {
							opacity: 1,
							color: (e.vars || e).palette.action.disabled,
							backgroundColor: (e.vars || e).palette.action.selected,
						},
					},
				},
				t.size === 'small' && {
					minWidth: 26,
					height: 26,
					borderRadius: 26 / 2,
					margin: '0 1px',
					padding: '0 4px',
				},
				t.size === 'large' && {
					minWidth: 40,
					height: 40,
					borderRadius: 40 / 2,
					padding: '0 10px',
					fontSize: e.typography.pxToRem(15),
				},
				t.shape === 'rounded' && {
					borderRadius: (e.vars || e).shape.borderRadius,
				}
			),
		({ theme: e, ownerState: t }) =>
			I(
				{},
				t.variant === 'text' && {
					[`&.${ae.selected}`]: I(
						{},
						t.color !== 'standard' && {
							color: (e.vars || e).palette[t.color].contrastText,
							backgroundColor: (e.vars || e).palette[t.color].main,
							'&:hover': {
								backgroundColor: (e.vars || e).palette[t.color].dark,
								'@media (hover: none)': {
									backgroundColor: (e.vars || e).palette[t.color].main,
								},
							},
							[`&.${ae.focusVisible}`]: {
								backgroundColor: (e.vars || e).palette[t.color].dark,
							},
						},
						{
							[`&.${ae.disabled}`]: {
								color: (e.vars || e).palette.action.disabled,
							},
						}
					),
				},
				t.variant === 'outlined' && {
					border: e.vars
						? `1px solid rgba(${e.vars.palette.common.onBackgroundChannel} / 0.23)`
						: `1px solid ${
								e.palette.mode === 'light'
									? 'rgba(0, 0, 0, 0.23)'
									: 'rgba(255, 255, 255, 0.23)'
						  }`,
					[`&.${ae.selected}`]: I(
						{},
						t.color !== 'standard' && {
							color: (e.vars || e).palette[t.color].main,
							border: `1px solid ${
								e.vars
									? `rgba(${e.vars.palette[t.color].mainChannel} / 0.5)`
									: Y(e.palette[t.color].main, 0.5)
							}`,
							backgroundColor: e.vars
								? `rgba(${e.vars.palette[t.color].mainChannel} / ${
										e.vars.palette.action.activatedOpacity
								  })`
								: Y(e.palette[t.color].main, e.palette.action.activatedOpacity),
							'&:hover': {
								backgroundColor: e.vars
									? `rgba(${e.vars.palette[t.color].mainChannel} / calc(${
											e.vars.palette.action.activatedOpacity
									  } + ${e.vars.palette.action.focusOpacity}))`
									: Y(
											e.palette[t.color].main,
											e.palette.action.activatedOpacity +
												e.palette.action.focusOpacity
									  ),
								'@media (hover: none)': { backgroundColor: 'transparent' },
							},
							[`&.${ae.focusVisible}`]: {
								backgroundColor: e.vars
									? `rgba(${e.vars.palette[t.color].mainChannel} / calc(${
											e.vars.palette.action.activatedOpacity
									  } + ${e.vars.palette.action.focusOpacity}))`
									: Y(
											e.palette[t.color].main,
											e.palette.action.activatedOpacity +
												e.palette.action.focusOpacity
									  ),
							},
						},
						{
							[`&.${ae.disabled}`]: {
								borderColor: (e.vars || e).palette.action.disabledBackground,
								color: (e.vars || e).palette.action.disabled,
							},
						}
					),
				}
			)
	),
	tu = j('div', {
		name: 'MuiPaginationItem',
		slot: 'Icon',
		overridesResolver: (e, t) => t.icon,
	})(({ theme: e, ownerState: t }) =>
		I(
			{ fontSize: e.typography.pxToRem(20), margin: '0 -8px' },
			t.size === 'small' && { fontSize: e.typography.pxToRem(18) },
			t.size === 'large' && { fontSize: e.typography.pxToRem(22) }
		)
	),
	ru = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiPaginationItem' }),
			{
				className: n,
				color: o = 'standard',
				component: c,
				components: u = {},
				disabled: d = !1,
				page: s,
				selected: f = !1,
				shape: p = 'circular',
				size: g = 'medium',
				slots: b = {},
				type: x = 'page',
				variant: y = 'text',
			} = a,
			v = Z(a, Jc),
			m = I({}, a, {
				color: o,
				disabled: d,
				selected: f,
				shape: p,
				size: g,
				type: x,
				variant: y,
			}),
			P = Da(),
			w = Yc(m),
			h = (
				P.direction === 'rtl'
					? {
							previous: b.next || u.next || Hr,
							next: b.previous || u.previous || Vr,
							last: b.first || u.first || Ue,
							first: b.last || u.last || We,
					  }
					: {
							previous: b.previous || u.previous || Vr,
							next: b.next || u.next || Hr,
							first: b.first || u.first || Ue,
							last: b.last || u.last || We,
					  }
			)[x];
		return x === 'start-ellipsis' || x === 'end-ellipsis'
			? R(Zc, { ref: r, ownerState: m, className: N(w.root, n), children: '…' })
			: ot(
					eu,
					I(
						{
							ref: r,
							ownerState: m,
							component: c,
							disabled: d,
							className: N(w.root, n),
						},
						v,
						{
							children: [
								x === 'page' && s,
								h ? R(tu, { as: h, ownerState: m, className: w.icon }) : null,
							],
						}
					)
			  );
	}),
	au = ru,
	nu = [
		'boundaryCount',
		'className',
		'color',
		'count',
		'defaultPage',
		'disabled',
		'getItemAriaLabel',
		'hideNextButton',
		'hidePrevButton',
		'onChange',
		'page',
		'renderItem',
		'shape',
		'showFirstButton',
		'showLastButton',
		'siblingCount',
		'size',
		'variant',
	],
	ou = (e) => {
		const { classes: t, variant: r } = e;
		return ce({ root: ['root', r], ul: ['ul'] }, Wc, t);
	},
	lu = j('nav', {
		name: 'MuiPagination',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [t.root, t[r.variant]];
		},
	})({}),
	iu = j('ul', {
		name: 'MuiPagination',
		slot: 'Ul',
		overridesResolver: (e, t) => t.ul,
	})({
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
		padding: 0,
		margin: 0,
		listStyle: 'none',
	});
function su(e, t, r) {
	return e === 'page' ? `${r ? '' : 'Go to '}page ${t}` : `Go to ${e} page`;
}
const cu = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiPagination' }),
			{
				boundaryCount: n = 1,
				className: o,
				color: c = 'standard',
				count: u = 1,
				defaultPage: d = 1,
				disabled: s = !1,
				getItemAriaLabel: f = su,
				hideNextButton: p = !1,
				hidePrevButton: g = !1,
				renderItem: b = (T) => R(au, I({}, T)),
				shape: x = 'circular',
				showFirstButton: y = !1,
				showLastButton: v = !1,
				siblingCount: m = 1,
				size: P = 'medium',
				variant: w = 'text',
			} = a,
			C = Z(a, nu),
			{ items: h } = Kc(I({}, a, { componentName: 'Pagination' })),
			_ = I({}, a, {
				boundaryCount: n,
				color: c,
				count: u,
				defaultPage: d,
				disabled: s,
				getItemAriaLabel: f,
				hideNextButton: p,
				hidePrevButton: g,
				renderItem: b,
				shape: x,
				showFirstButton: y,
				showLastButton: v,
				siblingCount: m,
				size: P,
				variant: w,
			}),
			O = ou(_);
		return R(
			lu,
			I(
				{
					'aria-label': 'pagination navigation',
					className: N(O.root, o),
					ownerState: _,
					ref: r,
				},
				C,
				{
					children: R(iu, {
						className: O.ul,
						ownerState: _,
						children: h.map((T, S) =>
							R(
								'li',
								{
									children: b(
										I({}, T, {
											color: c,
											'aria-label': f(T.type, T.page, T.selected),
											shape: x,
											size: P,
											variant: w,
										})
									),
								},
								S
							)
						),
					}),
				}
			)
		);
	}),
	uu = cu,
	du = l.createContext(),
	On = du;
function fu(e) {
	return ie('MuiTable', e);
}
le('MuiTable', ['root', 'stickyHeader']);
const pu = ['className', 'component', 'padding', 'size', 'stickyHeader'],
	gu = (e) => {
		const { classes: t, stickyHeader: r } = e;
		return ce({ root: ['root', r && 'stickyHeader'] }, fu, t);
	},
	vu = j('table', {
		name: 'MuiTable',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [t.root, r.stickyHeader && t.stickyHeader];
		},
	})(({ theme: e, ownerState: t }) =>
		I(
			{
				display: 'table',
				width: '100%',
				borderCollapse: 'collapse',
				borderSpacing: 0,
				'& caption': I({}, e.typography.body2, {
					padding: e.spacing(2),
					color: (e.vars || e).palette.text.secondary,
					textAlign: 'left',
					captionSide: 'bottom',
				}),
			},
			t.stickyHeader && { borderCollapse: 'separate' }
		)
	),
	qr = 'table',
	bu = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTable' }),
			{
				className: n,
				component: o = qr,
				padding: c = 'normal',
				size: u = 'medium',
				stickyHeader: d = !1,
			} = a,
			s = Z(a, pu),
			f = I({}, a, { component: o, padding: c, size: u, stickyHeader: d }),
			p = gu(f),
			g = l.useMemo(
				() => ({ padding: c, size: u, stickyHeader: d }),
				[c, u, d]
			);
		return R(On.Provider, {
			value: g,
			children: R(
				vu,
				I(
					{
						as: o,
						role: o === qr ? null : 'table',
						ref: r,
						className: N(p.root, n),
						ownerState: f,
					},
					s
				)
			),
		});
	}),
	wn = bu,
	mu = l.createContext(),
	ct = mu;
function hu(e) {
	return ie('MuiTableBody', e);
}
le('MuiTableBody', ['root']);
const yu = ['className', 'component'],
	_u = (e) => {
		const { classes: t } = e;
		return ce({ root: ['root'] }, hu, t);
	},
	xu = j('tbody', {
		name: 'MuiTableBody',
		slot: 'Root',
		overridesResolver: (e, t) => t.root,
	})({ display: 'table-row-group' }),
	Pu = { variant: 'body' },
	Ur = 'tbody',
	Ou = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTableBody' }),
			{ className: n, component: o = Ur } = a,
			c = Z(a, yu),
			u = I({}, a, { component: o }),
			d = _u(u);
		return R(ct.Provider, {
			value: Pu,
			children: R(
				xu,
				I(
					{
						className: N(d.root, n),
						as: o,
						ref: r,
						role: o === Ur ? null : 'rowgroup',
						ownerState: u,
					},
					c
				)
			),
		});
	}),
	Cn = Ou;
function wu(e) {
	return ie('MuiTableCell', e);
}
const Cu = le('MuiTableCell', [
		'root',
		'head',
		'body',
		'footer',
		'sizeSmall',
		'sizeMedium',
		'paddingCheckbox',
		'paddingNone',
		'alignLeft',
		'alignCenter',
		'alignRight',
		'alignJustify',
		'stickyHeader',
	]),
	Tu = Cu,
	Su = [
		'align',
		'className',
		'component',
		'padding',
		'scope',
		'size',
		'sortDirection',
		'variant',
	],
	Eu = (e) => {
		const {
				classes: t,
				variant: r,
				align: a,
				padding: n,
				size: o,
				stickyHeader: c,
			} = e,
			u = {
				root: [
					'root',
					r,
					c && 'stickyHeader',
					a !== 'inherit' && `align${W(a)}`,
					n !== 'normal' && `padding${W(n)}`,
					`size${W(o)}`,
				],
			};
		return ce(u, wu, t);
	},
	$u = j('td', {
		name: 'MuiTableCell',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [
				t.root,
				t[r.variant],
				t[`size${W(r.size)}`],
				r.padding !== 'normal' && t[`padding${W(r.padding)}`],
				r.align !== 'inherit' && t[`align${W(r.align)}`],
				r.stickyHeader && t.stickyHeader,
			];
		},
	})(({ theme: e, ownerState: t }) =>
		I(
			{},
			e.typography.body2,
			{
				display: 'table-cell',
				verticalAlign: 'inherit',
				borderBottom: e.vars
					? `1px solid ${e.vars.palette.TableCell.border}`
					: `1px solid
    ${
			e.palette.mode === 'light'
				? za(Y(e.palette.divider, 1), 0.88)
				: Ro(Y(e.palette.divider, 1), 0.68)
		}`,
				textAlign: 'left',
				padding: 16,
			},
			t.variant === 'head' && {
				color: (e.vars || e).palette.text.primary,
				lineHeight: e.typography.pxToRem(24),
				fontWeight: e.typography.fontWeightMedium,
			},
			t.variant === 'body' && { color: (e.vars || e).palette.text.primary },
			t.variant === 'footer' && {
				color: (e.vars || e).palette.text.secondary,
				lineHeight: e.typography.pxToRem(21),
				fontSize: e.typography.pxToRem(12),
			},
			t.size === 'small' && {
				padding: '6px 16px',
				[`&.${Tu.paddingCheckbox}`]: {
					width: 24,
					padding: '0 12px 0 16px',
					'& > *': { padding: 0 },
				},
			},
			t.padding === 'checkbox' && { width: 48, padding: '0 0 0 4px' },
			t.padding === 'none' && { padding: 0 },
			t.align === 'left' && { textAlign: 'left' },
			t.align === 'center' && { textAlign: 'center' },
			t.align === 'right' && {
				textAlign: 'right',
				flexDirection: 'row-reverse',
			},
			t.align === 'justify' && { textAlign: 'justify' },
			t.stickyHeader && {
				position: 'sticky',
				top: 0,
				zIndex: 2,
				backgroundColor: (e.vars || e).palette.background.default,
			}
		)
	),
	Iu = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTableCell' }),
			{
				align: n = 'inherit',
				className: o,
				component: c,
				padding: u,
				scope: d,
				size: s,
				sortDirection: f,
				variant: p,
			} = a,
			g = Z(a, Su),
			b = l.useContext(On),
			x = l.useContext(ct),
			y = x && x.variant === 'head';
		let v;
		c ? (v = c) : (v = y ? 'th' : 'td');
		let m = d;
		v === 'td' ? (m = void 0) : !m && y && (m = 'col');
		const P = p || (x && x.variant),
			w = I({}, a, {
				align: n,
				component: v,
				padding: u || (b && b.padding ? b.padding : 'normal'),
				size: s || (b && b.size ? b.size : 'medium'),
				sortDirection: f,
				stickyHeader: P === 'head' && b && b.stickyHeader,
				variant: P,
			}),
			C = Eu(w);
		let h = null;
		return (
			f && (h = f === 'asc' ? 'ascending' : 'descending'),
			R(
				$u,
				I(
					{
						as: v,
						ref: r,
						className: N(C.root, o),
						'aria-sort': h,
						scope: m,
						ownerState: w,
					},
					g
				)
			)
		);
	}),
	Q = Iu;
function Ru(e) {
	return ie('MuiTableHead', e);
}
le('MuiTableHead', ['root']);
const ku = ['className', 'component'],
	Fu = (e) => {
		const { classes: t } = e;
		return ce({ root: ['root'] }, Ru, t);
	},
	Au = j('thead', {
		name: 'MuiTableHead',
		slot: 'Root',
		overridesResolver: (e, t) => t.root,
	})({ display: 'table-header-group' }),
	Nu = { variant: 'head' },
	Wr = 'thead',
	ju = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTableHead' }),
			{ className: n, component: o = Wr } = a,
			c = Z(a, ku),
			u = I({}, a, { component: o }),
			d = Fu(u);
		return R(ct.Provider, {
			value: Nu,
			children: R(
				Au,
				I(
					{
						as: o,
						className: N(d.root, n),
						ref: r,
						role: o === Wr ? null : 'rowgroup',
						ownerState: u,
					},
					c
				)
			),
		});
	}),
	Tn = ju,
	Gr = fe(
		R('path', { d: 'M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z' }),
		'KeyboardArrowLeft'
	),
	Kr = fe(
		R('path', { d: 'M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z' }),
		'KeyboardArrowRight'
	);
var Qr, Xr, Jr, Yr, Zr, ea, ta, ra;
const Lu = [
		'backIconButtonProps',
		'count',
		'getItemAriaLabel',
		'nextIconButtonProps',
		'onPageChange',
		'page',
		'rowsPerPage',
		'showFirstButton',
		'showLastButton',
	],
	Mu = l.forwardRef(function (t, r) {
		const {
				backIconButtonProps: a,
				count: n,
				getItemAriaLabel: o,
				nextIconButtonProps: c,
				onPageChange: u,
				page: d,
				rowsPerPage: s,
				showFirstButton: f,
				showLastButton: p,
			} = t,
			g = Z(t, Lu),
			b = Da(),
			x = (P) => {
				u(P, 0);
			},
			y = (P) => {
				u(P, d - 1);
			},
			v = (P) => {
				u(P, d + 1);
			},
			m = (P) => {
				u(P, Math.max(0, Math.ceil(n / s) - 1));
			};
		return ot(
			'div',
			I({ ref: r }, g, {
				children: [
					f &&
						R(ve, {
							onClick: x,
							disabled: d === 0,
							'aria-label': o('first', d),
							title: o('first', d),
							children:
								b.direction === 'rtl'
									? Qr || (Qr = R(We, {}))
									: Xr || (Xr = R(Ue, {})),
						}),
					R(
						ve,
						I(
							{
								onClick: y,
								disabled: d === 0,
								color: 'inherit',
								'aria-label': o('previous', d),
								title: o('previous', d),
							},
							a,
							{
								children:
									b.direction === 'rtl'
										? Jr || (Jr = R(Kr, {}))
										: Yr || (Yr = R(Gr, {})),
							}
						)
					),
					R(
						ve,
						I(
							{
								onClick: v,
								disabled: n !== -1 ? d >= Math.ceil(n / s) - 1 : !1,
								color: 'inherit',
								'aria-label': o('next', d),
								title: o('next', d),
							},
							c,
							{
								children:
									b.direction === 'rtl'
										? Zr || (Zr = R(Gr, {}))
										: ea || (ea = R(Kr, {})),
							}
						)
					),
					p &&
						R(ve, {
							onClick: m,
							disabled: d >= Math.ceil(n / s) - 1,
							'aria-label': o('last', d),
							title: o('last', d),
							children:
								b.direction === 'rtl'
									? ta || (ta = R(Ue, {}))
									: ra || (ra = R(We, {})),
						}),
				],
			})
		);
	}),
	Bu = Mu;
function Du(e) {
	return ie('MuiTablePagination', e);
}
const zu = le('MuiTablePagination', [
		'root',
		'toolbar',
		'spacer',
		'selectLabel',
		'selectRoot',
		'select',
		'selectIcon',
		'input',
		'menuItem',
		'displayedRows',
		'actions',
	]),
	Ie = zu;
var aa;
const Vu = [
		'ActionsComponent',
		'backIconButtonProps',
		'className',
		'colSpan',
		'component',
		'count',
		'getItemAriaLabel',
		'labelDisplayedRows',
		'labelRowsPerPage',
		'nextIconButtonProps',
		'onPageChange',
		'onRowsPerPageChange',
		'page',
		'rowsPerPage',
		'rowsPerPageOptions',
		'SelectProps',
		'showFirstButton',
		'showLastButton',
	],
	Hu = j(Q, {
		name: 'MuiTablePagination',
		slot: 'Root',
		overridesResolver: (e, t) => t.root,
	})(({ theme: e }) => ({
		overflow: 'auto',
		color: (e.vars || e).palette.text.primary,
		fontSize: e.typography.pxToRem(14),
		'&:last-child': { padding: 0 },
	})),
	qu = j(lt, {
		name: 'MuiTablePagination',
		slot: 'Toolbar',
		overridesResolver: (e, t) =>
			I({ [`& .${Ie.actions}`]: t.actions }, t.toolbar),
	})(({ theme: e }) => ({
		minHeight: 52,
		paddingRight: 2,
		[`${e.breakpoints.up('xs')} and (orientation: landscape)`]: {
			minHeight: 52,
		},
		[e.breakpoints.up('sm')]: { minHeight: 52, paddingRight: 2 },
		[`& .${Ie.actions}`]: { flexShrink: 0, marginLeft: 20 },
	})),
	Uu = j('div', {
		name: 'MuiTablePagination',
		slot: 'Spacer',
		overridesResolver: (e, t) => t.spacer,
	})({ flex: '1 1 100%' }),
	Wu = j('p', {
		name: 'MuiTablePagination',
		slot: 'SelectLabel',
		overridesResolver: (e, t) => t.selectLabel,
	})(({ theme: e }) => I({}, e.typography.body2, { flexShrink: 0 })),
	Gu = j(ko, {
		name: 'MuiTablePagination',
		slot: 'Select',
		overridesResolver: (e, t) =>
			I(
				{
					[`& .${Ie.selectIcon}`]: t.selectIcon,
					[`& .${Ie.select}`]: t.select,
				},
				t.input,
				t.selectRoot
			),
	})({
		color: 'inherit',
		fontSize: 'inherit',
		flexShrink: 0,
		marginRight: 32,
		marginLeft: 8,
		[`& .${Ie.select}`]: {
			paddingLeft: 8,
			paddingRight: 24,
			textAlign: 'right',
			textAlignLast: 'right',
		},
	}),
	Ku = j(Pe, {
		name: 'MuiTablePagination',
		slot: 'MenuItem',
		overridesResolver: (e, t) => t.menuItem,
	})({}),
	Qu = j('p', {
		name: 'MuiTablePagination',
		slot: 'DisplayedRows',
		overridesResolver: (e, t) => t.displayedRows,
	})(({ theme: e }) => I({}, e.typography.body2, { flexShrink: 0 }));
function Xu({ from: e, to: t, count: r }) {
	return `${e}–${t} of ${r !== -1 ? r : `more than ${t}`}`;
}
function Ju(e) {
	return `Go to ${e} page`;
}
const Yu = (e) => {
		const { classes: t } = e;
		return ce(
			{
				root: ['root'],
				toolbar: ['toolbar'],
				spacer: ['spacer'],
				selectLabel: ['selectLabel'],
				select: ['select'],
				input: ['input'],
				selectIcon: ['selectIcon'],
				menuItem: ['menuItem'],
				displayedRows: ['displayedRows'],
				actions: ['actions'],
			},
			Du,
			t
		);
	},
	Zu = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTablePagination' }),
			{
				ActionsComponent: n = Bu,
				backIconButtonProps: o,
				className: c,
				colSpan: u,
				component: d = Q,
				count: s,
				getItemAriaLabel: f = Ju,
				labelDisplayedRows: p = Xu,
				labelRowsPerPage: g = 'Rows per page:',
				nextIconButtonProps: b,
				onPageChange: x,
				onRowsPerPageChange: y,
				page: v,
				rowsPerPage: m,
				rowsPerPageOptions: P = [10, 25, 50, 100],
				SelectProps: w = {},
				showFirstButton: C = !1,
				showLastButton: h = !1,
			} = a,
			_ = Z(a, Vu),
			O = a,
			T = Yu(O),
			S = w.native ? 'option' : Ku;
		let E;
		(d === Q || d === 'td') && (E = u || 1e3);
		const F = hr(w.id),
			A = hr(w.labelId),
			L = () =>
				s === -1 ? (v + 1) * m : m === -1 ? s : Math.min(s, (v + 1) * m);
		return R(
			Hu,
			I(
				{ colSpan: E, ref: r, as: d, ownerState: O, className: N(T.root, c) },
				_,
				{
					children: ot(qu, {
						className: T.toolbar,
						children: [
							R(Uu, { className: T.spacer }),
							P.length > 1 &&
								R(Wu, { className: T.selectLabel, id: A, children: g }),
							P.length > 1 &&
								R(
									Gu,
									I(
										{ variant: 'standard' },
										!w.variant && { input: aa || (aa = R(Fo, {})) },
										{ value: m, onChange: y, id: F, labelId: A },
										w,
										{
											classes: I({}, w.classes, {
												root: N(T.input, T.selectRoot, (w.classes || {}).root),
												select: N(T.select, (w.classes || {}).select),
												icon: N(T.selectIcon, (w.classes || {}).icon),
											}),
											children: P.map((M) =>
												l.createElement(
													S,
													I({}, !Ao(S) && { ownerState: O }, {
														className: T.menuItem,
														key: M.label ? M.label : M,
														value: M.value ? M.value : M,
													}),
													M.label ? M.label : M
												)
											),
										}
									)
								),
							R(Qu, {
								className: T.displayedRows,
								children: p({
									from: s === 0 ? 0 : v * m + 1,
									to: L(),
									count: s === -1 ? -1 : s,
									page: v,
								}),
							}),
							R(n, {
								className: T.actions,
								backIconButtonProps: o,
								count: s,
								nextIconButtonProps: b,
								onPageChange: x,
								page: v,
								rowsPerPage: m,
								showFirstButton: C,
								showLastButton: h,
								getItemAriaLabel: f,
							}),
						],
					}),
				}
			)
		);
	}),
	na = Zu;
function ed(e) {
	return ie('MuiTableRow', e);
}
const td = le('MuiTableRow', ['root', 'selected', 'hover', 'head', 'footer']),
	oa = td,
	rd = ['className', 'component', 'hover', 'selected'],
	ad = (e) => {
		const { classes: t, selected: r, hover: a, head: n, footer: o } = e;
		return ce(
			{
				root: [
					'root',
					r && 'selected',
					a && 'hover',
					n && 'head',
					o && 'footer',
				],
			},
			ed,
			t
		);
	},
	nd = j('tr', {
		name: 'MuiTableRow',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [t.root, r.head && t.head, r.footer && t.footer];
		},
	})(({ theme: e }) => ({
		color: 'inherit',
		display: 'table-row',
		verticalAlign: 'middle',
		outline: 0,
		[`&.${oa.hover}:hover`]: {
			backgroundColor: (e.vars || e).palette.action.hover,
		},
		[`&.${oa.selected}`]: {
			backgroundColor: e.vars
				? `rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`
				: Y(e.palette.primary.main, e.palette.action.selectedOpacity),
			'&:hover': {
				backgroundColor: e.vars
					? `rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`
					: Y(
							e.palette.primary.main,
							e.palette.action.selectedOpacity + e.palette.action.hoverOpacity
					  ),
			},
		},
	})),
	la = 'tr',
	od = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTableRow' }),
			{ className: n, component: o = la, hover: c = !1, selected: u = !1 } = a,
			d = Z(a, rd),
			s = l.useContext(ct),
			f = I({}, a, {
				component: o,
				hover: c,
				selected: u,
				head: s && s.variant === 'head',
				footer: s && s.variant === 'footer',
			}),
			p = ad(f);
		return R(
			nd,
			I(
				{
					as: o,
					ref: r,
					className: N(p.root, n),
					role: o === la ? null : 'row',
					ownerState: f,
				},
				d
			)
		);
	}),
	Fe = od,
	ld = fe(
		R('path', {
			d: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z',
		}),
		'ArrowDownward'
	);
function id(e) {
	return ie('MuiTableSortLabel', e);
}
const sd = le('MuiTableSortLabel', [
		'root',
		'active',
		'icon',
		'iconDirectionDesc',
		'iconDirectionAsc',
	]),
	xt = sd,
	cd = [
		'active',
		'children',
		'className',
		'direction',
		'hideSortIcon',
		'IconComponent',
	],
	ud = (e) => {
		const { classes: t, direction: r, active: a } = e,
			n = {
				root: ['root', a && 'active'],
				icon: ['icon', `iconDirection${W(r)}`],
			};
		return ce(n, id, t);
	},
	dd = j(Wt, {
		name: 'MuiTableSortLabel',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [t.root, r.active && t.active];
		},
	})(({ theme: e }) => ({
		cursor: 'pointer',
		display: 'inline-flex',
		justifyContent: 'flex-start',
		flexDirection: 'inherit',
		alignItems: 'center',
		'&:focus': { color: (e.vars || e).palette.text.secondary },
		'&:hover': {
			color: (e.vars || e).palette.text.secondary,
			[`& .${xt.icon}`]: { opacity: 0.5 },
		},
		[`&.${xt.active}`]: {
			color: (e.vars || e).palette.text.primary,
			[`& .${xt.icon}`]: {
				opacity: 1,
				color: (e.vars || e).palette.text.secondary,
			},
		},
	})),
	fd = j('span', {
		name: 'MuiTableSortLabel',
		slot: 'Icon',
		overridesResolver: (e, t) => {
			const { ownerState: r } = e;
			return [t.icon, t[`iconDirection${W(r.direction)}`]];
		},
	})(({ theme: e, ownerState: t }) =>
		I(
			{
				fontSize: 18,
				marginRight: 4,
				marginLeft: 4,
				opacity: 0,
				transition: e.transitions.create(['opacity', 'transform'], {
					duration: e.transitions.duration.shorter,
				}),
				userSelect: 'none',
			},
			t.direction === 'desc' && { transform: 'rotate(0deg)' },
			t.direction === 'asc' && { transform: 'rotate(180deg)' }
		)
	),
	pd = l.forwardRef(function (t, r) {
		const a = se({ props: t, name: 'MuiTableSortLabel' }),
			{
				active: n = !1,
				children: o,
				className: c,
				direction: u = 'asc',
				hideSortIcon: d = !1,
				IconComponent: s = ld,
			} = a,
			f = Z(a, cd),
			p = I({}, a, {
				active: n,
				direction: u,
				hideSortIcon: d,
				IconComponent: s,
			}),
			g = ud(p);
		return ot(
			dd,
			I(
				{
					className: N(g.root, c),
					component: 'span',
					disableRipple: !0,
					ownerState: p,
					ref: r,
				},
				f,
				{
					children: [
						o,
						d && !n
							? null
							: R(fd, { as: s, className: N(g.icon), ownerState: p }),
					],
				}
			)
		);
	}),
	gd = pd;
var rr = {},
	vd = Se;
Object.defineProperty(rr, '__esModule', { value: !0 });
var Sn = (rr.default = void 0),
	bd = vd(Te()),
	md = Ee,
	hd = (0, bd.default)(
		(0, md.jsx)('path', { d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' }),
		'Add'
	);
Sn = rr.default = hd;
var Ge =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Ge =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Ge.apply(this, arguments)
			);
		},
	yd =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	En = function (e) {
		var t = e.className,
			r = e.icon,
			a = r === void 0 ? _d : r,
			n = e.label,
			o = n === void 0 ? 'ra.action.create' : n;
		e.resource;
		var c = e.scrollToTop,
			u = c === void 0 ? !0 : c,
			d = e.variant,
			s = yd(e, [
				'className',
				'icon',
				'label',
				'resource',
				'scrollToTop',
				'variant',
			]),
			f = X(e),
			p = Va(),
			g = K(),
			b = Ha(function (x) {
				return x.breakpoints.down('md');
			});
		return b
			? l.createElement(
					xd,
					Ge(
						{
							component: yr,
							to: p({ resource: f, type: 'create' }),
							state: ia[String(u)],
							color: 'primary',
							className: N(St.floating, t),
							'aria-label': o && g(o),
						},
						s
					),
					a
			  )
			: l.createElement(
					Pd,
					Ge(
						{
							component: yr,
							to: p({ resource: f, type: 'create' }),
							state: ia[String(u)],
							className: N(St.root, t),
							label: o,
							variant: d,
						},
						s
					),
					a
			  );
	},
	ia = { true: { _scrollToTop: !0 }, false: {} },
	_d = l.createElement(Sn, null);
En.propTypes = {
	resource: i.string,
	className: i.string,
	icon: i.element,
	label: i.string,
};
var Ke = 'RaCreateButton',
	St = { root: ''.concat(Ke, '-root'), floating: ''.concat(Ke, '-floating') },
	xd = j(Uc, {
		name: Ke,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = {}),
			(t['&.'.concat(St.floating)] = {
				color: r.palette.getContrastText(r.palette.primary.main),
				margin: 0,
				top: 'auto',
				right: 20,
				bottom: 60,
				left: 'auto',
				position: 'fixed',
				zIndex: 1e3,
			}),
			t
		);
	}),
	Pd = j(Ne, {
		name: Ke,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})({});
const $n = l.memo(En, function (e, t) {
	return (
		e.resource === t.resource &&
		e.label === t.label &&
		e.translate === t.translate &&
		e.disabled === t.disabled
	);
});
var Qe =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Qe =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Qe.apply(this, arguments)
			);
		},
	Et =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	In = function (e) {
		var t = e.confirmTitle,
			r = t === void 0 ? 'ra.message.bulk_delete_title' : t,
			a = e.confirmContent,
			n = a === void 0 ? 'ra.message.bulk_delete_content' : a,
			o = e.icon,
			c = o === void 0 ? Td : o,
			u = e.label,
			d = u === void 0 ? 'ra.action.delete' : u,
			s = e.mutationMode,
			f = s === void 0 ? 'pessimistic' : s,
			p = e.mutationOptions,
			g = p === void 0 ? {} : p,
			b = e.onClick,
			x = Et(e, [
				'confirmTitle',
				'confirmContent',
				'icon',
				'label',
				'mutationMode',
				'mutationOptions',
				'onClick',
			]),
			y = g.meta,
			v = Et(g, ['meta']),
			m = ee(e),
			P = m.selectedIds,
			w = m.onUnselectItems,
			C = No(!1),
			h = C[0],
			_ = C[1],
			O = nt(),
			T = X(e),
			S = qa(),
			E = K(),
			F = xn(
				T,
				{ ids: P, meta: y },
				Qe(
					{
						onSuccess: function () {
							S(),
								O('ra.notification.deleted', {
									type: 'info',
									messageArgs: { smart_count: P.length },
									undoable: f === 'undoable',
								}),
								w(),
								_(!1);
						},
						onError: function (k) {
							O(
								typeof k == 'string'
									? k
									: k.message || 'ra.notification.http_error',
								{
									type: 'error',
									messageArgs: {
										_:
											typeof k == 'string'
												? k
												: k && k.message
												? k.message
												: void 0,
									},
								}
							),
								_(!1);
						},
						mutationMode: f,
					},
					v
				)
			),
			A = F[0],
			L = F[1].isLoading,
			M = function (k) {
				_(!0), k.stopPropagation();
			},
			G = function () {
				_(!1);
			},
			B = function (k) {
				A(), typeof b == 'function' && b(k);
			};
		return l.createElement(
			l.Fragment,
			null,
			l.createElement(Cd, Qe({ onClick: M, label: d }, Od(x)), c),
			l.createElement(ul, {
				isOpen: h,
				loading: L,
				title: r,
				content: n,
				translateOptions: {
					smart_count: P.length,
					name: E('resources.'.concat(T, '.forcedCaseName'), {
						smart_count: P.length,
						_: _r.humanize(
							E('resources.'.concat(T, '.name'), {
								smart_count: P.length,
								_: _r.inflect(T, P.length),
							}),
							!0
						),
					}),
				},
				onConfirm: B,
				onClose: G,
			})
		);
	},
	Od = function (e) {
		e.classes, e.filterValues, e.label, e.selectedIds;
		var t = Et(e, ['classes', 'filterValues', 'label', 'selectedIds']);
		return t;
	},
	wd = 'RaBulkDeleteWithConfirmButton',
	Cd = j(Ne, {
		name: wd,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t = e.theme;
		return {
			color: t.palette.error.main,
			'&:hover': {
				backgroundColor: Y(t.palette.error.main, 0.12),
				'@media (hover: none)': { backgroundColor: 'transparent' },
			},
		};
	}),
	Td = l.createElement(Ja, null);
In.propTypes = {
	confirmTitle: i.string,
	confirmContent: i.string,
	icon: i.element,
	label: i.string,
	mutationMode: i.oneOf(['pessimistic', 'optimistic', 'undoable']),
	resource: i.string,
	selectedIds: i.arrayOf(i.any),
};
var Xe =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Xe =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Xe.apply(this, arguments)
			);
		},
	$t =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	Rn = function (e) {
		var t = e.label,
			r = t === void 0 ? 'ra.action.delete' : t,
			a = e.icon,
			n = a === void 0 ? Sd : a,
			o = e.onClick,
			c = e.mutationOptions,
			u = c === void 0 ? {} : c,
			d = $t(e, ['label', 'icon', 'onClick', 'mutationOptions']),
			s = u.meta,
			f = $t(u, ['meta']),
			p = ee(e),
			g = p.selectedIds,
			b = p.onUnselectItems,
			x = nt(),
			y = X(e),
			v = qa(),
			m = xn(),
			P = m[0],
			w = m[1].isLoading,
			C = function (h) {
				P(
					y,
					{ ids: g, meta: s },
					Xe(
						{
							onSuccess: function () {
								x('ra.notification.deleted', {
									type: 'info',
									messageArgs: { smart_count: g.length },
									undoable: !0,
								}),
									b();
							},
							onError: function (_) {
								x(
									typeof _ == 'string'
										? _
										: _.message || 'ra.notification.http_error',
									{
										type: 'error',
										messageArgs: {
											_:
												typeof _ == 'string'
													? _
													: _ && _.message
													? _.message
													: void 0,
										},
									}
								),
									v();
							},
							mutationMode: 'undoable',
						},
						f
					)
				),
					typeof o == 'function' && o(h);
			};
		return l.createElement(
			Id,
			Xe({ onClick: C, label: r, disabled: w }, Ed(d)),
			n
		);
	},
	Sd = l.createElement(Ja, null),
	Ed = function (e) {
		e.classes, e.filterValues, e.label, e.selectedIds;
		var t = $t(e, ['classes', 'filterValues', 'label', 'selectedIds']);
		return t;
	},
	$d = 'RaBulkDeleteWithUndoButton',
	Id = j(Ne, {
		name: $d,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t = e.theme;
		return {
			color: t.palette.error.main,
			'&:hover': {
				backgroundColor: Y(t.palette.error.main, 0.12),
				'@media (hover: none)': { backgroundColor: 'transparent' },
			},
		};
	});
Rn.propTypes = {
	label: i.string,
	resource: i.string,
	selectedIds: i.arrayOf(i.any),
	icon: i.element,
};
var Je =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Je =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Je.apply(this, arguments)
			);
		},
	Rd =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	kn = function (e) {
		var t = e.mutationMode,
			r = t === void 0 ? 'undoable' : t,
			a = Rd(e, ['mutationMode']);
		return r === 'undoable'
			? l.createElement(Rn, Je({}, a))
			: l.createElement(In, Je({ mutationMode: r }, a));
	};
kn.propTypes = {
	label: i.string,
	resource: i.string,
	selectedIds: i.arrayOf(i.any),
	mutationMode: i.oneOf(['pessimistic', 'optimistic', 'undoable']),
	icon: i.element,
};
var ar = {},
	kd = Se;
Object.defineProperty(ar, '__esModule', { value: !0 });
var Fn = (ar.default = void 0),
	Fd = kd(Te()),
	Ad = Ee,
	Nd = (0, Fd.default)(
		(0, Ad.jsx)('path', { d: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' }),
		'GetApp'
	);
Fn = ar.default = Nd;
var Re =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Re =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Re.apply(this, arguments)
			);
		},
	An =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	Nn = function (e) {
		var t = e.maxResults,
			r = t === void 0 ? 1e3 : t,
			a = e.onClick,
			n = e.label,
			o = n === void 0 ? 'ra.action.export' : n,
			c = e.icon,
			u = c === void 0 ? jd : c,
			d = e.exporter,
			s = e.meta,
			f = An(e, ['maxResults', 'onClick', 'label', 'icon', 'exporter', 'meta']),
			p = ee(e),
			g = p.filter,
			b = p.filterValues,
			x = p.sort,
			y = p.exporter,
			v = p.total,
			m = X(e),
			P = d || y,
			w = Xt(),
			C = nt(),
			h = l.useCallback(
				function (_) {
					w
						.getList(m, {
							sort: x,
							filter: g ? Re(Re({}, b), g) : b,
							pagination: { page: 1, perPage: r },
							meta: s,
						})
						.then(function (O) {
							var T = O.data;
							return P && P(T, Qi(w), w, m);
						})
						.catch(function (O) {
							console.error(O),
								C('ra.notification.http_error', { type: 'error' });
						}),
						typeof a == 'function' && a(_);
				},
				[w, P, g, b, r, C, a, m, x, s]
			);
		return l.createElement(
			Ne,
			Re({ onClick: h, label: o, disabled: v === 0 }, Ld(f)),
			u
		);
	},
	jd = l.createElement(Fn, null),
	Ld = function (e) {
		e.filterValues, e.resource;
		var t = An(e, ['filterValues', 'resource']);
		return t;
	};
Nn.propTypes = {
	exporter: i.func,
	filterValues: i.object,
	label: i.string,
	maxResults: i.number,
	resource: i.string,
	sort: i.exact({ field: i.string, order: i.string }),
	icon: i.element,
	meta: i.any,
};
var nr = {},
	Md = Se;
Object.defineProperty(nr, '__esModule', { value: !0 });
var jn = (nr.default = void 0),
	Bd = Md(Te()),
	Dd = Ee,
	zd = (0, Bd.default)(
		(0, Dd.jsx)('path', {
			d: 'M14.59 8 12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
		}),
		'HighlightOff'
	);
jn = nr.default = zd;
var H = 'RaDatagrid',
	$ = {
		root: ''.concat(H, '-root'),
		table: ''.concat(H, '-table'),
		tableWrapper: ''.concat(H, '-tableWrapper'),
		thead: ''.concat(H, '-thead'),
		tbody: ''.concat(H, '-tbody'),
		headerRow: ''.concat(H, '-headerRow'),
		headerCell: ''.concat(H, '-headerCell'),
		checkbox: ''.concat(H, '-checkbox'),
		row: ''.concat(H, '-row'),
		clickableRow: ''.concat(H, '-clickableRow'),
		rowEven: ''.concat(H, '-rowEven'),
		rowOdd: ''.concat(H, '-rowOdd'),
		rowCell: ''.concat(H, '-rowCell'),
		selectable: ''.concat(H, '-selectable'),
		expandHeader: ''.concat(H, '-expandHeader'),
		expandIconCell: ''.concat(H, '-expandIconCell'),
		expandIcon: ''.concat(H, '-expandIcon'),
		expandable: ''.concat(H, '-expandable'),
		expanded: ''.concat(H, '-expanded'),
		expandedPanel: ''.concat(H, '-expandedPanel'),
	},
	Vd = j('div', {
		name: H,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = {}),
			(t['& .'.concat($.table)] = { tableLayout: 'auto' }),
			(t['& .'.concat($.tableWrapper)] = {}),
			(t['& .'.concat($.thead)] = {}),
			(t['& .'.concat($.tbody)] = {}),
			(t['& .'.concat($.headerRow)] = {}),
			(t['& .'.concat($.headerCell)] = {
				position: 'sticky',
				top: 0,
				zIndex: 2,
				backgroundColor: r.palette.background.paper,
				'&:first-of-type': { borderTopLeftRadius: r.shape.borderRadius },
				'&:last-child': { borderTopRightRadius: r.shape.borderRadius },
			}),
			(t['& .'.concat($.checkbox)] = {}),
			(t['& .'.concat($.row)] = {}),
			(t['& .'.concat($.clickableRow)] = { cursor: 'pointer' }),
			(t['& .'.concat($.rowEven)] = {}),
			(t['& .'.concat($.rowOdd)] = {}),
			(t['& .'.concat($.rowCell)] = {}),
			(t['& .'.concat($.expandHeader)] = { padding: 0, width: r.spacing(6) }),
			(t['& .'.concat($.expandIconCell)] = { width: r.spacing(6) }),
			(t['& .'.concat($.expandIcon)] = {
				padding: r.spacing(1),
				transform: 'rotate(-90deg)',
				transition: r.transitions.create('transform', {
					duration: r.transitions.duration.shortest,
				}),
			}),
			(t['& .'.concat($.expandIcon, '.').concat($.expanded)] = {
				transform: 'rotate(0deg)',
			}),
			(t['& .'.concat($.expandedPanel)] = {}),
			t
		);
	}),
	It =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(It =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				It.apply(this, arguments)
			);
		},
	Hd =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	or = l.forwardRef(function (e, t) {
		var r = e.className,
			a = e.field;
		e.record, e.resource;
		var n = Hd(e, ['className', 'field', 'record', 'resource']);
		return l.createElement(
			Q,
			It(
				{
					className: N(r, a.props.cellClassName),
					align: a.props.textAlign,
					ref: t,
				},
				n
			),
			a
		);
	});
or.propTypes = {
	className: i.string,
	field: i.element,
	record: i.object,
	resource: i.string,
};
or.displayName = 'DatagridCell';
const qd = or;
var Rt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Rt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Rt.apply(this, arguments)
			);
		},
	Ud =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	Wd = function (e) {
		var t = e.expanded,
			r = e.expandContentId,
			a = Ud(e, ['expanded', 'expandContentId']),
			n = K();
		return l.createElement(
			ve,
			Rt(
				{
					'aria-label': n(t ? 'ra.action.close' : 'ra.action.expand'),
					'aria-expanded': t,
					'aria-controls': r,
					tabIndex: -1,
					'aria-hidden': 'true',
					component: 'div',
				},
				a,
				{ size: 'small' }
			),
			l.createElement(Gt, { fontSize: 'inherit' })
		);
	};
const Gd = l.memo(Wd);
var Ln = l.createContext({});
Ln.displayName = 'DatagridContext';
const Mn = Ln;
var Bn = function (e) {
		var t = l.useContext(Mn);
		return l.useMemo(
			function () {
				return Jt(
					{},
					e != null ? { isRowExpandable: e.isRowExpandable } : {},
					t
				);
			},
			[t, e]
		);
	},
	Ye =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Ye =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Ye.apply(this, arguments)
			);
		},
	Kd =
		(globalThis && globalThis.__awaiter) ||
		function (e, t, r, a) {
			function n(o) {
				return o instanceof r
					? o
					: new r(function (c) {
							c(o);
					  });
			}
			return new (r || (r = Promise))(function (o, c) {
				function u(f) {
					try {
						s(a.next(f));
					} catch (p) {
						c(p);
					}
				}
				function d(f) {
					try {
						s(a.throw(f));
					} catch (p) {
						c(p);
					}
				}
				function s(f) {
					f.done ? o(f.value) : n(f.value).then(u, d);
				}
				s((a = a.apply(e, t || [])).next());
			});
		},
	Qd =
		(globalThis && globalThis.__generator) ||
		function (e, t) {
			var r = {
					label: 0,
					sent: function () {
						if (o[0] & 1) throw o[1];
						return o[1];
					},
					trys: [],
					ops: [],
				},
				a,
				n,
				o,
				c;
			return (
				(c = { next: u(0), throw: u(1), return: u(2) }),
				typeof Symbol == 'function' &&
					(c[Symbol.iterator] = function () {
						return this;
					}),
				c
			);
			function u(s) {
				return function (f) {
					return d([s, f]);
				};
			}
			function d(s) {
				if (a) throw new TypeError('Generator is already executing.');
				for (; r; )
					try {
						if (
							((a = 1),
							n &&
								(o =
									s[0] & 2
										? n.return
										: s[0]
										? n.throw || ((o = n.return) && o.call(n), 0)
										: n.next) &&
								!(o = o.call(n, s[1])).done)
						)
							return o;
						switch (((n = 0), o && (s = [s[0] & 2, o.value]), s[0])) {
							case 0:
							case 1:
								o = s;
								break;
							case 4:
								return r.label++, { value: s[1], done: !1 };
							case 5:
								r.label++, (n = s[1]), (s = [0]);
								continue;
							case 7:
								(s = r.ops.pop()), r.trys.pop();
								continue;
							default:
								if (
									((o = r.trys),
									!(o = o.length > 0 && o[o.length - 1]) &&
										(s[0] === 6 || s[0] === 2))
								) {
									r = 0;
									continue;
								}
								if (s[0] === 3 && (!o || (s[1] > o[0] && s[1] < o[3]))) {
									r.label = s[1];
									break;
								}
								if (s[0] === 6 && r.label < o[1]) {
									(r.label = o[1]), (o = s);
									break;
								}
								if (o && r.label < o[2]) {
									(r.label = o[2]), r.ops.push(s);
									break;
								}
								o[2] && r.ops.pop(), r.trys.pop();
								continue;
						}
						s = t.call(e, r);
					} catch (f) {
						(s = [6, f]), (n = 0);
					} finally {
						a = o = 0;
					}
				if (s[0] & 5) throw s[1];
				return { value: s[0] ? s[1] : void 0, done: !0 };
			}
		},
	kt =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	sa = function (e, t, r) {
		return e
			? 1 +
					(r ? 1 : 0) +
					J.Children.toArray(t).filter(function (a) {
						return !!a;
					}).length
			: 0;
	},
	ut = J.forwardRef(function (e, t) {
		var r,
			a,
			n = e.children,
			o = e.className,
			c = e.expand,
			u = e.hasBulkActions,
			d = e.hover,
			s = e.id,
			f = e.onToggleItem;
		e.record;
		var p = e.rowClick,
			g = e.selected,
			b = e.style,
			x = e.selectable,
			y = kt(e, [
				'children',
				'className',
				'expand',
				'hasBulkActions',
				'hover',
				'id',
				'onToggleItem',
				'record',
				'rowClick',
				'selected',
				'style',
				'selectable',
			]),
			v = Bn(),
			m = K(),
			P = jo(e),
			w = (!v || !v.isRowExpandable || v.isRowExpandable(P)) && c,
			C = X(e),
			h = Va(),
			_ = wc(C, s, v && v.expandSingle),
			O = _[0],
			T = _[1],
			S = l.useState(function () {
				return sa(w, n, u);
			}),
			E = S[0],
			F = S[1];
		l.useEffect(
			function () {
				var B = sa(w, n, u);
				B !== E && F(B);
			},
			[w, E, n, u]
		);
		var A = Ut(),
			L = l.useCallback(
				function (B) {
					T(), B.stopPropagation();
				},
				[T]
			),
			M = l.useCallback(
				function (B) {
					x && (f(s, B), B.stopPropagation());
				},
				[s, f, x]
			),
			G = l.useCallback(
				function (B) {
					return Kd(void 0, void 0, void 0, function () {
						var k, te;
						return Qd(this, function (ne) {
							switch (ne.label) {
								case 0:
									return (
										B.persist(),
										typeof p != 'function' ? [3, 2] : [4, p(s, C, P)]
									);
								case 1:
									return (te = ne.sent()), [3, 3];
								case 2:
									(te = p), (ne.label = 3);
								case 3:
									return (
										(k = te),
										k === !1 || k == null
											? [2]
											: ['edit', 'show'].includes(k)
											? (A(h({ resource: C, id: s, type: k })), [2])
											: k === 'expand'
											? (L(B), [2])
											: k === 'toggleSelection'
											? (M(B), [2])
											: (A(k), [2])
									);
							}
						});
					});
				},
				[p, s, C, P, A, h, L, M]
			);
		return J.createElement(
			Lo,
			{ value: P },
			J.createElement(
				Fe,
				Ye(
					{
						ref: t,
						className: N(
							o,
							((r = {}),
							(r[$.expandable] = w),
							(r[$.selectable] = x),
							(r[$.clickableRow] = typeof p == 'function' ? !0 : p),
							r)
						),
						key: s,
						style: b,
						hover: d,
						onClick: G,
					},
					y
				),
				c &&
					J.createElement(
						Q,
						{ padding: 'none', className: $.expandIconCell },
						w &&
							J.createElement(Gd, {
								className: N($.expandIcon, ((a = {}), (a[$.expanded] = O), a)),
								expanded: O,
								onClick: L,
								expandContentId: ''.concat(s, '-expand'),
							})
					),
				u &&
					J.createElement(
						Q,
						{ padding: 'checkbox' },
						J.createElement(qe, {
							'aria-label': m('ra.action.select_row', { _: 'Select this row' }),
							color: 'primary',
							className: 'select-item '.concat($.checkbox),
							checked: x && g,
							onClick: M,
							disabled: !x,
						})
					),
				J.Children.map(n, function (B, k) {
					return l.isValidElement(B)
						? J.createElement(
								qd,
								Ye(
									{
										key: ''.concat(s, '-').concat(B.props.source || k),
										className: N('column-'.concat(B.props.source), $.rowCell),
										record: P,
									},
									{ field: B, resource: C }
								)
						  )
						: null;
				})
			),
			w &&
				O &&
				J.createElement(
					Fe,
					{
						key: ''.concat(s, '-expand'),
						id: ''.concat(s, '-expand'),
						className: $.expandedPanel,
					},
					J.createElement(
						Q,
						{ colSpan: E },
						l.isValidElement(c)
							? l.cloneElement(c, { record: P, resource: C, id: String(s) })
							: l.createElement(c, { record: P, resource: C, id: String(s) })
					)
				)
		);
	});
ut.propTypes = {
	children: i.node,
	className: i.string,
	expand: i.oneOfType([i.element, i.elementType]),
	hasBulkActions: i.bool.isRequired,
	hover: i.bool,
	id: i.any,
	onToggleItem: i.func,
	record: i.object,
	resource: i.string,
	rowClick: i.oneOfType([i.string, i.func]),
	selected: i.bool,
	style: i.object,
	selectable: i.bool,
};
ut.defaultProps = {
	hasBulkActions: !1,
	hover: !0,
	selected: !1,
	selectable: !0,
};
var Xd = function (e, t) {
		e.children, e.expand;
		var r = kt(e, ['children', 'expand']);
		t.children, t.expand;
		var a = kt(t, ['children', 'expand']);
		return on(r, a);
	},
	Dn = l.memo(ut, Xd);
Dn.displayName = 'PureDatagridRow';
const Jd = ut;
var Ft =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Ft =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Ft.apply(this, arguments)
			);
		},
	Yd =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	je = l.forwardRef(function (e, t) {
		var r = e.children,
			a = e.className,
			n = e.data,
			o = e.expand,
			c = e.hasBulkActions,
			u = e.hover,
			d = e.onToggleItem,
			s = e.resource,
			f = e.row,
			p = e.rowClick,
			g = e.rowStyle,
			b = e.selectedIds,
			x = e.isRowSelectable,
			y = Yd(e, [
				'children',
				'className',
				'data',
				'expand',
				'hasBulkActions',
				'hover',
				'onToggleItem',
				'resource',
				'row',
				'rowClick',
				'rowStyle',
				'selectedIds',
				'isRowSelectable',
			]);
		return l.createElement(
			Cn,
			Ft({ ref: t, className: N('datagrid-body', a, $.tbody) }, y),
			n.map(function (v, m) {
				var P, w, C;
				return l.cloneElement(
					f,
					{
						className: N(
							$.row,
							((P = {}),
							(P[$.rowEven] = m % 2 === 0),
							(P[$.rowOdd] = m % 2 !== 0),
							P)
						),
						expand: o,
						hasBulkActions: c && !!b,
						hover: u,
						id: (w = v.id) !== null && w !== void 0 ? w : 'row'.concat(m),
						key: (C = v.id) !== null && C !== void 0 ? C : 'row'.concat(m),
						onToggleItem: d,
						record: v,
						resource: s,
						rowClick: p,
						selectable: !x || x(v),
						selected: b == null ? void 0 : b.includes(v.id),
						style: g ? g(v, m) : null,
					},
					r
				);
			})
		);
	});
je.propTypes = {
	className: i.string,
	children: i.node,
	data: i.arrayOf(i.object).isRequired,
	expand: i.oneOfType([i.element, i.elementType]),
	hasBulkActions: i.bool.isRequired,
	hover: i.bool,
	onToggleItem: i.func,
	resource: i.string,
	row: i.element,
	rowClick: i.oneOfType([i.string, i.func]),
	rowStyle: i.func,
	selectedIds: i.arrayOf(i.any),
	styles: i.object,
	isRowSelectable: i.func,
};
je.defaultProps = {
	data: [],
	hasBulkActions: !1,
	row: l.createElement(Jd, null),
};
je.muiName = 'TableBody';
var lr = l.memo(je);
lr.muiName = 'TableBody';
lr.defaultProps = { row: l.createElement(Dn, null) };
const Zd = je;
var At =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(At =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				At.apply(this, arguments)
			);
		},
	ef =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	zn = function (e) {
		var t = e.className,
			r = e.field,
			a = e.sort,
			n = e.updateSort;
		e.isSorting;
		var o = ef(e, ['className', 'field', 'sort', 'updateSort', 'isSorting']),
			c = X(e),
			u = K();
		return l.createElement(
			af,
			At(
				{
					className: N(t, r.props.headerClassName),
					align: r.props.textAlign,
					variant: 'head',
				},
				o
			),
			n && r.props.sortable !== !1 && (r.props.sortBy || r.props.source)
				? l.createElement(
						Mo,
						{
							title: u('ra.action.sort'),
							placement:
								r.props.textAlign === 'right' ? 'bottom-end' : 'bottom-start',
							enterDelay: 300,
						},
						l.createElement(
							gd,
							{
								active: a.field === (r.props.sortBy || r.props.source),
								direction: a.order === 'ASC' ? 'asc' : 'desc',
								'data-field': r.props.sortBy || r.props.source,
								'data-order': r.props.sortByOrder || 'ASC',
								onClick: n,
								classes: rf,
							},
							l.createElement(Ot, {
								label: r.props.label,
								source: r.props.source,
								resource: c,
							})
						)
				  )
				: l.createElement(Ot, {
						label: r.props.label,
						source: r.props.source,
						resource: c,
				  })
		);
	};
zn.propTypes = {
	className: i.string,
	field: i.element,
	sort: i.shape({ field: i.string, order: i.string }).isRequired,
	isSorting: i.bool,
	resource: i.string,
	updateSort: i.func,
};
const tf = l.memo(zn, function (e, t) {
	return (
		e.updateSort === t.updateSort &&
		e.sort.field === t.sort.field &&
		e.sort.order === t.sort.order &&
		e.isSorting === t.isSorting &&
		e.resource === t.resource
	);
});
var Vn = 'RaDatagridHeaderCell',
	rf = { icon: ''.concat(Vn, '-icon') },
	af = j(Q, {
		name: Vn,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t;
		return (
			e.theme,
			(t = {}),
			(t['& .MuiTableSortLabel-icon'] = { display: 'none' }),
			(t['& .Mui-active .MuiTableSortLabel-icon'] = { display: 'inline' }),
			t
		);
	}),
	ca = function (e) {
		return l.createElement(of, { className: e.className }, ' ');
	},
	nf = 'RaPlaceholder',
	of = j('span', {
		name: nf,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t = e.theme;
		return { backgroundColor: t.palette.grey[300], display: 'flex' };
	}),
	Pt = function (e, t) {
		return Array.from({ length: e }, function (r, a) {
			return t(a);
		});
	},
	Hn = function (e) {
		var t = e.className,
			r = e.expand,
			a = e.hasBulkActions,
			n = e.nbChildren,
			o = e.nbFakeLines,
			c = o === void 0 ? 5 : o,
			u = e.size,
			d = Bo(1e3);
		return d
			? l.createElement(
					'div',
					{ className: $.root },
					l.createElement(
						wn,
						{ className: N($.table, t), size: u },
						l.createElement(
							Tn,
							null,
							l.createElement(
								Fe,
								{ className: $.row },
								r &&
									l.createElement(Q, {
										padding: 'none',
										className: $.expandHeader,
									}),
								a &&
									l.createElement(
										Q,
										{ padding: 'checkbox', className: $.expandIconCell },
										l.createElement(qe, {
											className: 'select-all',
											color: 'primary',
											checked: !1,
										})
									),
								Pt(n, function (s) {
									return l.createElement(
										Q,
										{ variant: 'head', className: $.headerCell, key: s },
										l.createElement(ca, null)
									);
								})
							)
						),
						l.createElement(
							Cn,
							null,
							Pt(c, function (s) {
								return l.createElement(
									Fe,
									{ key: s, style: { opacity: 1 / (s + 1) } },
									r &&
										l.createElement(
											Q,
											{ padding: 'none', className: $.expandIconCell },
											l.createElement(
												ve,
												{
													className: $.expandIcon,
													component: 'div',
													'aria-hidden': 'true',
													size: 'large',
												},
												l.createElement(Gt, null)
											)
										),
									a &&
										l.createElement(
											Q,
											{ padding: 'checkbox', className: $.expandIconCell },
											l.createElement(qe, {
												className: 'select-all',
												color: 'primary',
												checked: !1,
											})
										),
									Pt(n, function (f) {
										return l.createElement(
											Q,
											{ className: $.rowCell, key: f },
											l.createElement(ca, null)
										);
									})
								);
							})
						)
					)
			  )
			: null;
	};
Hn.propTypes = {
	className: i.string,
	expand: i.oneOfType([i.element, i.elementType]),
	hasBulkActions: i.bool,
	nbChildren: i.number,
	nbFakeLines: i.number,
	size: i.oneOf(['small', 'medium']),
};
const lf = l.memo(Hn);
var sf = Ca,
	cf = an,
	uf = nn,
	df = La,
	ff = Kt,
	pf = Ta,
	gf = 200;
function vf(e, t, r, a) {
	var n = -1,
		o = cf,
		c = !0,
		u = e.length,
		d = [],
		s = t.length;
	if (!u) return d;
	r && (t = df(t, ff(r))),
		a
			? ((o = uf), (c = !1))
			: t.length >= gf && ((o = pf), (c = !1), (t = new sf(t)));
	e: for (; ++n < u; ) {
		var f = e[n],
			p = r == null ? f : r(f);
		if (((f = a || f !== 0 ? f : 0), c && p === p)) {
			for (var g = s; g--; ) if (t[g] === p) continue e;
			d.push(f);
		} else o(t, p, a) || d.push(f);
	}
	return d;
}
var bf = vf,
	mf = bf,
	hf = Ea,
	yf = Sa,
	ua = $a,
	_f = yf(function (e, t) {
		return ua(e) ? mf(e, hf(t, 1, ua, !0)) : [];
	}),
	xf = _f,
	Pf = function (e) {
		var t,
			r = e.resource,
			a = e.ids,
			n = K(),
			o = Cc(r, a),
			c = o[0],
			u = o[1];
		return l.createElement(
			ve,
			{
				className: N($.expandIcon, ((t = {}), (t[$.expanded] = c), t)),
				'aria-label': n(c ? 'ra.action.close' : 'ra.action.expand'),
				'aria-expanded': c,
				tabIndex: -1,
				'aria-hidden': 'true',
				onClick: u,
				size: 'small',
			},
			l.createElement(Gt, { fontSize: 'inherit' })
		);
	};
const Of = l.memo(Pf);
var ir = function (e) {
	var t = e.children,
		r = e.className,
		a = e.hasExpand,
		n = a === void 0 ? !1 : a,
		o = e.hasBulkActions,
		c = o === void 0 ? !1 : o,
		u = e.isRowSelectable,
		d = X(e),
		s = K(),
		f = ee(e),
		p = f.sort,
		g = f.data,
		b = f.onSelect,
		x = f.selectedIds,
		y = f.setSort,
		v = Bn().expandSingle,
		m = l.useCallback(
			function (h) {
				h.stopPropagation();
				var _ = h.currentTarget.dataset.field,
					O =
						p.field === _
							? p.order === 'ASC'
								? 'DESC'
								: 'ASC'
							: h.currentTarget.dataset.order;
				y({ field: _, order: O });
			},
			[p.field, p.order, y]
		),
		P = y ? m : null,
		w = l.useCallback(
			function (h) {
				return b(
					h.target.checked
						? x.concat(
								g
									.filter(function (_) {
										return !x.includes(_.id);
									})
									.filter(function (_) {
										return u ? u(_) : !0;
									})
									.map(function (_) {
										return _.id;
									})
						  )
						: []
				);
			},
			[g, b, u, x]
		),
		C = Array.isArray(g)
			? u
				? g
						.filter(function (h) {
							return u(h);
						})
						.map(function (h) {
							return h.id;
						})
				: g.map(function (h) {
						return h.id;
				  })
			: [];
	return l.createElement(
		Tn,
		{ className: N(r, $.thead) },
		l.createElement(
			Fe,
			{ className: N($.row, $.headerRow) },
			n &&
				l.createElement(
					Q,
					{ padding: 'none', className: N($.headerCell, $.expandHeader) },
					v
						? null
						: l.createElement(Of, {
								resource: d,
								ids: g.map(function (h) {
									return h.id;
								}),
						  })
				),
			c &&
				x &&
				l.createElement(
					Q,
					{ padding: 'checkbox', className: $.headerCell },
					l.createElement(qe, {
						'aria-label': s('ra.action.select_all', { _: 'Select all' }),
						className: 'select-all',
						color: 'primary',
						checked:
							x.length > 0 &&
							C.length > 0 &&
							C.every(function (h) {
								return x.includes(h);
							}),
						onChange: w,
					})
				),
			l.Children.map(t, function (h, _) {
				return l.isValidElement(h)
					? l.createElement(tf, {
							className: N($.headerCell, 'column-'.concat(h.props.source)),
							sort: p,
							field: h,
							isSorting: p.field === (h.props.sortBy || h.props.source),
							key: h.props.source || _,
							resource: d,
							updateSort: P,
					  })
					: null;
			})
		)
	);
};
ir.propTypes = {
	children: i.node,
	className: i.string,
	sort: i.exact({ field: i.string, order: i.string }),
	data: i.arrayOf(i.any),
	hasExpand: i.bool,
	hasBulkActions: i.bool,
	isRowSelectable: i.func,
	isRowExpandable: i.func,
	onSelect: i.func,
	onToggleItem: i.func,
	resource: i.string,
	selectedIds: i.arrayOf(i.any),
	setSort: i.func,
};
ir.displayName = 'DatagridHeader';
var wf = function (e) {
	var t = e.children,
		r = e.value;
	return J.createElement(Mn.Provider, { value: r }, t);
};
const Cf = wf;
var sr = {},
	Tf = Se;
Object.defineProperty(sr, '__esModule', { value: !0 });
var qn = (sr.default = void 0),
	Sf = Tf(Te()),
	Ef = Ee,
	$f = (0, Sf.default)(
		(0, Ef.jsx)('path', {
			d: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
		}),
		'Close'
	);
qn = sr.default = $f;
var Nt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Nt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Nt.apply(this, arguments)
			);
		},
	If =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	Un = function (e) {
		var t,
			r = e.label,
			a = r === void 0 ? 'ra.action.bulk_actions' : r,
			n = e.children,
			o = e.className,
			c = If(e, ['label', 'children', 'className']),
			u = ee(e),
			d = u.filterValues,
			s = u.resource,
			f = u.selectedIds,
			p = f === void 0 ? [] : f,
			g = u.onUnselectItems,
			b = K(),
			x = l.useCallback(
				function () {
					g();
				},
				[g]
			);
		return l.createElement(
			Rf,
			{ className: o },
			l.createElement(
				lt,
				Nt(
					{
						'data-test': 'bulk-actions-toolbar',
						className: N(
							oe.toolbar,
							((t = {}), (t[oe.collapsed] = p.length === 0), t)
						),
					},
					ke(c)
				),
				l.createElement(
					'div',
					{ className: oe.title },
					l.createElement(
						ve,
						{
							className: oe.icon,
							'aria-label': b('ra.action.unselect'),
							title: b('ra.action.unselect'),
							onClick: x,
							size: 'small',
						},
						l.createElement(qn, { fontSize: 'small' })
					),
					l.createElement(
						ze,
						{ color: 'inherit', variant: 'subtitle1' },
						b(a, { _: a, smart_count: p.length })
					)
				),
				l.createElement(
					rn,
					{ className: oe.topToolbar },
					l.Children.map(n, function (y) {
						return l.isValidElement(y)
							? l.cloneElement(y, {
									filterValues: d,
									resource: s,
									selectedIds: p,
							  })
							: null;
					})
				)
			)
		);
	};
Un.propTypes = { children: i.node, label: i.string };
var he = 'RaBulkActionsToolbar',
	oe = {
		toolbar: ''.concat(he, '-toolbar'),
		topToolbar: ''.concat(he, '-topToolbar'),
		buttons: ''.concat(he, '-buttons'),
		collapsed: ''.concat(he, '-collapsed'),
		title: ''.concat(he, '-title'),
		icon: ''.concat(he, '-icon'),
	},
	Rf = j('div', {
		name: he,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = { position: 'relative' }),
			(t['& .'.concat(oe.toolbar)] = {
				position: 'absolute',
				left: 0,
				right: 0,
				zIndex: 3,
				color:
					r.palette.mode === 'light'
						? r.palette.primary.main
						: r.palette.text.primary,
				justifyContent: 'space-between',
				backgroundColor:
					r.palette.mode === 'light'
						? za(r.palette.primary.light, 0.8)
						: r.palette.primary.dark,
				minHeight: r.spacing(6),
				height: r.spacing(6),
				transform: 'translateY(-'.concat(r.spacing(6), ')'),
				transition: ''
					.concat(r.transitions.create('height'), ', ')
					.concat(r.transitions.create('min-height'), ', ')
					.concat(r.transitions.create('transform')),
				borderTopLeftRadius: r.shape.borderRadius,
				borderTopRightRadius: r.shape.borderRadius,
			}),
			(t['& .'.concat(oe.topToolbar)] = {
				paddingBottom: r.spacing(1),
				minHeight: 'auto',
			}),
			(t['& .'.concat(oe.buttons)] = {}),
			(t['& .'.concat(oe.collapsed)] = {
				minHeight: 0,
				height: 0,
				transform: 'translateY(0)',
				overflowY: 'hidden',
			}),
			(t['& .'.concat(oe.title)] = { display: 'flex', flex: '0 0 auto' }),
			(t['& .'.concat(oe.icon)] = {
				marginLeft: '-0.5em',
				marginRight: '0.5em',
			}),
			t
		);
	}),
	kf = l.memo(function () {
		var e = K(),
			t = X();
		return l.createElement(
			Do,
			null,
			l.createElement(
				ze,
				{ variant: 'body2' },
				e('ra.navigation.no_results', { resource: t })
			)
		);
	}),
	Ae =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Ae =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Ae.apply(this, arguments)
			);
		},
	Ff =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	da = l.createElement(kn, null),
	Wn = l.forwardRef(function (e, t) {
		var r = e.optimized,
			a = r === void 0 ? !1 : r,
			n = e.body,
			o = n === void 0 ? (a ? lr : Zd) : n,
			c = e.header,
			u = c === void 0 ? ir : c,
			d = e.children,
			s = e.className,
			f = e.empty,
			p = f === void 0 ? jf : f,
			g = e.expand,
			b = e.bulkActionButtons,
			x = b === void 0 ? da : b,
			y = e.hover,
			v = e.isRowSelectable,
			m = e.isRowExpandable,
			P = e.resource,
			w = e.rowClick,
			C = e.rowStyle,
			h = e.size,
			_ = h === void 0 ? 'small' : h,
			O = e.sx,
			T = e.expandSingle,
			S = T === void 0 ? !1 : T,
			E = Ff(e, [
				'optimized',
				'body',
				'header',
				'children',
				'className',
				'empty',
				'expand',
				'bulkActionButtons',
				'hover',
				'isRowSelectable',
				'isRowExpandable',
				'resource',
				'rowClick',
				'rowStyle',
				'size',
				'sx',
				'expandSingle',
			]),
			F = ee(e),
			A = F.sort,
			L = F.data,
			M = F.isLoading,
			G = F.onSelect,
			B = F.onToggleItem,
			k = F.selectedIds,
			te = F.setSort,
			ne = F.total,
			D = !!x,
			re = l.useMemo(
				function () {
					return { isRowExpandable: m, expandSingle: S };
				},
				[m, S]
			),
			U = l.useRef(null);
		l.useEffect(
			function () {
				(!k || k.length === 0) && (U.current = null);
			},
			[JSON.stringify(k)]
		);
		var V = l.useCallback(
			function (ue, xe) {
				var ft = L.map(function (gt) {
						return gt.id;
					}),
					pt = ft.indexOf(U.current);
				if (
					((U.current = xe.target.checked ? ue : null),
					xe.shiftKey && pt !== -1)
				) {
					var vr = ft.indexOf(ue),
						br = ft.slice(Math.min(pt, vr), Math.max(pt, vr) + 1),
						mr = xe.target.checked ? Kl(k, br) : xf(k, br);
					G(
						v
							? mr.filter(function (gt) {
									return v(
										L.find(function (fo) {
											return fo.id === gt;
										})
									);
							  })
							: mr
					);
				} else B(ue);
			},
			[L, v, G, B, k]
		);
		return M === !0
			? l.createElement(lf, {
					className: s,
					expand: g,
					hasBulkActions: D,
					nbChildren: l.Children.count(d),
					size: _,
			  })
			: L == null || L.length === 0 || ne === 0
			? p || null
			: l.createElement(
					Cf,
					{ value: re },
					l.createElement(
						Vd,
						{ sx: O, className: $.root },
						x !== !1
							? l.createElement(
									Un,
									{ selectedIds: k },
									l.isValidElement(x) ? x : da
							  )
							: null,
						l.createElement(
							'div',
							{ className: $.tableWrapper },
							l.createElement(
								wn,
								Ae({ ref: t, className: N($.table, s), size: _ }, Nf(E)),
								fa(
									u,
									{
										children: d,
										sort: A,
										data: L,
										hasExpand: !!g,
										hasBulkActions: D,
										isRowSelectable: v,
										onSelect: G,
										resource: P,
										selectedIds: k,
										setSort: te,
									},
									d
								),
								fa(
									o,
									{
										expand: g,
										rowClick: w,
										data: L,
										hasBulkActions: D,
										hover: y,
										onToggleItem: V,
										resource: P,
										rowStyle: C,
										selectedIds: k,
										isRowSelectable: v,
									},
									d
								)
							)
						)
					)
			  );
	}),
	fa = function (e, t, r) {
		return l.isValidElement(e)
			? l.cloneElement(e, t, r)
			: l.createElement(e, t, r);
	};
Wn.propTypes = {
	body: i.oneOfType([i.element, i.elementType]),
	bulkActionButtons: i.oneOfType([i.bool, i.element]),
	children: i.node.isRequired,
	className: i.string,
	sort: i.exact({ field: i.string, order: i.string }),
	data: i.arrayOf(i.any),
	empty: i.element,
	expand: i.oneOfType([i.element, i.elementType]),
	header: i.oneOfType([i.element, i.elementType]),
	hover: i.bool,
	isLoading: i.bool,
	onSelect: i.func,
	onToggleItem: i.func,
	resource: i.string,
	rowClick: i.oneOfType([i.string, i.func]),
	rowStyle: i.func,
	selectedIds: i.arrayOf(i.any),
	setSort: i.func,
	total: i.number,
	isRowSelectable: i.func,
	isRowExpandable: i.func,
	expandSingle: i.bool,
};
var Af = [
		'isRequired',
		'setFilter',
		'setPagination',
		'limitChoicesToValue',
		'translateChoice',
		'field',
		'fieldState',
		'formState',
	],
	Nf = function (e) {
		return Object.keys(ke(e))
			.filter(function (t) {
				return !Af.includes(t);
			})
			.reduce(function (t, r) {
				var a;
				return Ae(Ae({}, t), ((a = {}), (a[r] = e[r]), a));
			}, {});
	};
Wn.displayName = 'Datagrid';
var jf = l.createElement(kf, null);
function Lf(e, t) {
	for (
		var r = -1, a = e == null ? 0 : e.length;
		++r < a && t(e[r], r, e) !== !1;

	);
	return e;
}
var Mf = Lf,
	Bf = it,
	Df = Ht;
function zf(e, t) {
	return e && Bf(t, Df(t), e);
}
var Vf = zf,
	Hf = it,
	qf = qt;
function Uf(e, t) {
	return e && Hf(t, qf(t), e);
}
var Wf = Uf,
	Gf = it,
	Kf = ja;
function Qf(e, t) {
	return Gf(e, Kf(e), t);
}
var Xf = Qf,
	Jf = it,
	Yf = mn;
function Zf(e, t) {
	return Jf(e, Yf(e), t);
}
var ep = Zf,
	tp = Object.prototype,
	rp = tp.hasOwnProperty;
function ap(e) {
	var t = e.length,
		r = new e.constructor(t);
	return (
		t &&
			typeof e[0] == 'string' &&
			rp.call(e, 'index') &&
			((r.index = e.index), (r.input = e.input)),
		r
	);
}
var np = ap,
	op = Ua;
function lp(e, t) {
	var r = t ? op(e.buffer) : e.buffer;
	return new e.constructor(r, e.byteOffset, e.byteLength);
}
var ip = lp,
	sp = /\w*$/;
function cp(e) {
	var t = new e.constructor(e.source, sp.exec(e));
	return (t.lastIndex = e.lastIndex), t;
}
var up = cp,
	pa = zo,
	ga = pa ? pa.prototype : void 0,
	va = ga ? ga.valueOf : void 0;
function dp(e) {
	return va ? Object(va.call(e)) : {};
}
var fp = dp,
	pp = Ua,
	gp = ip,
	vp = up,
	bp = fp,
	mp = Vo,
	hp = '[object Boolean]',
	yp = '[object Date]',
	_p = '[object Map]',
	xp = '[object Number]',
	Pp = '[object RegExp]',
	Op = '[object Set]',
	wp = '[object String]',
	Cp = '[object Symbol]',
	Tp = '[object ArrayBuffer]',
	Sp = '[object DataView]',
	Ep = '[object Float32Array]',
	$p = '[object Float64Array]',
	Ip = '[object Int8Array]',
	Rp = '[object Int16Array]',
	kp = '[object Int32Array]',
	Fp = '[object Uint8Array]',
	Ap = '[object Uint8ClampedArray]',
	Np = '[object Uint16Array]',
	jp = '[object Uint32Array]';
function Lp(e, t, r) {
	var a = e.constructor;
	switch (t) {
		case Tp:
			return pp(e);
		case hp:
		case yp:
			return new a(+e);
		case Sp:
			return gp(e, r);
		case Ep:
		case $p:
		case Ip:
		case Rp:
		case kp:
		case Fp:
		case Ap:
		case Np:
		case jp:
			return mp(e, r);
		case _p:
			return new a();
		case xp:
		case wp:
			return new a(e);
		case Pp:
			return vp(e);
		case Op:
			return new a();
		case Cp:
			return bp(e);
	}
}
var Mp = Lp,
	Bp = Qt,
	Dp = Wa,
	zp = '[object Map]';
function Vp(e) {
	return Dp(e) && Bp(e) == zp;
}
var Hp = Vp,
	qp = Hp,
	Up = Kt,
	ba = Ga,
	ma = ba && ba.isMap,
	Wp = ma ? Up(ma) : qp,
	Gp = Wp,
	Kp = Qt,
	Qp = Wa,
	Xp = '[object Set]';
function Jp(e) {
	return Qp(e) && Kp(e) == Xp;
}
var Yp = Jp,
	Zp = Yp,
	eg = Kt,
	ha = Ga,
	ya = ha && ha.isSet,
	tg = ya ? eg(ya) : Zp,
	rg = tg,
	ag = Ra,
	ng = Mf,
	og = Ko,
	lg = Vf,
	ig = Wf,
	sg = Ho,
	cg = qo,
	ug = Xf,
	dg = ep,
	fg = Go,
	pg = hn,
	gg = Qt,
	vg = np,
	bg = Mp,
	mg = Uo,
	hg = Na,
	yg = Wo,
	_g = Gp,
	xg = rt,
	Pg = rg,
	Og = Ht,
	wg = qt,
	Cg = 1,
	Tg = 2,
	Sg = 4,
	Gn = '[object Arguments]',
	Eg = '[object Array]',
	$g = '[object Boolean]',
	Ig = '[object Date]',
	Rg = '[object Error]',
	Kn = '[object Function]',
	kg = '[object GeneratorFunction]',
	Fg = '[object Map]',
	Ag = '[object Number]',
	Qn = '[object Object]',
	Ng = '[object RegExp]',
	jg = '[object Set]',
	Lg = '[object String]',
	Mg = '[object Symbol]',
	Bg = '[object WeakMap]',
	Dg = '[object ArrayBuffer]',
	zg = '[object DataView]',
	Vg = '[object Float32Array]',
	Hg = '[object Float64Array]',
	qg = '[object Int8Array]',
	Ug = '[object Int16Array]',
	Wg = '[object Int32Array]',
	Gg = '[object Uint8Array]',
	Kg = '[object Uint8ClampedArray]',
	Qg = '[object Uint16Array]',
	Xg = '[object Uint32Array]',
	z = {};
z[Gn] =
	z[Eg] =
	z[Dg] =
	z[zg] =
	z[$g] =
	z[Ig] =
	z[Vg] =
	z[Hg] =
	z[qg] =
	z[Ug] =
	z[Wg] =
	z[Fg] =
	z[Ag] =
	z[Qn] =
	z[Ng] =
	z[jg] =
	z[Lg] =
	z[Mg] =
	z[Gg] =
	z[Kg] =
	z[Qg] =
	z[Xg] =
		!0;
z[Rg] = z[Kn] = z[Bg] = !1;
function Be(e, t, r, a, n, o) {
	var c,
		u = t & Cg,
		d = t & Tg,
		s = t & Sg;
	if ((r && (c = n ? r(e, a, n, o) : r(e)), c !== void 0)) return c;
	if (!xg(e)) return e;
	var f = hg(e);
	if (f) {
		if (((c = vg(e)), !u)) return cg(e, c);
	} else {
		var p = gg(e),
			g = p == Kn || p == kg;
		if (yg(e)) return sg(e, u);
		if (p == Qn || p == Gn || (g && !n)) {
			if (((c = d || g ? {} : mg(e)), !u))
				return d ? dg(e, ig(c, e)) : ug(e, lg(c, e));
		} else {
			if (!z[p]) return n ? e : {};
			c = bg(e, p, u);
		}
	}
	o || (o = new ag());
	var b = o.get(e);
	if (b) return b;
	o.set(e, c),
		Pg(e)
			? e.forEach(function (v) {
					c.add(Be(v, t, r, v, e, o));
			  })
			: _g(e) &&
			  e.forEach(function (v, m) {
					c.set(m, Be(v, t, r, m, e, o));
			  });
	var x = s ? (d ? pg : fg) : d ? wg : Og,
		y = f ? void 0 : x(e);
	return (
		ng(y || e, function (v, m) {
			y && ((m = v), (v = e[m])), og(c, m, Be(v, t, r, m, e, o));
		}),
		c
	);
}
var Jg = Be,
	Yg = Jg,
	Zg = 1,
	ev = 4;
function tv(e) {
	return Yg(e, Zg | ev);
}
var Xn = tv,
	Jn = function (e) {
		var t,
			r = e.filterElement,
			a = e.handleHide,
			n = e.className,
			o = X(e),
			c = K();
		return l.createElement(
			rv,
			{ 'data-source': r.props.source, className: N('filter-field', n) },
			!r.props.alwaysOn &&
				l.createElement(
					ve,
					{
						className: N('hide-filter', Ze.hideButton),
						onClick: a,
						'data-key': r.props.source,
						title: c('ra.action.remove_filter'),
						size: 'small',
					},
					l.createElement(jn, null)
				),
			l.cloneElement(r, {
				resource: o,
				record: av,
				size: (t = r.props.size) !== null && t !== void 0 ? t : 'small',
				helperText: !1,
				defaultValue: void 0,
			}),
			l.createElement('div', { className: Ze.spacer }, ' ')
		);
	};
Jn.propTypes = {
	filterElement: i.node,
	handleHide: i.func,
	resource: i.string,
	className: i.string,
};
var jt = 'RaFilterFormInput',
	Ze = {
		spacer: ''.concat(jt, '-spacer'),
		hideButton: ''.concat(jt, '-hideButton'),
	},
	rv = j('div', {
		name: jt,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = { display: 'flex', alignItems: 'flex-end', pointerEvents: 'auto' }),
			(t['& .'.concat(Ze.spacer)] = { width: r.spacing(2) }),
			(t['& .'.concat(Ze.hideButton)] = { marginBottom: r.spacing(1) }),
			t
		);
	}),
	av = {},
	dt = l.createContext(void 0),
	me =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(me =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				me.apply(this, arguments)
			);
		},
	nv =
		(globalThis && globalThis.__awaiter) ||
		function (e, t, r, a) {
			function n(o) {
				return o instanceof r
					? o
					: new r(function (c) {
							c(o);
					  });
			}
			return new (r || (r = Promise))(function (o, c) {
				function u(f) {
					try {
						s(a.next(f));
					} catch (p) {
						c(p);
					}
				}
				function d(f) {
					try {
						s(a.throw(f));
					} catch (p) {
						c(p);
					}
				}
				function s(f) {
					f.done ? o(f.value) : n(f.value).then(u, d);
				}
				s((a = a.apply(e, t || [])).next());
			});
		},
	ov =
		(globalThis && globalThis.__generator) ||
		function (e, t) {
			var r = {
					label: 0,
					sent: function () {
						if (o[0] & 1) throw o[1];
						return o[1];
					},
					trys: [],
					ops: [],
				},
				a,
				n,
				o,
				c;
			return (
				(c = { next: u(0), throw: u(1), return: u(2) }),
				typeof Symbol == 'function' &&
					(c[Symbol.iterator] = function () {
						return this;
					}),
				c
			);
			function u(s) {
				return function (f) {
					return d([s, f]);
				};
			}
			function d(s) {
				if (a) throw new TypeError('Generator is already executing.');
				for (; r; )
					try {
						if (
							((a = 1),
							n &&
								(o =
									s[0] & 2
										? n.return
										: s[0]
										? n.throw || ((o = n.return) && o.call(n), 0)
										: n.next) &&
								!(o = o.call(n, s[1])).done)
						)
							return o;
						switch (((n = 0), o && (s = [s[0] & 2, o.value]), s[0])) {
							case 0:
							case 1:
								o = s;
								break;
							case 4:
								return r.label++, { value: s[1], done: !1 };
							case 5:
								r.label++, (n = s[1]), (s = [0]);
								continue;
							case 7:
								(s = r.ops.pop()), r.trys.pop();
								continue;
							default:
								if (
									((o = r.trys),
									!(o = o.length > 0 && o[o.length - 1]) &&
										(s[0] === 6 || s[0] === 2))
								) {
									r = 0;
									continue;
								}
								if (s[0] === 3 && (!o || (s[1] > o[0] && s[1] < o[3]))) {
									r.label = s[1];
									break;
								}
								if (s[0] === 6 && r.label < o[1]) {
									(r.label = o[1]), (o = s);
									break;
								}
								if (o && r.label < o[2]) {
									(r.label = o[2]), r.ops.push(s);
									break;
								}
								o[2] && r.ops.pop(), r.trys.pop();
								continue;
						}
						s = t.call(e, r);
					} catch (f) {
						(s = [6, f]), (n = 0);
					} finally {
						a = o = 0;
					}
				if (s[0] & 5) throw s[1];
				return { value: s[0] ? s[1] : void 0, done: !0 };
			}
		},
	cr =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	lv = function (e) {
		var t = e.defaultValues,
			r = e.filters,
			a = cr(e, ['defaultValues', 'filters']),
			n = ee(e),
			o = n.setFilters,
			c = n.displayedFilters,
			u = n.filterValues,
			d = l.useContext(dt) || r,
			s = cv(t || u, d),
			f = Qo({ defaultValues: s });
		return (
			l.useEffect(
				function () {
					var p = fv(f.getValues(), u);
					f.reset(p);
				},
				[u, f]
			),
			l.useEffect(
				function () {
					var p = f.watch(function (g, b) {
						var x = b.name;
						return (
							b.type,
							nv(void 0, void 0, void 0, function () {
								var y, v;
								return ov(this, function (m) {
									switch (m.label) {
										case 0:
											return [4, f.trigger()];
										case 1:
											return (
												(y = m.sent()),
												y &&
													(ye(g, x) === ''
														? ((v = Xn(g)), Xo(v, x), o(v, c))
														: o(g, c)),
												[2]
											);
									}
								});
							})
						);
					});
					return function () {
						return p.unsubscribe();
					};
				},
				[c, f, o]
			),
			l.createElement(
				Jo,
				me({}, f),
				l.createElement(Yn, me({ onSubmit: uv, filters: d }, a))
			)
		);
	},
	Yn = function (e) {
		var t = e.className,
			r = e.filters,
			a = cr(e, ['className', 'filters']),
			n = X(e),
			o = Yo(),
			c = ee(e),
			u = c.displayedFilters,
			d = u === void 0 ? {} : u,
			s = c.hideFilter;
		l.useEffect(
			function () {
				r.forEach(function (g) {
					if (g.props.alwaysOn && g.props.defaultValue)
						throw new Error(
							'Cannot use alwaysOn and defaultValue on a filter input. Please set the filterDefaultValues props on the <List> element instead.'
						);
				});
			},
			[r]
		);
		var f = function () {
				var g = o.getValues();
				return r.filter(function (b) {
					var x = ye(g, b.props.source);
					return (
						b.props.alwaysOn ||
						d[b.props.source] ||
						(x !== '' && typeof x < 'u')
					);
				});
			},
			p = l.useCallback(
				function (g) {
					return s(g.currentTarget.dataset.key);
				},
				[s]
			);
		return l.createElement(
			Zo,
			{ prefix: 'resources.'.concat(n, '.fields') },
			l.createElement(
				dv,
				me({ className: t }, sv(a), { onSubmit: iv }),
				f().map(function (g) {
					return l.createElement(Jn, {
						key: g.props.source,
						filterElement: g,
						handleHide: p,
						resource: n,
						className: et.filterFormInput,
					});
				}),
				l.createElement('div', { className: et.clearFix })
			)
		);
	},
	iv = function (e) {
		return e.preventDefault(), !1;
	};
Yn.propTypes = {
	resource: i.string,
	filters: i.arrayOf(i.node).isRequired,
	displayedFilters: i.object,
	hideFilter: i.func,
	initialValues: i.object,
	className: i.string,
};
var sv = function (e) {
		e.displayedFilters,
			e.filterValues,
			e.hasCreate,
			e.hideFilter,
			e.setFilters,
			e.resource;
		var t = cr(e, [
			'displayedFilters',
			'filterValues',
			'hasCreate',
			'hideFilter',
			'setFilters',
			'resource',
		]);
		return t;
	},
	cv = function (e, t) {
		return me(
			me(
				{},
				t
					.filter(function (r) {
						return r.props.alwaysOn && r.props.defaultValue;
					})
					.reduce(function (r, a) {
						return Ia(me({}, r), a.props.source, a.props.defaultValue);
					}, {})
			),
			e
		);
	},
	uv = function () {},
	Lt = 'RaFilterForm',
	et = {
		clearFix: ''.concat(Lt, '-clearFix'),
		filterFormInput: ''.concat(Lt, '-filterFormInput'),
	},
	dv = j('form', {
		name: Lt,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = { display: 'flex', flex: '0 1 auto' }),
			(t[r.breakpoints.up('md')] = { flex: '0 1 100%' }),
			(t.flexWrap = 'wrap'),
			(t.alignItems = 'flex-end'),
			(t.pointerEvents = 'none'),
			(t.padding = '0 0 '.concat(r.spacing(0.5), ' 0')),
			(t['& .MuiFormHelperText-root'] = { display: 'none' }),
			(t['& .'.concat(et.clearFix)] = { clear: 'right' }),
			(t['& .'.concat(et.filterFormInput, ' .MuiFormControl-root')] = {
				marginTop: ''.concat(r.spacing(1)),
			}),
			t
		);
	}),
	fv = function (e, t) {
		var r;
		return Object.keys(e).reduce(
			function (a, n) {
				return (a[n] = Zn(e, n, t)), a;
			},
			(r = Xn(t)) !== null && r !== void 0 ? r : {}
		);
	},
	Zn = function (e, t, r) {
		if (e[t] === void 0 || e[t] === null) return '';
		if (Array.isArray(e[t])) return ye(r, t, '');
		if (e[t] instanceof Date) return ye(r, t, '');
		if (typeof e[t] == 'object') {
			var a = Object.keys(e[t]).reduce(function (n, o) {
				var c,
					u = Zn(e[t], o, (c = (r || {})[t]) !== null && c !== void 0 ? c : {});
				return u === '' || (n[o] = u), n;
			}, {});
			return Object.keys(a).length ? a : '';
		}
		return ye(r, t, '');
	},
	ur = {},
	pv = Se;
Object.defineProperty(ur, '__esModule', { value: !0 });
var eo = (ur.default = void 0),
	gv = pv(Te()),
	vv = Ee,
	bv = (0, gv.default)(
		(0, vv.jsx)('path', {
			d: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
		}),
		'FilterList'
	);
eo = ur.default = bv;
var to = l.forwardRef(function (e, t) {
	var r = e.filter,
		a = e.onShow,
		n = e.autoFocus,
		o = X(e),
		c = l.useCallback(
			function () {
				a({ source: r.props.source, defaultValue: r.props.defaultValue });
			},
			[r.props.defaultValue, r.props.source, a]
		);
	return l.createElement(
		Pe,
		{
			className: 'new-filter-item',
			'data-key': r.props.source,
			'data-default-value': r.props.defaultValue,
			key: r.props.source,
			onClick: c,
			autoFocus: n,
			ref: t,
			disabled: r.props.disabled,
		},
		l.createElement(Ot, {
			label: r.props.label,
			source: r.props.source,
			resource: o,
		})
	);
});
to.propTypes = {
	filter: i.element.isRequired,
	onShow: i.func.isRequired,
	resource: i.string,
	autoFocus: i.bool,
};
var dr = function (e) {
		return at(''.concat(e, '.savedQueries'), []);
	},
	fr = function (e) {
		return Array.isArray(e)
			? e.filter(function (t) {
					return mv(t);
			  })
			: [];
	},
	mv = function (e) {
		var t, r;
		return !!(
			e.label &&
			typeof e.label == 'string' &&
			e.value &&
			typeof Array.isArray(e.value.displayedFilters) &&
			typeof e.value.perPage == 'number' &&
			typeof ((t = e.value.sort) === null || t === void 0 ? void 0 : t.field) ==
				'string' &&
			typeof ((r = e.value.sort) === null || r === void 0 ? void 0 : r.order) ==
				'string' &&
			typeof e.value.filter == 'object'
		);
	},
	hv = function (e) {
		var t = e.open,
			r = e.onClose,
			a = K(),
			n = ee(),
			o = n.resource,
			c = n.filterValues,
			u = n.displayedFilters,
			d = n.sort,
			s = n.perPage,
			f = dr(o),
			p = f[0],
			g = f[1],
			b = l.useState(''),
			x = b[0],
			y = b[1],
			v = function (w) {
				y(w.target.value);
			},
			m = function (w) {
				w.preventDefault(), P();
			},
			P = function () {
				var w = {
						label: x,
						value: { filter: c, sort: d, perPage: s, displayedFilters: u },
					},
					C = fr(p);
				g(C.concat(w)), y(''), r();
			};
		return l.createElement(
			Ya,
			{ open: t, onClose: r, 'aria-labelledby': 'form-dialog-title' },
			l.createElement(
				Za,
				{ id: 'form-dialog-title' },
				a('ra.saved_queries.new_dialog_title', { _: 'Save current query as' })
			),
			l.createElement(
				en,
				null,
				l.createElement(
					'form',
					{ onSubmit: m },
					l.createElement(el, {
						autoFocus: !0,
						margin: 'dense',
						id: 'name',
						label: a('ra.saved_queries.query_name', { _: 'Query name' }),
						fullWidth: !0,
						value: x,
						onChange: v,
					})
				)
			),
			l.createElement(
				tn,
				null,
				l.createElement(Ve, { onClick: r }, a('ra.action.cancel')),
				l.createElement(
					Ve,
					{ onClick: P, color: 'primary' },
					a('ra.action.save')
				)
			)
		);
	},
	_a =
		(globalThis && globalThis.__spreadArray) ||
		function (e, t, r) {
			if (r || arguments.length === 2)
				for (var a = 0, n = t.length, o; a < n; a++)
					(o || !(a in t)) &&
						(o || (o = Array.prototype.slice.call(t, 0, a)), (o[a] = t[a]));
			return e.concat(o || Array.prototype.slice.call(t));
		},
	yv = function (e) {
		var t = e.open,
			r = e.onClose,
			a = K(),
			n = ee(),
			o = n.resource,
			c = n.filterValues,
			u = n.sort,
			d = n.perPage,
			s = n.displayedFilters,
			f = dr(o),
			p = f[0],
			g = f[1],
			b = function () {
				var x = { filter: c, sort: u, perPage: d, displayedFilters: s },
					y = fr(p),
					v = y.findIndex(function (m) {
						return Me(m.value, x);
					});
				g(_a(_a([], y.slice(0, v), !0), y.slice(v + 1), !0)), r();
			};
		return l.createElement(
			Ya,
			{
				open: t,
				onClose: r,
				'aria-labelledby': 'alert-dialog-title',
				'aria-describedby': 'alert-dialog-description',
			},
			l.createElement(
				Za,
				{ id: 'alert-dialog-title' },
				a('ra.saved_queries.remove_dialog_title', { _: 'Remove saved query?' })
			),
			l.createElement(
				en,
				null,
				l.createElement(
					dl,
					null,
					a('ra.saved_queries.remove_message', {
						_: 'Are you sure you want to remove that item from your list of saved queries?',
					})
				)
			),
			l.createElement(
				tn,
				null,
				l.createElement(Ve, { onClick: r }, a('ra.action.cancel')),
				l.createElement(
					Ve,
					{ onClick: b, color: 'primary', autoFocus: !0 },
					a('ra.action.confirm')
				)
			)
		);
	},
	Mt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Mt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Mt.apply(this, arguments)
			);
		},
	ro =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	ao = function (e) {
		var t = e.filters,
			r = e.className,
			a = e.disableSaveQuery,
			n = ro(e, ['filters', 'className', 'disableSaveQuery']),
			o = l.useContext(dt) || t,
			c = X(e),
			u = K(),
			d = dr(c)[0],
			s = Ut(),
			f = ee(e),
			p = f.displayedFilters,
			g = p === void 0 ? {} : p,
			b = f.filterValues,
			x = f.perPage,
			y = f.setFilters,
			v = f.showFilter,
			m = f.sort,
			P = !Me(b, {}),
			w = fr(d),
			C = w.some(function (V) {
				return Me(V.value, {
					filter: b,
					sort: m,
					perPage: x,
					displayedFilters: g,
				});
			}),
			h = l.useState(!1),
			_ = h[0],
			O = h[1],
			T = l.useRef();
		if (o === void 0)
			throw new Error('FilterButton requires filters prop to be set');
		var S = o.filter(function (V) {
				return (
					!V.props.alwaysOn &&
					!g[V.props.source] &&
					typeof ye(b, V.props.source) > 'u'
				);
			}),
			E = l.useCallback(
				function (V) {
					V.preventDefault(), O(!0), (T.current = V.currentTarget);
				},
				[T, O]
			),
			F = l.useCallback(
				function () {
					O(!1);
				},
				[O]
			),
			A = l.useCallback(
				function (V) {
					var ue = V.source,
						xe = V.defaultValue;
					v(ue, xe === '' ? void 0 : xe), O(!1);
				},
				[v, O]
			),
			L = l.useState(!1),
			M = L[0],
			G = L[1],
			B = function () {
				G(!1);
			},
			k = function () {
				O(!1), G(!0);
			},
			te = l.useState(!1),
			ne = te[0],
			D = te[1],
			re = function () {
				D(!1);
			},
			U = function () {
				O(!1), D(!0);
			};
		return S.length === 0 && w.length === 0 && !P
			? null
			: l.createElement(
					Pv,
					Mt({ className: r }, _v(n)),
					l.createElement(
						Ne,
						{
							className: 'add-filter',
							label: 'ra.action.add_filter',
							'aria-haspopup': 'true',
							onClick: E,
						},
						l.createElement(eo, null)
					),
					l.createElement(
						tl,
						{ open: _, anchorEl: T.current, onClose: F },
						S.map(function (V, ue) {
							return l.createElement(to, {
								key: V.props.source,
								filter: V,
								resource: c,
								onShow: A,
								autoFocus: ue === 0,
							});
						}),
						w.map(function (V, ue) {
							return Me(V.value, {
								filter: b,
								sort: m,
								perPage: x,
								displayedFilters: g,
							})
								? l.createElement(
										Pe,
										{ onClick: U, key: ue },
										u('ra.saved_queries.remove_label_with_name', {
											_: 'Remove query "%{name}"',
											name: V.label,
										})
								  )
								: l.createElement(
										Pe,
										{
											onClick: function () {
												s({
													search: Zt.stringify({
														filter: JSON.stringify(V.value.filter),
														sort: V.value.sort.field,
														order: V.value.sort.order,
														page: 1,
														perPage: V.value.perPage,
														displayedFilters: JSON.stringify(
															V.value.displayedFilters
														),
													}),
												}),
													O(!1);
											},
											key: ue,
										},
										V.label
								  );
						}),
						P &&
							!C &&
							!a &&
							l.createElement(
								Pe,
								{ onClick: k },
								u('ra.saved_queries.new_label', { _: 'Save current query...' })
							),
						P &&
							l.createElement(
								Pe,
								{
									onClick: function () {
										return y({}, {}, !1);
									},
								},
								u('ra.action.remove_all_filters', { _: 'Remove all filters' })
							)
					),
					!a &&
						l.createElement(
							l.Fragment,
							null,
							l.createElement(hv, { open: M, onClose: B }),
							l.createElement(yv, { open: ne, onClose: re })
						)
			  );
	},
	_v = function (e) {
		e.displayedFilters, e.filterValues, e.showFilter;
		var t = ro(e, ['displayedFilters', 'filterValues', 'showFilter']);
		return t;
	};
ao.propTypes = {
	resource: i.string,
	filters: i.arrayOf(i.node),
	displayedFilters: i.object,
	filterValues: i.object,
	showFilter: i.func,
	className: i.string,
};
var xv = 'RaFilterButton',
	Pv = j('div', {
		name: xv,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		return e.theme, { display: 'inline-block' };
	}),
	Bt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Bt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Bt.apply(this, arguments)
			);
		},
	no =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	oo = l.memo(function (e) {
		var t = e.page,
			r = e.rowsPerPage,
			a = e.count,
			n = e.onPageChange,
			o = e.size,
			c = o === void 0 ? 'small' : o,
			u = e.className,
			d = no(e, [
				'page',
				'rowsPerPage',
				'count',
				'onPageChange',
				'size',
				'className',
			]),
			s = K(),
			f = Math.ceil(a / r) || 1;
		if (f === 1) return l.createElement(xa, { className: u });
		var p = function (g, b, x) {
			return g === 'page'
				? x
					? s('ra.navigation.current_page', { page: b, _: 'page '.concat(b) })
					: s('ra.navigation.page', { page: b, _: 'Go to page '.concat(b) })
				: s('ra.navigation.'.concat(g), { _: 'Go to '.concat(g, ' page') });
		};
		return l.createElement(
			xa,
			{ className: u },
			l.createElement(
				uu,
				Bt(
					{
						size: c,
						count: f,
						page: t + 1,
						onChange: function (g, b) {
							return n(g, b - 1);
						},
					},
					wv(d),
					{ getItemAriaLabel: p }
				)
			)
		);
	});
oo.propTypes = {
	count: i.number.isRequired,
	onPageChange: i.func.isRequired,
	page: i.number.isRequired,
	rowsPerPage: i.number.isRequired,
	color: i.oneOf(['primary', 'secondary', 'standard']),
	size: i.oneOf(['small', 'medium', 'large']),
};
var Ov = 'RaPaginationActions',
	xa = j('div', {
		name: Ov,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		return e.theme, { flexShrink: 0, ml: 4 };
	}),
	wv = function (e) {
		e.nextIconButtonProps, e.backIconButtonProps;
		var t = no(e, ['nextIconButtonProps', 'backIconButtonProps']);
		return t;
	},
	tt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(tt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				tt.apply(this, arguments)
			);
		},
	Cv =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	lo = l.memo(function (e) {
		var t = e.rowsPerPageOptions,
			r = t === void 0 ? Tv : t,
			a = e.actions,
			n = e.limit,
			o = n === void 0 ? null : n,
			c = Cv(e, ['rowsPerPageOptions', 'actions', 'limit']),
			u = Pc(e),
			d = u.isLoading,
			s = u.hasNextPage,
			f = u.page,
			p = u.perPage,
			g = u.total,
			b = u.setPage,
			x = u.setPerPage,
			y = K(),
			v = Ha(function (O) {
				return O.breakpoints.down('md');
			}),
			m = l.useMemo(
				function () {
					return g != null ? Math.ceil(g / p) : void 0;
				},
				[p, g]
			),
			P = l.useCallback(
				function (O, T) {
					if ((O && O.stopPropagation(), T < 0 || T > m - 1))
						throw new Error(
							y('ra.navigation.page_out_of_boundaries', { page: T + 1 })
						);
					b(T + 1);
				},
				[m, b, y]
			),
			w = l.useCallback(
				function (O) {
					x(O.target.value);
				},
				[x]
			),
			C = l.useCallback(
				function (O) {
					var T = O.from,
						S = O.to,
						E = O.count;
					return E === -1 && s
						? y('ra.navigation.partial_page_range_info', {
								offsetBegin: T,
								offsetEnd: S,
								_: '%{from}-%{to} of more than %{to}',
						  })
						: y('ra.navigation.page_range_info', {
								offsetBegin: T,
								offsetEnd: S,
								total: E === -1 ? S : E,
								_: '%{from}-%{to} of %{count === -1 ? to : count}',
						  });
				},
				[y, s]
			),
			h = l.useCallback(
				function (O) {
					return y('ra.navigation.'.concat(O), {
						_: 'Go to '.concat(O, ' page'),
					});
				},
				[y]
			);
		if (d) return l.createElement(lt, { variant: 'dense' });
		if (g === 0 || f < 1 || (g != null && f > m)) return o != null, null;
		if (v)
			return l.createElement(
				na,
				tt(
					{
						count: g ?? -1,
						rowsPerPage: p,
						page: f - 1,
						onPageChange: P,
						rowsPerPageOptions: Sv,
						component: 'span',
						labelDisplayedRows: C,
					},
					ke(c)
				)
			);
		var _ = a || (!d && g != null ? oo : void 0);
		return l.createElement(
			na,
			tt(
				{
					count: g ?? -1,
					rowsPerPage: p,
					page: f - 1,
					onPageChange: P,
					onRowsPerPageChange: w,
					ActionsComponent: _,
					nextIconButtonProps: { disabled: !s },
					component: 'span',
					labelRowsPerPage: y('ra.navigation.page_rows_per_page'),
					labelDisplayedRows: C,
					getItemAriaLabel: h,
					rowsPerPageOptions: r,
				},
				ke(c)
			)
		);
	});
lo.propTypes = {
	actions: Ka,
	limit: i.element,
	rowsPerPageOptions: i.arrayOf(i.number),
};
var Tv = [5, 10, 25, 50],
	Sv = [],
	pr = {},
	Ev = Se;
Object.defineProperty(pr, '__esModule', { value: !0 });
var io = (pr.default = void 0),
	$v = Ev(Te()),
	Iv = Ee,
	Rv = (0, $v.default)(
		(0, Iv.jsx)('path', {
			d: 'M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z',
		}),
		'Inbox'
	);
io = pr.default = Rv;
var kv = function (e) {
		var t = e.className,
			r = Xa(e).hasCreate,
			a = X(e),
			n = K(),
			o = Ma(),
			c = n('resources.'.concat(a, '.forcedCaseName'), {
				smart_count: 0,
				_: o(a, 0),
			}),
			u = n('ra.page.empty', { name: c }),
			d = n('ra.page.invite');
		return l.createElement(
			Fv,
			{ className: t },
			l.createElement(
				'div',
				{ className: Ce.message },
				l.createElement(io, { className: Ce.icon }),
				l.createElement(
					ze,
					{ variant: 'h4', paragraph: !0 },
					n('resources.'.concat(a, '.empty'), { _: u })
				),
				r &&
					l.createElement(
						ze,
						{ variant: 'body1' },
						n('resources.'.concat(a, '.invite'), { _: d })
					)
			),
			r &&
				l.createElement(
					'div',
					{ className: Ce.toolbar },
					l.createElement($n, { variant: 'contained' })
				)
		);
	},
	De = 'RaEmpty',
	Ce = {
		message: ''.concat(De, '-message'),
		icon: ''.concat(De, '-icon'),
		toolbar: ''.concat(De, '-toolbar'),
	},
	Fv = j('span', {
		name: De,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = { flex: 1 }),
			(t['& .'.concat(Ce.message)] = {
				textAlign: 'center',
				opacity: r.palette.mode === 'light' ? 0.5 : 0.8,
				margin: '0 1em',
				color: r.palette.mode === 'light' ? 'inherit' : r.palette.text.primary,
			}),
			(t['& .'.concat(Ce.icon)] = { width: '9em', height: '9em' }),
			(t['& .'.concat(Ce.toolbar)] = { textAlign: 'center', marginTop: '2em' }),
			t
		);
	}),
	ge =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(ge =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				ge.apply(this, arguments)
			);
		},
	Av =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	so = l.memo(function (e) {
		var t = e.filters,
			r = e.actions,
			a = e.className,
			n = Av(e, ['filters', 'actions', 'className']);
		return Array.isArray(t)
			? l.createElement(
					dt.Provider,
					{ value: t },
					l.createElement(
						Pa,
						{ className: a },
						l.createElement(lv, null),
						l.createElement('span', null),
						r && l.cloneElement(r, ge(ge({}, n), r.props))
					)
			  )
			: l.createElement(
					Pa,
					{ className: a },
					t && l.cloneElement(t, ge(ge({}, n), { context: 'form' })),
					l.createElement('span', null),
					r && l.cloneElement(r, ge(ge(ge({}, n), { filters: t }), r.props))
			  );
	});
so.propTypes = {
	filters: i.oneOfType([i.element, i.arrayOf(i.element)]),
	actions: i.oneOfType([i.bool, i.element]),
	exporter: i.oneOfType([i.func, i.bool]),
};
var Nv = 'RaListToolbar',
	Pa = j(lt, {
		name: Nv,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r = e.theme;
		return (
			(t = {
				position: 'relative',
				justifyContent: 'space-between',
				alignItems: 'flex-end',
				width: '100%',
				padding: '0 !important',
				minHeight: r.spacing(8),
			}),
			(t[r.breakpoints.down('sm')] = {
				backgroundColor: r.palette.background.paper,
			}),
			(t[r.breakpoints.down('md')] = { margin: 0, flexWrap: 'wrap' }),
			t
		);
	}),
	Dt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Dt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Dt.apply(this, arguments)
			);
		},
	jv =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	gr = function (e) {
		var t = e.className,
			r = e.filters;
		e.hasCreate;
		var a = jv(e, ['className', 'filters', 'hasCreate']),
			n = ee(e),
			o = n.sort,
			c = n.displayedFilters,
			u = n.filterValues,
			d = n.exporter,
			s = n.showFilter,
			f = n.total,
			p = X(e),
			g = Xa(e).hasCreate,
			b = l.useContext(dt) || r;
		return l.useMemo(
			function () {
				return l.createElement(
					rn,
					Dt({ className: t }, ke(a)),
					r
						? l.cloneElement(r, {
								resource: p,
								showFilter: s,
								displayedFilters: c,
								filterValues: u,
								context: 'button',
						  })
						: b && l.createElement(ao, null),
					g && l.createElement($n, null),
					d !== !1 &&
						l.createElement(Nn, {
							disabled: f === 0,
							resource: p,
							sort: o,
							filterValues: u,
						})
				);
			},
			[p, c, u, r, s, b, f, t, o, d, g]
		);
	};
gr.propTypes = {
	className: i.string,
	sort: i.any,
	displayedFilters: i.object,
	exporter: i.oneOfType([i.func, i.bool]),
	filters: i.element,
	filterValues: i.object,
	hasCreate: i.bool,
	resource: i.string,
	onUnselectItems: i.func.isRequired,
	selectedIds: i.arrayOf(i.any),
	showFilter: i.func,
	total: i.number,
};
gr.defaultProps = {
	selectedIds: [],
	onUnselectItems: function () {
		return null;
	},
};
var zt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(zt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				zt.apply(this, arguments)
			);
		},
	Lv =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	Mv = l.createElement(gr, null),
	Bv = l.createElement(lo, null),
	Dv = l.createElement(kv, null),
	zv = nl,
	co = function (e) {
		var t = e.actions,
			r = t === void 0 ? Mv : t,
			a = e.aside,
			n = e.filters,
			o = e.bulkActionButtons,
			c = e.emptyWhileLoading,
			u = e.hasCreate,
			d = e.pagination,
			s = d === void 0 ? Bv : d,
			f = e.children,
			p = e.className,
			g = e.component,
			b = g === void 0 ? zv : g,
			x = e.title,
			y = e.empty,
			v = y === void 0 ? Dv : y,
			m = Lv(e, [
				'actions',
				'aside',
				'filters',
				'bulkActionButtons',
				'emptyWhileLoading',
				'hasCreate',
				'pagination',
				'children',
				'className',
				'component',
				'title',
				'empty',
			]),
			P = ee(e),
			w = P.defaultTitle,
			C = P.data,
			h = P.error,
			_ = P.total,
			O = P.isLoading,
			T = P.filterValues,
			S = P.resource;
		if (!f || (!C && O && c)) return null;
		var E = function () {
				return l.createElement(
					'div',
					{ className: we.main },
					(n || r) &&
						l.createElement(so, { filters: n, actions: r, hasCreate: u }),
					l.createElement(
						b,
						{ className: we.content },
						o && f && l.isValidElement(f)
							? l.cloneElement(f, { bulkActionButtons: o })
							: f
					),
					h
						? l.createElement(al, { error: h, resetErrorBoundary: null })
						: s !== !1 && s
				);
			},
			F = function () {
				return v !== !1 && l.cloneElement(v, { hasCreate: u });
			},
			A = !O && _ === 0 && !Object.keys(T).length && v !== !1;
		return l.createElement(
			Vv,
			zt({ className: N('list-page', p) }, m),
			l.createElement(rl, {
				title: x,
				defaultTitle: w,
				preferenceKey: ''.concat(S, '.list.title'),
			}),
			A ? F() : E(),
			a
		);
	};
co.propTypes = {
	actions: i.oneOfType([i.bool, i.element]),
	aside: i.element,
	children: i.node,
	className: i.string,
	component: Ka,
	sort: i.shape({ field: i.string.isRequired, order: i.string.isRequired }),
	data: i.any,
	defaultTitle: i.string,
	displayedFilters: i.object,
	emptyWhileLoading: i.bool,
	exporter: i.oneOfType([i.func, i.bool]),
	filterDefaultValues: i.object,
	filters: i.oneOfType([i.element, i.arrayOf(i.element)]),
	filterValues: i.object,
	hasCreate: i.bool,
	hideFilter: i.func,
	ids: i.array,
	loading: i.bool,
	onSelect: i.func,
	onToggleItem: i.func,
	onUnselectItems: i.func,
	page: i.number,
	pagination: i.oneOfType([i.element, i.bool]),
	perPage: i.number,
	refresh: i.func,
	resource: i.string,
	selectedIds: i.array,
	setFilters: i.func,
	setPage: i.func,
	setPerPage: i.func,
	setSort: i.func,
	showFilter: i.func,
	title: Qa,
	total: i.number,
};
var $e = 'RaList',
	we = {
		main: ''.concat($e, '-main'),
		content: ''.concat($e, '-content'),
		actions: ''.concat($e, '-actions'),
		noResults: ''.concat($e, '-noResults'),
	},
	Vv = j('div', {
		name: $e,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			r,
			a = e.theme;
		return (
			(t = { display: 'flex' }),
			(t['& .'.concat(we.main)] = {
				flex: '1 1 auto',
				display: 'flex',
				flexDirection: 'column',
			}),
			(t['& .'.concat(we.content)] =
				((r = { position: 'relative' }),
				(r[a.breakpoints.down('sm')] = { boxShadow: 'none' }),
				(r.overflow = 'inherit'),
				r)),
			(t['& .'.concat(we.actions)] = {
				zIndex: 2,
				display: 'flex',
				justifyContent: 'flex-end',
				flexWrap: 'wrap',
			}),
			(t['& .'.concat(we.noResults)] = { padding: 20 }),
			t
		);
	}),
	Vt =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Vt =
					Object.assign ||
					function (e) {
						for (var t, r = 1, a = arguments.length; r < a; r++) {
							t = arguments[r];
							for (var n in t)
								Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
						}
						return e;
					}),
				Vt.apply(this, arguments)
			);
		},
	Hv =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var r = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(r[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, a = Object.getOwnPropertySymbols(e); n < a.length; n++)
					t.indexOf(a[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[n]) &&
						(r[a[n]] = e[a[n]]);
			return r;
		},
	uo = function (e) {
		var t = e.debounce,
			r = e.disableAuthentication,
			a = e.disableSyncWithLocation,
			n = e.exporter,
			o = e.filter,
			c = e.filterDefaultValues,
			u = e.perPage,
			d = e.queryOptions,
			s = e.resource,
			f = e.sort,
			p = e.storeKey,
			g = Hv(e, [
				'debounce',
				'disableAuthentication',
				'disableSyncWithLocation',
				'exporter',
				'filter',
				'filterDefaultValues',
				'perPage',
				'queryOptions',
				'resource',
				'sort',
				'storeKey',
			]);
		return l.createElement(
			_c,
			{
				debounce: t,
				disableAuthentication: r,
				disableSyncWithLocation: a,
				exporter: n,
				filter: o,
				filterDefaultValues: c,
				perPage: u,
				queryOptions: d,
				resource: s,
				sort: f,
				storeKey: p,
			},
			l.createElement(co, Vt({}, g))
		);
	};
uo.propTypes = {
	actions: i.oneOfType([i.bool, i.element]),
	aside: i.element,
	children: i.node.isRequired,
	className: i.string,
	emptyWhileLoading: i.bool,
	filter: i.object,
	filterDefaultValues: i.object,
	filters: i.oneOfType([i.element, i.arrayOf(i.element)]),
	pagination: i.oneOfType([i.element, i.bool]),
	perPage: i.number.isRequired,
	sort: i.shape({ field: i.string, order: i.string }),
	sx: i.any,
	title: Qa,
	disableSyncWithLocation: i.bool,
	hasCreate: i.bool,
	hasEdit: i.bool,
	hasList: i.bool,
	hasShow: i.bool,
	resource: i.string,
};
uo.defaultProps = { filter: {}, perPage: 10 };
export { kn as B, $n as C, Wn as D, uo as L, Kl as u };
