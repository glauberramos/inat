#!/usr/bin/env python3
"""Render spectrogram images for birds-porto-alegre.html.

Reads every sound listed in birds-porto-alegre-data.js and writes a
600x150 WebP spectrogram to images/birds-porto-alegre/ for any sound that
doesn't have one yet (pass --force to redo them all).

Requires: node, ffmpeg, numpy, Pillow.
Usage:    python3 scripts/bird-spectrograms.py [--force]
"""
import json
import pathlib
import subprocess
import sys
import tempfile
import urllib.request

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "birds-porto-alegre-data.js"
OUT = ROOT / "images" / "birds-porto-alegre"

SR = 22050
W, H = 600, 150
FMAX = 10000  # Hz; covers most bird song
# Magma-like colour stops, dark (silence) to bright (loud)
STOPS = np.array(
    [[0, 0, 4], [28, 16, 68], [79, 18, 123], [129, 37, 129], [181, 54, 122],
     [229, 80, 100], [251, 135, 97], [254, 194, 135], [252, 253, 191]],
    float,
)


def load_birds():
    # The data file is a plain script; let node evaluate it and hand us JSON.
    code = f"{DATA.read_text()}\nprocess.stdout.write(JSON.stringify(BIRDS_PORTO_ALEGRE));"
    return json.loads(subprocess.run(["node", "-e", code], capture_output=True, check=True, text=True).stdout)


def audio_url(sound):
    if sound["source"] == "macaulay":
        return f"https://cdn.download.ams.birds.cornell.edu/api/v1/asset/{sound['ml']}/audio"
    return sound["audio"]


def spec_name(sound):
    if sound["source"] == "macaulay":
        return f"ml{sound['ml']}"
    if sound["source"] == "xenocanto":
        return f"xc{sound['xc']}"
    return sound["audio"].rsplit("/", 1)[1].rsplit(".", 1)[0]


def colormap(x):
    x = np.clip(x, 0, 1) * (len(STOPS) - 1)
    i = np.floor(x).astype(int)
    j = np.minimum(i + 1, len(STOPS) - 1)
    f = (x - i)[..., None]
    return (STOPS[i] * (1 - f) + STOPS[j] * f).astype(np.uint8)


def render(src, dst, sound):
    # Trimmed sounds (start/end in seconds) only draw that part
    trim = []
    if "start" in sound:
        trim += ["-ss", str(sound["start"])]
    if "end" in sound:
        trim += ["-to", str(sound["end"])]
    # fmin/fmax zoom in on the bird's pitch range; low ranges get a longer
    # window to keep enough frequency detail
    fmin, fmax = sound.get("fmin", 0), sound.get("fmax", FMAX)
    sr = SR if fmax <= SR / 2 else 44100  # voices above 11 kHz (e.g. some hummingbirds) need more
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", *trim, "-i", src, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    y = np.frombuffer(pcm, np.float32)
    n, hop = (1024 if fmax > 3000 else 2048), 128
    if len(y) < n:
        y = np.pad(y, (0, n - len(y)))
    frames = np.lib.stride_tricks.sliding_window_view(y, n)[::hop] * np.hanning(n)
    spec = np.abs(np.fft.rfft(frames, axis=1)) ** 2
    spec = spec[:, int(fmin * n / sr) : int(fmax * n / sr)]
    db = 10 * np.log10(spec + 1e-12)
    # Squeeze the whole recording into W columns; max keeps short notes visible
    edges = np.linspace(0, db.shape[0], W + 1).astype(int)
    cols = np.stack([db[edges[k]:max(edges[k + 1], edges[k] + 1)].max(0) for k in range(W)])
    lo, hi = np.percentile(cols, 55), np.percentile(cols, 99.7)
    img = np.flipud(colormap((cols - lo) / (hi - lo)).transpose(1, 0, 2))
    Image.fromarray(img).resize((W, H), Image.LANCZOS).save(dst, "WEBP", quality=70, method=6)


def main():
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    for bird in load_birds():
        for sound in bird["sounds"]:
            dst = OUT / f"{spec_name(sound)}.webp"
            if dst.exists() and not force:
                continue
            url = audio_url(sound)
            print(f"{bird['name']}: {url}")
            with tempfile.NamedTemporaryFile() as tmp:
                req = urllib.request.Request(url, headers={"User-Agent": "inat-tools"})
                with urllib.request.urlopen(req, timeout=60) as r:
                    tmp.write(r.read())
                tmp.flush()
                render(tmp.name, dst, sound)


if __name__ == "__main__":
    main()
