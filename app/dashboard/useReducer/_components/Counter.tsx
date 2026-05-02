interface DisplayCounterProps {
  count: number;
}

export default function DisplayCounter({ count }: DisplayCounterProps) {
  return <div>{count}</div>;
}
