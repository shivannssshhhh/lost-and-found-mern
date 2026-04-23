const Item = require('../models/Item');

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    if (!itemName || !description || !type || !location || !date || !contactInfo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['Lost', 'Found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "Lost" or "Found"' });
    }

    const item = await Item.create({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      userId: req.user._id,
    });

    res.status(201).json({ message: 'Item reported successfully', item });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all items (with optional search)
// @route   GET /api/items or GET /api/items/search?name=xyz
// @access  Private
const getAllItems = async (req, res) => {
  try {
    const { name, type } = req.query;
    let query = {};

    if (name) {
      query.itemName = { $regex: name, $options: 'i' };
    }
    if (type && ['Lost', 'Found'].includes(type)) {
      query.type = type;
    }

    const items = await Item.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Search items by name
// @route   GET /api/items/search?name=xyz
// @access  Private
const searchItems = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search query "name" is required' });
    }

    const items = await Item.find({
      itemName: { $regex: name, $options: 'i' },
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Private
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private (owner only)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { itemName, description, type, location, date, contactInfo } = req.body;

    item.itemName = itemName || item.itemName;
    item.description = description || item.description;
    item.type = type || item.type;
    item.location = location || item.location;
    item.date = date || item.date;
    item.contactInfo = contactInfo || item.contactInfo;

    const updatedItem = await item.save();
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  searchItems,
  getItemById,
  updateItem,
  deleteItem,
};
