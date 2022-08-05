import { mat4, quat, vec3 } from "gl-matrix";
import CannonDebugger from "./cannon-debugger";
import * as CANNON from "cannon-es";
import ColliderEdge from "./collider-edge";

export default class DebugDrawer
{
    public projMatrix: mat4;
    public viewMatrix: mat4;
    public debugMode = 1; // 0 - 0ff, 1 - on

    private _edgeObject: ColliderEdge;
    private _cannonDebugger: CannonDebugger;
    private _unitX = vec3.fromValues(1, 0, 0);
    private _tempVec = vec3.create();
    private _projViewMatrix = mat4.create();

    public constructor(world: CANNON.World, edgeObject: ColliderEdge)
    {
        this._edgeObject = edgeObject;
        this._cannonDebugger = new CannonDebugger(world);

        this._cannonDebugger.drawLine = (from: CANNON.Vec3, to: CANNON.Vec3, color: CANNON.Vec3) =>
        {
            let centerX: number;
            let centerY: number;
            let centerZ: number;

            if (from.x > to.x)
            {
                centerX = to.x + Math.abs(from.x - to.x) / 2;
            }
            else
            {
                centerX = from.x + Math.abs(to.x - from.x) / 2;
            }

            if (from.y > to.y)
            {
                centerY = to.y + Math.abs(from.y - to.y) / 2;
            }
            else
            {
                centerY = from.y + Math.abs(to.y - from.y) / 2;
            }

            if (from.z > to.z)
            {
                centerZ = to.z + Math.abs(from.z - to.z) / 2;
            }
            else
            {
                centerZ = from.z + Math.abs(to.z - from.z) / 2;
            }

            this._tempVec[0] = to.x - from.x;
            this._tempVec[1] = to.y - from.y;
            this._tempVec[2] = to.z - from.z;
            const length = vec3.length(this._tempVec);
            vec3.normalize(this._tempVec, this._tempVec);

            quat.rotationTo(this._edgeObject.rotation, this._unitX, this._tempVec);
            this._edgeObject.scale[0] = length;
            this._edgeObject.scale[1] = 0.08;
            this._edgeObject.scale[2] = 0.08;
            this._edgeObject.position[0] = centerX;
            this._edgeObject.position[1] = centerY;
            this._edgeObject.position[2] = centerZ;

            mat4.mul(this._projViewMatrix, this.projMatrix, this.viewMatrix);
            this._edgeObject.draw(this._projViewMatrix);
        };
    }

    public update()
    {
        this._cannonDebugger.update();
    }
}
