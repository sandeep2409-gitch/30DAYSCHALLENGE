import React from 'react';
import { Filter } from 'lucide-react';

const Filters = ({ filters, setFilters, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <Filter size={20} />
        <span>Find Your Home</span>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <input 
          type="text" 
          name="location"
          className="filter-input" 
          placeholder="City, neighborhood..."
          value={filters.location}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Property Type</label>
        <select 
          name="type" 
          className="filter-select"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Condo">Condo</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <div className="filter-row">
          <input 
            type="number" 
            name="minPrice"
            className="filter-input" 
            placeholder="Min $"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="maxPrice"
            className="filter-input" 
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Minimum Bedrooms</label>
        <select 
          name="beds" 
          className="filter-select"
          value={filters.beds}
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      <button className="clear-btn" onClick={onClear}>
        Clear All Filters
      </button>
    </div>
  );
};

export default Filters;
