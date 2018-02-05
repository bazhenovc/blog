---
title: "Randomized Texture Tiling"
date: 2018-02-05T23:09:58+03:00
tags:
  - OpenGL
  - GLSL
categories:
  - Programming
  - Graphics
draft: false
---

A quick and cheap way to generate unique texture patterns on the fly.

<!--more-->

# Demo & source code

The pixel shader below is very simple and self-explanatory: it uses artist-defined tile size and a random seed to generate a procedural UV coordinates.

Sampling a texture using these UVs produces a continious unique pattern.

<script src="https://cdn.rawgit.com/gportelli/pocket.gl/v1.2.3/dist/pocket.gl.min.js"></script>
<div id="WebGLContainer"></div>
<script src="js/randomized-texture-tiling.js"></script>

Here's the GLSL reference function that is used in this demo:

```cpp
#define TILE_COUNT vec2(4, 4)   // hardcoded for the current texture
                                // 256x256 tile size, 1024x1024 texture, 4x4 tiles
vec2 getRandomizedTileUV(vec2 texCoord, float seed)
{
    vec2 tileID     = floor(texCoord * TILE_COUNT) / TILE_COUNT;
    vec2 randomTile = floor(vec2(rand(tileID.yx, seed), rand(tileID.xy, seed)) * TILE_COUNT) / TILE_COUNT;
    return texCoord - (tileID + randomTile);
}
```

# Credits

Pattern texture: https://opengameart.org/content/free-tilling-textures-pack-38
```
Provided by Nobiax.
CC0 1.0 Universal (CC0 1.0)
Public Domain Dedication
No Copyright
This license is acceptable for Free Cultural Works
```

Demo uses PocketGL: http://pocket.gl
```
This demo uses PocketGL
A fully customizable webgl shader sandbox to embed in your pages
Visit http://pocket.gl for the full documentation, examples and tutorials.
```
