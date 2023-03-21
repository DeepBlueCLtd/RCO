import {
	u as Pe,
	a as ge,
	c as Re,
	d as Ae,
	e as De,
	l as Le,
	m as qe,
	f as ke,
	r as g,
	R as Ie,
	g as $e,
	h as Fe,
	i as Ne,
	n as Qe,
	o as Ue,
	q as Be,
	t as ze,
	p as u,
	v as Ge,
	w as We,
	B as Ke,
	L as Ve,
	j as de,
	T as Xe,
	x as He,
	y as Je,
	s as Ye,
	C as Ze,
	k as fe,
} from './index-091859a0.js';
import {
	u as et,
	S as tt,
	a as rt,
	b as nt,
	U as ot,
} from './UserFrom-7e59585c.js';
import { T as at } from './TopToolbar-a353fcbf.js';
import { d as it, a as ut, u as ye } from './useResourceDefinition-e2399b95.js';
import { u as st } from './useGetRecordRepresentation-8eb64aa5.js';
import { u as ct } from './useGetOne-98a655b9.js';
import { u as lt } from './Confirm-edcfa802.js';
import './DeleteButton-194d027b.js';
var N =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(N =
					Object.assign ||
					function (e) {
						for (var o, n = 1, t = arguments.length; n < t; n++) {
							o = arguments[n];
							for (var r in o)
								Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
						}
						return e;
					}),
				N.apply(this, arguments)
			);
		},
	dt =
		(globalThis && globalThis.__awaiter) ||
		function (e, o, n, t) {
			function r(a) {
				return a instanceof n
					? a
					: new n(function (d) {
							d(a);
					  });
			}
			return new (n || (n = Promise))(function (a, d) {
				function m(s) {
					try {
						i(t.next(s));
					} catch (h) {
						d(h);
					}
				}
				function b(s) {
					try {
						i(t.throw(s));
					} catch (h) {
						d(h);
					}
				}
				function i(s) {
					s.done ? a(s.value) : r(s.value).then(m, b);
				}
				i((t = t.apply(e, o || [])).next());
			});
		},
	ft =
		(globalThis && globalThis.__generator) ||
		function (e, o) {
			var n = {
					label: 0,
					sent: function () {
						if (a[0] & 1) throw a[1];
						return a[1];
					},
					trys: [],
					ops: [],
				},
				t,
				r,
				a,
				d;
			return (
				(d = { next: m(0), throw: m(1), return: m(2) }),
				typeof Symbol == 'function' &&
					(d[Symbol.iterator] = function () {
						return this;
					}),
				d
			);
			function m(i) {
				return function (s) {
					return b([i, s]);
				};
			}
			function b(i) {
				if (t) throw new TypeError('Generator is already executing.');
				for (; n; )
					try {
						if (
							((t = 1),
							r &&
								(a =
									i[0] & 2
										? r.return
										: i[0]
										? r.throw || ((a = r.return) && a.call(r), 0)
										: r.next) &&
								!(a = a.call(r, i[1])).done)
						)
							return a;
						switch (((r = 0), a && (i = [i[0] & 2, a.value]), i[0])) {
							case 0:
							case 1:
								a = i;
								break;
							case 4:
								return n.label++, { value: i[1], done: !1 };
							case 5:
								n.label++, (r = i[1]), (i = [0]);
								continue;
							case 7:
								(i = n.ops.pop()), n.trys.pop();
								continue;
							default:
								if (
									((a = n.trys),
									!(a = a.length > 0 && a[a.length - 1]) &&
										(i[0] === 6 || i[0] === 2))
								) {
									n = 0;
									continue;
								}
								if (i[0] === 3 && (!a || (i[1] > a[0] && i[1] < a[3]))) {
									n.label = i[1];
									break;
								}
								if (i[0] === 6 && n.label < a[1]) {
									(n.label = a[1]), (a = i);
									break;
								}
								if (a && n.label < a[2]) {
									(n.label = a[2]), n.ops.push(i);
									break;
								}
								a[2] && n.ops.pop(), n.trys.pop();
								continue;
						}
						i = o.call(e, n);
					} catch (s) {
						(i = [6, s]), (r = 0);
					} finally {
						t = a = 0;
					}
				if (i[0] & 5) throw i[1];
				return { value: i[0] ? i[1] : void 0, done: !0 };
			}
		},
	ve =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	vt = function (e) {
		e === void 0 && (e = {});
		var o = e.disableAuthentication,
			n = e.id,
			t = e.mutationMode,
			r = t === void 0 ? 'undoable' : t,
			a = e.mutationOptions,
			d = a === void 0 ? {} : a,
			m = e.queryOptions,
			b = m === void 0 ? {} : m,
			i = e.redirect,
			s = i === void 0 ? ht : i,
			h = e.transform;
		Pe({ enabled: !o });
		var E = ge(e),
			C = st(E),
			k = Re(),
			M = Ae(),
			$ = De(),
			v = Le(),
			c = qe().id,
			f = n ?? decodeURIComponent(c),
			O = b.meta,
			S = ve(b, ['meta']),
			y = d.onSuccess,
			w = d.onError,
			l = d.meta,
			T = ve(d, ['onSuccess', 'onError', 'meta']),
			j = et(),
			A = j.registerMutationMiddleware,
			R = j.getMutateWithMiddlewares,
			D = j.unregisterMutationMiddleware,
			P = ct(
				E,
				{ id: f, meta: O },
				N(
					{
						onError: function () {
							M('ra.notification.item_doesnt_exist', { type: 'error' }),
								$('list', E),
								v();
						},
						refetchOnReconnect: !1,
						refetchOnWindowFocus: !1,
						retry: !1,
					},
					S
				)
			),
			x = P.data,
			Q = P.error,
			U = P.isLoading,
			L = P.isFetching,
			q = P.refetch;
		if (x && x.id && x.id != f)
			throw new Error(
				"useEditController: Fetched record's id attribute ("
					.concat(x.id, ") must match the requested 'id' (")
					.concat(f, ')')
			);
		var B = ke(),
			z = C(x),
			K = k('ra.page.edit', {
				name: B(E, 1),
				id: f,
				record: x,
				recordRepresentation: typeof z == 'string' ? z : '',
			}),
			G = { id: f, previousData: x },
			ne = Ot(E, G, N(N({}, T), { mutationMode: r })),
			oe = ne[0],
			_e = ne[1].isLoading,
			je = g.useCallback(
				function (V, ae) {
					var X = ae === void 0 ? {} : ae,
						ie = X.onSuccess,
						ue = X.onError,
						se = X.transform;
					return Promise.resolve(
						se
							? se(V, { previousData: G.previousData })
							: h
							? h(V, { previousData: G.previousData })
							: V
					).then(function (xe) {
						var Ce = R(oe);
						return Ce(
							E,
							{ id: f, data: xe, meta: l },
							{
								onSuccess: function (_, ce, le) {
									return dt(void 0, void 0, void 0, function () {
										return ft(this, function (qt) {
											return ie
												? [2, ie(_, ce, le)]
												: y
												? [2, y(_, ce, le)]
												: (M('ra.notification.updated', {
														type: 'info',
														messageArgs: { smart_count: 1 },
														undoable: r === 'undoable',
												  }),
												  $(s, E, _.id, _),
												  [2]);
										});
									});
								},
								onError:
									ue ||
									w ||
									function (_) {
										M(
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
										);
									},
							}
						);
					});
				},
				[f, R, l, r, M, w, y, $, s, E, h, oe, G.previousData]
			);
		return {
			defaultTitle: K,
			error: Q,
			isFetching: L,
			isLoading: U,
			mutationMode: r,
			record: x,
			redirect: s,
			refetch: q,
			registerMutationMiddleware: A,
			resource: E,
			save: je,
			saving: _e,
			unregisterMutationMiddleware: D,
		};
	},
	ht = 'list',
	te = g.createContext({
		record: null,
		defaultTitle: null,
		isFetching: null,
		isLoading: null,
		mutationMode: null,
		redirect: null,
		refetch: null,
		resource: null,
		save: null,
		saving: null,
		registerMutationMiddleware: null,
		unregisterMutationMiddleware: null,
	});
te.displayName = 'EditContext';
var mt = function (e) {
		var o = e.children,
			n = e.value;
		return g.createElement(
			te.Provider,
			{ value: n },
			g.createElement(
				tt,
				{ value: rt(n) },
				g.createElement(Ie, { value: n && n.record }, o)
			)
		);
	},
	gt =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	yt = function (e) {
		var o = e.children,
			n = gt(e, ['children']),
			t = vt(n),
			r = g.createElement(mt, { value: t }, o);
		return n.resource ? g.createElement($e, { value: n.resource }, r) : r;
	},
	be = function (e) {
		var o = g.useContext(te);
		return g.useMemo(
			function () {
				return it({}, e != null ? bt(e) : {}, o);
			},
			[o, e]
		);
	},
	bt = function (e) {
		var o = e.data,
			n = e.record,
			t = e.defaultTitle,
			r = e.isFetching,
			a = e.isLoading,
			d = e.mutationMode,
			m = e.redirect,
			b = e.resource,
			i = e.save,
			s = e.saving;
		return {
			data: n || o,
			record: n || o,
			defaultTitle: t,
			isFetching: r,
			isLoading: a,
			mutationMode: d,
			redirect: m,
			resource: b,
			save: i,
			saving: s,
		};
	},
	p =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(p =
					Object.assign ||
					function (e) {
						for (var o, n = 1, t = arguments.length; n < t; n++) {
							o = arguments[n];
							for (var r in o)
								Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
						}
						return e;
					}),
				p.apply(this, arguments)
			);
		},
	he =
		(globalThis && globalThis.__awaiter) ||
		function (e, o, n, t) {
			function r(a) {
				return a instanceof n
					? a
					: new n(function (d) {
							d(a);
					  });
			}
			return new (n || (n = Promise))(function (a, d) {
				function m(s) {
					try {
						i(t.next(s));
					} catch (h) {
						d(h);
					}
				}
				function b(s) {
					try {
						i(t.throw(s));
					} catch (h) {
						d(h);
					}
				}
				function i(s) {
					s.done ? a(s.value) : r(s.value).then(m, b);
				}
				i((t = t.apply(e, o || [])).next());
			});
		},
	me =
		(globalThis && globalThis.__generator) ||
		function (e, o) {
			var n = {
					label: 0,
					sent: function () {
						if (a[0] & 1) throw a[1];
						return a[1];
					},
					trys: [],
					ops: [],
				},
				t,
				r,
				a,
				d;
			return (
				(d = { next: m(0), throw: m(1), return: m(2) }),
				typeof Symbol == 'function' &&
					(d[Symbol.iterator] = function () {
						return this;
					}),
				d
			);
			function m(i) {
				return function (s) {
					return b([i, s]);
				};
			}
			function b(i) {
				if (t) throw new TypeError('Generator is already executing.');
				for (; n; )
					try {
						if (
							((t = 1),
							r &&
								(a =
									i[0] & 2
										? r.return
										: i[0]
										? r.throw || ((a = r.return) && a.call(r), 0)
										: r.next) &&
								!(a = a.call(r, i[1])).done)
						)
							return a;
						switch (((r = 0), a && (i = [i[0] & 2, a.value]), i[0])) {
							case 0:
							case 1:
								a = i;
								break;
							case 4:
								return n.label++, { value: i[1], done: !1 };
							case 5:
								n.label++, (r = i[1]), (i = [0]);
								continue;
							case 7:
								(i = n.ops.pop()), n.trys.pop();
								continue;
							default:
								if (
									((a = n.trys),
									!(a = a.length > 0 && a[a.length - 1]) &&
										(i[0] === 6 || i[0] === 2))
								) {
									n = 0;
									continue;
								}
								if (i[0] === 3 && (!a || (i[1] > a[0] && i[1] < a[3]))) {
									n.label = i[1];
									break;
								}
								if (i[0] === 6 && n.label < a[1]) {
									(n.label = a[1]), (a = i);
									break;
								}
								if (a && n.label < a[2]) {
									(n.label = a[2]), n.ops.push(i);
									break;
								}
								a[2] && n.ops.pop(), n.trys.pop();
								continue;
						}
						i = o.call(e, n);
					} catch (s) {
						(i = [6, s]), (r = 0);
					} finally {
						t = a = 0;
					}
				if (i[0] & 5) throw i[1];
				return { value: i[0] ? i[1] : void 0, done: !0 };
			}
		},
	pt =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	H =
		(globalThis && globalThis.__spreadArray) ||
		function (e, o, n) {
			if (n || arguments.length === 2)
				for (var t = 0, r = o.length, a; t < r; t++)
					(a || !(t in o)) &&
						(a || (a = Array.prototype.slice.call(o, 0, t)), (a[t] = o[t]));
			return e.concat(a || Array.prototype.slice.call(o));
		},
	Ot = function (e, o, n) {
		o === void 0 && (o = {}), n === void 0 && (n = {});
		var t = ut(),
			r = Fe(),
			a = o.id,
			d = o.data,
			m = o.meta,
			b = n.mutationMode,
			i = b === void 0 ? 'pessimistic' : b,
			s = pt(n, ['mutationMode']),
			h = g.useRef(i),
			E = g.useRef(o),
			C = g.useRef([]),
			k = function (v) {
				var c = v.resource,
					f = v.id,
					O = v.data,
					S = Date.now(),
					y = h.current === 'undoable' ? S + 5 * 1e3 : S,
					w = function (l) {
						if (l) {
							var T = l.findIndex(function (j) {
								return j.id == f;
							});
							return T === -1
								? l
								: H(
										H(H([], l.slice(0, T), !0), [p(p({}, l[T]), O)], !1),
										l.slice(T + 1),
										!0
								  );
						}
					};
				r.setQueryData(
					[c, 'getOne', { id: String(f), meta: m }],
					function (l) {
						return p(p({}, l), O);
					},
					{ updatedAt: y }
				),
					r.setQueriesData(
						[c, 'getList'],
						function (l) {
							return l && l.data ? p(p({}, l), { data: w(l.data) }) : l;
						},
						{ updatedAt: y }
					),
					r.setQueriesData(
						[c, 'getMany'],
						function (l) {
							return l && l.length > 0 ? w(l) : l;
						},
						{ updatedAt: y }
					),
					r.setQueriesData(
						[c, 'getManyReference'],
						function (l) {
							return l && l.data ? { data: w(l.data), total: l.total } : l;
						},
						{ updatedAt: y }
					);
			},
			M = lt(
				function (v) {
					var c = v === void 0 ? {} : v,
						f = c.resource,
						O = f === void 0 ? e : f,
						S = c.id,
						y = S === void 0 ? E.current.id : S,
						w = c.data,
						l = w === void 0 ? E.current.data : w,
						T = c.meta,
						j = T === void 0 ? E.current.meta : T,
						A = c.previousData,
						R = A === void 0 ? E.current.previousData : A;
					return t
						.update(O, { id: y, data: l, previousData: R, meta: j })
						.then(function (D) {
							var P = D.data;
							return P;
						});
				},
				p(p({}, s), {
					onMutate: function (v) {
						return he(void 0, void 0, void 0, function () {
							var c;
							return me(this, function (f) {
								switch (f.label) {
									case 0:
										return s.onMutate ? [4, s.onMutate(v)] : [3, 2];
									case 1:
										return (
											(c = f.sent() || {}), [2, p({ snapshot: C.current }, c)]
										);
									case 2:
										return [2, { snapshot: C.current }];
								}
							});
						});
					},
					onError: function (v, c, f) {
						if (
							(c === void 0 && (c = {}),
							(h.current === 'optimistic' || h.current === 'undoable') &&
								f.snapshot.forEach(function (O) {
									var S = O[0],
										y = O[1];
									r.setQueryData(S, y);
								}),
							s.onError)
						)
							return s.onError(v, c, f);
					},
					onSuccess: function (v, c, f) {
						if ((c === void 0 && (c = {}), h.current === 'pessimistic')) {
							var O = c.resource,
								S = O === void 0 ? e : O,
								y = c.id,
								w = y === void 0 ? a : y;
							k({ resource: S, id: w, data: v }),
								s.onSuccess && s.onSuccess(v, c, f);
						}
					},
					onSettled: function (v, c, f, O) {
						if (
							(f === void 0 && (f = {}),
							(h.current === 'optimistic' || h.current === 'undoable') &&
								O.snapshot.forEach(function (S) {
									var y = S[0];
									r.invalidateQueries(y);
								}),
							s.onSettled)
						)
							return s.onSettled(v, c, f, O);
					},
				})
			),
			$ = function (v, c, f) {
				return (
					v === void 0 && (v = e),
					c === void 0 && (c = {}),
					f === void 0 && (f = {}),
					he(void 0, void 0, void 0, function () {
						var O, S, y, w, l, T, j, A, R, D, P, x, Q;
						return me(this, function (U) {
							switch (U.label) {
								case 0:
									return (
										(O = f.mutationMode),
										(S = f.returnPromise),
										(y = f.onSuccess),
										(w = f.onSettled),
										(l = f.onError),
										(E.current = o),
										O && (h.current = O),
										S &&
											h.current !== 'pessimistic' &&
											console.warn(
												'The returnPromise parameter can only be used if the mutationMode is set to pessimistic'
											),
										h.current === 'pessimistic'
											? S
												? [
														2,
														M.mutateAsync(p({ resource: v }, c), {
															onSuccess: y,
															onSettled: w,
															onError: l,
														}),
												  ]
												: [
														2,
														M.mutate(p({ resource: v }, c), {
															onSuccess: y,
															onSettled: w,
															onError: l,
														}),
												  ]
											: ((T = c.id),
											  (j = T === void 0 ? a : T),
											  (A = c.data),
											  (R = A === void 0 ? d : A),
											  (D = c.meta),
											  (P = D === void 0 ? m : D),
											  (x = r.getQueryData([
													v,
													'getOne',
													{ id: String(j), meta: P },
											  ])),
											  (Q = [
													[v, 'getOne', { id: String(j), meta: P }],
													[v, 'getList'],
													[v, 'getMany'],
													[v, 'getManyReference'],
											  ]),
											  (C.current = Q.reduce(function (L, q) {
													return L.concat(r.getQueriesData(q));
											  }, [])),
											  [
													4,
													Promise.all(
														C.current.map(function (L) {
															var q = L[0];
															return r.cancelQueries(q);
														})
													),
											  ])
									);
								case 1:
									return (
										U.sent(),
										k({ resource: v, id: j, data: R }),
										y &&
											setTimeout(function () {
												return y(p(p({}, x), R), p({ resource: v }, c), {
													snapshot: C.current,
												});
											}, 0),
										s.onSuccess &&
											setTimeout(function () {
												return s.onSuccess(
													p(p({}, x), R),
													p({ resource: v }, c),
													{ snapshot: C.current }
												);
											}, 0),
										h.current === 'optimistic'
											? [
													2,
													M.mutate(p({ resource: v }, c), {
														onSettled: w,
														onError: l,
													}),
											  ]
											: (Qe.once('end', function (L) {
													var q = L.isUndo;
													q
														? C.current.forEach(function (B) {
																var z = B[0],
																	K = B[1];
																r.setQueryData(z, K);
														  })
														: M.mutate(p({ resource: v }, c), {
																onSettled: w,
																onError: l,
														  });
											  }),
											  [2])
									);
							}
						});
					})
				);
			};
		return [Ne($), M];
	},
	re = {},
	wt = Be;
Object.defineProperty(re, '__esModule', { value: !0 });
var pe = (re.default = void 0),
	Et = wt(Ue()),
	St = ze,
	Mt = (0, Et.default)(
		(0, St.jsx)('path', {
			d: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
		}),
		'RemoveRedEye'
	);
pe = re.default = Mt;
var J =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(J =
					Object.assign ||
					function (e) {
						for (var o, n = 1, t = arguments.length; n < t; n++) {
							o = arguments[n];
							for (var r in o)
								Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
						}
						return e;
					}),
				J.apply(this, arguments)
			);
		},
	Tt =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	Oe = function (e) {
		var o = e.icon,
			n = o === void 0 ? jt : o,
			t = e.label,
			r = t === void 0 ? 'ra.action.show' : t;
		e.record, e.resource;
		var a = e.scrollToTop,
			d = a === void 0 ? !0 : a,
			m = Tt(e, ['icon', 'label', 'record', 'resource', 'scrollToTop']),
			b = ge(e),
			i = Ge(e),
			s = We();
		return i
			? g.createElement(
					Ke,
					J(
						{
							component: Ve,
							to: s({ type: 'show', resource: b, id: i.id }),
							state: _t[String(d)],
							label: r,
							onClick: xt,
						},
						m
					),
					n
			  )
			: null;
	},
	_t = { true: { _scrollToTop: !0 }, false: {} },
	jt = g.createElement(pe, null),
	xt = function (e) {
		return e.stopPropagation();
	};
Oe.propTypes = {
	icon: u.element,
	label: u.string,
	record: u.any,
	scrollToTop: u.bool,
};
var Ct = g.memo(Oe, function (e, o) {
	return (
		e.resource === o.resource &&
		(e.record && o.record
			? e.record.id === o.record.id
			: e.record == o.record) &&
		e.label === o.label &&
		e.disabled === o.disabled
	);
});
const Pt = Ct;
var Y =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Y =
					Object.assign ||
					function (e) {
						for (var o, n = 1, t = arguments.length; n < t; n++) {
							o = arguments[n];
							for (var r in o)
								Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
						}
						return e;
					}),
				Y.apply(this, arguments)
			);
		},
	we =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	Ee = function (e) {
		var o = e.className,
			n = we(e, ['className']),
			t = be(n).record,
			r = ye(n).hasShow;
		return g.createElement(
			at,
			Y({ className: o }, Rt(n)),
			r && g.createElement(Pt, { record: t })
		);
	},
	Rt = function (e) {
		e.hasCreate, e.hasEdit, e.hasShow, e.hasList;
		var o = we(e, ['hasCreate', 'hasEdit', 'hasShow', 'hasList']);
		return o;
	};
Ee.propTypes = {
	className: u.string,
	data: u.object,
	hasCreate: u.bool,
	hasEdit: u.bool,
	hasShow: u.bool,
	hasList: u.bool,
	resource: u.string,
};
var Z =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Z =
					Object.assign ||
					function (e) {
						for (var o, n = 1, t = arguments.length; n < t; n++) {
							o = arguments[n];
							for (var r in o)
								Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
						}
						return e;
					}),
				Z.apply(this, arguments)
			);
		},
	Se =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	F,
	Me = function (e) {
		var o,
			n = e.actions,
			t = e.aside,
			r = e.children,
			a = e.className,
			d = e.component,
			m = d === void 0 ? Ze : d,
			b = e.title;
		e.mutationMode;
		var i = Se(e, [
				'actions',
				'aside',
				'children',
				'className',
				'component',
				'title',
				'mutationMode',
			]),
			s = ye().hasShow,
			h = be(e),
			E = h.resource,
			C = h.defaultTitle,
			k = h.record,
			M = typeof n > 'u' && s ? g.createElement(Ee, null) : n;
		return r
			? g.createElement(
					Dt,
					Z({ className: de('edit-page', a) }, At(i)),
					g.createElement(Xe, {
						title: b,
						defaultTitle: C,
						preferenceKey: ''.concat(E, '.edit.title'),
					}),
					M,
					g.createElement(
						'div',
						{ className: de(I.main, ((o = {}), (o[I.noActions] = !M), o)) },
						g.createElement(
							m,
							{ className: I.card },
							k ? r : g.createElement(He, null, ' ')
						),
						t
					)
			  )
			: null;
	};
Me.propTypes = {
	actions: u.oneOfType([u.element, u.bool]),
	aside: u.element,
	children: u.element,
	className: u.string,
	component: Je,
	defaultTitle: u.any,
	hasList: u.bool,
	hasShow: u.bool,
	mutationMode: u.oneOf(['pessimistic', 'optimistic', 'undoable']),
	mutationOptions: u.object,
	record: u.object,
	redirect: u.oneOfType([u.string, u.bool, u.func]),
	resource: u.string,
	save: u.func,
	title: u.node,
};
var At = function (e) {
		e.addMiddleware,
			e.defaultTitle,
			e.hasCreate,
			e.hasEdit,
			e.hasList,
			e.hasShow,
			e.history,
			e.id,
			e.isFetching,
			e.isLoading,
			e.location,
			e.match,
			e.options,
			e.queryOptions,
			e.mutationOptions,
			e.permissions,
			e.refetch,
			e.removeMiddleware,
			e.resource,
			e.save,
			e.saving,
			e.transform;
		var o = Se(e, [
			'addMiddleware',
			'defaultTitle',
			'hasCreate',
			'hasEdit',
			'hasList',
			'hasShow',
			'history',
			'id',
			'isFetching',
			'isLoading',
			'location',
			'match',
			'options',
			'queryOptions',
			'mutationOptions',
			'permissions',
			'refetch',
			'removeMiddleware',
			'resource',
			'save',
			'saving',
			'transform',
		]);
		return o;
	},
	W = 'RaEdit',
	I = {
		main: ''.concat(W, '-main'),
		noActions: ''.concat(W, '-noActions'),
		card: ''.concat(W, '-card'),
	},
	Dt = Ye('div', {
		name: W,
		overridesResolver: function (e, o) {
			return o.root;
		},
	})(
		((F = {}),
		(F['& .'.concat(I.main)] = { display: 'flex', alignItems: 'flex-start' }),
		(F['& .'.concat(I.noActions)] = { marginTop: '1em' }),
		(F['& .'.concat(I.card)] = { flex: '1 1 auto' }),
		F)
	),
	ee =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(ee =
					Object.assign ||
					function (e) {
						for (var o, n = 1, t = arguments.length; n < t; n++) {
							o = arguments[n];
							for (var r in o)
								Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
						}
						return e;
					}),
				ee.apply(this, arguments)
			);
		},
	Lt =
		(globalThis && globalThis.__rest) ||
		function (e, o) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					o.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, t = Object.getOwnPropertySymbols(e); r < t.length; r++)
					o.indexOf(t[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[r]) &&
						(n[t[r]] = e[t[r]]);
			return n;
		},
	Te = function (e) {
		nt('Edit', ['children'], e);
		var o = e.resource,
			n = e.id,
			t = e.mutationMode,
			r = e.mutationOptions,
			a = e.queryOptions,
			d = e.redirect,
			m = e.transform,
			b = e.disableAuthentication,
			i = Lt(e, [
				'resource',
				'id',
				'mutationMode',
				'mutationOptions',
				'queryOptions',
				'redirect',
				'transform',
				'disableAuthentication',
			]);
		return g.createElement(
			yt,
			{
				resource: o,
				id: n,
				mutationMode: t,
				mutationOptions: r,
				queryOptions: a,
				redirect: d,
				transform: m,
				disableAuthentication: b,
			},
			g.createElement(Me, ee({}, i))
		);
	};
Te.propTypes = {
	actions: u.oneOfType([u.element, u.bool]),
	aside: u.element,
	children: u.node,
	className: u.string,
	disableAuthentication: u.bool,
	hasCreate: u.bool,
	hasEdit: u.bool,
	hasShow: u.bool,
	hasList: u.bool,
	id: u.any,
	mutationMode: u.oneOf(['pessimistic', 'optimistic', 'undoable']),
	mutationOptions: u.object,
	queryOptions: u.object,
	redirect: u.oneOfType([u.string, u.bool, u.func]),
	resource: u.string,
	title: u.node,
	transform: u.func,
	sx: u.any,
};
function zt() {
	return fe(Te, { children: fe(ot, {}) });
}
export { zt as default };
