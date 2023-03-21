import {
	h as Ye,
	r as C,
	aq as Ue,
	am as We,
	N as De,
	P as ke,
	ar as le,
	s as A,
	Q as L,
	_ as R,
	as as fe,
	U as Se,
	K as we,
	at as Qe,
	Y as Le,
	k as E,
	j as de,
	M as Re,
	$ as Je,
	a0 as Xe,
	au as ye,
	Z as Ke,
	X as Z,
	av as Ze,
	aw as Ge,
	ax as er,
	p as v,
	v as je,
	L as rr,
	o as tr,
	q as nr,
	t as ar,
	an as or,
	c as Ne,
	w as ir,
	g as sr,
	R as be,
	ay as ur,
	az as cr,
} from './index-091859a0.js';
import { s as lr, f as ae, T as $e } from './TextField-aa071d83.js';
import { u as fr, L as dr, D as hr } from './List-c33e34eb.js';
import { a as mr, u as vr } from './useResourceDefinition-e2399b95.js';
import { u as gr } from './useGetRecordRepresentation-8eb64aa5.js';
import './Confirm-edcfa802.js';
import './TopToolbar-a353fcbf.js';
import './index-fa9b5ce0.js';
var oe =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(oe =
					Object.assign ||
					function (e) {
						for (var r, n = 1, t = arguments.length; n < t; n++) {
							r = arguments[n];
							for (var a in r)
								Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
						}
						return e;
					}),
				oe.apply(this, arguments)
			);
		},
	pr =
		(globalThis && globalThis.__spreadArray) ||
		function (e, r, n) {
			if (n || arguments.length === 2)
				for (var t = 0, a = r.length, u; t < a; t++)
					(u || !(t in r)) &&
						(u || (u = Array.prototype.slice.call(r, 0, t)), (u[t] = r[t]));
			return e.concat(u || Array.prototype.slice.call(r));
		},
	yr = function (e, r, n) {
		n === void 0 && (n = {});
		var t = mr(),
			a = Ye(),
			u = a.getQueryCache(),
			c = r.ids,
			p = r.meta,
			y = C.useMemo(
				function () {
					var b = (Array.isArray(c) ? c : [c]).map(function (_) {
						var $,
							D,
							l = Ue([e, 'getOne', { id: String(_), meta: p }]);
						return (D =
							($ = u.get(l)) === null || $ === void 0 ? void 0 : $.state) ===
							null || D === void 0
							? void 0
							: D.data;
					});
					if (
						!b.some(function (_) {
							return _ === void 0;
						})
					)
						return b;
				},
				[c, u, e, p]
			);
		return We(
			[
				e,
				'getMany',
				{
					ids: (Array.isArray(c) ? c : [c]).map(function (b) {
						return String(b);
					}),
					meta: p,
				},
			],
			function () {
				return new Promise(function (b, _) {
					return !c || c.length === 0
						? b([])
						: $r({
								resource: e,
								ids: c,
								meta: p,
								resolve: b,
								reject: _,
								dataProvider: t,
								queryClient: a,
						  });
				});
			},
			oe(
				{
					placeholderData: y,
					onSuccess: function (b) {
						(b ?? []).forEach(function (_) {
							a.setQueryData(
								[e, 'getOne', { id: String(_.id), meta: p }],
								function ($) {
									return $ ?? _;
								}
							);
						});
					},
					retry: !1,
				},
				n
			)
		);
	},
	br = function (e) {
		var r = [],
			n = null;
		return function (t) {
			r.push(t),
				n && clearTimeout(n),
				(n = setTimeout(function () {
					(n = null), e(pr([], r, !0)), (r = []);
				}, 0));
		};
	},
	$r = br(function (e) {
		var r = e[0].dataProvider,
			n = e[0].queryClient,
			t = e.reduce(function (a, u) {
				return a[u.resource] || (a[u.resource] = []), a[u.resource].push(u), a;
			}, {});
		Object.keys(t).forEach(function (a) {
			var u = t[a],
				c = u
					.reduce(function (l, g) {
						var P = g.ids;
						return fr(l, P);
					}, [])
					.filter(function (l) {
						return l != null && l !== '';
					}),
				p = u.reduce(function (l, g) {
					var P = g.meta;
					return P || l;
				}, void 0);
			if (c.length === 0) {
				u.forEach(function (l) {
					var g = l.resolve;
					g([]);
				});
				return;
			}
			var y = u.find(function (l) {
				var g = l.ids;
				return JSON.stringify(g) === JSON.stringify(c);
			});
			if (y) {
				var b = y.dataProvider,
					_ = y.resource,
					$ = y.ids,
					D = y.meta;
				b.getMany(_, { ids: $, meta: D })
					.then(function (l) {
						var g = l.data;
						return g;
					})
					.then(
						function (l) {
							u.forEach(function (g) {
								var P = g.ids,
									q = g.resolve;
								q(
									l.filter(function (B) {
										return P.map(function (z) {
											return String(z);
										}).includes(String(B.id));
									})
								);
							});
						},
						function (l) {
							u.forEach(function (g) {
								var P = g.reject;
								P(l);
							});
						}
					);
				return;
			}
			n.fetchQuery(
				[
					a,
					'getMany',
					{
						ids: c.map(function (l) {
							return String(l);
						}),
						meta: p,
					},
				],
				function () {
					return r.getMany(a, { ids: c, meta: p }).then(function (l) {
						var g = l.data;
						return g;
					});
				}
			)
				.then(function (l) {
					u.forEach(function (g) {
						var P = g.ids,
							q = g.resolve;
						q(
							l.filter(function (B) {
								return P.map(function (z) {
									return String(z);
								}).includes(String(B.id));
							})
						);
					});
				})
				.catch(function (l) {
					return u.forEach(function (g) {
						var P = g.reject;
						return P(l);
					});
				});
		});
	}),
	Or =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var a = 0, t = Object.getOwnPropertySymbols(e); a < t.length; a++)
					r.indexOf(t[a]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[a]) &&
						(n[t[a]] = e[t[a]]);
			return n;
		},
	_r = function (e) {
		var r = e.reference,
			n = e.id,
			t = e.options,
			a = t === void 0 ? {} : t,
			u = a.meta,
			c = Or(a, ['meta']),
			p = yr(r, { ids: [n], meta: u }, c),
			y = p.data,
			b = p.error,
			_ = p.isLoading,
			$ = p.isFetching,
			D = p.refetch;
		return {
			referenceRecord: b ? void 0 : y ? y[0] : void 0,
			refetch: D,
			error: b,
			isLoading: _,
			isFetching: $,
		};
	};
function Tr(e) {
	return De('MuiLinearProgress', e);
}
ke('MuiLinearProgress', [
	'root',
	'colorPrimary',
	'colorSecondary',
	'determinate',
	'indeterminate',
	'buffer',
	'query',
	'dashed',
	'dashedColorPrimary',
	'dashedColorSecondary',
	'bar',
	'barColorPrimary',
	'barColorSecondary',
	'bar1Indeterminate',
	'bar1Determinate',
	'bar1Buffer',
	'bar2Indeterminate',
	'bar2Buffer',
]);
const Pr = ['className', 'color', 'value', 'valueBuffer', 'variant'];
let J = (e) => e,
	Oe,
	_e,
	Te,
	Pe,
	Me,
	xe;
const ie = 4,
	Mr = le(
		Oe ||
			(Oe = J`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`)
	),
	xr = le(
		_e ||
			(_e = J`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`)
	),
	Cr = le(
		Te ||
			(Te = J`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`)
	),
	Dr = (e) => {
		const { classes: r, variant: n, color: t } = e,
			a = {
				root: ['root', `color${L(t)}`, n],
				dashed: ['dashed', `dashedColor${L(t)}`],
				bar1: [
					'bar',
					`barColor${L(t)}`,
					(n === 'indeterminate' || n === 'query') && 'bar1Indeterminate',
					n === 'determinate' && 'bar1Determinate',
					n === 'buffer' && 'bar1Buffer',
				],
				bar2: [
					'bar',
					n !== 'buffer' && `barColor${L(t)}`,
					n === 'buffer' && `color${L(t)}`,
					(n === 'indeterminate' || n === 'query') && 'bar2Indeterminate',
					n === 'buffer' && 'bar2Buffer',
				],
			};
		return Re(a, Tr, r);
	},
	he = (e, r) =>
		r === 'inherit'
			? 'currentColor'
			: e.vars
			? e.vars.palette.LinearProgress[`${r}Bg`]
			: e.palette.mode === 'light'
			? Je(e.palette[r].main, 0.62)
			: Xe(e.palette[r].main, 0.5),
	kr = A('span', {
		name: 'MuiLinearProgress',
		slot: 'Root',
		overridesResolver: (e, r) => {
			const { ownerState: n } = e;
			return [r.root, r[`color${L(n.color)}`], r[n.variant]];
		},
	})(({ ownerState: e, theme: r }) =>
		R(
			{
				position: 'relative',
				overflow: 'hidden',
				display: 'block',
				height: 4,
				zIndex: 0,
				'@media print': { colorAdjust: 'exact' },
				backgroundColor: he(r, e.color),
			},
			e.color === 'inherit' &&
				e.variant !== 'buffer' && {
					backgroundColor: 'none',
					'&::before': {
						content: '""',
						position: 'absolute',
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'currentColor',
						opacity: 0.3,
					},
				},
			e.variant === 'buffer' && { backgroundColor: 'transparent' },
			e.variant === 'query' && { transform: 'rotate(180deg)' }
		)
	),
	Sr = A('span', {
		name: 'MuiLinearProgress',
		slot: 'Dashed',
		overridesResolver: (e, r) => {
			const { ownerState: n } = e;
			return [r.dashed, r[`dashedColor${L(n.color)}`]];
		},
	})(
		({ ownerState: e, theme: r }) => {
			const n = he(r, e.color);
			return R(
				{ position: 'absolute', marginTop: 0, height: '100%', width: '100%' },
				e.color === 'inherit' && { opacity: 0.3 },
				{
					backgroundImage: `radial-gradient(${n} 0%, ${n} 16%, transparent 42%)`,
					backgroundSize: '10px 10px',
					backgroundPosition: '0 -23px',
				}
			);
		},
		fe(
			Pe ||
				(Pe = J`
    animation: ${0} 3s infinite linear;
  `),
			Cr
		)
	),
	wr = A('span', {
		name: 'MuiLinearProgress',
		slot: 'Bar1',
		overridesResolver: (e, r) => {
			const { ownerState: n } = e;
			return [
				r.bar,
				r[`barColor${L(n.color)}`],
				(n.variant === 'indeterminate' || n.variant === 'query') &&
					r.bar1Indeterminate,
				n.variant === 'determinate' && r.bar1Determinate,
				n.variant === 'buffer' && r.bar1Buffer,
			];
		},
	})(
		({ ownerState: e, theme: r }) =>
			R(
				{
					width: '100%',
					position: 'absolute',
					left: 0,
					bottom: 0,
					top: 0,
					transition: 'transform 0.2s linear',
					transformOrigin: 'left',
					backgroundColor:
						e.color === 'inherit'
							? 'currentColor'
							: (r.vars || r).palette[e.color].main,
				},
				e.variant === 'determinate' && {
					transition: `transform .${ie}s linear`,
				},
				e.variant === 'buffer' && {
					zIndex: 1,
					transition: `transform .${ie}s linear`,
				}
			),
		({ ownerState: e }) =>
			(e.variant === 'indeterminate' || e.variant === 'query') &&
			fe(
				Me ||
					(Me = J`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `),
				Mr
			)
	),
	Lr = A('span', {
		name: 'MuiLinearProgress',
		slot: 'Bar2',
		overridesResolver: (e, r) => {
			const { ownerState: n } = e;
			return [
				r.bar,
				r[`barColor${L(n.color)}`],
				(n.variant === 'indeterminate' || n.variant === 'query') &&
					r.bar2Indeterminate,
				n.variant === 'buffer' && r.bar2Buffer,
			];
		},
	})(
		({ ownerState: e, theme: r }) =>
			R(
				{
					width: '100%',
					position: 'absolute',
					left: 0,
					bottom: 0,
					top: 0,
					transition: 'transform 0.2s linear',
					transformOrigin: 'left',
				},
				e.variant !== 'buffer' && {
					backgroundColor:
						e.color === 'inherit'
							? 'currentColor'
							: (r.vars || r).palette[e.color].main,
				},
				e.color === 'inherit' && { opacity: 0.3 },
				e.variant === 'buffer' && {
					backgroundColor: he(r, e.color),
					transition: `transform .${ie}s linear`,
				}
			),
		({ ownerState: e }) =>
			(e.variant === 'indeterminate' || e.variant === 'query') &&
			fe(
				xe ||
					(xe = J`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `),
				xr
			)
	),
	Rr = C.forwardRef(function (r, n) {
		const t = Se({ props: r, name: 'MuiLinearProgress' }),
			{
				className: a,
				color: u = 'primary',
				value: c,
				valueBuffer: p,
				variant: y = 'indeterminate',
			} = t,
			b = we(t, Pr),
			_ = R({}, t, { color: u, variant: y }),
			$ = Dr(_),
			D = Qe(),
			l = {},
			g = { bar1: {}, bar2: {} };
		if ((y === 'determinate' || y === 'buffer') && c !== void 0) {
			(l['aria-valuenow'] = Math.round(c)),
				(l['aria-valuemin'] = 0),
				(l['aria-valuemax'] = 100);
			let P = c - 100;
			D.direction === 'rtl' && (P = -P),
				(g.bar1.transform = `translateX(${P}%)`);
		}
		if (y === 'buffer' && p !== void 0) {
			let P = (p || 0) - 100;
			D.direction === 'rtl' && (P = -P),
				(g.bar2.transform = `translateX(${P}%)`);
		}
		return Le(
			kr,
			R(
				{ className: de($.root, a), ownerState: _, role: 'progressbar' },
				l,
				{ ref: n },
				b,
				{
					children: [
						y === 'buffer'
							? E(Sr, { className: $.dashed, ownerState: _ })
							: null,
						E(wr, { className: $.bar1, ownerState: _, style: g.bar1 }),
						y === 'determinate'
							? null
							: E(Lr, { className: $.bar2, ownerState: _, style: g.bar2 }),
					],
				}
			)
		);
	}),
	jr = Rr;
function Nr(e) {
	return De('MuiLink', e);
}
const Er = ke('MuiLink', [
		'root',
		'underlineNone',
		'underlineHover',
		'underlineAlways',
		'button',
		'focusVisible',
	]),
	Fr = Er,
	Ee = {
		primary: 'primary.main',
		textPrimary: 'text.primary',
		secondary: 'secondary.main',
		textSecondary: 'text.secondary',
		error: 'error.main',
	},
	Ir = (e) => Ee[e] || e,
	Ar = ({ theme: e, ownerState: r }) => {
		const n = Ir(r.color),
			t = ye(e, `palette.${n}`, !1) || r.color,
			a = ye(e, `palette.${n}Channel`);
		return 'vars' in e && a ? `rgba(${a} / 0.4)` : Ke(t, 0.4);
	},
	qr = Ar,
	Br = [
		'className',
		'color',
		'component',
		'onBlur',
		'onFocus',
		'TypographyClasses',
		'underline',
		'variant',
		'sx',
	],
	zr = (e) => {
		const { classes: r, component: n, focusVisible: t, underline: a } = e,
			u = {
				root: [
					'root',
					`underline${L(a)}`,
					n === 'button' && 'button',
					t && 'focusVisible',
				],
			};
		return Re(u, Nr, r);
	},
	Hr = A(Z, {
		name: 'MuiLink',
		slot: 'Root',
		overridesResolver: (e, r) => {
			const { ownerState: n } = e;
			return [
				r.root,
				r[`underline${L(n.underline)}`],
				n.component === 'button' && r.button,
			];
		},
	})(({ theme: e, ownerState: r }) =>
		R(
			{},
			r.underline === 'none' && { textDecoration: 'none' },
			r.underline === 'hover' && {
				textDecoration: 'none',
				'&:hover': { textDecoration: 'underline' },
			},
			r.underline === 'always' &&
				R(
					{ textDecoration: 'underline' },
					r.color !== 'inherit' && {
						textDecorationColor: qr({ theme: e, ownerState: r }),
					},
					{ '&:hover': { textDecorationColor: 'inherit' } }
				),
			r.component === 'button' && {
				position: 'relative',
				WebkitTapHighlightColor: 'transparent',
				backgroundColor: 'transparent',
				outline: 0,
				border: 0,
				margin: 0,
				borderRadius: 0,
				padding: 0,
				cursor: 'pointer',
				userSelect: 'none',
				verticalAlign: 'middle',
				MozAppearance: 'none',
				WebkitAppearance: 'none',
				'&::-moz-focus-inner': { borderStyle: 'none' },
				[`&.${Fr.focusVisible}`]: { outline: 'auto' },
			}
		)
	),
	Vr = C.forwardRef(function (r, n) {
		const t = Se({ props: r, name: 'MuiLink' }),
			{
				className: a,
				color: u = 'primary',
				component: c = 'a',
				onBlur: p,
				onFocus: y,
				TypographyClasses: b,
				underline: _ = 'always',
				variant: $ = 'inherit',
				sx: D,
			} = t,
			l = we(t, Br),
			{ isFocusVisibleRef: g, onBlur: P, onFocus: q, ref: B } = Ze(),
			[z, V] = C.useState(!1),
			te = Ge(n, B),
			H = (M) => {
				P(M), g.current === !1 && V(!1), p && p(M);
			},
			j = (M) => {
				q(M), g.current === !0 && V(!0), y && y(M);
			},
			Y = R({}, t, {
				color: u,
				component: c,
				focusVisible: z,
				underline: _,
				variant: $,
			}),
			U = zr(Y);
		return E(
			Hr,
			R(
				{
					color: u,
					className: de(U.root, a),
					classes: b,
					component: c,
					onBlur: H,
					onFocus: j,
					ref: te,
					ownerState: Y,
					variant: $,
					sx: [
						...(Object.keys(Ee).includes(u) ? [] : [{ color: u }]),
						...(Array.isArray(D) ? D : [D]),
					],
				},
				l
			)
		);
	}),
	Yr = Vr;
var se =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(se =
					Object.assign ||
					function (e) {
						for (var r, n = 1, t = arguments.length; n < t; n++) {
							r = arguments[n];
							for (var a in r)
								Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
						}
						return e;
					}),
				se.apply(this, arguments)
			);
		},
	Ce =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var a = 0, t = Object.getOwnPropertySymbols(e); a < t.length; a++)
					r.indexOf(t[a]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[a]) &&
						(n[t[a]] = e[t[a]]);
			return n;
		},
	me = function (e) {
		var r = e.timeout,
			n = r === void 0 ? 1e3 : r,
			t = Ce(e, ['timeout']),
			a = t.className,
			u = Ce(t, ['className']),
			c = er(n);
		return c ? C.createElement(Wr, se({ className: a }, u)) : null;
	};
me.propTypes = { className: v.string, timeout: v.number };
me.displayName = 'LinearProgress';
var Ur = 'RaLinearProgress',
	Wr = A(jr, {
		name: Ur,
		overridesResolver: function (e, r) {
			return r.root;
		},
	})(function (e) {
		var r = e.theme;
		return { margin: ''.concat(r.spacing(1), ' 0'), width: r.spacing(20) };
	}),
	Q =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Q =
					Object.assign ||
					function (e) {
						for (var r, n = 1, t = arguments.length; n < t; n++) {
							r = arguments[n];
							for (var a in r)
								Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
						}
						return e;
					}),
				Q.apply(this, arguments)
			);
		},
	Qr =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var a = 0, t = Object.getOwnPropertySymbols(e); a < t.length; a++)
					r.indexOf(t[a]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[a]) &&
						(n[t[a]] = e[t[a]]);
			return n;
		},
	Fe = function (e) {
		var r = e.className,
			n = e.source,
			t = n === void 0 ? '' : n,
			a = e.render,
			u = Qr(e, ['className', 'source', 'render']),
			c = je(e);
		return C.useMemo(
			function () {
				return c
					? C.createElement(
							Z,
							Q({ component: 'span', variant: 'body2', className: r }, lr(u)),
							a(c, t)
					  )
					: null;
			},
			[r, c, t, a, u]
		);
	};
Fe.propTypes = Q(Q(Q({}, Z.propTypes), ae), { render: v.func.isRequired });
var ue =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(ue =
					Object.assign ||
					function (e) {
						for (var r, n = 1, t = arguments.length; n < t; n++) {
							r = arguments[n];
							for (var a in r)
								Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
						}
						return e;
					}),
				ue.apply(this, arguments)
			);
		},
	Jr =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var a = 0, t = Object.getOwnPropertySymbols(e); a < t.length; a++)
					r.indexOf(t[a]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[a]) &&
						(n[t[a]] = e[t[a]]);
			return n;
		},
	Ie = function (e) {
		var r = e.to,
			n = e.children,
			t = e.className,
			a = Jr(e, ['to', 'children', 'className']);
		return C.createElement(
			Kr,
			ue({ component: rr, to: r, className: de(Ae.link, t) }, a),
			n
		);
	},
	Xr = 'RaLink',
	Ae = { link: ''.concat(Xr, '-link') },
	Kr = A(Yr)(function (e) {
		var r;
		return (
			e.theme,
			(r = {}),
			(r['&.'.concat(Ae.link)] = { textDecoration: 'none' }),
			r
		);
	});
Ie.propTypes = {
	className: v.string,
	children: v.node,
	to: v.oneOfType([v.string, v.object]),
};
var ve = {},
	Zr = nr;
Object.defineProperty(ve, '__esModule', { value: !0 });
var qe = (ve.default = void 0),
	Gr = Zr(tr()),
	et = ar,
	rt = (0, Gr.default)(
		(0, et.jsx)('path', {
			d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
		}),
		'Error'
	);
qe = ve.default = rt;
var re =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(re =
					Object.assign ||
					function (e) {
						for (var r, n = 1, t = arguments.length; n < t; n++) {
							r = arguments[n];
							for (var a in r)
								Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
						}
						return e;
					}),
				re.apply(this, arguments)
			);
		},
	Be =
		(globalThis && globalThis.__rest) ||
		function (e, r) {
			var n = {};
			for (var t in e)
				Object.prototype.hasOwnProperty.call(e, t) &&
					r.indexOf(t) < 0 &&
					(n[t] = e[t]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var a = 0, t = Object.getOwnPropertySymbols(e); a < t.length; a++)
					r.indexOf(t[a]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, t[a]) &&
						(n[t[a]] = e[t[a]]);
			return n;
		},
	ge = function (e) {
		var r = e.source,
			n = e.emptyText,
			t = Be(e, ['source', 'emptyText']),
			a = je(e),
			u = or(a, r),
			c = Ne();
		return u == null
			? n
				? C.createElement(
						Z,
						{ component: 'span', variant: 'body2' },
						n && c(n, { _: n })
				  )
				: null
			: C.createElement(tt, re({}, t, { emptyText: n, record: a, id: u }));
	};
ge.propTypes = {
	children: v.node,
	className: v.string,
	cellClassName: v.string,
	headerClassName: v.string,
	label: ae.label,
	record: v.any,
	reference: v.string.isRequired,
	resource: v.string,
	sortBy: v.string,
	sortByOrder: ae.sortByOrder,
	source: v.string.isRequired,
	translateChoice: v.oneOfType([v.func, v.bool]),
	link: v.oneOfType([v.string, v.bool, v.func]).isRequired,
};
ge.defaultProps = { link: 'edit' };
var tt = function (e) {
		var r = e.children,
			n = e.id,
			t = e.record,
			a = e.reference,
			u = e.link,
			c = Be(e, ['children', 'id', 'record', 'reference', 'link']),
			p = ir(),
			y = vr({ resource: a }),
			b =
				u === !1 || (u === 'edit' && !y.hasEdit) || (u === 'show' && !y.hasShow)
					? !1
					: p({
							resource: a,
							id: n,
							type: typeof u == 'function' ? u(t, a) : u,
					  });
		return C.createElement(
			sr,
			{ value: a },
			C.createElement(
				at,
				re({ reference: a }, c, _r({ reference: a, id: n }), {
					resourceLinkPath: b,
				}),
				r
			)
		);
	},
	nt = function (e) {
		return e.stopPropagation();
	},
	ze = function (e) {
		var r = e.children,
			n = e.className,
			t = e.emptyText,
			a = e.error,
			u = e.isLoading,
			c = e.reference,
			p = e.referenceRecord,
			y = e.resourceLinkPath,
			b = e.sx,
			_ = gr(c),
			$ = Ne();
		if (a)
			return C.createElement(qe, {
				'aria-errormessage': a.message ? a.message : a,
				role: 'presentation',
				color: 'error',
				fontSize: 'small',
			});
		if (u) return C.createElement(me, null);
		if (!p)
			return t ? C.createElement(C.Fragment, null, t && $(t, { _: t })) : null;
		var D =
			r || C.createElement(Z, { component: 'span', variant: 'body2' }, _(p));
		return y
			? C.createElement(
					ot,
					{ className: n, sx: b },
					C.createElement(
						be,
						{ value: p },
						C.createElement(Ie, { to: y, className: Ve.link, onClick: nt }, D)
					)
			  )
			: C.createElement(be, { value: p }, D);
	};
ze.propTypes = {
	children: v.element,
	className: v.string,
	isLoading: v.bool,
	record: v.any,
	reference: v.string,
	referenceRecord: v.any,
	resource: v.string,
	resourceLinkPath: v.oneOfType([v.string, v.oneOf([!1])]),
	source: v.string,
	translateChoice: v.oneOfType([v.func, v.bool]),
};
var at = C.memo(ze),
	He = 'RaReferenceField',
	Ve = { link: ''.concat(He, '-link') },
	ot = A('span', {
		name: He,
		overridesResolver: function (e, r) {
			return r.root;
		},
	})(function (e) {
		var r,
			n = e.theme;
		return (
			(r = {}),
			(r['& .'.concat(Ve.link)] = {
				'& > *': { color: n.palette.primary.main },
			}),
			r
		);
	}),
	ce = {},
	it = {
		get exports() {
			return ce;
		},
		set exports(e) {
			ce = e;
		},
	};
(function (e, r) {
	(function (n, t) {
		e.exports = t();
	})(ur, function () {
		var n = 1e3,
			t = 6e4,
			a = 36e5,
			u = 'millisecond',
			c = 'second',
			p = 'minute',
			y = 'hour',
			b = 'day',
			_ = 'week',
			$ = 'month',
			D = 'quarter',
			l = 'year',
			g = 'date',
			P = 'Invalid Date',
			q =
				/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
			B =
				/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
			z = {
				name: 'en',
				weekdays:
					'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
				months:
					'January_February_March_April_May_June_July_August_September_October_November_December'.split(
						'_'
					),
				ordinal: function (f) {
					var s = ['th', 'st', 'nd', 'rd'],
						o = f % 100;
					return '[' + f + (s[(o - 20) % 10] || s[o] || s[0]) + ']';
				},
			},
			V = function (f, s, o) {
				var d = String(f);
				return !d || d.length >= s
					? f
					: '' + Array(s + 1 - d.length).join(o) + f;
			},
			te = {
				s: V,
				z: function (f) {
					var s = -f.utcOffset(),
						o = Math.abs(s),
						d = Math.floor(o / 60),
						i = o % 60;
					return (s <= 0 ? '+' : '-') + V(d, 2, '0') + ':' + V(i, 2, '0');
				},
				m: function f(s, o) {
					if (s.date() < o.date()) return -f(o, s);
					var d = 12 * (o.year() - s.year()) + (o.month() - s.month()),
						i = s.clone().add(d, $),
						m = o - i < 0,
						h = s.clone().add(d + (m ? -1 : 1), $);
					return +(-(d + (o - i) / (m ? i - h : h - i)) || 0);
				},
				a: function (f) {
					return f < 0 ? Math.ceil(f) || 0 : Math.floor(f);
				},
				p: function (f) {
					return (
						{ M: $, y: l, w: _, d: b, D: g, h: y, m: p, s: c, ms: u, Q: D }[
							f
						] ||
						String(f || '')
							.toLowerCase()
							.replace(/s$/, '')
					);
				},
				u: function (f) {
					return f === void 0;
				},
			},
			H = 'en',
			j = {};
		j[H] = z;
		var Y = function (f) {
				return f instanceof G;
			},
			U = function f(s, o, d) {
				var i;
				if (!s) return H;
				if (typeof s == 'string') {
					var m = s.toLowerCase();
					j[m] && (i = m), o && ((j[m] = o), (i = m));
					var h = s.split('-');
					if (!i && h.length > 1) return f(h[0]);
				} else {
					var O = s.name;
					(j[O] = s), (i = O);
				}
				return !d && i && (H = i), i || (!d && H);
			},
			M = function (f, s) {
				if (Y(f)) return f.clone();
				var o = typeof s == 'object' ? s : {};
				return (o.date = f), (o.args = arguments), new G(o);
			},
			T = te;
		(T.l = U),
			(T.i = Y),
			(T.w = function (f, s) {
				return M(f, { locale: s.$L, utc: s.$u, x: s.$x, $offset: s.$offset });
			});
		var G = (function () {
				function f(o) {
					(this.$L = U(o.locale, null, !0)), this.parse(o);
				}
				var s = f.prototype;
				return (
					(s.parse = function (o) {
						(this.$d = (function (d) {
							var i = d.date,
								m = d.utc;
							if (i === null) return new Date(NaN);
							if (T.u(i)) return new Date();
							if (i instanceof Date) return new Date(i);
							if (typeof i == 'string' && !/Z$/i.test(i)) {
								var h = i.match(q);
								if (h) {
									var O = h[2] - 1 || 0,
										k = (h[7] || '0').substring(0, 3);
									return m
										? new Date(
												Date.UTC(
													h[1],
													O,
													h[3] || 1,
													h[4] || 0,
													h[5] || 0,
													h[6] || 0,
													k
												)
										  )
										: new Date(
												h[1],
												O,
												h[3] || 1,
												h[4] || 0,
												h[5] || 0,
												h[6] || 0,
												k
										  );
								}
							}
							return new Date(i);
						})(o)),
							(this.$x = o.x || {}),
							this.init();
					}),
					(s.init = function () {
						var o = this.$d;
						(this.$y = o.getFullYear()),
							(this.$M = o.getMonth()),
							(this.$D = o.getDate()),
							(this.$W = o.getDay()),
							(this.$H = o.getHours()),
							(this.$m = o.getMinutes()),
							(this.$s = o.getSeconds()),
							(this.$ms = o.getMilliseconds());
					}),
					(s.$utils = function () {
						return T;
					}),
					(s.isValid = function () {
						return this.$d.toString() !== P;
					}),
					(s.isSame = function (o, d) {
						var i = M(o);
						return this.startOf(d) <= i && i <= this.endOf(d);
					}),
					(s.isAfter = function (o, d) {
						return M(o) < this.startOf(d);
					}),
					(s.isBefore = function (o, d) {
						return this.endOf(d) < M(o);
					}),
					(s.$g = function (o, d, i) {
						return T.u(o) ? this[d] : this.set(i, o);
					}),
					(s.unix = function () {
						return Math.floor(this.valueOf() / 1e3);
					}),
					(s.valueOf = function () {
						return this.$d.getTime();
					}),
					(s.startOf = function (o, d) {
						var i = this,
							m = !!T.u(d) || d,
							h = T.p(o),
							O = function (W, w) {
								var I = T.w(
									i.$u ? Date.UTC(i.$y, w, W) : new Date(i.$y, w, W),
									i
								);
								return m ? I : I.endOf(b);
							},
							k = function (W, w) {
								return T.w(
									i
										.toDate()
										[W].apply(
											i.toDate('s'),
											(m ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(w)
										),
									i
								);
							},
							x = this.$W,
							S = this.$M,
							F = this.$D,
							N = 'set' + (this.$u ? 'UTC' : '');
						switch (h) {
							case l:
								return m ? O(1, 0) : O(31, 11);
							case $:
								return m ? O(1, S) : O(0, S + 1);
							case _:
								var X = this.$locale().weekStart || 0,
									K = (x < X ? x + 7 : x) - X;
								return O(m ? F - K : F + (6 - K), S);
							case b:
							case g:
								return k(N + 'Hours', 0);
							case y:
								return k(N + 'Minutes', 1);
							case p:
								return k(N + 'Seconds', 2);
							case c:
								return k(N + 'Milliseconds', 3);
							default:
								return this.clone();
						}
					}),
					(s.endOf = function (o) {
						return this.startOf(o, !1);
					}),
					(s.$set = function (o, d) {
						var i,
							m = T.p(o),
							h = 'set' + (this.$u ? 'UTC' : ''),
							O = ((i = {}),
							(i[b] = h + 'Date'),
							(i[g] = h + 'Date'),
							(i[$] = h + 'Month'),
							(i[l] = h + 'FullYear'),
							(i[y] = h + 'Hours'),
							(i[p] = h + 'Minutes'),
							(i[c] = h + 'Seconds'),
							(i[u] = h + 'Milliseconds'),
							i)[m],
							k = m === b ? this.$D + (d - this.$W) : d;
						if (m === $ || m === l) {
							var x = this.clone().set(g, 1);
							x.$d[O](k),
								x.init(),
								(this.$d = x.set(g, Math.min(this.$D, x.daysInMonth())).$d);
						} else O && this.$d[O](k);
						return this.init(), this;
					}),
					(s.set = function (o, d) {
						return this.clone().$set(o, d);
					}),
					(s.get = function (o) {
						return this[T.p(o)]();
					}),
					(s.add = function (o, d) {
						var i,
							m = this;
						o = Number(o);
						var h = T.p(d),
							O = function (S) {
								var F = M(m);
								return T.w(F.date(F.date() + Math.round(S * o)), m);
							};
						if (h === $) return this.set($, this.$M + o);
						if (h === l) return this.set(l, this.$y + o);
						if (h === b) return O(1);
						if (h === _) return O(7);
						var k = ((i = {}), (i[p] = t), (i[y] = a), (i[c] = n), i)[h] || 1,
							x = this.$d.getTime() + o * k;
						return T.w(x, this);
					}),
					(s.subtract = function (o, d) {
						return this.add(-1 * o, d);
					}),
					(s.format = function (o) {
						var d = this,
							i = this.$locale();
						if (!this.isValid()) return i.invalidDate || P;
						var m = o || 'YYYY-MM-DDTHH:mm:ssZ',
							h = T.z(this),
							O = this.$H,
							k = this.$m,
							x = this.$M,
							S = i.weekdays,
							F = i.months,
							N = function (w, I, ne, ee) {
								return (w && (w[I] || w(d, m))) || ne[I].slice(0, ee);
							},
							X = function (w) {
								return T.s(O % 12 || 12, w, '0');
							},
							K =
								i.meridiem ||
								function (w, I, ne) {
									var ee = w < 12 ? 'AM' : 'PM';
									return ne ? ee.toLowerCase() : ee;
								},
							W = {
								YY: String(this.$y).slice(-2),
								YYYY: this.$y,
								M: x + 1,
								MM: T.s(x + 1, 2, '0'),
								MMM: N(i.monthsShort, x, F, 3),
								MMMM: N(F, x),
								D: this.$D,
								DD: T.s(this.$D, 2, '0'),
								d: String(this.$W),
								dd: N(i.weekdaysMin, this.$W, S, 2),
								ddd: N(i.weekdaysShort, this.$W, S, 3),
								dddd: S[this.$W],
								H: String(O),
								HH: T.s(O, 2, '0'),
								h: X(1),
								hh: X(2),
								a: K(O, k, !0),
								A: K(O, k, !1),
								m: String(k),
								mm: T.s(k, 2, '0'),
								s: String(this.$s),
								ss: T.s(this.$s, 2, '0'),
								SSS: T.s(this.$ms, 3, '0'),
								Z: h,
							};
						return m.replace(B, function (w, I) {
							return I || W[w] || h.replace(':', '');
						});
					}),
					(s.utcOffset = function () {
						return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
					}),
					(s.diff = function (o, d, i) {
						var m,
							h = T.p(d),
							O = M(o),
							k = (O.utcOffset() - this.utcOffset()) * t,
							x = this - O,
							S = T.m(this, O);
						return (
							(S =
								((m = {}),
								(m[l] = S / 12),
								(m[$] = S),
								(m[D] = S / 3),
								(m[_] = (x - k) / 6048e5),
								(m[b] = (x - k) / 864e5),
								(m[y] = x / a),
								(m[p] = x / t),
								(m[c] = x / n),
								m)[h] || x),
							i ? S : T.a(S)
						);
					}),
					(s.daysInMonth = function () {
						return this.endOf($).$D;
					}),
					(s.$locale = function () {
						return j[this.$L];
					}),
					(s.locale = function (o, d) {
						if (!o) return this.$L;
						var i = this.clone(),
							m = U(o, d, !0);
						return m && (i.$L = m), i;
					}),
					(s.clone = function () {
						return T.w(this.$d, this);
					}),
					(s.toDate = function () {
						return new Date(this.valueOf());
					}),
					(s.toJSON = function () {
						return this.isValid() ? this.toISOString() : null;
					}),
					(s.toISOString = function () {
						return this.$d.toISOString();
					}),
					(s.toString = function () {
						return this.$d.toUTCString();
					}),
					f
				);
			})(),
			pe = G.prototype;
		return (
			(M.prototype = pe),
			[
				['$ms', u],
				['$s', c],
				['$m', p],
				['$H', y],
				['$W', b],
				['$M', $],
				['$y', l],
				['$D', g],
			].forEach(function (f) {
				pe[f[1]] = function (s) {
					return this.$g(s, f[0], f[1]);
				};
			}),
			(M.extend = function (f, s) {
				return f.$i || (f(s, G, M), (f.$i = !0)), M;
			}),
			(M.locale = U),
			(M.isDayjs = Y),
			(M.unix = function (f) {
				return M(1e3 * f);
			}),
			(M.en = j[H]),
			(M.Ls = j),
			(M.p = {}),
			M
		);
	});
})(it);
const st = ce;
function gt() {
	return E(dr, {
		perPage: 25,
		sort: { field: 'date_time', order: 'DESC' },
		children: Le(hr, {
			bulkActionButtons: !1,
			children: [
				E(ge, { source: 'user_id', reference: 'users' }),
				E(Fe, {
					label: 'Date Time',
					render: (r) => st(r.date_time).format(cr.DATETIME_FORMAT),
				}),
				';',
				E($e, { source: 'activity_type', label: 'Activity Type' }),
				E($e, { source: 'activity_detail', label: 'Activity Details' }),
			],
		}),
	});
}
export { gt as default };
