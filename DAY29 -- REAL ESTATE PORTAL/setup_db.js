const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'realestate.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  }
});

const mockProperties = [
  {
    title: 'Modern Apartment in Downtown',
    description: 'Beautiful 2-bedroom apartment with a stunning city view. Features open plan living and high-end appliances.',
    price: 450000,
    location: 'Downtown, City',
    property_type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Luxury Family Home',
    description: 'Spacious 4-bedroom house with a large backyard and swimming pool. Perfect for a growing family.',
    price: 1250000,
    location: 'Suburbs, City',
    property_type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Cozy Studio near University',
    description: 'Compact and fully furnished studio apartment. Great for students or young professionals.',
    price: 200000,
    location: 'University District, City',
    property_type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    image_url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Contemporary Beach Condo',
    description: 'Stunning 3-bedroom condo right on the beach. Enjoy ocean views and luxury amenities.',
    price: 850000,
    location: 'Coastal Avenue, Beachside',
    property_type: 'Condo',
    bedrooms: 3,
    bathrooms: 2,
    image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Classic Victorian House',
    description: 'Historic home with modern upgrades. Features 5 bedrooms, wrap-around porch, and original hardwood floors.',
    price: 980000,
    location: 'Historic District, City',
    property_type: 'House',
    bedrooms: 5,
    bathrooms: 4,
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    title: 'Urban Loft with High Ceilings',
    description: 'Industrial style loft with exposed brick walls, high ceilings, and large windows.',
    price: 600000,
    location: 'Arts District, City',
    property_type: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c15293936f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];

db.serialize(() => {
  console.log('Creating properties table...');
  db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      location TEXT NOT NULL,
      property_type TEXT NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.get("SELECT COUNT(*) as count FROM properties", (err, row) => {
    if (err) {
      console.error(err);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding initial data...');
      let stmt = db.prepare(`
        INSERT INTO properties (title, description, price, location, property_type, bedrooms, bathrooms, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const prop of mockProperties) {
        stmt.run([
          prop.title,
          prop.description,
          prop.price,
          prop.location,
          prop.property_type,
          prop.bedrooms,
          prop.bathrooms,
          prop.image_url
        ]);
      }
      
      stmt.finalize(() => {
        console.log('Data seeded successfully.');
        db.close();
      });
    } else {
      console.log('Table already contains data, skipping seed.');
      db.close();
    }
  });
});
