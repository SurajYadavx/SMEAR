import re

def fix_packages_js():
    path = r'D:\FF\Smear\src\packages.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove CAT_ICONS block
    content = re.sub(r'/\* Category emojis.*?var CAT_ICONS = \{.*?};\n', '', content, flags=re.DOTALL)
    
    # Update getCatIcon
    content = re.sub(
        r'function getCatIcon\(id\) \{.*?return \'🏥\';\s*\}',
        r'function getCatIcon(id) {\n    if (window.SmearVisuals) return window.SmearVisuals.getIconSVG(id);\n    return \'\';\n  }',
        content,
        flags=re.DOTALL
    )

    # Update price logic and image placeholder in both render loops
    # Look for the block defining imgHtml and priceHtml
    img_price_pattern = re.compile(
        r'var imgHtml = imgUrl\s*\?[^\:]+:\s*\'<div class="pkg-card__placeholder">.*?</div>\';\s*var priceHtml = price !== null\s*\?\s*\'<div class="pkg-card__price">₹\' \+ price \+ \'</div>\'\s*:\s*\'<div class="pkg-card__price" style="font-size: 0\.9em; color: var\(--color-text-muted\);">Price available at lab</div>\';',
        re.DOTALL
    )
    
    replacement = r'''var imgHtml = imgUrl
        ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
        : '<div class="pkg-card__placeholder">' + (window.SmearVisuals ? window.SmearVisuals.getMotifSVG(pkg.categoryName || pkg.categoryId) : '') + '</div>';

      var priceHtml = price !== null 
        ? '<div class="pkg-card__price">₹' + Number(price).toLocaleString('en-IN') + '</div>' 
        : '<div class="pkg-card__price" style="font-size: 0.9em; color: var(--color-text-muted);">Price available at lab</div>';'''
        
    content = img_price_pattern.sub(replacement, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_blood_tests_js():
    path = r'D:\FF\Smear\src\blood-tests.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update price logic
    price_pattern = re.compile(
        r'var priceHtml = price !== null\s*\?\s*\'<div class="test-card__price">₹\' \+ price \+ \'</div>\'\s*:\s*\'<div class="test-card__price" style="font-size: 0\.9em; color: var\(--color-text-muted\);">Price available at lab</div>\';',
        re.DOTALL
    )
    price_replacement = r'''var priceHtml = price !== null 
        ? '<div class="test-card__price">₹' + Number(price).toLocaleString('en-IN') + '</div>' 
        : '<div class="test-card__price" style="font-size: 0.9em; color: var(--color-text-muted);">Price available at lab</div>';'''
        
    content = price_pattern.sub(price_replacement, content)
    
    # Inject visual icon for tests
    icon_pattern = re.compile(
        r'<div class="test-card__icon"><svg.*?<\/svg><\/div>',
        re.DOTALL
    )
    icon_replacement = r'''<div class="test-card__icon">' + (window.SmearVisuals ? window.SmearVisuals.getIconSVG(test.categoryName) : '') + '</div>'''
    
    content = icon_pattern.sub(icon_replacement, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def fix_package_detail_js():
    path = r'D:\FF\Smear\src\package-detail.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add motif to hero header
    content = content.replace(
        '''document.getElementById('pkg-hero-category').textContent = pkg.categoryName || 'General Health';''',
        '''document.getElementById('pkg-hero-category').textContent = pkg.categoryName || 'General Health';
    var heroSect = document.querySelector('.pkg-hero');
    if (heroSect && window.SmearVisuals) {
      var motif = window.SmearVisuals.getMotifSVG(pkg.categoryName);
      var mDiv = document.createElement('div');
      mDiv.innerHTML = motif;
      mDiv.style.position = 'absolute';
      mDiv.style.top = '0'; mDiv.style.left = '0'; mDiv.style.width = '100%'; mDiv.style.height = '100%'; mDiv.style.zIndex = '0'; mDiv.style.opacity = '0.3';
      heroSect.style.position = 'relative';
      heroSect.style.overflow = 'hidden';
      heroSect.insertBefore(mDiv, heroSect.firstChild);
    }'''
    )
    
    # Update price logic
    content = content.replace(
        "var displayPrice = price !== null ? ('₹' + price) : 'Price available at lab';",
        "var displayPrice = price !== null ? ('₹' + Number(price).toLocaleString('en-IN')) : 'Price available at lab';"
    )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
def fix_cart_js():
    path = r'D:\FF\Smear\src\cart-page.js'
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        content = content.replace(
            "var itemPrice = (typeof item.price === 'number') ? ('₹' + item.price) : 'To be confirmed';",
            "var itemPrice = (typeof item.price === 'number') ? ('₹' + Number(item.price).toLocaleString('en-IN')) : 'To be confirmed';"
        )
        content = content.replace(
            "document.getElementById('cart-total-price').textContent = '₹' + Cart.getTotal();",
            "document.getElementById('cart-total-price').textContent = '₹' + Number(Cart.getTotal()).toLocaleString('en-IN');"
        )
        content = content.replace(
            "return '\\n- ' + item.quantity + 'x ' + item.name + ' (' + itemPrice + ')';",
            "return '\\n- ' + item.quantity + 'x ' + item.name + ' (' + itemPrice + ')';"
        )
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
    except:
        pass

    path2 = r'D:\FF\Smear\src\cart.js'
    try:
        with open(path2, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace(
            "document.getElementById('cart-subtotal').textContent = 'Subtotal: ₹' + total;",
            "document.getElementById('cart-subtotal').textContent = 'Subtotal: ₹' + Number(total).toLocaleString('en-IN');"
        )
        with open(path2, 'w', encoding='utf-8') as f:
            f.write(content)
    except:
        pass


def fix_html_scripts():
    import glob
    for file in glob.glob(r"D:\FF\Smear\*.html"):
        if "migration_backup" in file or "metropolis_data" in file:
            continue
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content = f.read()
            if '<script src="./src/visuals.js"></script>' not in content:
                content = content.replace('<script src="./src/config.js"></script>',
                                          '<script src="./src/config.js"></script>\n  <script src="./src/visuals.js"></script>')
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(content)
        except:
            pass

if __name__ == "__main__":
    fix_packages_js()
    fix_blood_tests_js()
    fix_package_detail_js()
    fix_cart_js()
    fix_html_scripts()
    print("UI JS updated.")
