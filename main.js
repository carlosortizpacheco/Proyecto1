
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")


/*window.onload = function() {
    start()
}*/

//GLOBALES
let platforms=[]
let keys=[]
let beers=[]
let score=0;
let gravity=0.95;
let friction=.7;
let interval=0;
let frames=0;
let regresive=5
let gameOn=false

let images={
    bgImage:"./images/bgPurple.png",
    pl1Image: "./images/player1standr.png",
    ghostImage:"./images/ghostr.png",
    heartImage:"./images/heart.png",
    throphyImage1:"./images/delgadinar.png",
    throphyImage2:"./images/trophy.png",
    beerImage:"./images/beer.png"
}

let audios={
    mainAudio:"./images/test.mp3"
} 


//CLASSES
class Board{
    constructor(x=0,y=0,width=canvas.width,height=canvas.height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        //this.image=new Image();
        //this.image.src=image;
        //this.image.onload = this.draw.bind(this);
    }
    
    draw(){
        ctx.fillRect(this.x,this.y,this.width,this.height);
        
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
        this.width=20;
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
    constructor(x=450, y=72, width=40, height=50, imagesrc=images.throphyImage1){
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
        this.y=-200
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

function audio(){
    let music = new Audio()
        music.src=audios.mainAudio
        music.loop=true
        document.body.appendChild(music)
}

//LISTO 
function moveEnemy(){
    angle =Math.atan2(ghost.y-anciano.y,ghost.x-anciano.x)
    ghost.x -=Math.cos(angle)*1
    ghost.y-=Math.sin(angle)*1
}

//LISTO
function checkCollisionGhost(){
    if(anciano.checkIfCollisionWithGhost(ghost))
    gameOver()
}

//LISTO
function subir(){
    if(keys[38]){
        if(!anciano.jumping){
          anciano.vY = -anciano.jumpStrength*3
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

//LISTO
function escalar(){
    platforms=[obstacle35,obstacle32, obstacle33, obstacle34, obstacle31, obstacle29,obstacle30,obstacle28,obstacle27,obstacleI,obstacleD,obstacleB, obstacle1,obstacle2,obstacle3,obstacle4,obstacle5, obstacle6, obstacle7, obstacle8, obstacle9, obstacle10, obstacle11, obstacle12, obstacle13,obstacle14,obstacle15,obstacle16,obstacle17, obstacle18,obstacle19,obstacle20,obstacle21,obstacle22,obstacle23,obstacle24,obstacle25,obstacle26]
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

//LISTO
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

//LISTO
function scoreDraw() {
    ctx.fillStyle="white"
    ctx.font = "50px VT323"
    ctx.fillText("SCORE: " + score, 350,400)
  }

//LISTO PERO ESTA MAL
function scoreBeers(){
    if(anciano.x >= beer1.x && anciano.y <= beer1.y) {
        beer1.x=-50
        score=1  
    }
    
    if (anciano.x>=beer0.x+beer0.width && anciano.y<=beer0.y && beer0.y>=anciano.y && anciano.x<50){
        beer0.x=-50
        score=2
    }
}

//LISTO PERO ESTA MAL, hay BUG
function checkCollisionThrophy(){
    if(anciano.y<=throphy.y && anciano.x>=throphy.x){
        clearInterval(interval)
        scoreDraw()
        ctx.font = "120px VT323"
        ctx.fillStyle = "red"
        ctx.fillText("TRUE LOVE WINS!!!", 0,330)
    } else if(anciano.x<=throphy2.x+throphy2.width && anciano.y<=throphy2.y){
        clearInterval(interval)
        scoreDraw()
        ctx.font = "110px VT323"
        ctx.fillStyle= "red"
        ctx.fillText("MONEY WINS!!!", 150,330)
    }
}

function mensaje(){
    if(gameOn=false){
        ctx.fillStyle="black"
        ctx.font = "100px VT323"
        ctx.fillText("ENTER", 265,300)
        ctx.fillText("PARA COMENZAR ", 115,400)
        ctx.font = "40px VT323"
        ctx.fillText("Recuerden solo juntos", 200,500)
        ctx.fillText("llegaran al final", 230,550)
    }
    
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
let obstacle3 = new Obstacle(395,120,100,005) //premiolove
let obstacle26 = new Obstacle(200,120,125,005) //premiomoney
let obstacle4 = new Obstacle(200,650,050,010)
let obstacle5 = new Obstacle(370,650,050,010)
let obstacle29 = new Obstacle(345,675,050,05)
let obstacle6 = new Obstacle(420,600,050,010)
let obstacle7 = new Obstacle(450,570,300,010)
let obstacle30 = new Obstacle(395,630,050,05)
let obstacle31 = new Obstacle(750,550,050,005)
let obstacle32 = new Obstacle (625,240,20,5) //escalones final
let obstacle33 = new Obstacle (605,230,20,5)
let obstacle34 = new Obstacle (580,220,20,5)
let obstacle35 = new Obstacle (555,210,20,5)
let obstacle8 = new Obstacle(635,525,100,02)
let obstacle9 = new Obstacle(500,497,118,010)
let obstacle10 = new Obstacle(465,485,040,01)
let obstacle11 = new Obstacle(410,480,48,010)
let obstacle27 = new Obstacle(370,485,040,001)
let obstacle28 = new Obstacle(340,485,030,010)
let obstacle12 = new Obstacle(300,470,040,010)
let obstacle13 = new Obstacle(240,450,070,070)
let obstacle14 = new Obstacle(000,440,235,010) //cerveza izquierda
let obstacle15 = new Obstacle(100,400,040,010)
let obstacle16 = new Obstacle(145,370,040,010)
let obstacle17 = new Obstacle(185,340,115,02) //mediano
let obstacle19 = new Obstacle(320,340,50,005)
let obstacle18 = new Obstacle(380,340,350,2) //grande
let obstacle20 = new Obstacle(740,320,050,005)
let obstacle21 = new Obstacle(690,280,045,005)
let obstacle22 = new Obstacle(750,180,050,005) //sobron
let obstacle23 = new Obstacle(580,260,100,005)
let obstacle24 = new Obstacle(200,180,350,40)
let obstacleB = new Obstacle (0,735,canvas.width,10)
let obstacleI  = new Obstacle(-5,000,10,750)
let obstacleD  = new Obstacle(canvas.width-5,0,10,750)
let throphy = new Throphy()
let throphy2= new Throphy(225,80,50,50,images.throphyImage2)
let delgadina = new Delgadina()
let beer0 = new Miscelanea(5,415)
let beer1 = new Miscelanea(100,710)
let beer2 = new Miscelanea(755,154)

function start(){
    gameOn=false
    interval =setInterval(update,1000/60)
    score=0
    mensaje()
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
    obstacle28.draw()
    obstacle29.draw()
    obstacle30.draw()
    obstacle31.draw()
    obstacle32.draw()
    obstacle33.draw()
    obstacle34.draw()
    obstacle35.draw()
    throphy2.draw()
    throphy.draw()
    beer0.draw()
    beer1.draw()
    beer2.draw()
    delgadina.draw() // OJO DE THUNDERA
    checkCollisionGhost()
    checkCollisionThrophy()
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
    scoreDraw()
    ctx.font = "150px VT323"
    ctx.fillStyle = "red"
    ctx.fillText("GAME OVER", 150,330)
    gameOn=false
    document.getElementById("start").innerText="Reiniciar"

}


//listeners

//LISTO
document.getElementById("start").onclick = function() {
    if (!gameOn) {
        start()
        gameOn=true
    }
  };

//LISTO
addEventListener('keydown', e => {
    switch(e.key) {
        case "w":
            return anciano.vY=-12
        case "d":
            return anciano.vX+=3
        case  "a":
            return anciano.vX-=3
        case "ArrowUp":
            return anciano.vY-=12
        case "ArrowLeft":
            return anciano.vX-=3
        case "ArrowRight":
            return anciano.vX+=3
        case "Enter":
            return start()
    }
})

addEventListener("keyup", e=>{
    e.key = false
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