
new PocketGL("WebGLContainer", {
    tabColor: "#a00", editorTheme: "dark",


    fragmentShader: `
precision mediump float;

uniform vec2        resolution;
uniform float       RandomSeed;
uniform int         UniformScale;
uniform sampler2D   Texture0;

float rand(vec2 co, float seed)
{
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt, 3.14);
    return fract(sin(sn + seed) * c);
}

#define TILE_COUNT vec2(4, 4)   // hardcoded for the current texture
                                // 256x256 tile size, 1024x1024 texture, 4x4 tiles
vec2 getRandomizedTileUV(vec2 texCoord, float seed)
{
    vec2 tileID     = floor(texCoord * TILE_COUNT) / TILE_COUNT;
    vec2 randomTile = floor(vec2(rand(tileID.yx, seed), rand(tileID.xy, seed)) * TILE_COUNT) / TILE_COUNT;
    return texCoord - (tileID + randomTile);
}

void main(void)
{
    float aspectRatio = resolution.x / resolution.y;
    vec2 texCoord = (gl_FragCoord.xy / resolution) * vec2(UniformScale, UniformScale) * aspectRatio;

    vec2 patternUV = getRandomizedTileUV(texCoord, RandomSeed);

    gl_FragColor = texture2D(Texture0, patternUV);
}
`,

    uniforms: [
        {
            type: "float",
            value: 333,
            min: 0,
            max: 9999,
            name: "RandomSeed",
            GUIName: "Random seed"
        },
        {
            type: "integer",
            value: 8,
            min: 1,
            max: 32,
            name: "UniformScale",
            GUIName: "Tiling factor"
        },
        //{
        //    type: "float",
        //    value: 32,
        //    min: 0,
        //    max: 128,
        //    name: "OddRowOffset",
        //    GUIName: "Odd row offset"
        //},
    ],

    textures: [
        {
            url: "tiling_bricks.png",
            wrap: "repeat", // repeat (default), clamp
            name: "Texture0"
        }
    ],

    meshes: [
        { type: "plane", name: "Plane", doubleSided: true, scale: 1.2}
    ],
});
