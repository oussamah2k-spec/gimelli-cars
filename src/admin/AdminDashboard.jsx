import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CarFront,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { addCar, deleteCar, subscribeToCars, updateCar } from '../firebase/cars';
import AddCarModal from './components/AddCarModal';
import CarTable from './components/CarTable';
import { getCloudinaryConfigStatus, uploadImages } from '../firebase/uploadImage';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/admin.css';

const TAB_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'cars', label: 'Cars', icon: CarFront },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function normalizeImageDescription(carName, description, index) {
  if (description?.trim()) {
    return description.trim();
  }

  return index === 0 ? `${carName} main view` : `${carName} view ${index + 1}`;
}

function AdminDashboard() {
  const { currentUser, isAuthorizedAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCar, setIsSavingCar] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (loading || !isAuthorizedAdmin) {
      return undefined;
    }

    let isMounted = true;
    setIsLoading(true);

    const unsubscribeCars = subscribeToCars(
      (carsData) => {
        if (!isMounted) {
          return;
        }

        setCars(carsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Failed to subscribe to cars:', error);
        if (isMounted) {
          setFeedback({ type: 'error', message: 'Failed to subscribe to cars collection.' });
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribeCars();
    };
  }, [isAuthorizedAdmin, loading]);

  if (!loading && (!currentUser || !isAuthorizedAdmin)) {
    return <Navigate to="/login" replace />;
  }

  const availableCarsCount = cars.filter((car) => (car.stock || '').toString().trim().toLowerCase() !== 'not available').length;
  const unavailableCarsCount = cars.length - availableCarsCount;
  const featuredCarsCount = cars.filter((car) => car.featured).length;
  const recentCars = cars.slice(0, 5);
  const cloudinaryStatus = getCloudinaryConfigStatus();
  const types = Array.from(
    new Set(cars.map((car) => car.type).filter(Boolean).concat(['SUV', 'Sedan', 'Luxury', 'Electric']))
  );

  const closeCarModal = () => {
    setIsCarModalOpen(false);
    setEditingCar(null);
  };

  const openAddCarModal = () => {
    setActiveTab('cars');
    setEditingCar(null);
    setIsCarModalOpen(true);
  };

  const openEditCarModal = (car) => {
    setActiveTab('cars');
    setEditingCar(car);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (carDraft) => {
    setIsSavingCar(true);
    setFeedback({ type: 'success', message: 'Uploading images to Cloudinary...' });

    try {
      const uploadedImages = await uploadImages(carDraft.newFiles);
      const mappedUploadedImages = uploadedImages.map((image, index) => ({
        url: image.url,
        description: normalizeImageDescription(
          carDraft.name,
          carDraft.newImageDescriptions[index],
          carDraft.existingImages.length + index
        ),
      }));
      const finalImages = [...carDraft.existingImages, ...mappedUploadedImages].map((image, index) => ({
        url: image.url,
        description: normalizeImageDescription(carDraft.name, image.description, index),
      }));

      if (finalImages.length === 0) {
        throw new Error('Please keep at least one image for this car.');
      }

      const payload = {
        name: carDraft.name,
        price: carDraft.price,
        oldPrice: carDraft.oldPrice,
        type: carDraft.type,
        featured: carDraft.featured,
        stock: carDraft.stock,
        description: carDraft.description,
        imageUrl: finalImages[0].url,
        images: finalImages,
      };

      if (editingCar) {
        await updateCar(editingCar.id, payload);
        setCars((previousCars) =>
          previousCars.map((car) =>
            car.id === editingCar.id
              ? {
                  ...car,
                  ...payload,
                  oldPrice: Number(payload.oldPrice || 0),
                  price: Number(payload.price || 0),
                  type: payload.type,
                }
              : car
          )
        );
        setFeedback({ type: 'success', message: 'Car updated successfully.' });
      } else {
        const reference = await addCar(payload);
        setCars((previousCars) => [
          {
            id: reference.id,
            ...payload,
            oldPrice: Number(payload.oldPrice || 0),
            price: Number(payload.price || 0),
            type: payload.type,
            createdAt: new Date().toISOString(),
            createdAtValue: Date.now(),
          },
          ...previousCars,
        ]);
        setFeedback({ type: 'success', message: 'Car added successfully.' });
      }

      closeCarModal();
    } catch (error) {
      console.error('Failed to save car:', error);
      setFeedback({ type: 'error', message: error.message || 'Unable to save this car right now.' });
      throw error;
    } finally {
      setIsSavingCar(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Delete this car permanently?')) {
      return;
    }

    try {
      await deleteCar(carId);
      setCars((previousCars) => previousCars.filter((car) => car.id !== carId));
      setFeedback({ type: 'success', message: 'Car deleted successfully.' });
      if (editingCar?.id === carId) {
        closeCarModal();
      }
    } catch (error) {
      console.error('Failed to delete car:', error);
      setFeedback({ type: 'error', message: 'Unable to delete this car.' });
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__badge">Admin</span>
          <h1>Client2 Control</h1>
          <p>Dark operations panel for cars and store settings.</p>
        </div>

        <nav className="admin-tabs" aria-label="Admin sections">
          {TAB_ITEMS.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-user-card">
            <ShieldCheck size={18} />
            <div>
              <strong>{currentUser?.email || 'Admin session'}</strong>
              <span>Firestore: {db.app.options.projectId || 'Not configured'}</span>
            </div>
          </div>
          <a className="admin-sidebar__logout" href="/login">
            <LogOut size={16} />
            <span>Back to Login</span>
          </a>
          <button type="button" className="admin-secondary-action" onClick={() => navigate('/')}>
            Back to Store
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar__eyebrow">Management Console</p>
            <h2>{TAB_ITEMS.find((tab) => tab.id === activeTab)?.label}</h2>
          </div>
          <button type="button" className="admin-primary-action admin-primary-action--danger" onClick={openAddCarModal}>
            <Plus size={18} />
            <span>Add Car</span>
          </button>
        </header>

        {feedback.message ? (
          <div className={`admin-feedback ${feedback.type === 'error' ? 'is-error' : 'is-success'}`}>
            {feedback.message}
          </div>
        ) : null}

        {isLoading ? (
          <div className="admin-panel admin-loading-state">Loading admin data...</div>
        ) : null}

        {!isLoading && activeTab === 'dashboard' ? (
          <div className="admin-dashboard-grid">
            <section className="admin-stats-grid">
              <article className="admin-stat-card">
                <span>Total Cars</span>
                <strong>{cars.length}</strong>
                <small>Vehicles stored in the Firestore cars collection</small>
              </article>
              <article className="admin-stat-card">
                <span>Featured Cars</span>
                <strong>{featuredCarsCount}</strong>
                <small>Highlighted inventory cards</small>
              </article>
              <article className="admin-stat-card admin-stat-card--warning">
                <span>Available</span>
                <strong>{availableCarsCount}</strong>
                <small>Ready to book right now</small>
              </article>
              <article className="admin-stat-card admin-stat-card--danger">
                <span>Unavailable</span>
                <strong>{unavailableCarsCount}</strong>
                <small>Temporarily hidden from active inventory</small>
              </article>
            </section>

            <section className="admin-panel admin-panel--split">
              <div>
                <p className="admin-panel__label">Inventory Snapshot</p>
                <h3>{cars.length}</h3>
                <p>Live vehicles currently stored in the Firestore cars collection.</p>
              </div>
              <div className="admin-mini-summary">
                <span>Available Cars</span>
                <strong>{availableCarsCount}</strong>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-section-header">
                <div>
                  <p className="admin-panel__label">Latest Cars</p>
                  <h3>Newest additions</h3>
                </div>
              </div>
              <div className="admin-inventory-list">
                {recentCars.map((car) => (
                  <div key={car.id} className="admin-inventory-item">
                    <img src={car.imageUrl} alt={car.name} />
                    <div>
                      <strong>{car.name}</strong>
                      <span>{car.type}</span>
                    </div>
                    <span className={`admin-stock-badge ${(car.stock || '').toString().trim().toLowerCase() === 'not available' ? 'is-empty' : 'is-good'}`}>
                      {car.stock}
                    </span>
                  </div>
                ))}
                {recentCars.length === 0 ? (
                  <p>No cars found in Firestore yet.</p>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}

        {!isLoading && activeTab === 'cars' ? (
          <div className="admin-dashboard-grid">
            <section className="admin-panel">
              <div className="admin-section-header">
                <div>
                  <p className="admin-panel__label">Cars Management</p>
                  <h3>Inventory overview</h3>
                </div>
                <button type="button" className="admin-primary-action admin-primary-action--danger" onClick={openAddCarModal}>
                  <Plus size={18} />
                  <span>Add Car</span>
                </button>
              </div>
              <div className="admin-quick-stats">
                <article className="admin-quick-stat">
                  <span>Available</span>
                  <strong>{availableCarsCount}</strong>
                </article>
                <article className="admin-quick-stat">
                  <span>Unavailable</span>
                  <strong>{unavailableCarsCount}</strong>
                </article>
                <article className="admin-quick-stat">
                  <span>Featured</span>
                  <strong>{featuredCarsCount}</strong>
                </article>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-section-header">
                <div>
                  <p className="admin-panel__label">Inventory Table</p>
                  <h3>All cars</h3>
                </div>
              </div>
              <CarTable cars={cars} onEdit={openEditCarModal} onDelete={handleDeleteCar} />
            </section>
          </div>
        ) : null}

        {!isLoading && activeTab === 'settings' ? (
          <div className="admin-grid admin-grid--settings">
            <section className="admin-panel">
              <p className="admin-panel__label">Store Settings</p>
              <h3>Environment</h3>
              <ul className="admin-settings-list">
                <li>
                  <span>Project ID</span>
                  <strong>{db.app.options.projectId || 'Missing env config'}</strong>
                </li>
                <li>
                  <span>Admin Email</span>
                  <strong>{currentUser?.email || 'No session'}</strong>
                </li>
                <li>
                  <span>Cars Collection</span>
                  <strong>cars</strong>
                </li>
                <li>
                  <span>Cloudinary</span>
                  <strong>{cloudinaryStatus.cloudName} / {cloudinaryStatus.folder}</strong>
                </li>
              </ul>
            </section>
            <section className="admin-panel">
              <p className="admin-panel__label">Quick Notes</p>
              <h3>How this panel is wired</h3>
              <div className="admin-settings-note">
                <p>Cars management is backed by the Firestore cars collection through firebase/cars.</p>
                <p>Images are uploaded directly to Cloudinary with fetch, then stored in Firestore as image URLs.</p>
                <p>Admin access uses AuthContext and redirects non-admin users back to /login.</p>
              </div>
            </section>
          </div>
        ) : null}
      </section>

      <AddCarModal
        isOpen={isCarModalOpen}
        mode={editingCar ? 'edit' : 'add'}
        initialCar={editingCar}
        types={types}
        isSaving={isSavingCar}
        onClose={closeCarModal}
        onSave={handleSaveCar}
      />
    </div>
  );
}

export default AdminDashboard;