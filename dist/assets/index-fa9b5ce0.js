var q = {},
	D = (c) =>
		encodeURIComponent(c).replace(
			/[!'()*]/g,
			(i) => `%${i.charCodeAt(0).toString(16).toUpperCase()}`
		),
	$ = '%[a-f0-9]{2}',
	w = new RegExp('(' + $ + ')|([^%]+?)', 'gi'),
	N = new RegExp('(' + $ + ')+', 'gi');
function b(c, i) {
	try {
		return [decodeURIComponent(c.join(''))];
	} catch {}
	if (c.length === 1) return c;
	i = i || 1;
	var d = c.slice(0, i),
		l = c.slice(i);
	return Array.prototype.concat.call([], b(d), b(l));
}
function R(c) {
	try {
		return decodeURIComponent(c);
	} catch {
		for (var i = c.match(w) || [], d = 1; d < i.length; d++)
			(c = b(i, d).join('')), (i = c.match(w) || []);
		return c;
	}
}
function V(c) {
	for (var i = { '%FE%FF': '��', '%FF%FE': '��' }, d = N.exec(c); d; ) {
		try {
			i[d[0]] = decodeURIComponent(d[0]);
		} catch {
			var l = R(d[0]);
			l !== d[0] && (i[d[0]] = l);
		}
		d = N.exec(c);
	}
	i['%C2'] = '�';
	for (var h = Object.keys(i), F = 0; F < h.length; F++) {
		var m = h[F];
		c = c.replace(new RegExp(m, 'g'), i[m]);
	}
	return c;
}
var B = function (c) {
		if (typeof c != 'string')
			throw new TypeError(
				'Expected `encodedURI` to be of type `string`, got `' + typeof c + '`'
			);
		try {
			return (c = c.replace(/\+/g, ' ')), decodeURIComponent(c);
		} catch {
			return V(c);
		}
	},
	L = (c, i) => {
		if (!(typeof c == 'string' && typeof i == 'string'))
			throw new TypeError('Expected the arguments to be of type `string`');
		if (i === '') return [c];
		const d = c.indexOf(i);
		return d === -1 ? [c] : [c.slice(0, d), c.slice(d + i.length)];
	},
	M = function (c, i) {
		for (
			var d = {}, l = Object.keys(c), h = Array.isArray(i), F = 0;
			F < l.length;
			F++
		) {
			var m = l[F],
				o = c[m];
			(h ? i.indexOf(m) !== -1 : i(m, o, c)) && (d[m] = o);
		}
		return d;
	};
(function (c) {
	const i = D,
		d = B,
		l = L,
		h = M,
		F = (r) => r == null,
		m = Symbol('encodeFragmentIdentifier');
	function o(r) {
		switch (r.arrayFormat) {
			case 'index':
				return (e) => (n, t) => {
					const a = n.length;
					return t === void 0 ||
						(r.skipNull && t === null) ||
						(r.skipEmptyString && t === '')
						? n
						: t === null
						? [...n, [u(e, r), '[', a, ']'].join('')]
						: [...n, [u(e, r), '[', u(a, r), ']=', u(t, r)].join('')];
				};
			case 'bracket':
				return (e) => (n, t) =>
					t === void 0 ||
					(r.skipNull && t === null) ||
					(r.skipEmptyString && t === '')
						? n
						: t === null
						? [...n, [u(e, r), '[]'].join('')]
						: [...n, [u(e, r), '[]=', u(t, r)].join('')];
			case 'colon-list-separator':
				return (e) => (n, t) =>
					t === void 0 ||
					(r.skipNull && t === null) ||
					(r.skipEmptyString && t === '')
						? n
						: t === null
						? [...n, [u(e, r), ':list='].join('')]
						: [...n, [u(e, r), ':list=', u(t, r)].join('')];
			case 'comma':
			case 'separator':
			case 'bracket-separator': {
				const e = r.arrayFormat === 'bracket-separator' ? '[]=' : '=';
				return (n) => (t, a) =>
					a === void 0 ||
					(r.skipNull && a === null) ||
					(r.skipEmptyString && a === '')
						? t
						: ((a = a === null ? '' : a),
						  t.length === 0
								? [[u(n, r), e, u(a, r)].join('')]
								: [[t, u(a, r)].join(r.arrayFormatSeparator)]);
			}
			default:
				return (e) => (n, t) =>
					t === void 0 ||
					(r.skipNull && t === null) ||
					(r.skipEmptyString && t === '')
						? n
						: t === null
						? [...n, u(e, r)]
						: [...n, [u(e, r), '=', u(t, r)].join('')];
		}
	}
	function U(r) {
		let e;
		switch (r.arrayFormat) {
			case 'index':
				return (n, t, a) => {
					if (
						((e = /\[(\d*)\]$/.exec(n)), (n = n.replace(/\[\d*\]$/, '')), !e)
					) {
						a[n] = t;
						return;
					}
					a[n] === void 0 && (a[n] = {}), (a[n][e[1]] = t);
				};
			case 'bracket':
				return (n, t, a) => {
					if (((e = /(\[\])$/.exec(n)), (n = n.replace(/\[\]$/, '')), !e)) {
						a[n] = t;
						return;
					}
					if (a[n] === void 0) {
						a[n] = [t];
						return;
					}
					a[n] = [].concat(a[n], t);
				};
			case 'colon-list-separator':
				return (n, t, a) => {
					if (((e = /(:list)$/.exec(n)), (n = n.replace(/:list$/, '')), !e)) {
						a[n] = t;
						return;
					}
					if (a[n] === void 0) {
						a[n] = [t];
						return;
					}
					a[n] = [].concat(a[n], t);
				};
			case 'comma':
			case 'separator':
				return (n, t, a) => {
					const s = typeof t == 'string' && t.includes(r.arrayFormatSeparator),
						f =
							typeof t == 'string' &&
							!s &&
							y(t, r).includes(r.arrayFormatSeparator);
					t = f ? y(t, r) : t;
					const g =
						s || f
							? t.split(r.arrayFormatSeparator).map((I) => y(I, r))
							: t === null
							? t
							: y(t, r);
					a[n] = g;
				};
			case 'bracket-separator':
				return (n, t, a) => {
					const s = /(\[\])$/.test(n);
					if (((n = n.replace(/\[\]$/, '')), !s)) {
						a[n] = t && y(t, r);
						return;
					}
					const f =
						t === null
							? []
							: t.split(r.arrayFormatSeparator).map((g) => y(g, r));
					if (a[n] === void 0) {
						a[n] = f;
						return;
					}
					a[n] = [].concat(a[n], f);
				};
			default:
				return (n, t, a) => {
					if (a[n] === void 0) {
						a[n] = t;
						return;
					}
					a[n] = [].concat(a[n], t);
				};
		}
	}
	function O(r) {
		if (typeof r != 'string' || r.length !== 1)
			throw new TypeError(
				'arrayFormatSeparator must be single character string'
			);
	}
	function u(r, e) {
		return e.encode ? (e.strict ? i(r) : encodeURIComponent(r)) : r;
	}
	function y(r, e) {
		return e.decode ? d(r) : r;
	}
	function S(r) {
		return Array.isArray(r)
			? r.sort()
			: typeof r == 'object'
			? S(Object.keys(r))
					.sort((e, n) => Number(e) - Number(n))
					.map((e) => r[e])
			: r;
	}
	function j(r) {
		const e = r.indexOf('#');
		return e !== -1 && (r = r.slice(0, e)), r;
	}
	function x(r) {
		let e = '';
		const n = r.indexOf('#');
		return n !== -1 && (e = r.slice(n)), e;
	}
	function A(r) {
		r = j(r);
		const e = r.indexOf('?');
		return e === -1 ? '' : r.slice(e + 1);
	}
	function E(r, e) {
		return (
			e.parseNumbers &&
			!Number.isNaN(Number(r)) &&
			typeof r == 'string' &&
			r.trim() !== ''
				? (r = Number(r))
				: e.parseBooleans &&
				  r !== null &&
				  (r.toLowerCase() === 'true' || r.toLowerCase() === 'false') &&
				  (r = r.toLowerCase() === 'true'),
			r
		);
	}
	function C(r, e) {
		(e = Object.assign(
			{
				decode: !0,
				sort: !0,
				arrayFormat: 'none',
				arrayFormatSeparator: ',',
				parseNumbers: !1,
				parseBooleans: !1,
			},
			e
		)),
			O(e.arrayFormatSeparator);
		const n = U(e),
			t = Object.create(null);
		if (typeof r != 'string' || ((r = r.trim().replace(/^[?#&]/, '')), !r))
			return t;
		for (const a of r.split('&')) {
			if (a === '') continue;
			let [s, f] = l(e.decode ? a.replace(/\+/g, ' ') : a, '=');
			(f =
				f === void 0
					? null
					: ['comma', 'separator', 'bracket-separator'].includes(e.arrayFormat)
					? f
					: y(f, e)),
				n(y(s, e), f, t);
		}
		for (const a of Object.keys(t)) {
			const s = t[a];
			if (typeof s == 'object' && s !== null)
				for (const f of Object.keys(s)) s[f] = E(s[f], e);
			else t[a] = E(s, e);
		}
		return e.sort === !1
			? t
			: (e.sort === !0
					? Object.keys(t).sort()
					: Object.keys(t).sort(e.sort)
			  ).reduce((a, s) => {
					const f = t[s];
					return (
						f && typeof f == 'object' && !Array.isArray(f)
							? (a[s] = S(f))
							: (a[s] = f),
						a
					);
			  }, Object.create(null));
	}
	(c.extract = A),
		(c.parse = C),
		(c.stringify = (r, e) => {
			if (!r) return '';
			(e = Object.assign(
				{
					encode: !0,
					strict: !0,
					arrayFormat: 'none',
					arrayFormatSeparator: ',',
				},
				e
			)),
				O(e.arrayFormatSeparator);
			const n = (f) =>
					(e.skipNull && F(r[f])) || (e.skipEmptyString && r[f] === ''),
				t = o(e),
				a = {};
			for (const f of Object.keys(r)) n(f) || (a[f] = r[f]);
			const s = Object.keys(a);
			return (
				e.sort !== !1 && s.sort(e.sort),
				s
					.map((f) => {
						const g = r[f];
						return g === void 0
							? ''
							: g === null
							? u(f, e)
							: Array.isArray(g)
							? g.length === 0 && e.arrayFormat === 'bracket-separator'
								? u(f, e) + '[]'
								: g.reduce(t(f), []).join('&')
							: u(f, e) + '=' + u(g, e);
					})
					.filter((f) => f.length > 0)
					.join('&')
			);
		}),
		(c.parseUrl = (r, e) => {
			e = Object.assign({ decode: !0 }, e);
			const [n, t] = l(r, '#');
			return Object.assign(
				{ url: n.split('?')[0] || '', query: C(A(r), e) },
				e && e.parseFragmentIdentifier && t
					? { fragmentIdentifier: y(t, e) }
					: {}
			);
		}),
		(c.stringifyUrl = (r, e) => {
			e = Object.assign({ encode: !0, strict: !0, [m]: !0 }, e);
			const n = j(r.url).split('?')[0] || '',
				t = c.extract(r.url),
				a = c.parse(t, { sort: !1 }),
				s = Object.assign(a, r.query);
			let f = c.stringify(s, e);
			f && (f = `?${f}`);
			let g = x(r.url);
			return (
				r.fragmentIdentifier &&
					(g = `#${e[m] ? u(r.fragmentIdentifier, e) : r.fragmentIdentifier}`),
				`${n}${f}${g}`
			);
		}),
		(c.pick = (r, e, n) => {
			n = Object.assign({ parseFragmentIdentifier: !0, [m]: !1 }, n);
			const { url: t, query: a, fragmentIdentifier: s } = c.parseUrl(r, n);
			return c.stringifyUrl(
				{ url: t, query: h(a, e), fragmentIdentifier: s },
				n
			);
		}),
		(c.exclude = (r, e, n) => {
			const t = Array.isArray(e) ? (a) => !e.includes(a) : (a, s) => !e(a, s);
			return c.pick(r, t, n);
		});
})(q);
export { q };
