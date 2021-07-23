const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

//setting height and width of canvas
canvas.width = innerWidth
canvas.height = innerHeight

//getting score element
const Score = document.querySelector('#score');
const StartBtn = document.querySelector('#startBtn')
const Modal = document.querySelector('#modal')
const BigScore = document.querySelector('#bidScore')
//creating a player class
class Player {
    constructor(x,y,radius,colour){
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
    }
    //adding draw function
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.colour
        ctx.fill()
    }
}

//creating Projectile class
class Projectile {
    constructor(x,y,radius,colour,direction){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.direction = direction
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.colour
        ctx.fill()
    }
    //updating the position of projectile based on the direction direction
    update(){
        this.draw()
        this.x = this.x + this.direction.x
        this.y = this.y + this.direction.y
    }
} 

//creating enemies
class Enemy {
    constructor(x,y,radius,colour,direction){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.direction = direction
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.colour
        ctx.fill()
    }
    //updating the position of projectile based on the direction direction
    update(){
        this.draw()
        this.x = this.x + this.direction.x
        this.y = this.y + this.direction.y
    }
} 

//creating particles
class Particles {
    constructor(x,y,radius,colour,direction){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.direction = direction
        this.alpha = 1 // this is by default 1 which means completely opac
    }
    draw(){
        ctx.save() //used to edit opacity in canvas, it only affects the code in the function
        ctx.globalAlpha = this.alpha //changes alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.colour
        ctx.fill()
        ctx.restore() //it finishes off the statement 
    }
    //updating the position of projectile based on the direction direction
    update(){
        this.draw()
        this.x = this.x + this.direction.x
        this.y = this.y + this.direction.y
        this.alpha -= 0.01
    }
} 


//setting player position in the middle
const x = canvas.width / 2
const y = canvas.height/ 2

//creating a player
let player = new Player(x,y,15,'white');

//place to store multiple projectiles
let projectiles = []

//place to store multiple enemies
let enemies = []

//place to store multiple particles
let particles = []

function init(){
    player = new Player(x,y,15,'white');
    projectiles = []
    enemies = []
    particles = []
    score = 0
    Score.innerHTML = score
    BigScore.innerHTML = score
    
}

//creating new enemies after every 1 second
function createEnemies(){
    setInterval(() => {
        const radius = Math.random() * (30 - 7) + 7  //radius of random number between 4 to 30
        let x;
        let y;
        let color = `hsl(${Math.random() * 360},90%,50%)`
        //setting the most random position of x and y
        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }else{
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            x = Math.random() * canvas.width
        }
        const colour = 'green'
        //making enemy move in the direction of player
        const angle = Math.atan2(canvas.height / 2 - y,canvas.width/2 - x)
        const direction = {
            x: Math.cos(angle),
            y: Math.sin(angle)
            }
        enemies.push(new Enemy(x,y,radius,color,direction))
    },1000)
    
}


//creating an animation function for moving the projectile based on update position
let animation;
let score = 0;
function animate(){
    animation = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,0.1)' 
    //clearing the canvas for better view(so that line will not form)
    ctx.fillRect(0,0,canvas.width,canvas.height)
    //drawing player after every clearness of canvas
    player.draw();
    //drawing particles on screen 
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0){
            particles.splice(index,1)
        }else{
            particle.update()
        }
    })
    //moving the projectile based on update position
    projectiles.forEach((projectile,index) => {
        projectile.update()

        //removing projectile from edges of screen
        if(projectile.x + projectile.radius < 0 || projectile.x-projectile.radius > canvas.width
        || projectile.y + projectile.radius < 0 || projectile.y-projectile.radius > canvas.height){
            projectiles.splice(index,1)
        }
    })
    //moving enemies
    enemies.forEach((enemy,index) => {
        enemy.update()
    

        //when the enemy and player collide game freeze
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y )

        if(dist - enemy.radius - player.radius  < 1 ){
           cancelAnimationFrame(animation)
           Modal.style.display ='flex'
           BigScore.innerHTML = score
        }

        //looping through all the projectile for each enemy to find distance between them
        projectiles.forEach((projectile, proIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            // if distance between projectile and enemy is less than 1 we will remove the projectile and enemy
            if(dist - enemy.radius - projectile.radius < 1 ){
                
                //whenever projectile hits an enemy we create particle
                for(let i =0; i < enemy.radius * 2; i++){
                    particles.push(new Particles(projectile.x, projectile.y,
                    Math.random() *2 ,
                    enemy.colour, 
                    {
                    x: Math.random() - 0.5,
                    y: Math.random() - 0.5
                    }))
                } 

                if(enemy.radius -10 > 10){
                    score += 100;
                    Score.innerHTML = score;
                   gsap.to(enemy,{
                        radius: enemy.radius -10
                    })
                    setTimeout(() => {
                        projectiles.splice(proIndex,1)
                    }
                    ,0)
                }else{
                    score += 250;
                    Score.innerHTML = score;
                    setTimeout(() => {
                        enemies.splice(index,1)
                        projectiles.splice(proIndex,1)
                    }
                    ,0)
                }
            }
        })
    })
}

//creating projectile on every click
addEventListener('click' , (event) => {
    //calculating the angle at which mouse is clicked 
    const angle = Math.atan2(event.clientY-y,event.clientX-x)
    //finding x and y cordinate of direction
    const direction = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5   //multiplying by 5 to increase its distance
    }
    //pushing new projectile in array
   projectiles.push(new Projectile(x,y,5,'white',direction))
})


StartBtn.addEventListener('click' , () => {
    init()
    animate()
    createEnemies()
    Modal.style.display = 'none'
})

    
    

    




