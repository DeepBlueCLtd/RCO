import {
	u as ne,
	a as ae,
	b as oe,
	c as ie,
	d as se,
	e as ce,
	r as f,
	f as le,
	R as ue,
	g as de,
	h as fe,
	i as ve,
	j as Q,
	T as he,
	p as s,
	s as me,
	C as ge,
	k as W,
} from './index-091859a0.js';
import {
	u as be,
	S as ye,
	a as Oe,
	b as pe,
	U as we,
} from './UserFrom-7e59585c.js';
import { u as Te, d as Ce, a as Se } from './useResourceDefinition-e2399b95.js';
import { q as xe } from './index-fa9b5ce0.js';
import { u as Ee } from './Confirm-edcfa802.js';
import './DeleteButton-194d027b.js';
var _e =
		(globalThis && globalThis.__awaiter) ||
		function (e, a, r, t) {
			function n(i) {
				return i instanceof r
					? i
					: new r(function (u) {
							u(i);
					  });
			}
			return new (r || (r = Promise))(function (i, u) {
				function d(l) {
					try {
						o(t.next(l));
					} catch (v) {
						u(v);
					}
				}
				function c(l) {
					try {
						o(t.throw(l));
					} catch (v) {
						u(v);
					}
				}
				function o(l) {
					l.done ? i(l.value) : n(l.value).then(d, c);
				}
				o((t = t.apply(e, a || [])).next());
			});
		},
	je =
		(globalThis && globalThis.__generator) ||
		function (e, a) {
			var r = {
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
				u;
			return (
				(u = { next: d(0), throw: d(1), return: d(2) }),
				typeof Symbol == 'function' &&
					(u[Symbol.iterator] = function () {
						return this;
					}),
				u
			);
			function d(o) {
				return function (l) {
					return c([o, l]);
				};
			}
			function c(o) {
				if (t) throw new TypeError('Generator is already executing.');
				for (; r; )
					try {
						if (
							((t = 1),
							n &&
								(i =
									o[0] & 2
										? n.return
										: o[0]
										? n.throw || ((i = n.return) && i.call(n), 0)
										: n.next) &&
								!(i = i.call(n, o[1])).done)
						)
							return i;
						switch (((n = 0), i && (o = [o[0] & 2, i.value]), o[0])) {
							case 0:
							case 1:
								i = o;
								break;
							case 4:
								return r.label++, { value: o[1], done: !1 };
							case 5:
								r.label++, (n = o[1]), (o = [0]);
								continue;
							case 7:
								(o = r.ops.pop()), r.trys.pop();
								continue;
							default:
								if (
									((i = r.trys),
									!(i = i.length > 0 && i[i.length - 1]) &&
										(o[0] === 6 || o[0] === 2))
								) {
									r = 0;
									continue;
								}
								if (o[0] === 3 && (!i || (o[1] > i[0] && o[1] < i[3]))) {
									r.label = o[1];
									break;
								}
								if (o[0] === 6 && r.label < i[1]) {
									(r.label = i[1]), (i = o);
									break;
								}
								if (i && r.label < i[2]) {
									(r.label = i[2]), r.ops.push(o);
									break;
								}
								i[2] && r.ops.pop(), r.trys.pop();
								continue;
						}
						o = a.call(e, r);
					} catch (l) {
						(o = [6, l]), (n = 0);
					} finally {
						t = i = 0;
					}
				if (o[0] & 5) throw o[1];
				return { value: o[0] ? o[1] : void 0, done: !0 };
			}
		},
	Me =
		(globalThis && globalThis.__rest) ||
		function (e, a) {
			var r = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					a.indexOf(t) < 0 &&
					(r[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					a.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(r[t[n]] = e[t[n]]);
			return r;
		},
	Pe = function (e) {
		var a;
		e === void 0 && (e = {});
		var r = e.disableAuthentication,
			t = e.record,
			n = e.redirect,
			i = e.transform,
			u = e.mutationOptions,
			d = u === void 0 ? {} : u;
		ne({ enabled: !r });
		var c = ae(e),
			o = Te(e),
			l = o.hasEdit,
			v = o.hasShow,
			m = n ?? Ae(v, l),
			C = oe(),
			O = ie(),
			y = se(),
			p = ce(),
			S = (a = t ?? Re(C)) !== null && a !== void 0 ? a : void 0,
			x = d.onSuccess,
			E = d.onError,
			F = d.meta,
			K = Me(d, ['onSuccess', 'onError', 'meta']),
			_ = be(),
			V = _.registerMutationMiddleware,
			L = _.getMutateWithMiddlewares,
			X = _.unregisterMutationMiddleware,
			N = De(c, void 0, K),
			k = N[0],
			H = N[1].isLoading,
			Y = f.useCallback(
				function (j, $) {
					var M = $ === void 0 ? {} : $,
						I = M.onSuccess,
						D = M.onError,
						q = M.transform;
					return Promise.resolve(q ? q(j) : i ? i(j) : j).then(function (te) {
						var re = L(k);
						re(
							c,
							{ data: te, meta: F },
							{
								onSuccess: function (h, U, G) {
									return _e(void 0, void 0, void 0, function () {
										return je(this, function (Qe) {
											return I
												? [2, I(h, U, G)]
												: x
												? [2, x(h, U, G)]
												: (y('ra.notification.created', {
														type: 'info',
														messageArgs: { smart_count: 1 },
												  }),
												  p(m, c, h.id, h),
												  [2]);
										});
									});
								},
								onError:
									D ||
									E ||
									function (h) {
										y(
											typeof h == 'string'
												? h
												: h.message || 'ra.notification.http_error',
											{
												type: 'error',
												messageArgs: {
													_:
														typeof h == 'string'
															? h
															: h && h.message
															? h.message
															: void 0,
												},
											}
										);
									},
							}
						);
					});
				},
				[k, m, L, F, y, E, x, p, c, i]
			),
			Z = le(),
			ee = O('ra.page.create', { name: Z(c, 1) });
		return {
			isFetching: !1,
			isLoading: !1,
			saving: H,
			defaultTitle: ee,
			save: Y,
			resource: c,
			record: S,
			redirect: m,
			registerMutationMiddleware: V,
			unregisterMutationMiddleware: X,
		};
	},
	Re = function (e) {
		var a = e.state,
			r = e.search;
		if (a && a.record) return a.record;
		if (r)
			try {
				var t = xe.parse(r);
				if (t.source) {
					if (Array.isArray(t.source)) {
						console.error(
							"Failed to parse location search parameter '".concat(
								r,
								`'. To pre-fill some fields in the Create form, pass a stringified source parameter (e.g. '?source={"title":"foo"}')`
							)
						);
						return;
					}
					return JSON.parse(t.source);
				}
			} catch {
				console.error(
					"Failed to parse location search parameter '".concat(
						r,
						`'. To pre-fill some fields in the Create form, pass a stringified source parameter (e.g. '?source={"title":"foo"}')`
					)
				);
			}
		return null;
	},
	Ae = function (e, a) {
		return a ? 'edit' : e ? 'show' : 'list';
	},
	A = f.createContext({
		record: null,
		defaultTitle: null,
		isFetching: null,
		isLoading: null,
		redirect: null,
		resource: null,
		save: null,
		saving: null,
		registerMutationMiddleware: null,
		unregisterMutationMiddleware: null,
	});
A.displayName = 'CreateContext';
var T =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(T =
					Object.assign ||
					function (e) {
						for (var a, r = 1, t = arguments.length; r < t; r++) {
							a = arguments[r];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}),
				T.apply(this, arguments)
			);
		},
	Fe = function (e) {
		var a = e.children,
			r = e.value;
		return f.createElement(
			A.Provider,
			{ value: r },
			f.createElement(
				ye,
				{ value: T(T({}, Oe(r)), { mutationMode: 'pessimistic' }) },
				f.createElement(ue, { value: r && r.record }, a)
			)
		);
	},
	Le =
		(globalThis && globalThis.__rest) ||
		function (e, a) {
			var r = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					a.indexOf(t) < 0 &&
					(r[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					a.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(r[t[n]] = e[t[n]]);
			return r;
		},
	Ne = function (e) {
		var a = e.children,
			r = Le(e, ['children']),
			t = Pe(r),
			n = f.createElement(Fe, { value: t }, a);
		return r.resource ? f.createElement(de, { value: r.resource }, n) : n;
	},
	ke = function (e) {
		var a = f.useContext(A);
		return f.useMemo(
			function () {
				return Ce({}, e != null ? $e(e) : {}, a);
			},
			[a, e]
		);
	},
	$e = function (e) {
		var a = e.record,
			r = e.defaultTitle,
			t = e.isFetching,
			n = e.isLoading,
			i = e.redirect,
			u = e.resource,
			d = e.save,
			c = e.saving;
		return {
			record: a,
			defaultTitle: r,
			isFetching: t,
			isLoading: n,
			redirect: i,
			resource: u,
			save: d,
			saving: c,
		};
	},
	g =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(g =
					Object.assign ||
					function (e) {
						for (var a, r = 1, t = arguments.length; r < t; r++) {
							a = arguments[r];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}),
				g.apply(this, arguments)
			);
		},
	Ie =
		(globalThis && globalThis.__rest) ||
		function (e, a) {
			var r = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					a.indexOf(t) < 0 &&
					(r[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					a.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(r[t[n]] = e[t[n]]);
			return r;
		},
	De = function (e, a, r) {
		a === void 0 && (a = {}), r === void 0 && (r = {});
		var t = Se(),
			n = fe(),
			i = f.useRef(a),
			u = Ee(
				function (c) {
					var o = c === void 0 ? {} : c,
						l = o.resource,
						v = l === void 0 ? e : l,
						m = o.data,
						C = m === void 0 ? i.current.data : m,
						O = o.meta,
						y = O === void 0 ? i.current.meta : O;
					return t.create(v, { data: C, meta: y }).then(function (p) {
						var S = p.data;
						return S;
					});
				},
				g(g({}, r), {
					onSuccess: function (c, o, l) {
						o === void 0 && (o = {});
						var v = o.resource,
							m = v === void 0 ? e : v;
						n.setQueryData([m, 'getOne', { id: String(c.id) }], c),
							r.onSuccess && r.onSuccess(c, o, l);
					},
				})
			),
			d = function (c, o, l) {
				c === void 0 && (c = e),
					o === void 0 && (o = {}),
					l === void 0 && (l = {});
				var v = l.returnPromise,
					m = Ie(l, ['returnPromise']);
				if (v) return u.mutateAsync(g({ resource: c }, o), l);
				u.mutate(g({ resource: c }, o), m);
			};
		return [ve(d), u];
	},
	P =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(P =
					Object.assign ||
					function (e) {
						for (var a, r = 1, t = arguments.length; r < t; r++) {
							a = arguments[r];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}),
				P.apply(this, arguments)
			);
		},
	z =
		(globalThis && globalThis.__rest) ||
		function (e, a) {
			var r = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					a.indexOf(t) < 0 &&
					(r[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					a.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(r[t[n]] = e[t[n]]);
			return r;
		},
	B = function (e) {
		var a,
			r = e.actions,
			t = e.aside,
			n = e.children,
			i = e.className,
			u = e.component,
			d = u === void 0 ? ge : u,
			c = e.title,
			o = z(e, [
				'actions',
				'aside',
				'children',
				'className',
				'component',
				'title',
			]),
			l = ke(e),
			v = l.resource,
			m = l.defaultTitle;
		return f.createElement(
			Ue,
			P({ className: Q('create-page', i) }, qe(o)),
			f.createElement(he, {
				title: c,
				defaultTitle: m,
				preferenceKey: ''.concat(v, '.create.title'),
			}),
			r,
			f.createElement(
				'div',
				{ className: Q(b.main, ((a = {}), (a[b.noActions] = !r), a)) },
				f.createElement(d, { className: b.card }, n),
				t
			)
		);
	};
B.propTypes = {
	actions: s.oneOfType([s.element, s.bool]),
	aside: s.element,
	children: s.node,
	className: s.string,
	defaultTitle: s.any,
	hasList: s.bool,
	hasShow: s.bool,
	mutationOptions: s.object,
	record: s.object,
	redirect: s.oneOfType([s.string, s.bool, s.func]),
	resource: s.string,
	save: s.func,
	title: s.node,
};
var qe = function (e) {
		e.addMiddleware,
			e.defaultTitle,
			e.hasCreate,
			e.hasEdit,
			e.hasList,
			e.hasShow,
			e.history,
			e.isFetching,
			e.isLoading,
			e.location,
			e.match,
			e.mutationOptions,
			e.options,
			e.permissions,
			e.save,
			e.saving,
			e.transform,
			e.removeMiddleware;
		var a = z(e, [
			'addMiddleware',
			'defaultTitle',
			'hasCreate',
			'hasEdit',
			'hasList',
			'hasShow',
			'history',
			'isFetching',
			'isLoading',
			'location',
			'match',
			'mutationOptions',
			'options',
			'permissions',
			'save',
			'saving',
			'transform',
			'removeMiddleware',
		]);
		return a;
	},
	w = 'RaCreate',
	b = {
		main: ''.concat(w, '-main'),
		noActions: ''.concat(w, '-noActions'),
		card: ''.concat(w, '-card'),
	},
	Ue = me('div', {
		name: w,
		overridesResolver: function (e, a) {
			return a.root;
		},
	})(function (e) {
		var a,
			r,
			t = e.theme;
		return (
			(a = {}),
			(a['& .'.concat(b.main)] = { display: 'flex' }),
			(a['& .'.concat(b.noActions)] =
				((r = {}), (r[t.breakpoints.up('sm')] = { marginTop: '1em' }), r)),
			(a['& .'.concat(b.card)] = { flex: '1 1 auto' }),
			a
		);
	}),
	R =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(R =
					Object.assign ||
					function (e) {
						for (var a, r = 1, t = arguments.length; r < t; r++) {
							a = arguments[r];
							for (var n in a)
								Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
						}
						return e;
					}),
				R.apply(this, arguments)
			);
		},
	Ge =
		(globalThis && globalThis.__rest) ||
		function (e, a) {
			var r = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					a.indexOf(t) < 0 &&
					(r[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var n = 0, t = Object.getOwnPropertySymbols(e); n < t.length; n++)
					a.indexOf(t[n]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[n]) &&
						(r[t[n]] = e[t[n]]);
			return r;
		},
	J = function (e) {
		pe('Create', ['children'], e);
		var a = e.resource,
			r = e.record,
			t = e.redirect,
			n = e.transform,
			i = e.mutationOptions,
			u = e.disableAuthentication,
			d = e.hasEdit,
			c = e.hasShow,
			o = Ge(e, [
				'resource',
				'record',
				'redirect',
				'transform',
				'mutationOptions',
				'disableAuthentication',
				'hasEdit',
				'hasShow',
			]);
		return f.createElement(
			Ne,
			{
				resource: a,
				record: r,
				redirect: t,
				transform: n,
				mutationOptions: i,
				disableAuthentication: u,
				hasEdit: d,
				hasShow: c,
			},
			f.createElement(B, R({}, o))
		);
	};
J.propTypes = {
	actions: s.oneOfType([s.element, s.bool]),
	aside: s.element,
	children: s.node,
	className: s.string,
	disableAuthentication: s.bool,
	hasEdit: s.bool,
	hasShow: s.bool,
	redirect: s.oneOfType([s.string, s.bool, s.func]),
	resource: s.string,
	title: s.node,
	record: s.object,
	mutationOptions: s.object,
	transform: s.func,
	sx: s.any,
};
function Xe() {
	return W(J, { children: W(we, {}) });
}
export { Xe as default };
