import React from 'react';
import { MapPin, Bed, Bath } from 'lucide-react';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <div className="property-image-container">
        <img src={property.image_url} alt={property.title} className="property-image" />
        <span className="property-badge">{property.property_type}</span>
      </div>
      <div className="property-content">
        <h3 className="property-price">
          ${property.price.toLocaleString()}
        </h3>
        <h4 className="property-title">{property.title}</h4>
        <div className="property-location">
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>
        
        <div className="property-features">
          <div className="feature">
            <Bed size={18} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="feature">
            <Bath size={18} />
            <span>{property.bathrooms} Baths</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
