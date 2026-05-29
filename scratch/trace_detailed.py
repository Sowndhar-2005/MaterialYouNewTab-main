from trace_png import decode_png
from analyze_palette import parse_plte_trns

def get_labs_svg():
    width, height, bpp, color_type, pixels = decode_png('images/download.png')
    plte, trns = parse_plte_trns('images/download.png')
    
    # Target grid size - 64x64 for much higher resolution
    grid_size = 64
    scale_x = width / grid_size
    scale_y = height / grid_size
    
    binary_grid = []
    for gy in range(grid_size):
        row = []
        for gx in range(grid_size):
            # Sample pixels in this block
            x_start = int(gx * scale_x)
            x_end = int((gx + 1) * scale_x)
            y_start = int(gy * scale_y)
            y_end = int((gy + 1) * scale_y)
            
            dark_count = 0
            total_count = 0
            for py in range(y_start, min(y_end, height)):
                for px in range(x_start, min(x_end, width)):
                    idx = pixels[py][px]
                    r, g, b = plte[idx]
                    # Check if dark (icon foreground)
                    if (r + g + b) < 300:
                        dark_count += 1
                    total_count += 1
            
            # If more than 30% of sampled block is dark, mark as dark
            is_dark = (dark_count / total_count) > 0.3 if total_count > 0 else False
            row.append(is_dark)
        binary_grid.append(row)
        
    # Generate SVG path (combining consecutive horizontal pixels for optimization!)
    path_d = []
    for y in range(grid_size):
        x = 0
        while x < grid_size:
            if binary_grid[y][x]:
                # Find length of consecutive horizontal pixels
                start_x = x
                while x < grid_size and binary_grid[y][x]:
                    x += 1
                width_px = x - start_x
                path_d.append(f"M{start_x},{y}h{width_px}v1h-{width_px}z")
            else:
                x += 1
                
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {grid_size} {grid_size}" width="24" height="24"><path fill="currentColor" d="{" ".join(path_d)}"/></svg>'
    return svg

print(get_labs_svg())
