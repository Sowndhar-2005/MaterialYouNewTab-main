from trace_png import decode_png
from analyze_palette import parse_plte_trns

width, height, bpp, color_type, pixels = decode_png('images/download.png')
plte, trns = parse_plte_trns('images/download.png')

color_counts = {}
for y in range(height):
    row = pixels[y]
    for x in range(width):
        idx = row[x]
        color_counts[idx] = color_counts.get(idx, 0) + 1

# Print colors sorted by pixel count
sorted_counts = sorted(color_counts.items(), key=lambda x: x[1], reverse=True)
for idx, count in sorted_counts:
    print(f"Index {idx}: Color={plte[idx]}, Count={count}")
