"""Rename files in one folder with a shared base name."""
from argparse import ArgumentParser
from pathlib import Path

def bulk_rename(folder_path: str, base_name: str) -> None:
    folder = Path(folder_path)
    if not folder.is_dir():
        raise ValueError(f"Not a folder: {folder}")
    files = sorted(item for item in folder.iterdir() if item.is_file())
    for index, source in enumerate(files, start=1):
        destination = source.with_name(f"{base_name}_{index}{source.suffix}")
        if destination.exists() and destination != source:
            raise FileExistsError(f"Refusing to overwrite: {destination}")
        source.rename(destination)
    print(f"Renamed {len(files)} file(s).")

if __name__ == "__main__":
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("folder", help="folder containing files to rename")
    parser.add_argument("base_name", help="new filename prefix")
    args = parser.parse_args()
    bulk_rename(args.folder, args.base_name)
