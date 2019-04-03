import Joystick from "./Joystick";
import Snake from "./Snake";

const {ccclass, property} = cc._decorator;

@ccclass
export default class main extends cc.Component {

    @property(cc.Prefab)
    playerPre: cc.Prefab = null;

    @property(cc.Prefab)
    joystickPre: cc.Prefab = null;

    @property(Number)
    speed: number = 0;

    @property(cc.Node)
    food: cc.Node = null;

    joystick: Joystick;

    player: Snake;

    snakeParts:Snake[]=[];

    onLoad() {
        //碰撞监听开启
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //初始化摇杆
        this.joystick = cc.instantiate(this.joystickPre).getComponent("Joystick") as Joystick;
        this.joystick.node.setParent(this.node);
        this.joystick.node.setPosition(cc.v2(-this.node.width / 2 + this.joystick.node.width, -212));
        this.joystick.node.zIndex = -1;

        this.player = this.addSnakePart();
        this.player.getComponent(cc.BoxCollider).enabled=true;
        this.player.node.setPosition(0,0);
        this.player.mains=this;
        this.randomFoodPos();
    }

    /**
     * 随机生成food的位置
     */
   public  randomFoodPos(){
      let withlenth=this.node.width/2-this.food.width/2;
      let heightlenth=this.node.height/2-this.food.width/2;
      let posX=Math.floor(Math.random()*(withlenth+withlenth+1)-withlenth);
      let posY=Math.floor(Math.random()*(heightlenth+heightlenth+1)-heightlenth);
      console.log("x="+posX,"y="+posY);
      this.food.setPosition(cc.v2(posX,posY));
    }

    public  addSnakePart():Snake{
       console.log(this.snakeParts);
        let snake = cc.instantiate(this.playerPre).getComponent("Snake") as Snake;
        snake.getComponent(cc.BoxCollider).enabled=false;
        snake.node.setParent(this.node);
        snake.node.setPosition(cc.v2(-800,-800));

        if(this.snakeParts.length>0){
            this.snakeParts[this.snakeParts.length-1].child=snake;
            if (this.snakeParts.length>1){
                this.snakeParts[this.snakeParts.length -1 ].node.color = cc.Color.WHITE;
            }

        }

        this.snakeParts.push(snake);
        return snake;
    }


    update(dt: number) {
        let moveDic = Joystick.GetDirVecByDir(this.joystick.direction);
        let distance = this.speed * dt; //每次移動距離
        let moveVec = moveDic.mul(distance);
        //this.player.node.position = this.player.node.position.add(moveVec);
        let newPos=this.player.node.position.add(moveVec);
        let a=this.node.width/2-this.player.node.width/2;
        let b=this.node.height/2-this.player.node.height/2;
        if(parseInt(newPos.x.toString())==parseInt(a.toString())){
            newPos.x=this.node.width/2-this.player.node.width/2
        }
        this.player.move(newPos);

    }
}
