import * as CANNON from "cannon-es";

type ShapeInfo = {
    points: [number, number, number][],
    indices: [number, number][]
};

export default class CannonDebugger
{
    public drawLine: (from: CANNON.Vec3, to: CANNON.Vec3, color: CANNON.Vec3) => void;

    private _physicsWorld: CANNON.World;
    private _sphereInfo: ShapeInfo;

    public constructor(world: CANNON.World)
    {
        this._physicsWorld = world;

        this.drawLine = () => { };

        this._sphereInfo = {
            points: [
                [0, 1, 0]
            ],
            indices: [
                [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
                [0, 9], [0, 10], [0, 11], [0, 12], [1, 2], [2, 3], [3, 4], [4, 5],
                [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 1],
                [1, 13], [2, 14], [3, 15], [4, 16], [5, 17], [6, 18], [7, 19], [8, 20],
                [9, 21], [10, 22], [11, 23], [12, 24], [13, 14], [14, 15], [15, 16], [16, 17],
                [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 13],
                [13, 25], [14, 26], [15, 27], [16, 28], [17, 29], [18, 30], [19, 31], [20, 32],
                [21, 33], [22, 34], [23, 35], [24, 36], [25, 26], [26, 27], [27, 28], [28, 29],
                [29, 30], [30, 31], [31, 32], [32, 33], [33, 34], [34, 35], [35, 36], [36, 25],
                [25, 37], [26, 38], [27, 39], [28, 40], [29, 41], [30, 42], [31, 43], [32, 44],
                [33, 45], [34, 46], [35, 47], [36, 48], [37, 38], [38, 39], [39, 40], [40, 41],
                [41, 42], [42, 43], [43, 44], [44, 45], [45, 46], [46, 47], [47, 48], [48, 37],
                [37, 49], [38, 50], [39, 51], [40, 52], [41, 53], [42, 54], [43, 55], [44, 56],
                [45, 57], [46, 58], [47, 59], [48, 60], [49, 50], [50, 51], [51, 52], [52, 53],
                [53, 54], [54, 55], [55, 56], [56, 57], [57, 58], [58, 59], [59, 60], [60, 49],
                [49, 61], [50, 61], [51, 61], [52, 61], [53, 61], [54, 61], [55, 61], [56, 61],
                [57, 61], [58, 61], [59, 61], [60, 61]
            ]
        };

        for (let i = 1; i < 6; i++)
        {
            const phi = i * Math.PI / 6, sp = Math.sin(phi);
            for (let j = 0; j < 12; j++)
            {
                const theta = j * Math.PI / 6;
                this._sphereInfo.points.push([Math.sin(theta) * sp, Math.cos(phi), Math.cos(theta) * sp]);
            }
        }
        this._sphereInfo.points.push([0, -1, 0]);
    }

    private _boxInfo: ShapeInfo = {
        points: [
            [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1],
            [-1, -1, 1], [-1, -1, -1]
        ],
        indices: [
            [0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ]
    };

    private from = new CANNON.Vec3;
    private to = new CANNON.Vec3;
    private color = new CANNON.Vec3(0, 0, 1);

    private drawBox(body: CANNON.Body)
    {
        const shape = body.shapes[0] as CANNON.Box;

        const info = this._boxInfo;
        for (const index of info.indices)
        {
            let a = index[0], b = index[1];
            this.from.set(...info.points[a]);
            this.to.set(...info.points[b]);
            this.from.vmul(shape.halfExtents, this.from);
            this.to.vmul(shape.halfExtents, this.to);
            body.quaternion.vmult(this.from, this.from);
            body.quaternion.vmult(this.to, this.to);
            this.from.vadd(body.position, this.from);
            this.to.vadd(body.position, this.to);

            this.drawLine(this.from, this.to, this.color);
        }
    }

    private drawSphere(body: CANNON.Body)
    {
        const shape = body.shapes[0] as CANNON.Sphere;

        const info = this._sphereInfo;
        for (const index of info.indices)
        {
            let a = index[0], b = index[1];
            this.from.set(...info.points[a]);
            this.to.set(...info.points[b]);
            this.from.scale(shape.radius, this.from);
            this.to.scale(shape.radius, this.to);
            body.quaternion.vmult(this.from, this.from);
            body.quaternion.vmult(this.to, this.to);
            this.from.vadd(body.position, this.from);
            this.to.vadd(body.position, this.to);

            this.drawLine(this.from, this.to, this.color);
        }
    }

    public update()
    {
        for (const body of this._physicsWorld.bodies)
        {
            switch (body.shapes[0].type)
            {
                case CANNON.SHAPE_TYPES.BOX:
                    this.drawBox(body);
                    break;

                case CANNON.SHAPE_TYPES.SPHERE:
                    this.drawSphere(body);
                    break;
            }
        }
    }
}
