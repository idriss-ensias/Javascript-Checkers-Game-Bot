function checkersAuto(origBoard, autoPlayer, oppositePlayer){
    this.origBoard = origBoard;
    this.autoPlayer = autoPlayer;
    this.oppositePlayer = oppositePlayer;
    this.autoBoard = new Board("single",gameID,0);
    this.autoBoard.copyBoard(this.origBoard);
    this.checkersTree = new checkersTree(this,this.autoPlayer);
    this.initAutoBoard = function(){
        this.autoBoard.copyBoard(this.origBoard);
    }
}