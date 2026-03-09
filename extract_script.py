import cv2, sys, os
from rembg import remove, new_session
import time

video_path = '/Users/joelfarthing/Developer/filamentlabs-site/inbox/IMG_2779.MOV'
out_dir = '/Users/joelfarthing/Developer/filamentlabs-site/hrvspark/promo/frames'
os.makedirs(out_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

max_width = 1920
scale = max_width / w if w > max_width else 1.0
out_w, out_h = int(w * scale), int(h * scale)

print(f'Video: {w}x{h}, {fps:.1f}fps, {total} frames')
print('Extracting ALL frames without skipping. WebP with rembg (Session mode).')

session = new_session('u2net')

count = 0
saved = 0
start_time = time.time()

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    if scale != 1.0:
        frame = cv2.resize(frame, (out_w, out_h), interpolation=cv2.INTER_AREA)
    
    frame = remove(frame, session=session)
    path = os.path.join(out_dir, f'frame_{saved+1:04d}.webp')
    cv2.imwrite(path, frame, [int(cv2.IMWRITE_WEBP_QUALITY), 80])
    saved += 1
    
    if saved % 5 == 0:
        elapsed = time.time() - start_time
        print(f'Saved {saved}/{total} frames... ({elapsed:.1f}s elapsed)')
        sys.stdout.flush()
    count += 1

cap.release()
print(f'Done! Saved {saved} frames to {out_dir}')
