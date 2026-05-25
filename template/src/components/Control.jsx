export default function Control({ label, children }) {
  return (
    <div className="scifr-control">
      <label>{label}</label>
      {children}
    </div>
  );
}
