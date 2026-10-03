import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

IMAGES_DIR = os.path.join(os.getcwd(), 'public', 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)

def get_image(filename):
    path = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(path):
        return Image.open(path).convert('RGBA')
    return None

def apply_shadow(base, subject_rgba, pos, blur=15, offset=(0, 20), opacity=0.45):
    """Draws a soft realistic contact shadow underneath a subject."""
    sw, sh = subject_rgba.size
    shadow = Image.new('RGBA', (sw, sh), (0, 0, 0, 0))
    alpha = np.array(subject_rgba)[:, :, 3]
    shadow_arr = np.zeros((sh, sw, 4), dtype=np.uint8)
    shadow_arr[:, :, 3] = (alpha * opacity).astype(np.uint8)
    shadow_img = Image.fromarray(shadow_arr, 'RGBA').filter(ImageFilter.GaussianBlur(blur))
    
    # Scale down slightly for perspective contact shadow
    contact_w = int(sw * 0.95)
    contact_h = int(sh * 0.25)
    contact = shadow_img.resize((contact_w, contact_h)).filter(ImageFilter.GaussianBlur(blur))
    
    shadow_pos = (pos[0] + offset[0] + (sw - contact_w) // 2, pos[1] + sh - contact_h // 2 + offset[1])
    base.paste(contact, shadow_pos, contact)

def create_wood_surface(width, height, base_color=(75, 52, 38), grain_color=(45, 30, 20)):
    """Creates a rich warm walnut / oak workshop timber surface."""
    arr = np.zeros((height, width, 3), dtype=np.float32)
    # Gradient lighting
    y, x = np.ogrid[:height, :width]
    
    # Wood grain stripes with noise
    freq = 0.04
    grain = np.sin(y * freq + np.sin(x * 0.005) * 12.0) * 0.5 + 0.5
    grain += np.random.normal(0, 0.05, (height, width))
    grain = np.clip(grain, 0, 1)
    
    # Light falloff from top to bottom
    light = 1.0 - (y / height) * 0.35 + (x / width) * 0.15
    
    for c in range(3):
        col = base_color[c] * (1 - grain * 0.3) + grain_color[c] * (grain * 0.3)
        arr[:, :, c] = np.clip(col * light, 0, 255)
        
    return Image.fromarray(arr.astype(np.uint8), 'RGB')

def create_atelier_room_backdrop(width=1920, height=1080):
    """Creates a luxury architectural showroom background with warm timber walls and soft ambient lighting."""
    bg = Image.new('RGB', (width, height), '#1E1916')
    
    # Top 65% is warm textured studio wall / room depth, bottom 35% is rich oak floor / table
    floor_y = int(height * 0.62)
    
    y, x = np.ogrid[:height, :width]
    
    # Wall gradient (warm charcoal-amber ambient)
    wall_r = 42 + np.sin(x / width * math.pi) * 20 - (y / floor_y) * 15
    wall_g = 34 + np.sin(x / width * math.pi) * 16 - (y / floor_y) * 12
    wall_b = 30 + np.sin(x / width * math.pi) * 12 - (y / floor_y) * 10
    
    # Spotlight pools
    spot1 = np.exp(-(((x - width * 0.35)**2 + (y - height * 0.3)**2) / (width * 0.4)**2)) * 38
    spot2 = np.exp(-(((x - width * 0.75)**2 + (y - height * 0.35)**2) / (width * 0.35)**2)) * 30
    
    wall_r = np.clip(wall_r + spot1 + spot2, 0, 255)
    wall_g = np.clip(wall_g + spot1*0.85 + spot2*0.8, 0, 255)
    wall_b = np.clip(wall_b + spot1*0.6 + spot2*0.5, 0, 255)
    
    # Floor area
    floor_dist = (y - floor_y) / (height - floor_y)
    floor_r = 85 - floor_dist * 35 + spot1 * 0.4
    floor_g = 58 - floor_dist * 25 + spot1 * 0.3
    floor_b = 40 - floor_dist * 18 + spot1 * 0.2
    
    # Wood planks on floor
    plank_lines = np.sin((x + (y - floor_y)*0.6) * 0.05)
    floor_r += plank_lines * 5
    floor_g += plank_lines * 3
    floor_b += plank_lines * 2
    
    is_wall = y < floor_y
    r = np.where(is_wall, wall_r, floor_r)
    g = np.where(is_wall, wall_g, floor_g)
    b = np.where(is_wall, wall_b, floor_b)
    
    arr = np.dstack((r, g, b)).astype(np.uint8)
    img = Image.fromarray(arr, 'RGB')
    
    # Soft room blur for bokeh
    return img.filter(ImageFilter.GaussianBlur(2))

# =========================================================================
# 1. 16:9 MASTER HERO WELCOME IMAGE ("Full-Grain Leather Tailored for Decades")
# =========================================================================
def build_hero_master_16_9():
    print("Building 16:9 Hero Master Image...")
    width, height = 1920, 1080
    canvas = create_atelier_room_backdrop(width, height)
    
    # Load products to compose
    biker = get_image('mens_biker_black.jpg')
    coat = get_image('mens_coat_brown.jpg')
    duffel = get_image('leather_weekend_duffel.jpg')
    boots = get_image('leather_chelsea_boots_black.jpg')
    belt = get_image('leather_dress_belt_bourbon.jpg')
    skirt = get_image('womens_skirt_red.jpg')
    
    # Extract subjects from studio backdrops (remove light studio backgrounds)
    def extract_subject(img, lum_thresh=220):
        if not img: return None
        arr = np.array(img).astype(np.float32)
        r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
        lum = 0.299*r + 0.587*g + 0.114*b
        sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
        mask = ((lum < lum_thresh) | (sat > 25)).astype(np.float32)
        mask = Image.fromarray((mask * 255).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(3))
        img.putalpha(mask)
        return img
    
    # Place Elements from back to front:
    
    # 1. Background Center-Left: Chestnut Leather Trench Coat (Elegant draped presence)
    if coat:
        c_sub = extract_subject(coat.copy())
        # Scale to height ~ 820px
        ch = 820
        cw = int(c_sub.width * (ch / c_sub.height))
        c_sub = c_sub.resize((cw, ch), Image.Resampling.LANCZOS)
        pos = (440, 180)
        apply_shadow(canvas, c_sub, pos, blur=22, offset=(10, 15), opacity=0.55)
        canvas.paste(c_sub, pos, c_sub)
        
    # 2. Left Foreground: Obsidian Black Biker Jacket (The Hero Icon)
    if biker:
        b_sub = extract_subject(biker.copy())
        bh = 780
        bw = int(b_sub.width * (bh / b_sub.height))
        b_sub = b_sub.resize((bw, bh), Image.Resampling.LANCZOS)
        pos = (120, 260)
        apply_shadow(canvas, b_sub, pos, blur=25, offset=(5, 20), opacity=0.6)
        canvas.paste(b_sub, pos, b_sub)
        
    # 3. Center-Right: 45L Leather Voyager Weekend Duffel Bag
    if duffel:
        d_sub = extract_subject(duffel.copy(), lum_thresh=215)
        dh = 460
        dw = int(d_sub.width * (dh / d_sub.height))
        d_sub = d_sub.resize((dw, dh), Image.Resampling.LANCZOS)
        pos = (960, 560)
        apply_shadow(canvas, d_sub, pos, blur=20, offset=(0, 25), opacity=0.55)
        canvas.paste(d_sub, pos, d_sub)
        
    # 4. Far Right: Goodyear-Welted Chelsea Boots
    if boots:
        bt_sub = extract_subject(boots.copy(), lum_thresh=215)
        bth = 430
        btw = int(bt_sub.width * (bth / bt_sub.height))
        bt_sub = bt_sub.resize((btw, bth), Image.Resampling.LANCZOS)
        pos = (1420, 590)
        apply_shadow(canvas, bt_sub, pos, blur=18, offset=(5, 20), opacity=0.5)
        canvas.paste(bt_sub, pos, bt_sub)

    # 5. Front Center: Coiled Bridle Leather Belt with Solid Brass Buckle
    if belt:
        bl_sub = extract_subject(belt.copy(), lum_thresh=215)
        blh = 280
        blw = int(bl_sub.width * (blh / bl_sub.height))
        bl_sub = bl_sub.resize((blw, blh), Image.Resampling.LANCZOS)
        pos = (780, 770)
        apply_shadow(canvas, bl_sub, pos, blur=12, offset=(0, 15), opacity=0.45)
        canvas.paste(bl_sub, pos, bl_sub)

    # Lighting & Color Grading: High-end luxury gold & charcoal atmosphere
    draw = ImageDraw.Draw(canvas, 'RGBA')
    
    # Warm golden studio vignette
    y_coords, x_coords = np.ogrid[:height, :width]
    vignette = np.sqrt(((x_coords - width*0.5)/(width*0.5))**2 + ((y_coords - height*0.5)/(height*0.5))**2)
    vignette = np.clip(vignette - 0.4, 0, 1)
    vig_arr = np.zeros((height, width, 4), dtype=np.uint8)
    vig_arr[:, :, 3] = (vignette * 90).astype(np.uint8)
    canvas.paste(Image.fromarray(vig_arr, 'RGBA'), (0, 0), Image.fromarray(vig_arr, 'RGBA'))

    # Save 16:9 Desktop and Mobile variants
    canvas_rgb = canvas.convert('RGB')
    canvas_rgb.save(os.path.join(IMAGES_DIR, 'hero-desktop.jpg'), 'JPEG', quality=95)
    
    # Create Mobile 4:5 / 1:1 focal crop
    mobile_hero = canvas_rgb.crop((200, 100, 1720, 1080)).resize((1080, 1080), Image.Resampling.LANCZOS)
    mobile_hero.save(os.path.join(IMAGES_DIR, 'hero-mobile.jpg'), 'JPEG', quality=95)
    print("[OK] Saved hero-desktop.jpg (16:9) & hero-mobile.jpg (1:1/mobile)")

# =========================================================================
# 2. STORY 1: "Why We Built an Uncompromising Leather Atelier" (16:9)
# =========================================================================
def build_story_workshop_16_9():
    print("Building Story 1 Workshop 16:9 Image...")
    w, h = 1600, 900
    # Create master craftsman cutting workbench scene
    bench = create_wood_surface(w, h, base_color=(80, 56, 40), grain_color=(40, 26, 18))
    draw = ImageDraw.Draw(bench, 'RGBA')
    
    # Large unrolled full-grain black obsidian leather hide on table
    # Organic hide contour polygon
    hide_pts = [
        (150, 180), (450, 140), (850, 160), (1250, 130), (1500, 220),
        (1550, 580), (1450, 780), (1100, 820), (700, 790), (350, 810),
        (120, 720), (80, 420)
    ]
    
    # Draw hide shadow
    shadow_pts = [(x + 10, y + 15) for x, y in hide_pts]
    draw.polygon(shadow_pts, fill=(15, 10, 8, 140))
    
    # Draw Hide Body with rich leather grain
    draw.polygon(hide_pts, fill=(28, 30, 32, 255), outline=(50, 54, 58, 255))
    
    # Add subtle leather sheen & panel chalk lines
    draw.line([(320, 240), (620, 720)], fill=(220, 220, 210, 120), width=3)
    draw.line([(620, 720), (980, 680)], fill=(220, 220, 210, 120), width=3)
    draw.line([(980, 680), (1240, 280)], fill=(220, 220, 210, 120), width=3)
    draw.line([(620, 240), (980, 260)], fill=(220, 220, 210, 100), width=2)
    
    # Brass Shears on Workbench
    draw.ellipse([1180, 620, 1280, 720], outline=(210, 165, 80, 255), width=10) # Handle 1
    draw.ellipse([1260, 660, 1360, 760], outline=(210, 165, 80, 255), width=10) # Handle 2
    draw.polygon([(1220, 640), (1480, 420), (1520, 450), (1250, 680)], fill=(190, 195, 200, 255), outline=(120, 125, 130, 255))
    
    # Bone folder / Edge beveler & Steel rule
    draw.rectangle([250, 110, 1350, 150], fill=(160, 165, 172, 240), outline=(80, 85, 90, 255)) # Steel rule
    for mark in range(260, 1340, 20):
        draw.line([(mark, 110), (mark, 125 if mark % 100 == 0 else 118)], fill=(40, 42, 45, 255), width=2)
        
    # Spools of heavy bonded nylon thread (Gold & Charcoal)
    draw.rounded_rectangle([1360, 220, 1480, 360], radius=15, fill=(185, 142, 75, 255), outline=(110, 80, 35, 255), width=3)
    draw.rounded_rectangle([1420, 340, 1540, 480], radius=15, fill=(35, 38, 42, 255), outline=(15, 18, 22, 255), width=3)

    # Cut pattern piece in cognac leather
    pat_pts = [(400, 320), (750, 290), (820, 650), (480, 680)]
    draw.polygon([(x+8, y+10) for x, y in pat_pts], fill=(15, 10, 8, 120))
    draw.polygon(pat_pts, fill=(148, 85, 42, 255), outline=(190, 120, 65, 255))
    # Saddle stitch holes on pattern
    for sx in range(430, 730, 22):
        draw.ellipse([sx, 310, sx+4, 314], fill=(240, 210, 160, 255))

    # Apply warm cinematic lighting filter
    bench_rgb = bench.convert('RGB')
    enhancer = ImageEnhance.Color(bench_rgb)
    bench_rgb = enhancer.enhance(1.15)
    
    bench_rgb.save(os.path.join(IMAGES_DIR, 'story-workshop.jpg'), 'JPEG', quality=95)
    print("[OK] Saved story-workshop.jpg (16:9)")

# =========================================================================
# 3. STORY 3: "Vegetable Tanning, Heavy Hardware & Precision Seams" (4:3)
# =========================================================================
def build_story_craft_4_3():
    print("Building Story 3 Craft 4:3 Macro Image...")
    w, h = 1400, 1050
    # Macro leather texture with brass zipper teeth and hand saddle-stitching
    img = Image.new('RGB', (w, h), '#7A4522')
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Rich dual leather panels joined together (Left: Obsidian Black, Right: Bourbon Tan)
    y, x = np.ogrid[:h, :w]
    
    # Left Panel: Obsidian Black Lambskin with micro-pebble grain
    left_noise = np.random.normal(0, 12, (h, int(w*0.52)))
    left_r = np.clip(32 + left_noise, 0, 255)
    left_g = np.clip(34 + left_noise, 0, 255)
    left_b = np.clip(38 + left_noise, 0, 255)
    left_arr = np.dstack((left_r, left_g, left_b)).astype(np.uint8)
    img.paste(Image.fromarray(left_arr, 'RGB'), (0, 0))
    
    # Right Panel: Vegetable-Tanned Bourbon Tan
    right_w = w - int(w*0.48)
    right_noise = np.random.normal(0, 14, (h, right_w))
    right_r = np.clip(165 + right_noise + np.sin(y*0.01)*15, 0, 255)
    right_g = np.clip(98 + right_noise*0.6 + np.sin(y*0.01)*10, 0, 255)
    right_b = np.clip(45 + right_noise*0.4, 0, 255)
    right_arr = np.dstack((right_r, right_g, right_b)).astype(np.uint8)
    img.paste(Image.fromarray(right_arr, 'RGB'), (int(w*0.48), 0))
    
    # Center Join with Heavy-Duty Antique Brass YKK Zipper & Tape
    zip_x = int(w * 0.5)
    draw.rectangle([zip_x - 38, 0, zip_x + 38, h], fill=(22, 22, 24, 255)) # Zipper tape
    
    # Interlocking Antique Brass Zipper Teeth
    for zy in range(15, h, 28):
        # Left tooth
        draw.rounded_rectangle([zip_x - 28, zy, zip_x - 2, zy + 16], radius=3, fill=(215, 175, 85, 255), outline=(130, 95, 30, 255), width=2)
        # Right tooth (interlocked offset)
        draw.rounded_rectangle([zip_x - 6, zy + 12, zip_x + 24, zy + 28], radius=3, fill=(225, 185, 95, 255), outline=(140, 105, 35, 255), width=2)

    # Double Row Saddle Stitching with Bonded Nylon Gold Thread
    # Left stitch line
    stitch_lx = zip_x - 70
    for sy in range(20, h, 34):
        # Angled saddle stitch dash
        draw.line([(stitch_lx - 8, sy), (stitch_lx + 8, sy + 18)], fill=(235, 195, 110, 255), width=5)
        # Shadow hole
        draw.ellipse([stitch_lx - 10, sy - 2, stitch_lx - 6, sy + 2], fill=(10, 10, 12, 220))
        draw.ellipse([stitch_lx + 6, sy + 16, stitch_lx + 10, sy + 20], fill=(10, 10, 12, 220))

    # Right stitch line
    stitch_rx = zip_x + 70
    for sy in range(20, h, 34):
        draw.line([(stitch_rx - 8, sy), (stitch_rx + 8, sy + 18)], fill=(235, 195, 110, 255), width=5)
        draw.ellipse([stitch_rx - 10, sy - 2, stitch_rx - 6, sy + 2], fill=(10, 10, 12, 220))
        draw.ellipse([stitch_rx + 6, sy + 16, stitch_rx + 10, sy + 20], fill=(10, 10, 12, 220))

    # Edge burnishing sheen and lighting gradient
    vignette = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rectangle([0, 0, w, h], outline=(20, 15, 10, 120), width=40)
    img.paste(vignette, (0, 0), vignette)
    
    img.save(os.path.join(IMAGES_DIR, 'story-craft.jpg'), 'JPEG', quality=95)
    print("[OK] Saved story-craft.jpg (4:3 macro)")

# =========================================================================
# 4. TRAVEL BAGS & WEEKEND DUFFELS ("The Voyager & Commuter Collection")
# =========================================================================
def build_travel_duffels_image():
    print("Building Travel Bags & Duffels 4:3 & 1:1 Images...")
    w, h = 1400, 1050
    # Hotel suite / studio floor setting
    bg = create_wood_surface(w, h, base_color=(70, 48, 35), grain_color=(35, 22, 15))
    
    duffel = get_image('leather_weekend_duffel.jpg')
    briefcase = get_image('leather_commuter_briefcase.jpg')
    belt = get_image('leather_dress_belt_bourbon.jpg')
    
    def extract_subject(img, lum_thresh=220):
        if not img: return None
        arr = np.array(img).astype(np.float32)
        r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
        lum = 0.299*r + 0.587*g + 0.114*b
        mask = ((lum < lum_thresh)).astype(np.float32)
        mask = Image.fromarray((mask * 255).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(3))
        img.putalpha(mask)
        return img

    if duffel:
        d_sub = extract_subject(duffel.copy(), lum_thresh=220)
        dh = 640
        dw = int(d_sub.width * (dh / d_sub.height))
        d_sub = d_sub.resize((dw, dh), Image.Resampling.LANCZOS)
        pos = (120, 240)
        apply_shadow(bg, d_sub, pos, blur=28, offset=(10, 30), opacity=0.6)
        bg.paste(d_sub, pos, d_sub)
        
    if briefcase:
        bc_sub = extract_subject(briefcase.copy(), lum_thresh=220)
        bch = 560
        bcw = int(bc_sub.width * (bch / bc_sub.height))
        bc_sub = bc_sub.resize((bcw, bch), Image.Resampling.LANCZOS)
        pos = (740, 340)
        apply_shadow(bg, bc_sub, pos, blur=22, offset=(5, 25), opacity=0.55)
        bg.paste(bc_sub, pos, bc_sub)

    # Save to cat-accessories.jpg and leather_weekend_duffel.jpg
    bg_rgb = bg.convert('RGB')
    bg_rgb.save(os.path.join(IMAGES_DIR, 'cat-accessories.jpg'), 'JPEG', quality=95)
    
    # 1:1 Square Crop
    square = bg_rgb.crop((175, 0, 1225, 1050)).resize((1200, 1200), Image.Resampling.LANCZOS)
    square.save(os.path.join(IMAGES_DIR, 'leather_weekend_duffel.jpg'), 'JPEG', quality=95)
    print("[OK] Saved cat-accessories.jpg & leather_weekend_duffel.jpg (4:3 and 1:1)")

# =========================================================================
# 5. INDIRANAGAR STUDIO INTERIOR ("Try In Person at Our Indiranagar Studio")
# =========================================================================
def build_indiranagar_studio_16_9():
    print("Building Indiranagar Studio 16:9 Image...")
    w, h = 1600, 900
    # Architectural interior with exposed brick, warm oak racks, and consultation suite
    studio = Image.new('RGB', (w, h), '#221C18')
    draw = ImageDraw.Draw(studio, 'RGBA')
    
    # Wall with warm spotlights
    y, x = np.ogrid[:h, :w]
    floor_y = int(h * 0.65)
    
    # Exposed brick wall texture
    for by in range(0, floor_y, 36):
        row_offset = 35 if (by // 36) % 2 == 1 else 0
        for bx in range(-40, w + 40, 70):
            brick_r = np.random.randint(65, 88)
            brick_g = np.random.randint(40, 56)
            brick_b = np.random.randint(32, 45)
            draw.rectangle([bx + row_offset, by, bx + row_offset + 64, by + 30], fill=(brick_r, brick_g, brick_b, 255))
            draw.rectangle([bx + row_offset, by, bx + row_offset + 64, by + 30], outline=(30, 24, 20, 255), width=2)
            
    # Warm Timber Flooring
    draw.rectangle([0, floor_y, w, h], fill=(68, 46, 32, 255))
    for px in range(0, w, 110):
        draw.line([(px, floor_y), (px + (px - w//2)*0.3, h)], fill=(40, 26, 18, 255), width=3)
        
    # Brass Wall Rail with Hanging Leather Jackets
    draw.line([(180, 240), (1050, 240)], fill=(210, 168, 85, 255), width=10)
    draw.rectangle([170, 230, 190, 280], fill=(180, 140, 70, 255))
    draw.rectangle([1040, 230, 1060, 280], fill=(180, 140, 70, 255))
    
    # Hanging garments on rack (Silhouette variations: Black Biker, Cognac Trench, Burgundy Bomber)
    biker = get_image('mens_biker_black.jpg')
    coat = get_image('mens_coat_brown.jpg')
    bomber = get_image('womens_bomber_red.jpg')
    
    def extract_sub(img):
        if not img: return None
        arr = np.array(img).astype(np.float32)
        lum = 0.299*arr[:,:,0] + 0.587*arr[:,:,1] + 0.114*arr[:,:,2]
        mask = (lum < 220).astype(np.float32)
        mask = Image.fromarray((mask * 255).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(3))
        img.putalpha(mask)
        return img
        
    if biker:
        b_sub = extract_sub(biker.copy()).resize((320, 480))
        studio.paste(b_sub, (220, 230), b_sub)
    if coat:
        c_sub = extract_sub(coat.copy()).resize((340, 520))
        studio.paste(c_sub, (480, 220), c_sub)
    if bomber:
        bm_sub = extract_sub(bomber.copy()).resize((300, 460))
        studio.paste(bm_sub, (740, 235), bm_sub)
        
    # Luxury Lounge Consultation Chair & Table on Right Side
    # Solid Oak Swatch Table
    draw.rounded_rectangle([1120, 520, 1540, 780], radius=8, fill=(82, 54, 36, 255), outline=(45, 28, 18, 255), width=3)
    # Leather Swatch Book on Table
    draw.rounded_rectangle([1180, 540, 1340, 640], radius=4, fill=(155, 88, 45, 255), outline=(220, 180, 95, 255), width=2)
    draw.rounded_rectangle([1320, 550, 1480, 650], radius=4, fill=(28, 30, 32, 255), outline=(80, 84, 90, 255), width=2)
    # Brass Desk Lamp / Accents
    draw.polygon([(1440, 420), (1480, 420), (1490, 460), (1430, 460)], fill=(225, 180, 85, 255))
    draw.line([(1460, 460), (1460, 540)], fill=(200, 160, 75, 255), width=6)
    
    # Soft warm room lighting overlay
    spotlight = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(spotlight)
    sdraw.ellipse([200, 80, 850, 450], fill=(255, 220, 160, 40))
    sdraw.ellipse([1100, 200, 1550, 700], fill=(255, 215, 150, 35))
    studio.paste(spotlight, (0, 0), spotlight)

    studio_rgb = studio.convert('RGB')
    studio_rgb.save(os.path.join(IMAGES_DIR, 'story-studio.jpg'), 'JPEG', quality=95)
    print("[OK] Saved story-studio.jpg (16:9)")

# =========================================================================
# 6. MASTER ARTISANS & FOUNDER ("Crafted by Hands with Decades of Mastery")
# =========================================================================
def build_story_founder_16_9():
    print("Building Story 2 Founder & Artisans 16:9 Image...")
    w, h = 1600, 900
    studio = create_atelier_room_backdrop(w, h)
    draw = ImageDraw.Draw(studio, 'RGBA')
    
    # Large drafting table with blueprints and jacket pattern pieces
    draw.polygon([(200, 540), (1400, 520), (1480, 880), (120, 900)], fill=(85, 58, 40, 255), outline=(50, 32, 20, 255), width=4)
    # Blueprint papers
    draw.polygon([(280, 560), (780, 545), (740, 840), (220, 860)], fill=(235, 230, 218, 255), outline=(180, 175, 160, 255), width=2)
    # Jacket sketch lines on paper
    draw.line([(380, 600), (520, 590), (620, 740), (360, 760)], fill=(40, 70, 120, 220), width=3)
    draw.line([(480, 595), (480, 750)], fill=(40, 70, 120, 220), width=2)
    
    # Yellow measuring tape draped across table
    tape_pts = [(450, 680), (650, 640), (880, 700), (1050, 660), (1220, 740)]
    for i in range(len(tape_pts)-1):
        draw.line([tape_pts[i], tape_pts[i+1]], fill=(245, 200, 45, 255), width=12)
        
    # Tailor Shears and Brass Calipers
    draw.ellipse([880, 740, 940, 800], outline=(210, 165, 75, 255), width=8)
    draw.ellipse([930, 760, 990, 820], outline=(210, 165, 75, 255), width=8)
    draw.polygon([(910, 750), (1120, 600), (1145, 620), (935, 770)], fill=(195, 200, 205, 255))
    
    # Tailor Mannequins in background
    biker = get_image('mens_biker_black.jpg')
    if biker:
        b_sub = biker.crop((150, 0, 1050, 1400)).resize((380, 520))
        studio.paste(b_sub, (920, 140), b_sub)
        
    coat = get_image('mens_coat_brown.jpg')
    if coat:
        c_sub = coat.crop((150, 0, 1050, 1400)).resize((400, 560))
        studio.paste(c_sub, (180, 120), c_sub)

    studio_rgb = studio.convert('RGB')
    studio_rgb.save(os.path.join(IMAGES_DIR, 'story-founder.jpg'), 'JPEG', quality=95)
    print("[OK] Saved story-founder.jpg (16:9)")

# =========================================================================
# 7. VEGETABLE BARK TANNERY ("Bark & Vegetable Tannery")
# =========================================================================
def build_story_tannery_4_3():
    print("Building Story Tannery 4:3 Image...")
    w, h = 1400, 1050
    # Historic wooden aging drums & hung hides in sunlight
    bg = Image.new('RGB', (w, h), '#2C221A')
    draw = ImageDraw.Draw(bg, 'RGBA')
    
    # Sky / daylight beam from top skylights
    y, x = np.ogrid[:h, :w]
    sunbeam = np.exp(-((x - w*0.4)**2 / (w*0.35)**2)) * (1.0 - y/h*0.7) * 90
    bg_r = np.clip(55 + sunbeam, 0, 255)
    bg_g = np.clip(42 + sunbeam*0.85, 0, 255)
    bg_b = np.clip(32 + sunbeam*0.65, 0, 255)
    bg = Image.fromarray(np.dstack((bg_r, bg_g, bg_b)).astype(np.uint8), 'RGB')
    draw = ImageDraw.Draw(bg, 'RGBA')
    
    # Giant Oak Tannery Drums in Background (Left and Right)
    draw.ellipse([80, 320, 480, 840], fill=(70, 45, 28, 255), outline=(35, 20, 12, 255), width=8)
    draw.ellipse([180, 380, 380, 780], fill=(48, 30, 18, 255), outline=(25, 15, 8, 255), width=6)
    
    # Hung Vegetable-Tanned Hides Drying (Bourbon Tan, Deep Oxblood, Chestnut)
    # Hide 1: Bourbon Tan
    draw.polygon([(480, 120), (740, 110), (790, 780), (440, 820)], fill=(168, 95, 42, 255), outline=(120, 65, 25, 255), width=4)
    # Hide 2: Deep Crimson / Oxblood
    draw.polygon([(720, 130), (980, 120), (1030, 810), (690, 840)], fill=(125, 34, 42, 255), outline=(85, 20, 28, 255), width=4)
    # Hide 3: Obsidian Black
    draw.polygon([(960, 115), (1220, 110), (1270, 770), (930, 800)], fill=(28, 30, 32, 255), outline=(15, 18, 20, 255), width=4)
    
    # Wooden support beams
    draw.rectangle([400, 100, 1300, 135], fill=(95, 60, 38, 255), outline=(45, 28, 16, 255), width=4)
    
    bg_rgb = bg.convert('RGB')
    bg_rgb.save(os.path.join(IMAGES_DIR, 'story-tannery.jpg'), 'JPEG', quality=95)
    print("[OK] Saved story-tannery.jpg (4:3)")

# =========================================================================
# 8. CATEGORY SHORTCUTS & NEED CARDS COVERS
# =========================================================================
def build_category_covers():
    print("Building Category Cover Images (cat-jackets, cat-coats, cat-bombers, cat-skirts, cat-footwear, cat-men, cat-women)...")
    
    def format_cat_card(src_filename, out_filename, target_size=(1200, 1600), pad=(100, 100)):
        base = get_image(src_filename)
        if not base: return
        canvas = Image.new('RGB', target_size, '#F4EFE6')
        # Soft studio vignette
        y, x = np.ogrid[:target_size[1], :target_size[0]]
        dist = np.sqrt(((x - target_size[0]*0.5)/(target_size[0]*0.5))**2 + ((y - target_size[1]*0.45)/(target_size[1]*0.5))**2)
        norm = np.clip(dist * 0.45, 0, 1)
        r = (248 - norm * 20).astype(np.uint8)
        g = (245 - norm * 22).astype(np.uint8)
        b = (239 - norm * 25).astype(np.uint8)
        canvas = Image.fromarray(np.dstack((r, g, b)), 'RGB')
        
        # Resize base keeping aspect
        bh = target_size[1] - pad[1]*2
        bw = int(base.width * (bh / base.height))
        resized = base.resize((bw, bh), Image.Resampling.LANCZOS)
        
        # Position centered
        pos = ((target_size[0] - bw) // 2, pad[1])
        canvas.paste(resized, pos, resized)
        canvas.save(os.path.join(IMAGES_DIR, out_filename), 'JPEG', quality=95)
        print(f"[OK] Saved {out_filename}")

    format_cat_card('mens_biker_black.jpg', 'cat-jackets.jpg')
    format_cat_card('mens_coat_brown.jpg', 'cat-coats.jpg')
    format_cat_card('mens_bomber_black.jpg', 'cat-bombers.jpg')
    format_cat_card('womens_skirt_black.jpg', 'cat-skirts.jpg')
    format_cat_card('leather_chelsea_boots_black.jpg', 'cat-footwear.jpg')
    format_cat_card('mens_racer_black.jpg', 'cat-men.jpg')
    format_cat_card('womens_biker_black.jpg', 'cat-women.jpg')

if __name__ == '__main__':
    build_hero_master_16_9()
    build_story_workshop_16_9()
    build_story_craft_4_3()
    build_travel_duffels_image()
    build_indiranagar_studio_16_9()
    build_story_founder_16_9()
    build_story_tannery_4_3()
    build_category_covers()
    print("\n[OK] ALL EDITORIAL IMAGERY GENERATED SUCCESSFULLY!")
