from PIL import Image
from sys import argv

img = Image.new("RGB", (256, 256))
color = argv[1]
c = (int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16))

for i in range(img.size[1]):
    for j in range(img.size[0]):
        img.putpixel((i, j), c)
img.save("color/" + color + ".png")