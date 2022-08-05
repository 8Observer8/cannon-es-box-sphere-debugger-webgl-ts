import { mat4, quat, vec3 } from "gl-matrix";
import { gl } from "./webgl-context";

export default class Object3D
{
    public position: vec3;
    public rotation: quat;
    public scale: vec3;

    public initialMatrix = mat4.create();
    public modelMatrix = mat4.create();
    // public animationMatrix = mat4.create();

    private _program: WebGLProgram;
    private _amountOfVertices: number;
    private _vertPosBuffer: WebGLBuffer;
    private _normalBuffer: WebGLBuffer;
    private _texCoordBuffer: WebGLBuffer;
    private _texture: WebGLTexture | null;
    private _animated: boolean;

    private _mvpMatrix = mat4.create();
    private _normalMatrix = mat4.create();
    // private tempRotationMatrix = mat4.create();

    private _uMvpMatrixLocation: WebGLUniformLocation | null;
    private _uModelMatrixLocation: WebGLUniformLocation | null;
    private _uNormalMatrixLocation: WebGLUniformLocation | null;

    private _lightPosition = vec3.fromValues(2, 3, 5);
    private _uLightPositionLocation: WebGLUniformLocation | null;

    private _aPositionLocation: number;
    private _aNormalLocation: number;
    private _aTexCoordLocation: number;

    public constructor(program: WebGLProgram, position: vec3, rotation: quat, scale: vec3,
        amountOfVertices: number, vertPosBuffer: WebGLBuffer, normalBuffer: WebGLBuffer,
        texCoordBuffer: WebGLBuffer, texture: WebGLTexture, animated = false)
    {
        this._program = program;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this._amountOfVertices = amountOfVertices;
        this._vertPosBuffer = vertPosBuffer;
        this._normalBuffer = normalBuffer;
        this._texCoordBuffer = texCoordBuffer;
        this._texture = texture;
        this._animated = animated;

        gl.useProgram(program);
        this._uLightPositionLocation = gl.getUniformLocation(program, "uLightPosition");
        this._uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this._uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        this._uNormalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");

        this._aPositionLocation = gl.getAttribLocation(program, "aPosition");
        this._aNormalLocation = gl.getAttribLocation(program, "aNormal");
        this._aTexCoordLocation = gl.getAttribLocation(program, "aTexCoord");
        if (this._aPositionLocation < 0 || this._aNormalLocation < 0 || this._aTexCoordLocation < 0)
        {
            console.log("Failed to get an attribute location");
            return;
        }
    }

    private bind(): void
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertPosBuffer);
        gl.vertexAttribPointer(this._aPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aPositionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);
        gl.vertexAttribPointer(this._aNormalLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aNormalLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._texCoordBuffer);
        gl.vertexAttribPointer(this._aTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._aTexCoordLocation);

        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }

    public draw(projViewMatrix: mat4): void
    {
        gl.useProgram(this._program);
        gl.uniform3fv(this._uLightPositionLocation, this._lightPosition);

        if (!this._animated)
        {
            mat4.fromRotationTranslationScale(this.modelMatrix, this.rotation, this.position, this.scale);
        }

        // mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        // mat4.fromQuat(this.tempRotationMatrix, this.rotation);
        // mat4.mul(this.modelMatrix, this.modelMatrix, this.tempRotationMatrix);
        // mat4.mul(this.modelMatrix, this.initialMatrix, this.modelMatrix);
        // mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

        // mat4.mul(this.modelMatrix, this.animationMatrix, this.modelMatrix);
        mat4.mul(this.modelMatrix, this.initialMatrix, this.modelMatrix);
        mat4.mul(this._mvpMatrix, projViewMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(this._uMvpMatrixLocation, false, this._mvpMatrix);
        gl.uniformMatrix4fv(this._uModelMatrixLocation, false, this.modelMatrix);

        mat4.invert(this._normalMatrix, this.modelMatrix);
        mat4.transpose(this._normalMatrix, this._normalMatrix);
        gl.uniformMatrix4fv(this._uNormalMatrixLocation, false, this._normalMatrix);

        this.bind();
        gl.drawArrays(gl.TRIANGLES, 0, this._amountOfVertices);
    }
}
