function EmptyState({ title = 'No cars available', description = 'Add products to Firebase to see listings here.' }) {
  return (
    <div className="status-card status-card--empty">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;