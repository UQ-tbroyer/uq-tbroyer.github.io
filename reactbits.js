/*!
 * React Bits — vanilla JavaScript ports used by this portfolio.
 *
 * Source: https://reactbits.dev — https://github.com/DavidHDev/react-bits
 * Ported from commit 4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4.
 *
 * The site has no build step, so instead of shipping React each component is
 * exposed as a plain function: `ReactBits.Name(element, props)`. The props are
 * the same as the React component's; the module-level helpers, shaders and the
 * body of each component's main `useEffect` are copied verbatim, with React refs
 * replaced by `{ current }` objects. Each call returns `{ destroy() }`.
 *
 * ---------------------------------------------------------------------------
 * MIT + Commons Clause License Condition v1.0
 *
 * Copyright (c) 2026 David Haz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, and distribute the Software **as part of
 * an application, website, or product**, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * Commons Clause Restriction
 *
 * You may use this Software, including for any commercial purpose, **so long as
 * you do not sell, sublicense, or redistribute the components themselves-whether
 * alone, in a bundle, or as a ported version.**
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ---------------------------------------------------------------------------
 */
(function (global) {
  'use strict';

  const addClasses = (node, className) => {
    if (className) node.classList.add(...String(className).split(/\s+/).filter(Boolean));
  };

  const applyStyle = (node, style) => {
    if (!style) return;
    Object.entries(style).forEach(([key, value]) => {
      if (key.startsWith('--')) node.style.setProperty(key, value);
      else node.style[key] = value;
    });
  };

  const span = (className, attrs) => {
    const node = document.createElement('span');
    if (className) node.className = className;
    if (attrs) Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };

  /* ===================================================================== */
  /* DarkVeil — src/content/Backgrounds/DarkVeil/DarkVeil.jsx              */
  /* ===================================================================== */
  const DarkVeil = (() => {
    const QUAD_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

    const FIELD = `#version 300 es
precision highp float;
uniform vec2 uView;
uniform vec2 uScale;
uniform float uZoom;
uniform vec2 uTurn;
uniform float uTime;
uniform float uFlow;
uniform float uWarp;
uniform vec3 uSeed;
uniform vec4 uPointer;
uniform vec2 uDrag;
uniform float uUnfold;
uniform float uDither;
out vec4 outColor;

vec4 sigmoid(vec4 x) {
  return 1.0 / (1.0 + exp(-x));
}

vec4 cppn(vec2 coordinate, vec3 latent) {
  vec4 buf[8];
  buf[6]=vec4(coordinate.x,coordinate.y,latent.x,latent.y);
  buf[7]=vec4(latent.z,sqrt(coordinate.x*coordinate.x+coordinate.y*coordinate.y),0.,0.);
  buf[0]=mat4(vec4(6.5404263,-3.6126034,0.7590882,-1.13613),vec4(2.4582713,3.1660357,1.2219609,0.06276096),vec4(-5.478085,-6.159632,1.8701609,-4.7742867),vec4(6.039214,-5.542865,-0.90925294,3.251348))*buf[6]+mat4(vec4(0.8473259,-5.722911,3.975766,1.6522468),vec4(-0.24321538,0.5839259,-1.7661959,-5.350116),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(0.21808943,1.1243913,-1.7969975,5.0294676);
  buf[1]=mat4(vec4(-3.3522482,-6.0612736,0.55641043,-4.4719114),vec4(0.8631464,1.7432913,5.643898,1.6106541),vec4(2.4941394,-3.5012043,1.7184316,6.357333),vec4(3.310376,8.209261,1.1355612,-1.165539))*buf[6]+mat4(vec4(5.24046,-13.034365,0.009859298,15.870829),vec4(2.987511,3.129433,-0.89023495,-1.6822904),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-5.9457836,-6.573602,-0.8812491,1.5436668);
  buf[0]=sigmoid(buf[0]);buf[1]=sigmoid(buf[1]);
  buf[2]=mat4(vec4(-15.219568,8.095543,-2.429353,-1.9381982),vec4(-5.951362,4.3115187,2.6393783,1.274315),vec4(-7.3145227,6.7297835,5.2473326,5.9411426),vec4(5.0796127,8.979051,-1.7278991,-1.158976))*buf[6]+mat4(vec4(-11.967154,-11.608155,6.1486754,11.237008),vec4(2.124141,-6.263192,-1.7050359,-0.7021966),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-4.17164,-3.2281182,-4.576417,-3.6401186);
  buf[3]=mat4(vec4(3.1832156,-13.738922,1.879223,3.233465),vec4(0.64300746,12.768129,1.9141049,0.50990224),vec4(-0.049295485,4.4807224,1.4733979,1.801449),vec4(5.0039253,13.000481,3.3991797,-4.5561905))*buf[6]+mat4(vec4(-0.1285731,7.720628,-3.1425676,4.742367),vec4(0.6393625,3.714393,-0.8108378,-0.39174938),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-1.1811101,-21.621881,0.7851888,1.2329718);
  buf[2]=sigmoid(buf[2]);buf[3]=sigmoid(buf[3]);
  buf[4]=mat4(vec4(5.214916,-7.183024,2.7228765,2.6592617),vec4(-5.601878,-25.3591,4.067988,0.4602802),vec4(-10.57759,24.286327,21.102104,37.546658),vec4(4.3024497,-1.9625226,2.3458803,-1.372816))*buf[0]+mat4(vec4(-17.6526,-10.507558,2.2587414,12.462782),vec4(6.265566,-502.75443,-12.642513,0.9112289),vec4(-10.983244,20.741234,-9.701768,-0.7635988),vec4(5.383626,1.4819539,-4.1911616,-4.8444734))*buf[1]+mat4(vec4(12.785233,-16.345072,-0.39901125,1.7955981),vec4(-30.48365,-1.8345358,1.4542528,-1.1118771),vec4(19.872723,-7.337935,-42.941723,-98.52709),vec4(8.337645,-2.7312303,-2.2927687,-36.142323))*buf[2]+mat4(vec4(-16.298317,3.5471997,-0.44300047,-9.444417),vec4(57.5077,-35.609753,16.163465,-4.1534753),vec4(-0.07470326,-3.8656476,-7.0901804,3.1523974),vec4(-12.559385,-7.077619,1.490437,-0.8211543))*buf[3]+vec4(-7.67914,15.927437,1.3207729,-1.6686112);
  buf[5]=mat4(vec4(-1.4109162,-0.372762,-3.770383,-21.367174),vec4(-6.2103205,-9.35908,0.92529047,8.82561),vec4(11.460242,-22.348068,13.625772,-18.693201),vec4(-0.3429052,-3.9905605,-2.4626114,-0.45033523))*buf[0]+mat4(vec4(7.3481627,-4.3661838,-6.3037653,-3.868115),vec4(1.5462853,6.5488915,1.9701879,-0.58291394),vec4(6.5858274,-2.2180402,3.7127688,-1.3730392),vec4(-5.7973905,10.134961,-2.3395722,-5.965605))*buf[1]+mat4(vec4(-2.5132585,-6.6685553,-1.4029363,-0.16285264),vec4(-0.37908727,0.53738135,4.389061,-1.3024765),vec4(-0.70647055,2.0111287,-5.1659346,-3.728635),vec4(-13.562562,10.487719,-0.9173751,-2.6487076))*buf[2]+mat4(vec4(-8.645013,6.5546675,-6.3944063,-5.5933375),vec4(-0.57783127,-1.077275,36.91025,5.736769),vec4(14.283112,3.7146652,7.1452246,-4.5958776),vec4(2.7192075,3.6021907,-4.366337,-2.3653464))*buf[3]+vec4(-5.9000807,-4.329569,1.2427121,8.59503);
  buf[4]=sigmoid(buf[4]);buf[5]=sigmoid(buf[5]);
  buf[6]=mat4(vec4(-1.61102,0.7970257,1.4675229,0.20917463),vec4(-28.793737,-7.1390953,1.5025433,4.656581),vec4(-10.94861,39.66238,0.74318546,-10.095605),vec4(-0.7229728,-1.5483948,0.7301322,2.1687684))*buf[0]+mat4(vec4(3.2547753,21.489103,-1.0194173,-3.3100595),vec4(-3.7316632,-3.3792162,-7.223193,-0.23685838),vec4(13.1804495,0.7916005,5.338587,5.687114),vec4(-4.167605,-17.798311,-6.815736,-1.6451967))*buf[1]+mat4(vec4(0.604885,-7.800309,-7.213122,-2.741014),vec4(-3.522382,-0.12359311,-0.5258442,0.43852118),vec4(9.6752825,-22.853785,2.062431,0.099892326),vec4(-4.3196306,-17.730087,2.5184598,5.30267))*buf[2]+mat4(vec4(-6.545563,-15.790176,-6.0438633,-5.415399),vec4(-43.591583,28.551912,-16.00161,18.84728),vec4(4.212382,8.394307,3.0958717,8.657522),vec4(-5.0237565,-4.450633,-4.4768,-5.5010443))*buf[3]+mat4(vec4(1.6985557,-67.05806,6.897715,1.9004834),vec4(1.8680354,2.3915145,2.5231109,4.081538),vec4(11.158006,1.7294737,2.0738268,7.386411),vec4(-4.256034,-306.24686,8.258898,-17.132736))*buf[4]+mat4(vec4(1.6889864,-4.5852966,3.8534803,-6.3482175),vec4(1.3543309,-1.2640043,9.932754,2.9079645),vec4(-5.2770967,0.07150358,-0.13962056,3.3269649),vec4(28.34703,-4.918278,6.1044083,4.085355))*buf[5]+vec4(6.6818056,12.522166,-3.7075126,-4.104386);
  buf[7]=mat4(vec4(-8.265602,-4.7027016,5.098234,0.7509808),vec4(8.6507845,-17.15949,16.51939,-8.884479),vec4(-4.036479,-2.3946867,-2.6055532,-1.9866527),vec4(-2.2167742,-1.8135649,-5.9759874,4.8846445))*buf[0]+mat4(vec4(6.7790847,3.5076547,-2.8191125,-2.7028968),vec4(-5.743024,-0.27844876,1.4958696,-5.0517144),vec4(13.122226,15.735168,-2.9397483,-4.101023),vec4(-14.375265,-5.030483,-6.2599335,2.9848232))*buf[1]+mat4(vec4(4.0950394,-0.94011575,-5.674733,4.755022),vec4(4.3809423,4.8310084,1.7425908,-3.437416),vec4(2.117492,0.16342592,-104.56341,16.949184),vec4(-5.22543,-2.994248,3.8350096,-1.9364246))*buf[2]+mat4(vec4(-5.900337,1.7946124,-13.604192,-3.8060522),vec4(6.6583457,31.911177,25.164474,91.81147),vec4(11.840538,4.1503043,-0.7314397,6.768467),vec4(-6.3967767,4.034772,6.1714606,-0.32874924))*buf[3]+mat4(vec4(3.4992442,-196.91893,-8.923708,2.8142626),vec4(3.4806502,-3.1846354,5.1725626,5.1804223),vec4(-2.4009497,15.585794,1.2863957,2.0252278),vec4(-71.25271,-62.441242,-8.138444,0.50670296))*buf[4]+mat4(vec4(-12.291733,-11.176166,-7.3474145,4.390294),vec4(10.805477,5.6337385,-0.9385842,-4.7348723),vec4(-12.869276,-7.039391,5.3029537,7.5436664),vec4(1.4593618,8.91898,3.5101583,5.840625))*buf[5]+vec4(2.2415268,-6.705987,-0.98861027,-2.117676);
  buf[6]=sigmoid(buf[6]);buf[7]=sigmoid(buf[7]);
  buf[0]=mat4(vec4(1.6794263,1.3817469,2.9625452,0.),vec4(-1.8834411,-1.4806935,-3.5924516,0.),vec4(-1.3279216,-1.0918057,-2.3124623,0.),vec4(0.2662234,0.23235129,0.44178495,0.))*buf[0]+mat4(vec4(-0.6299101,-0.5945583,-0.9125601,0.),vec4(0.17828953,0.18300213,0.18182953,0.),vec4(-2.96544,-2.5819945,-4.9001055,0.),vec4(1.4195864,1.1868085,2.5176322,0.))*buf[1]+mat4(vec4(-1.2584374,-1.0552157,-2.1688404,0.),vec4(-0.7200217,-0.52666044,-1.438251,0.),vec4(0.15345335,0.15196142,0.272854,0.),vec4(0.945728,0.8861938,1.2766753,0.))*buf[2]+mat4(vec4(-2.4218085,-1.968602,-4.35166,0.),vec4(-22.683098,-18.0544,-41.954372,0.),vec4(0.63792,0.5470648,1.1078634,0.),vec4(-1.5489894,-1.3075932,-2.6444845,0.))*buf[3]+mat4(vec4(-0.49252132,-0.39877754,-0.91366625,0.),vec4(0.95609266,0.7923952,1.640221,0.),vec4(0.30616966,0.15693925,0.8639857,0.),vec4(1.1825981,0.94504964,2.176963,0.))*buf[4]+mat4(vec4(0.35446745,0.3293795,0.59547555,0.),vec4(-0.58784515,-0.48177817,-1.0614829,0.),vec4(2.5271258,1.9991658,4.6846647,0.),vec4(0.13042648,0.08864098,0.30187556,0.))*buf[5]+mat4(vec4(-1.7718065,-1.4033192,-3.3355875,0.),vec4(3.1664357,2.638297,5.378702,0.),vec4(-3.1724713,-2.6107926,-5.549295,0.),vec4(-2.851368,-2.249092,-5.3013067,0.))*buf[6]+mat4(vec4(1.5203838,1.2212278,2.8404984,0.),vec4(1.5210563,1.2651345,2.683903,0.),vec4(2.9789467,2.4364579,5.2347264,0.),vec4(2.2270417,1.8825914,3.8028636,0.))*buf[7]+vec4(-1.5468478,-3.6171484,0.24762098,0.);
  buf[0]=sigmoid(buf[0]);
  return vec4(buf[0].x,buf[0].y,buf[0].z,1.);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

mat2 rotate(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

void main() {
  vec2 css = gl_FragCoord.xy * uScale;
  vec2 uv = (css * 2.0 - uView) / uView.y;
  uv.y = -uv.y;
  vec2 anchor = vec2(uView.x / uView.y, -1.0);

  vec2 pointer = vec2(uPointer.x * 2.0 - uView.x, uPointer.y * 2.0 - uView.y) / uView.y;
  vec2 offset = uv - pointer;
  float touch = uPointer.z * exp(-dot(offset, offset) / (uPointer.w * uPointer.w));
  uv = pointer + rotate(touch * 0.6) * offset;
  uv -= uDrag * touch;

  float t = uTime;
  uv = rotate(0.06 * uFlow * sin(t * 0.17)) * uv;
  uv += 0.05 * uFlow * vec2(sin(t * 0.21), cos(t * 0.13));
  uv = anchor + mat2(uTurn.x, uTurn.y, -uTurn.y, uTurn.x) * uv * 2.0 / uZoom;
  uv += uWarp * vec2(sin(uv.y * 6.283 + t * 0.5), cos(uv.x * 6.283 + t * 0.5)) * 0.05;

  vec3 latent = uSeed + 0.1 * uFlow * vec3(sin(0.3 * t), sin(0.69 * t), sin(0.44 * t));
  latent += touch * vec3(0.12, -0.1, 0.16);
  latent.z += uUnfold;

  vec3 veil = cppn(uv, latent).rgb;
  veil += (hash(gl_FragCoord.xy) - 0.5) * uDither;
  outColor = vec4(veil, 1.0);
}`;

    const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uResolution;
uniform vec2 uTexel;
uniform vec3 uColor;
uniform vec3 uInk;
uniform float uGain;
uniform float uSheen;
uniform float uGlow;
uniform float uPresence;
uniform float uGrain;
uniform float uFade;
uniform float uOpacity;
uniform float uTime;
uniform float uLightMode;
uniform vec4 uLight;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smootherstep(float edge, float x) {
  float t = clamp(x / max(edge, 0.0001), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float level(vec2 uv, float lod) {
  return textureLod(uField, uv, lod).b;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float base = clamp(level(uv, 0.0), 0.0, 1.0);
  float glow = 0.0;
  glow += level(uv, 2.0) * 0.4;
  glow += level(uv, 3.0) * 0.3;
  glow += level(uv, 4.0) * 0.2;
  glow += level(uv, 5.0) * 0.1;

  float dx = level(uv + vec2(uTexel.x, 0.0), 0.0) - level(uv - vec2(uTexel.x, 0.0), 0.0);
  float dy = level(uv + vec2(0.0, uTexel.y), 0.0) - level(uv - vec2(0.0, uTexel.y), 0.0);
  vec2 slope = vec2(dx / (2.0 * uTexel.x) * (uResolution.y / uResolution.x), dy / (2.0 * uTexel.y));
  vec3 normal = normalize(vec3(-slope * 0.12, 1.0));
  vec2 pixel = gl_FragCoord.xy / uResolution.y;
  vec3 toLight = normalize(vec3(uLight.xy - pixel, 0.7));
  vec3 halfway = normalize(toLight + vec3(0.0, 0.0, 1.0));
  float facing = max(dot(normal, halfway), 0.0);
  float sheen = pow(facing, 40.0) * smoothstep(0.08, 0.7, base);
  float near = uLight.z * exp(-dot(uLight.xy - pixel, uLight.xy - pixel) / 0.2);

  float energy = pow(base, 2.2) * uGain * (1.0 + near * 0.4);
  energy += pow(glow, 2.2) * uGlow * uGain;
  energy *= uPresence;
  vec3 light = uColor * energy;
  light += uColor * energy * energy * 0.35;
  vec3 gleam = mix(uColor * 2.0, vec3(1.0), 0.55);
  light += gleam * sheen * uSheen * (0.8 + near * 0.4) * uPresence;

  float edge = uFade * 0.5;
  float mask = smootherstep(edge, uv.x) * smootherstep(edge, 1.0 - uv.x) * smootherstep(edge, uv.y) * smootherstep(edge, 1.0 - uv.y);
  mask *= uOpacity;
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
  float dither = (hash(gl_FragCoord.yx + 31.7) - 0.5) / 255.0;

  float peak = max(light.r, max(light.g, light.b));
  if (uLightMode > 0.5) {
    float cover = 1.0 - exp(-peak * 1.6);
    vec3 ink = mix(uInk, uInk * 0.82, smoothstep(0.5, 1.0, cover));
    ink = mix(ink, vec3(1.0), clamp(sheen * uSheen * 1.5, 0.0, 1.0) * 0.8);
    float alpha = clamp(cover * 0.85 * (1.0 + grain) + dither, 0.0, 1.0) * mask;
    outColor = vec4(ink * alpha, alpha);
  } else {
    vec3 color = 1.0 - exp(-light);
    color = pow(color, vec3(1.0 / 2.2));
    color = clamp(color + grain * peak + dither, 0.0, 1.0) * mask;
    outColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
}`;

    const INTRO_SECONDS = 1.8;
    const MAX_FIELD_PIXELS = 900000;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const variationOffsets = variation => {
      const n = Number(variation) || 0;
      if (!n) return [0, 0, 0];
      const wave = k => {
        const v = Math.sin(n * 12.9898 + k * 78.233) * 43758.5453;
        return v - Math.floor(v) - 0.5;
      };
      return [wave(1), wave(2), wave(3)];
    };

    const compile = (gl, type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      gl.deleteShader(shader);
      return null;
    };

    const link = (gl, fragmentSource) => {
      const vertex = compile(gl, gl.VERTEX_SHADER, QUAD_VERTEX);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) return null;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    };

    return function DarkVeil(target, {
      color = '#6b12ff',
      speed = 0.5,
      scale = 1,
      rotation = 0,
      flow = 1,
      warp = 0,
      variation = 0,
      brightness = 1,
      sheen = 0,
      glow = 0.4,
      grain = 0.03,
      quality = 0.5,
      mouseInteraction = true,
      mouseStrength = 1,
      intro = true,
      fade = 0,
      opacity = 1,
      lightMode = false,
      paused = false,
      dpr,
      className = '',
      ...rest
    } = {}) {
      const containerRef = { current: null };
      const canvasRef = { current: null };
      const wakeRef = { current: null };
      const settings = {
        color: String(color),
        speed,
        scale: Math.max(0.1, scale),
        rotation,
        flow: Math.max(0, flow),
        warp: Math.max(0, warp),
        variation,
        brightness: Math.max(0, brightness),
        sheen: Math.max(0, sheen),
        glow: Math.max(0, glow),
        grain: Math.max(0, grain),
        quality: clamp(quality, 0.25, 1),
        mouseInteraction,
        mouseStrength: Math.max(0, mouseStrength),
        intro,
        fade: clamp(fade, 0, 1),
        opacity: clamp(opacity, 0, 1),
        lightMode,
        paused,
        dpr
      };
      const settingsRef = { current: settings };
      settingsRef.current = settings;

      // JSX: <div className="dark-veil-container"><canvas className="dark-veil-canvas" /></div>
      const canvas = document.createElement('canvas');
      canvas.className = 'dark-veil-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      target.classList.add('dark-veil-container');
      addClasses(target, className);
      target.appendChild(canvas);
      containerRef.current = target;
      canvasRef.current = canvas;

      const cleanup = (() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const gl = canvas?.getContext('webgl2', {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'high-performance'
        });
        if (!container || !canvas || !gl) return undefined;

        const floatTargets = !!gl.getExtension('EXT_color_buffer_float');
        const fieldProgram = link(gl, FIELD);
        const compositeProgram = link(gl, COMPOSITE);
        if (!fieldProgram || !compositeProgram) return undefined;

        const buffer = gl.createBuffer();
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        let texture = gl.createTexture();
        const framebuffer = gl.createFramebuffer();
        const target = { width: 0, height: 0 };
        const sizeTarget = (width, height) => {
          if (target.width === width && target.height === height) return;
          // Port fix: texStorage2D textures are immutable, so a resize needs a new texture
          if (target.width) {
            gl.deleteTexture(texture);
            texture = gl.createTexture();
          }
          target.width = width;
          target.height = height;
          gl.bindTexture(gl.TEXTURE_2D, texture);
          const levels = Math.floor(Math.log2(Math.max(width, height))) + 1;
          gl.texStorage2D(gl.TEXTURE_2D, levels, floatTargets ? gl.RGBA16F : gl.RGBA8, width, height);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        };

        const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const colorCache = new Map();
        const toLinear = value => {
          if (colorCache.has(value)) return colorCache.get(value);
          let rgb = [1, 1, 1];
          if (probe) {
            probe.clearRect(0, 0, 1, 1);
            probe.fillStyle = '#ffffff';
            probe.fillStyle = value;
            probe.fillRect(0, 0, 1, 1);
            const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
            rgb = [r, g, b].map(v => Math.pow(v / 255, 2.2));
          }
          colorCache.set(value, rgb);
          return rgb;
        };

        const view = { width: 1, height: 1, fieldWidth: 1, fieldHeight: 1 };
        const pointer = { x: 0, y: 0, inside: false };
        const state = {
          clock: 0,
          intro: settingsRef.current.intro && !reduce ? 0 : 1,
          touch: 0,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          dragX: 0,
          dragY: 0,
          lightX: 0.5,
          lightY: 0.15
        };
        let raf = 0;
        let last = 0;
        let visible = true;

        const render = () => {
          const s = settingsRef.current;
          const presence = state.intro * state.intro * state.intro * (state.intro * (state.intro * 6 - 15) + 10);
          gl.bindVertexArray(vao);
          sizeTarget(view.fieldWidth, view.fieldHeight);

          const f = fieldProgram.uniforms;
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
          gl.viewport(0, 0, target.width, target.height);
          gl.useProgram(fieldProgram.program);
          const angle = (s.rotation * Math.PI) / 180;
          const [sx, sy, sz] = variationOffsets(s.variation);
          gl.uniform2f(f.uView, view.width, view.height);
          gl.uniform2f(f.uScale, view.width / target.width, view.height / target.height);
          gl.uniform1f(f.uZoom, s.scale);
          gl.uniform2f(f.uTurn, Math.cos(angle), Math.sin(angle));
          gl.uniform1f(f.uTime, state.clock);
          gl.uniform1f(f.uFlow, s.flow);
          gl.uniform1f(f.uWarp, s.warp);
          gl.uniform3f(f.uSeed, 0.3948333106474662 + sx, 0.36 + sy, 0.14 + sz);
          gl.uniform4f(f.uPointer, state.x, state.y, state.touch * s.mouseStrength * 0.9, 0.42);
          gl.uniform2f(f.uDrag, (state.dragX * 2) / view.height, (state.dragY * 2) / view.height);
          gl.uniform1f(f.uUnfold, (1 - presence) * 0.45);
          gl.uniform1f(f.uDither, floatTargets ? 0 : 1 / 255);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.generateMipmap(gl.TEXTURE_2D);

          const c = compositeProgram.uniforms;
          const tint = toLinear(s.color);
          const tone = 0.2126 * tint[0] + 0.7152 * tint[1] + 0.0722 * tint[2];
          const depth = Math.min(1, 0.2 / Math.max(tone, 0.001));
          const ink = tint.map(v => Math.pow(Math.min(1, v * depth), 1 / 2.2));
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.useProgram(compositeProgram.program);
          gl.uniform2f(c.uResolution, canvas.width, canvas.height);
          gl.uniform2f(c.uTexel, 1 / target.width, 1 / target.height);
          gl.uniform3fv(c.uColor, tint);
          gl.uniform3fv(c.uInk, ink);
          gl.uniform1f(c.uGain, 1.15 * s.brightness);
          gl.uniform1f(c.uSheen, 0.5 * s.sheen);
          gl.uniform1f(c.uGlow, s.glow);
          gl.uniform1f(c.uPresence, presence);
          gl.uniform1f(c.uGrain, s.grain);
          gl.uniform1f(c.uFade, s.fade);
          gl.uniform1f(c.uOpacity, s.opacity);
          gl.uniform1f(c.uTime, state.clock % 1000);
          gl.uniform1f(c.uLightMode, s.lightMode ? 1 : 0);
          gl.uniform4f(
            c.uLight,
            (state.lightX * view.width) / view.height,
            1 - state.lightY,
            state.touch * s.mouseStrength,
            0
          );
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(c.uField, 0);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const frame = now => {
          raf = 0;
          if (!visible || document.hidden) return;
          const s = settingsRef.current;
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
          last = now;
          const moving = !s.paused && !reduce;
          if (moving) state.clock += dt * s.speed;
          if (!s.intro || reduce) state.intro = 1;
          else if (state.intro < 1) state.intro = Math.min(1, state.intro + dt / INTRO_SECONDS);

          const engaged = s.mouseInteraction && pointer.inside && !reduce;
          if (engaged && state.touch < 0.01) {
            state.x = pointer.x;
            state.y = pointer.y;
          }
          const follow = 1 - Math.exp(-dt * 9);
          const prevX = state.x;
          const prevY = state.y;
          state.x += (pointer.x - state.x) * follow;
          state.y += (pointer.y - state.y) * follow;
          const velX = (state.x - prevX) / Math.max(dt, 0.001);
          const velY = (state.y - prevY) / Math.max(dt, 0.001);
          const dragBlend = 1 - Math.exp(-dt * 5);
          state.dragX += (clamp(velX * 0.12, -120, 120) - state.dragX) * dragBlend;
          state.dragY += (clamp(-velY * 0.12, -120, 120) - state.dragY) * dragBlend;
          state.touch += ((engaged ? 1 : 0) - state.touch) * (1 - Math.exp(-dt * (engaged ? 3 : 1.6)));
          const lightGoalX = engaged ? pointer.x / view.width : 0.5;
          const lightGoalY = engaged ? pointer.y / view.height : 0.15;
          const lightFollow = 1 - Math.exp(-dt * 4);
          state.lightX += (lightGoalX - state.lightX) * lightFollow;
          state.lightY += (lightGoalY - state.lightY) * lightFollow;
          render();

          const settling =
            state.intro < 1 ||
            Math.abs((engaged ? 1 : 0) - state.touch) > 0.002 ||
            Math.abs(state.dragX) + Math.abs(state.dragY) > 0.05 ||
            Math.abs(pointer.x - state.x) + Math.abs(pointer.y - state.y) > 0.3 ||
            Math.abs(lightGoalX - state.lightX) + Math.abs(lightGoalY - state.lightY) > 0.0005;
          if (moving || settling) raf = requestAnimationFrame(frame);
          else last = 0;
        };

        const wake = () => {
          if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
        };

        const resize = () => {
          const s = settingsRef.current;
          const width = Math.max(1, container.clientWidth);
          const height = Math.max(1, container.clientHeight);
          const ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
          view.width = width;
          view.height = height;
          canvas.width = Math.max(1, Math.round(width * ratio));
          canvas.height = Math.max(1, Math.round(height * ratio));
          let fieldScale = s.quality;
          if (width * height * fieldScale * fieldScale > MAX_FIELD_PIXELS) {
            fieldScale = Math.sqrt(MAX_FIELD_PIXELS / (width * height));
          }
          view.fieldWidth = Math.max(1, Math.round(width * fieldScale));
          view.fieldHeight = Math.max(1, Math.round(height * fieldScale));
          if (!raf) render();
          wake();
        };

        const onPointerMove = event => {
          const rect = container.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
          pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
          wake();
        };

        const onPointerLeave = () => {
          pointer.inside = false;
          wake();
        };

        const onVisibility = () => {
          last = 0;
          wake();
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        const intersection = new IntersectionObserver(entries => {
          visible = entries.some(entry => entry.isIntersecting);
          if (visible) {
            last = 0;
            wake();
          }
        });
        intersection.observe(container);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerLeave);
        document.addEventListener('visibilitychange', onVisibility);
        resize();

        let lastQuality = settingsRef.current.quality;
        let lastDpr = settingsRef.current.dpr;
        wakeRef.current = () => {
          const s = settingsRef.current;
          if (s.quality !== lastQuality || s.dpr !== lastDpr) {
            lastQuality = s.quality;
            lastDpr = s.dpr;
            resize();
            return;
          }
          if (!raf) render();
          wake();
        };

        return () => {
          cancelAnimationFrame(raf);
          wakeRef.current = null;
          resizeObserver.disconnect();
          intersection.disconnect();
          window.removeEventListener('pointermove', onPointerMove);
          document.documentElement.removeEventListener('pointerleave', onPointerLeave);
          document.removeEventListener('visibilitychange', onVisibility);
          gl.deleteTexture(texture);
          gl.deleteFramebuffer(framebuffer);
          gl.deleteProgram(fieldProgram.program);
          gl.deleteProgram(compositeProgram.program);
          gl.deleteBuffer(buffer);
          gl.deleteVertexArray(vao);
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
      })();

      return {
        destroy() {
          cleanup?.();
          canvas.remove();
        }
      };
    };
  })();

  /* ===================================================================== */
  /* ElectricBorder — src/content/Animations/ElectricBorder/ElectricBorder.jsx */
  /* ===================================================================== */
  const ElectricBorder = (() => {
    const ARCS = 4;
    const PULSES = 3;
    const MARGIN = 64;
    const PIXEL_BUDGET = 3e6;
    const SURGE_SPEED = 560;
    const HALF_PI = Math.PI / 2;

    const VERTEX = `#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`;

    const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uSize;
uniform float uRatio;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform vec3 uParam;
uniform float uPerimeter;
uniform vec4 uCells;
uniform vec2 uSoft;
uniform float uTime;
uniform float uPower;
uniform float uReveal;
uniform vec3 uHover;
uniform float uHoverRadius;
uniform vec4 uPulses[${PULSES}];
uniform vec3 uCore;
uniform vec3 uGlowColor;
uniform float uIntensity;
uniform float uGlow;
uniform float uThickness;
uniform float uStrands;
uniform float uChaos;
uniform float uSpread;
uniform float uFlicker;
uniform float uInk;
uniform vec4 uArcEnds[${ARCS}];
uniform vec4 uArcShape[${ARCS}];

out vec4 fragColor;

uint scramble(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

vec2 slant(uint x, uint y, uint seed) {
  uint h = scramble(x * 0x8da6b343u + y * 0xd8163841u + seed * 0xcb1ab31fu);
  return vec2(uvec2(h, h >> 8u) & 255u) / 127.5 - 1.0;
}

vec2 ring(vec2 p, float period, uint seed) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float du = 30.0 * f.x * f.x * (f.x * (f.x - 2.0) + 1.0);
  uint x0 = uint(mod(i.x, period));
  uint x1 = uint(mod(i.x + 1.0, period));
  uint y0 = uint(i.y + 65536.0);
  vec2 ga = slant(x0, y0, seed);
  vec2 gb = slant(x1, y0, seed);
  vec2 gc = slant(x0, y0 + 1u, seed);
  vec2 gd = slant(x1, y0 + 1u, seed);
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  float k = va - vb - vc + vd;
  float value = va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
  float gx = ga.x + u.x * (gb.x - ga.x) + u.y * (gc.x - ga.x) + u.x * u.y * (ga.x - gb.x - gc.x + gd.x);
  return vec2(value, gx + du * (vb - va + u.y * k));
}

float wobble(float x, uint seed) {
  return ring(vec2(x, 0.5), 1048576.0, seed).x;
}

vec2 frameAt(vec2 p) {
  vec2 inner = max(uHalf - uRadius, 0.0);
  vec2 q = abs(p) - inner;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float quarter = uPerimeter * 0.25;
  vec2 v = abs(p) - uParam.xy;
  float t;
  if (v.x > 0.0 && v.y > 0.0) t = uParam.x + uParam.z * atan(v.x, v.y);
  else if (v.x > v.y) t = uParam.x + 1.5707963 * uParam.z + uParam.y - abs(p.y);
  else t = abs(p.x);
  t = clamp(t, 0.0, quarter);
  float s = p.x >= 0.0 ? (p.y < 0.0 ? t : 2.0 * quarter - t) : (p.y < 0.0 ? 4.0 * quarter - t : 2.0 * quarter + t);
  return vec2(s, d);
}

vec2 glowShape(float line, float spread, float w) {
  float x = abs(line);
  float y = abs(spread);
  return vec2(exp(-x * x / (w * w * 0.5)) + exp(-y / (w * 2.2)) * 0.6, exp(-y / (w * 4.5)) * 0.5);
}

void addArc(vec2 p, vec4 ends, vec4 info, float t, inout vec3 light, inout float energy, inout float hot) {
  if (info.y < 0.002) return;
  vec2 ab = ends.zw - ends.xy;
  float len = max(length(ab), 1.0);
  vec2 dir = ab / len;
  vec2 rel = p - ends.xy;
  float along = dot(rel, dir);
  float side = dot(rel, vec2(-dir.y, dir.x));
  float margin = abs(info.x) + (0.6 + uChaos) * (2.0 + len * 0.08) + uThickness * 12.0 + 10.0;
  if (along < -margin || along > len + margin || abs(side) > margin) return;
  float u = clamp(along / len, 0.0, 1.0);
  float taper = sin(3.14159265 * u);
  float settle = smoothstep(0.0, 0.15, u) * smoothstep(1.0, 0.85, u);
  float bendSlope = 3.14159265 / len * cos(3.14159265 * u) * settle;
  float beyond = max(-along, 0.0) + max(along - len, 0.0);
  for (int c = 0; c < 2; c++) {
    uint seed = uint(info.z * 131.0) + uint(c) * 29u + 7u;
    float jag = 0.0;
    float jagSlope = 0.0;
    float wave = max(len * 0.3, 14.0);
    float weight = (0.6 + uChaos) * (1.5 + len * 0.05) * (c == 0 ? 1.0 : 1.5);
    for (int o = 0; o < 3; o++) {
      vec2 n = ring(vec2(along / wave + info.z * 3.0, t * (1.4 + float(o) * 1.1)), 1048576.0, seed + uint(o));
      jag += n.x * weight;
      jagSlope += n.y * weight / wave;
      wave *= 0.42;
      weight *= 0.4;
    }
    float offset = (info.x + jag) * taper;
    float offsetSlope = (info.x + jag) * bendSlope + jagSlope * taper * settle;
    float across = (side - offset) / sqrt(1.0 + offsetSlope * offsetSlope);
    float gap = length(vec2(beyond, across));
    float w = uThickness * (c == 0 ? 0.9 : 0.6);
    vec2 g = glowShape(gap, gap, w);
    float k = info.y * (c == 0 ? 1.0 : 0.45);
    light += (uCore * g.x + uGlowColor * g.y * uGlow) * k;
    energy += (g.x + g.y * uGlow) * k;
    hot += exp(-gap * gap / (w * w * 0.16)) * k * (c == 0 ? 1.0 : 0.0);
  }
}

void main() {
  vec2 p = vec2(gl_FragCoord.x / uRatio, uSize.y - gl_FragCoord.y / uRatio);
  vec2 frame = frameAt(p - uCenter);
  float s = frame.x;
  float d = frame.y;
  float t = uTime;
  vec3 light = vec3(0.0);
  float energy = 0.0;
  float hot = 0.0;

  float along = min(s, uPerimeter - s);
  float front = uReveal * (uPerimeter * 0.5 + 80.0);
  float shown = smoothstep(front, front - 70.0, along) * uPower;
  float flare = uReveal < 1.0 ? exp(-pow((along - front + 30.0) / 26.0, 2.0)) * uPower : 0.0;

  vec2 toHover = p - uHover.xy;
  float heat = uHover.z * exp(-dot(toHover, toHover) / (uHoverRadius * uHoverRadius));
  float surge = 0.0;
  for (int i = 0; i < ${PULSES}; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.z <= 0.0) continue;
    float gap = abs(s - pulse.x);
    gap = min(gap, uPerimeter - gap);
    float wave = (gap - pulse.y * ${SURGE_SPEED}.0) / 46.0;
    surge += exp(-wave * wave) * pulse.z * exp(-pulse.y * 1.2);
  }
  heat = min(heat * 0.7 + surge * 0.8 + flare * 0.6, 1.2);
  vec2 inset = min(p, uSize - p);
  float frameFade = smoothstep(0.0, 14.0, min(inset.x, inset.y));

  float edge = abs(d);
  float inward = d < 0.0 ? exp(d / 14.0) : 1.0;
  float bloom = (exp(-edge / 3.0) * 0.1 + exp(-edge / 16.0) * 0.05 * inward) * uGlow * (1.0 + heat * 0.6) * shown;
  light += uGlowColor * bloom;
  energy += bloom;

  float bendAmp = uSpread * 16.0 * (1.0 + heat * 0.35);
  float rippleAmp = uSpread * 6.0 * (1.0 + heat * 0.3);
  float crinkleAmp = uChaos * 4.5 * (1.0 + heat * 0.3);
  float squeeze = min(1.0, 34.0 / max((bendAmp + rippleAmp) * 1.6 + crinkleAmp, 1e-3));
  bendAmp *= squeeze;
  rippleAmp *= squeeze;
  crinkleAmp *= squeeze;
  float reach = (bendAmp * 1.9 + rippleAmp + crinkleAmp * 1.6) * 1.3 + uThickness * 14.0 + 8.0;
  if (edge < reach && shown > 0.0) {
    float fade = smoothstep(reach, reach * 0.55, edge);
    float count = min(uStrands + heat * 1.2, 6.0);
    float slopeScale = 1.0 / uPerimeter;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      if (fi >= ceil(count)) break;
      float present = clamp(count - fi, 0.0, 1.0);
      uint seed = uint(i) * 7u + 3u;
      float lead = i == 0 ? 1.0 : 0.0;
      float range = mix(1.35 + fi * 0.18, 0.7, lead);
      float x = s * slopeScale;
      vec2 a = ring(vec2(x * uCells.x, t * 0.7 + fi * 3.1), uCells.x, seed);
      vec2 b = ring(vec2(x * uCells.y, t * 1.9 + fi * 1.7), uCells.y, seed + 1u);
      vec2 c = ring(vec2(x * uCells.z, t * 4.6 + fi * 0.9), uCells.z, seed + 2u);
      vec2 e = ring(vec2(x * uCells.w, t * 6.8), uCells.w, seed + 3u);
      float offset = (a.x * bendAmp + b.x * rippleAmp) * range + (c.x + e.x * 0.35) * crinkleAmp;
      float slope =
        ((a.y * uCells.x * bendAmp + b.y * uCells.y * rippleAmp) * range +
          (c.y * uCells.z + e.y * 0.35 * uCells.w) * crinkleAmp) *
        slopeScale;
      float drift = lead > 0.5 ? 0.0 : wobble(fi * 7.3, seed + 9u) * 2.5 * uSpread;
      offset += drift;
      float across = (d - offset) / sqrt(1.0 + slope * slope);
      float spread = d - a.x * bendAmp * range - drift;
      float swell = 0.5 + 0.5 * ring(vec2(x * uSoft.y, t * 2.0 + fi * 5.1), uSoft.y, seed + 8u).x;
      float w = uThickness * mix(0.55, 1.0, lead) * (0.5 + swell);
      float vis = mix(0.3 + 0.45 * smoothstep(-0.25, 0.2, ring(vec2(x * uSoft.x, t * 0.5 + fi * 3.7), uSoft.x, seed + 5u).x), 1.0, lead);
      float spark = 1.0 - uFlicker * 0.3 * (0.5 + 0.5 * wobble(t * 13.0 + fi * 2.3, seed + 6u));
      float weight = max(vis, heat * 0.6) * spark * fade * present * (0.7 + 0.6 * swell);
      vec2 g = glowShape(across, spread, w) * weight;
      g.y *= inward;
      float haze = uGlow * (1.0 + heat * 0.5) * (1.0 - uInk * 0.7);
      light += uCore * g.x + uGlowColor * g.y * haze;
      energy += g.x + g.y * haze;
      hot += exp(-across * across / (w * w * 0.16)) * lead * weight;
    }
    light *= shown;
    energy *= shown;
    hot *= shown;
  }

  for (int i = 0; i < ${ARCS}; i++) addArc(p, uArcEnds[i], uArcShape[i], t, light, energy, hot);

  float breath = 1.0 + uFlicker * 0.5 * wobble(t * 4.6 + 7.0, 3u);
  float gain = uIntensity * breath * (1.0 + heat * 0.25) * 1.4;
  light *= frameFade;
  energy *= frameFade;
  hot *= frameFade;
  float alpha = 1.0 - exp(-energy * gain);
  vec3 color = mix(1.0 - exp(-light * gain), alpha * light / max(energy, 1e-4), uInk);
  color = mix(color, vec3(alpha), clamp(hot, 0.0, 1.0) * uInk * 0.85);
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  alpha = clamp(alpha + grain, 0.0, 1.0);
  fragColor = vec4(clamp(color + grain, 0.0, alpha), alpha);
}`;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const parseColor = value => {
      const text = String(value || '').trim();
      const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
      if (hex) {
        const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
        return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16) / 255);
      }
      const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text);
      if (rgb) return [rgb[1], rgb[2], rgb[3]].map(channel => clamp(parseFloat(channel) / 255, 0, 1));
      if (typeof document !== 'undefined') {
        const context = document.createElement('canvas').getContext('2d');
        if (context) {
          context.fillStyle = '#000000';
          context.fillStyle = text;
          const normal = String(context.fillStyle);
          if (normal !== '#000000' || /^(#0{3}|#0{6}|black)$/i.test(text)) return parseColor(normal);
        }
      }
      return [0.49, 0.98, 1];
    };

    const compile = (gl, type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const link = gl => {
      const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
      const program = vertex && fragment ? gl.createProgram() : null;
      if (!vertex || !fragment || !program) {
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
        return null;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let index = 0; index < count; index++) {
        const info = gl.getActiveUniform(program, index);
        if (info) uniforms[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    };

    const roundBox = (x, y, hx, hy, r) => {
      const qx = Math.abs(x) - (hx - r);
      const qy = Math.abs(y) - (hy - r);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
    };

    const pathOf = (width, height, radius, offset) => {
      const hx = Math.max(1, width / 2 + offset);
      const hy = Math.max(1, height / 2 + offset);
      const r = clamp(radius + offset, 0, Math.min(hx, hy));
      const vr = Math.min(r + 48, Math.min(hx, hy));
      const ax = hx - vr;
      const ay = hy - vr;
      const quarter = ax + ay + HALF_PI * vr;
      return { hx, hy, r, vr, ax, ay, quarter, perimeter: quarter * 4 };
    };

    const pointOn = (path, s) => {
      const { hx, hy, r, vr, ax, ay, quarter, perimeter } = path;
      const u = ((s % perimeter) + perimeter) % perimeter;
      const part = Math.min(3, Math.floor(u / quarter));
      const rest = u - part * quarter;
      const local = part % 2 ? quarter - rest : rest;
      let x;
      let y;
      if (local <= ax) {
        x = local;
        y = -hy;
      } else if (local <= ax + HALF_PI * vr) {
        const angle = vr > 0 ? (local - ax) / vr : 0;
        const dx = Math.sin(angle);
        const dy = -Math.cos(angle);
        let low = 0;
        let high = vr + r + 2;
        for (let step = 0; step < 18; step++) {
          const mid = (low + high) / 2;
          if (roundBox(ax + dx * mid, -ay + dy * mid, hx, hy, r) < 0) low = mid;
          else high = mid;
        }
        x = ax + dx * low;
        y = -ay + dy * low;
      } else {
        x = hx;
        y = -ay + (local - ax - HALF_PI * vr);
      }
      const flipX = part >= 2 ? -1 : 1;
      const flipY = part === 1 || part === 2 ? -1 : 1;
      const px = x * flipX;
      const py = y * flipY;
      const nx = roundBox(px + 0.5, py, hx, hy, r) - roundBox(px - 0.5, py, hx, hy, r);
      const ny = roundBox(px, py + 0.5, hx, hy, r) - roundBox(px, py - 0.5, hx, hy, r);
      const length = Math.hypot(nx, ny) || 1;
      return { x: px, y: py, nx: nx / length, ny: ny / length };
    };

    const nearestOn = (path, x, y) => {
      const { ax, ay, vr, quarter } = path;
      const qx = Math.abs(x) - ax;
      const qy = Math.abs(y) - ay;
      let t;
      if (qx > 0 && qy > 0) t = ax + vr * Math.atan2(qx, qy);
      else if (qx > qy) t = ax + HALF_PI * vr + ay - Math.abs(y);
      else t = Math.abs(x);
      t = clamp(t, 0, quarter);
      if (x >= 0) return y < 0 ? t : 2 * quarter - t;
      return y < 0 ? 4 * quarter - t : 2 * quarter + t;
    };

    return function ElectricBorder(target, {
      children,
      color = '#7df9ff',
      glowColor,
      speed = 1,
      chaos = 0.5,
      spread = 0.6,
      thickness = 1.5,
      strands = 3,
      glow = 0.6,
      intensity = 0.8,
      arcs = 1,
      flicker = 0.5,
      borderRadius = 24,
      offset = 0,
      active = true,
      intro = true,
      interactive = true,
      cursorRadius = 90,
      theme = 'dark',
      className = '',
      style
    } = {}) {
      const containerRef = { current: null };
      const canvasRef = { current: null };
      const wakeRef = { current: null };
      const base = parseColor(color);
      const settings = {
        core: base.map(channel => channel + (1 - channel) * 0.55),
        glowColor: glowColor ? parseColor(glowColor) : base,
        speed: Math.max(0, speed),
        chaos: clamp(chaos, 0, 2),
        spread: clamp(spread, 0, 2),
        thickness: Math.max(0.25, thickness),
        strands: clamp(Math.round(strands), 1, 6),
        glow: clamp(glow, 0, 3),
        intensity: Math.max(0, intensity),
        arcs: Math.max(0, arcs),
        flicker: clamp(flicker, 0, 1),
        borderRadius: Math.max(0, borderRadius),
        offset,
        active,
        intro,
        interactive,
        cursorRadius: Math.max(1, cursorRadius),
        light: theme === 'light'
      };
      const settingsRef = { current: settings };
      settingsRef.current = settings;

      // JSX: the target is the container; the canvas overflows it by MARGIN on every side.
      target.classList.add('electric-border');
      addClasses(target, className);
      target.style.borderRadius = `${borderRadius}px`;
      applyStyle(target, style);
      const canvas = document.createElement('canvas');
      canvas.className = 'electric-border__canvas';
      canvas.style.top = `${-MARGIN}px`;
      canvas.style.left = `${-MARGIN}px`;
      canvas.setAttribute('aria-hidden', 'true');
      target.appendChild(canvas);
      containerRef.current = target;
      canvasRef.current = canvas;

      // useEffect(…, [generation]) re-runs when the WebGL context is restored.
      let current = 0;
      let cleanup = null;
      const run = generation => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const gl = canvas.getContext('webgl2', {
          alpha: true,
          premultipliedAlpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: 'default'
        });
        const program = gl ? link(gl) : null;
        if (!gl || !program) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const vao = gl.createVertexArray();
        const arcEnds = new Float32Array(ARCS * 4);
        const arcShape = new Float32Array(ARCS * 4);
        const pulseData = new Float32Array(PULSES * 4);
        const size = { width: 1, height: 1, ratio: 1 };
        const pointer = { x: 0, y: 0, over: false, near: false };
        const hover = { x: 0, y: 0, vx: 0, vy: 0, power: 0 };
        const sparks = [];
        const pulses = [];
        const first = settingsRef.current;
        let power = first.active && !(first.intro && !reduced && generation === 0) ? 1 : 0;
        let reveal = power;
        let wasActive = first.active;
        let ink = first.light ? 1 : 0;
        let path = pathOf(1, 1, 0, 0);
        let time = Math.random() * 100;
        let raf = 0;
        let last = 0;
        let visible = true;
        let pageVisible = document.visibilityState !== 'hidden';
        let lost = false;

        const resize = () => {
          const s = settingsRef.current;
          const width = Math.max(1, container.offsetWidth);
          const height = Math.max(1, container.offsetHeight);
          const canvasWidth = width + MARGIN * 2;
          const canvasHeight = height + MARGIN * 2;
          const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (canvasWidth * canvasHeight)));
          const pixelWidth = Math.max(1, Math.round(canvasWidth * ratio));
          const pixelHeight = Math.max(1, Math.round(canvasHeight * ratio));
          if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;
          }
          canvas.style.width = `${canvasWidth}px`;
          canvas.style.height = `${canvasHeight}px`;
          Object.assign(size, { width, height, ratio: pixelWidth / canvasWidth });
          path = pathOf(width, height, s.borderRadius, s.offset);
        };

        const spawnArc = (now, near) => {
          const span = Math.min(path.perimeter * 0.3, 60 + Math.random() * 90);
          const start = near ?? Math.random() * path.perimeter;
          const from = start - span * (0.2 + Math.random() * 0.6);
          const to = from + span;
          const a = pointOn(path, from);
          const b = pointOn(path, to);
          const mid = pointOn(path, (from + to) / 2);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const length = Math.hypot(dx, dy) || 1;
          const side = (-dy / length) * mid.nx + (dx / length) * mid.ny;
          const bow = Math.min(MARGIN - 30, length * (0.14 + Math.random() * 0.16) + 5);
          return {
            ax: a.x,
            ay: a.y,
            bx: b.x,
            by: b.y,
            bow: side >= 0 ? bow : -bow,
            seed: 1 + Math.random() * 60,
            born: now,
            life: 0.35 + Math.random() * 0.45
          };
        };

        const render = (s, heatPower) => {
          const u = program.uniforms;
          const width = size.width + MARGIN * 2;
          const height = size.height + MARGIN * 2;
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          if (power <= 0.001 && !sparks.length) return;
          gl.useProgram(program.program);
          gl.uniform2f(u.uSize, width, height);
          gl.uniform1f(u.uRatio, size.ratio);
          gl.uniform2f(u.uCenter, width / 2, height / 2);
          gl.uniform2f(u.uHalf, path.hx, path.hy);
          gl.uniform1f(u.uRadius, path.r);
          gl.uniform3f(u.uParam, path.ax, path.ay, path.vr);
          gl.uniform1f(u.uPerimeter, path.perimeter);
          gl.uniform4f(
            u.uCells,
            Math.max(1, Math.round(path.perimeter / 75)),
            Math.max(2, Math.round(path.perimeter / 25)),
            Math.max(3, Math.round(path.perimeter / 9)),
            Math.max(4, Math.round(path.perimeter / 4))
          );
          gl.uniform2f(
            u.uSoft,
            Math.max(1, Math.round(path.perimeter / 150)),
            Math.max(1, Math.round(path.perimeter / 50))
          );
          gl.uniform1f(u.uTime, time);
          gl.uniform1f(u.uPower, power * power * (3 - 2 * power));
          gl.uniform1f(u.uReveal, reveal);
          gl.uniform3f(u.uHover, hover.x + MARGIN, hover.y + MARGIN, heatPower);
          gl.uniform1f(u.uHoverRadius, s.cursorRadius);
          gl.uniform4fv(u.uPulses, pulseData);
          gl.uniform3fv(u.uCore, s.core);
          gl.uniform3fv(u.uGlowColor, s.glowColor);
          gl.uniform1f(u.uIntensity, s.intensity);
          gl.uniform1f(u.uGlow, s.glow);
          gl.uniform1f(u.uThickness, s.thickness);
          gl.uniform1f(u.uStrands, s.strands);
          gl.uniform1f(u.uChaos, s.chaos);
          gl.uniform1f(u.uSpread, s.spread);
          gl.uniform1f(u.uFlicker, reduced ? 0 : s.flicker);
          gl.uniform1f(u.uInk, ink);
          gl.uniform4fv(u.uArcEnds, arcEnds);
          gl.uniform4fv(u.uArcShape, arcShape);
          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const frame = now => {
          raf = 0;
          if (lost) return;
          const s = settingsRef.current;
          const dt = clamp((now - last) / 1000 || 0, 0, 0.05);
          last = Math.max(last, now);
          const motion = reduced ? 0.2 : 1;
          time += dt * s.speed * motion;

          if (s.active && !wasActive) reveal = 0;
          wasActive = s.active;
          power += ((s.active ? 1 : 0) - power) * (1 - Math.exp(-dt / (s.active ? 0.28 : 0.4)));
          if (s.active) reveal = reduced ? 1 : Math.min(1, reveal + dt / 0.9);
          ink += ((s.light ? 1 : 0) - ink) * (1 - Math.exp(-dt / 0.25));

          const engaged = s.interactive && pointer.near && s.active;
          if (engaged && hover.power < 0.01) {
            hover.x = pointer.x;
            hover.y = pointer.y;
            hover.vx = 0;
            hover.vy = 0;
          }
          hover.vx += ((pointer.x - hover.x) * 120 - hover.vx * 19) * dt;
          hover.vy += ((pointer.y - hover.y) * 120 - hover.vy * 19) * dt;
          hover.x += hover.vx * dt;
          hover.y += hover.vy * dt;
          hover.power += ((engaged ? 1 : 0) - hover.power) * (1 - Math.exp(-dt / (engaged ? 0.3 : 0.55)));

          for (let index = sparks.length - 1; index >= 0; index--) {
            if (time - sparks[index].born > sparks[index].life) sparks.splice(index, 1);
          }
          if (!reduced && s.active && reveal >= 1 && s.arcs > 0 && sparks.length < ARCS) {
            const chance = dt * s.speed * s.arcs;
            if (Math.random() < chance * 5 * hover.power) {
              sparks.push(spawnArc(time, nearestOn(path, hover.x - size.width / 2, hover.y - size.height / 2)));
            } else if (Math.random() < chance * (0.6 + path.perimeter / 2400)) {
              sparks.push(spawnArc(time, null));
            }
          }
          const fit = power * power * (3 - 2 * power);
          for (let index = 0; index < ARCS; index++) {
            const o = index * 4;
            const spark = sparks[index];
            if (!spark) {
              arcShape[o + 1] = 0;
              continue;
            }
            const k = clamp((time - spark.born) / spark.life, 0, 1);
            arcEnds[o] = spark.ax + size.width / 2 + MARGIN;
            arcEnds[o + 1] = spark.ay + size.height / 2 + MARGIN;
            arcEnds[o + 2] = spark.bx + size.width / 2 + MARGIN;
            arcEnds[o + 3] = spark.by + size.height / 2 + MARGIN;
            arcShape[o] = spark.bow;
            arcShape[o + 1] = Math.sin(Math.PI * k) * fit;
            arcShape[o + 2] = spark.seed;
          }

          for (let index = pulses.length - 1; index >= 0; index--) {
            if (now - pulses[index].born > 2200) pulses.splice(index, 1);
          }
          for (let index = 0; index < PULSES; index++) {
            const o = index * 4;
            const pulse = pulses[index];
            if (!pulse) {
              pulseData[o + 2] = 0;
              continue;
            }
            pulseData[o] = pulse.s;
            pulseData[o + 1] = (now - pulse.born) / 1000;
            pulseData[o + 2] = 1;
          }

          render(s, hover.power * (s.interactive ? 1 : 0));

          const busy = power > 0.002 || s.active || sparks.length > 0;
          if (busy && visible && pageVisible) raf = requestAnimationFrame(frame);
        };

        const wake = () => {
          if (raf || lost || !visible || !pageVisible) return;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        };
        wakeRef.current = () => {
          resize();
          wake();
        };

        const locate = event => {
          const rect = container.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
          pointer.over = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
          pointer.near =
            pointer.x >= -MARGIN / 2 &&
            pointer.y >= -MARGIN / 2 &&
            pointer.x <= rect.width + MARGIN / 2 &&
            pointer.y <= rect.height + MARGIN / 2;
        };

        const onPointerMove = event => {
          locate(event);
          if (pointer.near) wake();
        };

        const onPointerDown = event => {
          locate(event);
          const s = settingsRef.current;
          if (!pointer.over || !s.interactive || !s.active || reduced) return;
          const along = nearestOn(path, pointer.x - size.width / 2, pointer.y - size.height / 2);
          pulses.push({ s: along, born: performance.now() });
          if (pulses.length > PULSES) pulses.shift();
          if (sparks.length < ARCS) sparks.push(spawnArc(time, along));
          wake();
        };

        const onLeave = () => {
          pointer.over = false;
          pointer.near = false;
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);

        const onLost = event => {
          event.preventDefault();
          lost = true;
          cancelAnimationFrame(raf);
          raf = 0;
        };
        const onRestored = () => setGeneration(value => value + 1);
        canvas.addEventListener('webglcontextlost', onLost);
        canvas.addEventListener('webglcontextrestored', onRestored);

        const resizeObserver = new ResizeObserver(() => {
          resize();
          wake();
        });
        resizeObserver.observe(container);

        const intersection = new IntersectionObserver(entries => {
          visible = entries.some(entry => entry.isIntersecting);
          wake();
        });
        intersection.observe(container);

        const onVisibility = () => {
          pageVisible = document.visibilityState !== 'hidden';
          wake();
        };
        document.addEventListener('visibilitychange', onVisibility);

        resize();
        wake();

        return () => {
          cancelAnimationFrame(raf);
          wakeRef.current = null;
          resizeObserver.disconnect();
          intersection.disconnect();
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerdown', onPointerDown);
          document.documentElement.removeEventListener('pointerleave', onLeave);
          document.removeEventListener('visibilitychange', onVisibility);
          canvas.removeEventListener('webglcontextlost', onLost);
          canvas.removeEventListener('webglcontextrestored', onRestored);
          if (!gl.isContextLost()) {
            gl.deleteVertexArray(vao);
            gl.deleteProgram(program.program);
          }
        };
      };
      function setGeneration(update) {
        cleanup?.();
        current = update(current);
        cleanup = run(current);
      }
      cleanup = run(current);

      return {
        destroy() {
          cleanup?.();
          canvas.remove();
        }
      };
    };
  })();

  /* ===================================================================== */
  /* GradientText — src/content/TextAnimations/GradientText/GradientText.jsx */
  /* ===================================================================== */
  const GradientText = (() => {
    const VARIANTS = ['linear', 'flow', 'conic'];
    const ANGLES = { horizontal: 90, vertical: 180, diagonal: 135 };
    const TAU = Math.PI * 2;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    return function GradientText(target, {
      children,
      colors = ['#5227FF', '#FF9FFC', '#B497CF'],
      animationSpeed = 8,
      variant = 'linear',
      angle = 90,
      direction,
      scale = 3,
      yoyo = true,
      glow = 0,
      showBorder = false,
      borderWidth = 1.5,
      pauseOnHover = false,
      followPointer = false,
      className = '',
      style
    } = {}) {
      const rootRef = { current: null };
      const settingsRef = { current: null };
      const wakeRef = { current: null };
      const palette = colors.length > 1 ? colors : [colors[0] ?? '#ffffff', colors[0] ?? '#ffffff'];

      settingsRef.current = {
        colors: palette,
        speed: Math.max(0.2, animationSpeed),
        variant: VARIANTS.includes(variant) ? variant : 'linear',
        angle: direction ? (ANGLES[direction] ?? angle) : angle,
        scale: clamp(scale, 1, 6),
        yoyo,
        pauseOnHover,
        followPointer
      };

      // JSX: <span.gradient-text><span.__inner><span.__content>{children}</span>[glow]</span></span>,
      // rendered inside the target with the target's current content as children.
      const loop = [...palette, palette[0]];
      const root = span(`gradient-text${showBorder ? ' gradient-text--border' : ''}${className ? ` ${className}` : ''}`);
      root.style.setProperty(
        '--gt-gradient',
        `linear-gradient(${direction ? (ANGLES[direction] ?? angle) : angle}deg, ${loop.join(', ')})`
      );
      root.style.setProperty('--gt-border', `${borderWidth}px`);
      root.style.setProperty('--gt-glow', String(clamp(glow, 0, 1)));
      applyStyle(root, style);
      const inner = span('gradient-text__inner');
      const content = span('gradient-text__content');
      const text = target.textContent;
      content.append(...target.childNodes);
      inner.appendChild(content);
      if (glow > 0) {
        const halo = span('gradient-text__glow', { 'aria-hidden': 'true' });
        halo.textContent = text;
        inner.appendChild(halo);
      }
      root.appendChild(inner);
      target.appendChild(root);
      rootRef.current = root;

      const cleanup = (() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const state = { time: 0, inside: false, visible: true, x: 0.5, y: 0.5, px: 0.5, py: 0.5, vx: 0, vy: 0, pull: 0 };
        let raf = 0;
        let last = 0;
        let alive = true;

        const paint = () => {
          const s = settingsRef.current;
          const list = s.colors;
          const cycle = state.time / s.speed;
          let image;
          if (s.variant === 'flow') {
            const blobs = list.map((color, i) => {
              const spin = cycle * TAU;
              const rate = 0.55 + ((i * 0.618) % 1) * 0.5;
              let x = 50 + 44 * Math.sin(spin * rate + i * 2.1);
              let y = 50 + 40 * Math.sin(spin * (rate * 0.83 + 0.21) + i * 1.3);
              if (i === 0) {
                x += (state.px * 100 - x) * state.pull;
                y += (state.py * 100 - y) * state.pull;
              }
              return `radial-gradient(ellipse ${(22 + 12 * s.scale).toFixed(1)}% ${(60 + 30 * s.scale).toFixed(1)}% at ${x.toFixed(2)}% ${y.toFixed(2)}%, ${color} 0%, transparent 100%)`;
            });
            image = `${blobs.join(', ')}, linear-gradient(${s.angle}deg, ${list.join(', ')})`;
          } else if (s.variant === 'conic') {
            const sway = s.yoyo ? Math.sin(cycle * Math.PI) * 50 : cycle * 360;
            const cx = 50 + (state.px * 100 - 50) * state.pull;
            const cy = 260 + (state.py * 100 - 260) * state.pull;
            image = `repeating-conic-gradient(from ${(sway - 30).toFixed(2)}deg at ${cx.toFixed(2)}% ${cy.toFixed(2)}%, ${[...list, list[0]].map((color, i) => `${color} ${((i / list.length) * 60 * (3 / s.scale)).toFixed(2)}deg`).join(', ')})`;
          } else {
            const loop = [...list, list[0]];
            const period = 100 * s.scale;
            let offset;
            if (s.yoyo) {
              const swing = cycle % 2;
              const t = swing < 1 ? swing : 2 - swing;
              offset = (0.5 - Math.cos(Math.PI * t) / 2) * (period - 100);
            } else {
              offset = (cycle % 1) * period;
            }
            offset += (state.px - 0.5) * period * 0.5 * state.pull;
            const stops = loop.map((color, i) => `${color} ${((i / (loop.length - 1)) * period - offset).toFixed(2)}%`);
            image = `repeating-linear-gradient(${s.angle}deg, ${stops.join(', ')})`;
          }
          root.style.setProperty('--gt-gradient', image);
        };

        const tick = now => {
          raf = 0;
          if (!alive) return;
          const s = settingsRef.current;
          const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
          last = now;
          const paused = reduce || (s.pauseOnHover && state.inside);
          if (!paused) state.time += dt;
          const target = s.followPointer && state.inside ? 1 : 0;
          state.pull += (target - state.pull) * (1 - Math.exp(-dt * 6));
          const stiffness = 160;
          state.vx += ((state.x - state.px) * stiffness - state.vx * 2 * Math.sqrt(stiffness)) * dt;
          state.vy += ((state.y - state.py) * stiffness - state.vy * 2 * Math.sqrt(stiffness)) * dt;
          state.px += state.vx * dt;
          state.py += state.vy * dt;
          paint();
          const settling = Math.abs(state.pull - target) > 0.001 || Math.abs(state.vx) + Math.abs(state.vy) > 0.001;
          if (!state.visible || (paused && !settling)) return;
          raf = requestAnimationFrame(tick);
        };

        const wake = () => {
          if (raf || !alive) return;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        };
        wakeRef.current = () => {
          paint();
          wake();
        };

        const locate = event => {
          const rect = root.getBoundingClientRect();
          state.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
          state.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        };
        const onEnter = event => {
          locate(event);
          if (!state.inside) {
            state.px = state.x;
            state.py = state.y;
          }
          state.inside = true;
          wake();
        };
        const onMove = event => {
          locate(event);
          wake();
        };
        const onLeave = () => {
          state.inside = false;
          wake();
        };

        const observer = new IntersectionObserver(entries => {
          state.visible = entries.some(entry => entry.isIntersecting);
          if (state.visible) wake();
        });
        observer.observe(root);
        root.addEventListener('pointerenter', onEnter);
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);
        paint();
        wake();

        return () => {
          alive = false;
          cancelAnimationFrame(raf);
          observer.disconnect();
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerleave', onLeave);
          wakeRef.current = null;
        };
      })();

      return {
        destroy() {
          cleanup?.();
          target.replaceChildren(...content.childNodes);
        }
      };
    };
  })();

  /* ===================================================================== */
  /* ShinyText — src/content/TextAnimations/ShinyText/ShinyText.jsx        */
  /* ===================================================================== */
  const ShinyText = (() => {
    const EASINGS = {
      linear: t => t,
      smooth: t => 0.5 - Math.cos(Math.PI * t) / 2,
      snappy: t => (t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2)
    };
    const TRIGGERS = ['loop', 'hover', 'view'];
    const FALLOFF = [0, 0.2, 0.4, 0.6, 0.8, 1];

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    let paint = null;

    const parseColor = value => {
      if (typeof document === 'undefined') return null;
      if (!paint) paint = document.createElement('canvas').getContext('2d');
      if (!paint) return null;
      paint.fillStyle = '#000000';
      paint.fillStyle = value;
      const resolved = String(paint.fillStyle);
      if (resolved.startsWith('#')) {
        return [1, 3, 5].map(i => parseInt(resolved.slice(i, i + 2), 16)).concat(1);
      }
      const parts = resolved.match(/[\d.]+/g);
      if (!parts || parts.length < 3) return null;
      return [Number(parts[0]), Number(parts[1]), Number(parts[2]), parts.length > 3 ? Number(parts[3]) : 1];
    };

    const blend = (from, to, amount) => {
      const channel = (a, b) =>
        Math.round(Math.pow(Math.pow(a / 255, 2.2) * (1 - amount) + Math.pow(b / 255, 2.2) * amount, 1 / 2.2) * 255);
      const alpha = from[3] * (1 - amount) + to[3] * amount;
      if (alpha <= 0) return 'rgba(0, 0, 0, 0)';
      const weigh = (a, b) => (a * from[3] * (1 - amount) + b * to[3] * amount) / alpha;
      const r = from[3] === to[3] ? channel(from[0], to[0]) : Math.round(weigh(from[0], to[0]));
      const g = from[3] === to[3] ? channel(from[1], to[1]) : Math.round(weigh(from[1], to[1]));
      const b = from[3] === to[3] ? channel(from[2], to[2]) : Math.round(weigh(from[2], to[2]));
      return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 1000) / 1000})`;
    };

    return function ShinyText(target, {
      text,
      children,
      color = '#b5b5b5',
      shineColor = '#ffffff',
      speed = 2,
      delay = 0,
      angle = 120,
      shineWidth = 40,
      softness = 0.8,
      bands = 1,
      glow = 0,
      direction = 'left',
      easing = 'smooth',
      trigger = 'loop',
      yoyo = false,
      followPointer = false,
      pauseOnHover = false,
      disabled = false,
      className = '',
      style
    } = {}) {
      const rootRef = { current: null };
      const glowRef = { current: null };
      const settingsRef = { current: null };
      const syncRef = { current: null };
      const content = children ?? text;

      settingsRef.current = {
        color,
        shineColor,
        speed: Math.max(0.1, speed),
        delay: Math.max(0, delay),
        angle,
        shineWidth: clamp(shineWidth, 2, 200),
        softness: clamp(softness, 0, 1),
        bands: clamp(Math.round(bands), 1, 3),
        glow: clamp(glow, 0, 1),
        sign: direction === 'right' ? 1 : -1,
        ease: EASINGS[easing] ?? EASINGS.smooth,
        trigger: TRIGGERS.includes(trigger) ? trigger : 'loop',
        yoyo,
        followPointer,
        pauseOnHover,
        disabled
      };

      // JSX: the target itself is the .shiny-text root, so its text can still be
      // replaced (e.g. by lang.js) without breaking the effect.
      target.classList.add('shiny-text');
      addClasses(target, className);
      target.style.backgroundImage = `linear-gradient(${color}, ${color})`;
      applyStyle(target, style);
      let halo = null;
      if (glow > 0) {
        halo = span('shiny-text__glow', { 'aria-hidden': 'true' });
        halo.textContent = target.textContent;
        target.appendChild(halo);
      }
      rootRef.current = target;
      glowRef.current = halo;

      const cleanup = (() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const state = {
          pos: null,
          vel: 0,
          phase: 'idle',
          from: 0,
          to: 0,
          start: 0,
          duration: 1,
          resume: 0,
          flip: false,
          inside: false,
          target: 0,
          visible: true,
          seen: false,
          colors: ''
        };
        let base = null;
        let shine = null;
        let clear = null;
        let raf = 0;
        let timer = 0;
        let last = 0;
        let alive = true;

        const extent = () => {
          const s = settingsRef.current;
          return s.shineWidth / 2 + (s.bands - 1) * s.shineWidth * 1.3 + 2;
        };
        const entry = () => (settingsRef.current.sign > 0 ? -extent() : 100 + extent());
        const exit = () => (settingsRef.current.sign > 0 ? 100 + extent() : -extent());
        const nearest = () => (state.target < 50 ? -extent() : 100 + extent());

        const gradient = (pos, fill) => {
          const s = settingsRef.current;
          const half = s.shineWidth / 2;
          const core = half * (1 - s.softness);
          const fade = half - core;
          const stops = [];
          for (let band = 0; band < s.bands; band++) {
            const center = pos - s.sign * band * s.shineWidth * 1.3;
            const strength = 1 - band * 0.28;
            for (const side of [-1, 1]) {
              for (const f of FALLOFF) {
                const at = center + side * (core + fade * (1 - f));
                const amount = f * f * (3 - 2 * f) * strength;
                stops.push([at, amount]);
              }
            }
          }
          stops.sort((a, b) => a[0] - b[0]);
          const list = stops.map(([at, amount]) => `${blend(fill, shine, amount)} ${at.toFixed(2)}%`);
          return `linear-gradient(${s.angle}deg, ${blend(fill, shine, 0)} 0%, ${list.join(', ')}, ${blend(fill, shine, 0)} 100%)`;
        };

        const draw = () => {
          const s = settingsRef.current;
          const key = `${s.color}|${s.shineColor}`;
          if (key !== state.colors) {
            state.colors = key;
            base = parseColor(s.color);
            shine = parseColor(s.shineColor);
            clear = shine ? [shine[0], shine[1], shine[2], 0] : null;
          }
          if (!base || !shine) {
            root.style.backgroundImage = `linear-gradient(${s.color}, ${s.color})`;
            return;
          }
          if (state.pos === null || s.disabled) {
            root.style.backgroundImage = `linear-gradient(${s.color}, ${s.color})`;
            if (glowRef.current) glowRef.current.style.backgroundImage = 'none';
            return;
          }
          root.style.backgroundImage = gradient(state.pos, base);
          if (glowRef.current) {
            glowRef.current.style.backgroundImage = gradient(state.pos, clear);
            glowRef.current.style.opacity = String(s.glow);
          }
        };

        const sweep = (from, to, now) => {
          const s = settingsRef.current;
          const span = Math.abs(exit() - entry()) || 1;
          state.phase = 'sweep';
          state.from = from;
          state.to = to;
          state.start = now;
          state.duration = s.speed * 1000 * Math.max(0.15, Math.abs(to - from) / span);
        };

        const wake = () => {
          if (raf || !alive) return;
          window.clearTimeout(timer);
          timer = 0;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        };

        const tick = now => {
          raf = 0;
          if (!alive) return;
          const s = settingsRef.current;
          const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
          last = now;
          if (s.disabled) {
            state.pos = null;
            state.phase = 'idle';
            draw();
            return;
          }
          const following = s.followPointer && state.inside;
          if (following) {
            if (state.pos === null) state.pos = nearest();
            const stiffness = 220;
            state.vel += ((state.target - state.pos) * stiffness - state.vel * 2 * Math.sqrt(stiffness)) * dt;
            state.pos += state.vel * dt;
            state.phase = 'follow';
            draw();
            raf = requestAnimationFrame(tick);
            return;
          }
          if (state.phase === 'follow') {
            state.vel = 0;
            sweep(state.pos ?? nearest(), nearest(), now);
          }
          if (state.phase === 'sweep') {
            if (s.pauseOnHover && state.inside) {
              state.start += dt * 1000;
              raf = requestAnimationFrame(tick);
              return;
            }
            const t = clamp((now - state.start) / state.duration, 0, 1);
            state.pos = state.from + (state.to - state.from) * s.ease(t);
            draw();
            if (t < 1) {
              raf = requestAnimationFrame(tick);
              return;
            }
            if (s.trigger !== 'loop' || reduce) {
              state.phase = 'idle';
              state.pos = null;
              draw();
              return;
            }
            state.phase = 'wait';
            state.resume = now + s.delay * 1000;
          }
          if (state.phase === 'wait') {
            if (!state.visible) return;
            if (now < state.resume) {
              window.clearTimeout(timer);
              timer = window.setTimeout(wake, state.resume - now);
              return;
            }
            if (s.yoyo) {
              state.flip = !state.flip;
              sweep(state.flip ? exit() : entry(), state.flip ? entry() : exit(), now);
            } else {
              sweep(entry(), exit(), now);
            }
            raf = requestAnimationFrame(tick);
            return;
          }
          if (state.phase === 'idle' && s.trigger === 'loop' && !reduce && state.visible) {
            state.flip = false;
            sweep(entry(), exit(), now);
            raf = requestAnimationFrame(tick);
          }
        };

        const locate = event => {
          const s = settingsRef.current;
          const rect = root.getBoundingClientRect();
          const radians = (s.angle * Math.PI) / 180;
          const dx = Math.sin(radians);
          const dy = -Math.cos(radians);
          const length = Math.abs(rect.width * dx) + Math.abs(rect.height * dy) || 1;
          const along =
            (event.clientX - rect.left - rect.width / 2) * dx + (event.clientY - rect.top - rect.height / 2) * dy;
          return 50 + (along / length) * 100;
        };

        const onEnter = event => {
          const s = settingsRef.current;
          state.inside = true;
          state.target = locate(event);
          if (s.disabled) return;
          if (s.followPointer) {
            if (state.pos === null) state.pos = nearest();
          } else if (s.trigger === 'hover' && state.phase === 'idle' && !reduce) {
            sweep(entry(), exit(), performance.now());
          }
          wake();
        };
        const onMove = event => {
          state.target = locate(event);
          if (settingsRef.current.followPointer) wake();
        };
        const onLeave = () => {
          state.inside = false;
          wake();
        };

        const observer = new IntersectionObserver(entries => {
          const visible = entries.some(item => item.isIntersecting);
          state.visible = visible;
          const s = settingsRef.current;
          if (!visible) return;
          if (s.trigger === 'view' && !state.seen && !reduce && !s.disabled) {
            state.seen = true;
            sweep(entry(), exit(), performance.now());
          }
          wake();
        });
        observer.observe(root);

        root.addEventListener('pointerenter', onEnter);
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);

        syncRef.current = () => {
          const s = settingsRef.current;
          if (s.disabled) {
            state.pos = null;
            state.phase = 'idle';
          } else if (s.trigger !== 'loop' && state.phase === 'wait') {
            state.phase = 'idle';
            state.pos = null;
          }
          draw();
          wake();
        };
        draw();
        wake();

        return () => {
          alive = false;
          cancelAnimationFrame(raf);
          window.clearTimeout(timer);
          observer.disconnect();
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerleave', onLeave);
          syncRef.current = null;
        };
      })();

      return {
        destroy() {
          cleanup?.();
          halo?.remove();
          target.classList.remove('shiny-text');
          target.style.backgroundImage = '';
        }
      };
    };
  })();

  /* ===================================================================== */
  /* DecryptedText — src/content/TextAnimations/DecryptedText/DecryptedText.jsx */
  /* Hand-ported (the React version is state driven). Supports the          */
  /* 'scramble' and 'fade' effects and every animateOn mode; the 'flip'      */
  /* effect and hoverRadius are not ported. Call setText() after replacing   */
  /* the text, e.g. on a language change.                                    */
  /* ===================================================================== */
  const DecryptedText = (() => {
    const FADE_FLOOR = 0.16;
    const FADE_PEAK = 0.62;
    const FADE_LEAD = 6;
    const SETTLE = 'color 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

    const isSpace = char => /\s/.test(char);

    const prefersReducedMotion = () =>
      typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

    const glyphWidths = new Map();
    let measureContext = null;

    const readFont = node => {
      const style = window.getComputedStyle(node);
      return {
        font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        spacing: parseFloat(style.letterSpacing) || 0
      };
    };

    const advance = (font, glyph) => {
      let widths = glyphWidths.get(font);
      if (!widths) {
        widths = new Map();
        glyphWidths.set(font, widths);
      }
      let width = widths.get(glyph);
      if (width === undefined) {
        measureContext = measureContext || document.createElement('canvas').getContext('2d');
        if (!measureContext) return 0;
        measureContext.font = font;
        width = measureContext.measureText(glyph).width;
        widths.set(glyph, width);
      }
      return width;
    };

    return function DecryptedText(target, {
      text,
      speed = 50,
      maxIterations = 10,
      sequential = false,
      revealDirection = 'start',
      useOriginalCharsOnly = false,
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
      className = '',
      parentClassName = '',
      encryptedClassName = '',
      animateOn = 'hover',
      clickMode = 'once',
      effect = 'scramble',
      scrambleColor = '',
      loop = false,
      loopDelay = 2000
    } = {}) {
      const step = Math.max(16, speed);
      const hoverable = animateOn === 'hover' || animateOn === 'inViewHover';
      const viewTrigger = animateOn === 'view' || animateOn === 'inViewHover';
      const tinted = Boolean(scrambleColor);
      const fading = effect === 'fade';
      const settles = tinted || fading;

      let chars = [];
      let pool = [];
      let cells = [];
      let mask = [];
      let wrapper = null;
      let run = null;
      let timer = null;
      let hold = null;
      let pending = null;
      let visible = true;
      let wanted = true;
      let played = false;
      let metrics = null;
      let viewObserver = null;
      let resizeObserver = null;

      const revealOrder = () => {
        const order = [];
        chars.forEach((char, index) => {
          if (!isSpace(char)) order.push(index);
        });
        if (revealDirection === 'end') return order.reverse();
        if (revealDirection === 'center') {
          const middle = Math.floor(chars.length / 2);
          return order.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle));
        }
        if (revealDirection === 'random') {
          for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
          }
        }
        return order;
      };

      const fit = (index, glyph) => {
        if (!metrics && wrapper) metrics = readFont(wrapper);
        if (!metrics) return 1;
        const room = advance(metrics.font, chars[index] ?? glyph) + metrics.spacing;
        const need = advance(metrics.font, glyph) + metrics.spacing;
        return need > room + 0.01 ? Math.round(Math.max(0.05, room / need) * 1000) / 1000 : 1;
      };

      const paint = () => {
        const ranks = run?.forward && sequential ? new Map(run.queue.map((index, rank) => [index, rank])) : null;
        const ramp = run?.forward && !sequential ? Math.min(1, run.iteration / Math.max(1, maxIterations)) : 0;

        chars.forEach((char, index) => {
          const cell = cells[index];
          if (!cell) return;
          const revealed = mask[index];
          cell.className = revealed ? className : encryptedClassName;
          cell.removeAttribute('style');
          const style = revealed ? {} : { position: 'relative', display: 'inline-block' };
          if (settles) style.transition = revealed ? SETTLE : `color 0.12s linear, opacity ${step}ms linear`;

          if (revealed) {
            if (fading) style.opacity = 1;
            Object.assign(cell.style, style);
            cell.textContent = char;
            return;
          }

          const rank = ranks?.get(index);
          const lift = rank === undefined ? ramp : Math.max(0, 1 - rank / FADE_LEAD);
          if (tinted) style.color = scrambleColor;
          if (fading) style.opacity = FADE_FLOOR + (FADE_PEAK - FADE_FLOOR) * lift;
          Object.assign(cell.style, style);

          const glyph = pool[Math.floor(Math.random() * pool.length)];
          const squeeze = fit(index, glyph);
          const ghost = span('', { style: 'visibility:hidden' });
          ghost.textContent = char;
          const shown = span('');
          shown.style.cssText = 'position:absolute;top:0;left:50%';
          shown.style.transform = squeeze < 1 ? `translateX(-50%) scaleX(${squeeze})` : 'translateX(-50%)';
          shown.textContent = glyph;
          cell.replaceChildren(ghost, shown);
        });
      };

      const stopTicker = () => {
        clearInterval(timer);
        timer = null;
      };

      const ensureTicker = () => {
        if (timer) return;
        timer = setInterval(tick, step);
      };

      const stopRun = () => {
        run = null;
        clearTimeout(hold);
        hold = null;
        pending = null;
      };

      const schedule = (task, delay) => {
        clearTimeout(hold);
        hold = setTimeout(() => {
          hold = null;
          if (visible) task();
          else pending = task;
        }, delay);
      };

      const startRun = (forward, { from, cycle = false, lead = 0 } = {}) => {
        stopRun();
        wanted = forward;
        if (from) mask = from;

        if (prefersReducedMotion()) {
          mask = chars.map(char => forward || isSpace(char));
          paint();
          return;
        }

        const order = forward ? revealOrder() : revealOrder().reverse();
        const queue = sequential ? order.filter(index => mask[index] !== forward) : [];

        run = {
          forward,
          cycle,
          iteration: 0,
          queue: [...new Array(lead).fill(null), ...queue]
        };
        paint();
        ensureTicker();
      };

      const finishRun = finished => {
        if (!loop) return;
        if (finished.forward) {
          schedule(() => startRun(false, { cycle: true }), Math.max(0, loopDelay));
        } else if (finished.cycle) {
          startRun(true, { cycle: true, lead: sequential ? Math.max(2, Math.round(320 / step)) : 0 });
        }
      };

      function tick() {
        if (run) {
          const current = run;
          current.iteration += 1;
          let next = mask;
          let done;

          if (sequential) {
            const index = current.queue.shift();
            if (index !== undefined && index !== null) {
              next = next.slice();
              next[index] = current.forward;
            }
            done = current.queue.length === 0;
          } else if (current.forward) {
            done = current.iteration >= maxIterations;
            if (done) next = chars.map(() => true);
          } else {
            const shown = [];
            next.forEach((on, index) => {
              if (on && !isSpace(chars[index])) shown.push(index);
            });
            const hideCount = Math.max(
              1,
              Math.ceil(chars.filter(char => !isSpace(char)).length / Math.max(1, maxIterations))
            );
            next = next.slice();
            for (let i = 0; i < hideCount && shown.length; i++) {
              next[shown.splice(Math.floor(Math.random() * shown.length), 1)[0]] = false;
            }
            done = shown.length === 0 || current.iteration >= maxIterations;
            if (done) next = chars.map(char => isSpace(char));
          }

          mask = next;
          if (done) {
            run = null;
            finishRun(current);
          }
        }

        paint();
        if (!run) stopTicker();
      }

      const onEnter = () => {
        if (run) return;
        startRun(true, { from: chars.map(char => isSpace(char)) });
      };

      const onLeave = () => {
        stopRun();
        wanted = true;
        mask = chars.map(() => true);
        paint();
        if (loop && animateOn === 'inViewHover') {
          schedule(() => startRun(false, { cycle: true }), Math.max(0, loopDelay));
        }
      };

      const onClick = () => {
        if (clickMode === 'toggle') {
          startRun(!wanted);
          return;
        }
        if (!wanted) startRun(true);
      };

      const setText = value => {
        stopTicker();
        stopRun();
        viewObserver?.disconnect();
        resizeObserver?.disconnect();

        chars = Array.from(String(value ?? ''));
        const letters = chars.filter(char => !isSpace(char));
        const source = useOriginalCharsOnly ? Array.from(new Set(letters)) : Array.from(characters);
        pool = source.length ? source : letters;
        metrics = null;

        // JSX: <span.parentClassName><span sr-only>{text}</span><span aria-hidden>{words of cells}</span></span>
        wrapper = span(parentClassName);
        wrapper.style.display = 'inline-block';
        wrapper.style.whiteSpace = 'pre-wrap';
        const label = span('', {
          style:
            'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0'
        });
        label.textContent = chars.join('');
        const visual = span('', { 'aria-hidden': 'true' });
        cells = [];
        let word = null;
        chars.forEach((char, index) => {
          if (isSpace(char)) {
            visual.append(char);
            word = null;
            return;
          }
          if (!word) {
            word = span('', { style: 'white-space:nowrap' });
            visual.append(word);
          }
          cells[index] = span('');
          word.append(cells[index]);
        });
        wrapper.append(label, visual);
        target.replaceChildren(wrapper);

        if (hoverable) {
          wrapper.addEventListener('mouseenter', onEnter);
          wrapper.addEventListener('mouseleave', onLeave);
        } else if (animateOn === 'click') {
          wrapper.addEventListener('click', onClick);
        }

        played = false;
        const hidden = animateOn === 'click' || (viewTrigger && !prefersReducedMotion());
        wanted = !hidden;
        mask = chars.map(char => !hidden || isSpace(char));
        paint();

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            const next = readFont(wrapper);
            glyphWidths.delete(next.font);
            metrics = next;
          });
          resizeObserver.observe(wrapper);
        }

        if ((viewTrigger || loop) && typeof IntersectionObserver !== 'undefined') {
          viewObserver = new IntersectionObserver(
            entries => {
              visible = entries.some(entry => entry.isIntersecting);
              if (!visible) return;
              if (viewTrigger && !played) {
                played = true;
                startRun(true);
              }
              const resume = pending;
              pending = null;
              resume?.();
              if (!loop) viewObserver.disconnect();
            },
            { threshold: 0.1 }
          );
          viewObserver.observe(wrapper);
        }
      };

      setText(text ?? target.textContent);

      return {
        setText,
        destroy() {
          stopTicker();
          stopRun();
          viewObserver?.disconnect();
          resizeObserver?.disconnect();
          target.textContent = chars.join('');
        }
      };
    };
  })();

  /* ===================================================================== */
  /* StarBorder — src/content/Animations/StarBorder/StarBorder.jsx         */
  /* ===================================================================== */
  const StarBorder = (() => {
    const THEMES = {
      dark: {
        surface: '#0c0c0f',
        text: '#fafafa',
        track: 'rgba(255, 255, 255, 0.1)',
        light: '#ffffff'
      },
      light: {
        surface: '#ffffff',
        text: '#18181b',
        track: 'rgba(24, 24, 27, 0.12)',
        light: '#18181b'
      }
    };

    const HOVERS = ['lap', 'brighten', 'reveal', 'none'];
    const BLEED = 48;
    const LAP = 0.9;
    const TAU = Math.PI * 2;
    const WHITE = [255, 255, 255];

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const wrap = (value, total) => ((value % total) + total) % total;
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (2 - 2 * t) ** 3 / 2);
    const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const rgba = (rgb, alpha) =>
      `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${clamp(alpha, 0, 1).toFixed(3)})`;

    let colorContext = null;

    const toRgb = color => {
      colorContext = colorContext ?? document.createElement('canvas').getContext('2d');
      if (!colorContext) return WHITE;
      colorContext.fillStyle = '#000000';
      colorContext.fillStyle = color;
      const value = String(colorContext.fillStyle);
      if (value.startsWith('#')) {
        const hex = parseInt(value.slice(1, 7), 16);
        return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
      }
      const parts = value.match(/[\d.]+/g)?.map(Number) ?? WHITE;
      return [parts[0], parts[1], parts[2]];
    };

    const outline = (width, height, radius) => {
      const r = Math.max(0, Math.min(radius, width / 2, height / 2));
      const arc = (Math.PI * r) / 2;
      const across = Math.max(0, width - 2 * r);
      const down = Math.max(0, height - 2 * r);
      const segments = [
        { length: across, x: r, y: 0, dx: 1, dy: 0, angle: null },
        { length: arc, x: width - r, y: r, dx: 0, dy: 0, angle: -Math.PI / 2 },
        { length: down, x: width, y: r, dx: 0, dy: 1, angle: null },
        { length: arc, x: width - r, y: height - r, dx: 0, dy: 0, angle: 0 },
        { length: across, x: width - r, y: height, dx: -1, dy: 0, angle: null },
        { length: arc, x: r, y: height - r, dx: 0, dy: 0, angle: Math.PI / 2 },
        { length: down, x: 0, y: height - r, dx: 0, dy: -1, angle: null },
        { length: arc, x: r, y: r, dx: 0, dy: 0, angle: Math.PI }
      ];
      return {
        r,
        segments,
        total: Math.max(
          1,
          segments.reduce((sum, segment) => sum + segment.length, 0)
        )
      };
    };

    const pointAt = (shape, distance, point) => {
      let s = wrap(distance, shape.total);
      for (const segment of shape.segments) {
        if (segment.length > 0 && s <= segment.length) {
          if (segment.angle === null) {
            point.x = segment.x + segment.dx * s;
            point.y = segment.y + segment.dy * s;
            point.nx = segment.dy;
            point.ny = -segment.dx;
          } else {
            const angle = segment.angle + s / shape.r;
            point.nx = Math.cos(angle);
            point.ny = Math.sin(angle);
            point.x = segment.x + point.nx * shape.r;
            point.y = segment.y + point.ny * shape.r;
          }
          return point;
        }
        s -= segment.length;
      }
      return point;
    };

    const project = (shape, px, py) => {
      let best = Infinity;
      let found = 0;
      let offset = 0;
      shape.segments.forEach(segment => {
        if (segment.length > 0) {
          let s = 0;
          let x = 0;
          let y = 0;
          if (segment.angle === null) {
            s = clamp((px - segment.x) * segment.dx + (py - segment.y) * segment.dy, 0, segment.length);
            x = segment.x + segment.dx * s;
            y = segment.y + segment.dy * s;
          } else {
            let angle = wrap(Math.atan2(py - segment.y, px - segment.x) - segment.angle, TAU);
            if (angle > Math.PI / 2) angle = angle > Math.PI * 1.25 ? 0 : Math.PI / 2;
            s = angle * shape.r;
            x = segment.x + Math.cos(segment.angle + angle) * shape.r;
            y = segment.y + Math.sin(segment.angle + angle) * shape.r;
          }
          const distance = (px - x) ** 2 + (py - y) ** 2;
          if (distance < best) {
            best = distance;
            found = offset + s;
          }
        }
        offset += segment.length;
      });
      return found;
    };

    return function StarBorder(target, {
      as: Component = 'button',
      children,
      className = '',
      style,
      color,
      trailColor,
      duration = 4,
      thickness = 1,
      radius = 12,
      trailLength = 0.3,
      stars = 1,
      glow = 0.6,
      sparkle = false,
      direction = 'clockwise',
      hover = 'lap',
      clickPulse = true,
      theme = 'dark',
      backgroundColor,
      textColor,
      borderColor,
      ...rest
    } = {}) {
      const rootRef = { current: null };
      const canvasRef = { current: null };
      const wakeRef = { current: null };
      const palette = THEMES[theme] ?? THEMES.dark;
      const light = color ?? palette.light;
      const settings = {
        light: theme === 'light',
        color: light,
        trailColor: trailColor ?? light,
        duration: Math.max(0.3, duration),
        thickness: Math.max(0.5, thickness),
        radius: Math.max(0, radius),
        trailLength: clamp(trailLength, 0, 1),
        stars: clamp(Math.round(stars), 1, 6),
        glow: clamp(glow, 0, 1),
        sparkle,
        direction: direction === 'counterclockwise' ? -1 : 1,
        hover: HOVERS.includes(hover) ? hover : 'lap',
        clickPulse
      };
      const settingsRef = { current: settings };
      settingsRef.current = settings;

      // JSX: the target (a, button…) is the root; the light canvas is its first child.
      target.classList.add('star-border');
      addClasses(target, className);
      target.style.setProperty('--star-border-radius', `${settings.radius}px`);
      target.style.setProperty('--star-border-thickness', `${settings.thickness}px`);
      target.style.setProperty('--star-border-surface', backgroundColor ?? palette.surface);
      target.style.setProperty('--star-border-text', textColor ?? palette.text);
      target.style.setProperty('--star-border-track', borderColor ?? palette.track);
      applyStyle(target, style);
      const canvas = document.createElement('canvas');
      canvas.className = 'star-border__light';
      canvas.setAttribute('aria-hidden', 'true');
      target.prepend(canvas);
      rootRef.current = target;
      canvasRef.current = canvas;

      const cleanup = (() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!root || !canvas || !ctx) return undefined;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const point = { x: 0, y: 0, nx: 0, ny: -1 };
        const state = {
          width: 0,
          height: 0,
          dpr: 1,
          phase: 0,
          velocity: 0,
          motion: 0,
          lap: -1,
          time: 0,
          reveal: 0,
          boost: 0,
          flash: 0,
          emit: 0,
          hovered: false,
          focused: false,
          pointerX: 0,
          pointerY: 0,
          visible: true
        };
        const pulses = [];
        const dust = [];
        const colors = { key: '', head: WHITE, tail: WHITE };
        let raf = 0;
        let last = performance.now();
        let alive = true;

        const measure = () => {
          state.width = root.offsetWidth;
          state.height = root.offsetHeight;
          state.dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.max(1, Math.round((state.width + BLEED * 2) * state.dpr));
          canvas.height = Math.max(1, Math.round((state.height + BLEED * 2) * state.dpr));
          wake();
        };

        const local = event => {
          const rect = root.getBoundingClientRect();
          const scaleX = rect.width ? state.width / rect.width : 1;
          const scaleY = rect.height ? state.height / rect.height : 1;
          return [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
        };

        const shapeFor = s =>
          outline(
            Math.max(1, state.width - s.thickness),
            Math.max(1, state.height - s.thickness),
            s.radius - s.thickness / 2
          );

        const stroke = (x1, y1, x2, y2, width, style) => {
          ctx.lineWidth = width;
          ctx.strokeStyle = style;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        };

        const drawTrail = (s, shape, head, length, sign, intensity, tip = true) => {
          if (length < 0.5 || intensity <= 0) return;
          const steps = clamp(Math.ceil(length / 2), 2, 90);
          pointAt(shape, head, point);
          let px = point.x;
          let py = point.y;
          for (let i = 1; i <= steps; i++) {
            pointAt(shape, head - sign * length * (i / steps), point);
            const u = 1 - (i - 0.5) / steps;
            const fade = u * u * intensity;
            let tone = mix(colors.tail, colors.head, u);
            if (!s.light) tone = mix(tone, WHITE, u ** 6 * 0.65);
            ctx.lineCap = tip && i === 1 ? 'round' : 'butt';
            stroke(px, py, point.x, point.y, 2 + 6 * s.glow, rgba(tone, fade * (s.light ? 0.1 : 0.2) * s.glow));
            stroke(px, py, point.x, point.y, s.thickness, rgba(tone, fade));
            px = point.x;
            py = point.y;
          }
        };

        const drawHead = (s, x, y, intensity, twinkle) => {
          if (intensity <= 0) return;
          const tone = colors.head;
          const reach = (12 + 40 * s.glow) * (s.light ? 0.6 : 1);
          const bloom = ctx.createRadialGradient(x, y, 0, x, y, reach);
          const strength = (s.light ? 0.08 : 0.4) * s.glow * intensity;
          bloom.addColorStop(0, rgba(tone, strength));
          bloom.addColorStop(0.2, rgba(tone, strength * 0.4));
          bloom.addColorStop(0.5, rgba(tone, strength * 0.1));
          bloom.addColorStop(1, rgba(tone, 0));
          ctx.fillStyle = bloom;
          ctx.fillRect(x - reach, y - reach, reach * 2, reach * 2);
          if (!s.sparkle) return;

          const size = (1 + s.thickness * 0.6) * (s.light ? 0.85 : 1);
          const core = ctx.createRadialGradient(x, y, 0, x, y, size * 2.2);
          core.addColorStop(0, rgba(s.light ? tone : WHITE, intensity));
          core.addColorStop(s.light ? 0.3 : 0.4, rgba(s.light ? tone : mix(tone, WHITE, 0.5), intensity * 0.9));
          core.addColorStop(s.light ? 0.55 : 1, rgba(tone, s.light ? intensity * 0.12 : 0));
          core.addColorStop(1, rgba(tone, 0));
          ctx.fillStyle = core;
          ctx.beginPath();
          ctx.arc(x, y, size * 2.2, 0, TAU);
          ctx.fill();

          const spike = (3 + 4 * s.glow + s.thickness * 1.5) * twinkle;
          const center = s.light ? tone : WHITE;
          const horizontal = ctx.createLinearGradient(x - spike, y, x + spike, y);
          horizontal.addColorStop(0, rgba(tone, 0));
          horizontal.addColorStop(0.5, rgba(center, intensity * 0.95));
          horizontal.addColorStop(1, rgba(tone, 0));
          stroke(x - spike, y, x + spike, y, s.light ? 0.75 : 1, horizontal);
          const vertical = ctx.createLinearGradient(x, y - spike, x, y + spike);
          vertical.addColorStop(0, rgba(tone, 0));
          vertical.addColorStop(0.5, rgba(center, intensity * 0.95));
          vertical.addColorStop(1, rgba(tone, 0));
          stroke(x, y - spike, x, y + spike, s.light ? 0.75 : 1, vertical);
        };

        const spawnDust = (x, y, nx, ny, speed) => {
          if (dust.length > 48) return;
          const push = 3 + Math.random() * 10;
          const drift = (Math.random() - 0.5) * 8;
          dust.push({
            x: x + nx * (Math.random() * 3 - 1),
            y: y + ny * (Math.random() * 3 - 1),
            vx: nx * push - ny * drift - speed * -ny * 0.04,
            vy: ny * push + nx * drift - speed * nx * 0.04,
            age: 0,
            life: 0.35 + Math.random() * 0.5,
            size: 0.45 + Math.random() * 0.7,
            seed: Math.random() * TAU
          });
        };

        const draw = (base, shape) => {
          const s = state.boost > 0.001 ? { ...base, glow: Math.min(1.5, base.glow + 0.4 * state.boost) } : base;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (state.width < 2 || state.height < 2) return;
          const offset = (BLEED + s.thickness / 2) * state.dpr;
          ctx.setTransform(state.dpr, 0, 0, state.dpr, offset, offset);
          ctx.globalCompositeOperation = s.light ? 'source-over' : 'lighter';
          ctx.lineCap = 'butt';

          const total = shape.total;
          const spacing = total / s.stars;
          const speed = Math.abs(state.motion);
          const sign = state.motion >= 0 ? 1 : -1;
          const span = s.trailLength * s.duration;
          const length = Math.min(speed * span, spacing * 0.92, total * 0.6);
          const intensity = state.reveal * (1 + 0.4 * state.boost + 0.6 * state.flash);

          const ring = state.flash * (s.light ? 0.18 : 0.32) + state.boost * state.reveal * (s.light ? 0.07 : 0.12);
          if (ring > 0.005) {
            ctx.lineWidth = s.thickness + 2 * s.glow;
            ctx.strokeStyle = rgba(colors.head, ring);
            ctx.beginPath();
            ctx.roundRect(
              0,
              0,
              Math.max(1, state.width - s.thickness),
              Math.max(1, state.height - s.thickness),
              Math.max(0, shape.r)
            );
            ctx.stroke();
          }

          const still = clamp(1 - speed / Math.max(1, (total / s.duration) * 0.6), 0, 1) * Math.min(1, intensity);
          const rest = (10 + 14 * s.glow + s.thickness * 2) * still;
          for (let i = 0; i < s.stars; i++) {
            const head = state.phase + i * spacing;
            drawTrail(s, shape, head, length, sign, Math.min(1, intensity));
            if (still > 0.01) {
              drawTrail(s, shape, head, rest, 1, still, false);
              drawTrail(s, shape, head, rest, -1, still, false);
            }
          }

          pulses.forEach(pulse => {
            const progress = pulse.age / 0.65;
            const fade = (1 - progress) ** 2;
            const travel = (total / 2) * (1 - (1 - Math.min(1, pulse.age / 0.5)) ** 2);
            const tail = Math.min(travel, total * 0.16);
            [1, -1].forEach(way => {
              const front = pulse.origin + way * travel;
              drawTrail(s, shape, front, tail, way, fade);
              pointAt(shape, front, point);
              drawHead(s, point.x, point.y, fade * 0.8, 0.8);
            });
          });

          for (let i = 0; i < s.stars; i++) {
            pointAt(shape, state.phase + i * spacing, point);
            const twinkle = 0.82 + 0.18 * Math.sin(state.time * 6.1 + i * 2.3) * Math.sin(state.time * 2.7 + i);
            drawHead(s, point.x, point.y, Math.min(1.3, intensity), twinkle);
          }

          dust.forEach(mote => {
            const left = 1 - mote.age / mote.life;
            const shimmer = 0.45 + 0.55 * Math.sin(state.time * 20 + mote.seed);
            const alpha = left * shimmer * state.reveal * (s.light ? 0.35 : 0.9);
            if (alpha <= 0.01) return;
            ctx.fillStyle = rgba(s.light ? colors.head : mix(colors.tail, WHITE, 0.6), alpha);
            ctx.beginPath();
            ctx.arc(mote.x, mote.y, mote.size * (0.6 + 0.4 * left), 0, TAU);
            ctx.fill();
          });
        };

        const frame = now => {
          raf = 0;
          if (!alive) return;
          const s = settingsRef.current;
          const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
          last = now;
          state.time += dt;

          const key = `${s.color}|${s.trailColor}`;
          if (key !== colors.key) {
            colors.key = key;
            colors.head = toRgb(s.color);
            colors.tail = toRgb(s.trailColor);
          }

          const shape = shapeFor(s);
          const total = shape.total;
          const spacing = total / s.stars;
          const engaged = state.hovered || state.focused;
          const cruise = reduce ? 0 : (s.direction * total) / s.duration;

          const revealTarget = s.hover === 'reveal' && !engaged ? 0 : 1;
          state.reveal += (revealTarget - state.reveal) * (1 - Math.exp(-dt / (revealTarget > state.reveal ? 0.16 : 0.45)));
          const boostTarget = s.hover === 'brighten' && engaged ? 1 : 0;
          state.boost += (boostTarget - state.boost) * (1 - Math.exp(-dt / (boostTarget > state.boost ? 0.18 : 0.5)));
          state.flash *= Math.exp(-dt / 0.22);

          state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / 0.45));
          let extra = 0;
          if (state.lap >= 0) {
            const before = ease(Math.min(1, state.lap / LAP));
            state.lap += dt;
            extra = (ease(Math.min(1, state.lap / LAP)) - before) * total * s.direction;
            if (state.lap >= LAP) state.lap = -1;
          }
          state.motion = state.velocity + extra / dt;
          state.phase = wrap(state.phase + state.velocity * dt + extra, total);

          const pace = Math.abs(state.motion) / Math.max(1, Math.abs(total / s.duration));
          if (s.sparkle && !reduce && state.reveal > 0.05) {
            state.emit += dt * (2 + 6 * Math.min(2, pace)) * s.stars;
            while (state.emit > 1) {
              state.emit -= 1;
              pointAt(shape, state.phase + Math.floor(Math.random() * s.stars) * spacing, point);
              spawnDust(point.x, point.y, point.nx, point.ny, state.motion);
            }
          }
          for (let i = dust.length - 1; i >= 0; i--) {
            const mote = dust[i];
            mote.age += dt;
            mote.x += mote.vx * dt;
            mote.y += mote.vy * dt;
            mote.vx *= Math.exp(-dt * 2.2);
            mote.vy *= Math.exp(-dt * 2.2);
            if (mote.age >= mote.life) dust.splice(i, 1);
          }
          for (let i = pulses.length - 1; i >= 0; i--) {
            pulses[i].age += dt;
            if (pulses[i].age >= 0.65) pulses.splice(i, 1);
          }

          draw(s, shape);

          const settling =
            Math.abs(revealTarget - state.reveal) > 0.002 ||
            Math.abs(boostTarget - state.boost) > 0.002 ||
            state.flash > 0.01 ||
            pulses.length > 0 ||
            dust.length > 0;
          const moving = Math.abs(state.motion) > 0.05 || cruise !== 0 || state.lap >= 0;
          const showing = state.reveal > 0.002 || revealTarget > 0;
          if (state.visible && (settling || (moving && showing) || state.hovered)) raf = requestAnimationFrame(frame);
        };

        const wake = () => {
          if (raf || !alive || !state.visible) return;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        };
        wakeRef.current = wake;

        const onEnter = event => {
          const s = settingsRef.current;
          [state.pointerX, state.pointerY] = local(event);
          state.hovered = true;
          if (s.hover === 'reveal' && state.reveal < 0.15) {
            state.phase = project(shapeFor(s), state.pointerX - s.thickness / 2, state.pointerY - s.thickness / 2);
            state.velocity = 0;
          }
          if (s.hover === 'lap' && state.lap < 0 && !reduce) state.lap = 0;
          wake();
        };
        const onLeave = () => {
          state.hovered = false;
          wake();
        };
        const pulse = origin => {
          if (!settingsRef.current.clickPulse) return;
          pulses.push({ origin, age: 0 });
          if (pulses.length > 4) pulses.shift();
          state.flash = 1;
          wake();
        };
        const onDown = event => {
          if (event.button !== 0 && event.pointerType === 'mouse') return;
          const s = settingsRef.current;
          const [x, y] = local(event);
          pulse(project(shapeFor(s), x - s.thickness / 2, y - s.thickness / 2));
        };
        const onClick = event => {
          if (event.detail === 0) pulse(state.phase);
        };
        const onFocus = () => {
          state.focused = root.matches(':focus-visible');
          if (state.focused && settingsRef.current.hover === 'lap' && state.lap < 0 && !reduce) state.lap = 0;
          wake();
        };
        const onBlur = () => {
          state.focused = false;
          wake();
        };

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(root);
        const visibility = new IntersectionObserver(entries => {
          state.visible = entries.some(entry => entry.isIntersecting);
          if (state.visible) wake();
        });
        visibility.observe(root);
        root.addEventListener('pointerenter', onEnter);
        root.addEventListener('pointerleave', onLeave);
        root.addEventListener('pointerdown', onDown);
        root.addEventListener('click', onClick);
        root.addEventListener('focus', onFocus);
        root.addEventListener('blur', onBlur);
        measure();

        return () => {
          alive = false;
          wakeRef.current = null;
          cancelAnimationFrame(raf);
          resizeObserver.disconnect();
          visibility.disconnect();
          root.removeEventListener('pointerenter', onEnter);
          root.removeEventListener('pointerleave', onLeave);
          root.removeEventListener('pointerdown', onDown);
          root.removeEventListener('click', onClick);
          root.removeEventListener('focus', onFocus);
          root.removeEventListener('blur', onBlur);
        };
      })();

      return {
        destroy() {
          cleanup?.();
          canvas.remove();
        }
      };
    };
  })();

  /* ===================================================================== */
  /* SpotlightCard — src/content/Components/SpotlightCard/SpotlightCard.jsx */
  /* ===================================================================== */
  const SpotlightCard = (() => {
    const THEMES = {
      dark: {
        surface: '#111111',
        border: 'rgba(255, 255, 255, 0.08)',
        shadow: '0 24px 48px -24px rgba(0, 0, 0, 0.6)',
        light: '#ffffff',
        fill: 1,
        edge: 1
      },
      light: {
        surface: '#ffffff',
        border: 'rgba(24, 24, 27, 0.1)',
        shadow: '0 1px 2px rgba(24, 24, 27, 0.04), 0 18px 40px -20px rgba(24, 24, 27, 0.16)',
        light: '#18181b',
        fill: 0.28,
        edge: 0.7
      }
    };

    const SHAPES = ['circle', 'beam'];

    const NOISE =
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const falloff = (color, softness) => {
      const soft = clamp(softness, 0, 1);
      const core = (1 - soft) ** 1.5 * 0.85;
      const stop = (alpha, at) =>
        `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
      const list = [stop(1, 0)];
      for (let i = 0; i <= 14; i++) {
        const t = core + ((1 - core) * i) / 14;
        const g = (t - core) / (1 - core);
        const smooth = 1 - g * g * (3 - 2 * g);
        const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
        list.push(stop(smooth + (glow - smooth) * soft, t));
      }
      return list.join(', ');
    };

    return function SpotlightCard(target, {
      children,
      className = '',
      style,
      spotlightColor,
      intensity = 0.15,
      spotlightSize = 240,
      softness = 0.7,
      shape = 'circle',
      borderGlow = 0.6,
      proximity = 80,
      smoothing = 0.3,
      ambient = false,
      flare = true,
      grain = 0,
      theme = 'dark',
      ...rest
    } = {}) {
      const rootRef = { current: null };
      const lightRef = { current: null };
      const grainRef = { current: null };
      const edgeRef = { current: null };
      const wakeRef = { current: null };
      const palette = THEMES[theme] ?? THEMES.dark;
      const color = spotlightColor ?? palette.light;
      const form = SHAPES.includes(shape) ? shape : 'circle';
      const settings = {
        shape: form,
        fill: falloff(color, softness),
        edge: falloff(color, 1),
        size: Math.max(20, spotlightSize),
        intensity: clamp(intensity, 0, 1) * palette.fill,
        borderGlow: clamp(borderGlow, 0, 1) * palette.edge,
        proximity: Math.max(0, proximity),
        smoothing: clamp(smoothing, 0, 1),
        ambient,
        flare,
        grain: clamp(grain, 0, 1)
      };
      const settingsRef = { current: settings };
      settingsRef.current = settings;

      // JSX: the target is the root; light + grain go behind the children, border + edge on top.
      target.classList.add('spotlight-card');
      addClasses(target, className);
      target.style.setProperty('--spotlight-card-surface', palette.surface);
      target.style.setProperty('--spotlight-card-border', palette.border);
      target.style.setProperty('--spotlight-card-shadow', palette.shadow);
      applyStyle(target, style);
      const lightNode = span('spotlight-card__light', { 'aria-hidden': 'true' });
      const grainNode = span('spotlight-card__grain', { 'aria-hidden': 'true' });
      grainNode.style.backgroundImage = NOISE;
      const borderNode = span('spotlight-card__border', { 'aria-hidden': 'true' });
      const edgeNode = span('spotlight-card__edge', { 'aria-hidden': 'true' });
      target.prepend(lightNode, grainNode);
      target.append(borderNode, edgeNode);
      rootRef.current = target;
      lightRef.current = lightNode;
      grainRef.current = grainNode;
      edgeRef.current = edgeNode;

      const cleanup = (() => {
        const root = rootRef.current;
        const light = lightRef.current;
        const noise = grainRef.current;
        const edge = edgeRef.current;
        if (!root || !light || !noise || !edge) return undefined;

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const state = { x: 0, y: 0, presence: 0, flare: 0, time: Math.random() * 60, pressed: false, visible: true };
        const pointer = { x: 0, y: 0, active: false };
        const drawn = { light: '', edge: '', noise: '' };
        let focus = null;
        let raf = 0;
        let last = 0;
        let alive = true;

        const gradient = (s, size, x, y, stops) => {
          if (s.shape === 'beam') {
            const reach = Math.max(size * 0.6, y + size * 0.55);
            return `radial-gradient(${(size * 0.55).toFixed(1)}px ${reach.toFixed(1)}px at ${x.toFixed(1)}px 0px, ${stops})`;
          }
          return `radial-gradient(circle ${size.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, ${stops})`;
        };

        const paint = s => {
          const size = s.size * (1 + 0.2 * state.flare);
          const boost = 1 + 0.7 * state.flare;
          const fill = gradient(s, size, state.x, state.y, s.fill);
          const rim = gradient(s, size * 0.6, state.x, s.shape === 'beam' ? 0 : state.y, s.edge);
          if (fill !== drawn.light) {
            drawn.light = fill;
            light.style.background = fill;
          }
          if (rim !== drawn.edge) {
            drawn.edge = rim;
            edge.style.background = rim;
          }
          light.style.opacity = String(Math.min(1, state.presence * s.intensity * boost));
          edge.style.opacity = String(Math.min(1, state.presence * s.borderGlow * boost));
          const grainy = s.grain > 0 ? gradient(s, size, state.x, state.y, '#000 0%, transparent 100%') : 'none';
          if (grainy !== drawn.noise) {
            drawn.noise = grainy;
            noise.style.webkitMaskImage = grainy;
            noise.style.maskImage = grainy;
          }
          noise.style.opacity = String(state.presence * s.grain);
        };

        const tick = now => {
          raf = 0;
          if (!alive) return;
          const s = settingsRef.current;
          const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
          last = now;
          const rect = root.getBoundingClientRect();
          let tx = state.x;
          let ty = state.y;
          let target = 0;
          if (focus && root.contains(focus)) {
            const box = focus.getBoundingClientRect();
            tx = box.left + box.width / 2 - rect.left;
            ty = box.top + box.height / 2 - rect.top;
            target = 1;
          } else if (pointer.active) {
            tx = pointer.x - rect.left;
            ty = pointer.y - rect.top;
            const gap = Math.hypot(Math.max(0, -tx, tx - rect.width), Math.max(0, -ty, ty - rect.height));
            if (gap === 0) target = 1;
            else if (s.proximity > 0) target = Math.max(0, 1 - gap / s.proximity) ** 2;
          }
          if (target < 0.6 && s.ambient && state.visible) {
            if (!reduce) state.time += dt;
            const drift = 0.6 - target;
            tx += (rect.width * (0.5 + 0.34 * Math.sin(state.time * 0.43)) - tx) * (drift / 0.6);
            ty += (rect.height * (0.5 + 0.3 * Math.sin(state.time * 0.61 + 1.3)) - ty) * (drift / 0.6);
            target = 0.6;
          }
          if (state.presence < 0.02 && target > 0 && !s.ambient) {
            state.x = tx;
            state.y = ty;
          }
          const follow = reduce || s.smoothing === 0 ? 1 : 1 - Math.exp(-dt / (0.015 + s.smoothing * 0.22));
          state.x += (tx - state.x) * follow;
          state.y += (ty - state.y) * follow;
          const fade = reduce ? 1 : 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
          state.presence += (target - state.presence) * fade;
          if (Math.abs(target - state.presence) < 0.002) state.presence = target;
          const press = state.pressed && s.flare && !reduce ? 1 : 0;
          state.flare += (press - state.flare) * (1 - Math.exp(-dt / (press ? 0.05 : 0.28)));
          if (Math.abs(press - state.flare) < 0.002) state.flare = press;
          paint(s);
          const moving = Math.abs(tx - state.x) > 0.1 || Math.abs(ty - state.y) > 0.1;
          const settled = !moving && state.presence === target && state.flare === press;
          if (!settled || (s.ambient && state.visible && !reduce)) raf = requestAnimationFrame(tick);
        };

        const wake = () => {
          if (raf || !alive) return;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        };
        wakeRef.current = wake;

        const onMove = event => {
          pointer.x = event.clientX;
          pointer.y = event.clientY;
          pointer.active = true;
          if (state.presence > 0 || settingsRef.current.proximity > 0 || root.contains(event.target)) wake();
        };
        const onOut = event => {
          if (event.relatedTarget) return;
          pointer.active = false;
          wake();
        };
        const onDown = event => {
          pointer.x = event.clientX;
          pointer.y = event.clientY;
          pointer.active = true;
          state.pressed = true;
          wake();
        };
        const onUp = event => {
          if (event.pointerType !== 'mouse') pointer.active = false;
          if (!state.pressed && event.pointerType === 'mouse') return;
          state.pressed = false;
          wake();
        };
        const onFocusIn = event => {
          if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
          focus = event.target;
          wake();
        };
        const onFocusOut = event => {
          if (root.contains(event.relatedTarget)) return;
          focus = null;
          wake();
        };
        const onScroll = () => {
          if (pointer.active || state.presence > 0) wake();
        };

        const observer = new IntersectionObserver(entries => {
          state.visible = entries.some(entry => entry.isIntersecting);
          if (state.visible) wake();
        });
        observer.observe(root);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        window.addEventListener('scroll', onScroll, { capture: true, passive: true });
        document.addEventListener('pointerout', onOut);
        root.addEventListener('pointerdown', onDown);
        root.addEventListener('focusin', onFocusIn);
        root.addEventListener('focusout', onFocusOut);
        wake();

        return () => {
          alive = false;
          cancelAnimationFrame(raf);
          observer.disconnect();
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          window.removeEventListener('scroll', onScroll, { capture: true });
          document.removeEventListener('pointerout', onOut);
          root.removeEventListener('pointerdown', onDown);
          root.removeEventListener('focusin', onFocusIn);
          root.removeEventListener('focusout', onFocusOut);
          wakeRef.current = null;
        };
      })();

      return {
        destroy() {
          cleanup?.();
          [lightNode, grainNode, borderNode, edgeNode].forEach(node => node.remove());
        }
      };
    };
  })();

  /* ===================================================================== */
  /* ClickSpark — src/content/Animations/ClickSpark/ClickSpark.jsx         */
  /* ===================================================================== */
  const ClickSpark = (() => {
    const EASINGS = {
      linear: t => t,
      'ease-in': t => t * t,
      'ease-out': t => 1 - Math.pow(1 - t, 3),
      'ease-in-out': t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      spring: t => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2)
    };

    const SHAPES = ['line', 'streak', 'dot', 'star'];
    const MAX_BURSTS = 32;
    const GRAVITY = 500;
    const REDUCED_MS = 320;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const smoothstep = (a, b, x) => {
      const t = clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };

    const toColors = value => {
      const list = (Array.isArray(value) ? value : [value]).filter(Boolean);
      return list.length ? list : ['#ffffff'];
    };

    const starPath = (ctx, x, y, radius, rotation) => {
      const pinch = radius * 0.16;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(rotation) * radius, y + Math.sin(rotation) * radius);
      for (let i = 1; i <= 4; i++) {
        const a = rotation + (i * Math.PI) / 2;
        const mid = a - Math.PI / 4;
        ctx.quadraticCurveTo(
          x + Math.cos(mid) * pinch,
          y + Math.sin(mid) * pinch,
          x + Math.cos(a) * radius,
          y + Math.sin(a) * radius
        );
      }
      ctx.closePath();
    };

    const channels = (ctx, color) => {
      ctx.fillStyle = color;
      const normal = String(ctx.fillStyle);
      const hex = /^#([0-9a-f]{6})$/i.exec(normal);
      if (hex) {
        const value = parseInt(hex[1], 16);
        return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
      }
      const rgb = /^rgba?\(([^)]+)\)$/i.exec(normal);
      if (rgb)
        return rgb[1]
          .split(',')
          .slice(0, 3)
          .map(part => parseFloat(part));
      return [0, 0, 0];
    };

    return function ClickSpark(target, {
      sparkColor = '#fff',
      sparkSize = 14,
      sparkRadius = 30,
      sparkCount = 8,
      sparkWidth = 2,
      duration = 500,
      easing = 'ease-out',
      extraScale = 1,
      shape = 'line',
      randomness = 0.2,
      gravity = 0,
      spread = 360,
      direction = 0,
      glow = 0,
      ring = false,
      layer = 'front',
      disabled = false,
      className = '',
      style,
      children
    } = {}) {
      const rootRef = { current: null };
      const layerRef = { current: null };
      const engineRef = { current: null };
      const settings = {
        colors: toColors(sparkColor),
        size: Math.max(0, sparkSize),
        radius: Math.max(0, sparkRadius) * Math.max(0, extraScale),
        count: clamp(Math.round(sparkCount), 1, 64),
        width: Math.max(0.5, sparkWidth),
        duration: Math.max(60, duration),
        ease: EASINGS[easing] ?? EASINGS['ease-out'],
        shape: SHAPES.includes(shape) ? shape : 'line',
        randomness: clamp(randomness, 0, 1),
        gravity: Math.max(0, gravity),
        spread: clamp(spread, 0, 360),
        direction,
        glow: clamp(glow, 0, 1),
        ring,
        disabled
      };
      const settingsRef = { current: settings };
      settingsRef.current = settings;

      // JSX: the target wraps the content (React sets position/isolation on it)
      // and gets a pointer-transparent layer that holds one canvas per burst.
      addClasses(target, className);
      target.style.position = 'relative';
      target.style.isolation = 'isolate';
      applyStyle(target, style);
      const layerNode = span('', { 'aria-hidden': 'true' });
      Object.assign(layerNode.style, {
        position: 'absolute',
        inset: '0',
        zIndex: layer === 'back' ? '-1' : '1',
        overflow: 'visible',
        pointerEvents: 'none'
      });
      target.appendChild(layerNode);
      rootRef.current = target;
      layerRef.current = layerNode;

      const cleanup = (() => {
        const root = rootRef.current;
        const layer = layerRef.current;
        if (!root || !layer) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bursts = [];
        let raf = 0;
        let lastPress = { time: -1e9, x: 0, y: 0 };

        const drop = (s, seconds) => 0.5 * s.gravity * GRAVITY * seconds * seconds;

        const position = (burst, spark, distance, seconds) => [
          burst.x + Math.cos(spark.angle) * distance,
          burst.y + Math.sin(spark.angle) * distance + drop(burst.settings, seconds)
        ];

        const drawSpark = (ctx, burst, spark, elapsed) => {
          const s = burst.settings;
          const life = reduced ? REDUCED_MS : s.duration * spark.life;
          const p = elapsed / life;
          if (p >= 1) return false;
          const e = reduced ? 0.55 : s.ease(clamp(p, 0, 1));
          const seconds = reduced ? 0 : elapsed / 1000;
          const distance = s.radius * spark.reach * e;
          const width = s.width * spark.scale;
          const fade = reduced ? 1 - p : 1 - smoothstep(s.shape === 'line' ? 0.55 : 0.7, 1, p);
          if (fade <= 0) return true;
          ctx.strokeStyle = spark.color;
          ctx.fillStyle = spark.color;

          if (s.shape === 'line') {
            const length = s.size * spark.scale * (reduced ? 0.5 : Math.pow(1 - p, 1.6));
            const [x1, y1] = position(burst, spark, distance, seconds);
            const [x2, y2] = position(burst, spark, distance + Math.max(0.01, length), seconds);
            ctx.lineCap = 'round';
            if (spark.glow > 0) {
              ctx.globalAlpha = fade * 0.14 * spark.glow;
              ctx.lineWidth = width * 4.5;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
            ctx.globalAlpha = fade;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            return true;
          }

          if (s.shape === 'streak') {
            const lag = reduced ? 0 : Math.min(elapsed, 70 + s.size * 4 * spark.scale);
            const back = reduced ? 0.4 : s.ease(clamp((elapsed - lag) / life, 0, 1));
            const [hx, hy] = position(burst, spark, distance, seconds);
            const [tx, ty] = position(burst, spark, s.radius * spark.reach * back, Math.max(0, seconds - lag / 1000));
            const dx = hx - tx;
            const dy = hy - ty;
            const length = Math.hypot(dx, dy) || 1;
            const nx = (-dy / length) * width * 0.5;
            const ny = (dx / length) * width * 0.5;
            const paint = (spreadWidth, alpha) => {
              const gradient = ctx.createLinearGradient(tx, ty, hx, hy);
              gradient.addColorStop(0, spark.clear);
              gradient.addColorStop(1, spark.color);
              ctx.globalAlpha = alpha;
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.moveTo(tx, ty);
              ctx.lineTo(hx + nx * spreadWidth, hy + ny * spreadWidth);
              ctx.lineTo(hx - nx * spreadWidth, hy - ny * spreadWidth);
              ctx.closePath();
              ctx.fill();
              ctx.fillStyle = spark.color;
              ctx.beginPath();
              ctx.arc(hx, hy, width * 0.5 * spreadWidth, 0, Math.PI * 2);
              ctx.fill();
            };
            if (spark.glow > 0) paint(3.2, fade * 0.16 * spark.glow);
            paint(1, fade);
            return true;
          }

          if (s.shape === 'dot') {
            const [x, y] = position(burst, spark, distance, seconds);
            const radius = width * 1.25 * (1 - 0.5 * e);
            if (spark.glow > 0) {
              ctx.globalAlpha = fade * 0.18 * spark.glow;
              ctx.beginPath();
              ctx.arc(x, y, radius * 2.6, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = fade;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            return true;
          }

          const [x, y] = position(burst, spark, distance, seconds);
          const twinkle = reduced ? 1 - p : Math.pow(Math.sin(Math.PI * clamp(p * 1.1, 0, 1)), 0.7);
          const radius = s.size * 0.6 * spark.scale * twinkle;
          const rotation = spark.angle + spark.spin * p * Math.PI * 0.5;
          if (radius <= 0.05) return true;
          if (spark.glow > 0) {
            ctx.globalAlpha = fade * 0.2 * spark.glow;
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = fade;
          starPath(ctx, x, y, radius, rotation);
          ctx.fill();
          return true;
        };

        const drawRing = (ctx, burst, elapsed) => {
          const s = burst.settings;
          const life = reduced ? REDUCED_MS : s.duration * 0.8;
          const p = elapsed / life;
          if (p >= 1) return false;
          const radius = 2 + s.radius * 0.6 * (reduced ? 0.6 : EASINGS['ease-out'](p));
          ctx.globalAlpha = Math.pow(1 - p, 2) * 0.7;
          ctx.strokeStyle = burst.sparks[0]?.color ?? s.colors[0];
          ctx.lineWidth = Math.max(0.5, s.width * (1 - p) * 0.9);
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          return true;
        };

        const remove = burst => {
          burst.canvas.remove();
          const index = bursts.indexOf(burst);
          if (index >= 0) bursts.splice(index, 1);
        };

        const frame = now => {
          raf = 0;
          for (const burst of [...bursts]) {
            const elapsed = now - burst.start;
            const ctx = burst.ctx;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, burst.canvas.width, burst.canvas.height);
            ctx.setTransform(burst.ratio, 0, 0, burst.ratio, -burst.left * burst.ratio, -burst.top * burst.ratio);
            let alive = false;
            if (burst.settings.ring && drawRing(ctx, burst, elapsed)) alive = true;
            for (const spark of burst.sparks) {
              if (drawSpark(ctx, burst, spark, elapsed)) alive = true;
            }
            ctx.globalAlpha = 1;
            if (!alive) remove(burst);
          }
          if (bursts.length) raf = requestAnimationFrame(frame);
        };

        const spawn = (clientX, clientY) => {
          const s = settingsRef.current;
          if (s.disabled) return;
          const rect = root.getBoundingClientRect();
          const offset = Math.floor(Math.random() * s.colors.length);
          const full = s.spread >= 359.5;
          const arc = (s.spread * Math.PI) / 180;
          const heading = ((s.direction - 90) * Math.PI) / 180;
          const step = full ? (Math.PI * 2) / s.count : s.count > 1 ? arc / (s.count - 1) : 0;
          const sparks = Array.from({ length: s.count }, (_, i) => {
            const base = full ? heading + step * i : s.count > 1 ? heading - arc / 2 + step * i : heading;
            const jitter = (Math.random() - 0.5) * s.randomness;
            return {
              angle: base + jitter * (step || arc || 1) * 0.9,
              reach: 1 + (Math.random() - 0.5) * 0.7 * s.randomness,
              scale: 1 + (Math.random() - 0.5) * 0.8 * s.randomness,
              life: 1 + (Math.random() - 0.5) * 0.5 * s.randomness,
              spin: Math.random() - 0.5,
              color: s.colors[(i + offset) % s.colors.length],
              clear: '',
              glow: 0
            };
          });
          const longest = s.duration * (1 + 0.25 * s.randomness);
          const fall = drop(s, longest / 1000);
          const reach =
            s.radius * (1 + 0.35 * s.randomness) * (s.ease === EASINGS.spring ? 1.15 : 1) +
            s.size * (1 + 0.4 * s.randomness) +
            s.width * (s.glow > 0 ? 6 : 2) +
            6;
          const box = {
            left: Math.max(clientX - reach, 0),
            top: Math.max(clientY - reach, 0),
            right: Math.min(clientX + reach, window.innerWidth),
            bottom: Math.min(clientY + reach + fall, window.innerHeight)
          };
          if (box.right - box.left < 1 || box.bottom - box.top < 1) return;
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil((box.right - box.left) * ratio);
          canvas.height = Math.ceil((box.bottom - box.top) * ratio);
          Object.assign(canvas.style, {
            position: 'absolute',
            left: `${box.left - rect.left}px`,
            top: `${box.top - rect.top}px`,
            width: `${box.right - box.left}px`,
            height: `${box.bottom - box.top}px`,
            display: 'block',
            pointerEvents: 'none'
          });
          canvas.setAttribute('aria-hidden', 'true');
          layer.appendChild(canvas);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            canvas.remove();
            return;
          }
          for (const spark of sparks) {
            const [r, g, b] = channels(ctx, spark.color);
            spark.clear = `rgba(${r}, ${g}, ${b}, 0)`;
            spark.glow = s.glow * (0.35 + 0.65 * ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255));
          }
          bursts.push({
            x: clientX,
            y: clientY,
            start: performance.now(),
            sparks,
            settings: { ...s },
            canvas,
            ctx,
            ratio,
            left: box.left,
            top: box.top
          });
          while (bursts.length > MAX_BURSTS) remove(bursts[0]);
          if (!raf) raf = requestAnimationFrame(frame);
        };

        const onPointerDown = event => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          lastPress = { time: performance.now(), x: event.clientX, y: event.clientY };
          spawn(event.clientX, event.clientY);
        };

        const onClick = event => {
          if ('pointerType' in event && event.pointerType === 'mouse') return;
          if (event.detail === 0) {
            const target = event.target instanceof Element ? event.target : root;
            const rect = target.getBoundingClientRect();
            spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
            return;
          }
          const recent =
            performance.now() - lastPress.time < 700 &&
            Math.hypot(event.clientX - lastPress.x, event.clientY - lastPress.y) < 12;
          if (!recent) spawn(event.clientX, event.clientY);
        };

        root.addEventListener('pointerdown', onPointerDown);
        root.addEventListener('click', onClick);

        engineRef.current = {
          spark: (x, y) => {
            const rect = root.getBoundingClientRect();
            spawn(rect.left + (x ?? rect.width / 2), rect.top + (y ?? rect.height / 2));
          }
        };

        return () => {
          cancelAnimationFrame(raf);
          root.removeEventListener('pointerdown', onPointerDown);
          root.removeEventListener('click', onClick);
          for (const burst of [...bursts]) remove(burst);
          engineRef.current = null;
        };
      })();

      return {
        spark: (x, y) => engineRef.current?.spark(x, y),
        destroy() {
          cleanup?.();
          layerNode.remove();
        }
      };
    };
  })();

  /* ===================================================================== */
  /* CountUp — src/content/TextAnimations/CountUp/CountUp.jsx              */
  /* Simplified port: the classic counting mode with the 'expo' and         */
  /* 'linear' easings; the rolling-digit mode is not ported.                */
  /* ===================================================================== */
  const CountUp = (() => {
    const EASINGS = {
      linear: t => t,
      expo: t => (t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10)))
    };

    const getDecimalPlaces = num => {
      const str = num.toString();

      if (str.includes('.')) {
        const decimals = str.split('.')[1];

        if (parseInt(decimals) !== 0) {
          return decimals.length;
        }
      }

      return 0;
    };

    return function CountUp(target, {
      to,
      from = 0,
      direction = 'up',
      delay = 0,
      duration = 2,
      startWhen = true,
      separator = '',
      prefix = '',
      suffix = '',
      easing = 'expo',
      onStart,
      onEnd
    } = {}) {
      const startValue = direction === 'down' ? to : from;
      const endValue = direction === 'down' ? from : to;
      const places = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
      const ease = EASINGS[easing] ?? EASINGS.expo;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      let raf = 0;
      let timer = 0;

      const format = value => {
        const fixed = Math.abs(value).toFixed(places);
        const [int, frac] = fixed.split('.');
        const grouped = separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int;
        return `${value < 0 ? '-' : ''}${prefix}${grouped}${frac ? `.${frac}` : ''}${suffix}`;
      };

      const play = () => {
        onStart?.();
        if (reduce) {
          target.textContent = format(endValue);
          onEnd?.();
          return;
        }
        const begin = performance.now();
        const frame = now => {
          const t = Math.min(1, (now - begin) / (Math.max(0.01, duration) * 1000));
          target.textContent = format(startValue + (endValue - startValue) * ease(t));
          if (t < 1) raf = requestAnimationFrame(frame);
          else onEnd?.();
        };
        raf = requestAnimationFrame(frame);
      };

      target.textContent = format(startValue);
      const observer = new IntersectionObserver(
        entries => {
          if (!startWhen || !entries.some(entry => entry.isIntersecting)) return;
          observer.disconnect();
          timer = setTimeout(play, delay * 1000);
        },
        { threshold: 0.3 }
      );
      observer.observe(target);

      return {
        destroy() {
          observer.disconnect();
          clearTimeout(timer);
          cancelAnimationFrame(raf);
          target.textContent = format(endValue);
        }
      };
    };
  })();

  global.ReactBits = {
    ClickSpark,
    CountUp,
    DarkVeil,
    DecryptedText,
    ElectricBorder,
    GradientText,
    ShinyText,
    SpotlightCard,
    StarBorder
  };
})(window);
