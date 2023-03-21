import {
	o as E,
	q as P,
	t as I,
	a as w,
	v as L,
	w as C,
	r as n,
	L as q,
	j as z,
	p as o,
	s as F,
	B as V,
	c as D,
	an as M,
	ao as X,
	X as g,
	ap as k,
} from './index-091859a0.js';
import { s as x, f as A } from './TextField-aa071d83.js';
var _ = {},
	H = P;
Object.defineProperty(_, '__esModule', { value: !0 });
var R = (_.default = void 0),
	G = H(E()),
	J = I,
	K = (0, G.default)(
		(0, J.jsx)('path', {
			d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
		}),
		'Create'
	);
R = _.default = K;
var y =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(y =
					Object.assign ||
					function (e) {
						for (var t, l = 1, a = arguments.length; l < a; l++) {
							t = arguments[l];
							for (var r in t)
								Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
						}
						return e;
					}),
				y.apply(this, arguments)
			);
		},
	Q =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var l = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(l[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, a = Object.getOwnPropertySymbols(e); r < a.length; r++)
					t.indexOf(a[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[r]) &&
						(l[a[r]] = e[a[r]]);
			return l;
		},
	U = function (e) {
		var t = e.icon,
			l = t === void 0 ? Y : t,
			a = e.label,
			r = a === void 0 ? 'ra.action.edit' : a,
			c = e.scrollToTop,
			v = c === void 0 ? !0 : c,
			m = e.className,
			f = Q(e, ['icon', 'label', 'scrollToTop', 'className']),
			b = w(e),
			u = L(e),
			d = C();
		return u
			? n.createElement(
					ae,
					y(
						{
							component: q,
							to: d({ type: 'edit', resource: b, id: u.id }),
							state: W[String(v)],
							label: r,
							onClick: Z,
							className: z(ee.root, m),
						},
						f
					),
					l
			  )
			: null;
	},
	W = { true: { _scrollToTop: !0 }, false: {} },
	Y = n.createElement(R, null),
	Z = function (e) {
		return e.stopPropagation();
	};
U.propTypes = {
	icon: o.element,
	label: o.string,
	record: o.any,
	scrollToTop: o.bool,
};
var S = 'RaEditButton',
	ee = { root: ''.concat(S, '-root') },
	ae = F(V, {
		name: S,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})({}),
	T = {},
	te = P;
Object.defineProperty(T, '__esModule', { value: !0 });
var $ = (T.default = void 0),
	re = te(E()),
	le = I,
	oe = (0, re.default)(
		(0, le.jsx)('path', {
			d: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
		}),
		'Done'
	);
$ = T.default = oe;
var s =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(s =
					Object.assign ||
					function (e) {
						for (var t, l = 1, a = arguments.length; l < a; l++) {
							t = arguments[l];
							for (var r in t)
								Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
						}
						return e;
					}),
				s.apply(this, arguments)
			);
		},
	ne =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var l = {};
			for (var a in e)
				Object.prototype.hasOwnProperty.call(e, a) &&
					t.indexOf(a) < 0 &&
					(l[a] = e[a]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var r = 0, a = Object.getOwnPropertySymbols(e); r < a.length; r++)
					t.indexOf(a[r]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, a[r]) &&
						(l[a[r]] = e[a[r]]);
			return l;
		},
	B = n.memo(function (e) {
		var t = e.className,
			l = e.emptyText,
			a = e.source,
			r = e.valueLabelTrue,
			c = e.valueLabelFalse,
			v = e.TrueIcon,
			m = v === void 0 ? $ : v,
			f = e.FalseIcon,
			b = f === void 0 ? k : f,
			u = e.looseValue,
			d = u === void 0 ? !1 : u,
			h = ne(e, [
				'className',
				'emptyText',
				'source',
				'valueLabelTrue',
				'valueLabelFalse',
				'TrueIcon',
				'FalseIcon',
				'looseValue',
			]),
			N = L(e),
			O = D(),
			i = M(N, a),
			j = i === !0 || (d && i),
			p = i ? r : c;
		return (
			p || (p = j ? 'ra.boolean.true' : 'ra.boolean.false'),
			d || i === !1 || i === !0
				? n.createElement(
						ue,
						s({ component: 'span', variant: 'body2', className: t }, x(h)),
						n.createElement(
							X,
							{ title: O(p, { _: p }) },
							j
								? n.createElement(m, {
										'data-testid': 'true',
										fontSize: 'small',
								  })
								: n.createElement(b, {
										'data-testid': 'false',
										fontSize: 'small',
								  })
						)
				  )
				: n.createElement(
						g,
						s({ component: 'span', variant: 'body2', className: t }, x(h)),
						l && O(l, { _: l })
				  )
		);
	});
B.propTypes = s(s(s({}, g.propTypes), A), {
	valueLabelFalse: o.string,
	valueLabelTrue: o.string,
	TrueIcon: o.elementType,
	FalseIcon: o.elementType,
	looseValue: o.bool,
});
B.displayName = 'BooleanField';
var se = 'RaBooleanField',
	ue = F(g, {
		name: se,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})({ display: 'inline-flex', verticalAlign: 'middle', lineHeight: 0 });
export { B, U as E };
