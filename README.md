# Javascript-Checkers-Game-Bot
Small checkers javascript canvas game with a built in bot using a game tree
## Checkers Game
Simple Checkers Game developped using Javascript with no frameworks, i added a bot that relies on a game tree (moves with the most "eats" are chosen), you can set the depth of the tree in file 'checkersGameArea.js' line 106. Just keep in mind that the more levels you add more computation is needed, so it will take more time for the bot to make a move.
## Future improvements
I intend on making the bot faster, by making a few changes in the game logic. Please take a look at my game and let me know what you think, especially on how i implemented the game tree logic. Do not hesitate on contacting me at idriss.el.moussaouiti@gmail.com to share with me ideas or recommandations.
### Multi Mode
If you go over the code, you will find a variable called 'gameMode', this game has three modes : single, auto or multi
#### Single : game in your browser where you can play with your friend on your machine, you can move the pieces of both players.
#### Auto : you play with the bot
#### Multi : this is for another project i am currently working on, but if you provide the main html page with a websocket, the checkers game can be played over the internet.
# if you find that the quality of the code or the logic of the program is not good, please note that this is my own implementation and that i did not copy from other sources so feel free to share with me at my email address provided above what you think !
