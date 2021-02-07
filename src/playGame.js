class playGame extends Phaser.Scene
{
    constructor()
    {
        super("playGame");
        this.chao;
        this.personagem;
        this.estrela;
        this.rocha;
        this.premios;
        this.inimigos;
        this.txtPontos; //var local de exibição na tela
        this.txtVidas; //var local de exibição na tela
        this.pontos; //var de memo
        this.vidas; //var de memo
        this.passos; //de qnt em qnt o personagem anda
        this.musicTheme;
        this.starEffect;
        this.fase=1;
        this.starVermelha;
        this.tempo=90;
        this.txtTempo;
        this.contador;

    }

    preload()
    {        
        //Todos os assets são pré-carregados na chamada da primeira cena
    }

    create()
    {
        //--------------- |VARIÁVEIS CREATE| ---------------\\
        this.physics.world.on("worldbounds", this.saiudaCena);
        
        //sounds
        this.musicTheme = this.sound.add('musicTheme', {volume: 0.2});
        this.musicTheme.play();

        this.add.image(0,0,"fundo").setOrigin(0,0);

        var chao = this.physics.add.image(5,500,"chao").setOrigin(0,0);
            chao.body.allowGravity = false;
            chao.body.setImmovable(true);

        this.personagem = this.physics.add.sprite(300,470,'personagem',4); // O valor '4' define o frame do spritesheet
        this.passos = 100;

        this.premios = this.physics.add.group
        ({
            key:'star',
            repeat: 11,
            setXY:{x:60, y:0, stepX:60},
            collideWorldBounds: true
        });
        this.premios.children.iterate
        (
            function(elemento)
                {
                    this.configuracaoFilho(elemento);
                },
            this
        );

        this.inimigos = this.physics.add.group
        ({
            key:'rock',
            repeat: 4,
            setXY:{x:100, y:-100, stepX: 130},
            collideWorldBounds: true
        });
        this.inimigos.children.iterate
        (
            function(elemento)
                {
                    this.configuracaoFilho(elemento);
                },
                this
        );
        
        

        //--------------- ANIMAÇÕES ---------------\\        
        this.anims.create
        ({
            key: "andaLeft",
            frames: this.anims.generateFrameNumbers("personagem", {start:0,end:3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create
        ({
            key: "andaRight",
            frames: this.anims.generateFrameNumbers("personagem", {start:5,end:8}),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create
        ({
            key: "tiraSelf",
            frames: this.anims.generateFrameNumbers("personagem", {start:4,end:4}),
            frameRate: 10,
            repeat: 0
        });

        //--------------- MENU PONTOS|VIDAS|TEMPO ---------------\\        
        this.pontos = 0;        
        var iconPoints = this.add.image(22, 85, 'iconPoints').setOrigin(0,0);
        iconPoints.alpha = (0.65);
        this.txtPontos = this.add.text(81, 85, this.pontos, {fontSize:'48px Arial', fill:'#F3F5D9'});
        
        this.vidas = 3;
        var iconLife = this.add.image(22,21, 'iconLife').setOrigin(0,0);
        iconLife.alpha = (0.65);
        this.txtVidas = this.add.text(81, 21, this.vidas, {fontSize:"48px Arial", fill:'#F3F5D9'});

        this.txtTempo = this.add.text(158, 21, this.tempo, {fontSize:"48px Arial", fill:'#F3F5D9'});
        this.contador = this.time.addEvent({delay:1000, repeat: this.tempo});

        //--------------- |FUNÇÕES DO TECLADO| ---------------\\
        this.input.keyboard.on("keydown_LEFT", ()=> this.teclado('ESQUERDA'));
        this.input.keyboard.on("keydown_RIGHT", ()=> this.teclado('DIREITA'));
        this.input.keyboard.on("keydown_DOWN", ()=> this.teclado('BAIXO'));
        this.input.keyboard.on("keydown_SPACE", ()=> this.teclado('ESPACO'));

        //--------------- |COLISÕES| ---------------\\
        this.physics.add.collider(this.personagem, chao);
        this.physics.add.overlap(this.personagem, this.premios, this.pegou, null, this);
        this.physics.add.overlap(this.personagem, this.inimigos, this.pegou, null, this);

        //--------------- |FULLSCREEN MODE| ---------------\\
        var btnFullScreen = this.add.image(800-16, 16,"btnFullScreen", 0).setOrigin(1, 0).setInteractive();
            btnFullScreen.alpha = (0.3);
            btnFullScreen.on('pointerdown', function ()
            {
                if (this.scale.isFullscreen)
                {
                    this.scale.stopFullscreen();
                }
                else
                {
                    this.scale.startFullscreen();
                }
            },
            this);

        //--------------- | BOTÕES TOUCH | ---------------\\
        var btnArrowRight = this.add.image(679,487,"btnArrowRight").setOrigin(0,0).setInteractive();
            btnArrowRight.alpha = (0.5);
            btnArrowRight.on('pointerdown', ()=> this.teclado('DIREITA'));
            btnArrowRight.on('pointerup', ()=> this.teclado('BAIXO'));

        var btnArrowLeft = this.add.image(21,487,"btnArrowLeft").setOrigin(0,0).setInteractive();
            btnArrowLeft.alpha = (0.5);
            btnArrowLeft.on('pointerdown', ()=> this.teclado('ESQUERDA'));
            btnArrowLeft.on('pointerup', ()=> this.teclado('BAIXO'));
    }

    update()
    {
        this.txtTempo.text = this.contador.repeatCount;
        this.tempo = this.contador.repeatCount;
    }

    //--------------- |CHAMAS DAS FUNÇÕES| ---------------\\
    teclado(tecla)
    {
        switch (tecla)
        {
            case 'ESQUERDA':
                this.personagem.setVelocityX(this.passos*-1); //*-1 inverte o sinal da var passos
                this.personagem.play("andaLeft");
                break;
            case 'DIREITA':
                this.personagem.setVelocityX(this.passos);
                this.personagem.play("andaRight");
                break;                
            case 'BAIXO':
                this.personagem.setVelocityX(0);
                this.personagem.play("tiraSelf");
                break;
            case 'ESPACO':
                if (this.pontos==10 || this.vidas==0)
                {                
                    this.scene.restart();
                };
                break;

            default:
                break;
        }
    }

    //--------------- | LÓGICA DA PORTUAÇÃO E VIDA | ---------------\\
    pegou(personagem, item)
    {        
        item.disableBody(true,true); //desabilita item da tela
        switch (item.texture.key)
        {
            case "star":
                this.pontos++;
                this.txtPontos.text = this.pontos;
                this.starEffect = this.sound.add('starEffect', {volume: 0.2});
                this.starEffect.play();
                if(this.pontos>=10)
                    if (this.fase==1 || this.fase==2)
                    {
                        this.fase++;
                        personagem.disableBody(true,true);
                        this.musicTheme.stop();
                        this.scene.restart();
                    }
                    else
                    {
                        this.fase=1;
                        personagem.disableBody(true,true);
                        this.musicTheme.stop();

                        this.add.image(0,0,"vitoria").setOrigin(0,0);

                        let btnPlay = this.add.image(250,470,"btnPlay");
                        btnPlay.setInteractive(); //chamada necessária para ser clicável
                        this.tempo = 90; //resetando timer
                        btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));
                        
                        let btnHome = this.add.image(550,470,"btnHome");
                        btnHome.setInteractive(); //chamada necessária para ser clicável
                        this.tempo = 90; //resetando timer
                        btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
                    }
                break;
            case "starVermelha":
                this.pontos = this.pontos+2;
                this.txtPontos.text = this.pontos;
                this.starEffect = this.sound.add('starEffect', {volume: 0.2});
                this.starEffect.play();
                if(this.pontos>=10)
                    if (this.fase==1 || this.fase==2)
                    {
                        this.fase++;
                        personagem.disableBody(true,true);
                        this.musicTheme.stop();
                        this.scene.restart();
                    }
                    else
                    {
                        this.fase=1;
                        personagem.disableBody(true,true);
                        this.musicTheme.stop();

                        this.add.image(0,0,"vitoria").setOrigin(0,0);

                        let btnPlay = this.add.image(250,470,"btnPlay");
                        btnPlay.setInteractive(); //chamada necessária para ser clicável
                        this.tempo = 90; //resetando timer
                        btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));
                        
                        let btnHome = this.add.image(550,470,"btnHome");
                        btnHome.setInteractive(); //chamada necessária para ser clicável
                        this.tempo = 90; //resetando timer
                        btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
                    }
                break;
            case "starCinza":
                this.pontos = this.pontos+3;
                this.txtPontos.text = this.pontos;
                this.starEffect = this.sound.add('starEffect', {volume: 0.2});
                this.starEffect.play();
                if(this.pontos>=10)
                    if (this.fase==1 || this.fase==2)
                    {
                        this.fase++;
                        personagem.disableBody(true,true);
                        this.musicTheme.stop();
                        this.scene.restart();
                    }
                    else
                    {
                        this.fase=1;
                        personagem.disableBody(true,true);
                        this.musicTheme.stop();

                        this.add.image(0,0,"vitoria").setOrigin(0,0);

                        let btnPlay = this.add.image(250,470,"btnPlay");
                        btnPlay.setInteractive(); //chamada necessária para ser clicável
                        this.tempo = 90; //resetando timer
                        btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));
                        
                        let btnHome = this.add.image(550,470,"btnHome");
                        btnHome.setInteractive(); //chamada necessária para ser clicável
                        this.tempo = 90; //resetando timer
                        btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
                    }
                break;
            case "rock":
                this.vidas--;
                this.txtVidas.text = this.vidas;
                if(this.vidas<=0)
                {
                    //this.add.text(200,150,"VOCÊ PERDEU!\nTecle ESPAÇO para TENTAR novamente.")
                    //game.scene.keys["endGame"].mensagem = "Você Perdeu!!!";
                    //this.scene.start("endGame");
                    this.fase=1;
                    personagem.disableBody(true,true);
                    this.musicTheme.stop();
                    
                    this.add.image(0,0,"derrota").setOrigin(0,0);
                    
                    let btnPlay = this.add.image(250,470,"btnPlay");
                    btnPlay.setInteractive(); //chamada necessária para ser clicável                    
                    btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));
                    this.tempo = 90; //resetando timer
            
                    let btnHome = this.add.image(550,470,"btnHome");
                    btnHome.setInteractive(); //chamada necessária para ser clicável                    
                    btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
                    this.tempo = 90; //resetando timer
                }
                break;
            case "et1":
                this.vidas = this.vidas-2;
                this.txtVidas.text = this.vidas;
                if(this.vidas<=0)
                {
                    //this.add.text(200,150,"VOCÊ PERDEU!\nTecle ESPAÇO para TENTAR novamente.")
                    //game.scene.keys["endGame"].mensagem = "Você Perdeu!!!";
                    //this.scene.start("endGame");
                    this.fase=1;
                    personagem.disableBody(true,true);
                    this.musicTheme.stop();
                    
                    this.add.image(0,0,"derrota").setOrigin(0,0);
                    
                    let btnPlay = this.add.image(250,470,"btnPlay");
                    btnPlay.setInteractive(); //chamada necessária para ser clicável                    
                    btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));
                    this.tempo = 90; //resetando timer
            
                    let btnHome = this.add.image(550,470,"btnHome");
                    btnHome.setInteractive(); //chamada necessária para ser clicável                    
                    btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
                    this.tempo = 90; //resetando timer
                }
                break;
            case "et2":
                this.vidas = this.vidas-3;
                this.txtVidas.text = this.vidas;
                if(this.vidas<=0)
                {
                    //this.add.text(200,150,"VOCÊ PERDEU!\nTecle ESPAÇO para TENTAR novamente.")
                    //game.scene.keys["endGame"].mensagem = "Você Perdeu!!!";
                    //this.scene.start("endGame");
                    this.fase=1;
                    personagem.disableBody(true,true);
                    this.musicTheme.stop();
                    
                    this.add.image(0,0,"derrota").setOrigin(0,0);
                    
                    let btnPlay = this.add.image(250,470,"btnPlay");
                    btnPlay.setInteractive(); //chamada necessária para ser clicável
                    this.tempo = 90; //resetando timer
                    btnPlay.on("pointerdown", ()=>this.scene.start("playGame"));
            
                    let btnHome = this.add.image(550,470,"btnHome");
                    btnHome.setInteractive(); //chamada necessária para ser clicável
                    this.tempo = 90; //resetando timer
                    btnHome.on("pointerdown", ()=>this.scene.start("homeGame"));
                }
                break;
        
            default:
                break;
        }
    }

    //--------------- | FASES | ---------------\\
    configuracaoFilho(elemento)
    {
        if (this.fase==2)
        {
            let aleatorio;
            if (elemento.texture.key=="star")
            {
                aleatorio = Phaser.Math.Between(1,15);
                if (aleatorio==1)
                {
                elemento.setTexture("starVermelha");
                }
            }
            else
            {
                aleatorio = Phaser.Math.Between(1,10);
                if (aleatorio==1)
                {
                elemento.setTexture("et1");
                }
            }
            
        }
        else if (this.fase==3)
        {
            let aleatorio
            if (elemento.texture.key=="star")
            {
                aleatorio = Phaser.Math.Between(1,15);
                if (aleatorio==1)
                {
                    elemento.setTexture("starVermelha");
                }
                else if (aleatorio==2)
                {
                    elemento.setTexture("starCinza");
                }
            }
            else
            {
                aleatorio = Phaser.Math.Between(1,10);
                if (aleatorio==1)
                {
                    elemento.setTexture("et1");
                }
                else if (aleatorio==2)
                {
                    elemento.setTexture("et2");
                }
            }

        }
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