import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

IMAGES_DIR = os.path.join(os.getcwd(), 'public', 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)

# Load base reference textures from generated Nano Banana images
def get_base_image(filename):
    path = os.path.join(IMAGES_DIR, filename)
    if os.path.exists(path):
        return Image.open(path).convert('RGBA')
    return None

base_mb_black = get_base_image('mens_biker_black.jpg')
base_mj_brown = get_base_image('mens_jacket_brown.jpg')
base_mj_red = get_base_image('mens_jacket_red.jpg')
base_wb_black = get_base_image('womens_biker_black.jpg')
base_wj_brown = get_base_image('womens_jacket_brown.jpg')
base_wj_red = get_base_image('womens_jacket_red.jpg')
base_mc_black = get_base_image('mens_coat_black.jpg')
base_mc_brown = get_base_image('mens_coat_brown.jpg')
base_mc_red = get_base_image('mens_coat_red.jpg')

def create_studio_backdrop(width=1200, height=1600):
    """Creates a high-end luxury studio backdrop with soft radial vignette and warm neutral tone."""
    img = Image.new('RGB', (width, height), '#EFEAE1')
    draw = ImageDraw.Draw(img)
    center_x, center_y = width / 2, height * 0.45
    max_radius = math.sqrt(width**2 + height**2) / 2
    
    # Generate smooth gradient
    y_coords, x_coords = np.ogrid[:height, :width]
    dist_from_center = np.sqrt((x_coords - center_x)**2 + ((y_coords - center_y)*0.9)**2)
    norm_dist = np.clip(dist_from_center / (width * 0.75), 0, 1)
    
    # Soft warm ivory to light beige-charcoal gradient
    r = (248 - norm_dist * 26).astype(np.uint8)
    g = (245 - norm_dist * 28).astype(np.uint8)
    b = (239 - norm_dist * 30).astype(np.uint8)
    
    arr = np.dstack((r, g, b))
    return Image.fromarray(arr, 'RGB')

def adjust_color_tone(img, target_color='black'):
    """Recolors leather while retaining specular highlights and micro-grain texture."""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    arr = np.array(img, dtype=np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # Compute luminance
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    
    # Detect subject vs light background
    # Background in our studio shots is > 230 in brightness and low saturation
    sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    is_subject = ~((lum > 225) & (sat < 20))
    
    if target_color == 'black':
        # Rich obsidian/charcoal black with leather luster
        new_r = np.where(is_subject, lum * 0.28, r)
        new_g = np.where(is_subject, lum * 0.28, g)
        new_b = np.where(is_subject, lum * 0.29, b)
    elif target_color == 'brown':
        # Warm saddle/tobacco/cognac leather
        new_r = np.where(is_subject, np.clip(lum * 0.85 + 25, 0, 255), r)
        new_g = np.where(is_subject, np.clip(lum * 0.52 + 10, 0, 255), g)
        new_b = np.where(is_subject, np.clip(lum * 0.28, 0, 255), b)
    elif target_color == 'red':
        # Deep burgundy/oxblood leather
        new_r = np.where(is_subject, np.clip(lum * 0.88 + 20, 0, 255), r)
        new_g = np.where(is_subject, np.clip(lum * 0.25, 0, 255), g)
        new_b = np.where(is_subject, np.clip(lum * 0.30 + 5, 0, 255), b)
    else:
        return img.convert('RGB')
        
    out_arr = np.dstack((new_r, new_g, new_b, a)).astype(np.uint8)
    return Image.fromarray(out_arr, 'RGBA').convert('RGB')

def build_women_coat_black():
    """Women's Double-Breasted Longline Belted Black Leather Trench Coat"""
    base = base_wb_black.copy().resize((1200, 1600))
    coat_base = base_mc_black.copy().resize((1200, 1600))
    # Blend tailored shoulders and feminine waist with longline trench bottom
    bg = create_studio_backdrop(1200, 1600)
    
    # Combine top torso with tailored feminine longline skirt
    coat_crop = coat_base.crop((120, 0, 1080, 1600))
    enhancer = ImageEnhance.Contrast(coat_crop)
    coat_crop = enhancer.enhance(1.05)
    
    # Add waist cinch belt and epaulette accents
    draw = ImageDraw.Draw(coat_crop)
    # Draw leather belt strap at waist (y: 850 to 920)
    draw.rounded_rectangle([320, 840, 640, 895], radius=6, fill=(28, 28, 30, 255), outline=(50, 50, 54, 255), width=2)
    # Silver metallic belt buckle
    draw.rounded_rectangle([450, 830, 510, 905], radius=4, outline=(195, 200, 205, 255), width=6)
    draw.rectangle([475, 835, 485, 900], fill=(195, 200, 205, 255))
    
    bg.paste(coat_crop, (120, 0), coat_crop.convert('RGBA'))
    out = bg.filter(ImageFilter.SMOOTH_MORE)
    out.save(os.path.join(IMAGES_DIR, 'womens_coat_black.jpg'), 'JPEG', quality=95)
    print("Created womens_coat_black.jpg")

def build_women_coat_brown():
    """Women's Caramel Tan Leather Belted Longline Trench Coat"""
    base = base_mc_brown.copy().resize((1200, 1600))
    # Add warm caramel tone and tailored tie belt
    bg = create_studio_backdrop(1200, 1600)
    coat_crop = base.crop((100, 0, 1100, 1600))
    
    draw = ImageDraw.Draw(coat_crop)
    # Draw soft caramel leather knot tie belt
    draw.polygon([(460, 820), (520, 820), (540, 1020), (490, 1030)], fill=(160, 95, 45, 255), outline=(130, 75, 35, 255))
    draw.polygon([(490, 820), (550, 820), (570, 980), (520, 990)], fill=(145, 85, 38, 255), outline=(120, 68, 30, 255))
    draw.rounded_rectangle([330, 820, 670, 875], radius=6, fill=(168, 102, 50, 255), outline=(135, 80, 38, 255), width=2)
    
    bg.paste(coat_crop, (100, 0), coat_crop.convert('RGBA'))
    bg.save(os.path.join(IMAGES_DIR, 'womens_coat_brown.jpg'), 'JPEG', quality=95)
    print("Created womens_coat_brown.jpg")

def build_women_coat_red():
    """Women's Deep Burgundy Red Leather Longline Coat"""
    base = base_mc_red.copy().resize((1200, 1600))
    bg = create_studio_backdrop(1200, 1600)
    coat_crop = base.crop((100, 0, 1100, 1600))
    
    draw = ImageDraw.Draw(coat_crop)
    draw.rounded_rectangle([340, 830, 660, 885], radius=6, fill=(110, 28, 38, 255), outline=(85, 20, 28, 255), width=2)
    # Gold metallic belt buckle
    draw.rounded_rectangle([470, 822, 530, 893], radius=4, outline=(210, 175, 95, 255), width=5)
    draw.rectangle([495, 827, 505, 888], fill=(210, 175, 95, 255))
    
    bg.paste(coat_crop, (100, 0), coat_crop.convert('RGBA'))
    bg.save(os.path.join(IMAGES_DIR, 'womens_coat_red.jpg'), 'JPEG', quality=95)
    print("Created womens_coat_red.jpg")

def build_bomber(gender='mens', color='black'):
    """Bomber / Flight Jacket with ribbed knit collar, cuffs, and hem waistband."""
    filename = f"{gender}_bomber_{color}.jpg"
    base_src = base_mb_black if (gender == 'mens' and color == 'black') else \
               base_mj_brown if (gender == 'mens' and color == 'brown') else \
               base_mj_red if (gender == 'mens' and color == 'red') else \
               base_wb_black if (gender == 'womens' and color == 'black') else \
               base_wj_brown if (gender == 'womens' and color == 'brown') else \
               base_wj_red
    
    img = base_src.copy().resize((1200, 1600))
    draw = ImageDraw.Draw(img)
    
    rib_color = (25, 25, 28, 255) if color == 'black' else \
                (65, 38, 22, 255) if color == 'brown' else \
                (55, 18, 24, 255)
    highlight_rib = (45, 45, 50, 255) if color == 'black' else \
                    (85, 50, 30, 255) if color == 'brown' else \
                    (75, 25, 32, 255)
                    
    # Draw ribbed knit collar band (curved around neck)
    draw.ellipse([460, 170, 740, 280], outline=rib_color, width=18)
    for i in range(480, 720, 8):
        draw.line([(i, 205), (i, 245)], fill=highlight_rib, width=2)
        
    # Draw ribbed knit bottom hem band (y: 1160 to 1250)
    draw.rounded_rectangle([320, 1160, 880, 1240], radius=8, fill=rib_color, outline=highlight_rib, width=2)
    for x in range(330, 870, 7):
        draw.line([(x, 1165), (x, 1235)], fill=highlight_rib, width=2)
        
    # Draw ribbed knit sleeve cuffs
    draw.rounded_rectangle([180, 1180, 270, 1260], radius=6, fill=rib_color, outline=highlight_rib, width=2)
    draw.rounded_rectangle([930, 1180, 1020, 1260], radius=6, fill=rib_color, outline=highlight_rib, width=2)
    
    # Center heavy front zip
    zip_color = (200, 205, 210, 255) if color != 'brown' else (210, 175, 80, 255)
    draw.line([(600, 250), (600, 1160)], fill=zip_color, width=6)
    # Heavy pull tab
    draw.rounded_rectangle([592, 420, 608, 460], radius=3, fill=zip_color)
    
    # Left sleeve MA-1 zippered utility pocket
    draw.rounded_rectangle([200, 580, 265, 720], radius=4, fill=rib_color, outline=(70, 70, 75, 255), width=2)
    draw.line([(232, 600), (232, 700)], fill=zip_color, width=3)
    
    # For brown flight jacket, add plush cream shearling collar trim
    if color == 'brown' and gender == 'mens':
        draw.polygon([(460, 190), (410, 270), (510, 340), (570, 270)], fill=(245, 240, 228, 255), outline=(210, 200, 185, 255))
        draw.polygon([(740, 190), (790, 270), (690, 340), (630, 270)], fill=(245, 240, 228, 255), outline=(210, 200, 185, 255))
        
    out = img.convert('RGB')
    out.save(os.path.join(IMAGES_DIR, filename), 'JPEG', quality=95)
    print(f"Created {filename}")

def build_racer(gender='mens', color='black'):
    """Café Racer Jacket with mandarin snap collar, vertical chest zips, and racing contours."""
    filename = f"{gender}_racer_{color}.jpg"
    base_src = base_mb_black if (gender == 'mens' and color == 'black') else \
               base_mj_brown if (gender == 'mens' and color == 'brown') else \
               base_mj_red if (gender == 'mens' and color == 'red') else \
               base_wb_black if (gender == 'womens' and color == 'black') else \
               base_wj_brown if (gender == 'womens' and color == 'brown') else \
               base_wj_red
               
    img = base_src.copy().resize((1200, 1600))
    draw = ImageDraw.Draw(img)
    
    zip_color = (200, 205, 210, 255) if color != 'brown' else (210, 175, 80, 255)
    leather_tone = (28, 28, 30, 255) if color == 'black' else \
                   (110, 65, 32, 255) if color == 'brown' else \
                   (100, 25, 32, 255)
                   
    # Mandarin band collar with snap tab
    draw.rounded_rectangle([480, 190, 720, 250], radius=10, fill=leather_tone, outline=(70, 70, 75, 255), width=2)
    # Metallic snap button on collar tab
    draw.ellipse([675, 208, 695, 228], fill=zip_color, outline=(80, 80, 85, 255), width=2)
    
    # Straight clean vertical center zipper (classic racer design)
    draw.line([(600, 240), (600, 1220)], fill=zip_color, width=6)
    
    # Dual symmetrical chest zip pockets (angled / horizontal)
    draw.line([(400, 480), (540, 480)], fill=zip_color, width=4)
    draw.line([(660, 480), (800, 480)], fill=zip_color, width=4)
    # Hand warmer side zips
    draw.line([(380, 850), (430, 1020)], fill=zip_color, width=4)
    draw.line([(820, 850), (770, 1020)], fill=zip_color, width=4)
    
    # Racing stripe detailing on shoulders / sleeves for red racer
    if color == 'red':
        draw.line([(280, 320), (220, 850)], fill=(245, 240, 230, 255), width=8)
        draw.line([(295, 320), (235, 850)], fill=(25, 25, 28, 255), width=6)
        draw.line([(920, 320), (980, 850)], fill=(245, 240, 230, 255), width=8)
        draw.line([(905, 320), (965, 850)], fill=(25, 25, 28, 255), width=6)

    out = img.convert('RGB')
    out.save(os.path.join(IMAGES_DIR, filename), 'JPEG', quality=95)
    print(f"Created {filename}")

def build_trucker(gender='mens', color='black'):
    """Western Trucker Jacket with point collar, dual flap chest pockets, vertical seam panels, and metal shank buttons."""
    filename = f"{gender}_trucker_{color}.jpg"
    base_src = base_mb_black if (gender == 'mens' and color == 'black') else \
               base_mj_brown if (gender == 'mens' and color == 'brown') else \
               base_mj_red if (gender == 'mens' and color == 'red') else \
               base_wb_black if (gender == 'womens' and color == 'black') else \
               base_wj_brown if (gender == 'womens' and color == 'brown') else \
               base_wj_red
               
    img = base_src.copy().resize((1200, 1600))
    draw = ImageDraw.Draw(img)
    
    leather_tone = (28, 28, 30, 255) if color == 'black' else \
                   (125, 75, 38, 255) if color == 'brown' else \
                   (115, 30, 38, 255)
    shank_color = (215, 218, 222, 255) if color != 'brown' else (210, 175, 80, 255)
    
    # Sharp point trucker collar
    draw.polygon([(460, 200), (380, 290), (520, 290)], fill=leather_tone, outline=(70, 70, 75, 255))
    draw.polygon([(740, 200), (820, 290), (680, 290)], fill=leather_tone, outline=(70, 70, 75, 255))
    
    # Dual pointed western flap chest pockets
    # Left pocket
    draw.polygon([(380, 460), (540, 460), (540, 570), (460, 610), (380, 570)], fill=leather_tone, outline=(60, 60, 65, 255), width=2)
    draw.polygon([(380, 460), (540, 460), (460, 505)], fill=(35, 35, 38, 255) if color == 'black' else (140, 85, 45, 255) if color == 'brown' else (130, 35, 45, 255), outline=(60, 60, 65, 255), width=2)
    draw.ellipse([450, 480, 470, 500], fill=shank_color, outline=(80, 80, 85, 255), width=2)
    
    # Right pocket
    draw.polygon([(660, 460), (820, 460), (820, 570), (740, 610), (660, 570)], fill=leather_tone, outline=(60, 60, 65, 255), width=2)
    draw.polygon([(660, 460), (820, 460), (740, 505)], fill=(35, 35, 38, 255) if color == 'black' else (140, 85, 45, 255) if color == 'brown' else (130, 35, 45, 255), outline=(60, 60, 65, 255), width=2)
    draw.ellipse([730, 480, 750, 500], fill=shank_color, outline=(80, 80, 85, 255), width=2)
    
    # Front center placket with 5 metal shank buttons
    draw.rectangle([585, 270, 615, 1200], fill=leather_tone, outline=(65, 65, 70, 255), width=2)
    for btn_y in [350, 510, 670, 830, 990, 1140]:
        draw.ellipse([590, btn_y, 610, btn_y + 20], fill=shank_color, outline=(70, 70, 75, 255), width=2)
        
    # Vertical front chest seam panels
    draw.line([(460, 610), (460, 1200)], fill=(45, 45, 50, 255), width=2)
    draw.line([(740, 610), (740, 1200)], fill=(45, 45, 50, 255), width=2)

    out = img.convert('RGB')
    out.save(os.path.join(IMAGES_DIR, filename), 'JPEG', quality=95)
    print(f"Created {filename}")

def build_leather_goods():
    """Builds premium leather duffel, briefcase, Chelsea boots, and full-grain belt."""
    # 1. Weekend Duffel Bag
    duffel = create_studio_backdrop(1200, 1200)
    draw = ImageDraw.Draw(duffel)
    # Main duffel cylinder body
    draw.rounded_rectangle([250, 480, 950, 880], radius=80, fill=(30, 30, 34, 255), outline=(55, 55, 60, 255), width=3)
    # Bourbon tan leather accent straps
    draw.rectangle([380, 470, 440, 890], fill=(165, 98, 48, 255), outline=(125, 70, 32, 255), width=2)
    draw.rectangle([760, 470, 820, 890], fill=(165, 98, 48, 255), outline=(125, 70, 32, 255), width=2)
    # Rolled leather top handles
    draw.arc([350, 280, 850, 650], start=180, end=0, fill=(165, 98, 48, 255), width=24)
    # Solid brass hardware & luggage tag
    draw.ellipse([400, 520, 420, 540], fill=(215, 180, 90, 255))
    draw.ellipse([780, 520, 800, 540], fill=(215, 180, 90, 255))
    draw.rounded_rectangle([390, 600, 445, 690], radius=6, fill=(140, 80, 35, 255), outline=(215, 180, 90, 255), width=2)
    # Heavy YKK brass zipper along top curve
    draw.line([(290, 510), (910, 510)], fill=(215, 180, 90, 255), width=5)
    duffel.filter(ImageFilter.SMOOTH_MORE).save(os.path.join(IMAGES_DIR, 'leather_weekend_duffel.jpg'), 'JPEG', quality=95)
    print("Created leather_weekend_duffel.jpg")

    # 2. Commuter Briefcase
    briefcase = create_studio_backdrop(1200, 1200)
    draw = ImageDraw.Draw(briefcase)
    # Structured rectangular briefcase in rich saddle cognac
    draw.rounded_rectangle([280, 450, 920, 920], radius=24, fill=(145, 85, 40, 255), outline=(110, 60, 25, 255), width=3)
    # Front flap
    draw.rounded_rectangle([280, 450, 920, 720], radius=20, fill=(160, 95, 46, 255), outline=(120, 68, 30, 255), width=2)
    # Dual front buckle straps
    draw.rounded_rectangle([400, 440, 445, 820], radius=6, fill=(125, 70, 30, 255), outline=(95, 50, 20, 255), width=2)
    draw.rounded_rectangle([755, 440, 800, 820], radius=6, fill=(125, 70, 30, 255), outline=(95, 50, 20, 255), width=2)
    # Solid brass tuck buckles
    draw.rounded_rectangle([392, 700, 452, 760], radius=4, outline=(215, 180, 90, 255), width=6)
    draw.rounded_rectangle([747, 700, 807, 760], radius=4, outline=(215, 180, 90, 255), width=6)
    # Top carry handle with brass D-rings
    draw.rounded_rectangle([480, 380, 720, 440], radius=12, fill=(125, 70, 30, 255), outline=(95, 50, 20, 255), width=3)
    briefcase.filter(ImageFilter.SMOOTH_MORE).save(os.path.join(IMAGES_DIR, 'leather_commuter_briefcase.jpg'), 'JPEG', quality=95)
    print("Created leather_commuter_briefcase.jpg")

    # 3. Chelsea Boots
    boots = create_studio_backdrop(1200, 1200)
    draw = ImageDraw.Draw(boots)
    # Left boot
    draw.polygon([(260, 840), (280, 480), (420, 480), (450, 760), (580, 800), (590, 850), (260, 860)], fill=(28, 28, 30, 255), outline=(50, 50, 54, 255))
    # Elastic side gusset
    draw.polygon([(320, 500), (380, 500), (390, 680), (330, 680)], fill=(18, 18, 20, 255), outline=(40, 40, 42, 255))
    # Goodyear welted leather sole & stacked heel
    draw.rectangle([250, 850, 595, 875], fill=(130, 80, 45, 255))
    draw.rectangle([250, 875, 350, 910], fill=(25, 25, 28, 255))
    # Right boot (offset for 3D pair presentation)
    draw.polygon([(620, 840), (640, 480), (780, 480), (810, 760), (940, 800), (950, 850), (620, 860)], fill=(28, 28, 30, 255), outline=(50, 50, 54, 255))
    draw.polygon([(680, 500), (740, 500), (750, 680), (690, 680)], fill=(18, 18, 20, 255), outline=(40, 40, 42, 255))
    draw.rectangle([610, 850, 955, 875], fill=(130, 80, 45, 255))
    draw.rectangle([610, 875, 710, 910], fill=(25, 25, 28, 255))
    boots.filter(ImageFilter.SMOOTH_MORE).save(os.path.join(IMAGES_DIR, 'leather_chelsea_boots_black.jpg'), 'JPEG', quality=95)
    print("Created leather_chelsea_boots_black.jpg")

    # 4. Full-Grain Belt
    belt = create_studio_backdrop(1200, 1200)
    draw = ImageDraw.Draw(belt)
    # Coiled leather belt presentation
    draw.ellipse([300, 350, 900, 950], outline=(155, 90, 42, 255), width=50)
    draw.ellipse([370, 420, 830, 880], outline=(140, 80, 36, 255), width=45)
    # Solid brass buckle at front
    draw.rounded_rectangle([720, 580, 860, 720], radius=14, outline=(220, 185, 95, 255), width=16)
    draw.rectangle([780, 595, 800, 705], fill=(220, 185, 95, 255))
    belt.filter(ImageFilter.SMOOTH_MORE).save(os.path.join(IMAGES_DIR, 'leather_dress_belt_bourbon.jpg'), 'JPEG', quality=95)
    print("Created leather_dress_belt_bourbon.jpg")

def build_editorial_and_brand_assets():
    """Generates luxury editorial banners, category covers, and craftsmanship workshop scenes."""
    # 1. Hero Desktop Banner (1920x1080)
    hero_desk = Image.new('RGB', (1920, 1080), '#18201B')
    # Soft warm lighting gradient across dark charcoal background
    y_c, x_c = np.ogrid[:1080, :1920]
    dist = np.sqrt((x_c - 1300)**2 + (y_c - 540)**2)
    glow = np.clip(1 - dist / 1100, 0, 1)
    r = (24 + glow * 50).astype(np.uint8)
    g = (32 + glow * 45).astype(np.uint8)
    b = (27 + glow * 35).astype(np.uint8)
    hero_desk = Image.fromarray(np.dstack((r, g, b)), 'RGB')
    
    # Paste high-res jacket models onto right half
    if base_mb_black:
        j_black = base_mb_black.copy().resize((680, 900))
        hero_desk.paste(j_black, (1150, 120), j_black.convert('RGBA'))
    if base_wj_brown:
        j_brown = base_wj_brown.copy().resize((580, 780))
        hero_desk.paste(j_brown, (780, 240), j_brown.convert('RGBA'))
        
    hero_desk.save(os.path.join(IMAGES_DIR, 'hero-desktop.jpg'), 'JPEG', quality=95)
    print("Created hero-desktop.jpg")

    # 2. Hero Mobile Banner (1080x1440)
    hero_mob = Image.new('RGB', (1080, 1440), '#18201B')
    if base_mb_black:
        j_mob = base_mb_black.copy().resize((920, 1220))
        hero_mob.paste(j_mob, (80, 160), j_mob.convert('RGBA'))
    hero_mob.save(os.path.join(IMAGES_DIR, 'hero-mobile.jpg'), 'JPEG', quality=95)
    print("Created hero-mobile.jpg")

    # 3. Category Covers
    cats = [
        ('cat-jackets.jpg', base_mb_black),
        ('cat-coats.jpg', base_mc_brown),
        ('cat-bombers.jpg', base_mj_brown),
        ('cat-skirts.jpg', get_base_image('womens_skirt_black.jpg')),
        ('cat-men.jpg', base_mb_black),
        ('cat-women.jpg', base_wb_black),
        ('cat-accessories.jpg', get_base_image('leather_weekend_duffel.jpg')),
        ('cat-footwear.jpg', get_base_image('leather_chelsea_boots_black.jpg')),
    ]
    for filename, src in cats:
        bg = create_studio_backdrop(800, 800)
        if src:
            fitted = src.copy().resize((680, 680))
            bg.paste(fitted, (60, 60), fitted.convert('RGBA'))
        bg.save(os.path.join(IMAGES_DIR, filename), 'JPEG', quality=95)
        print(f"Created {filename}")

    # 4. Brand Story & Craftsmanship Scenes
    # Workshop
    ws = create_studio_backdrop(1200, 800)
    draw = ImageDraw.Draw(ws)
    # Heavy oak cutting table
    draw.rectangle([100, 450, 1100, 800], fill=(95, 58, 30, 255), outline=(70, 40, 20, 255), width=3)
    # Rolled and draped full-grain hides in black, cognac, and oxblood
    draw.polygon([(150, 480), (450, 430), (520, 620), (180, 680)], fill=(28, 28, 30, 255), outline=(45, 45, 50, 255))
    draw.polygon([(480, 440), (820, 420), (880, 610), (510, 640)], fill=(160, 95, 45, 255), outline=(130, 75, 35, 255))
    draw.polygon([(780, 450), (1050, 440), (1080, 600), (810, 620)], fill=(110, 28, 38, 255), outline=(85, 20, 28, 255))
    # Brass cutting weights, round knife, and awl
    draw.ellipse([300, 520, 360, 580], fill=(215, 180, 90, 255))
    draw.ellipse([620, 500, 680, 560], fill=(215, 180, 90, 255))
    draw.polygon([(700, 560), (760, 530), (790, 550), (720, 590)], fill=(195, 200, 205, 255), outline=(100, 100, 105, 255))
    ws.save(os.path.join(IMAGES_DIR, 'story-workshop.jpg'), 'JPEG', quality=95)
    print("Created story-workshop.jpg")

    # Tannery
    tan = create_studio_backdrop(1200, 800)
    draw = ImageDraw.Draw(tan)
    # Large oak aging tanning vats and hanging hides
    for i, x in enumerate([150, 500, 850]):
        draw.rounded_rectangle([x, 300, x + 240, 750], radius=30, fill=(75, 45, 22, 255), outline=(50, 30, 15, 255), width=4)
        draw.ellipse([x + 10, 280, x + 230, 340], fill=(135, 80, 38, 255), outline=(50, 30, 15, 255), width=3)
    tan.save(os.path.join(IMAGES_DIR, 'story-tannery.jpg'), 'JPEG', quality=95)
    print("Created story-tannery.jpg")

    # Craft Detail (Macro saddle stitch & hardware)
    craft = create_studio_backdrop(1200, 800)
    draw = ImageDraw.Draw(craft)
    draw.rounded_rectangle([150, 150, 1050, 650], radius=20, fill=(30, 30, 34, 255), outline=(55, 55, 60, 255), width=3)
    # Double parallel saddle stitches with golden bonded nylon thread
    for x in range(200, 1000, 24):
        draw.line([(x, 300), (x + 14, 300)], fill=(225, 195, 110, 255), width=5)
        draw.line([(x, 340), (x + 14, 340)], fill=(225, 195, 110, 255), width=5)
    # Polished heavy silver YKK zipper teeth
    draw.line([(200, 500), (1000, 500)], fill=(200, 205, 210, 255), width=16)
    craft.save(os.path.join(IMAGES_DIR, 'story-craft.jpg'), 'JPEG', quality=95)
    print("Created story-craft.jpg")

    # Founder / Master Artisan Studio
    founder = create_studio_backdrop(1200, 800)
    if base_mb_black:
        j_art = base_mb_black.copy().resize((580, 720))
        founder.paste(j_art, (310, 40), j_art.convert('RGBA'))
    founder.save(os.path.join(IMAGES_DIR, 'story-founder.jpg'), 'JPEG', quality=95)
    print("Created story-founder.jpg")

    # Studio Showroom
    studio = create_studio_backdrop(1200, 800)
    draw = ImageDraw.Draw(studio)
    # Modern minimalist industrial rack with hanging jackets
    draw.line([(150, 200), (1050, 200)], fill=(35, 35, 38, 255), width=10)
    draw.line([(180, 200), (180, 750)], fill=(35, 35, 38, 255), width=8)
    draw.line([(1020, 200), (1020, 750)], fill=(35, 35, 38, 255), width=8)
    studio.save(os.path.join(IMAGES_DIR, 'story-studio.jpg'), 'JPEG', quality=95)
    print("Created story-studio.jpg")

def run_all():
    print("Starting generation of complete leather catalogue image assets...")
    build_women_coat_black()
    build_women_coat_brown()
    build_women_coat_red()
    
    # Bombers (Men & Women: Black, Brown, Red)
    for g in ['mens', 'womens']:
        for c in ['black', 'brown', 'red']:
            build_bomber(g, c)
            
    # Racers (Men & Women: Black, Brown, Red)
    for g in ['mens', 'womens']:
        for c in ['black', 'brown', 'red']:
            build_racer(g, c)
            
    # Truckers (Men & Women: Black, Brown, Red)
    for g in ['mens', 'womens']:
        for c in ['black', 'brown', 'red']:
            build_trucker(g, c)
            
    # Leather Goods
    build_leather_goods()
    
    # Editorial & Brand Assets
    build_editorial_and_brand_assets()
    print("All leather catalogue images successfully created in public/images/!")

if __name__ == '__main__':
    run_all()
