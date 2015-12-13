var X = 0, Y = 1;
var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40;

function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max-min+1) + min));
}

var Fruit = function(){
    this.x = getRandomInt(1,10)*50;
    this.y = getRandomInt(1,10)*50;
    var x = this.x;
    var y = this.y;
    require(["dojo/dom-construct", "dojo/dom", "dojo/dom-style", "dojo/fx", "dojo/_base/window", "dojo/domReady!"], function(domConstruct, dom, domStyle, fx, win){
        var container = domConstruct.toDom("<div id = 'fruitContainer'></div>");
        domConstruct.place(container, win.body());
        var innerdiv = domConstruct.toDom("<div id = 'fruit'></div>");
        domConstruct.place(innerdiv,"fruitContainer");
        domStyle.set("fruitContainer", {position: "absolute", left: x+"px", top: y+"px"});
    });
};

Fruit.prototype.respawn = function(){
    this.x = getRandomInt(1,10)*50;
    this.y = getRandomInt(1,10)*50;
    var x = this.x;
    var y = this.y;
    require(["dojo/dom-style", "dojo/domReady!"], function(domStyle){
        domStyle.set("fruitContainer", {position: "absolute", left: x+"px", top: y+"px"});
    });
}

var fruit = new Fruit();

var Snake = function(startX, startY){
    console.log("new snake created");
    this.blocks = [];
    this.WIDTH = 50, this.HEIGHT = 50;
    this.snakeHead = [startX, startY];
    this.addBlock(this.snakeHead[0],this.snakeHead[1]);
    for(var i = 1; i <= 2; i++){
        this.addBlock(startX+(i*this.WIDTH),startY);
    }
    this.currentDirection = 0;
    this.isUpdated = true;
};

Snake.prototype.addBlock = function(x, y){
    this.blocks.push([x,y]);
    var len = this.blocks.length;
    require(["dojo/dom-construct", "dojo/dom", "dojo/dom-style", "dojo/fx", "dojo/_base/window", "dojo/domReady!"], function(domConstruct, dom, domStyle, fx, win){
        var container = domConstruct.toDom("<div id = 'container" + len +"'></div>");
        domConstruct.place(container, win.body());
        var innerdiv = domConstruct.toDom("<div id = 'block'></div>");
        domConstruct.place(innerdiv,"container"+len);
        domStyle.set("container"+len, {position: "absolute", left: x+"px", top: y+"px"});
    });
};

Snake.prototype.move = function (direction) {
    switch (direction) {
        case LEFT:
            if(this.currentDirection != RIGHT){
                this.pushSnake();
                this.currentDirection = LEFT;
                this.blocks[0][X] -= this.WIDTH;
                this.isUpdated = true;
            }
            break;
        case RIGHT:
            if(this.currentDirection != LEFT && this.currentDirection != 0){
                this.pushSnake();
                this.currentDirection = RIGHT;
                this.blocks[0][X] += this.WIDTH;
                this.isUpdated = true;
            }
            break;
        case UP:
            if(this.currentDirection != DOWN){
                this.pushSnake();
                this.currentDirection = UP;
                this.blocks[0][Y] -= this.HEIGHT;
                this.isUpdated = true;
            }
            break;
        case DOWN:
            if(this.currentDirection != UP){
                this.pushSnake();
                this.currentDirection = DOWN;
                this.blocks[0][Y] += this.HEIGHT;
                this.isUpdated = true;
            }
            break;
    }
    
};

Snake.prototype.pushSnake = function (){
    for(var i = this.blocks.length-1; i > 0; i--){
        this.blocks[i][X] = this.blocks[i-1][X];
        this.blocks[i][Y] = this.blocks[i-1][Y];
    };
};

Snake.prototype.redraw = function () {
    var x = this.snakeHead[0], y = this.snakeHead[1];
    var len = this.blocks.length;
    var blocks = this.blocks;
    require(["dojo/dom", "dojo/dom-style", "dojo/domReady!"], function(dom, domStyle){
        for(var i = 0; i < len; i++){
            domStyle.set("container" + (i+1), {position: "absolute", left: blocks[i][X] + "px", top: blocks[i][Y] + "px"});
        }
    });
};

Snake.prototype.update = function () {
    if(!this.isUpdated){
        this.move(this.currentDirection);
        require(["dojo/domReady!"], function (){
        });
        this.redraw();
    }
    this.isUpdated = false;
    if(this.blocks[0][X] == fruit.x && this.blocks[0][Y] == fruit.y){
        console.log("score++");
        fruit.respawn();
    }
}

var snake = new Snake(200, 200);

require(["dojo/on", "dojo/domReady!"], function (on) {
   on(document, "keypress", function (event) {
        if(event.keyCode == snake.currentDirection){
            return;
        }
        switch(event.keyCode){
            case LEFT:
                if(snake.currentDirection != RIGHT){
                    snake.currentDirection = event.keyCode;
                    snake.move(snake.currentDirection);
                    snake.redraw();
                    snake.isUpdated = true;
                }
                break;
            case RIGHT:
                if(snake.currentDirection != LEFT && snake.currentDirection != 0){
                    snake.currentDirection = event.keyCode;
                    snake.move(snake.currentDirection);
                    snake.redraw();
                    snake.isUpdated = true;
                }
                break;
            case UP:
                if(snake.currentDirection != DOWN){
                    snake.currentDirection = event.keyCode;
                    snake.move(snake.currentDirection);
                    snake.redraw();
                    snake.isUpdated = true;
                }
                break;
            case DOWN:
                if(snake.currentDirection != UP){
                    snake.currentDirection = event.keyCode;
                    snake.move(snake.currentDirection);
                    snake.redraw();
                    snake.isUpdated = true;
                }
                break;
        }
   });
});

setInterval(function(){snake.update()}, 70);
