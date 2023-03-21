import {
	r as h,
	S as bt,
	z as gt,
	A as vt,
	D as yt,
	_ as $,
	E as Re,
	F as ve,
	G as xt,
	H as wt,
	I as Ft,
	J as _t,
	K as ce,
	k as N,
	j as L,
	M as fe,
	N as de,
	O as Ot,
	P as Se,
	s as P,
	Q as z,
	U as he,
	V as We,
	W as Ye,
	X as Ae,
	Y as Te,
	Z as Ne,
	$ as $t,
	a0 as Et,
	o as St,
	q as Tt,
	t as kt,
	c as Ct,
	a1 as jt,
	a2 as Dt,
	a3 as Pt,
	a4 as Mt,
	a5 as Rt,
	p as b,
	a6 as At,
	a7 as Nt,
	a8 as Vt,
	a9 as zt,
	aa as It,
	ab as Ut,
	ac as Lt,
	ad as Bt,
	ae as qt,
	af as Zt,
	x as Gt,
	ag as Ke,
	ah as Xt,
	ai as Ht,
	aj as Ve,
} from './index-091859a0.js';
import { p as Wt, S as Yt } from './Confirm-edcfa802.js';
import { D as Kt } from './DeleteButton-194d027b.js';
var ze =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(ze =
					Object.assign ||
					function (r) {
						for (var e, t = 1, n = arguments.length; t < n; t++) {
							e = arguments[t];
							for (var s in e)
								Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s]);
						}
						return r;
					}),
				ze.apply(this, arguments)
			);
		},
	qn = function (r, e, t) {
		var n = Object.keys(t),
			s = e.filter(function (a) {
				return !n.includes(a);
			});
		if (s.length > 0)
			throw new Error(
				'<'
					.concat(
						r,
						`> component is not properly configured, some essential props are missing.
Be sure to pass the props from the parent. Example:

const My`
					)
					.concat(
						r,
						` = props => (
    <`
					)
					.concat(r, ' {...props}></')
					.concat(
						r,
						`>
);

The missing props are: `
					)
					.concat(s.join(', '))
			);
	},
	Zn = function (r) {
		var e = r.children,
			t = r.value;
		return h.createElement(bt.Provider, { value: t }, e);
	},
	Gn = function (r) {
		var e = h.useMemo(
			function () {
				return Wt(r, [
					'save',
					'saving',
					'mutationMode',
					'registerMutationMiddleware',
					'unregisterMutationMiddleware',
				]);
			},
			[
				r.save,
				r.saving,
				r.mutationMode,
				r.registerMutationMiddleware,
				r.unregisterMutationMiddleware,
			]
		);
		return e;
	},
	te =
		(globalThis && globalThis.__spreadArray) ||
		function (r, e, t) {
			if (t || arguments.length === 2)
				for (var n = 0, s = e.length, a; n < s; n++)
					(a || !(n in e)) &&
						(a || (a = Array.prototype.slice.call(e, 0, n)), (a[n] = e[n]));
			return r.concat(a || Array.prototype.slice.call(e));
		},
	Xn = function () {
		var r = h.useRef([]),
			e = h.useCallback(function (a) {
				r.current.push(a);
			}, []),
			t = h.useCallback(function (a) {
				r.current = r.current.filter(function (i) {
					return i !== a;
				});
			}, []),
			n = h.useCallback(function (a) {
				return function () {
					for (var i, l = [], u = 0; u < arguments.length; u++)
						l[u] = arguments[u];
					var o = r.current.length - 1,
						c = function () {
							for (var f, d = [], p = 0; p < arguments.length; p++)
								d[p] = arguments[p];
							return (
								o--,
								o >= 0
									? (f = r.current)[o].apply(f, te(te([], d, !1), [c], !1))
									: a.apply(void 0, d)
							);
						};
					return r.current.length > 0
						? (i = r.current)[o].apply(i, te(te([], l, !1), [c], !1))
						: a.apply(void 0, l);
				};
			}, []),
			s = h.useMemo(
				function () {
					return {
						registerMutationMiddleware: e,
						getMutateWithMiddlewares: n,
						unregisterMutationMiddleware: t,
					};
				},
				[e, n, t]
			);
		return s;
	};
const Jt = gt(),
	Qt = Jt,
	er = [
		'component',
		'direction',
		'spacing',
		'divider',
		'children',
		'className',
	],
	tr = vt(),
	rr = Qt('div', {
		name: 'MuiStack',
		slot: 'Root',
		overridesResolver: (r, e) => e.root,
	});
function nr(r) {
	return yt({ props: r, name: 'MuiStack', defaultTheme: tr });
}
function sr(r, e) {
	const t = h.Children.toArray(r).filter(Boolean);
	return t.reduce(
		(n, s, a) => (
			n.push(s),
			a < t.length - 1 && n.push(h.cloneElement(e, { key: `separator-${a}` })),
			n
		),
		[]
	);
}
const ar = (r) =>
		({
			row: 'Left',
			'row-reverse': 'Right',
			column: 'Top',
			'column-reverse': 'Bottom',
		}[r]),
	ir = ({ ownerState: r, theme: e }) => {
		let t = $(
			{ display: 'flex', flexDirection: 'column' },
			Re(
				{ theme: e },
				ve({ values: r.direction, breakpoints: e.breakpoints.values }),
				(n) => ({ flexDirection: n })
			)
		);
		if (r.spacing) {
			const n = xt(e),
				s = Object.keys(e.breakpoints.values).reduce(
					(u, o) => (
						((typeof r.spacing == 'object' && r.spacing[o] != null) ||
							(typeof r.direction == 'object' && r.direction[o] != null)) &&
							(u[o] = !0),
						u
					),
					{}
				),
				a = ve({ values: r.direction, base: s }),
				i = ve({ values: r.spacing, base: s });
			typeof a == 'object' &&
				Object.keys(a).forEach((u, o, c) => {
					if (!a[u]) {
						const d = o > 0 ? a[c[o - 1]] : 'column';
						a[u] = d;
					}
				}),
				(t = wt(
					t,
					Re({ theme: e }, i, (u, o) => ({
						'& > :not(style) + :not(style)': {
							margin: 0,
							[`margin${ar(o ? a[o] : r.direction)}`]: Ot(n, u),
						},
					}))
				));
		}
		return (t = Ft(e.breakpoints, t)), t;
	};
function or(r = {}) {
	const {
			createStyledComponent: e = rr,
			useThemeProps: t = nr,
			componentName: n = 'MuiStack',
		} = r,
		s = () => fe({ root: ['root'] }, (u) => de(n, u), {}),
		a = e(ir);
	return h.forwardRef(function (u, o) {
		const c = t(u),
			f = _t(c),
			{
				component: d = 'div',
				direction: p = 'column',
				spacing: v = 0,
				divider: m,
				children: w,
				className: _,
			} = f,
			E = ce(f, er),
			S = { direction: p, spacing: v },
			y = s();
		return N(
			a,
			$({ as: d, ownerState: S, ref: o, className: L(y.root, _) }, E, {
				children: m ? sr(w, m) : w,
			})
		);
	});
}
function lr(r) {
	return de('MuiFormControlLabel', r);
}
const ur = Se('MuiFormControlLabel', [
		'root',
		'labelPlacementStart',
		'labelPlacementTop',
		'labelPlacementBottom',
		'disabled',
		'label',
		'error',
	]),
	re = ur,
	cr = [
		'checked',
		'className',
		'componentsProps',
		'control',
		'disabled',
		'disableTypography',
		'inputRef',
		'label',
		'labelPlacement',
		'name',
		'onChange',
		'slotProps',
		'value',
	],
	fr = (r) => {
		const { classes: e, disabled: t, labelPlacement: n, error: s } = r,
			a = {
				root: ['root', t && 'disabled', `labelPlacement${z(n)}`, s && 'error'],
				label: ['label', t && 'disabled'],
			};
		return fe(a, lr, e);
	},
	dr = P('label', {
		name: 'MuiFormControlLabel',
		slot: 'Root',
		overridesResolver: (r, e) => {
			const { ownerState: t } = r;
			return [
				{ [`& .${re.label}`]: e.label },
				e.root,
				e[`labelPlacement${z(t.labelPlacement)}`],
			];
		},
	})(({ theme: r, ownerState: e }) =>
		$(
			{
				display: 'inline-flex',
				alignItems: 'center',
				cursor: 'pointer',
				verticalAlign: 'middle',
				WebkitTapHighlightColor: 'transparent',
				marginLeft: -11,
				marginRight: 16,
				[`&.${re.disabled}`]: { cursor: 'default' },
			},
			e.labelPlacement === 'start' && {
				flexDirection: 'row-reverse',
				marginLeft: 16,
				marginRight: -11,
			},
			e.labelPlacement === 'top' && {
				flexDirection: 'column-reverse',
				marginLeft: 16,
			},
			e.labelPlacement === 'bottom' && {
				flexDirection: 'column',
				marginLeft: 16,
			},
			{
				[`& .${re.label}`]: {
					[`&.${re.disabled}`]: { color: (r.vars || r).palette.text.disabled },
				},
			}
		)
	),
	hr = h.forwardRef(function (e, t) {
		var n;
		const s = he({ props: e, name: 'MuiFormControlLabel' }),
			{
				className: a,
				componentsProps: i = {},
				control: l,
				disabled: u,
				disableTypography: o,
				label: c,
				labelPlacement: f = 'end',
				slotProps: d = {},
			} = s,
			p = ce(s, cr),
			v = We();
		let m = u;
		typeof m > 'u' && typeof l.props.disabled < 'u' && (m = l.props.disabled),
			typeof m > 'u' && v && (m = v.disabled);
		const w = { disabled: m };
		['checked', 'name', 'onChange', 'value', 'inputRef'].forEach((F) => {
			typeof l.props[F] > 'u' && typeof s[F] < 'u' && (w[F] = s[F]);
		});
		const _ = Ye({ props: s, muiFormControl: v, states: ['error'] }),
			E = $({}, s, { disabled: m, labelPlacement: f, error: _.error }),
			S = fr(E),
			y = (n = d.typography) != null ? n : i.typography;
		let x = c;
		return (
			x != null &&
				x.type !== Ae &&
				!o &&
				(x = N(
					Ae,
					$({ component: 'span' }, y, {
						className: L(S.label, y == null ? void 0 : y.className),
						children: x,
					})
				)),
			Te(
				dr,
				$({ className: L(S.root, a), ownerState: E, ref: t }, p, {
					children: [h.cloneElement(l, w), x],
				})
			)
		);
	}),
	pr = hr;
function mr(r) {
	return de('MuiFormGroup', r);
}
Se('MuiFormGroup', ['root', 'row', 'error']);
const br = ['className', 'row'],
	gr = (r) => {
		const { classes: e, row: t, error: n } = r;
		return fe({ root: ['root', t && 'row', n && 'error'] }, mr, e);
	},
	vr = P('div', {
		name: 'MuiFormGroup',
		slot: 'Root',
		overridesResolver: (r, e) => {
			const { ownerState: t } = r;
			return [e.root, t.row && e.row];
		},
	})(({ ownerState: r }) =>
		$(
			{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' },
			r.row && { flexDirection: 'row' }
		)
	),
	yr = h.forwardRef(function (e, t) {
		const n = he({ props: e, name: 'MuiFormGroup' }),
			{ className: s, row: a = !1 } = n,
			i = ce(n, br),
			l = We(),
			u = Ye({ props: n, muiFormControl: l, states: ['error'] }),
			o = $({}, n, { row: a, error: u.error }),
			c = gr(o);
		return N(vr, $({ className: L(c.root, s), ownerState: o, ref: t }, i));
	}),
	xr = yr,
	wr = or({
		createStyledComponent: P('div', {
			name: 'MuiStack',
			slot: 'Root',
			overridesResolver: (r, e) => e.root,
		}),
		useThemeProps: (r) => he({ props: r, name: 'MuiStack' }),
	}),
	Fr = wr;
function _r(r) {
	return de('MuiSwitch', r);
}
const Or = Se('MuiSwitch', [
		'root',
		'edgeStart',
		'edgeEnd',
		'switchBase',
		'colorPrimary',
		'colorSecondary',
		'sizeSmall',
		'sizeMedium',
		'checked',
		'disabled',
		'input',
		'thumb',
		'track',
	]),
	O = Or,
	$r = ['className', 'color', 'edge', 'size', 'sx'],
	Er = (r) => {
		const {
				classes: e,
				edge: t,
				size: n,
				color: s,
				checked: a,
				disabled: i,
			} = r,
			l = {
				root: ['root', t && `edge${z(t)}`, `size${z(n)}`],
				switchBase: [
					'switchBase',
					`color${z(s)}`,
					a && 'checked',
					i && 'disabled',
				],
				thumb: ['thumb'],
				track: ['track'],
				input: ['input'],
			},
			u = fe(l, _r, e);
		return $({}, e, u);
	},
	Sr = P('span', {
		name: 'MuiSwitch',
		slot: 'Root',
		overridesResolver: (r, e) => {
			const { ownerState: t } = r;
			return [e.root, t.edge && e[`edge${z(t.edge)}`], e[`size${z(t.size)}`]];
		},
	})(({ ownerState: r }) =>
		$(
			{
				display: 'inline-flex',
				width: 34 + 12 * 2,
				height: 14 + 12 * 2,
				overflow: 'hidden',
				padding: 12,
				boxSizing: 'border-box',
				position: 'relative',
				flexShrink: 0,
				zIndex: 0,
				verticalAlign: 'middle',
				'@media print': { colorAdjust: 'exact' },
			},
			r.edge === 'start' && { marginLeft: -8 },
			r.edge === 'end' && { marginRight: -8 },
			r.size === 'small' && {
				width: 40,
				height: 24,
				padding: 7,
				[`& .${O.thumb}`]: { width: 16, height: 16 },
				[`& .${O.switchBase}`]: {
					padding: 4,
					[`&.${O.checked}`]: { transform: 'translateX(16px)' },
				},
			}
		)
	),
	Tr = P(Yt, {
		name: 'MuiSwitch',
		slot: 'SwitchBase',
		overridesResolver: (r, e) => {
			const { ownerState: t } = r;
			return [
				e.switchBase,
				{ [`& .${O.input}`]: e.input },
				t.color !== 'default' && e[`color${z(t.color)}`],
			];
		},
	})(
		({ theme: r }) => ({
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 1,
			color: r.vars
				? r.vars.palette.Switch.defaultColor
				: `${
						r.palette.mode === 'light'
							? r.palette.common.white
							: r.palette.grey[300]
				  }`,
			transition: r.transitions.create(['left', 'transform'], {
				duration: r.transitions.duration.shortest,
			}),
			[`&.${O.checked}`]: { transform: 'translateX(20px)' },
			[`&.${O.disabled}`]: {
				color: r.vars
					? r.vars.palette.Switch.defaultDisabledColor
					: `${
							r.palette.mode === 'light'
								? r.palette.grey[100]
								: r.palette.grey[600]
					  }`,
			},
			[`&.${O.checked} + .${O.track}`]: { opacity: 0.5 },
			[`&.${O.disabled} + .${O.track}`]: {
				opacity: r.vars
					? r.vars.opacity.switchTrackDisabled
					: `${r.palette.mode === 'light' ? 0.12 : 0.2}`,
			},
			[`& .${O.input}`]: { left: '-100%', width: '300%' },
		}),
		({ theme: r, ownerState: e }) =>
			$(
				{
					'&:hover': {
						backgroundColor: r.vars
							? `rgba(${r.vars.palette.action.activeChannel} / ${r.vars.palette.action.hoverOpacity})`
							: Ne(r.palette.action.active, r.palette.action.hoverOpacity),
						'@media (hover: none)': { backgroundColor: 'transparent' },
					},
				},
				e.color !== 'default' && {
					[`&.${O.checked}`]: {
						color: (r.vars || r).palette[e.color].main,
						'&:hover': {
							backgroundColor: r.vars
								? `rgba(${r.vars.palette[e.color].mainChannel} / ${
										r.vars.palette.action.hoverOpacity
								  })`
								: Ne(r.palette[e.color].main, r.palette.action.hoverOpacity),
							'@media (hover: none)': { backgroundColor: 'transparent' },
						},
						[`&.${O.disabled}`]: {
							color: r.vars
								? r.vars.palette.Switch[`${e.color}DisabledColor`]
								: `${
										r.palette.mode === 'light'
											? $t(r.palette[e.color].main, 0.62)
											: Et(r.palette[e.color].main, 0.55)
								  }`,
						},
					},
					[`&.${O.checked} + .${O.track}`]: {
						backgroundColor: (r.vars || r).palette[e.color].main,
					},
				}
			)
	),
	kr = P('span', {
		name: 'MuiSwitch',
		slot: 'Track',
		overridesResolver: (r, e) => e.track,
	})(({ theme: r }) => ({
		height: '100%',
		width: '100%',
		borderRadius: 14 / 2,
		zIndex: -1,
		transition: r.transitions.create(['opacity', 'background-color'], {
			duration: r.transitions.duration.shortest,
		}),
		backgroundColor: r.vars
			? r.vars.palette.common.onBackground
			: `${
					r.palette.mode === 'light'
						? r.palette.common.black
						: r.palette.common.white
			  }`,
		opacity: r.vars
			? r.vars.opacity.switchTrack
			: `${r.palette.mode === 'light' ? 0.38 : 0.3}`,
	})),
	Cr = P('span', {
		name: 'MuiSwitch',
		slot: 'Thumb',
		overridesResolver: (r, e) => e.thumb,
	})(({ theme: r }) => ({
		boxShadow: (r.vars || r).shadows[1],
		backgroundColor: 'currentColor',
		width: 20,
		height: 20,
		borderRadius: '50%',
	})),
	jr = h.forwardRef(function (e, t) {
		const n = he({ props: e, name: 'MuiSwitch' }),
			{
				className: s,
				color: a = 'primary',
				edge: i = !1,
				size: l = 'medium',
				sx: u,
			} = n,
			o = ce(n, $r),
			c = $({}, n, { color: a, edge: i, size: l }),
			f = Er(c),
			d = N(Cr, { className: f.thumb, ownerState: c });
		return Te(Sr, {
			className: L(f.root, s),
			sx: u,
			ownerState: c,
			children: [
				N(
					Tr,
					$(
						{
							type: 'checkbox',
							icon: d,
							checkedIcon: d,
							ref: t,
							ownerState: c,
						},
						o,
						{ classes: $({}, f, { root: f.switchBase }) }
					)
				),
				N(kr, { className: f.track, ownerState: c }),
			],
		});
	}),
	Je = jr;
var ke = {},
	Dr = Tt;
Object.defineProperty(ke, '__esModule', { value: !0 });
var Qe = (ke.default = void 0),
	Pr = Dr(St()),
	Mr = kt,
	Rr = (0, Pr.default)(
		(0, Mr.jsx)('path', {
			d: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z',
		}),
		'Save'
	);
Qe = ke.default = Rr;
var Q =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(Q =
					Object.assign ||
					function (r) {
						for (var e, t = 1, n = arguments.length; t < n; t++) {
							e = arguments[t];
							for (var s in e)
								Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s]);
						}
						return r;
					}),
				Q.apply(this, arguments)
			);
		},
	Ie =
		(globalThis && globalThis.__awaiter) ||
		function (r, e, t, n) {
			function s(a) {
				return a instanceof t
					? a
					: new t(function (i) {
							i(a);
					  });
			}
			return new (t || (t = Promise))(function (a, i) {
				function l(c) {
					try {
						o(n.next(c));
					} catch (f) {
						i(f);
					}
				}
				function u(c) {
					try {
						o(n.throw(c));
					} catch (f) {
						i(f);
					}
				}
				function o(c) {
					c.done ? a(c.value) : s(c.value).then(l, u);
				}
				o((n = n.apply(r, e || [])).next());
			});
		},
	Ue =
		(globalThis && globalThis.__generator) ||
		function (r, e) {
			var t = {
					label: 0,
					sent: function () {
						if (a[0] & 1) throw a[1];
						return a[1];
					},
					trys: [],
					ops: [],
				},
				n,
				s,
				a,
				i;
			return (
				(i = { next: l(0), throw: l(1), return: l(2) }),
				typeof Symbol == 'function' &&
					(i[Symbol.iterator] = function () {
						return this;
					}),
				i
			);
			function l(o) {
				return function (c) {
					return u([o, c]);
				};
			}
			function u(o) {
				if (n) throw new TypeError('Generator is already executing.');
				for (; t; )
					try {
						if (
							((n = 1),
							s &&
								(a =
									o[0] & 2
										? s.return
										: o[0]
										? s.throw || ((a = s.return) && a.call(s), 0)
										: s.next) &&
								!(a = a.call(s, o[1])).done)
						)
							return a;
						switch (((s = 0), a && (o = [o[0] & 2, a.value]), o[0])) {
							case 0:
							case 1:
								a = o;
								break;
							case 4:
								return t.label++, { value: o[1], done: !1 };
							case 5:
								t.label++, (s = o[1]), (o = [0]);
								continue;
							case 7:
								(o = t.ops.pop()), t.trys.pop();
								continue;
							default:
								if (
									((a = t.trys),
									!(a = a.length > 0 && a[a.length - 1]) &&
										(o[0] === 6 || o[0] === 2))
								) {
									t = 0;
									continue;
								}
								if (o[0] === 3 && (!a || (o[1] > a[0] && o[1] < a[3]))) {
									t.label = o[1];
									break;
								}
								if (o[0] === 6 && t.label < a[1]) {
									(t.label = a[1]), (a = o);
									break;
								}
								if (a && t.label < a[2]) {
									(t.label = a[2]), t.ops.push(o);
									break;
								}
								a[2] && t.ops.pop(), t.trys.pop();
								continue;
						}
						o = e.call(r, t);
					} catch (c) {
						(o = [6, c]), (s = 0);
					} finally {
						n = a = 0;
					}
				if (o[0] & 5) throw o[1];
				return { value: o[0] ? o[1] : void 0, done: !0 };
			}
		},
	Ar =
		(globalThis && globalThis.__rest) ||
		function (r, e) {
			var t = {};
			for (var n in r)
				Object.prototype.hasOwnProperty.call(r, n) &&
					e.indexOf(n) < 0 &&
					(t[n] = r[n]);
			if (r != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
					e.indexOf(n[s]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(r, n[s]) &&
						(t[n[s]] = r[n[s]]);
			return t;
		},
	et = function (r) {
		var e = r.color,
			t = e === void 0 ? 'primary' : e,
			n = r.icon,
			s = n === void 0 ? Nr : n;
		r.invalid;
		var a = r.label,
			i = a === void 0 ? 'ra.action.save' : a,
			l = r.onClick,
			u = r.mutationOptions,
			o = r.saving,
			c = r.disabled,
			f = r.type,
			d = f === void 0 ? 'submit' : f,
			p = r.transform,
			v = r.variant,
			m = v === void 0 ? 'contained' : v,
			w = r.alwaysEnable,
			_ = w === void 0 ? !1 : w,
			E = Ar(r, [
				'color',
				'icon',
				'invalid',
				'label',
				'onClick',
				'mutationOptions',
				'saving',
				'disabled',
				'type',
				'transform',
				'variant',
				'alwaysEnable',
			]),
			S = Ct(),
			y = jt(),
			x = Dt(),
			F = Pt(),
			Z = F.dirtyFields,
			M = F.isValidating,
			R = F.isSubmitting,
			g = Object.keys(Z).length > 0,
			k = Ir(
				_ === !1 || _ === void 0 ? void 0 : !_,
				c || !g || M || (x == null ? void 0 : x.saving) || R
			);
		Mt(
			d === 'submit' && ((u && (u.onSuccess || u.onError)) || p),
			'Cannot use <SaveButton mutationOptions> props on a button of type "submit". To override the default mutation options on a particular save button, set the <SaveButton type="button"> prop, or set mutationOptions in the main view component (<Create> or <Edit>).'
		);
		var V = h.useCallback(
				function (X) {
					return Ie(void 0, void 0, void 0, function () {
						var I;
						return Ue(this, function (ge) {
							switch (ge.label) {
								case 0:
									return x != null && x.save
										? [4, x.save(X, Q(Q({}, u), { transform: p }))]
										: [3, 2];
								case 1:
									(I = ge.sent()), (ge.label = 2);
								case 2:
									return I != null && Nt(I, y.setError), [2];
							}
						});
					});
				},
				[y.setError, x, u, p]
			),
			G = h.useCallback(
				function (X) {
					return Ie(void 0, void 0, void 0, function () {
						return Ue(this, function (I) {
							switch (I.label) {
								case 0:
									return (
										l && l(X),
										X.defaultPrevented
											? [2]
											: d !== 'button'
											? [3, 2]
											: (X.stopPropagation(), [4, y.handleSubmit(V)(X)])
									);
								case 1:
									I.sent(), (I.label = 2);
								case 2:
									return [2];
							}
						});
					});
				},
				[l, d, y, V]
			),
			ee = i && S(i, { _: i }),
			mt = typeof o < 'u' ? o : (x == null ? void 0 : x.saving) || R;
		return h.createElement(
			zr,
			Q(
				{
					variant: m,
					type: d,
					color: t,
					'aria-label': ee,
					disabled: k,
					onClick: G,
				},
				E
			),
			mt ? h.createElement(Rt, { size: 18, thickness: 2 }) : s,
			ee
		);
	},
	Nr = h.createElement(Qe, null);
et.propTypes = {
	className: b.string,
	invalid: b.bool,
	label: b.string,
	saving: b.bool,
	variant: b.oneOf(['text', 'outlined', 'contained']),
	icon: b.element,
	alwaysEnable: b.bool,
};
var Vr = 'RaSaveButton',
	zr = P(At, {
		name: Vr,
		overridesResolver: function (r, e) {
			return e.root;
		},
	})(function (r) {
		var e,
			t = r.theme;
		return (
			(e = { position: 'relative' }),
			(e['& .MuiSvgIcon-root, & .MuiIcon-root, & .MuiCircularProgress-root'] = {
				marginRight: t.spacing(1),
			}),
			(e['& .MuiSvgIcon-root, & .MuiIcon-root'] = { fontSize: 18 }),
			e
		);
	}),
	Ir = function (r, e) {
		return typeof r > 'u' ? e : r;
	},
	Ur = {
		label: b.oneOfType([b.string, b.bool, b.element]),
		resource: b.string,
		source: b.string,
	},
	J =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(J =
					Object.assign ||
					function (r) {
						for (var e, t = 1, n = arguments.length; t < n; t++) {
							e = arguments[t];
							for (var s in e)
								Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s]);
						}
						return r;
					}),
				J.apply(this, arguments)
			);
		},
	Lr =
		(globalThis && globalThis.__rest) ||
		function (r, e) {
			var t = {};
			for (var n in r)
				Object.prototype.hasOwnProperty.call(r, n) &&
					e.indexOf(n) < 0 &&
					(t[n] = r[n]);
			if (r != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
					e.indexOf(n[s]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(r, n[s]) &&
						(t[n[s]] = r[n[s]]);
			return t;
		},
	Ce = function (r) {
		var e = r.className,
			t = r.row,
			n = t === void 0 ? !1 : t,
			s = r.defaultValue,
			a = s === void 0 ? !1 : s,
			i = r.format,
			l = r.label;
		r.fullWidth;
		var u = r.helperText,
			o = r.onBlur,
			c = r.onChange,
			f = r.onFocus,
			d = r.disabled,
			p = r.parse,
			v = r.resource,
			m = r.source,
			w = r.validate,
			_ = r.options,
			E = r.sx,
			S = Lr(r, [
				'className',
				'row',
				'defaultValue',
				'format',
				'label',
				'fullWidth',
				'helperText',
				'onBlur',
				'onChange',
				'onFocus',
				'disabled',
				'parse',
				'resource',
				'source',
				'validate',
				'options',
				'sx',
			]),
			y = Vt(
				J(
					{
						defaultValue: a,
						format: i,
						parse: p,
						resource: v,
						source: m,
						onBlur: o,
						onChange: c,
						type: 'checkbox',
						validate: w,
					},
					S
				)
			),
			x = y.id,
			F = y.field,
			Z = y.isRequired,
			M = y.fieldState,
			R = M.error,
			g = M.invalid,
			k = M.isTouched,
			V = y.formState.isSubmitted,
			G = h.useCallback(
				function (ee) {
					F.onChange(ee), F.onBlur();
				},
				[F]
			);
		return h.createElement(
			xr,
			{ className: L('ra-input', 'ra-input-'.concat(m), e), row: n, sx: E },
			h.createElement(pr, {
				control: h.createElement(
					Je,
					J(
						{
							id: x,
							name: F.name,
							color: 'primary',
							onChange: G,
							onFocus: f,
							checked: F.value,
						},
						zt(S),
						_,
						{ disabled: d }
					)
				),
				label: h.createElement(It, {
					label: l,
					source: m,
					resource: v,
					isRequired: Z,
				}),
			}),
			h.createElement(
				Ut,
				{ error: (k || V) && g },
				h.createElement(Lt, {
					touched: k || V,
					error: R == null ? void 0 : R.message,
					helperText: u,
				})
			)
		);
	};
Ce.propTypes = J(J({}, Ur), {
	options: b.shape(Je.propTypes),
	disabled: b.bool,
});
Ce.defaultProps = { options: {} };
var we =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(we =
					Object.assign ||
					function (r) {
						for (var e, t = 1, n = arguments.length; t < n; t++) {
							e = arguments[t];
							for (var s in e)
								Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s]);
						}
						return r;
					}),
				we.apply(this, arguments)
			);
		},
	Br =
		(globalThis && globalThis.__rest) ||
		function (r, e) {
			var t = {};
			for (var n in r)
				Object.prototype.hasOwnProperty.call(r, n) &&
					e.indexOf(n) < 0 &&
					(t[n] = r[n]);
			if (r != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
					e.indexOf(n[s]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(r, n[s]) &&
						(t[n[s]] = r[n[s]]);
			return t;
		},
	tt = function (r) {
		var e,
			t = r.children,
			n = r.className,
			s = r.resource,
			a = Br(r, ['children', 'className', 'resource']),
			i = Bt(function (l) {
				return l.breakpoints.down('sm');
			});
		return h.createElement(
			qr,
			we(
				{
					className: L(
						((e = {}), (e[Y.mobileToolbar] = i), (e[Y.desktopToolbar] = !i), e),
						n
					),
					role: 'toolbar',
				},
				a
			),
			h.Children.count(t) === 0
				? h.createElement(
						'div',
						{ className: Y.defaultToolbar },
						h.createElement(et, null),
						h.createElement(Kt, { resource: s })
				  )
				: t
		);
	};
tt.propTypes = { children: b.node, className: b.string, resource: b.string };
var se = 'RaToolbar',
	Y = {
		desktopToolbar: ''.concat(se, '-desktopToolbar'),
		mobileToolbar: ''.concat(se, '-mobileToolbar'),
		defaultToolbar: ''.concat(se, '-defaultToolbar'),
	},
	qr = P(qt, {
		name: se,
		overridesResolver: function (r, e) {
			return e.root;
		},
	})(function (r) {
		var e,
			t = r.theme;
		return (
			(e = {
				backgroundColor:
					t.palette.mode === 'light'
						? t.palette.grey[100]
						: t.palette.grey[900],
			}),
			(e['&.'.concat(Y.desktopToolbar)] = {}),
			(e['&.'.concat(Y.mobileToolbar)] = {
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				padding: '16px',
				width: '100%',
				boxSizing: 'border-box',
				flexShrink: 0,
				zIndex: 2,
			}),
			(e['& .'.concat(Y.defaultToolbar)] = {
				flex: 1,
				display: 'flex',
				justifyContent: 'space-between',
			}),
			e
		);
	}),
	ie =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(ie =
					Object.assign ||
					function (r) {
						for (var e, t = 1, n = arguments.length; t < n; t++) {
							e = arguments[t];
							for (var s in e)
								Object.prototype.hasOwnProperty.call(e, s) && (r[s] = e[s]);
						}
						return r;
					}),
				ie.apply(this, arguments)
			);
		},
	rt =
		(globalThis && globalThis.__rest) ||
		function (r, e) {
			var t = {};
			for (var n in r)
				Object.prototype.hasOwnProperty.call(r, n) &&
					e.indexOf(n) < 0 &&
					(t[n] = r[n]);
			if (r != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var s = 0, n = Object.getOwnPropertySymbols(r); s < n.length; s++)
					e.indexOf(n[s]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(r, n[s]) &&
						(t[n[s]] = r[n[s]]);
			return t;
		},
	nt = function (r) {
		var e = r.children,
			t = r.className,
			n = r.component,
			s = n === void 0 ? Gr : n,
			a = r.sx,
			i = r.toolbar,
			l = i === void 0 ? Xr : i,
			u = rt(r, ['children', 'className', 'component', 'sx', 'toolbar']);
		return h.createElement(
			Zt,
			ie({}, u),
			h.createElement(
				s,
				{ className: t, sx: a },
				h.createElement(Fr, ie({ alignItems: 'flex-start' }, Hr(r)), e)
			),
			l !== !1 ? l : null
		);
	};
nt.propTypes = {
	children: b.node,
	defaultValues: b.oneOfType([b.object, b.func]),
	record: b.object,
	toolbar: b.oneOfType([b.element, b.oneOf([!1])]),
	validate: b.func,
};
var Zr = 'RaSimpleForm',
	Gr = P(Gt, {
		name: Zr,
		overridesResolver: function (r, e) {
			return e.root;
		},
	})(function (r) {
		var e,
			t = r.theme;
		return (
			(e = {}), (e[t.breakpoints.down('sm')] = { paddingBottom: '5em' }), e
		);
	}),
	Xr = h.createElement(tt, null),
	Hr = function (r) {
		r.children,
			r.className,
			r.component,
			r.criteriaMode,
			r.defaultValues,
			r.delayError,
			r.onSubmit,
			r.record,
			r.resource,
			r.reValidateMode,
			r.sx,
			r.toolbar,
			r.validate,
			r.resolver,
			r.sanitizeEmptyValues,
			r.shouldFocusError,
			r.shouldUnregister,
			r.shouldUseNativeValidation,
			r.warnWhenUnsavedChanges;
		var e = rt(r, [
			'children',
			'className',
			'component',
			'criteriaMode',
			'defaultValues',
			'delayError',
			'onSubmit',
			'record',
			'resource',
			'reValidateMode',
			'sx',
			'toolbar',
			'validate',
			'resolver',
			'sanitizeEmptyValues',
			'shouldFocusError',
			'shouldUnregister',
			'shouldUseNativeValidation',
			'warnWhenUnsavedChanges',
		]);
		return e;
	},
	Le = function (r, e, t) {
		if (r && 'reportValidity' in r) {
			var n = Ke(t, e);
			r.setCustomValidity((n && n.message) || ''), r.reportValidity();
		}
	},
	st = function (r, e) {
		var t = function (s) {
			var a = e.fields[s];
			a && a.ref && 'reportValidity' in a.ref
				? Le(a.ref, s, r)
				: a.refs &&
				  a.refs.forEach(function (i) {
						return Le(i, s, r);
				  });
		};
		for (var n in e.fields) t(n);
	},
	Wr = function (r, e) {
		e.shouldUseNativeValidation && st(r, e);
		var t = {};
		for (var n in r) {
			var s = Ke(e.fields, n);
			Xt(t, n, Object.assign(r[n], { ref: s && s.ref }));
		}
		return t;
	},
	Yr = function (r, e, t) {
		return (
			e === void 0 && (e = {}),
			t === void 0 && (t = {}),
			function (n, s, a) {
				try {
					return Promise.resolve(
						(function (i, l) {
							try {
								var u =
									(e.context,
									Promise.resolve(
										r[t.mode === 'sync' ? 'validateSync' : 'validate'](
											n,
											Object.assign({ abortEarly: !1 }, e, { context: s })
										)
									).then(function (o) {
										return (
											a.shouldUseNativeValidation && st({}, a),
											{ values: t.rawValues ? n : o, errors: {} }
										);
									}));
							} catch (o) {
								return l(o);
							}
							return u && u.then ? u.then(void 0, l) : u;
						})(0, function (i) {
							if (!i.inner) throw i;
							return {
								values: {},
								errors: Wr(
									((l = i),
									(u =
										!a.shouldUseNativeValidation && a.criteriaMode === 'all'),
									(l.inner || []).reduce(function (o, c) {
										if (
											(o[c.path] ||
												(o[c.path] = { message: c.message, type: c.type }),
											u)
										) {
											var f = o[c.path].types,
												d = f && f[c.type];
											o[c.path] = Ht(
												c.path,
												u,
												o,
												c.type,
												d ? [].concat(d, c.message) : c.message
											);
										}
										return o;
									}, {})),
									a
								),
							};
							var l, u;
						})
					);
				} catch (i) {
					return Promise.reject(i);
				}
			}
		);
	};
function B(r) {
	(this._maxSize = r), this.clear();
}
B.prototype.clear = function () {
	(this._size = 0), (this._values = Object.create(null));
};
B.prototype.get = function (r) {
	return this._values[r];
};
B.prototype.set = function (r, e) {
	return (
		this._size >= this._maxSize && this.clear(),
		r in this._values || this._size++,
		(this._values[r] = e)
	);
};
var Kr = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
	at = /^\d+$/,
	Jr = /^\d/,
	Qr = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
	en = /^\s*(['"]?)(.*?)(\1)\s*$/,
	je = 512,
	Be = new B(je),
	qe = new B(je),
	Ze = new B(je),
	U = {
		Cache: B,
		split: Fe,
		normalizePath: ye,
		setter: function (r) {
			var e = ye(r);
			return (
				qe.get(r) ||
				qe.set(r, function (n, s) {
					for (var a = 0, i = e.length, l = n; a < i - 1; ) {
						var u = e[a];
						if (u === '__proto__' || u === 'constructor' || u === 'prototype')
							return n;
						l = l[e[a++]];
					}
					l[e[a]] = s;
				})
			);
		},
		getter: function (r, e) {
			var t = ye(r);
			return (
				Ze.get(r) ||
				Ze.set(r, function (s) {
					for (var a = 0, i = t.length; a < i; )
						if (s != null || !e) s = s[t[a++]];
						else return;
					return s;
				})
			);
		},
		join: function (r) {
			return r.reduce(function (e, t) {
				return e + (De(t) || at.test(t) ? '[' + t + ']' : (e ? '.' : '') + t);
			}, '');
		},
		forEach: function (r, e, t) {
			tn(Array.isArray(r) ? r : Fe(r), e, t);
		},
	};
function ye(r) {
	return (
		Be.get(r) ||
		Be.set(
			r,
			Fe(r).map(function (e) {
				return e.replace(en, '$2');
			})
		)
	);
}
function Fe(r) {
	return r.match(Kr) || [''];
}
function tn(r, e, t) {
	var n = r.length,
		s,
		a,
		i,
		l;
	for (a = 0; a < n; a++)
		(s = r[a]),
			s &&
				(sn(s) && (s = '"' + s + '"'),
				(l = De(s)),
				(i = !l && /^\d+$/.test(s)),
				e.call(t, s, l, i, a, r));
}
function De(r) {
	return typeof r == 'string' && r && ["'", '"'].indexOf(r.charAt(0)) !== -1;
}
function rn(r) {
	return r.match(Jr) && !r.match(at);
}
function nn(r) {
	return Qr.test(r);
}
function sn(r) {
	return !De(r) && (rn(r) || nn(r));
}
const an =
		/[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g,
	pe = (r) => r.match(an) || [],
	me = (r) => r[0].toUpperCase() + r.slice(1),
	Pe = (r, e) => pe(r).join(e).toLowerCase(),
	it = (r) =>
		pe(r).reduce(
			(e, t) =>
				`${e}${
					e ? t[0].toUpperCase() + t.slice(1).toLowerCase() : t.toLowerCase()
				}`,
			''
		),
	on = (r) => me(it(r)),
	ln = (r) => Pe(r, '_'),
	un = (r) => Pe(r, '-'),
	cn = (r) => me(Pe(r, ' ')),
	fn = (r) => pe(r).map(me).join(' ');
var xe = {
		words: pe,
		upperFirst: me,
		camelCase: it,
		pascalCase: on,
		snakeCase: ln,
		kebabCase: un,
		sentenceCase: cn,
		titleCase: fn,
	},
	oe = {},
	dn = {
		get exports() {
			return oe;
		},
		set exports(r) {
			oe = r;
		},
	};
dn.exports = function (r) {
	return ot(hn(r), r);
};
oe.array = ot;
function ot(r, e) {
	var t = r.length,
		n = new Array(t),
		s = {},
		a = t,
		i = pn(e),
		l = mn(r);
	for (
		e.forEach(function (o) {
			if (!l.has(o[0]) || !l.has(o[1]))
				throw new Error(
					'Unknown node. There is an unknown node in the supplied edges.'
				);
		});
		a--;

	)
		s[a] || u(r[a], a, new Set());
	return n;
	function u(o, c, f) {
		if (f.has(o)) {
			var d;
			try {
				d = ', node was:' + JSON.stringify(o);
			} catch {
				d = '';
			}
			throw new Error('Cyclic dependency' + d);
		}
		if (!l.has(o))
			throw new Error(
				'Found unknown node. Make sure to provided all involved nodes. Unknown node: ' +
					JSON.stringify(o)
			);
		if (!s[c]) {
			s[c] = !0;
			var p = i.get(o) || new Set();
			if (((p = Array.from(p)), (c = p.length))) {
				f.add(o);
				do {
					var v = p[--c];
					u(v, l.get(v), f);
				} while (c);
				f.delete(o);
			}
			n[--t] = o;
		}
	}
}
function hn(r) {
	for (var e = new Set(), t = 0, n = r.length; t < n; t++) {
		var s = r[t];
		e.add(s[0]), e.add(s[1]);
	}
	return Array.from(e);
}
function pn(r) {
	for (var e = new Map(), t = 0, n = r.length; t < n; t++) {
		var s = r[t];
		e.has(s[0]) || e.set(s[0], new Set()),
			e.has(s[1]) || e.set(s[1], new Set()),
			e.get(s[0]).add(s[1]);
	}
	return e;
}
function mn(r) {
	for (var e = new Map(), t = 0, n = r.length; t < n; t++) e.set(r[t], t);
	return e;
}
const bn = Object.prototype.toString,
	gn = Error.prototype.toString,
	vn = RegExp.prototype.toString,
	yn = typeof Symbol < 'u' ? Symbol.prototype.toString : () => '',
	xn = /^Symbol\((.*)\)(.*)$/;
function wn(r) {
	return r != +r ? 'NaN' : r === 0 && 1 / r < 0 ? '-0' : '' + r;
}
function Ge(r, e = !1) {
	if (r == null || r === !0 || r === !1) return '' + r;
	const t = typeof r;
	if (t === 'number') return wn(r);
	if (t === 'string') return e ? `"${r}"` : r;
	if (t === 'function') return '[Function ' + (r.name || 'anonymous') + ']';
	if (t === 'symbol') return yn.call(r).replace(xn, 'Symbol($1)');
	const n = bn.call(r).slice(8, -1);
	return n === 'Date'
		? isNaN(r.getTime())
			? '' + r
			: r.toISOString(r)
		: n === 'Error' || r instanceof Error
		? '[' + gn.call(r) + ']'
		: n === 'RegExp'
		? vn.call(r)
		: null;
}
function K(r, e) {
	let t = Ge(r, e);
	return t !== null
		? t
		: JSON.stringify(
				r,
				function (n, s) {
					let a = Ge(this[n], e);
					return a !== null ? a : s;
				},
				2
		  );
}
function lt(r) {
	return r == null ? [] : [].concat(r);
}
let Fn = /\$\{\s*(\w+)\s*\}/g;
class T extends Error {
	static formatError(e, t) {
		const n = t.label || t.path || 'this';
		return (
			n !== t.path && (t = Object.assign({}, t, { path: n })),
			typeof e == 'string'
				? e.replace(Fn, (s, a) => K(t[a]))
				: typeof e == 'function'
				? e(t)
				: e
		);
	}
	static isError(e) {
		return e && e.name === 'ValidationError';
	}
	constructor(e, t, n, s) {
		super(),
			(this.value = void 0),
			(this.path = void 0),
			(this.type = void 0),
			(this.errors = void 0),
			(this.params = void 0),
			(this.inner = void 0),
			(this.name = 'ValidationError'),
			(this.value = t),
			(this.path = n),
			(this.type = s),
			(this.errors = []),
			(this.inner = []),
			lt(e).forEach((a) => {
				T.isError(a)
					? (this.errors.push(...a.errors),
					  (this.inner = this.inner.concat(a.inner.length ? a.inner : a)))
					: this.errors.push(a);
			}),
			(this.message =
				this.errors.length > 1
					? `${this.errors.length} errors occurred`
					: this.errors[0]),
			Error.captureStackTrace && Error.captureStackTrace(this, T);
	}
}
let A = {
		default: '${path} is invalid',
		required: '${path} is a required field',
		defined: '${path} must be defined',
		notNull: '${path} cannot be null',
		oneOf: '${path} must be one of the following values: ${values}',
		notOneOf: '${path} must not be one of the following values: ${values}',
		notType: ({ path: r, type: e, value: t, originalValue: n }) => {
			const s =
				n != null && n !== t ? ` (cast from the value \`${K(n, !0)}\`).` : '.';
			return e !== 'mixed'
				? `${r} must be a \`${e}\` type, but the final value was: \`${K(
						t,
						!0
				  )}\`` + s
				: `${r} must match the configured type. The validated value was: \`${K(
						t,
						!0
				  )}\`` + s;
		},
	},
	C = {
		length: '${path} must be exactly ${length} characters',
		min: '${path} must be at least ${min} characters',
		max: '${path} must be at most ${max} characters',
		matches: '${path} must match the following: "${regex}"',
		email: '${path} must be a valid email',
		url: '${path} must be a valid URL',
		uuid: '${path} must be a valid UUID',
		trim: '${path} must be a trimmed string',
		lowercase: '${path} must be a lowercase string',
		uppercase: '${path} must be a upper case string',
	},
	_n = {
		min: '${path} must be greater than or equal to ${min}',
		max: '${path} must be less than or equal to ${max}',
		lessThan: '${path} must be less than ${less}',
		moreThan: '${path} must be greater than ${more}',
		positive: '${path} must be a positive number',
		negative: '${path} must be a negative number',
		integer: '${path} must be an integer',
	},
	_e = {
		min: '${path} field must be later than ${min}',
		max: '${path} field must be at earlier than ${max}',
	},
	Oe = { isValue: '${path} field must be ${value}' },
	$e = { noUnknown: '${path} field has unspecified keys: ${unknown}' },
	On = {
		min: '${path} field must have at least ${min} items',
		max: '${path} field must have less than or equal to ${max} items',
		length: '${path} must have ${length} items',
	};
Object.assign(Object.create(null), {
	mixed: A,
	string: C,
	number: _n,
	date: _e,
	object: $e,
	array: On,
	boolean: Oe,
});
const Me = (r) => r && r.__isYupSchema__;
class le {
	static fromOptions(e, t) {
		if (!t.then && !t.otherwise)
			throw new TypeError(
				'either `then:` or `otherwise:` is required for `when()` conditions'
			);
		let { is: n, then: s, otherwise: a } = t,
			i = typeof n == 'function' ? n : (...l) => l.every((u) => u === n);
		return new le(e, (l, u) => {
			var o;
			let c = i(...l) ? s : a;
			return (o = c == null ? void 0 : c(u)) != null ? o : u;
		});
	}
	constructor(e, t) {
		(this.fn = void 0), (this.refs = e), (this.refs = e), (this.fn = t);
	}
	resolve(e, t) {
		let n = this.refs.map((a) =>
				a.getValue(
					t == null ? void 0 : t.value,
					t == null ? void 0 : t.parent,
					t == null ? void 0 : t.context
				)
			),
			s = this.fn(n, e, t);
		if (s === void 0 || s === e) return e;
		if (!Me(s)) throw new TypeError('conditions must return a schema object');
		return s.resolve(t);
	}
}
const ne = { context: '$', value: '.' };
class q {
	constructor(e, t = {}) {
		if (
			((this.key = void 0),
			(this.isContext = void 0),
			(this.isValue = void 0),
			(this.isSibling = void 0),
			(this.path = void 0),
			(this.getter = void 0),
			(this.map = void 0),
			typeof e != 'string')
		)
			throw new TypeError('ref must be a string, got: ' + e);
		if (((this.key = e.trim()), e === ''))
			throw new TypeError('ref must be a non-empty string');
		(this.isContext = this.key[0] === ne.context),
			(this.isValue = this.key[0] === ne.value),
			(this.isSibling = !this.isContext && !this.isValue);
		let n = this.isContext ? ne.context : this.isValue ? ne.value : '';
		(this.path = this.key.slice(n.length)),
			(this.getter = this.path && U.getter(this.path, !0)),
			(this.map = t.map);
	}
	getValue(e, t, n) {
		let s = this.isContext ? n : this.isValue ? e : t;
		return (
			this.getter && (s = this.getter(s || {})),
			this.map && (s = this.map(s)),
			s
		);
	}
	cast(e, t) {
		return this.getValue(
			e,
			t == null ? void 0 : t.parent,
			t == null ? void 0 : t.context
		);
	}
	resolve() {
		return this;
	}
	describe() {
		return { type: 'ref', key: this.key };
	}
	toString() {
		return `Ref(${this.key})`;
	}
	static isRef(e) {
		return e && e.__isYupRef;
	}
}
q.prototype.__isYupRef = !0;
const D = (r) => r == null;
function H(r) {
	function e(
		{ value: t, path: n = '', options: s, originalValue: a, schema: i },
		l,
		u
	) {
		const { name: o, test: c, params: f, message: d, skipAbsent: p } = r;
		let { parent: v, context: m, abortEarly: w = i.spec.abortEarly } = s;
		function _(g) {
			return q.isRef(g) ? g.getValue(t, v, m) : g;
		}
		function E(g = {}) {
			const k = Object.assign(
				{
					value: t,
					originalValue: a,
					label: i.spec.label,
					path: g.path || n,
					spec: i.spec,
				},
				f,
				g.params
			);
			for (const G of Object.keys(k)) k[G] = _(k[G]);
			const V = new T(T.formatError(g.message || d, k), t, k.path, g.type || o);
			return (V.params = k), V;
		}
		const S = w ? l : u;
		let y = {
			path: n,
			parent: v,
			type: o,
			from: s.from,
			createError: E,
			resolve: _,
			options: s,
			originalValue: a,
			schema: i,
		};
		const x = (g) => {
				T.isError(g) ? S(g) : g ? u(null) : S(E());
			},
			F = (g) => {
				T.isError(g) ? S(g) : l(g);
			},
			Z = p && D(t);
		if (!s.sync) {
			try {
				Promise.resolve(Z ? !0 : c.call(y, t, y)).then(x, F);
			} catch (g) {
				F(g);
			}
			return;
		}
		let M;
		try {
			var R;
			if (
				((M = Z ? !0 : c.call(y, t, y)),
				typeof ((R = M) == null ? void 0 : R.then) == 'function')
			)
				throw new Error(
					`Validation test of type: "${y.type}" returned a Promise during a synchronous validate. This test will finish after the validate call has returned`
				);
		} catch (g) {
			F(g);
			return;
		}
		x(M);
	}
	return (e.OPTIONS = r), e;
}
function $n(r, e, t, n = t) {
	let s, a, i;
	return e
		? (U.forEach(e, (l, u, o) => {
				let c = u ? l.slice(1, l.length - 1) : l;
				r = r.resolve({ context: n, parent: s, value: t });
				let f = r.type === 'tuple',
					d = o ? parseInt(c, 10) : 0;
				if (r.innerType || f) {
					if (f && !o)
						throw new Error(
							`Yup.reach cannot implicitly index into a tuple type. the path part "${i}" must contain an index to the tuple element, e.g. "${i}[0]"`
						);
					if (t && d >= t.length)
						throw new Error(
							`Yup.reach cannot resolve an array item at index: ${l}, in the path: ${e}. because there is no value at that index. `
						);
					(s = t), (t = t && t[d]), (r = f ? r.spec.types[d] : r.innerType);
				}
				if (!o) {
					if (!r.fields || !r.fields[c])
						throw new Error(
							`The schema does not contain the path: ${e}. (failed at: ${i} which is a type: "${r.type}")`
						);
					(s = t), (t = t && t[c]), (r = r.fields[c]);
				}
				(a = c), (i = u ? '[' + l + ']' : '.' + l);
		  }),
		  { schema: r, parent: s, parentPath: a })
		: { parent: s, parentPath: e, schema: r };
}
class ue extends Set {
	describe() {
		const e = [];
		for (const t of this.values()) e.push(q.isRef(t) ? t.describe() : t);
		return e;
	}
	resolveAll(e) {
		let t = [];
		for (const n of this.values()) t.push(e(n));
		return t;
	}
	clone() {
		return new ue(this.values());
	}
	merge(e, t) {
		const n = this.clone();
		return e.forEach((s) => n.add(s)), t.forEach((s) => n.delete(s)), n;
	}
}
function W(r, e = new Map()) {
	if (Me(r) || !r || typeof r != 'object') return r;
	if (e.has(r)) return e.get(r);
	let t;
	if (r instanceof Date) (t = new Date(r.getTime())), e.set(r, t);
	else if (r instanceof RegExp) (t = new RegExp(r)), e.set(r, t);
	else if (Array.isArray(r)) {
		(t = new Array(r.length)), e.set(r, t);
		for (let n = 0; n < r.length; n++) t[n] = W(r[n], e);
	} else if (r instanceof Map) {
		(t = new Map()), e.set(r, t);
		for (const [n, s] of r.entries()) t.set(n, W(s, e));
	} else if (r instanceof Set) {
		(t = new Set()), e.set(r, t);
		for (const n of r) t.add(W(n, e));
	} else if (r instanceof Object) {
		(t = {}), e.set(r, t);
		for (const [n, s] of Object.entries(r)) t[n] = W(s, e);
	} else throw Error(`Unable to clone ${r}`);
	return t;
}
class j {
	constructor(e) {
		(this.type = void 0),
			(this.deps = []),
			(this.tests = void 0),
			(this.transforms = void 0),
			(this.conditions = []),
			(this._mutate = void 0),
			(this.internalTests = {}),
			(this._whitelist = new ue()),
			(this._blacklist = new ue()),
			(this.exclusiveTests = Object.create(null)),
			(this._typeCheck = void 0),
			(this.spec = void 0),
			(this.tests = []),
			(this.transforms = []),
			this.withMutation(() => {
				this.typeError(A.notType);
			}),
			(this.type = e.type),
			(this._typeCheck = e.check),
			(this.spec = Object.assign(
				{
					strip: !1,
					strict: !1,
					abortEarly: !0,
					recursive: !0,
					nullable: !1,
					optional: !0,
					coerce: !0,
				},
				e == null ? void 0 : e.spec
			)),
			this.withMutation((t) => {
				t.nonNullable();
			});
	}
	get _type() {
		return this.type;
	}
	clone(e) {
		if (this._mutate) return e && Object.assign(this.spec, e), this;
		const t = Object.create(Object.getPrototypeOf(this));
		return (
			(t.type = this.type),
			(t._typeCheck = this._typeCheck),
			(t._whitelist = this._whitelist.clone()),
			(t._blacklist = this._blacklist.clone()),
			(t.internalTests = Object.assign({}, this.internalTests)),
			(t.exclusiveTests = Object.assign({}, this.exclusiveTests)),
			(t.deps = [...this.deps]),
			(t.conditions = [...this.conditions]),
			(t.tests = [...this.tests]),
			(t.transforms = [...this.transforms]),
			(t.spec = W(Object.assign({}, this.spec, e))),
			t
		);
	}
	label(e) {
		let t = this.clone();
		return (t.spec.label = e), t;
	}
	meta(...e) {
		if (e.length === 0) return this.spec.meta;
		let t = this.clone();
		return (t.spec.meta = Object.assign(t.spec.meta || {}, e[0])), t;
	}
	withMutation(e) {
		let t = this._mutate;
		this._mutate = !0;
		let n = e(this);
		return (this._mutate = t), n;
	}
	concat(e) {
		if (!e || e === this) return this;
		if (e.type !== this.type && this.type !== 'mixed')
			throw new TypeError(
				`You cannot \`concat()\` schema's of different types: ${this.type} and ${e.type}`
			);
		let t = this,
			n = e.clone();
		const s = Object.assign({}, t.spec, n.spec);
		return (
			(n.spec = s),
			(n.internalTests = Object.assign({}, t.internalTests, n.internalTests)),
			(n._whitelist = t._whitelist.merge(e._whitelist, e._blacklist)),
			(n._blacklist = t._blacklist.merge(e._blacklist, e._whitelist)),
			(n.tests = t.tests),
			(n.exclusiveTests = t.exclusiveTests),
			n.withMutation((a) => {
				e.tests.forEach((i) => {
					a.test(i.OPTIONS);
				});
			}),
			(n.transforms = [...t.transforms, ...n.transforms]),
			n
		);
	}
	isType(e) {
		return e == null
			? !!(
					(this.spec.nullable && e === null) ||
					(this.spec.optional && e === void 0)
			  )
			: this._typeCheck(e);
	}
	resolve(e) {
		let t = this;
		if (t.conditions.length) {
			let n = t.conditions;
			(t = t.clone()),
				(t.conditions = []),
				(t = n.reduce((s, a) => a.resolve(s, e), t)),
				(t = t.resolve(e));
		}
		return t;
	}
	resolveOptions(e) {
		var t, n, s;
		return Object.assign({}, e, {
			from: e.from || [],
			strict: (t = e.strict) != null ? t : this.spec.strict,
			abortEarly: (n = e.abortEarly) != null ? n : this.spec.abortEarly,
			recursive: (s = e.recursive) != null ? s : this.spec.recursive,
		});
	}
	cast(e, t = {}) {
		let n = this.resolve(Object.assign({ value: e }, t)),
			s = t.assert === 'ignore-optionality',
			a = n._cast(e, t);
		if (t.assert !== !1 && !n.isType(a)) {
			if (s && D(a)) return a;
			let i = K(e),
				l = K(a);
			throw new TypeError(
				`The value of ${
					t.path || 'field'
				} could not be cast to a value that satisfies the schema type: "${
					n.type
				}". 

attempted value: ${i} 
` + (l !== i ? `result of cast: ${l}` : '')
			);
		}
		return a;
	}
	_cast(e, t) {
		let n =
			e === void 0
				? e
				: this.transforms.reduce((s, a) => a.call(this, s, e, this), e);
		return n === void 0 && (n = this.getDefault()), n;
	}
	_validate(e, t = {}, n, s) {
		let { path: a, originalValue: i = e, strict: l = this.spec.strict } = t,
			u = e;
		l || (u = this._cast(u, Object.assign({ assert: !1 }, t)));
		let o = [];
		for (let c of Object.values(this.internalTests)) c && o.push(c);
		this.runTests(
			{ path: a, value: u, originalValue: i, options: t, tests: o },
			n,
			(c) => {
				if (c.length) return s(c, u);
				this.runTests(
					{
						path: a,
						value: u,
						originalValue: i,
						options: t,
						tests: this.tests,
					},
					n,
					s
				);
			}
		);
	}
	runTests(e, t, n) {
		let s = !1,
			{ tests: a, value: i, originalValue: l, path: u, options: o } = e,
			c = (m) => {
				s || ((s = !0), t(m, i));
			},
			f = (m) => {
				s || ((s = !0), n(m, i));
			},
			d = a.length,
			p = [];
		if (!d) return f([]);
		let v = { value: i, originalValue: l, path: u, options: o, schema: this };
		for (let m = 0; m < a.length; m++) {
			const w = a[m];
			w(v, c, function (E) {
				E && (p = p.concat(E)), --d <= 0 && f(p);
			});
		}
	}
	asNestedTest({
		key: e,
		index: t,
		parent: n,
		parentPath: s,
		originalParent: a,
		options: i,
	}) {
		const l = e ?? t;
		if (l == null)
			throw TypeError('Must include `key` or `index` for nested validations');
		const u = typeof l == 'number';
		let o = n[l];
		const c = Object.assign({}, i, {
			strict: !0,
			parent: n,
			value: o,
			originalValue: a[l],
			key: void 0,
			[u ? 'index' : 'key']: l,
			path:
				u || l.includes('.')
					? `${s || ''}[${o ? l : `"${l}"`}]`
					: (s ? `${s}.` : '') + e,
		});
		return (f, d, p) => this.resolve(c)._validate(o, c, d, p);
	}
	validate(e, t) {
		let n = this.resolve(Object.assign({}, t, { value: e }));
		return new Promise((s, a) =>
			n._validate(
				e,
				t,
				(i, l) => {
					T.isError(i) && (i.value = l), a(i);
				},
				(i, l) => {
					i.length ? a(new T(i, l)) : s(l);
				}
			)
		);
	}
	validateSync(e, t) {
		let n = this.resolve(Object.assign({}, t, { value: e })),
			s;
		return (
			n._validate(
				e,
				Object.assign({}, t, { sync: !0 }),
				(a, i) => {
					throw (T.isError(a) && (a.value = i), a);
				},
				(a, i) => {
					if (a.length) throw new T(a, e);
					s = i;
				}
			),
			s
		);
	}
	isValid(e, t) {
		return this.validate(e, t).then(
			() => !0,
			(n) => {
				if (T.isError(n)) return !1;
				throw n;
			}
		);
	}
	isValidSync(e, t) {
		try {
			return this.validateSync(e, t), !0;
		} catch (n) {
			if (T.isError(n)) return !1;
			throw n;
		}
	}
	_getDefault() {
		let e = this.spec.default;
		return e == null ? e : typeof e == 'function' ? e.call(this) : W(e);
	}
	getDefault(e) {
		return this.resolve(e || {})._getDefault();
	}
	default(e) {
		return arguments.length === 0
			? this._getDefault()
			: this.clone({ default: e });
	}
	strict(e = !0) {
		return this.clone({ strict: e });
	}
	nullability(e, t) {
		const n = this.clone({ nullable: e });
		return (
			(n.internalTests.nullable = H({
				message: t,
				name: 'nullable',
				test(s) {
					return s === null ? this.schema.spec.nullable : !0;
				},
			})),
			n
		);
	}
	optionality(e, t) {
		const n = this.clone({ optional: e });
		return (
			(n.internalTests.optionality = H({
				message: t,
				name: 'optionality',
				test(s) {
					return s === void 0 ? this.schema.spec.optional : !0;
				},
			})),
			n
		);
	}
	optional() {
		return this.optionality(!0);
	}
	defined(e = A.defined) {
		return this.optionality(!1, e);
	}
	nullable() {
		return this.nullability(!0);
	}
	nonNullable(e = A.notNull) {
		return this.nullability(!1, e);
	}
	required(e = A.required) {
		return this.clone().withMutation((t) => t.nonNullable(e).defined(e));
	}
	notRequired() {
		return this.clone().withMutation((e) => e.nullable().optional());
	}
	transform(e) {
		let t = this.clone();
		return t.transforms.push(e), t;
	}
	test(...e) {
		let t;
		if (
			(e.length === 1
				? typeof e[0] == 'function'
					? (t = { test: e[0] })
					: (t = e[0])
				: e.length === 2
				? (t = { name: e[0], test: e[1] })
				: (t = { name: e[0], message: e[1], test: e[2] }),
			t.message === void 0 && (t.message = A.default),
			typeof t.test != 'function')
		)
			throw new TypeError('`test` is a required parameters');
		let n = this.clone(),
			s = H(t),
			a = t.exclusive || (t.name && n.exclusiveTests[t.name] === !0);
		if (t.exclusive && !t.name)
			throw new TypeError(
				'Exclusive tests must provide a unique `name` identifying the test'
			);
		return (
			t.name && (n.exclusiveTests[t.name] = !!t.exclusive),
			(n.tests = n.tests.filter(
				(i) =>
					!(
						i.OPTIONS.name === t.name &&
						(a || i.OPTIONS.test === s.OPTIONS.test)
					)
			)),
			n.tests.push(s),
			n
		);
	}
	when(e, t) {
		!Array.isArray(e) && typeof e != 'string' && ((t = e), (e = '.'));
		let n = this.clone(),
			s = lt(e).map((a) => new q(a));
		return (
			s.forEach((a) => {
				a.isSibling && n.deps.push(a.key);
			}),
			n.conditions.push(
				typeof t == 'function' ? new le(s, t) : le.fromOptions(s, t)
			),
			n
		);
	}
	typeError(e) {
		let t = this.clone();
		return (
			(t.internalTests.typeError = H({
				message: e,
				name: 'typeError',
				test(n) {
					return !D(n) && !this.schema._typeCheck(n)
						? this.createError({ params: { type: this.schema.type } })
						: !0;
				},
			})),
			t
		);
	}
	oneOf(e, t = A.oneOf) {
		let n = this.clone();
		return (
			e.forEach((s) => {
				n._whitelist.add(s), n._blacklist.delete(s);
			}),
			(n.internalTests.whiteList = H({
				message: t,
				name: 'oneOf',
				skipAbsent: !0,
				test(s) {
					let a = this.schema._whitelist,
						i = a.resolveAll(this.resolve);
					return i.includes(s)
						? !0
						: this.createError({
								params: { values: Array.from(a).join(', '), resolved: i },
						  });
				},
			})),
			n
		);
	}
	notOneOf(e, t = A.notOneOf) {
		let n = this.clone();
		return (
			e.forEach((s) => {
				n._blacklist.add(s), n._whitelist.delete(s);
			}),
			(n.internalTests.blacklist = H({
				message: t,
				name: 'notOneOf',
				test(s) {
					let a = this.schema._blacklist,
						i = a.resolveAll(this.resolve);
					return i.includes(s)
						? this.createError({
								params: { values: Array.from(a).join(', '), resolved: i },
						  })
						: !0;
				},
			})),
			n
		);
	}
	strip(e = !0) {
		let t = this.clone();
		return (t.spec.strip = e), t;
	}
	describe(e) {
		const t = (e ? this.resolve(e) : this).clone(),
			{ label: n, meta: s, optional: a, nullable: i } = t.spec;
		return {
			meta: s,
			label: n,
			optional: a,
			nullable: i,
			default: t.getDefault(e),
			type: t.type,
			oneOf: t._whitelist.describe(),
			notOneOf: t._blacklist.describe(),
			tests: t.tests
				.map((u) => ({ name: u.OPTIONS.name, params: u.OPTIONS.params }))
				.filter((u, o, c) => c.findIndex((f) => f.name === u.name) === o),
		};
	}
}
j.prototype.__isYupSchema__ = !0;
for (const r of ['validate', 'validateSync'])
	j.prototype[`${r}At`] = function (e, t, n = {}) {
		const { parent: s, parentPath: a, schema: i } = $n(this, e, t, n.context);
		return i[r](s && s[a], Object.assign({}, n, { parent: s, path: e }));
	};
for (const r of ['equals', 'is']) j.prototype[r] = j.prototype.oneOf;
for (const r of ['not', 'nope']) j.prototype[r] = j.prototype.notOneOf;
function ut() {
	return new ct();
}
class ct extends j {
	constructor() {
		super({
			type: 'boolean',
			check(e) {
				return e instanceof Boolean && (e = e.valueOf()), typeof e == 'boolean';
			},
		}),
			this.withMutation(() => {
				this.transform((e, t, n) => {
					if (n.spec.coerce && !n.isType(e)) {
						if (/^(true|1)$/i.test(String(e))) return !0;
						if (/^(false|0)$/i.test(String(e))) return !1;
					}
					return e;
				});
			});
	}
	isTrue(e = Oe.isValue) {
		return this.test({
			message: e,
			name: 'is-value',
			exclusive: !0,
			params: { value: 'true' },
			test(t) {
				return D(t) || t === !0;
			},
		});
	}
	isFalse(e = Oe.isValue) {
		return this.test({
			message: e,
			name: 'is-value',
			exclusive: !0,
			params: { value: 'false' },
			test(t) {
				return D(t) || t === !1;
			},
		});
	}
	default(e) {
		return super.default(e);
	}
	defined(e) {
		return super.defined(e);
	}
	optional() {
		return super.optional();
	}
	required(e) {
		return super.required(e);
	}
	notRequired() {
		return super.notRequired();
	}
	nullable() {
		return super.nullable();
	}
	nonNullable(e) {
		return super.nonNullable(e);
	}
	strip(e) {
		return super.strip(e);
	}
}
ut.prototype = ct.prototype;
let En =
		/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
	Sn =
		/^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
	Tn =
		/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
	kn = (r) => D(r) || r === r.trim(),
	Cn = {}.toString();
function Ee() {
	return new ft();
}
class ft extends j {
	constructor() {
		super({
			type: 'string',
			check(e) {
				return e instanceof String && (e = e.valueOf()), typeof e == 'string';
			},
		}),
			this.withMutation(() => {
				this.transform((e, t, n) => {
					if (!n.spec.coerce || n.isType(e) || Array.isArray(e)) return e;
					const s = e != null && e.toString ? e.toString() : e;
					return s === Cn ? e : s;
				});
			});
	}
	required(e) {
		return super
			.required(e)
			.withMutation((t) =>
				t.test({
					message: e || A.required,
					name: 'required',
					skipAbsent: !0,
					test: (n) => !!n.length,
				})
			);
	}
	notRequired() {
		return super
			.notRequired()
			.withMutation(
				(e) => (
					(e.tests = e.tests.filter((t) => t.OPTIONS.name !== 'required')), e
				)
			);
	}
	length(e, t = C.length) {
		return this.test({
			message: t,
			name: 'length',
			exclusive: !0,
			params: { length: e },
			skipAbsent: !0,
			test(n) {
				return n.length === this.resolve(e);
			},
		});
	}
	min(e, t = C.min) {
		return this.test({
			message: t,
			name: 'min',
			exclusive: !0,
			params: { min: e },
			skipAbsent: !0,
			test(n) {
				return n.length >= this.resolve(e);
			},
		});
	}
	max(e, t = C.max) {
		return this.test({
			name: 'max',
			exclusive: !0,
			message: t,
			params: { max: e },
			skipAbsent: !0,
			test(n) {
				return n.length <= this.resolve(e);
			},
		});
	}
	matches(e, t) {
		let n = !1,
			s,
			a;
		return (
			t &&
				(typeof t == 'object'
					? ({ excludeEmptyString: n = !1, message: s, name: a } = t)
					: (s = t)),
			this.test({
				name: a || 'matches',
				message: s || C.matches,
				params: { regex: e },
				skipAbsent: !0,
				test: (i) => (i === '' && n) || i.search(e) !== -1,
			})
		);
	}
	email(e = C.email) {
		return this.matches(En, {
			name: 'email',
			message: e,
			excludeEmptyString: !0,
		});
	}
	url(e = C.url) {
		return this.matches(Sn, {
			name: 'url',
			message: e,
			excludeEmptyString: !0,
		});
	}
	uuid(e = C.uuid) {
		return this.matches(Tn, {
			name: 'uuid',
			message: e,
			excludeEmptyString: !1,
		});
	}
	ensure() {
		return this.default('').transform((e) => (e === null ? '' : e));
	}
	trim(e = C.trim) {
		return this.transform((t) => (t != null ? t.trim() : t)).test({
			message: e,
			name: 'trim',
			test: kn,
		});
	}
	lowercase(e = C.lowercase) {
		return this.transform((t) => (D(t) ? t : t.toLowerCase())).test({
			message: e,
			name: 'string_case',
			exclusive: !0,
			skipAbsent: !0,
			test: (t) => D(t) || t === t.toLowerCase(),
		});
	}
	uppercase(e = C.uppercase) {
		return this.transform((t) => (D(t) ? t : t.toUpperCase())).test({
			message: e,
			name: 'string_case',
			exclusive: !0,
			skipAbsent: !0,
			test: (t) => D(t) || t === t.toUpperCase(),
		});
	}
}
Ee.prototype = ft.prototype;
var jn =
	/^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
function Dn(r) {
	var e = [1, 4, 5, 6, 7, 10, 11],
		t = 0,
		n,
		s;
	if ((s = jn.exec(r))) {
		for (var a = 0, i; (i = e[a]); ++a) s[i] = +s[i] || 0;
		(s[2] = (+s[2] || 1) - 1),
			(s[3] = +s[3] || 1),
			(s[7] = s[7] ? String(s[7]).substr(0, 3) : 0),
			(s[8] === void 0 || s[8] === '') && (s[9] === void 0 || s[9] === '')
				? (n = +new Date(s[1], s[2], s[3], s[4], s[5], s[6], s[7]))
				: (s[8] !== 'Z' &&
						s[9] !== void 0 &&
						((t = s[10] * 60 + s[11]), s[9] === '+' && (t = 0 - t)),
				  (n = Date.UTC(s[1], s[2], s[3], s[4], s[5] + t, s[6], s[7])));
	} else n = Date.parse ? Date.parse(r) : NaN;
	return n;
}
let Pn = new Date(''),
	Mn = (r) => Object.prototype.toString.call(r) === '[object Date]';
class be extends j {
	constructor() {
		super({
			type: 'date',
			check(e) {
				return Mn(e) && !isNaN(e.getTime());
			},
		}),
			this.withMutation(() => {
				this.transform((e, t, n) =>
					!n.spec.coerce || n.isType(e)
						? e
						: ((e = Dn(e)), isNaN(e) ? be.INVALID_DATE : new Date(e))
				);
			});
	}
	prepareParam(e, t) {
		let n;
		if (q.isRef(e)) n = e;
		else {
			let s = this.cast(e);
			if (!this._typeCheck(s))
				throw new TypeError(
					`\`${t}\` must be a Date or a value that can be \`cast()\` to a Date`
				);
			n = s;
		}
		return n;
	}
	min(e, t = _e.min) {
		let n = this.prepareParam(e, 'min');
		return this.test({
			message: t,
			name: 'min',
			exclusive: !0,
			params: { min: e },
			skipAbsent: !0,
			test(s) {
				return s >= this.resolve(n);
			},
		});
	}
	max(e, t = _e.max) {
		let n = this.prepareParam(e, 'max');
		return this.test({
			message: t,
			name: 'max',
			exclusive: !0,
			params: { max: e },
			skipAbsent: !0,
			test(s) {
				return s <= this.resolve(n);
			},
		});
	}
}
be.INVALID_DATE = Pn;
be.prototype;
function Rn(r, e = []) {
	let t = [],
		n = new Set(),
		s = new Set(e.map(([i, l]) => `${i}-${l}`));
	function a(i, l) {
		let u = U.split(i)[0];
		n.add(u), s.has(`${l}-${u}`) || t.push([l, u]);
	}
	for (const i of Object.keys(r)) {
		let l = r[i];
		n.add(i),
			q.isRef(l) && l.isSibling
				? a(l.path, i)
				: Me(l) && 'deps' in l && l.deps.forEach((u) => a(u, i));
	}
	return oe.array(Array.from(n), t).reverse();
}
function Xe(r, e) {
	let t = 1 / 0;
	return (
		r.some((n, s) => {
			var a;
			if ((a = e.path) != null && a.includes(n)) return (t = s), !0;
		}),
		t
	);
}
function dt(r) {
	return (e, t) => Xe(r, e) - Xe(r, t);
}
const An = (r, e, t) => {
	if (typeof r != 'string') return r;
	let n = r;
	try {
		n = JSON.parse(r);
	} catch {}
	return t.isType(n) ? n : r;
};
function ae(r) {
	if ('fields' in r) {
		const e = {};
		for (const [t, n] of Object.entries(r.fields)) e[t] = ae(n);
		return r.setFields(e);
	}
	if (r.type === 'array') {
		const e = r.optional();
		return e.innerType && (e.innerType = ae(e.innerType)), e;
	}
	return r.type === 'tuple'
		? r.optional().clone({ types: r.spec.types.map(ae) })
		: 'optional' in r
		? r.optional()
		: r;
}
const Nn = (r, e) => {
	const t = [...U.normalizePath(e)];
	if (t.length === 1) return t[0] in r;
	let n = t.pop(),
		s = U.getter(U.join(t), !0)(r);
	return !!(s && n in s);
};
let He = (r) => Object.prototype.toString.call(r) === '[object Object]';
function Vn(r, e) {
	let t = Object.keys(r.fields);
	return Object.keys(e).filter((n) => t.indexOf(n) === -1);
}
const zn = dt([]);
function ht(r) {
	return new pt(r);
}
class pt extends j {
	constructor(e) {
		super({
			type: 'object',
			check(t) {
				return He(t) || typeof t == 'function';
			},
		}),
			(this.fields = Object.create(null)),
			(this._sortErrors = zn),
			(this._nodes = []),
			(this._excludedEdges = []),
			this.withMutation(() => {
				e && this.shape(e);
			});
	}
	_cast(e, t = {}) {
		var n;
		let s = super._cast(e, t);
		if (s === void 0) return this.getDefault();
		if (!this._typeCheck(s)) return s;
		let a = this.fields,
			i = (n = t.stripUnknown) != null ? n : this.spec.noUnknown,
			l = [].concat(
				this._nodes,
				Object.keys(s).filter((f) => !this._nodes.includes(f))
			),
			u = {},
			o = Object.assign({}, t, {
				parent: u,
				__validating: t.__validating || !1,
			}),
			c = !1;
		for (const f of l) {
			let d = a[f],
				p = f in s;
			if (d) {
				let v,
					m = s[f];
				(o.path = (t.path ? `${t.path}.` : '') + f),
					(d = d.resolve({ value: m, context: t.context, parent: u }));
				let w = d instanceof j ? d.spec : void 0,
					_ = w == null ? void 0 : w.strict;
				if (w != null && w.strip) {
					c = c || f in s;
					continue;
				}
				(v = !t.__validating || !_ ? d.cast(s[f], o) : s[f]),
					v !== void 0 && (u[f] = v);
			} else p && !i && (u[f] = s[f]);
			(p !== f in u || u[f] !== s[f]) && (c = !0);
		}
		return c ? u : s;
	}
	_validate(e, t = {}, n, s) {
		let {
			from: a = [],
			originalValue: i = e,
			recursive: l = this.spec.recursive,
		} = t;
		(t.from = [{ schema: this, value: i }, ...a]),
			(t.__validating = !0),
			(t.originalValue = i),
			super._validate(e, t, n, (u, o) => {
				if (!l || !He(o)) {
					s(u, o);
					return;
				}
				i = i || o;
				let c = [];
				for (let f of this._nodes) {
					let d = this.fields[f];
					!d ||
						q.isRef(d) ||
						c.push(
							d.asNestedTest({
								options: t,
								key: f,
								parent: o,
								parentPath: t.path,
								originalParent: i,
							})
						);
				}
				this.runTests(
					{ tests: c, value: o, originalValue: i, options: t },
					n,
					(f) => {
						s(f.sort(this._sortErrors).concat(u), o);
					}
				);
			});
	}
	clone(e) {
		const t = super.clone(e);
		return (
			(t.fields = Object.assign({}, this.fields)),
			(t._nodes = this._nodes),
			(t._excludedEdges = this._excludedEdges),
			(t._sortErrors = this._sortErrors),
			t
		);
	}
	concat(e) {
		let t = super.concat(e),
			n = t.fields;
		for (let [s, a] of Object.entries(this.fields)) {
			const i = n[s];
			n[s] = i === void 0 ? a : i;
		}
		return t.withMutation((s) => s.setFields(n, this._excludedEdges));
	}
	_getDefault() {
		if ('default' in this.spec) return super._getDefault();
		if (!this._nodes.length) return;
		let e = {};
		return (
			this._nodes.forEach((t) => {
				const n = this.fields[t];
				e[t] = n && 'getDefault' in n ? n.getDefault() : void 0;
			}),
			e
		);
	}
	setFields(e, t) {
		let n = this.clone();
		return (
			(n.fields = e),
			(n._nodes = Rn(e, t)),
			(n._sortErrors = dt(Object.keys(e))),
			t && (n._excludedEdges = t),
			n
		);
	}
	shape(e, t = []) {
		return this.clone().withMutation((n) => {
			let s = n._excludedEdges;
			return (
				t.length &&
					(Array.isArray(t[0]) || (t = [t]), (s = [...n._excludedEdges, ...t])),
				n.setFields(Object.assign(n.fields, e), s)
			);
		});
	}
	partial() {
		const e = {};
		for (const [t, n] of Object.entries(this.fields))
			e[t] =
				'optional' in n && n.optional instanceof Function ? n.optional() : n;
		return this.setFields(e);
	}
	deepPartial() {
		return ae(this);
	}
	pick(e) {
		const t = {};
		for (const n of e) this.fields[n] && (t[n] = this.fields[n]);
		return this.setFields(t);
	}
	omit(e) {
		const t = Object.assign({}, this.fields);
		for (const n of e) delete t[n];
		return this.setFields(t);
	}
	from(e, t, n) {
		let s = U.getter(e, !0);
		return this.transform((a) => {
			if (!a) return a;
			let i = a;
			return (
				Nn(a, e) &&
					((i = Object.assign({}, a)), n || delete i[e], (i[t] = s(a))),
				i
			);
		});
	}
	json() {
		return this.transform(An);
	}
	noUnknown(e = !0, t = $e.noUnknown) {
		typeof e != 'boolean' && ((t = e), (e = !0));
		let n = this.test({
			name: 'noUnknown',
			exclusive: !0,
			message: t,
			test(s) {
				if (s == null) return !0;
				const a = Vn(this.schema, s);
				return (
					!e ||
					a.length === 0 ||
					this.createError({ params: { unknown: a.join(', ') } })
				);
			},
		});
		return (n.spec.noUnknown = e), n;
	}
	unknown(e = !0, t = $e.noUnknown) {
		return this.noUnknown(!e, t);
	}
	transformKeys(e) {
		return this.transform((t) => {
			if (!t) return t;
			const n = {};
			for (const s of Object.keys(t)) n[e(s)] = t[s];
			return n;
		});
	}
	camelCase() {
		return this.transformKeys(xe.camelCase);
	}
	snakeCase() {
		return this.transformKeys(xe.snakeCase);
	}
	constantCase() {
		return this.transformKeys((e) => xe.snakeCase(e).toUpperCase());
	}
	describe(e) {
		let t = super.describe(e);
		t.fields = {};
		for (const [s, a] of Object.entries(this.fields)) {
			var n;
			let i = e;
			(n = i) != null &&
				n.value &&
				(i = Object.assign({}, i, { parent: i.value, value: i.value[s] })),
				(t.fields[s] = a.describe(i));
		}
		return t;
	}
}
ht.prototype = pt.prototype;
const In = ht({
	name: Ee().required(),
	password: Ee().max(8).min(4),
	adminRights: ut(),
});
function Hn() {
	return Te(nt, {
		defaultValues: { name: '', password: '', adminRights: !1 },
		resolver: Yr(In),
		children: [
			N(Ve, { source: 'name', variant: 'outlined', sx: { width: '100%' } }),
			N(Ve, { source: 'password', variant: 'outlined', sx: { width: '100%' } }),
			N(Ce, { source: 'adminRights' }),
		],
	});
}
export { Zn as S, Hn as U, Gn as a, qn as b, Xn as u };
