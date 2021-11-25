varying vec2 vUv;

uniform float u_time;

float randFloat(float x){
    return fract(sin(x) * 4748393.7585);
}

float randVec2(vec2 vUv){
    return fract(sin(dot(vUv.yx, vec2(48.48929, 76.83929))) * 727827.3738);
}

vec3 matrix(vec2 vUv){
    float rows = 75.0;
    vec2 a = floor(vUv * rows) + vec2(0.1, 0.4);
    a += vec2(.0, floor(u_time * 40. * randFloat(a.x)));
    vec2 b = fract(vUv * rows);
    vec2 newUv = 0.5 - b;
    float str = randVec2(a);
    float shape = (1. - dot(newUv, newUv) * 5.) * 1.0;
    return vec3(str * shape);
}

void main(){
    vec3 color = vec3(0.);
    vec3 m = matrix(vUv);
    color.g = m.x;
    gl_FragColor = vec4(color, 1.);
}