import sys
import re
from zebra import Zebra

zpl_code_file = sys.argv[1]

with open(zpl_code_file, 'r') as file:
    barcode = file.read().strip()  # .strip() to remove any extra whitespace or newline

if not barcode:
    print("Error: Barcode is empty")
    sys.exit(1)

# Determine header based on the barcode prefix
if barcode.startswith('product'):
    # Extract the number after "start" or "end"
    match = re.search(r'(product)(\d+)', barcode)
    if match:
        header1 = "Product"
        header2 = f"-{match.group(2)}-"
    else:
        print("Error: Barcode format is invalid")
        sys.exit(1)
    font_size = "20"  # Default font size
elif barcode.startswith('UN'):
    header1 = "USER:"
    header2 = ""
    font_size = "30"  # Increase font size when barcode starts with 'UN'
elif barcode.startswith('break'):
    header1 = ""
    header2 = "BREAK"
    font_size = "30"  # Increase font size when barcode starts with 'UN'
else:
    header1 = "Unknown Barcode"
    header2 = ""
    font_size = "20"  # Default font size

print(f"Barcode received: {barcode}")
print(f"Header set to: {header1} {header2}")

zpl_code = f"""
^XA
^LH0,0
^LT-10
^BY1,2,100
^FO20,40^BCN,100,Y,N,N^FD{barcode}^FS
^XZ
"""




z = Zebra('ZDesigner ZD220-203dpi ZPL')

# Send the ZPL code to the printer
z.output(zpl_code)
