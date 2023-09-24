function checkersNode(nodePawn,movePos,nodeParent,level,nodeTree,nodePlayer){
    this.weight=-1000;
    this.nodeTree = nodeTree;
    this.nodePawn = nodePawn;
    this.nodePlayer = nodePlayer;
    this.movePos = [movePos];
    this.oppositeMoves = [];
    this.nodeChildren = [];
    this.level = level;
    this.nodeParent = nodeParent;
    this.mainPlayerPawns = 0;
    this.oppositePlayerPawns = 0;
    this.pawnMovesNextLevel = [];
    this.moveBuffer = [];
    if (this.level > 0){
        for (let bh=0; bh<this.nodeParent.length;bh++){
            if(this.nodeParent[bh].nodePawn != "-1:-1"){
                if((this.level-this.nodeParent[bh].level) == 1){
                    this.nodeParent[bh].nodeChildren.push(this);
                }
            }
        }
    }
    this.equalsNode = function(eqNode){
        if (this.nodePawn == eqNode.nodePawn){
            if (this.level == eqNode.level){
                if (this.movePos[0][0]==eqNode.movePos[0][0]){
                    if(this.movePos[0][1]==eqNode.movePos[0][1]){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    this.isParent = function(chilNode){
        for (let cd=0; cd<chilNode.nodeParent.length; cd++){
            if (this.equalsNode(chilNode.nodeParent[cd])){
                return true;
            }
        }
        return false;
    }
    this.adjustParent = function(){
        console.log("adjusting parents "+this.nodeParent.length);
        newParentList = [];
        for (let cm=0; cm<this.nodeParent.length; cm++){
            if (this.nodeParent[cm].level > 0){
                console.log("niyaw kagar");
                newParentList.push(this.nodeParent[cm]);
            }
        }
        this.nodeParent = newParentList;
    }
    this.removeParentLevel = function(parentLevel){
        newParentArray = [];
        for (let ch=0; ch<this.nodeParent.length; ch++){
            if (this.nodeParent[ch].level != parentLevel){
                newParentArray.push(this.nodeParent[ch]);
            }
        }
        this.nodeParent = newParentArray;
    }
    this.doNodeMovs = function() {
        for (let br=0; br<this.movePos.length; br++){
            this.nodeTree.checkersAutoPlayer.autoBoard.getPawnByID(this.nodePawn).move(this.movePos[br]);
        }
    }
    this.calculateWeight = function(){
        this.nodeTree.checkersAutoPlayer.initAutoBoard();
        for (let be=0; be<this.nodeParent.length; be++){
            if (this.nodeParent[be].nodePawn != "-1:-1"){
                this.nodeParent[be].doNodeMovs();
            }
        }
        this.nodeTree.checkersAutoPlayer.autoBoard.getPawnByID(this.nodePawn).move(this.movePos[0]);
        while (this.nodeTree.checkersAutoPlayer.autoBoard.players[this.nodeTree.checkersAutoPlayer.autoBoard.turn].playerName == this.nodePlayer){
            this.moveBuffer = this.nodeTree.checkersAutoPlayer.autoBoard.getPawnByID(this.nodePawn).validatePossibleMoves();
            this.movePos = this.movePos.concat([this.moveBuffer[0]]);
            this.nodeTree.checkersAutoPlayer.autoBoard.getPawnByID(this.nodePawn).move(this.moveBuffer[0]);
        }
        this.moveBuffer = [];
        this.mainPlayerPawns = this.nodeTree.checkersAutoPlayer.autoBoard.getPlayerByName(this.nodeTree.checkersAutoPlayer.autoPlayer).getPlayerPawns().length;
        this.oppositePlayerPawns = this.nodeTree.checkersAutoPlayer.autoBoard.getPlayerByName(this.nodeTree.checkersAutoPlayer.oppositePlayer).getPlayerPawns().length;
        this.weight = this.mainPlayerPawns-this.oppositePlayerPawns;
    }
    if(this.nodePawn != "-1:-1"){
        this.calculateWeight();
    }
}