import cv2
import numpy as np

# Load the middle frame to test
file = '/Users/joelfarthing/Developer/filamentlabs-site/hrvspark/promo/frames/frame_0113.webp'
img = cv2.imread(file, cv2.IMREAD_UNCHANGED)

b, g, r, a = cv2.split(img)

# 1. Sharpening BGR (Gentle kernel)
kernel = np.array([[ 0, -0.5,  0],
                   [-0.5, 3.0, -0.5],
                   [ 0, -0.5,  0]])
bgr = cv2.merge((b, g, r))
bgr = cv2.filter2D(bgr, -1, kernel)

# 2. Color Correction (Cooler - boost blue, reduce red)
table_b = np.array([min(255, i * 1.1) for i in range(256)]).astype("uint8")
table_g = np.array([i for i in range(256)]).astype("uint8")
table_r = np.array([max(0, i * 0.9) for i in range(256)]).astype("uint8")
lut = cv2.merge((table_b, table_g, table_r))
bgr = cv2.LUT(bgr, lut)

# Back to BGRA
b, g, r = cv2.split(bgr)
img_mod = cv2.merge((b, g, r, a))

# 3. Rotation (-1 deg) & Scale (0.8)
h, w = img_mod.shape[:2]
# +1 degree is counter-clockwise in getRotationMatrix2D
M = cv2.getRotationMatrix2D((w/2, h/2), 1.0, 0.80) 
img_mod = cv2.warpAffine(img_mod, M, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))

cv2.imwrite('/tmp/test_transformed.webp', img_mod, [int(cv2.IMWRITE_WEBP_QUALITY), 80])
print("Saved /tmp/test_transformed.webp")
