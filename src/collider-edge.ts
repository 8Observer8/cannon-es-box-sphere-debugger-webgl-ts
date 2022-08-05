import { mat4, quat, vec3 } from "gl-matrix";
import { gl } from "./webgl-context";

export default class ColliderEdge
{
    public position = vec3.fromValues(0, 0, 0);
    public rotation = quat.create();
    public scale = vec3.fromValues(1, 1, 1);

    private _amountOfVertices: number;
    private _vertPosBuffer: WebGLBuffer;

    private _mvpMatrix = mat4.create();
    private _modelMatrix = mat4.create();

    private _program: WebGLProgram;
    private _uMvpMatrixLocation: WebGLUniformLocation | null;

    private _aPositionLocation: number;

    public constructor(program: WebGLProgram, amountOfVertices: number, vertPosBuffer: WebGLBuffer)
    {
        this._program = program;

        this._amountOfVertices = amountOfVertices;
        this._vertPosBuffer = vertPosBuffer;

        gl.useProgram(program);
        this._uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this._aPositionLocation = gl.getAttribLocation(program, "aPosition");
        if (this._aPositionLocation < 0)
        {
            console.log("Failed to get an attribute location");
            return;
        }
    }
    
    public draw(projViewMatrix: mat4)
    {
        gl.useProgram(this._program);

        mat4.fromRotationTranslationScale(this._modelMatrix, this.rotation, this.position, this.scale);
        mat4.mul(this._mvpMatrix, projViewMatrix, this._modelMatrix);
        gl.uniformMatrix4fv(this._uMvpMatrixLocation, false, this._mvpMatrix);

        this.bind();
        gl.drawArrays(gl.TRIANGLES, 0, this._amountOfVertices);
    }

    private bind()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertPosBuffer);
        gl.vertexAttribPointer( this._aPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray( this._aPositionLocation);
    }
}
