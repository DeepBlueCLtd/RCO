import { r as s, p as t, s as i, ae as l } from './index-091859a0.js';
var o =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(o =
					Object.assign ||
					function (e) {
						for (var r, a = 1, p = arguments.length; a < p; a++) {
							r = arguments[a];
							for (var n in r)
								Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
						}
						return e;
					}),
				o.apply(this, arguments)
			);
		},
	g = function (e) {
		return s.createElement(c, o({}, e));
	};
g.propTypes = { children: t.node, className: t.string };
var d = 'RaTopToolbar',
	c = i(l, {
		name: d,
		overridesResolver: function (e, r) {
			return r.root;
		},
	})(function (e) {
		var r,
			a = e.theme;
		return (
			(r = {
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'flex-end',
				gap: a.spacing(1),
				whiteSpace: 'nowrap',
				flex: '0 1 auto',
				minHeight: a.spacing(8),
			}),
			(r[a.breakpoints.up('md')] = {
				padding: a.spacing(0.5),
				paddingTop: a.spacing(1),
			}),
			(r[a.breakpoints.down('md')] = {
				flex: '0 1 100%',
				padding: a.spacing(0.5),
				paddingBottom: a.spacing(1),
			}),
			(r[a.breakpoints.down('sm')] = {
				backgroundColor: a.palette.background.paper,
			}),
			r
		);
	});
export { g as T };
