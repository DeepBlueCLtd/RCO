import {
	bS as z,
	bT as G,
	bU as V,
	bV as X,
	bW as w,
	bX as y,
	d as g,
	a_ as _,
	r as h,
	bY as m,
	bZ as P,
	aE as T,
	b$ as p,
	c0 as A,
	aY as R,
	a as E,
	c1 as k,
} from './index-091859a0.js';
var x =
		(globalThis && globalThis.__awaiter) ||
		function (a, c, r, i) {
			function o(e) {
				return e instanceof r
					? e
					: new r(function (s) {
							s(e);
					  });
			}
			return new (r || (r = Promise))(function (e, s) {
				function n(d) {
					try {
						t(i.next(d));
					} catch (f) {
						s(f);
					}
				}
				function u(d) {
					try {
						t(i.throw(d));
					} catch (f) {
						s(f);
					}
				}
				function t(d) {
					d.done ? e(d.value) : o(d.value).then(n, u);
				}
				t((i = i.apply(a, c || [])).next());
			});
		},
	D =
		(globalThis && globalThis.__generator) ||
		function (a, c) {
			var r = {
					label: 0,
					sent: function () {
						if (e[0] & 1) throw e[1];
						return e[1];
					},
					trys: [],
					ops: [],
				},
				i,
				o,
				e,
				s;
			return (
				(s = { next: n(0), throw: n(1), return: n(2) }),
				typeof Symbol == 'function' &&
					(s[Symbol.iterator] = function () {
						return this;
					}),
				s
			);
			function n(t) {
				return function (d) {
					return u([t, d]);
				};
			}
			function u(t) {
				if (i) throw new TypeError('Generator is already executing.');
				for (; r; )
					try {
						if (
							((i = 1),
							o &&
								(e =
									t[0] & 2
										? o.return
										: t[0]
										? o.throw || ((e = o.return) && e.call(o), 0)
										: o.next) &&
								!(e = e.call(o, t[1])).done)
						)
							return e;
						switch (((o = 0), e && (t = [t[0] & 2, e.value]), t[0])) {
							case 0:
							case 1:
								e = t;
								break;
							case 4:
								return r.label++, { value: t[1], done: !1 };
							case 5:
								r.label++, (o = t[1]), (t = [0]);
								continue;
							case 7:
								(t = r.ops.pop()), r.trys.pop();
								continue;
							default:
								if (
									((e = r.trys),
									!(e = e.length > 0 && e[e.length - 1]) &&
										(t[0] === 6 || t[0] === 2))
								) {
									r = 0;
									continue;
								}
								if (t[0] === 3 && (!e || (t[1] > e[0] && t[1] < e[3]))) {
									r.label = t[1];
									break;
								}
								if (t[0] === 6 && r.label < e[1]) {
									(r.label = e[1]), (e = t);
									break;
								}
								if (e && r.label < e[2]) {
									(r.label = e[2]), r.ops.push(t);
									break;
								}
								e[2] && r.ops.pop(), r.trys.pop();
								continue;
						}
						t = c.call(a, r);
					} catch (d) {
						(t = [6, d]), (o = 0);
					} finally {
						i = e = 0;
					}
				if (t[0] & 5) throw t[1];
				return { value: t[0] ? t[1] : void 0, done: !0 };
			}
		},
	l,
	I = function () {
		var a = w(),
			c = y(),
			r = g(),
			i = _(),
			o = h.useCallback(
				function (e, s) {
					return a
						.checkError(e)
						.then(function () {
							return !1;
						})
						.catch(function (n) {
							return x(void 0, void 0, void 0, function () {
								var u, t, d, f;
								return D(this, function (Y) {
									return (
										(u =
											(f = n == null ? void 0 : n.logoutUser) !== null &&
											f !== void 0
												? f
												: !0),
										l
											? [2, !0]
											: ((l = setTimeout(function () {
													l = void 0;
											  }, 0)),
											  (t =
													n && n.redirectTo != null
														? n.redirectTo
														: e && e.redirectTo
														? e.redirectTo
														: void 0),
											  (d = !(
													s ||
													(n && n.message === !1) ||
													(e && e.message === !1) ||
													(t != null && t.startsWith('http'))
											  )),
											  d &&
													a
														.checkAuth({})
														.then(function () {
															u
																? r(v(n, 'ra.notification.logged_out'), {
																		type: 'error',
																  })
																: r(v(n, 'ra.notification.not_authorized'), {
																		type: 'error',
																  });
														})
														.catch(function () {}),
											  u
													? c({}, t)
													: t.startsWith('http')
													? (window.location.href = t)
													: i(t),
											  [2, !0])
									);
								});
							});
						});
				},
				[a, c, r, i]
			);
		return a ? o : O;
	},
	O = function () {
		return Promise.resolve(!1);
	},
	v = function (a, c) {
		return typeof a == 'string'
			? a
			: typeof a > 'u' || !a.message
			? c
			: a.message;
	};
const C = I;
var W = ['getList', 'getMany', 'getManyReference'],
	B = function () {
		var a = h.useContext(m) || P,
			c = C(),
			r = h.useMemo(
				function () {
					return new Proxy(a, {
						get: function (i, o) {
							if (!(typeof o == 'symbol' || o === 'then'))
								return function () {
									for (var e = [], s = 0; s < arguments.length; s++)
										e[s] = arguments[s];
									var n = o.toString();
									if (typeof a[n] != 'function')
										throw new Error(
											'Unknown dataProvider function: '.concat(n)
										);
									try {
										return a[n]
											.apply(a, e)
											.then(function (u) {
												return u;
											})
											.catch(function (u) {
												return c(u).then(function (t) {
													if (t) return { data: W.includes(n) ? [] : {} };
													throw u;
												});
											});
									} catch {
										throw new Error(
											'The dataProvider threw an error. It should return a rejected Promise instead.'
										);
									}
								};
						},
					});
				},
				[a, c]
			);
		return r;
	},
	L = T,
	S = p,
	M = A,
	U = R,
	b = Object.prototype,
	F = b.hasOwnProperty,
	N = L(function (a, c) {
		a = Object(a);
		var r = -1,
			i = c.length,
			o = i > 2 ? c[2] : void 0;
		for (o && M(c[0], c[1], o) && (i = 1); ++r < i; )
			for (var e = c[r], s = U(e), n = -1, u = s.length; ++n < u; ) {
				var t = s[n],
					d = a[t];
				(d === void 0 || (S(d, b[t]) && !F.call(a, t))) && (a[t] = e[t]);
			}
		return a;
	}),
	q = N,
	H = function (a) {
		var c = E(a),
			r = k(),
			i = a || {},
			o = i.hasCreate,
			e = i.hasEdit,
			s = i.hasList,
			n = i.hasShow,
			u = i.recordRepresentation,
			t = h.useMemo(
				function () {
					return q(
						{},
						{
							hasCreate: o,
							hasEdit: e,
							hasList: s,
							hasShow: n,
							recordRepresentation: u,
						},
						r[c]
					);
				},
				[c, r, o, e, s, n, u]
			);
		return t;
	};
export { B as a, q as d, H as u };
