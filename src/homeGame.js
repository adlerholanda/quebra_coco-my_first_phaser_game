class homeGame extends Phaser.Scene
{
    constructor()
    {
        super("homeGame");
        this.chao;
        this.estrela;
        this.rocha;
        this.premios;
        this.inimigos;
        this.btnFullScreen;
    }

    preload() //antecipando preload de todos os assets do jogo
    {
        //homeGame        
        this.load.image("bg", "assets/image/bg.png");
        this.load.image("btnJogar", "assets/image/btnJogar.png");
        this.load.image("dudeNew", "assets/image/dudeNew.png");
        this.load.image("logo", "assets/image/logo.png");
        this.load.image("phaser", "assets/image/phaser.png");
        this.load.image("btnFullScreen", "assets/image/fullScreen.png");

        //playGame
        this.load.image("fundo", "assets/image/fundo.png");
        this.load.image("chao", "assets/image/chao2.png");
        this.load.image("star", "assets/image/star.png");
        this.load.image("starVermelha", "assets/image/starVermelha.png");
        this.load.image("starCinza", "assets/image/starCinza.png");
        this.load.image("rock", "assets/image/rocha.png");
        this.load.image("et1", "assets/image/inimigo.png");
        this.load.image("et2", "assets/image/inimigoCobra.png");
        this.load.spritesheet("personagem","assets/image/dude.png",{frameWidth:32, frameHeight:48});
        this.load.image("btnArrowRight", "assets/image/btnArrowRight.png");
        this.load.image("btnArrowLeft", "assets/image/btnArrowLeft.png");
        this.load.image("iconLife", "assets/image/iconLife.png");
        this.load.image("iconPoints", "assets/image/iconPoints.png");
        this.load.audio('musicTheme', ['assets/sound/music.mp3']);
        this.load.audio('starEffect', ['assets/sound/coin.mp3']);
        
        //endGame
        this.load.image("btnPlay", "assets/image/jogar.png");
        this.load.image("btnHome", "assets/image/voltar.png");
        this.load.image("vitoria", "assets/image/vitoriaCena.png");
        this.load.image("derrota", "assets/image/derrotaCena.png");
    }

    create()
    {
        //--------------- |VARIÁVEIS CREATE| ---------------\\
        this.physics.world.on("worldbounds", this.saiudaCena);

        //iniciar o jogo via teclado
        this.input.keyboard.on("keydown_ENTER", ()=>this.scene.start("playGame"));
        
        this.add.image(0,0,"fundo").setOrigin(0,0);

        var chao = this.physics.add.image(5,500,"chao").setOrigin(0,0);
            chao.body.allowGravity = false;
            chao.body.setImmovable(true);

        this.premios = this.physics.add.group
        ({
            key:'star',
            repeat: 11,
            setXY:{x:60, y:0, stepX:60},
            collideWorldBounds: true
        });
        this.premios.children.iterate(this.configuracaoFilho);

        this.inimigos = this.physics.add.group
        ({
            key:'rock',
            repeat: 4,
            setXY:{x:100, y:-100, stepX: 130},
            collideWorldBounds: true
        });
        this.inimigos.children.iterate(this.configuracaoFilho);

        this.add.image(0,0,"bg").setOrigin(0,0);
        this.add.image(339,238,"dudeNew").setOrigin(0,0);
        //this.add.image(22,22,"logo").setOrigin(0,0);
        
        var logo = this.add.image(22,22,"logo").setOrigin(0,0);
        var tween = this.tweens.add({
            targets: [ logo ],
            x: 50,
            y: 50,
            duration: 2000,
            ease: 'Sine.easeInOut',
            flipX: false,
            yoyo: true,
            repeat: -1,
            
        });
        
        this.add.image(339,553,"phaser").setOrigin(0,0);        
        
        let btnJogar = this.add.image(106,327,"btnJogar").setOrigin(0,0);
        btnJogar.setInteractive(); //chamada necessária para ser clicável
        btnJogar.on("pointerdown", ()=>this.scene.start("playGame"));
        
        var btnFullScreen = this.add.image(800-16, 16,"btnFullScreen", 0).setOrigin(1, 0).setInteractive();
        btnFullScreen.alpha = (0.3);
        btnFullScreen.on('pointerdown', function () {
            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }
        }, this);
    }

    update()
    {
        
    }

    //--------------- |CHAMAS DAS FUNÇÕES| ---------------\\

    configuracaoFilho(elemento)
    {
        elemento.body.onWorldBounds = true;
        elemento.x = Phaser.Math.Between(0,800);
        elemento.y = Phaser.Math.Between(0,40);
    }

    saiudaCena(elemento)
    {
        //console.log("SAIU!");
        elemento.x = Phaser.Math.Between(0,800);
        elemento.y = Phaser.Math.Between(0,40);
    }    
}