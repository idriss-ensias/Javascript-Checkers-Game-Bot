var checkersboard = new Board(gameMode,gameID,1);
var clickedpawn = checkersboard.dummyPawn;
var click = 0;
var startclick = 0;
function startcheckersgame(){
    checkersGameArea.start();
    checkersboard.update();
    if (gameMode == "multi"){
        checkersboard.gameMulti.init();
    }
}
var checkersGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateCheckersGameArea, 100);
        window.addEventListener("mousedown", function (e) {
            if (checkersboard.gameStart){
                if ((playerGlobalList[checkersboard.turn][0] == miniMe)||(gameMode=="single")){
                    if(checkersboard.checkClickInsidePawns(e.pageX,e.pageY,checkersboard.boardPawns!=false)){
                        clickedpawn = checkersboard.getPawn(checkersboard.checkClickInsidePawns(e.pageX,e.pageY,checkersboard.boardPawns));
                        if (clickedpawn.player == checkersboard.players[checkersboard.turn]){
                            checkersboard.boardPawns = reOrderArray(checkersboard.boardPawns,clickedpawn);
                            click = 1;
                            clickedpawn.highlightPossibleMoves();
                            if (clickedpawn.player.playerHasPawnCanEat().length != 0){
                                if (!arrayIncludesNestedArray(clickedpawn.player.playerHasPawnCanEat(),[clickedpawn.pawnLogicalX,clickedpawn.pawnLogicalY])){
                                    clickedpawn.highlightShouldBeMoved();
                                }
                            }
                            if (gameMode == 'multi'){
                                checkersboard.gameMulti.gameStateTwoSendClip(clickedpawn.pawnID);
                            }
                        }
                    }
                }
            } else {
                if (checkersboard.infoBoardMessage.startButtonClicked(e.pageX,e.pageY)){
                    if ((gameMode == "single")||(gameMode == "auto")){
                        checkersboard.infoBoardMessage.startButtonColor = checkersboard.boardStartButtonHighligtColor;
                        checkersboard.infoBoardMessage.update();
                        startclick = 1;
                    } else {
                        checkersboard.gameMulti.gameStateOneSend();
                        playerGlobalList[getPlayerIndex(miniMe,playerGlobalList)][1] = 2;
                    }
                }
            }
        })
        window.addEventListener("mousemove", function(e){
            if (checkersboard.gameStart){
                if (click == 1){
                    clickedpawn.pawnRealX = e.pageX;
                    clickedpawn.pawnRealY = e.pageY;
                    if (gameMode == 'multi'){
                        checkersboard.gameMulti.gameStateTwoSendPos(e.pageX,e.pageY);
                    }
                }
            }
        })
        window.addEventListener("mouseup", function (e) {
            if (checkersboard.gameStart){
                if (click == 1){
                    if(clickedpawn != checkersboard.dummyPawn){
                        clickedpawn.move(checkersboard.getSquare([e.pageX,e.pageY]));
                        checkersboard.unHighlightAllSquares();
                    }
                    clickedpawn.pawnRealX = clickedpawn.getXYPawnPosition()[0];
                    clickedpawn.pawnRealY = clickedpawn.getXYPawnPosition()[1];
                    clickedpawn = checkersboard.dummyPawn;
                    checkersboard.update();
                    click = 0;
                    if (gameMode == 'multi'){
                        checkersboard.gameMulti.gameStateTwoSendUnclip();
                    }
                }
            } else {
                if (startclick == 1){
                    if ((gameMode == "single")||(gameMode == "auto")){
                        checkersboard.infoBoardMessage.messageShow = 0;
                        checkersboard.gameStart = true;
                        checkersboard.update();
                    }
                }
            }
        })
    },
    clear : function() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}
function updateCheckersGameArea(){
    if(click == 1){
        checkersGameArea.clear();
        checkersboard.update();
    }
    if (gameMode == "multi"){
        checkersboard.gameMulti.update();
    }
    if (checkersboard.gameEnd != 1){
        if (gameMode == "auto"){
            if (checkersboard.players[checkersboard.turn].playerName != miniMe){
                resuAuto = checkersboard.boardAuto.checkersTree.finalResult(5);
                for (let cp=0; cp<resuAuto.movePos.length; cp++){
                    checkersboard.getPawnByID(resuAuto.nodePawn).move(resuAuto.movePos[cp]);
                }
                checkersGameArea.clear();
                checkersboard.update();
            }
        }
    }
}