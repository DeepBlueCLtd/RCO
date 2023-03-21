import {
	a as L,
	d as G,
	e as K,
	r as j,
	h as ie,
	i as ue,
	n as le,
	v as Q,
	j as Z,
	p as d,
	s as H,
	B as J,
	Z as V,
	c as ce,
	ak as I,
	al as F,
	a2 as se,
} from './index-091859a0.js';
import { a as fe, u as de, d as Y, C as ve } from './Confirm-edcfa802.js';
import { a as ge } from './useResourceDefinition-e2399b95.js';
var N =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(N =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				N.apply(this, arguments)
			);
		},
	me =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var o = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(o[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					r.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(o[t[n]] = e[t[n]]);
			return o;
		},
	he = function (e) {
		var r = e.record,
			o = e.redirect,
			t = o === void 0 ? 'list' : o,
			n = e.onClick,
			i = e.mutationOptions,
			b = i === void 0 ? {} : i,
			y = b.meta,
			_ = me(b, ['meta']),
			a = L(e),
			s = G(),
			O = ee(a),
			p = K(),
			C = te(),
			D = C[0],
			M = C[1].isLoading,
			f = j.useCallback(
				function (l) {
					l.stopPropagation(),
						D(
							a,
							{ id: r.id, previousData: r, meta: y },
							N(
								{
									onSuccess: function () {
										s('ra.notification.deleted', {
											type: 'info',
											messageArgs: { smart_count: 1 },
											undoable: !0,
										}),
											O([r.id]),
											p(t, a);
									},
									onError: function (c) {
										s(
											typeof c == 'string'
												? c
												: c.message || 'ra.notification.http_error',
											{
												type: 'error',
												messageArgs: {
													_:
														typeof c == 'string'
															? c
															: c && c.message
															? c.message
															: void 0,
												},
											}
										);
									},
									mutationMode: 'undoable',
								},
								_
							)
						),
						typeof n == 'function' && n(l);
				},
				[D, y, _, s, n, r, p, t, a, O]
			);
		return { isLoading: M, handleDelete: f };
	};
const be = he;
var W =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(W =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				W.apply(this, arguments)
			);
		},
	ye =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var o = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(o[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					r.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(o[t[n]] = e[t[n]]);
			return o;
		},
	pe = function (e) {
		var r = e.record,
			o = e.redirect,
			t = e.mutationMode,
			n = e.onClick,
			i = e.mutationOptions,
			b = i === void 0 ? {} : i,
			y = b.meta,
			_ = ye(b, ['meta']),
			a = L(e),
			s = j.useState(!1),
			O = s[0],
			p = s[1],
			C = G(),
			D = ee(a),
			M = K(),
			f = te(),
			l = f[0],
			c = f[1].isLoading,
			m = function (u) {
				p(!0), u.stopPropagation();
			},
			h = function (u) {
				p(!1), u.stopPropagation();
			},
			g = j.useCallback(
				function (u) {
					u.stopPropagation(),
						l(
							a,
							{ id: r.id, previousData: r, meta: y },
							W(
								{
									onSuccess: function () {
										p(!1),
											C('ra.notification.deleted', {
												type: 'info',
												messageArgs: { smart_count: 1 },
												undoable: t === 'undoable',
											}),
											D([r.id]),
											M(o, a);
									},
									onError: function (v) {
										p(!1),
											C(
												typeof v == 'string'
													? v
													: v.message || 'ra.notification.http_error',
												{
													type: 'error',
													messageArgs: {
														_:
															typeof v == 'string'
																? v
																: v && v.message
																? v.message
																: void 0,
													},
												}
											);
									},
									mutationMode: t,
								},
								_
							)
						),
						typeof n == 'function' && n(u);
				},
				[l, y, t, _, C, n, r, M, o, a, D]
			);
		return {
			open: O,
			isLoading: c,
			handleDialogOpen: m,
			handleDialogClose: h,
			handleDelete: g,
		};
	};
const Oe = pe;
var ee = function (e) {
		var r = fe(e),
			o = r[1].unselect;
		return j.useCallback(
			function (t) {
				o(t);
			},
			[o]
		);
	},
	S =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(S =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				S.apply(this, arguments)
			);
		},
	q =
		(globalThis && globalThis.__awaiter) ||
		function (e, r, o, t) {
			function n(i) {
				return i instanceof o
					? i
					: new o(function (b) {
							b(i);
					  });
			}
			return new (o || (o = Promise))(function (i, b) {
				function y(s) {
					try {
						a(t.next(s));
					} catch (O) {
						b(O);
					}
				}
				function _(s) {
					try {
						a(t.throw(s));
					} catch (O) {
						b(O);
					}
				}
				function a(s) {
					s.done ? i(s.value) : n(s.value).then(y, _);
				}
				a((t = t.apply(e, r || [])).next());
			});
		},
	z =
		(globalThis && globalThis.__generator) ||
		function (e, r) {
			var o = {
					label: 0,
					sent: function () {
						if (i[0] & 1) throw i[1];
						return i[1];
					},
					trys: [],
					ops: [],
				},
				t,
				n,
				i,
				b;
			return (
				(b = { next: y(0), throw: y(1), return: y(2) }),
				typeof Symbol == 'function' &&
					(b[Symbol.iterator] = function () {
						return this;
					}),
				b
			);
			function y(a) {
				return function (s) {
					return _([a, s]);
				};
			}
			function _(a) {
				if (t) throw new TypeError('Generator is already executing.');
				for (; o; )
					try {
						if (
							((t = 1),
							n &&
								(i =
									a[0] & 2
										? n.return
										: a[0]
										? n.throw || ((i = n.return) && i.call(n), 0)
										: n.next) &&
								!(i = i.call(n, a[1])).done)
						)
							return i;
						switch (((n = 0), i && (a = [a[0] & 2, i.value]), a[0])) {
							case 0:
							case 1:
								i = a;
								break;
							case 4:
								return o.label++, { value: a[1], done: !1 };
							case 5:
								o.label++, (n = a[1]), (a = [0]);
								continue;
							case 7:
								(a = o.ops.pop()), o.trys.pop();
								continue;
							default:
								if (
									((i = o.trys),
									!(i = i.length > 0 && i[i.length - 1]) &&
										(a[0] === 6 || a[0] === 2))
								) {
									o = 0;
									continue;
								}
								if (a[0] === 3 && (!i || (a[1] > i[0] && a[1] < i[3]))) {
									o.label = a[1];
									break;
								}
								if (a[0] === 6 && o.label < i[1]) {
									(o.label = i[1]), (i = a);
									break;
								}
								if (i && o.label < i[2]) {
									(o.label = i[2]), o.ops.push(a);
									break;
								}
								i[2] && o.ops.pop(), o.trys.pop();
								continue;
						}
						a = r.call(e, o);
					} catch (s) {
						(a = [6, s]), (n = 0);
					} finally {
						t = i = 0;
					}
				if (a[0] & 5) throw a[1];
				return { value: a[0] ? a[1] : void 0, done: !0 };
			}
		},
	_e =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var o = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(o[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					r.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(o[t[n]] = e[t[n]]);
			return o;
		},
	X =
		(globalThis && globalThis.__spreadArray) ||
		function (e, r, o) {
			if (o || arguments.length === 2)
				for (var t = 0, n = r.length, i; t < n; t++)
					(i || !(t in r)) &&
						(i || (i = Array.prototype.slice.call(r, 0, t)), (i[t] = r[t]));
			return e.concat(i || Array.prototype.slice.call(r));
		},
	te = function (e, r, o) {
		r === void 0 && (r = {}), o === void 0 && (o = {});
		var t = ge(),
			n = ie(),
			i = r.id,
			b = r.previousData,
			y = o.mutationMode,
			_ = y === void 0 ? 'pessimistic' : y,
			a = _e(o, ['mutationMode']),
			s = j.useRef(_),
			O = j.useRef(r),
			p = j.useRef([]),
			C = function (f) {
				var l = f.resource,
					c = f.id,
					m = Date.now(),
					h = s.current === 'undoable' ? m + 5 * 1e3 : m,
					g = function (u) {
						if (u) {
							var v = u.findIndex(function (w) {
								return w.id == c;
							});
							return v === -1
								? u
								: X(X([], u.slice(0, v), !0), u.slice(v + 1), !0);
						}
					};
				n.setQueriesData(
					[l, 'getList'],
					function (u) {
						if (!u || !u.data) return u;
						var v = g(u.data),
							w = v.length < u.data.length;
						return w
							? {
									data: v,
									total: u.total ? u.total - 1 : void 0,
									pageInfo: u.pageInfo,
							  }
							: u;
					},
					{ updatedAt: h }
				),
					n.setQueriesData(
						[l, 'getMany'],
						function (u) {
							return u && u.length > 0 ? g(u) : u;
						},
						{ updatedAt: h }
					),
					n.setQueriesData(
						[l, 'getManyReference'],
						function (u) {
							if (!u || !u.data) return u;
							var v = g(u.data),
								w = v.length < u.data.length;
							return w ? { data: v, total: u.total - 1 } : u;
						},
						{ updatedAt: h }
					);
			},
			D = de(
				function (f) {
					var l = f === void 0 ? {} : f,
						c = l.resource,
						m = c === void 0 ? e : c,
						h = l.id,
						g = h === void 0 ? O.current.id : h,
						u = l.previousData,
						v = u === void 0 ? O.current.previousData : u,
						w = l.meta,
						E = w === void 0 ? O.current.meta : w;
					return t
						.delete(m, { id: g, previousData: v, meta: E })
						.then(function (T) {
							var k = T.data;
							return k;
						});
				},
				S(S({}, a), {
					onMutate: function (f) {
						return q(void 0, void 0, void 0, function () {
							var l;
							return z(this, function (c) {
								switch (c.label) {
									case 0:
										return a.onMutate ? [4, a.onMutate(f)] : [3, 2];
									case 1:
										return (
											(l = c.sent() || {}), [2, S({ snapshot: p.current }, l)]
										);
									case 2:
										return [2, { snapshot: p.current }];
								}
							});
						});
					},
					onError: function (f, l, c) {
						if (
							(l === void 0 && (l = {}),
							(s.current === 'optimistic' || s.current === 'undoable') &&
								c.snapshot.forEach(function (m) {
									var h = m[0],
										g = m[1];
									n.setQueryData(h, g);
								}),
							a.onError)
						)
							return a.onError(f, l, c);
					},
					onSuccess: function (f, l, c) {
						if ((l === void 0 && (l = {}), s.current === 'pessimistic')) {
							var m = l.resource,
								h = m === void 0 ? e : m,
								g = l.id,
								u = g === void 0 ? i : g;
							C({ resource: h, id: u }), a.onSuccess && a.onSuccess(f, l, c);
						}
					},
					onSettled: function (f, l, c, m) {
						if (
							(c === void 0 && (c = {}),
							(s.current === 'optimistic' || s.current === 'undoable') &&
								m.snapshot.forEach(function (h) {
									var g = h[0];
									n.invalidateQueries(g);
								}),
							a.onSettled)
						)
							return a.onSettled(f, l, c, m);
					},
				})
			),
			M = function (f, l, c) {
				return (
					f === void 0 && (f = e),
					l === void 0 && (l = {}),
					c === void 0 && (c = {}),
					q(void 0, void 0, void 0, function () {
						var m, h, g, u, v, w, E, T, k;
						return z(this, function (R) {
							switch (R.label) {
								case 0:
									return (
										(m = c.mutationMode),
										(h = c.onSuccess),
										(g = c.onSettled),
										(u = c.onError),
										(O.current = r),
										m && (s.current = m),
										s.current === 'pessimistic'
											? [
													2,
													D.mutate(S({ resource: f }, l), {
														onSuccess: h,
														onSettled: g,
														onError: u,
													}),
											  ]
											: ((v = l.id),
											  (w = v === void 0 ? i : v),
											  (E = l.previousData),
											  (T = E === void 0 ? b : E),
											  (k = [
													[f, 'getList'],
													[f, 'getMany'],
													[f, 'getManyReference'],
											  ]),
											  (p.current = k.reduce(function (x, P) {
													return x.concat(n.getQueriesData(P));
											  }, [])),
											  [
													4,
													Promise.all(
														p.current.map(function (x) {
															var P = x[0];
															return n.cancelQueries(P);
														})
													),
											  ])
									);
								case 1:
									return (
										R.sent(),
										C({ resource: f, id: w }),
										h &&
											setTimeout(function () {
												return h(T, S({ resource: f }, l), {
													snapshot: p.current,
												});
											}, 0),
										a.onSuccess &&
											setTimeout(function () {
												return a.onSuccess(T, S({ resource: f }, l), {
													snapshot: p.current,
												});
											}, 0),
										s.current === 'optimistic'
											? [
													2,
													D.mutate(S({ resource: f }, l), {
														onSettled: g,
														onError: u,
													}),
											  ]
											: (le.once('end', function (x) {
													var P = x.isUndo;
													P
														? p.current.forEach(function (U) {
																var oe = U[0],
																	ae = U[1];
																n.setQueryData(oe, ae);
														  })
														: D.mutate(S({ resource: f }, l), {
																onSettled: g,
																onError: u,
														  });
											  }),
											  [2])
									);
							}
						});
					})
				);
			};
		return [ue(M), D];
	},
	B =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(B =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				B.apply(this, arguments)
			);
		},
	Ce =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var o = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(o[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					r.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(o[t[n]] = e[t[n]]);
			return o;
		},
	ne = function (e) {
		var r = e.label,
			o = r === void 0 ? 'ra.action.delete' : r,
			t = e.className,
			n = e.icon,
			i = n === void 0 ? De : n,
			b = e.onClick,
			y = e.redirect,
			_ = y === void 0 ? 'list' : y,
			a = e.mutationOptions,
			s = Ce(e, [
				'label',
				'className',
				'icon',
				'onClick',
				'redirect',
				'mutationOptions',
			]),
			O = Q(e),
			p = L(e),
			C = be({
				record: O,
				resource: p,
				redirect: _,
				onClick: b,
				mutationOptions: a,
			}),
			D = C.isLoading,
			M = C.handleDelete;
		return j.createElement(
			je,
			B(
				{
					onClick: M,
					disabled: D,
					label: o,
					className: Z('ra-delete-button', t),
					key: 'button',
				},
				s
			),
			i
		);
	},
	De = j.createElement(Y, null);
ne.propTypes = {
	className: d.string,
	label: d.string,
	record: d.any,
	redirect: d.oneOfType([d.string, d.bool, d.func]),
	resource: d.string,
	icon: d.element,
};
var we = 'RaDeleteWithUndoButton',
	je = H(J, {
		name: we,
		overridesResolver: function (e, r) {
			return r.root;
		},
	})(function (e) {
		var r = e.theme;
		return {
			color: r.palette.error.main,
			'&:hover': {
				backgroundColor: V(r.palette.error.main, 0.12),
				'@media (hover: none)': { backgroundColor: 'transparent' },
			},
		};
	}),
	$ =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				($ =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				$.apply(this, arguments)
			);
		},
	Me =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var o = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(o[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					r.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(o[t[n]] = e[t[n]]);
			return o;
		},
	re = function (e) {
		var r = e.className,
			o = e.confirmTitle,
			t = o === void 0 ? 'ra.message.delete_title' : o,
			n = e.confirmContent,
			i = n === void 0 ? 'ra.message.delete_content' : n,
			b = e.icon,
			y = b === void 0 ? Se : b,
			_ = e.label,
			a = _ === void 0 ? 'ra.action.delete' : _,
			s = e.mutationMode,
			O = s === void 0 ? 'pessimistic' : s,
			p = e.onClick,
			C = e.redirect,
			D = C === void 0 ? 'list' : C,
			M = e.translateOptions,
			f = M === void 0 ? {} : M,
			l = e.mutationOptions,
			c = Me(e, [
				'className',
				'confirmTitle',
				'confirmContent',
				'icon',
				'label',
				'mutationMode',
				'onClick',
				'redirect',
				'translateOptions',
				'mutationOptions',
			]),
			m = ce(),
			h = Q(e),
			g = L(e),
			u = Oe({
				record: h,
				redirect: D,
				mutationMode: O,
				onClick: p,
				mutationOptions: l,
				resource: g,
			}),
			v = u.open,
			w = u.isLoading,
			E = u.handleDialogOpen,
			T = u.handleDialogClose,
			k = u.handleDelete;
		return I.createElement(
			j.Fragment,
			null,
			I.createElement(
				Te,
				$(
					{
						onClick: E,
						label: a,
						className: Z('ra-delete-button', r),
						key: 'button',
					},
					c
				),
				y
			),
			I.createElement(ve, {
				isOpen: v,
				loading: w,
				title: t,
				content: i,
				translateOptions: $(
					{
						name: m('resources.'.concat(g, '.forcedCaseName'), {
							smart_count: 1,
							_: F.humanize(
								m('resources.'.concat(g, '.name'), {
									smart_count: 1,
									_: F.singularize(g),
								}),
								!0
							),
						}),
						id: h.id,
					},
					f
				),
				onConfirm: k,
				onClose: T,
			})
		);
	},
	Se = I.createElement(Y, null);
re.propTypes = {
	className: d.string,
	confirmTitle: d.string,
	confirmContent: d.string,
	label: d.string,
	mutationMode: d.oneOf(['pessimistic', 'optimistic', 'undoable']),
	record: d.any,
	redirect: d.oneOfType([d.string, d.bool, d.func]),
	resource: d.string,
	icon: d.element,
	translateOptions: d.object,
};
var Ee = 'RaDeleteWithConfirmButton',
	Te = H(J, {
		name: Ee,
		overridesResolver: function (e, r) {
			return r.root;
		},
	})(function (e) {
		var r = e.theme;
		return {
			color: r.palette.error.main,
			'&:hover': {
				backgroundColor: V(r.palette.error.main, 0.12),
				'@media (hover: none)': { backgroundColor: 'transparent' },
			},
		};
	}),
	A =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(A =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				A.apply(this, arguments)
			);
		},
	ke =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var o = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(o[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					r.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(o[t[n]] = e[t[n]]);
			return o;
		},
	xe = function (e) {
		var r = e.mutationMode,
			o = ke(e, ['mutationMode']),
			t = Q(e),
			n = se();
		if (!t || t.id == null) return null;
		var i = r || (n != null && n.mutationMode ? n.mutationMode : 'undoable');
		return i === 'undoable'
			? j.createElement(ne, A({ record: t }, o))
			: j.createElement(re, A({ mutationMode: i, record: t }, o));
	};
xe.propTypes = {
	label: d.string,
	mutationMode: d.oneOf(['pessimistic', 'optimistic', 'undoable']),
	record: d.any,
	redirect: d.oneOfType([d.string, d.bool, d.func]),
	resource: d.string,
	icon: d.element,
};
export { xe as D };
