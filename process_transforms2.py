import cv2
import numpy as np
import glob
import os
import time

frames_orig_dir = '/Users/joelfarthing/Developer/filamentlabs-site/hrvspark/promo/frames_orig'
frames_out_dir = '/Users/joelfarthing/Developer/filamentlabs-site/hrvspark/promo/frames'
webp_files = sorted(glob.glob(os.path.join(frames_orig_dir, 'frame_*.webp')))

angle = 1.0 # 1 degree counter-clockwise

# Decrease brightness by 20, increase contrast by alpha 1.2
alpha = 1.25 # Contrast control (1.0-3.0)
beta = -25   # Brightness control (0-100)

# Gentle sharpening kernel
kernel = np.array([[ 0, -0.5,  0],
                   [-0.5, 3.0, -0.5],
                   [ 0, -0.5,  0]])

# Cooler color look-up tables
table_b = np.array([min(255, i * 1.08) for i in range(256)]).astype("uint8")
table_g = np.array([min(255, i * 1.02) for i in range(256)]).astype("uint8") 
table_r = np.array([max(0, i * 0.92) for i in range(256)]).astype("uint8")
lut = cv2.merge((table_b, table_g, table_r))

print(f"Applying transformations to {len(webp_files)} frames...")
start_time = time.time()

for counter, file in enumerate(webp_files):
    # Read from original backup
    img = cv2.imread(file, cv2.IMREAD_UNCHANGED)
    if img is None: continue
    
    b, g, r, a = cv2.split(img)
    bgr = cv2.merge((b, g, r))
    
    # 1. Contrast and Brightness
    bgr = cv2.convertScaleAbs(bgr, alpha=alpha, beta=beta)
    
    # 2. Sharpen
    bgr = cv2.filter2D(bgr, -1, kernel)
    
    # 3. Color correct (Cooler)
    bgr = cv2.LUT(bgr, lut)
    
    # Merge back alpha
    b, g, r = cv2.split(bgr)
    img_mod = cv2.merge((b, g, r, a))
    
    # 4. Rotate
    h, w = img_mod.shape[:2]
    M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1.0) # True rotation without scaling
    img_rotated = cv2.warpAffine(img_mod, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))
    
    # 5. True Image Resize bounds (since the whole bounding box is huge, we're scaling down the canvas padding inherently)
    scale = 0.8
    new_w = int(w * scale)
    new_h = int(h * scale)
    img_final = cv2.resize(img_rotated, (new_w, new_h), interpolation=cv2.INTER_AREA)
    
    # Write to output dir
    out_path = os.path.join(frames_out_dir, os.path.basename(file))
    cv2.imwrite(out_path, img_final, [int(cv2.IMWRITE_WEBP_QUALITY), 80])
    
    if (counter + 1) % 50 == 0:
        elapsed = time.time() - start_time
        print(f"Processed {counter + 1}/{len(webp_files)} frames ({elapsed:.1f}s)")

print(f"Finished processing all frames in {time.time() - start_time:.1f}s!")
