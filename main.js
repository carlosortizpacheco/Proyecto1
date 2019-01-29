
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

window.onload = function() {
    start()
}



    //globales
let platforms=[]
let keys=[]
let beers=[]
let score=0;
let gravity=0.98;
let friction=.7;
let interval=0;
let frames=0;
let images={
    bgImage:"./images/bgPurple.png",
    pl1Image: "./images/player1standr.png",
    ghostImage:"./images/ghostr.png",
    heartImage:"./images/heart.png",
    throphyImage1:"./images/delgadina.png",
    throphyImage2:"./images/trophy.png",
    beerImage:"./images/beer.png"
}

let audios={
    mainAudio:"02.mp3"
} 


class Board{
    constructor(x=0,y=0,width=canvas.width,height=canvas.height,image=images.bgImage){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.image=new Image();
        this.image.src=image;
        this.image.onload = this.draw.bind(this);
    }
    
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}

class Delgadina{
    constructor(xC=100,yC=700){
        this.xS=0
        this.yS=0
        this.widthS=canvas.width
        this.heightS=canvas.height
        this.xC=xC
        this.yC=yC
        this.radio=40
    }
    draw(){
        
        ctx.fillStyle='#363636';
        ctx.fillRect(this.xS,this.yS,this.widthS,this.heightS);
        ctx.globalCompositeOperation='xor';
        ctx.beginPath();
        ctx.fillStyle='white';
        ctx.arc(this.xC,this.yC,this.radio,0,2*Math.PI);
        ctx.fill();
    }
    
}

class Player{
    constructor(){
        this.x=50;
        this.y= 685;
        this.width=25;
        this.height=50;
        this.vX=0;
        this.vY=0;
        this.speed=5;
        this.jumpingStrength=5;
        this.grounded=false;
        this.jumping=false;
        this.image= new Image();
        this.image.src=images.pl1Image;
        this.image.onload=this.draw.bind(this)
    }

    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    checkIfCollisionWithGhost (obstacle){
        return (
          anciano.x< obstacle.x + obstacle.width &&
          anciano.x + anciano.width > obstacle.x &&
          anciano.y < obstacle.y + obstacle.height &&
          anciano.y + anciano.height > obstacle.y
        )
}
                 
}

class Throphy{
    constructor(x=450, y=9, width=50, height=100, imagesrc=images.throphyImage1){
        this.x=x
        this.y=y
        this.width=width
        this.height=height
        this.image=new Image()
        this.image.src=imagesrc
        this.image.onload=this.draw.bind(this)
    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y, this.width,this.height)
    }
}

class Enemy{
    constructor(){
        this.x=800
        this.y=-40
        this.width=40
        this.height=40
        this.vX=0
        this.vY=0
        this.image= new Image()
        this.image.src=images.ghostImage
        this.image.onload=this.draw.bind(this)
    }

    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
    

}

class Heart{
    constructor(x=658){
        this.x=x
        this.y=18
        this.width=39
        this.height=39
        this.image=new Image()
        this.image.src=images.heartImage
        this.image.onload=this.draw.bind(this)
    }

    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }
}


class Obstacle{
    constructor(x=600,y=600,width=100,height=50){
        this.x=x
        this.y=y
        this.width=width
        this.height=height
    }
    draw(){
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}

class Miscelanea{
    constructor(x=0,y=0){
        this.x=x
        this.y=y
        this.width=25
        this.height=25
        this.image = new Image()
        this.image.src=images.beerImage
        this.image.onload=this.draw.bind(this)
    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }

    
}

//AUX FUNCTIONS
//LISTO
function time(){
    ctx.font="50px VT323"
    ctx.fillStyle="white"
    ctx.fillText(Math.floor(frames/60),20,50)
}

//LISTO 
function moveEnemy(){
    angle =Math.atan2(ghost.y-anciano.y,ghost.x-anciano.x)
    ghost.x -=Math.cos(angle)*.5
    ghost.y-=Math.sin(angle)*.5
}

//LISTO
function checkCollisionGhost(){
    if(anciano.checkIfCollisionWithGhost(ghost))
    gameOver()
}

//NO SALTA
function subir(){
    if(keys[38] || keys[32]){
        if(!anciano.jumping){
          anciano.vY = -anciano.jumpStrength*2
          anciano.jumping = true;
        }
    }
      
    if(keys[39]){
        if(anciano.vX < anciano.speed){
            anciano.vX++;
        }
    }
      
    if(keys[37]){
        if(anciano.vX > -anciano.speed){
          anciano.vX--;
        }
    }
      
    
    anciano.x +=anciano.vX;
    anciano.vX *= friction;
    
    anciano.y += anciano.vY;
    anciano.vY += gravity;
}

function escalar(){
    platforms=[obstacleI,obstacleD,obstacleB, obstacle1,obstacle2,obstacle3,obstacle4,obstacle5, obstacle6, obstacle7, obstacle8, obstacle9, obstacle10, obstacle11, obstacle12, obstacle13,obstacle14,obstacle15,obstacle16,obstacle17, obstacle18,obstacle19,obstacle20,obstacle21,obstacle22,obstacle23,obstacle24,obstacle25,obstacle26]
    anciano.grounded=false
    platforms.forEach(function(platform){
        let direction = collisionCheckPlatform(anciano,platform);
        if(direction == "left" || direction =="right"){
            anciano.vX=0;
        } else if(direction == "bottom"){
            anciano.grounded=true
        } else if (direction == "top"){
            anciano.vY *= -2
        }
    })
    if(anciano.grounded){
        anciano.vY=0
    }
}

    

//NO SALTA
function collisionCheckPlatform(player,platform){
    let vectorX = (player.x + (player.width/2)) - (platform.x + (platform.width/2));
    let vectorY = (player.y + (player.height/2)) - (platform.y + (platform.height/2));
    let halfWidths = (player.width/2) + (platform.width/2);
    let halfHeights = (player.height/2) + (platform.height/2);
    let collisionDirection = null;
  
    if(Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights){
        var offsetX = halfWidths - Math.abs(vectorX);
        var offsetY = halfHeights - Math.abs(vectorY);
        if(offsetX < offsetY){
            if(vectorX > 0){
                collisionDirection = "left";
                player.x += offsetX
            }else{
                collisionDirection = "right";
                player.x -= offsetX;
            }       
        }else{
            if(vectorY > 0){
                collisionDirection = "top";
            }else{
                collisionDirection = "bottom";
                player.y -= offsetY;
            }
        }   
    }
    return collisionDirection;
}


function scoreBeers(){
    beers=[beer0,beer1,beer2]
    beers.forEach((beer, index) => {
        if(anciano.checkIfCollisionWithGhost(beer)) {
          score ++
          beers.splice(index,1)
        }
      })
}



//Instancias
let board = new Board()
let gameover =new Board (150,100,500,500,images.gameOverImage) //GAMEOVER BITCH
let anciano = new Player()
let ghost = new Enemy()
let heart1 = new  Heart()
let heart2 = new Heart(698)
let heart3 = new Heart(738) 
let obstacle1 = new Obstacle(300,700,100,05)
let obstacle2 = new Obstacle(100,600,100,010)
let obstacle25 = new Obstacle(340,140,050,005) //elegirpremio
let obstacle3 = new Obstacle(420,100,100,005) //premiolove
let obstacle26 = new Obstacle(200,100,100,005) //premiomoney
let obstacle4 = new Obstacle(200,650,050,010)
let obstacle5 = new Obstacle(370,650,050,010)
let obstacle6 = new Obstacle(420,600,050,010)
let obstacle7 = new Obstacle(450,550,300,010)
let obstacle8 = new Obstacle(600,497,100,02) //
let obstacle9 = new Obstacle(500,500,050,010)
let obstacle10 = new Obstacle(440,485,040,01)
let obstacle11 = new Obstacle(410,485,040,010)
let obstacle27 = new Obstacle(390,485,040,010)
let obstacle12 = new Obstacle(300,470,040,010)
let obstacle13 = new Obstacle(240,440,040,010)
let obstacle14 = new Obstacle(000,440,200,010)
let obstacle15 = new Obstacle(80,400,040,010)
let obstacle16 = new Obstacle(150,370,040,010)
let obstacle17 = new Obstacle(200,340,100,02) //mediano
let obstacle19 = new Obstacle(320,340,50,005)
let obstacle18 = new Obstacle(400,340,350,2) //grande
let obstacle20 = new Obstacle(750,300,050,005)
let obstacle21 = new Obstacle(680,260,050,005)
let obstacle22 = new Obstacle(750,180,050,005) //sobron
let obstacle23 = new Obstacle(580,220,100,005)
let obstacle24 = new Obstacle(200,180,350,40)
let obstacleB = new Obstacle (0,735,canvas.width,10)
let obstacleI  = new Obstacle(-5,000,10,750)
let obstacleD  = new Obstacle(canvas.width-5,0,10,750)
let throphy = new Throphy()
let throphy2= new Throphy(225,60,50,50,images.throphyImage2)
let delgadina = new Delgadina()
let beer0 = new Miscelanea(5,415)
let beer1 = new Miscelanea(100,710)
let beer2 = new Miscelanea(755,154)

function start(){
    interval =setInterval(update,1000/60)   
}

function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    frames++
    board.draw()
    anciano.draw()
    obstacleB.draw()
    obstacleI.draw()
    obstacleD.draw()
    obstacle1.draw()
    obstacle2.draw()
    obstacle3.draw()
    obstacle4.draw()
    obstacle5.draw()
    obstacle6.draw()
    obstacle7.draw()
    obstacle8.draw()
    obstacle9.draw()
    obstacle10.draw()
    obstacle11.draw()
    obstacle12.draw()
    obstacle13.draw()
    obstacle14.draw()
    obstacle15.draw()
    obstacle16.draw()
    obstacle17.draw()
    obstacle18.draw()
    obstacle19.draw()
    obstacle20.draw()
    obstacle21.draw()
    obstacle22.draw()
    obstacle23.draw()
    obstacle24.draw()
    obstacle25.draw()
    obstacle26.draw()
    obstacle27.draw()
    throphy2.draw()
    throphy.draw()
    beer0.draw()
    beer1.draw()
    beer2.draw()
    delgadina.draw() // OJO DE THUNDERA
    checkCollisionGhost()
    subir()
    time()
    collisionCheckPlatform(anciano,platforms)
    escalar()
    heart1.draw()
    heart2.draw()
    heart3.draw()
    ghost.draw()
    moveEnemy()
    scoreBeers()
}


function gameOver(){
    clearInterval(interval)
    //gameOn = false
    //music.pause()
    //gameOverSound.play()
    //gameover.draw() //SE VE DE LA VERGA PORQUE LAS PLATFORMS DAÑAN LA IMAGEN
    ctx.font = "150px VT323"
    ctx.fillStyle = "red"
    ctx.fillText("GAME OVER", 150,330)
    //ctx.font = "20px Avenir"
    //ctx.fillStyle = "black"
    //ctx.fillText("Your score: " + coinScore, 170,240)
    //ctx.fillText("Space bar to start again", 140,280)
}


//listeners
  
addEventListener('keydown', e => {
    switch(e.key) {
        case "w":
            return anciano.y -= 75
        case "d":
            return anciano.x +=20 
        case  "a":
            return anciano.x -= 20
        case "ArrowUp":
            return anciano.y -=75
        case "ArrowLeft":
            return anciano.x -=20
        case "ArrowRight":
            return anciano.x +=20
    }
   
})

//LISTO
addEventListener("mousemove",e=>{
    delgadina.xC=e.clientX
    delgadina.yC=e.clientY
    distance = Math.sqrt(((e.clientX-ghost.x)*(e.clientX-ghost.x))+((e.clientY-ghost.y)*(e.clientY-ghost.y)))
    r1=delgadina.radio
    r2=ghost.width
    if(distance<=r1+r2){
        ghost.x=Math.random()*canvas.width
        ghost.y=Math.random()*canvas.height
      }

})

