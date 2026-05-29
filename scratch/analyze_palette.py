import struct

def parse_plte_trns(filename):
    with open(filename, 'rb') as f:
        f.read(8) # signature
        plte = []
        trns = []
        while True:
            length_bytes = f.read(4)
            if not length_bytes:
                break
            length = struct.unpack('>I', length_bytes)[0]
            chunk_type = f.read(4)
            chunk_data = f.read(length)
            f.read(4) # crc
            
            if chunk_type == b'PLTE':
                for i in range(0, length, 3):
                    plte.append(tuple(chunk_data[i:i+3]))
            elif chunk_type == b'tRNS':
                for i in range(length):
                    trns.append(chunk_data[i])
            elif chunk_type == b'IEND':
                break
    return plte, trns

plte, trns = parse_plte_trns('images/download.png')
print("PLTE count:", len(plte))
print("tRNS count:", len(trns))
for i in range(min(len(plte), 10)):
    alpha = trns[i] if i < len(trns) else 255
    print(f"Index {i}: Color={plte[i]}, Alpha={alpha}")
