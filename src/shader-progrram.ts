import { gl } from "./webgl-context";

export function createProgram(vertShaderSource: string, fragShaderSource: string): WebGLProgram | null
{
    const vShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(vShader, vertShaderSource);
    gl.compileShader(vShader);
    let ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
    if (!ok)
    {
        console.log("vert: " + gl.getShaderInfoLog(vShader));
        return null;
    };

    const fShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fShader, fragShaderSource);
    gl.compileShader(fShader);
    ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
    if (!ok)
    {
        console.log("frag: " + gl.getShaderInfoLog(fShader));
        return null;
    };

    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    ok = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!ok)
    {
        console.log("link: " + gl.getProgramInfoLog(program));
        return null;
    };
    gl.useProgram(program);

    return program;
}
