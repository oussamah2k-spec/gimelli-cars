import { useState } from 'react';
import { createProduct } from '../firebase/firebase';

const initialForm = {
  name: '',
  price: '',
  imageUrl: '',
  description: '',
};

function AdminDashboardPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await createProduct(form);
      console.log('AdminDashboardPage: product created', form);
      setMessage('Car added successfully. Refresh products to see the new listing.');
      setForm(initialForm);
    } catch (submitError) {
      console.error('AdminDashboardPage error:', submitError);
      setError(submitError.message || 'Failed to create car listing.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page section">
      <div className="container admin-layout">
        <div>
          <p className="section__eyebrow">Admin dashboard</p>
          <h1>Add a new car</h1>
          <p className="section__copy">
            This simple Firestore form lets you add a product document with name, price, image URL, and description.
          </p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Car name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Price
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
          </label>

          <label>
            Image URL
            <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} required />
          </label>

          <label>
            Description
            <textarea name="description" rows="5" value={form.description} onChange={handleChange} required />
          </label>

          <button className="button button--primary" disabled={submitting} type="submit">
            {submitting ? 'Saving...' : 'Add Car'}
          </button>

          {message ? <p className="form-message">{message}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}

export default AdminDashboardPage;