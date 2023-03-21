import { k as t, Y as s } from './index-091859a0.js';
import { L as i, D as r, B as e, C as a } from './List-c33e34eb.js';
import { T as m } from './TopToolbar-a353fcbf.js';
import { D as n } from './DeleteButton-194d027b.js';
import { B as c, E as l } from './BooleanField-c8474065.js';
import { T as o } from './TextField-aa071d83.js';
import './useResourceDefinition-e2399b95.js';
import './Confirm-edcfa802.js';
import './index-fa9b5ce0.js';
function k() {
	return t(i, {
		actions: t(() => t(m, { children: t(a, {}) }), {}),
		perPage: 25,
		children: s(r, {
			rowClick: 'show',
			bulkActionButtons: t(e, { mutationMode: 'pessimistic' }),
			children: [
				t(o, { source: 'name' }),
				t(o, { source: 'password' }),
				t(c, { source: 'adminRights', label: 'Admin Rights' }),
				t(l, {}),
				t(n, { mutationMode: 'pessimistic' }),
			],
		}),
	});
}
export { k as default };
