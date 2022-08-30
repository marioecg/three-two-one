uniform float uTime;
uniform float uFreq;
uniform float uAmp;
uniform float uProgress;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    gl_FragColor = vec4(uv, uFreq, 1.0);
}