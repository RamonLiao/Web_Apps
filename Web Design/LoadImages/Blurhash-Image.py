# https://github.com/halcy/blurhash-python
# This package also can be applied in JavaScript.

import blurhash
import PIL.Image
# from PIL import Image
import numpy

# img = PIL.Image.open("IMG_0947.JPG")
# img.show()

result = blurhash.encode(numpy.array(PIL.Image.open("IMG_0947.JPG").convert("RGB")))
newImg = PIL.Image.fromarray(numpy.array(blurhash.decode(result, 800, 600)).astype('uint8'))
newImg = newImg.save("IMG_0947_blurred.JPG")
