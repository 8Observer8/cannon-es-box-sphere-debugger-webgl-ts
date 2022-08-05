import { gl, initWebGLContext } from "./webgl-context";
import * as CANNON from "cannon-es";
import { mat4, quat } from "gl-matrix";
import { createProgram } from "./shader-progrram";
import DebugDrawer from "./debug-drawer";
import { initVertexBuffers } from "./vertex-buffer";
import Object3D from "./object3d";
import ColliderEdge from "./collider-edge";
import Collider from "./collider";

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.8, 0) });
let debugDrawer: DebugDrawer;

const projViewMatrix = mat4.create();
const projMatrix = mat4.create();
let viewMatrix = mat4.create();
mat4.lookAt(viewMatrix, [1, 5, 10], [0, 0, 0], [0, 1, 0]);

let player: Object3D;
let playerCollider: Collider;

function animationLoop()
{
    requestAnimationFrame(animationLoop);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.mul(projViewMatrix, projMatrix, viewMatrix);
    player.draw(projViewMatrix);
    debugDrawer.update();
}

async function init()
{
    if (!initWebGLContext("renderCanvas")) return;

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const playerImage = document.getElementById("playerImage") as HTMLImageElement;
    const playerTexture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, playerTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, playerImage);

    let response = await fetch("assets/shaders/default.vert");
    const defaultVertShaderSrc = await response.text();
    response = await fetch("assets/shaders/default.frag");
    const defaultFragShaderSrc = await response.text();
    const defaultProgram = createProgram(defaultVertShaderSrc, defaultFragShaderSrc);
    if (!defaultProgram) return;

    response = await fetch("assets/shaders/lightless.vert");
    const lightlessVertShaderSrc = await response.text();
    response = await fetch("assets/shaders/lightless.frag");
    const lightlessFragShaderSrc = await response.text();
    const lightlessProgram = createProgram(lightlessVertShaderSrc, lightlessFragShaderSrc);
    if (!lightlessProgram) return;

    initVertexBuffers("assets/models/", ["player.dae", "cube.dae"], (vb, nb, tb, amounts) =>
    {
        player = new Object3D(defaultProgram, [0, 0, 0], quat.create(), [1, 1, 1], amounts[0], vb[0], nb[0], tb[0], playerTexture);
        // const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        const shape = new CANNON.Sphere(1);
        playerCollider = new Collider("player", [0, 0, 0], quat.create(), shape, 0, world);

        const colliderEdge = new ColliderEdge(lightlessProgram, amounts[1], vb[1]);
        debugDrawer = new DebugDrawer(world, colliderEdge);
        debugDrawer.viewMatrix = viewMatrix;

        onResize();
        animationLoop();
    });

    function onResize()
    {
        const w = gl.canvas.clientWidth;
        const h = gl.canvas.clientHeight;
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        mat4.perspective(projMatrix, 55 * Math.PI / 180, w / h, 0.1, 500);
        if (debugDrawer)
        {
            debugDrawer.projMatrix = projMatrix;
        }
    }

    window.onresize = () =>
    {
        onResize();
    };
}

init();
