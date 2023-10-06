function boardSquare(boardSquareLogicalX,boardSquareLogicalY,gameBoard){
    this.boardSquareLogicalX = boardSquareLogicalX;
    this.boardSquareLogicalY = boardSquareLogicalY;
    this.gameBoard = gameBoard;
    this.boardSquareHighlight = 0;
    this.squareProportion = Math.floor(this.gameBoard.boardProportion/8);
    this.setSquarePos = function(){
        if (this.gameBoard.translate == 0){
            this.boardSquareRealX = this.gameBoard.boardX + this.squareProportion*this.boardSquareLogicalX;
            this.boardSquareRealY = this.gameBoard.boardY + this.squareProportion*this.boardSquareLogicalY;
        } else {
            this.boardSquareRealX = this.gameBoard.boardX + this.squareProportion*(7-this.boardSquareLogicalX);
            this.boardSquareRealY = this.gameBoard.boardY + this.squareProportion*(7-this.boardSquareLogicalY);
        }
    }
    this.setSquarePos();
    if (this.boardSquareLogicalX%2 === this.boardSquareLogicalY%2){
        this.color = this.gameBoard.boardSquareMain;
    } else {
        this.color = this.gameBoard.boardSquareSecondary;
    }
    this.changeColor = function(newColor){
        this.color = newColor;
    }
    this.unChangeColor = function(){
        if (this.boardSquareLogicalX%2 === this.boardSquareLogicalY%2){
            this.color = this.gameBoard.boardSquareMain;
        } else {
            this.color = this.gameBoard.boardSquareSecondary;
        }   
    }
    this.update = function(){
        ctx = checkersGameArea.context;
        if (this.boardSquareHighlight > 0){
            ctx.fillStyle = this.gameBoard.boardSquareBorder;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.boardSquareRealX,this.boardSquareRealY,this.squareProportion,this.squareProportion);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.boardSquareRealX+5,this.boardSquareRealY+5,this.squareProportion-10,this.squareProportion-10);
    }
}
