import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import { getItems, searchItems } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [items, setItems]           = useState([]);
  const [editItem, setEditItem]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType]   = useState('All');
  const [showForm, setShowForm]       = useState(false);
  const [stats, setStats]             = useState({ total: 0, lost: 0, found: 0 });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterType !== 'All') params.type = filterType;
      const res = await getItems(params);
      const data = res.data;
      setItems(data);
      setStats({
        total: data.length,
        lost:  data.filter((i) => i.type === 'Lost').length,
        found: data.filter((i) => i.type === 'Found').length,
      });
    } catch (err) {
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await searchItems(searchQuery);
      setItems(res.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchItems();
  };

  const handleItemCreated = () => {
    setShowForm(false);
    setEditItem(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (deletedId) => {
    setItems((prev) => prev.filter((i) => i._id !== deletedId));
    setStats((prev) => ({
      ...prev,
      total: prev.total - 1,
    }));
  };

  const handleCancelEdit = () => {
    setEditItem(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-card stat-lost">
          <span className="stat-number">{stats.lost}</span>
          <span className="stat-label">🔴 Lost</span>
        </div>
        <div className="stat-card stat-found">
          <span className="stat-number">{stats.found}</span>
          <span className="stat-label">🟢 Found</span>
        </div>
      </div>

      {/* ── Control Bar ───────────────────────────────────────── */}
      <div className="control-bar">
        {/* Search */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search items by name..."
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {searchQuery && (
            <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </form>

        {/* Filter */}
        <div className="filter-group">
          {['All', 'Lost', 'Found'].map((t) => (
            <button
              key={t}
              className={`filter-btn ${filterType === t ? 'active' : ''}`}
              onClick={() => { setFilterType(t); setSearchQuery(''); }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Add Item Toggle */}
        <button
          className="btn btn-primary"
          id="add-item-btn"
          onClick={() => { setShowForm(!showForm); setEditItem(null); }}
        >
          {showForm ? '✖ Close Form' : '➕ Add Item'}
        </button>
      </div>

      {/* ── Item Form ─────────────────────────────────────────── */}
      {showForm && (
        <ItemForm
          editItem={editItem}
          onSuccess={handleItemCreated}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {/* ── Items Section ─────────────────────────────────────── */}
      <div className="items-section">
        <h2 className="section-title">
          {filterType === 'All' ? 'All Reported Items' : `${filterType} Items`}
          <span className="item-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </h2>

        {error   && <div className="alert alert-error">{error}</div>}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading items...</p>
          </div>
        )}

        {!loading && (
          <ItemList
            items={items}
            onDelete={handleDelete}
            onEdit={handleEdit}
            currentUserId={user?._id}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
