// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import main from "./main";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Snake extends cc.Component {


    mains:main;

    child:Snake = null;

    poss:cc.Vec2[] = [];
    long:number = 8;

    onLoad () {


    }
    start () {

    }
    onCollisionEnter(other, self){
         this.mains.randomFoodPos();
         this.mains.addSnakePart();
    }

    move(pos:cc.Vec2)
    {
        this.node.setPosition(pos);
        if(this.poss.length > this.long)
        {
            if(this.child != undefined)
            {
                this.child.move(this.poss.shift());
            }else{
                this.poss.shift()
            }
        }
        this.poss.push(pos);
    }

    // update (dt) {}
}
