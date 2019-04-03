const {ccclass, property} = cc._decorator;


export enum Direction {
    IDLE, LEFT, UP, RIGHT, DOWN, LEFT_UP, RIGHT_UP, LEFT_DOWN, RIGHT_DOWN
}

export interface JoystickEvent {
    oldDir: Direction;
    newDir: Direction;
}

@ccclass
export default class Joystick extends cc.Component {


    @property({
        tooltip:'是否可以触摸点击'
    })
    private interactable = true;
    @property({
        tooltip: '是否固定位置'
    })
    private fixed = true;
    @property(cc.Node)
    private background: cc.Node = null
    @property(cc.Node)
    private bar: cc.Node = null;



    private radius: number; //摇杆背景的半径
    public direction = Direction.IDLE;  //移动方向
    private originPos: cc.Vec2;     //开始坐标


    start() {
        this.radius = this.background.width / 2;
        this.direction = Direction.IDLE;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.originPos = this.background.position;
    }
    private onTouchStart(event: cc.Event.EventTouch) {
        console.log("触摸到了");
        if (!this.interactable)return;
        if (!this.fixed) {
            this.background.position = this.node.convertToNodeSpaceAR(event.getLocation());
        } else {
            this.onTouchMove(event);
        }
    }

    private onTouchMove(event: cc.Event.EventTouch) {
        if (!this.interactable)return;
        let localPos = this.background.convertToNodeSpaceAR(event.getLocation());
        this.bar.position = localPos;
        let len = localPos.mag();
        if (len > this.radius) {
            localPos.mulSelf(this.radius / len);
        }
        this.bar.position = localPos;
        let newDir = Joystick.GetDirctionByAngle(localPos.signAngle(cc.v2(-1, 0)) * 180 / Math.PI);
        this.direction = newDir;
    }

    private onTouchEnd() {
        if (!this.interactable)return;
        this.direction = Direction.IDLE;
        this.bar.position = cc.v2();
        if (!this.fixed) {
            this.background.position = this.originPos;
        }
    }

    /**
     * 根据摇杆移动的角度得到移动方向
     * @param {number} angle  摇杆移动的角度
     * @returns {Direction} 返回反向枚举
     * @constructor
     */
    public static GetDirctionByAngle(angle: number) :Direction{
        if (angle >= -22.5 && angle < 22.5) {
            return Direction.LEFT;
        } else if (angle >= 22.5 && angle < 67.5) {
            return Direction.LEFT_UP;
        } else if (angle >= 67.5 && angle < 112.5) {
            return Direction.UP;
        } else if (angle >= 112.5 && angle < 157.5) {
            return Direction.RIGHT_UP;
        } else if (angle >= 157.5 || angle < -157.5) {
            return Direction.RIGHT;
        } else if (angle >= -157.5 && angle < -112.5) {
            return Direction.RIGHT_DOWN;
        } else if (angle >= -112.5 && angle < -67.5) {
            return Direction.DOWN;
        } else if (angle >= -67.5 && angle < -22.5) {
            return Direction.LEFT_DOWN;
        }
    }

    /**
     * 根据摇杆的移动防向得到初始移动的向量值
     * @param {Direction} dir 方向枚举
     * @returns {cc.Vec2}  移动向量值
     * @constructor
     */
    public static GetDirVecByDir(dir: Direction):cc.Vec2{
        switch (dir) {
            case Direction.LEFT:
                return cc.v2(-1, 0);
            case Direction.UP:
                return cc.v2(0, 1);
            case Direction.RIGHT:
                return cc.v2(1, 0);
            case Direction.DOWN:
                return cc.v2(0, -1);
            case Direction.LEFT_UP:
                return cc.v2(-1, 1).normalize();
            case Direction.RIGHT_UP:
                return cc.v2(1, 1).normalize();
            case Direction.RIGHT_DOWN:
                return cc.v2(1, -1).normalize();
            case Direction.LEFT_DOWN:
                return cc.v2(-1, -1).normalize();
            default:
                return cc.v2();
        }
    }
}
