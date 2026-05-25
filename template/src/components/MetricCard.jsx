export default function MetricCard({ label, value }) {
  return (
    <div className="scifr-mini-card">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}
