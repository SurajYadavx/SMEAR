const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'scripts', 'package-template.html');

let content = fs.readFileSync(file, 'utf8');

const regex = /<section class="package-details-body">[\s\S]*?\{\{profiles_html\}\}\s*<\/section>/;

const replacement = `<div class="package-details-layout">
            <!-- Left Column: Details -->
            <section class="package-details-body">
              <!-- Highlights -->
              {{highlights_html}}

              <!-- Included Profiles & Tests -->
              {{profiles_html}}
            </section>

            <!-- Right Column: Parallel Booking Sidebar -->
            <aside class="package-booking-sidebar">
              <div class="booking-widget">
                <h3 class="widget-title">Pick & Quick Booking</h3>
                <p class="widget-subtitle">Free Sample Pickup from Home/Office</p>
                <div class="widget-features">
                  <span>✓ Book Now, Pay Later</span>
                  <span>✓ 100% Accurate Reports</span>
                </div>
                
                <form class="premium-lead-form" onsubmit="event.preventDefault(); window.SmearCart.add('{{id}}', 'package', '{{name}}', {{price}}); alert('Package added to cart! Proceed to checkout.');">
                  <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter patient name" required>
                  </div>
                  <div class="form-group-row">
                    <div class="form-group">
                      <label>Gender</label>
                      <select required>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Age</label>
                      <input type="number" placeholder="Age" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91" required>
                  </div>
                  <div class="form-group">
                    <label>Preferred Time Slot</label>
                    <input type="time" required>
                  </div>
                  
                  <div class="widget-pricing">
                    <span class="widget-price-label">Total to pay:</span>
                    <span class="widget-price-value">&#8377;{{price}}</span>
                  </div>

                  <button type="submit" class="btn btn--primary btn--full widget-add-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="margin-right:8px; vertical-align:text-bottom;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    Add to Cart
                  </button>
                  <a href="https://wa.me/919589469589?text=Hi, I would like to book the {{name}} package." target="_blank" rel="noopener noreferrer" class="btn btn--green btn--full widget-wa-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="18" height="18" style="margin-right:8px; vertical-align:text-bottom;"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.023 7.773L0 32l8.466-2.018A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.222 22.403c-.347.974-2.017 1.859-2.777 1.977-.71.11-1.608.155-2.592-.163-.599-.19-1.369-.445-2.352-.871-4.14-1.784-6.845-5.959-7.052-6.237-.208-.278-1.693-2.252-1.693-4.296 0-2.043 1.073-3.049 1.453-3.463.381-.413.832-.516 1.108-.516.278 0 .555.003.798.013.255.012.597-.097.934.713.347.832 1.179 2.876 1.284 3.085.104.208.174.451.035.728-.139.278-.208.451-.415.694-.208.243-.437.543-.624.729-.208.208-.424.432-.182.847.242.416 1.076 1.776 2.31 2.878 1.587 1.41 2.926 1.847 3.342 2.054.416.208.659.174.902-.104.243-.278 1.041-1.214 1.318-1.63.278-.416.555-.347.937-.208.381.139 2.422 1.143 2.838 1.351.416.208.693.312.797.486.104.173.104 1.006-.242 1.98z"/></svg>
                    Book via WhatsApp
                  </a>
                  
                  <div class="privacy-note">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:middle;margin-right:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Your data is safe & private.
                  </div>
                </form>
              </div>
            </aside>
          </div>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Template successfully replaced using regex.');
} else {
    console.log('Regex did not match.');
}
