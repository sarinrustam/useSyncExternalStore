import './App.css';
import { createAtom, useAtom } from './store/custom-store';

type Counter = number;

const defaultState = 0;

const counterStore = createAtom<Counter>(defaultState);

function App() {
  const [count, setCount] = useAtom(counterStore);
  return (
    <>
      <h1>{count}</h1>
      <h2>{document.title}</h2>
      <button onClick={() => setCount(count => count + 1)}>Increment</button>
    </>
  )
}

export default App
