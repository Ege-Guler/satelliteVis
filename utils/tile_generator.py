from PIL import Image
import os

def split_image_to_tiles(image_path, tile_size=816, stride=408, output_folder="tiles"):
    """Splits an image into tiles of specified size and stride.
    Args:
        image_path (str): Path to the input image.
        tile_size (int): Size of each tile (tile_size x tile_size).
        stride (int): Stride for moving the tile window.
        output_folder (str): Folder to save the output tiles.
    """
    os.makedirs(output_folder, exist_ok=True)

    img = Image.open(image_path)
    width, height = img.size

    tile_id = 0
    name, ext = os.path.splitext(os.path.basename(image_path))

    for y in range(0, height - tile_size + 1, stride):
        for x in range(0, width - tile_size + 1, stride):
            box = (x, y, x + tile_size, y + tile_size)
            tile = img.crop(box)
            tile_filename = f"{name}_{tile_id}{ext}"
            tile.save(os.path.join(output_folder, tile_filename))
            tile_id += 1

    print(f"Saved {tile_id} tiles for {name}{ext}")

def split(folder):
    """Splits all images in the given folder into tiles.
    Args:
        folder (str): Path to the folder containing images.
    """
    for root, dirs, files in os.walk(folder):
        print(f"{len(files)} files found in {root}")
        for file in sorted(files):
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(root, file)
                output_dir = os.path.join(root, "tiles")
                split_image_to_tiles(image_path, tile_size=816, stride=408, output_folder=output_dir)

split(folder="/home/ege/Desktop/gsu/finalyearproject/train")
