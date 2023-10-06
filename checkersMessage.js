function messageBoard(infoBoard){
    this.infoBoard = infoBoard;
    this.messageWidth = this.infoBoard.boardProportion*(1/2);
    this.messageHeight = this.infoBoard.boardProportion*(1/2);
    this.messagePosX = this.infoBoard.boardProportion*(1/4);
    this.messagePosY = this.infoBoard.boardProportion*(1/4);
    this.messageBorderWidth = this.infoBoard.boardProportion*(1/50);
    this.startButtonColor = this.infoBoard.boardStartButtonColor;
    this.startButtonWidth = 100;
    this.startButtonHeight = 50;
    this.startButtonPosX = this.messagePosX+(this.messageWidth/2)-(this.startButtonWidth/2);
    this.startButtonPosY = this.messagePosY+this.messageHeight-this.startButtonHeight;
    this.messageText = "";
    this.messageTextSize = "20";
    this.messageFont = "Arial";
    this.messageShow = 1;
    if (gameMode == "multi"){
        this.startDisabled = true;
        this.startButtonColor = "gray";
        this.messageText = "Waiting for other player to join";
    } else {
        this.startDisabled = false;
        this.messageText = "Press start";
    }
    this.enableStartButton = function(){
        this.startDisabled = false;
        this.startButtonColor = this.infoBoard.boardStartButtonColor;
        this.update();
    }
    this.startButtonClicked = function(posX,posY){
        if (!this.startDisabled){
            if (posX>this.startButtonPosX) {
                if (posX<(this.startButtonPosX+this.startButtonWidth)){
                    if (posY>this.startButtonPosY) {
                        if (posX<(this.startButtonPosY+this.startButtonHeight)){
                            return true;
                        }
                    }
                }
            }
            return false;
        } else{
            return false;
        }
    }
    this.update = function(){
        ctx = checkersGameArea.context;
        ctx.fillStyle = this.infoBoard.boardInfoBoardBorderColor;
        ctx.beginPath();
        ctx.fillRect(this.messagePosX-this.messageBorderWidth,this.messagePosY-this.messageBorderWidth,this.messageWidth+2*this.messageBorderWidth,this.messageHeight+2*this.messageBorderWidth);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = this.infoBoard.boardInfoBoardColor;
        ctx.beginPath();
        ctx.fillRect(this.messagePosX,this.messagePosY,this.messageWidth,this.messageHeight);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = this.messageTextSize.toString()+"px "+this.messageFont;
        ctx.fillText(this.messageText,this.messagePosX+5,this.messagePosY+20)
        if (!this.infoBoard.gameEnd){
            ctx.fillStyle = this.startButtonColor;
            ctx.beginPath();
            ctx.fillRect(this.startButtonPosX,this.startButtonPosY,this.startButtonWidth,this.startButtonHeight);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.font = "20px "+this.messageFont;
            ctx.fillText("Start",this.startButtonPosX+25,this.startButtonPosY+35)
        }
    }
}
