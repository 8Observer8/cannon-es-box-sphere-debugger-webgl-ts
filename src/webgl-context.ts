export let gl: WebGLRenderingContext;

export function initWebGLContext(canvasName)
{
    const canvas = document.getElementById(canvasName);
    if (canvas === null)
    {
        console.log(`Failed to get a canvas element with the name "${canvasName}"`);
        return false;
    }
    gl = (canvas as HTMLCanvasElement).getContext("webgl", { alpha: false, premultipliedAlpha: false }) as WebGLRenderingContext;

    return true;
}
