import {
	bA as me,
	_ as u,
	bB as ge,
	bC as le,
	bD as ve,
	ak as j,
	bE as be,
	h as Ce,
	bF as xe,
	bG as ye,
	aQ as Re,
	bH as Se,
	bI as ce,
	bJ as _e,
	aS as De,
	bK as ke,
	bL as Me,
	aP as Pe,
	bM as $e,
	a$ as we,
	r as c,
	bN as Oe,
	N,
	P as A,
	s as g,
	b3 as Ie,
	K as F,
	b4 as Be,
	V as Te,
	Y as We,
	k as C,
	j as S,
	Q as w,
	M as U,
	bO as Ee,
	bP as Ne,
	bQ as ue,
	U as K,
	at as Ae,
	b8 as Fe,
	bR as Ue,
	X as de,
	b2 as qe,
	o as Z,
	q as ee,
	t as te,
	c as Le,
	a6 as ie,
	p,
	Z as ze,
} from './index-091859a0.js';
var je = (function (e) {
	me(t, e);
	function t(n, a) {
		var r;
		return (
			(r = e.call(this) || this),
			(r.client = n),
			r.setOptions(a),
			r.bindMethods(),
			r.updateResult(),
			r
		);
	}
	var o = t.prototype;
	return (
		(o.bindMethods = function () {
			(this.mutate = this.mutate.bind(this)),
				(this.reset = this.reset.bind(this));
		}),
		(o.setOptions = function (a) {
			this.options = this.client.defaultMutationOptions(a);
		}),
		(o.onUnsubscribe = function () {
			if (!this.listeners.length) {
				var a;
				(a = this.currentMutation) == null || a.removeObserver(this);
			}
		}),
		(o.onMutationUpdate = function (a) {
			this.updateResult();
			var r = { listeners: !0 };
			a.type === 'success'
				? (r.onSuccess = !0)
				: a.type === 'error' && (r.onError = !0),
				this.notify(r);
		}),
		(o.getCurrentResult = function () {
			return this.currentResult;
		}),
		(o.reset = function () {
			(this.currentMutation = void 0),
				this.updateResult(),
				this.notify({ listeners: !0 });
		}),
		(o.mutate = function (a, r) {
			return (
				(this.mutateOptions = r),
				this.currentMutation && this.currentMutation.removeObserver(this),
				(this.currentMutation = this.client
					.getMutationCache()
					.build(
						this.client,
						u({}, this.options, {
							variables: typeof a < 'u' ? a : this.options.variables,
						})
					)),
				this.currentMutation.addObserver(this),
				this.currentMutation.execute()
			);
		}),
		(o.updateResult = function () {
			var a = this.currentMutation ? this.currentMutation.state : ge(),
				r = u({}, a, {
					isLoading: a.status === 'loading',
					isSuccess: a.status === 'success',
					isError: a.status === 'error',
					isIdle: a.status === 'idle',
					mutate: this.mutate,
					reset: this.reset,
				});
			this.currentResult = r;
		}),
		(o.notify = function (a) {
			var r = this;
			le.batch(function () {
				r.mutateOptions &&
					(a.onSuccess
						? (r.mutateOptions.onSuccess == null ||
								r.mutateOptions.onSuccess(
									r.currentResult.data,
									r.currentResult.variables,
									r.currentResult.context
								),
						  r.mutateOptions.onSettled == null ||
								r.mutateOptions.onSettled(
									r.currentResult.data,
									null,
									r.currentResult.variables,
									r.currentResult.context
								))
						: a.onError &&
						  (r.mutateOptions.onError == null ||
								r.mutateOptions.onError(
									r.currentResult.error,
									r.currentResult.variables,
									r.currentResult.context
								),
						  r.mutateOptions.onSettled == null ||
								r.mutateOptions.onSettled(
									void 0,
									r.currentResult.error,
									r.currentResult.variables,
									r.currentResult.context
								))),
					a.listeners &&
						r.listeners.forEach(function (i) {
							i(r.currentResult);
						});
			});
		}),
		t
	);
})(ve);
function kn(e, t, o) {
	var n = j.useRef(!1),
		a = j.useState(0),
		r = a[1],
		i = be(e, t, o),
		s = Ce(),
		l = j.useRef();
	l.current ? l.current.setOptions(i) : (l.current = new je(s, i));
	var d = l.current.getCurrentResult();
	j.useEffect(function () {
		n.current = !0;
		var v = l.current.subscribe(
			le.batchCalls(function () {
				n.current &&
					r(function (h) {
						return h + 1;
					});
			})
		);
		return function () {
			(n.current = !1), v();
		};
	}, []);
	var _ = j.useCallback(function (v, h) {
		l.current.mutate(v, h).catch(xe);
	}, []);
	if (d.error && ye(void 0, l.current.options.useErrorBoundary, [d.error]))
		throw d.error;
	return u({}, d, { mutate: _, mutateAsync: d.mutate });
}
var He = Re,
	Ke = Se,
	Ye = ce;
function Xe(e, t, o) {
	for (var n = -1, a = t.length, r = {}; ++n < a; ) {
		var i = t[n],
			s = He(e, i);
		o(s, i) && Ke(r, Ye(i, e), s);
	}
	return r;
}
var Qe = Xe;
function Ve(e, t) {
	return e != null && t in Object(e);
}
var Ge = Ve,
	Je = ce,
	Ze = _e,
	et = De,
	tt = ke,
	nt = Me,
	rt = Pe;
function ot(e, t, o) {
	t = Je(t, e);
	for (var n = -1, a = t.length, r = !1; ++n < a; ) {
		var i = rt(t[n]);
		if (!(r = e != null && o(e, i))) break;
		e = e[i];
	}
	return r || ++n != a
		? r
		: ((a = e == null ? 0 : e.length),
		  !!a && nt(a) && tt(i, a) && (et(e) || Ze(e)));
}
var at = ot,
	st = Ge,
	it = at;
function lt(e, t) {
	return e != null && it(e, t, st);
}
var ct = lt,
	ut = Qe,
	dt = ct;
function pt(e, t) {
	return ut(e, t, function (o, n) {
		return dt(e, n);
	});
}
var ft = pt,
	ht = ft,
	mt = $e,
	gt = mt(function (e, t) {
		return e == null ? {} : ht(e, t);
	}),
	Mn = gt,
	E =
		(globalThis && globalThis.__spreadArray) ||
		function (e, t, o) {
			if (o || arguments.length === 2)
				for (var n = 0, a = t.length, r; n < a; n++)
					(r || !(n in t)) &&
						(r || (r = Array.prototype.slice.call(t, 0, n)), (r[n] = t[n]));
			return e.concat(r || Array.prototype.slice.call(t));
		},
	Pn = function (e) {
		var t = ''.concat(e, '.selectedIds'),
			o = we(t, vt),
			n = o[0],
			a = o[1],
			r = bt(t),
			i = c.useMemo(
				function () {
					return {
						select: function (s) {
							s && a(E([], s, !0));
						},
						unselect: function (s) {
							!s ||
								s.length === 0 ||
								a(function (l) {
									return Array.isArray(l)
										? l.filter(function (d) {
												return !s.includes(d);
										  })
										: [];
								});
						},
						toggle: function (s) {
							typeof s > 'u' ||
								a(function (l) {
									if (!Array.isArray(l)) return E([], l, !0);
									var d = l.indexOf(s);
									return d > -1
										? E(E([], l.slice(0, d), !0), l.slice(d + 1), !0)
										: E(E([], l, !0), [s], !1);
								});
						},
						clearSelection: function () {
							r();
						},
					};
				},
				[a, r]
			);
		return [n, i];
	},
	vt = [],
	bt = function (e) {
		var t = Oe().removeItem;
		return c.useCallback(
			function (o) {
				if (typeof o > 'u' && typeof e > 'u')
					throw new Error(
						'You must provide a key to remove an item from the store'
					);
				return t(o ?? e);
			},
			[t, e]
		);
	};
function Ct(e) {
	return N('PrivateSwitchBase', e);
}
A('PrivateSwitchBase', [
	'root',
	'checked',
	'disabled',
	'input',
	'edgeStart',
	'edgeEnd',
]);
const xt = [
		'autoFocus',
		'checked',
		'checkedIcon',
		'className',
		'defaultChecked',
		'disabled',
		'disableFocusRipple',
		'edge',
		'icon',
		'id',
		'inputProps',
		'inputRef',
		'name',
		'onBlur',
		'onChange',
		'onFocus',
		'readOnly',
		'required',
		'tabIndex',
		'type',
		'value',
	],
	yt = (e) => {
		const { classes: t, checked: o, disabled: n, edge: a } = e,
			r = {
				root: ['root', o && 'checked', n && 'disabled', a && `edge${w(a)}`],
				input: ['input'],
			};
		return U(r, Ct, t);
	},
	Rt = g(Ie)(({ ownerState: e }) =>
		u(
			{ padding: 9, borderRadius: '50%' },
			e.edge === 'start' && { marginLeft: e.size === 'small' ? -3 : -12 },
			e.edge === 'end' && { marginRight: e.size === 'small' ? -3 : -12 }
		)
	),
	St = g('input')({
		cursor: 'inherit',
		position: 'absolute',
		opacity: 0,
		width: '100%',
		height: '100%',
		top: 0,
		left: 0,
		margin: 0,
		padding: 0,
		zIndex: 1,
	}),
	_t = c.forwardRef(function (t, o) {
		const {
				autoFocus: n,
				checked: a,
				checkedIcon: r,
				className: i,
				defaultChecked: s,
				disabled: l,
				disableFocusRipple: d = !1,
				edge: _ = !1,
				icon: v,
				id: h,
				inputProps: O,
				inputRef: I,
				name: q,
				onBlur: D,
				onChange: k,
				onFocus: M,
				readOnly: B,
				required: $ = !1,
				tabIndex: T,
				type: P,
				value: b,
			} = t,
			L = F(t, xt),
			[W, m] = Be({
				controlled: a,
				default: !!s,
				name: 'SwitchBase',
				state: 'checked',
			}),
			f = Te(),
			z = (R) => {
				M && M(R), f && f.onFocus && f.onFocus(R);
			},
			X = (R) => {
				D && D(R), f && f.onBlur && f.onBlur(R);
			},
			Q = (R) => {
				if (R.nativeEvent.defaultPrevented) return;
				const se = R.target.checked;
				m(se), k && k(R, se);
			};
		let x = l;
		f && typeof x > 'u' && (x = f.disabled);
		const V = P === 'checkbox' || P === 'radio',
			y = u({}, t, { checked: W, disabled: x, disableFocusRipple: d, edge: _ }),
			ae = yt(y);
		return We(
			Rt,
			u(
				{
					component: 'span',
					className: S(ae.root, i),
					centerRipple: !0,
					focusRipple: !d,
					disabled: x,
					tabIndex: null,
					role: void 0,
					onFocus: z,
					onBlur: X,
					ownerState: y,
					ref: o,
				},
				L,
				{
					children: [
						C(
							St,
							u(
								{
									autoFocus: n,
									checked: a,
									defaultChecked: s,
									className: ae.input,
									disabled: x,
									id: V ? h : void 0,
									name: q,
									onChange: Q,
									readOnly: B,
									ref: I,
									required: $,
									ownerState: y,
									tabIndex: T,
									type: P,
								},
								P === 'checkbox' && b === void 0 ? {} : { value: b },
								O
							)
						),
						W ? r : v,
					],
				}
			)
		);
	}),
	$n = _t;
function Dt(e) {
	return N('MuiDialog', e);
}
const kt = A('MuiDialog', [
		'root',
		'scrollPaper',
		'scrollBody',
		'container',
		'paper',
		'paperScrollPaper',
		'paperScrollBody',
		'paperWidthFalse',
		'paperWidthXs',
		'paperWidthSm',
		'paperWidthMd',
		'paperWidthLg',
		'paperWidthXl',
		'paperFullWidth',
		'paperFullScreen',
	]),
	G = kt,
	Mt = c.createContext({}),
	pe = Mt,
	Pt = [
		'aria-describedby',
		'aria-labelledby',
		'BackdropComponent',
		'BackdropProps',
		'children',
		'className',
		'disableEscapeKeyDown',
		'fullScreen',
		'fullWidth',
		'maxWidth',
		'onBackdropClick',
		'onClose',
		'open',
		'PaperComponent',
		'PaperProps',
		'scroll',
		'TransitionComponent',
		'transitionDuration',
		'TransitionProps',
	],
	$t = g(Ee, {
		name: 'MuiDialog',
		slot: 'Backdrop',
		overrides: (e, t) => t.backdrop,
	})({ zIndex: -1 }),
	wt = (e) => {
		const {
				classes: t,
				scroll: o,
				maxWidth: n,
				fullWidth: a,
				fullScreen: r,
			} = e,
			i = {
				root: ['root'],
				container: ['container', `scroll${w(o)}`],
				paper: [
					'paper',
					`paperScroll${w(o)}`,
					`paperWidth${w(String(n))}`,
					a && 'paperFullWidth',
					r && 'paperFullScreen',
				],
			};
		return U(i, Dt, t);
	},
	Ot = g(Ne, {
		name: 'MuiDialog',
		slot: 'Root',
		overridesResolver: (e, t) => t.root,
	})({ '@media print': { position: 'absolute !important' } }),
	It = g('div', {
		name: 'MuiDialog',
		slot: 'Container',
		overridesResolver: (e, t) => {
			const { ownerState: o } = e;
			return [t.container, t[`scroll${w(o.scroll)}`]];
		},
	})(({ ownerState: e }) =>
		u(
			{ height: '100%', '@media print': { height: 'auto' }, outline: 0 },
			e.scroll === 'paper' && {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},
			e.scroll === 'body' && {
				overflowY: 'auto',
				overflowX: 'hidden',
				textAlign: 'center',
				'&:after': {
					content: '""',
					display: 'inline-block',
					verticalAlign: 'middle',
					height: '100%',
					width: '0',
				},
			}
		)
	),
	Bt = g(ue, {
		name: 'MuiDialog',
		slot: 'Paper',
		overridesResolver: (e, t) => {
			const { ownerState: o } = e;
			return [
				t.paper,
				t[`scrollPaper${w(o.scroll)}`],
				t[`paperWidth${w(String(o.maxWidth))}`],
				o.fullWidth && t.paperFullWidth,
				o.fullScreen && t.paperFullScreen,
			];
		},
	})(({ theme: e, ownerState: t }) =>
		u(
			{
				margin: 32,
				position: 'relative',
				overflowY: 'auto',
				'@media print': { overflowY: 'visible', boxShadow: 'none' },
			},
			t.scroll === 'paper' && {
				display: 'flex',
				flexDirection: 'column',
				maxHeight: 'calc(100% - 64px)',
			},
			t.scroll === 'body' && {
				display: 'inline-block',
				verticalAlign: 'middle',
				textAlign: 'left',
			},
			!t.maxWidth && { maxWidth: 'calc(100% - 64px)' },
			t.maxWidth === 'xs' && {
				maxWidth:
					e.breakpoints.unit === 'px'
						? Math.max(e.breakpoints.values.xs, 444)
						: `${e.breakpoints.values.xs}${e.breakpoints.unit}`,
				[`&.${G.paperScrollBody}`]: {
					[e.breakpoints.down(Math.max(e.breakpoints.values.xs, 444) + 32 * 2)]:
						{ maxWidth: 'calc(100% - 64px)' },
				},
			},
			t.maxWidth &&
				t.maxWidth !== 'xs' && {
					maxWidth: `${e.breakpoints.values[t.maxWidth]}${e.breakpoints.unit}`,
					[`&.${G.paperScrollBody}`]: {
						[e.breakpoints.down(e.breakpoints.values[t.maxWidth] + 32 * 2)]: {
							maxWidth: 'calc(100% - 64px)',
						},
					},
				},
			t.fullWidth && { width: 'calc(100% - 64px)' },
			t.fullScreen && {
				margin: 0,
				width: '100%',
				maxWidth: '100%',
				height: '100%',
				maxHeight: 'none',
				borderRadius: 0,
				[`&.${G.paperScrollBody}`]: { margin: 0, maxWidth: '100%' },
			}
		)
	),
	Tt = c.forwardRef(function (t, o) {
		const n = K({ props: t, name: 'MuiDialog' }),
			a = Ae(),
			r = {
				enter: a.transitions.duration.enteringScreen,
				exit: a.transitions.duration.leavingScreen,
			},
			{
				'aria-describedby': i,
				'aria-labelledby': s,
				BackdropComponent: l,
				BackdropProps: d,
				children: _,
				className: v,
				disableEscapeKeyDown: h = !1,
				fullScreen: O = !1,
				fullWidth: I = !1,
				maxWidth: q = 'sm',
				onBackdropClick: D,
				onClose: k,
				open: M,
				PaperComponent: B = ue,
				PaperProps: $ = {},
				scroll: T = 'paper',
				TransitionComponent: P = Ue,
				transitionDuration: b = r,
				TransitionProps: L,
			} = n,
			W = F(n, Pt),
			m = u({}, n, {
				disableEscapeKeyDown: h,
				fullScreen: O,
				fullWidth: I,
				maxWidth: q,
				scroll: T,
			}),
			f = wt(m),
			z = c.useRef(),
			X = (y) => {
				z.current = y.target === y.currentTarget;
			},
			Q = (y) => {
				z.current &&
					((z.current = null), D && D(y), k && k(y, 'backdropClick'));
			},
			x = Fe(s),
			V = c.useMemo(() => ({ titleId: x }), [x]);
		return C(
			Ot,
			u(
				{
					className: S(f.root, v),
					closeAfterTransition: !0,
					components: { Backdrop: $t },
					componentsProps: { backdrop: u({ transitionDuration: b, as: l }, d) },
					disableEscapeKeyDown: h,
					onClose: k,
					open: M,
					ref: o,
					onClick: Q,
					ownerState: m,
				},
				W,
				{
					children: C(
						P,
						u({ appear: !0, in: M, timeout: b, role: 'presentation' }, L, {
							children: C(It, {
								className: S(f.container),
								onMouseDown: X,
								ownerState: m,
								children: C(
									Bt,
									u(
										{
											as: B,
											elevation: 24,
											role: 'dialog',
											'aria-describedby': i,
											'aria-labelledby': x,
										},
										$,
										{
											className: S(f.paper, $.className),
											ownerState: m,
											children: C(pe.Provider, { value: V, children: _ }),
										}
									)
								),
							}),
						})
					),
				}
			)
		);
	}),
	Wt = Tt;
function Et(e) {
	return N('MuiDialogActions', e);
}
A('MuiDialogActions', ['root', 'spacing']);
const Nt = ['className', 'disableSpacing'],
	At = (e) => {
		const { classes: t, disableSpacing: o } = e;
		return U({ root: ['root', !o && 'spacing'] }, Et, t);
	},
	Ft = g('div', {
		name: 'MuiDialogActions',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: o } = e;
			return [t.root, !o.disableSpacing && t.spacing];
		},
	})(({ ownerState: e }) =>
		u(
			{
				display: 'flex',
				alignItems: 'center',
				padding: 8,
				justifyContent: 'flex-end',
				flex: '0 0 auto',
			},
			!e.disableSpacing && { '& > :not(:first-of-type)': { marginLeft: 8 } }
		)
	),
	Ut = c.forwardRef(function (t, o) {
		const n = K({ props: t, name: 'MuiDialogActions' }),
			{ className: a, disableSpacing: r = !1 } = n,
			i = F(n, Nt),
			s = u({}, n, { disableSpacing: r }),
			l = At(s);
		return C(Ft, u({ className: S(l.root, a), ownerState: s, ref: o }, i));
	}),
	qt = Ut;
function Lt(e) {
	return N('MuiDialogContent', e);
}
A('MuiDialogContent', ['root', 'dividers']);
function zt(e) {
	return N('MuiDialogTitle', e);
}
const jt = A('MuiDialogTitle', ['root']),
	Ht = jt,
	Kt = ['className', 'dividers'],
	Yt = (e) => {
		const { classes: t, dividers: o } = e;
		return U({ root: ['root', o && 'dividers'] }, Lt, t);
	},
	Xt = g('div', {
		name: 'MuiDialogContent',
		slot: 'Root',
		overridesResolver: (e, t) => {
			const { ownerState: o } = e;
			return [t.root, o.dividers && t.dividers];
		},
	})(({ theme: e, ownerState: t }) =>
		u(
			{
				flex: '1 1 auto',
				WebkitOverflowScrolling: 'touch',
				overflowY: 'auto',
				padding: '20px 24px',
			},
			t.dividers
				? {
						padding: '16px 24px',
						borderTop: `1px solid ${(e.vars || e).palette.divider}`,
						borderBottom: `1px solid ${(e.vars || e).palette.divider}`,
				  }
				: { [`.${Ht.root} + &`]: { paddingTop: 0 } }
		)
	),
	Qt = c.forwardRef(function (t, o) {
		const n = K({ props: t, name: 'MuiDialogContent' }),
			{ className: a, dividers: r = !1 } = n,
			i = F(n, Kt),
			s = u({}, n, { dividers: r }),
			l = Yt(s);
		return C(Xt, u({ className: S(l.root, a), ownerState: s, ref: o }, i));
	}),
	Vt = Qt;
function Gt(e) {
	return N('MuiDialogContentText', e);
}
A('MuiDialogContentText', ['root']);
const Jt = ['children', 'className'],
	Zt = (e) => {
		const { classes: t } = e,
			n = U({ root: ['root'] }, Gt, t);
		return u({}, t, n);
	},
	en = g(de, {
		shouldForwardProp: (e) => qe(e) || e === 'classes',
		name: 'MuiDialogContentText',
		slot: 'Root',
		overridesResolver: (e, t) => t.root,
	})({}),
	tn = c.forwardRef(function (t, o) {
		const n = K({ props: t, name: 'MuiDialogContentText' }),
			{ className: a } = n,
			r = F(n, Jt),
			i = Zt(r);
		return C(
			en,
			u(
				{
					component: 'p',
					variant: 'body1',
					color: 'text.secondary',
					ref: o,
					ownerState: r,
					className: S(i.root, a),
				},
				n,
				{ classes: i }
			)
		);
	}),
	nn = tn,
	rn = ['className', 'id'],
	on = (e) => {
		const { classes: t } = e;
		return U({ root: ['root'] }, zt, t);
	},
	an = g(de, {
		name: 'MuiDialogTitle',
		slot: 'Root',
		overridesResolver: (e, t) => t.root,
	})({ padding: '16px 24px', flex: '0 0 auto' }),
	sn = c.forwardRef(function (t, o) {
		const n = K({ props: t, name: 'MuiDialogTitle' }),
			{ className: a, id: r } = n,
			i = F(n, rn),
			s = n,
			l = on(s),
			{ titleId: d = r } = c.useContext(pe);
		return C(
			an,
			u(
				{
					component: 'h2',
					className: S(l.root, a),
					ownerState: s,
					ref: o,
					variant: 'h6',
					id: r ?? d,
				},
				i
			)
		);
	}),
	ln = sn;
var ne = {},
	cn = ee;
Object.defineProperty(ne, '__esModule', { value: !0 });
var un = (ne.default = void 0),
	dn = cn(Z()),
	pn = te,
	fn = (0, dn.default)(
		(0, pn.jsx)('path', {
			d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
		}),
		'Delete'
	);
un = ne.default = fn;
var re = {},
	hn = ee;
Object.defineProperty(re, '__esModule', { value: !0 });
var fe = (re.default = void 0),
	mn = hn(Z()),
	gn = te,
	vn = (0, mn.default)(
		(0, gn.jsx)('path', {
			d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
		}),
		'CheckCircle'
	);
fe = re.default = vn;
var oe = {},
	bn = ee;
Object.defineProperty(oe, '__esModule', { value: !0 });
var he = (oe.default = void 0),
	Cn = bn(Z()),
	xn = te,
	yn = (0, Cn.default)(
		(0, xn.jsx)('path', {
			d: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
		}),
		'ErrorOutline'
	);
he = oe.default = yn;
var H =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(H =
					Object.assign ||
					function (e) {
						for (var t, o = 1, n = arguments.length; o < n; o++) {
							t = arguments[o];
							for (var a in t)
								Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
						}
						return e;
					}),
				H.apply(this, arguments)
			);
		},
	Rn =
		(globalThis && globalThis.__rest) ||
		function (e, t) {
			var o = {};
			for (var n in e)
				Object.prototype.hasOwnProperty.call(e, n) &&
					t.indexOf(n) < 0 &&
					(o[n] = e[n]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var a = 0, n = Object.getOwnPropertySymbols(e); a < n.length; a++)
					t.indexOf(n[a]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, n[a]) &&
						(o[n[a]] = e[n[a]]);
			return o;
		},
	Sn = function (e) {
		var t,
			o = e.className,
			n = e.isOpen,
			a = n === void 0 ? !1 : n,
			r = e.loading,
			i = e.title,
			s = e.content,
			l = e.cancel,
			d = l === void 0 ? 'ra.action.cancel' : l,
			_ = e.confirm,
			v = _ === void 0 ? 'ra.action.confirm' : _,
			h = e.confirmColor,
			O = h === void 0 ? 'primary' : h,
			I = e.ConfirmIcon,
			q = I === void 0 ? fe : I,
			D = e.CancelIcon,
			k = D === void 0 ? he : D,
			M = e.onClose,
			B = e.onConfirm,
			$ = e.translateOptions,
			T = $ === void 0 ? {} : $,
			P = Rn(e, [
				'className',
				'isOpen',
				'loading',
				'title',
				'content',
				'cancel',
				'confirm',
				'confirmColor',
				'ConfirmIcon',
				'CancelIcon',
				'onClose',
				'onConfirm',
				'translateOptions',
			]),
			b = Le(),
			L = c.useCallback(
				function (m) {
					m.stopPropagation(), B(m);
				},
				[B]
			),
			W = c.useCallback(function (m) {
				m.stopPropagation();
			}, []);
		return c.createElement(
			_n,
			H(
				{
					className: o,
					open: a,
					onClose: M,
					onClick: W,
					'aria-labelledby': 'alert-dialog-title',
				},
				P
			),
			c.createElement(ln, { id: 'alert-dialog-title' }, b(i, H({ _: i }, T))),
			c.createElement(
				Vt,
				null,
				typeof s == 'string'
					? c.createElement(nn, null, b(s, H({ _: s }, T)))
					: s
			),
			c.createElement(
				qt,
				null,
				c.createElement(
					ie,
					{ disabled: r, onClick: M, startIcon: c.createElement(k, null) },
					b(d, { _: d })
				),
				c.createElement(
					ie,
					{
						disabled: r,
						onClick: L,
						className: S(
							'ra-confirm',
							((t = {}),
							(t[Y.confirmWarning] = O === 'warning'),
							(t[Y.confirmPrimary] = O === 'primary'),
							t)
						),
						autoFocus: !0,
						startIcon: c.createElement(q, null),
					},
					b(v, { _: v })
				)
			)
		);
	};
Sn.propTypes = {
	cancel: p.string,
	className: p.string,
	confirm: p.string,
	confirmColor: p.string,
	ConfirmIcon: p.elementType,
	CancelIcon: p.elementType,
	content: p.node.isRequired,
	isOpen: p.bool,
	loading: p.bool,
	onClose: p.func.isRequired,
	onConfirm: p.func.isRequired,
	title: p.string.isRequired,
	sx: p.any,
};
var J = 'RaConfirm',
	Y = {
		confirmPrimary: ''.concat(J, '-confirmPrimary'),
		confirmWarning: ''.concat(J, '-confirmWarning'),
	},
	_n = g(Wt, {
		name: J,
		overridesResolver: function (e, t) {
			return t.root;
		},
	})(function (e) {
		var t,
			o = e.theme;
		return (
			(t = {}),
			(t['& .'.concat(Y.confirmPrimary)] = { color: o.palette.primary.main }),
			(t['& .'.concat(Y.confirmWarning)] = {
				color: o.palette.error.main,
				'&:hover': {
					backgroundColor: ze(o.palette.error.main, 0.12),
					'@media (hover: none)': { backgroundColor: 'transparent' },
				},
			}),
			t
		);
	});
export {
	Sn as C,
	Wt as D,
	$n as S,
	Qe as _,
	Pn as a,
	ln as b,
	Vt as c,
	un as d,
	qt as e,
	nn as f,
	ct as h,
	Mn as p,
	kn as u,
};
