import React, { useState, useEffect, useCallback } from 'react';
import Filters from './components/Filters';
import PropertyCard from './components/PropertyCard';
import { Home } from 'lucide-react';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    beds: ''
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.beds) queryParams.append('beds', filters.beds);

      const url = `/api/properties?${queryParams.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounce fetching when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchProperties]);

  const handleClearFilters = () => {
    setFilters({
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      beds: ''
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Prime Real Estate</h1>
        <p>Find your perfect home in the city's best locations</p>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <Filters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearFilters}
          />
        </aside>

        <section className="property-results">
          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="no-results">
              <Home size={48} />
              <h3>No properties found</h3>
              <p>Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
