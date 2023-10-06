function Board(gameMode,gameID,hasAuto,translate){
    this.gameMode = gameMode;
    this.gameID = gameID;
    if (this.gameMode == "multi"){
        this.gameMulti  = new checkersMultiManager(this,gameID); 
    }
    this.hasAuto = hasAuto;
    this.moveAudio = new Audio("checheckers.mp3");
    this.boardX = 0;
    this.boardY = 0;
    this.boardProportion = 600;
    this.boardSquareMain = "#f2b666";
    this.boardSquareSecondary = "#7a4805";
    this.boardSquareBorder = "white";
    this.boardPawnColorPlayerOne = "black";
    this.boardPawnColorPlayerTwo = "red";
    this.boardPawnColorBorder = "#f2b666";
    this.boardInfoBoardColor = "white";
    this.boardInfoBoardBorderColor = "black";
    this.boardInfoMessageColor = "red";
    this.boardStartButtonColor = "green";
    this.boardStartButtonHighligtColor = "gray";
    this.boardStartButtonTextColor = "white";
    this.boardOldMoveColor = "#c2e0af";
    this.boardNewMoveColor = "#538c2e";
    this.boardClockContainerColor = "yellow";
    this.boardClockTextColor = "red";
    this.boardSquares = [];
    this.translate = translate;
    this.boardLogList = [];
    this.players = [new player(playerGlobalList[0][0],1,this,0),new player(playerGlobalList[1][0],-1,this,1)];
    this.boardPawns = [];
    this.infoBoardMessage = new messageBoard(this);
    this.dummyPawn = new pawn("-1:-1",-1,-1,this,this.players[0],new boardSquare(-1,-1,this));
    this.turn = 0;
    this.gameStart = false;
    this.gameEnd = false;
    this.winner = "";
    this.loser = "";
    this.oldMove = [];
    this.newMove = [];
    this.trianglePos = getTrianglePos(this.translate);
    this.pawnListToString = function(){
        pawnList = "";
        for (let aj=0; aj<this.boardPawns.length; aj++){
            pawnList = pawnList.concat(this.boardPawns[aj].pawnID+"%"+this.boardPawns[aj].pawnLogicalX.toString()+"%"+this.boardPawns[aj].pawnLogicalY.toString()+"%"+this.boardPawns[aj].pawnKing.toString())+"/";
        }
        return pawnList.slice(0,-1);
    }
    this.remakePawnList = function(pawnListString){
        newBoardPawnList = [];
        pawnStringList = pawnListString.split("/");
        buffer = [];
        for (let ak=0; ak<pawnStringList.length; ak++){
            buffer = pawnStringList[ak].split("%");
            newBoardPawnList.push(this.getPawnByID(buffer[0]))
            newBoardPawnList[newBoardPawnList.length-1].pawnLogicalX = parseInt(buffer[1]);
            newBoardPawnList[newBoardPawnList.length-1].pawnLogicalY = parseInt(buffer[2]);
            newBoardPawnList[newBoardPawnList.length-1].pawnKing = parseInt(buffer[3]);
            newBoardPawnList[newBoardPawnList.length-1].pawnRealX  = newBoardPawnList[newBoardPawnList.length-1].getXYPawnPosition()[0];
            newBoardPawnList[newBoardPawnList.length-1].pawnRealY  = newBoardPawnList[newBoardPawnList.length-1].getXYPawnPosition()[1];
            newBoardPawnList[newBoardPawnList.length-1].pawnSquare = this.getSquareByPos(buffer[1],buffer[2]);
            buffer = [];
        }
        this.boardPawns = newBoardPawnList;
    }
    this.checkGameStatus = function(){
        for (let af=0; af<2; af++){
            if (this.players[af].getPlayerPawns().length == 0){
                if (gameMode == "multi"){
                    this.loser = this.players[af].playerName;
                    this.winner = this.players[(af+1)%2].playerName;
                    if (this.loser == miniMe){
                        this.infoBoardMessage.messageText = "You lost :(";
                    } else {
                        this.infoBoardMessage.messageText = "You won :)";
                    }
                } else {
                    this.infoBoardMessage.messageText = "Game Over";
                }
                this.infoBoardMessage.update();
                this.gameEnd = true;
                this.gameStart = true;
                this.infoBoardMessage.messageShow = 1;
            }
        }
    }
    this.pawnCanMoveToPos = function(posX,posY){
        if (isInsideLogicalBoard(posX,posY)){
            if (this.checkSquareEmpty(posX,posY)){
                return true;
            }
        }
        return false;
    }
    this.pawnCanEatToPos = function(boardPawn, posX1, posY1, posX2, posY2){
        if (isInsideLogicalBoard(posX2,posY2)){
            if(this.checkSquareEmpty(posX2, posY2)){
                if(this.checkSquareEmpty(posX1,posY1)==false){
                    if (this.getPawn([posX1,posY1]).player != boardPawn.player){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    this.getPlayerByName = function(namePlayer){
        for (let ay=0; ay<this.players.length; ay++){
            if (this.players[ay].playerName == namePlayer){
                return this.players[ay];
            }
        }
        console.log("Function getPlayerByName : No player found");
    }
    this.getSquareByPos = function(x,y){
        for (let aa=0; aa<this.boardSquares.length; aa++){
            if (this.boardSquares[aa].boardSquareLogicalX == x){
                if (this.boardSquares[aa].boardSquareLogicalY == y){
                    return this.boardSquares[aa];
                }
            }
        }
    }
    this.getPawn = function([x,y]){
        for (let n=0; n<this.boardPawns.length; n++){
            if (this.boardPawns[n].pawnLogicalX == x){
                if (this.boardPawns[n].pawnLogicalY == y){
                    return this.boardPawns[n];
                } 
            }
        }
        return this.dummyPawn;
    }
    this.getPawnByID = function(id){
        for (let z=0; z<this.boardPawns.length; z++){
            if (this.boardPawns[z].pawnID == id){
                return this.boardPawns[z];
            }
        }
        return this.dummyPawn;
    }
    this.eat = function(x,y){
        newSquareArray = [];
        for(let u=0; u<this.boardPawns.length; u++){
            if (this.boardPawns[u].pawnLogicalX != x){
                newSquareArray.push(this.boardPawns[u]);
            } else {
                if (this.boardPawns[u].pawnLogicalY != y){
                    newSquareArray.push(this.boardPawns[u]);
                }
            }
        }
        this.boardPawns = newSquareArray;
    }
    this.checkSquareEmpty = function(posx,posy){
        for (let q=0;q<this.boardPawns.length;q++){
            if (posx == this.boardPawns[q].pawnLogicalX) {
                if (posy == this.boardPawns[q].pawnLogicalY) {
                    return false;
                }
            }
        }
        return true;
    }
    this.returnSquare = function(logicalX,logicalY){
        for (let u=0; u<this.boardSquares.length; u++){
            if (this.boardSquares[u].boardSquareLogicalX == logicalX){
                if (this.boardSquares[u].boardSquareLogicalY == logicalY){
                    return this.boardSquares[u];
                }
            }
        }
    }
    this.unHighlightAllSquares = function(){
        for (let w=0; w<this.boardSquares.length; w++){
            this.boardSquares[w].boardSquareHighlight = 0;
        }
    }
    this.getSquare = function([x,y]){
        for (let r=0; r<this.boardSquares.length; r++){
            if (isInsideSquare(x,y,this.boardSquares[r].boardSquareRealX,this.boardSquares[r].boardSquareRealY,this.boardSquares[r].squareProportion)){
                return [this.boardSquares[r].boardSquareLogicalX,this.boardSquares[r].boardSquareLogicalY];
            }
        }
        return [-1,-1];
    }
    this.checkClickInsidePawns = function(x,y){
        for (let m=0; m<this.boardPawns.length; m++){
            if (isInsideCircle(x,y,this.boardPawns[m].pawnRealX,this.boardPawns[m].pawnRealY,this.boardPawns[m].pawnRadius)){
                return [this.boardPawns[m].pawnLogicalX,this.boardPawns[m].pawnLogicalY];
            }
        }
        return false;
    }
    this.getAllMoves = function(movePlayer){
        pawnMovesArray = [];
        movesArray = [];
        for (let ao=0; ao<this.boardPawns.length; ao++){
            if (this.boardPawns[ao].player.playerName == movePlayer) {
                movesArray = this.boardPawns[ao].validatePossibleMoves();
                if (movesArray.length > 0){
                    pawnMovesArray.push([this.boardPawns[ao].pawnID,movesArray]);
                }
                movesArray = [];
            }
        }
        return pawnMovesArray;
    }
    for (let i=0; i<8; i++){
        for (let j=0; j<8; j++){
            this.boardSquares.push(new boardSquare(i,j,this,this.boardHighlightColor));
            if (j<3) {
                if (j%2!=i%2){
                    this.boardPawns.push(new pawn(i.toString()+":"+j.toString(),i,j,this,this.players[0],this.boardSquares[this.boardSquares.length-1]));
                }
            } else if (j>4) {
                if (j%2!=i%2){
                    this.boardPawns.push(new pawn(i.toString()+":"+j.toString(),i,j,this,this.players[1],this.boardSquares[this.boardSquares.length-1]));
                }
            }
        }
    }
    this.copyBoard = function(boardClone){
        this.boardPawns = [];
        for (let ax=0; ax<boardClone.boardPawns.length; ax++){
            this.boardPawns.push(boardClone.boardPawns[ax].clonePawn(this));
        }
        this.turn = boardClone.turn;
        this.getPlayerByName("player2").playerStillCanEat = [];
        this.getPlayerByName("player1").playerStillCanEat = [];
    }
    if (this.hasAuto == 1){
        this.boardAuto = new checkersAuto(this,"player2", "player1");
    } else {
        this.boardAuto = 0;
    }
    this.translateF = function(){
        this.translate = (this.translate+1)%2;
        for (let cm=0; cm<this.boardSquares.length; cm++){
            this.boardSquares[cm].setSquarePos();
        }
        for (let cn=0; cn<this.boardPawns.length; cn++){
            this.boardPawns[cn].pawnRealX = this.boardPawns[cn].getXYPawnPosition()[0];
            this.boardPawns[cn].pawnRealY = this.boardPawns[cn].getXYPawnPosition()[1];
        }
    }
    this.update = function(){
        if (!this.gameEnd){
            this.checkGameStatus();
        }
        ctx = checkersGameArea.context;
        ctx.fillStyle = this.boardGameColor;
        ctx.fillRect(this.boardX, this.boardY, this.boardProportion, this.boardProportion);
        ctx.fill();
        ctx.fillStyle= this.boardGameColor;
        for (let k=0; k<64; k++){
            this.boardSquares[k].update();
        }
        for (let l=0; l<this.boardPawns.length; l++){
            this.boardPawns[l].update();
        }
        if (this.infoBoardMessage.messageShow == 1){
            this.infoBoardMessage.update();
        }
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(this.boardProportion/16,this.boardProportion/16,10,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = this.players[this.turn].getPlayerPawns()[0].pawnColor;
        ctx.beginPath();
        ctx.arc(this.boardProportion/16,this.boardProportion/16,6,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.moveTo(this.trianglePos[0][0]*this.boardProportion,this.trianglePos[0][1]*this.boardProportion);
        ctx.lineTo(this.trianglePos[1][0]*this.boardProportion,this.trianglePos[1][1]*this.boardProportion);
        ctx.lineTo(this.trianglePos[2][0]*this.boardProportion,this.trianglePos[2][1]*this.boardProportion);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = this.boardClockContainerColor;
        ctx.beginPath();
        ctx.fillRect((29/32)*this.boardProportion,(13/32)*this.boardProportion,(3/32)*this.boardProportion,(1/16)*this.boardProportion);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = this.boardClockTextColor;
        ctx.font = "20px arial";
        ctx.fillText(getTimeString(getMin(incTime)),(29/32)*this.boardProportion+5,(13/32)*this.boardProportion+25);
        ctx.fill();
    }
}
