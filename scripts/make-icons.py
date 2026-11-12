"""Gera os ícones do guia (PNG e SVG) a partir dos tokens do design system.

Uso: python scripts/make-icons.py
Ícone: estrela dourada sobre o vinho do tema natalino (site/css/guia.css). Nunca editar os PNGs à mão.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ACCENT = "#8e1c2c"  # --accent
STAR_COLOR = "#f2cf6b"  # --ornament-on-accent
OUT = Path(__file__).resolve().parent.parent / "site" / "icons"

# Estrela de 5 pontas no quadro 24x24 (mesma do ícone i-star do index.html).
STAR = [(12, 3), (14.6, 8.6), (20.7, 9.3), (16.2, 13.5), (17.4, 19.5),
        (12, 16.6), (6.6, 19.5), (7.8, 13.5), (3.3, 9.3), (9.4, 8.6)]


def star_points(size: int, scale: float) -> list[tuple[float, float]]:
    """Centraliza a estrela ocupando `scale` do ícone."""
    unit = size * scale / 24
    offset = (size - 24 * unit) / 2
    return [(offset + x * unit, offset + y * unit + unit * 0.4) for x, y in STAR]


def png(size: int, name: str, scale: float) -> None:
    img = Image.new("RGB", (size, size), ACCENT)
    ImageDraw.Draw(img).polygon(star_points(size, scale), fill=STAR_COLOR)
    img.save(OUT / name, optimize=True)


def svg() -> None:
    pts = " ".join(f"{x:.1f},{y + 0.4:.1f}" for x, y in STAR)
    (OUT / "icon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
        f'<rect width="24" height="24" rx="5" fill="{ACCENT}"/>'
        f'<polygon transform="translate(3.6 3.6) scale(0.7)" points="{pts}" fill="{STAR_COLOR}"/></svg>\n',
        encoding="utf-8",
    )


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    # 0.55: margem segura para ícone "maskable" (Android recorta em círculo).
    png(192, "icon-192.png", 0.55)
    png(512, "icon-512.png", 0.55)
    png(180, "apple-touch-icon.png", 0.6)
    svg()
    print("ícones gerados em", OUT)
