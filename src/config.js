var game;

window.onload = function()
{
    let gameconfig = 
    {
        type: Phaser.AUTO,
        scale:
        {
            mode: Phaser.Scale.FIT,
            parent: 'phaser-example',
            width: 800,
            height: 600,
            autoCenter:Phaser.Scale.CENTER_BOTH    //centraliza o jogo na tela
        },
        physics:
        {
            default:'arcade',
            arcade:
            {
                gravity: {y: 420},
            }
        },
        backgroundColor:'#98FB98',
        

        scene:[homeGame, playGame, endGame]
    };
    game: new Phaser.Game(gameconfig);

    window.focus();     //esquema foco do clique do mouse
}