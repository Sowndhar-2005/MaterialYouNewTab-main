import zlib
import struct

def decode_png(filename):
    with open(filename, 'rb') as f:
        signature = f.read(8)
        if signature != b'\x89PNG\r\n\x1a\n':
            raise ValueError("Not a PNG file")
        
        width = 0
        height = 0
        bit_depth = 0
        color_type = 0
        idat_data = b""
        
        while True:
            length_bytes = f.read(4)
            if not length_bytes:
                break
            length = struct.unpack('>I', length_bytes)[0]
            chunk_type = f.read(4)
            chunk_data = f.read(length)
            f.read(4) # crc
            
            if chunk_type == b'IHDR':
                width, height, bit_depth, color_type = struct.unpack('>IIBB', chunk_data[:10])
            elif chunk_type == b'IDAT':
                idat_data += chunk_data
            elif chunk_type == b'IEND':
                break
                
        # Decompress IDAT
        decompressed = zlib.decompress(idat_data)
        
        # Calculate bytes per pixel
        # Color type 6 is RGBA (4 bytes per pixel), 3 is Indexed (1 byte), 2 is RGB (3 bytes), 0 is Grayscale (1 byte), 4 is Grayscale+Alpha (2 bytes)
        bpp = 4 if color_type == 6 else (3 if color_type == 2 else (2 if color_type == 4 else 1))
        
        # Recon filter scanlines
        stride = width * bpp
        pixels = []
        prev_scanline = [0] * stride
        
        idx = 0
        for y in range(height):
            filter_type = decompressed[idx]
            idx += 1
            scanline = list(decompressed[idx:idx+stride])
            idx += stride
            
            recon = []
            for x in range(stride):
                raw = scanline[x]
                a = recon[x - bpp] if x >= bpp else 0
                b = prev_scanline[x]
                c = prev_scanline[x - bpp] if x >= bpp else 0
                
                if filter_type == 0: # None
                    val = raw
                elif filter_type == 1: # Sub
                    val = (raw + a) & 0xFF
                elif filter_type == 2: # Up
                    val = (raw + b) & 0xFF
                elif filter_type == 3: # Average
                    val = (raw + (a + b) // 2) & 0xFF
                elif filter_type == 4: # Paeth
                    p = a + b - c
                    pa = abs(p - a)
                    pb = abs(p - b)
                    pc = abs(p - c)
                    if pa <= pb and pa <= pc:
                        nearest = a
                    elif pb <= pc:
                        nearest = b
                    else:
                        nearest = c
                    val = (raw + nearest) & 0xFF
                else:
                    raise ValueError(f"Unknown filter type {filter_type}")
                
                recon.append(val)
            pixels.append(recon)
            prev_scanline = recon
            
        return width, height, bpp, color_type, pixels

def png_to_svg_path(filename):
    width, height, bpp, color_type, pixels = decode_png(filename)
    path_d = []
    
    for y in range(height):
        row = pixels[y]
        for x in range(width):
            # Check if opaque
            is_opaque = False
            if bpp == 4: # RGBA
                alpha = row[x * 4 + 3]
                is_opaque = alpha > 127
            elif bpp == 1: # Grayscale or Indexed
                # Assume non-zero/non-white is opaque (simple heuristic)
                val = row[x]
                is_opaque = val < 255
            elif bpp == 3: # RGB
                r, g, b_val = row[x*3], row[x*3+1], row[x*3+2]
                is_opaque = (r + g + b_val) < 700 # not near white
                
            if is_opaque:
                path_d.append(f"M{x},{y}h1v1h-1z")
                
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%"><path fill="currentColor" d="{" ".join(path_d)}"/></svg>'
    return svg

print(png_to_svg_path('images/download.png'))
