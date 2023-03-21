import { r as t, an as i } from './index-091859a0.js';
import { u as o } from './useResourceDefinition-e2399b95.js';
var s = function (n) {
	var e = o({ resource: n }).recordRepresentation;
	return t.useCallback(
		function (r) {
			return r
				? typeof e == 'function'
					? e(r)
					: typeof e == 'string'
					? i(r, e)
					: t.isValidElement(e)
					? e
					: '#'.concat(r.id)
				: '';
		},
		[e]
	);
};
export { s as u };
