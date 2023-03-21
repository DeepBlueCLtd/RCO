import { p as s, r as c, v as f, an as m, X as i } from './index-091859a0.js';
var u = {
		sortBy: s.string,
		sortByOrder: s.oneOf(['ASC', 'DESC']),
		source: s.string,
		label: s.oneOfType([s.string, s.element, s.bool]),
		sortable: s.bool,
		className: s.string,
		cellClassName: s.string,
		headerClassName: s.string,
		textAlign: s.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
		emptyText: s.string,
	},
	g =
		(globalThis && globalThis.__rest) ||
		function (e, l) {
			var o = {};
			for (var r in e)
				Object.prototype.hasOwnProperty.call(e, r) &&
					l.indexOf(r) < 0 &&
					(o[r] = e[r]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var t = 0, r = Object.getOwnPropertySymbols(e); t < r.length; t++)
					l.indexOf(r[t]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, r[t]) &&
						(o[r[t]] = e[r[t]]);
			return o;
		},
	b = function (e) {
		e.cellClassName,
			e.className,
			e.emptyText,
			e.formClassName,
			e.fullWidth,
			e.headerClassName,
			e.label,
			e.linkType,
			e.link,
			e.locale,
			e.record,
			e.refetch,
			e.resource,
			e.sortable,
			e.sortBy,
			e.sortByOrder,
			e.source,
			e.textAlign,
			e.translateChoice;
		var l = g(e, [
			'cellClassName',
			'className',
			'emptyText',
			'formClassName',
			'fullWidth',
			'headerClassName',
			'label',
			'linkType',
			'link',
			'locale',
			'record',
			'refetch',
			'resource',
			'sortable',
			'sortBy',
			'sortByOrder',
			'source',
			'textAlign',
			'translateChoice',
		]);
		return l;
	},
	a =
		(globalThis && globalThis.__assign) ||
		function () {
			return (
				(a =
					Object.assign ||
					function (e) {
						for (var l, o = 1, r = arguments.length; o < r; o++) {
							l = arguments[o];
							for (var t in l)
								Object.prototype.hasOwnProperty.call(l, t) && (e[t] = l[t]);
						}
						return e;
					}),
				a.apply(this, arguments)
			);
		},
	O =
		(globalThis && globalThis.__rest) ||
		function (e, l) {
			var o = {};
			for (var r in e)
				Object.prototype.hasOwnProperty.call(e, r) &&
					l.indexOf(r) < 0 &&
					(o[r] = e[r]);
			if (e != null && typeof Object.getOwnPropertySymbols == 'function')
				for (var t = 0, r = Object.getOwnPropertySymbols(e); t < r.length; t++)
					l.indexOf(r[t]) < 0 &&
						Object.prototype.propertyIsEnumerable.call(e, r[t]) &&
						(o[r[t]] = e[r[t]]);
			return o;
		},
	y = c.memo(function (e) {
		var l = e.className,
			o = e.source,
			r = e.emptyText,
			t = O(e, ['className', 'source', 'emptyText']),
			p = f(e),
			n = m(p, o);
		return c.createElement(
			i,
			a({ component: 'span', variant: 'body2', className: l }, b(t)),
			n != null && typeof n != 'string' ? JSON.stringify(n) : n || r
		);
	});
y.displayName = 'TextField';
y.propTypes = a(a({}, i.propTypes), u);
export { y as T, u as f, b as s };
