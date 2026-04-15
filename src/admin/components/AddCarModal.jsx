import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, UploadCloud, X } from 'lucide-react';

const DEFAULT_CATEGORIES = ['SUV', 'Sedan', 'Luxury', 'Electric', 'Sports'];

function normalizeTypeList(types = []) {
  return Array.from(new Set([...DEFAULT_CATEGORIES, ...types.filter(Boolean).map((type) => type.trim())]));
}

function buildInitialState(initialCar, types) {
  const availableTypes = normalizeTypeList(types);
  const fallbackType = availableTypes[0] || DEFAULT_CATEGORIES[0];
  const typeValue = initialCar?.type || initialCar?.category || fallbackType;
  const isKnownType = availableTypes.includes(typeValue);

  return {
    form: {
      name: initialCar?.name || '',
      price: String(initialCar?.price ?? ''),
      oldPrice: String(initialCar?.oldPrice ?? ''),
      type: isKnownType ? typeValue : fallbackType,
      stock: initialCar?.stock ? String(initialCar.stock) : 'Available',
      featured: Boolean(initialCar?.featured),
      description: initialCar?.description || '',
    },
    customTypes: isKnownType ? [] : [typeValue],
    existingImages: Array.isArray(initialCar?.images)
      ? initialCar.images.map((image, index) => ({
          id: `existing-${index}-${image.url}`,
          url: image.url,
          description: image.description || '',
        }))
      : initialCar?.imageUrl
        ? [
            {
              id: `existing-main-${initialCar.imageUrl}`,
              url: initialCar.imageUrl,
              description: 'Main car view',
            },
          ]
        : [],
  };
}

function AddCarModal({
  isOpen,
  mode = 'add',
  initialCar = null,
  types = DEFAULT_CATEGORIES,
  isSaving = false,
  onClose,
  onSave,
}) {
  const [{ form, customTypes, existingImages }, setModalState] = useState(() => buildInitialState(initialCar, types));
  const [newImages, setNewImages] = useState([]);
  const [typeDraft, setTypeDraft] = useState('');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const newImagesRef = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextState = buildInitialState(initialCar, types);
    setModalState(nextState);
    setError('');
    setTypeDraft('');
    setIsDragOver(false);

    newImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    newImagesRef.current = [];
    setNewImages([]);
  }, [initialCar, isOpen, types]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const availableTypes = useMemo(
    () => normalizeTypeList([...types, ...customTypes]),
    [customTypes, types]
  );

  if (!isOpen) {
    return null;
  }

  const updateForm = (field, value) => {
    setModalState((previousState) => ({
      ...previousState,
      form: {
        ...previousState.form,
        [field]: value,
      },
    }));
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    updateForm(name, type === 'checkbox' ? checked : value);
  };

  const appendFiles = (selectedFiles) => {
    const filteredFiles = selectedFiles.filter((file) => file.type.startsWith('image/'));

    if (filteredFiles.length === 0) {
      return;
    }

    const mappedImages = filteredFiles.map((file, index) => ({
      id: `new-${file.name}-${file.size}-${Date.now()}-${index}`,
      file,
      previewUrl: URL.createObjectURL(file),
      description: '',
    }));

    setNewImages((previousImages) => [...previousImages, ...mappedImages]);
  };

  const handleFileSelection = (event) => {
    appendFiles(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    appendFiles(Array.from(event.dataTransfer.files || []));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleAddType = () => {
    const normalizedType = typeDraft.trim();

    if (!normalizedType) {
      return;
    }

    setModalState((previousState) => ({
      ...previousState,
      customTypes: previousState.customTypes.includes(normalizedType)
        ? previousState.customTypes
        : [...previousState.customTypes, normalizedType],
      form: {
        ...previousState.form,
        type: normalizedType,
      },
    }));
    setTypeDraft('');
  };

  const handleRemoveType = (typeToRemove) => {
    setModalState((previousState) => {
      const nextCustomTypes = previousState.customTypes.filter((type) => type !== typeToRemove);
      const nextAvailableTypes = normalizeTypeList([...types, ...nextCustomTypes]);

      return {
        ...previousState,
        customTypes: nextCustomTypes,
        form: {
          ...previousState.form,
          type: previousState.form.type === typeToRemove ? nextAvailableTypes[0] || DEFAULT_CATEGORIES[0] : previousState.form.type,
        },
      };
    });
  };

  const handleExistingImageDescription = (imageId, value) => {
    setModalState((previousState) => ({
      ...previousState,
      existingImages: previousState.existingImages.map((image) =>
        image.id === imageId ? { ...image, description: value } : image
      ),
    }));
  };

  const handleNewImageDescription = (imageId, value) => {
    setNewImages((previousImages) =>
      previousImages.map((image) => (image.id === imageId ? { ...image, description: value } : image))
    );
  };

  const handleRemoveExistingImage = (imageId) => {
    setModalState((previousState) => ({
      ...previousState,
      existingImages: previousState.existingImages.filter((image) => image.id !== imageId),
    }));
  };

  const handleRemoveNewImage = (imageId) => {
    setNewImages((previousImages) => {
      const imageToRemove = previousImages.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return previousImages.filter((image) => image.id !== imageId);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Car name is required.');
      return;
    }

    if (!form.type.trim()) {
      setError('Car type is required.');
      return;
    }

    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    if (form.oldPrice && Number(form.oldPrice) < Number(form.price)) {
      setError('Old price should be greater than or equal to the current price.');
      return;
    }

    if (!form.stock.trim()) {
      setError('Stock is required.');
      return;
    }

    if (existingImages.length + newImages.length === 0) {
      setError('Please select at least one car image.');
      return;
    }

    setError('');

    try {
      await onSave({
        name: form.name.trim(),
        price: form.price,
        oldPrice: form.oldPrice,
        type: form.type.trim(),
        featured: form.featured,
        stock: form.stock.trim(),
        description: form.description.trim(),
        existingImages: existingImages.map((image) => ({
          url: image.url,
          description: image.description.trim(),
        })),
        newFiles: newImages.map((image) => image.file),
        newImageDescriptions: newImages.map((image) => image.description.trim()),
      });
    } catch (submitError) {
      setError(submitError.message || 'Unable to save this car right now.');
    }
  };

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="car-modal-title">
        <div className="admin-modal__header">
          <div>
            <span className="admin-panel__label">Cars Admin</span>
            <h3 id="car-modal-title">{mode === 'edit' ? 'Edit car' : 'Add new car'}</h3>
            <p>Upload images to Cloudinary, then save the public URLs inside Firestore.</p>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form className="admin-modal__body" onSubmit={handleSubmit}>
          <section className="admin-modal__section">
            <div className="admin-modal__section-head">
              <h4>Car Basics</h4>
              <span>Identity, pricing, and availability</span>
            </div>
            <div className="admin-form-grid">
              <label>
                <span>Name</span>
                <input name="name" value={form.name} onChange={handleInputChange} required />
              </label>
              <label>
                <span>Price</span>
                <input name="price" type="number" min="0" value={form.price} onChange={handleInputChange} required />
              </label>
              <label>
                <span>Old Price</span>
                <input name="oldPrice" type="number" min="0" value={form.oldPrice} onChange={handleInputChange} />
              </label>
              <label>
                <span>Type</span>
                <select name="type" value={form.type} onChange={handleInputChange}>
                  {availableTypes.map((typeOption) => (
                    <option key={typeOption} value={typeOption}>
                      {typeOption}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Stock</span>
                <input name="stock" value={form.stock} onChange={handleInputChange} placeholder="Available or 3" required />
              </label>
              <label className="admin-checkbox-row">
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleInputChange} />
                <span>Featured car</span>
              </label>
              <div className="admin-form-grid__full admin-type-manager">
                <span>Manage Types</span>
                <div className="admin-type-manager__row">
                  <input
                    value={typeDraft}
                    onChange={(event) => setTypeDraft(event.target.value)}
                    placeholder="Add custom type"
                  />
                  <button type="button" className="admin-secondary-action" onClick={handleAddType}>
                    <Plus size={16} />
                    <span>Add Type</span>
                  </button>
                </div>
                <div className="admin-type-list">
                  {availableTypes.map((typeOption) => {
                    const isDefaultType = DEFAULT_CATEGORIES.includes(typeOption) || types.includes(typeOption);

                    return (
                      <div key={typeOption} className={`admin-type-chip ${form.type === typeOption ? 'is-active' : ''}`}>
                        <button type="button" className="admin-type-chip__select" onClick={() => updateForm('type', typeOption)}>
                          {typeOption}
                        </button>
                        {!isDefaultType ? (
                          <button type="button" className="admin-type-chip__remove" onClick={() => handleRemoveType(typeOption)}>
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="admin-modal__section">
            <div className="admin-modal__section-head">
              <h4>Description</h4>
              <span>Short sales copy for the car details view</span>
            </div>
            <label>
              <span>Description</span>
              <textarea
                name="description"
                rows="5"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Write a persuasive car description..."
              />
            </label>
          </section>

          <section className="admin-modal__section">
            <div className="admin-modal__section-head">
              <h4>Image Upload</h4>
              <span>Choose multiple images, preview them, and upload on save</span>
            </div>

            <div
              className={`admin-upload-box ${isDragOver ? 'is-drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div>
                <strong>Cloudinary Upload Queue</strong>
                <p>Drag images here or browse from your device. Files upload to Cloudinary only when you save.</p>
              </div>
              <button type="button" className="admin-secondary-action" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={18} />
                <span>Select Images</span>
              </button>
              <input
                ref={fileInputRef}
                className="admin-hidden-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelection}
              />
            </div>

            <div className="admin-image-grid">
              {existingImages.map((image) => (
                <article key={image.id} className="admin-image-card">
                  <img src={image.url} alt={image.description || 'Existing car view'} />
                  <div className="admin-image-card__body">
                    <span className="admin-image-card__tag">Saved</span>
                    <input
                      value={image.description}
                      onChange={(event) => handleExistingImageDescription(image.id, event.target.value)}
                      placeholder="Image description"
                    />
                    <button type="button" className="admin-row-action-link is-danger" onClick={() => handleRemoveExistingImage(image.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}

              {newImages.map((image) => (
                <article key={image.id} className="admin-image-card">
                  <img src={image.previewUrl} alt={image.file.name} />
                  <div className="admin-image-card__body">
                    <span className="admin-image-card__tag is-new">New</span>
                    <input
                      value={image.description}
                      onChange={(event) => handleNewImageDescription(image.id, event.target.value)}
                      placeholder="Image description"
                    />
                    <button type="button" className="admin-row-action-link is-danger" onClick={() => handleRemoveNewImage(image.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {error ? <div className="admin-feedback is-error">{error}</div> : null}
          {isSaving ? <div className="admin-feedback is-success">Uploading images and saving car data...</div> : null}

          <div className="admin-modal__footer">
            <button type="button" className="admin-secondary-action" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="admin-primary-action admin-primary-action--danger" disabled={isSaving}>
              <Plus size={18} />
              <span>{isSaving ? 'Saving...' : mode === 'edit' ? 'Update Car' : 'Add Car'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCarModal;