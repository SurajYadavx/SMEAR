const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'styles', 'v7-premium.css');

const css = `
/* Layout for 2-column Package Details */
.package-details-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  align-items: start;
}

@media (max-width: 992px) {
  .package-details-layout {
    grid-template-columns: 1fr;
  }
}

/* Right Sidebar: Premium Lead Form */
.package-booking-sidebar {
  position: sticky;
  top: 90px;
}

.booking-widget {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(13,59,62,0.1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
  padding: 30px;
  margin-top: 40px;
}

.widget-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0d3b3e;
  margin-bottom: 5px;
}

.widget-subtitle {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 15px;
}

.widget-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.widget-features span {
  font-size: 0.9rem;
  font-weight: 500;
  color: #68d391;
}

.premium-lead-form .form-group {
  margin-bottom: 15px;
}

.premium-lead-form .form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.premium-lead-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 6px;
}

.premium-lead-form input,
.premium-lead-form select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.premium-lead-form input:focus,
.premium-lead-form select:focus {
  outline: none;
  border-color: #68d391;
  box-shadow: 0 0 0 3px rgba(104,211,145,0.2);
  background: #fff;
}

.widget-pricing {
  margin-top: 25px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(13,59,62,0.04);
  border-radius: 12px;
}

.widget-price-label {
  font-weight: 600;
  color: #4a5568;
}

.widget-price-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0d3b3e;
}

.widget-add-btn {
  margin-bottom: 10px;
}

.privacy-note {
  margin-top: 15px;
  text-align: center;
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}
`;

fs.appendFileSync(file, css);
console.log('Appended layout CSS');
