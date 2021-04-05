import { h } from "./modules/preact.js";
import htm from "./modules/htm.js";
import { connect } from "./modules/redux-zero.preact.min.js";

const html = htm.bind(h);

const actions = (state) => ({
  increment: ({ count }) => ({ count: ++count }),
  decrement: ({ count }) => ({ count: --count })
});

const mapToProps = ({ count }) => ({ count });

export default connect(
  mapToProps,
  actions
)(
  ({ count, increment, decrement }) =>
    html`<div>
      <h1>${count}</h1>
      <div>
        <button onClick=${decrement}>decrement</button>
        <button onClick=${increment}>increment</button>
      </div>
    </div>`
);
