import React, { useState, useEffect } from 'react';
import { createItem, updateItem } from '../services/api';

const INITIAL_FORM = {
  itemName: '',
  description: '',
  type: 'Lost',
  location: '',
  date: '',
  contactInfo: '',
};

const ItemForm = ({ editItem, onSuccess, onCancelEdit }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        itemName:    editItem.itemName    || '',
        description: editItem.description || '',
        type:        editItem.type        || 'Lost',
        location:    editItem.location    || '',
        date:        editItem.date ? editItem.date.substring(0, 10) : '',
        contactInfo: editItem.contactInfo || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [editItem]);

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editItem) {
        await updateItem(editItem._id, formData);
      } else {
        await createItem(formData);
      }
      setFormData(INITIAL_FORM);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM);
    setError('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="card form-card">
      <h3 className="form-title">
        {editItem ? '✏️ Edit Item' : '➕ Report Item'}
      </h3>
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="itemName">Item Name *</label>
            <input
              id="itemName"
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g., Blue Wallet"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Lost">🔴 Lost</option>
              <option value="Found">🟢 Found</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item in detail..."
            rows={3}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Library 2nd Floor"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">Contact Info *</label>
          <input
            id="contactInfo"
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="e.g., email or phone number"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Saving...' : editItem ? '✅ Update Item' : '📮 Submit Report'}
          </button>
          {editItem && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
