from trace_png import decode_png

width, height, bpp, color_type, pixels = decode_png('images/download.png')
print(f"Dimensions: {width}x{height}, BPP: {bpp}, Color Type: {color_type}")

# Let's count unique colors
unique_colors = set()
for y in range(height):
    row = pixels[y]
    for x in range(width):
        if bpp == 4:
            unique_colors.add(tuple(row[x*4 : x*4+4]))
        elif bpp == 3:
            unique_colors.add(tuple(row[x*3 : x*3+3]))
        else:
            unique_colors.add(row[x])

print("Number of unique colors:", len(unique_colors))
print("Sample unique colors (up to 10):", list(unique_colors)[:10])
