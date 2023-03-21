import { am as m } from './index-091859a0.js';
import { a as o } from './useResourceDefinition-e2399b95.js';
var s = function (t, a, n) {
	var e = a.id,
		r = a.meta,
		i = o();
	return m(
		[t, 'getOne', { id: String(e), meta: r }],
		function () {
			return i.getOne(t, { id: e, meta: r }).then(function (u) {
				var d = u.data;
				return d;
			});
		},
		n
	);
};
export { s as u };
