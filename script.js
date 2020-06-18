var app = new Vue({
    el: '#app',
    data: {
        vueCanvas: null,

        sizeW: 804,
        sizeH: 404,
        // sizeW: window.innerWidth,
        // sizeH: window.innerHeight,
        cellSize: 50,
        border: 4,

        snake: [], 
        dir: 1,
        dirChange: false,
        foodX: 0,
        foodY: 0,
 
    }, 
    computed: {
        cellWidth() {
            return Math.floor((this.sizeW / this.cellSize)) -1;
        },
        cellHeight() {
            return  Math.floor((this.sizeH / this.cellSize)) -1;
        },
    },
    methods: {
        update() {
            // canvas updating
            this.vueCanvas.clearRect(0, 0, this.sizeW, this.sizeH);
            this.vueCanvas.fillStyle = '#fdd';
            for (let i = 0; i <= this.cellWidth; i++) {
                this.vueCanvas.fillRect(i * this.cellSize, 0, this.border, this.cellHeight * this.cellSize + this.border);
            }
            for (let i = 0; i <= this.cellHeight; i++) {
                this.vueCanvas.fillRect(0, i * this.cellSize, this.cellWidth * this.cellSize + this.border, this.border);
            }

            // food updating
            this.vueCanvas.fillStyle = '#817c70';
            this.vueCanvas.fillRect(this.foodX * this.cellSize + this.border, this.foodY * this.cellSize + this.border, this.cellSize - this.border, this.cellSize - this.border);
            
            //snek updating
            let dx = this.snake[0].x;
            let dy = this.snake[0].y;
            this.vueCanvas.fillStyle = '#07c155';
            if(dx == this.foodX && dy == this.foodY) {
                this.newFood();
                this.snake.push({x: this.snake[this.snake.length - 1].x, y: this.snake[this.snake.length - 1].y});
            }

            for (let i = 0; i < this.snake.length; i++) {
                let x = this.snake[i].x;
                let y = this.snake[i].y;
                this.vueCanvas.fillRect(x * this.cellSize + this.border, y * this.cellSize + this.border, this.cellSize - this.border, this.cellSize - this.border);
            }
            for (let i = this.snake.length - 1; i > 0; i--) {
                this.snake[i].x = this.snake[i - 1].x;
                this.snake[i].y = this.snake[i - 1].y;
            }
            
            if(this.dir == 0) {
                dy--;
            }
            else if(this.dir == 1) {
                dx++;
            }
            else if(this.dir == 2) {
                dy++;
            }
            else {
                dx--;
            }
            this.snake[0].x = (dx % this.cellWidth + this.cellWidth) % this.cellWidth;
            this.snake[0].y = (dy % this.cellHeight + this.cellHeight) % this.cellHeight;
            //dead
            for (let i = 1; i < this.snake.length; i++) {
		        if(this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y) {
                    this.newFood();
                    this.newSnake();
		        }
            }
            this.dirChanged = false;
        },
        newFood() {
            this.foodX = Math.floor(Math.random() * this.cellWidth);
            this.foodY = Math.floor(Math.random() * this.cellHeight);
        },
        newSnake() {
            this.dir = 1;
            this.snake = [];
            for (let i = 0; i < 3; i++) {
                this.snake.push({x: Math.floor((this.cellWidth / 2)) - i, y: Math.floor((this.cellHeight / 2))});
            }
        },
        keyDown(e) {
            if(this.dirChange) return;
            let newDir = -1;
            switch(e.keyCode) {
                case 38:
                    newDir = 0;
                    break;
                case 39:
                    newDir = 1;
                    break;
                case 40:
                    newDir = 2;
                    break;
                case 37:
                    newDir = 3;
                    break;
            }
          if(newDir == -1) return;
            if(((this.dir + 2) % 4) != newDir) {
                this.dir = newDir;
                this.dirChanged = true;
            }
        },
    },
    mounted() {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        this.vueCanvas = ctx;
        this.newSnake();
        setInterval(this.update, 250);
        document.onkeydown = this.keyDown;
    }
})