class endGame  extends Phaser.Scene
{
    constructor()
    {
        super("endGame");
        this.mensagem;
    }

    preload()
    {

    }

    create()
    {
        this.add.image(0,0,"fundo").setOrigin(0,0);
        this.add.image(0,0,"vitoria").setOrigin(0,0);

        this.add.text(150,50,this.mensagem, {fontSize:'24px', fill:'orange'});
        
        let btnPlay = this.add.image(147,380,"btnPlay");
        btnPlay.setInteractive(); //chamada necessária para ser clicável
        btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));

        let btnHome = this.add.image(456,380,"btnHome");
        btnHome.setInteractive(); //chamada necessária para ser clicável
        btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
    }
}