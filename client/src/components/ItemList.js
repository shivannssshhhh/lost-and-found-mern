import React from 'react';
import { deleteItem } from '../services/api';

const ItemList = ({ items, onDelete, onEdit, currentUserId }) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItem(id);
      onDelete(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📭</span>
        <p>No items found. Be the first to report one!</p>
      </div>
    );
  }

  return (
    <div className="item-grid">
      {items.map((item) => {
        const isOwner =
          currentUserId &&
          (item.userId?._id === currentUserId || item.userId === currentUserId);

        return (
          <div
            key={item._id}
            className={`item-card ${item.type === 'Lost' ? 'card-lost' : 'card-found'}`}
          >
            <div className="item-card-header">
              <span className={`badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>
                {item.type === 'Lost' ? '🔴 Lost' : '🟢 Found'}
              </span>
              <span className="item-date">
                {new Date(item.date).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </span>
            </div>

            <h3 className="item-name">{item.itemName}</h3>
            <p className="item-description">{item.description}</p>

            <div className="item-meta">
              <span className="meta-row">📍 {item.location}</span>
              <span className="meta-row">📞 {item.contactInfo}</span>
              {item.userId?.name && (
                <span className="meta-row">👤 Reported by: {item.userId.name}</span>
              )}
            </div>

            {isOwner && (
              <div className="item-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(item)}
                  aria-label={`Edit ${item.itemName}`}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(item._id)}
                  aria-label={`Delete ${item.itemName}`}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
