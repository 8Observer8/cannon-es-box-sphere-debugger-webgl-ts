import * as CANNON from "cannon-es";
import { quat, vec3 } from "gl-matrix";

export default class Collider
{
    public name: string;
    public position: vec3;
    public rotation: quat;

    public body: CANNON.Body;

    public constructor(name: string, position: vec3, rotation: quat,
        shape: CANNON.Shape, mass: number, world: CANNON.World)
    {
        this.name = name;
        this.position = position;
        this.rotation = rotation;

        this.body = new CANNON.Body({ mass: mass });
        this.body.addShape(shape);
        this.body.position.set(position[0], position[1], position[2]);
        this.body.quaternion.set(rotation[0], rotation[1], rotation[2], rotation[3]);
        world.addBody(this.body);
    }

    // public update()
    // {
    //     this.position[0] = this._body.position.x;
    //     this.position[1] = this._body.position.y;
    //     this.position[2] = this._body.position.z;

    //     this.rotation[0] = this._body.quaternion.x;
    //     this.rotation[1] = this._body.quaternion.y;
    //     this.rotation[2] = this._body.quaternion.z;
    //     this.rotation[3] = this._body.quaternion.w;
    // }
}
