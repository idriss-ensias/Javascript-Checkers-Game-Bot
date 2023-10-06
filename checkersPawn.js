function pawn(pawnID, pawnLogicalX, pawnLogicalY, gameBoard, player, pawnSquare){
    this.pawnID = pawnID;
    this.player = player
    this.pawnLogicalX = pawnLogicalX;
    this.pawnLogicalY = pawnLogicalY;
    this.gameBoard = gameBoard;
    this.pawnKing = 0;
    this.pawnSquare = pawnSquare;
    this.pawnRadius = Math.floor((3*this.gameBoard.boardProportion)/80);
    this.willEat = 0;
    this.pawnColor = "black";
    this.finalValidate = [];
    if (this.player === this.gameBoard.players[0]){
        this.pawnColor = this.gameBoard.boardPawnColorPlayerOne;
    } else {
        this.pawnColor = this.gameBoard.boardPawnColorPlayerTwo;
    }
    this.getXYPawnPosition = function(){
        if (this.gameBoard.translate == 0){
            return [this.gameBoard.boardX+(Math.floor(this.gameBoard.boardProportion/8))*this.pawnLogicalX+Math.floor(this.gameBoard.boardProportion/16),this.gameBoard.boardY+(Math.floor(this.gameBoard.boardProportion/8))*this.pawnLogicalY+Math.floor(this.gameBoard.boardProportion/16)];
        } else {
            return [this.gameBoard.boardX+(Math.floor(this.gameBoard.boardProportion/8))*(7-this.pawnLogicalX)+Math.floor(this.gameBoard.boardProportion/16),this.gameBoard.boardY+(Math.floor(this.gameBoard.boardProportion/8))*(7-this.pawnLogicalY)+Math.floor(this.gameBoard.boardProportion/16)];
        }
    }
    this.pawnRealX = this.getXYPawnPosition()[0];
    this.pawnRealY = this.getXYPawnPosition()[1];
    this.clonePawn = function(cloneBoard){
        clonedPawn = new pawn(this.pawnID.toString(), parseInt(this.pawnLogicalX),parseInt(this.pawnLogicalY),cloneBoard, cloneBoard.getPlayerByName(this.player.playerName), cloneBoard.getSquareByPos(this.pawnLogicalX,this.pawnLogicalY));
        clonedPawn.willEat = parseInt(this.willEat);
        clonedPawn.pawnKing = parseInt(this.pawnKing);
        return clonedPawn;
    }
    this.move = function(pos){
        [eatDeltaX,eatDeltaY] = [this.pawnLogicalX-pos[0],this.pawnLogicalY-pos[1]];
        pawnPossibleMoves = this.validatePossibleMoves();
        if (arrayIncludesNestedArray(pawnPossibleMoves,pos)){
            if (this.gameBoard.hasAuto == 1){
                if (this.gameBoard.oldMove.length !=0){
                    this.gameBoard.getSquareByPos(this.gameBoard.oldMove[0],this.gameBoard.oldMove[1]).unChangeColor();
                }
                this.gameBoard.oldMove = [this.pawnLogicalX,this.pawnLogicalY];
                this.gameBoard.getSquareByPos(this.gameBoard.oldMove[0],this.gameBoard.oldMove[1]).changeColor(this.gameBoard.boardOldMoveColor);
            }
            this.finalValidate = [];
            this.player.playerStillCanEat = [];
            [this.pawnLogicalX,this.pawnLogicalY] = pos;
            [this.pawnRealX,this.pawnRealY] = this.getXYPawnPosition();
            if (this.gameBoard.hasAuto == 1){
                if (this.gameBoard.newMove.length !=0){
                    this.gameBoard.getSquareByPos(this.gameBoard.newMove[0],this.gameBoard.newMove[1]).unChangeColor();
                }
                this.gameBoard.newMove = [this.pawnLogicalX,this.pawnLogicalY];
                this.gameBoard.getSquareByPos(this.gameBoard.newMove[0],this.gameBoard.newMove[1]).changeColor(this.gameBoard.boardNewMoveColor);
            }
            this.pawnSquare = this.gameBoard.getSquareByPos(this.pawnLogicalX,this.pawnLogicalY);
            if (pos[1]==(this.player.playerDirection+1)*(7/2)){
                this.pawnKing = 1;
            }
            if (Math.abs(eatDeltaX) == 2){
                this.gameBoard.eat(this.pawnLogicalX+(eatDeltaX/2),this.pawnLogicalY+(eatDeltaY/2));
                this.attributeTurn();
            } else {
                this.gameBoard.turn = (this.gameBoard.turn+1)%(this.gameBoard.players.length);
                if ((this.gameBoard.hasAuto == 1)&&(this.player.playerName == this.gameBoard.boardAuto.oppositePlayer)){
                    this.gameBoard.boardAuto.checkersTree.oppositeMove = [this.pawnID,[this.pawnLogicalX,this.pawnLogicalY]];
                }
            }
            if (gameMode == "multi"){
                this.gameBoard.gameMulti.gameStateTwoSend();
            }
        } else {
            console.log("did not move, pawn "+this.pawnID+" tried moving to "+pos[0].toString()+":"+pos[1].toString()+" while it's position is "+this.pawnLogicalX.toString()+":"+this.pawnLogicalY.toString());
        }
    }
    this.attributeTurn = function(){
        if (this.canEat().length>0){
            this.finalValidate = this.canEat();
            this.player.playerStillCanEat = [[this.pawnLogicalX,this.pawnLogicalY]];
            if ((this.gameBoard.hasAuto == 1)&&(this.player.playerName == this.gameBoard.boardAuto.oppositePlayer)){
                this.gameBoard.boardAuto.checkersTree.oppositeMove = [this.pawnID,[this.pawnLogicalX,this.pawnLogicalY]];
            }
        } else {
            this.gameBoard.turn = (this.gameBoard.turn+1)%(this.gameBoard.players.length);
        }
    }
    this.highlightPossibleMoves = function(){
        possibleMovesArray = this.validatePossibleMoves();
        for (let v=0; v<possibleMovesArray.length; v++){
            this.gameBoard.returnSquare(possibleMovesArray[v][0],possibleMovesArray[v][1]).boardSquareHighlight = 1;
        }
    }
    this.highlightShouldBeMoved = function(){
        pawnShouldBeMoved = this.player.playerHasPawnCanEat();
        for (let af=0; af<pawnShouldBeMoved.length; af++){
            this.gameBoard.returnSquare(pawnShouldBeMoved[af][0],pawnShouldBeMoved[af][1]).boardSquareHighlight = 1;
        }
    }
    this.canMove = function(){
        squareMoves = [];
        movePossibilities = [[1,this.player.playerDirection],[-1,this.player.playerDirection],[1,(-1)*this.player.playerDirection],[-1,-1*this.player.playerDirection]]
        for (let ac=0; ac<4; ac++){
            if (this.gameBoard.pawnCanMoveToPos(this.pawnLogicalX+movePossibilities[ac][0],this.pawnLogicalY+movePossibilities[ac][1])){
                squareMoves.push([this.pawnLogicalX+movePossibilities[ac][0],this.pawnLogicalY+movePossibilities[ac][1]]);
            }
            if((ac==1)&&(this.pawnKing==0)){
                break;
            }
        }
        return squareMoves;

    }
    this.canEat = function(){
        squareMoves = [];
        movePossibilities = [[1,this.player.playerDirection],[-1,this.player.playerDirection],[1,(-1)*this.player.playerDirection],[-1,-1*this.player.playerDirection]]
        for (let ad=0; ad<4; ad++){
            if (this.gameBoard.pawnCanEatToPos(this,this.pawnLogicalX+movePossibilities[ad][0],this.pawnLogicalY+movePossibilities[ad][1],this.pawnLogicalX+2*movePossibilities[ad][0],this.pawnLogicalY+2*movePossibilities[ad][1])){
                squareMoves.push([this.pawnLogicalX+2*movePossibilities[ad][0],this.pawnLogicalY+2*movePossibilities[ad][1]]);
            }
            if((ad==1)&&(this.pawnKing==0)){
                break;
            }
        }
        return squareMoves;

    }
    this.validatePossibleMoves = function(){
        if (this.finalValidate.length == 0) {
            if (this.player.playerHasPawnCanEat().length != 0){
                if (arrayIncludesNestedArray(this.player.playerHasPawnCanEat(),[this.pawnLogicalX,this.pawnLogicalY])){
                    return this.possibleMoves();
                } else {
                    return [];
                }
            } else {
                return this.possibleMoves();
            }
        } else {
            return this.finalValidate;
        }
    }
    this.possibleMoves=function(){
        eatSquares = this.canEat();
        moveSquares = [];
        if (eatSquares.length>0){
            return eatSquares;
        } else {
            moveSquares = this.canMove();
            if (moveSquares.length>0){
                return moveSquares;
            }
        }
        return [];
    }
    this.update = function(){
        ctx = checkersGameArea.context;
        if (this.pawnKing == 0){
            ctx.fillStyle = this.gameBoard.boardPawnColorBorder;
            ctx.beginPath();
            ctx.arc(this.pawnRealX,this.pawnRealY, this.pawnRadius, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = this.pawnColor;
            ctx.beginPath();
            ctx.arc(this.pawnRealX,this.pawnRealY, this.pawnRadius-5, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            //ctx.fillStyle = "white";
            //ctx.font = "10px Arial";
            //ctx.fillText(this.pawnID,this.pawnRealX-10,this.pawnRealY);
        } else{
            ctx.fillStyle = this.gameBoard.boardPawnColorBorder;
            kingShape = getKingPos(this.pawnRealX-Math.floor(this.gameBoard.boardProportion/16),this.pawnRealY-Math.floor(this.gameBoard.boardProportion/16),Math.floor(this.gameBoard.boardProportion/8),5);
            ctx.beginPath();
            ctx.moveTo(kingShape[1][0][0],kingShape[1][0][1]);
            for (let ab=1; ab<7; ab++){
                ctx.lineTo(kingShape[1][ab][0],kingShape[1][ab][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = this.pawnColor;
            ctx.beginPath();
            ctx.moveTo(kingShape[0][0][0],kingShape[0][0][1]);
            for (let ab=1; ab<7; ab++){
                ctx.lineTo(kingShape[0][ab][0],kingShape[0][ab][1]);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
}
