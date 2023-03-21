import {
	u as V,
	a as X,
	c as k,
	d as z,
	e as K,
	l as M,
	m as Q,
	f as Y,
	r as i,
	R as H,
	g as J,
	v as Z,
	p as a,
	j as L,
	T as ee,
	s as te,
	C as A,
	k as l,
	Y as F,
	x as re,
	X as ne,
} from './index-091859a0.js';
import { T as oe } from './TopToolbar-a353fcbf.js';
import { E as ae, B as ie } from './BooleanField-c8474065.js';
import { d as se, u as N } from './useResourceDefinition-e2399b95.js';
import { u as le } from './useGetRecordRepresentation-8eb64aa5.js';
import { u as ce } from './useGetOne-98a655b9.js';
import { T as E } from './TextField-aa071d83.js';
var R =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(R =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				R.apply(this, arguments)
			);
		},
	ue =
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
	de = function (e) {
		e === void 0 && (e = {});
		var r = e.disableAuthentication,
			o = e.id,
			t = e.queryOptions,
			n = t === void 0 ? {} : t;
		V({ enabled: !r });
		var s = X(e),
			h = le(s),
			p = k(),
			v = z(),
			b = K(),
			O = M(),
			T = Q().id,
			u = o ?? decodeURIComponent(T),
			w = n.meta,
			x = ue(n, ['meta']),
			d = ce(
				s,
				{ id: u, meta: w },
				R(
					{
						onError: function () {
							v('ra.notification.item_doesnt_exist', { type: 'error' }),
								b('list', s),
								O();
						},
						retry: !1,
					},
					x
				)
			),
			c = d.data,
			m = d.error,
			$ = d.isLoading,
			B = d.isFetching,
			G = d.refetch;
		if (c && c.id && c.id != u)
			throw new Error(
				"useShowController: Fetched record's id attribute ("
					.concat(c.id, ") must match the requested 'id' (")
					.concat(u, ')')
			);
		var D = Y(),
			C = h(c),
			U = p('ra.page.show', {
				name: D(s, 1),
				id: u,
				record: c,
				recordRepresentation: typeof C == 'string' ? C : '',
			});
		return {
			defaultTitle: U,
			error: m,
			isLoading: $,
			isFetching: B,
			record: c,
			refetch: G,
			resource: s,
		};
	},
	S = i.createContext({
		record: null,
		defaultTitle: null,
		isFetching: null,
		isLoading: null,
		refetch: null,
		resource: null,
	});
S.displayName = 'ShowContext';
var he = function (e) {
		var r = e.children,
			o = e.value;
		return i.createElement(
			S.Provider,
			{ value: o },
			i.createElement(H, { value: o && o.record }, r)
		);
	},
	fe =
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
	me = function (e) {
		var r = e.children,
			o = fe(e, ['children']),
			t = de(o),
			n = i.createElement(he, { value: t }, r);
		return o.resource ? i.createElement(J, { value: o.resource }, n) : n;
	},
	ve = function (e) {
		var r = i.useContext(S);
		return i.useMemo(
			function () {
				return se({}, e != null ? ge(e) : {}, r);
			},
			[r, e]
		);
	},
	ge = function (e) {
		var r = e.record,
			o = e.data,
			t = e.defaultTitle,
			n = e.isFetching,
			s = e.isLoading,
			h = e.resource;
		return {
			record: r || o,
			data: r || o,
			defaultTitle: t,
			isFetching: n,
			isLoading: s,
			resource: h,
		};
	},
	_ = function (e) {
		var r = Z(e),
			o = N().hasEdit;
		return o
			? i.createElement(
					oe,
					{ className: e.className },
					i.createElement(ae, { record: r })
			  )
			: null;
	};
_.propTypes = { className: a.string, record: a.any };
var j =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(j =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				j.apply(this, arguments)
			);
		},
	I =
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
	ye = i.createElement(_, null),
	q = function (e) {
		var r,
			o = e.actions,
			t = e.aside,
			n = e.children,
			s = e.className,
			h = e.component,
			p = h === void 0 ? A : h,
			v = e.emptyWhileLoading,
			b = v === void 0 ? !1 : v,
			O = e.title,
			T = I(e, [
				'actions',
				'aside',
				'children',
				'className',
				'component',
				'emptyWhileLoading',
				'title',
			]),
			u = ve(e),
			w = u.resource,
			x = u.defaultTitle,
			d = u.record,
			c = N(e).hasEdit,
			m = typeof o > 'u' && c ? ye : o;
		return !n || (!d && b)
			? null
			: i.createElement(
					be,
					j({ className: L('show-page', s) }, pe(T)),
					i.createElement(ee, {
						title: O,
						defaultTitle: x,
						preferenceKey: ''.concat(w, '.show.title'),
					}),
					m !== !1 && m,
					i.createElement(
						'div',
						{ className: L(f.main, ((r = {}), (r[f.noActions] = !m), r)) },
						i.createElement(p, { className: f.card }, n),
						t
					)
			  );
	};
q.propTypes = {
	actions: a.oneOfType([a.element, a.bool]),
	children: a.node,
	className: a.string,
	emptyWhileLoading: a.bool,
	title: a.any,
};
var pe = function (e) {
		e.defaultTitle,
			e.hasCreate,
			e.hasEdit,
			e.hasList,
			e.hasShow,
			e.history,
			e.id,
			e.isLoading,
			e.isFetching,
			e.location,
			e.match,
			e.options,
			e.refetch,
			e.permissions;
		var r = I(e, [
			'defaultTitle',
			'hasCreate',
			'hasEdit',
			'hasList',
			'hasShow',
			'history',
			'id',
			'isLoading',
			'isFetching',
			'location',
			'match',
			'options',
			'refetch',
			'permissions',
		]);
		return r;
	},
	y = 'RaShow',
	f = {
		main: ''.concat(y, '-main'),
		noActions: ''.concat(y, '-noActions'),
		card: ''.concat(y, '-card'),
	},
	be = te('div', {
		name: y,
		overridesResolver: function (e, r) {
			return r.root;
		},
	})(function (e) {
		var r;
		return (
			e.theme,
			(r = {}),
			(r['& .'.concat(f.main)] = { display: 'flex' }),
			(r['& .'.concat(f.noActions)] = { marginTop: '1em' }),
			(r['& .'.concat(f.card)] = { flex: '1 1 auto' }),
			r
		);
	}),
	P =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(P =
					Object.assign ||
					function (e) {
						for (var r, o = 1, t = arguments.length; o < t; o++) {
							r = arguments[o];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				P.apply(this, arguments)
			);
		},
	Oe =
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
	W = function (e) {
		var r = e.id,
			o = e.resource,
			t = e.queryOptions,
			n = e.disableAuthentication,
			s = Oe(e, ['id', 'resource', 'queryOptions', 'disableAuthentication']);
		return i.createElement(
			me,
			{ id: r, disableAuthentication: n, queryOptions: t, resource: o },
			i.createElement(q, P({}, s))
		);
	};
W.propTypes = {
	actions: a.oneOfType([a.element, a.bool]),
	children: a.node.isRequired,
	className: a.string,
	disableAuthentication: a.bool,
	emptyWhileLoading: a.bool,
	component: a.elementType,
	resource: a.string,
	title: a.node,
	sx: a.any,
};
const g = ({ label: e, children: r }) =>
	F(ne, { fontWeight: 'bold', children: [e, ': ', r] });
function Se() {
	return l(W, {
		children: l(A, {
			children: F(re, {
				sx: { display: 'flex', flexDirection: 'column' },
				children: [
					l(g, {
						label: 'Id',
						children: l(E, { variant: 'h6', source: 'id' }),
					}),
					l(g, {
						label: 'Name',
						children: l(E, { variant: 'h6', source: 'name' }),
					}),
					l(g, {
						label: 'Password',
						children: l(E, { variant: 'h6', source: 'password' }),
					}),
					l(g, {
						label: 'Admin Rights',
						children: l(ie, { source: 'adminRights', label: 'Admin Rights' }),
					}),
				],
			}),
		}),
	});
}
export { Se as default };
