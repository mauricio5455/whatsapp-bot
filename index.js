const fs = require('fs');
const { Client, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const prefix = '!';

const client = new Client({
    authStrategy: new LocalAuth()
});


client.once('ready', () => {
    console.log('Bot está funcionando!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', async message => {
    if(message.fromMe) return;

    if(!message.body.startsWith(prefix)) 
        return message.reply("Olá!\n\nPara criar uma figurinha envie uma imagem, GIF ou vídeo com \"*" + prefix + "figurinha*\" na legenda!");
    ;

    command = message.body.substring(1).trim().split(' ');

    switch(command[0].toLowerCase()) {

        case 'figu':
        case 'figurinha':
        case 'sticker':  {

            if(message.hasMedia) {
                criarFigurinha(message);
            } else if(message.hasQuotedMsg) {
                message.getQuotedMessage().then(message => {
                    if(message.hasMedia) return criarFigurinha(message);
                });
            } else {
                message.reply('Envie uma imagem, vídeo ou GIF com *"' + prefix + 'figurinha* ou marque outra mensagem de mídia.');
            };
        }

        break;

        default: {
            message.reply('Comando inválido.');
        }
    }

});


async function criarFigurinha(message) {
    message.react('⌛')
    const media = await message.downloadMedia();
        
    client.sendMessage(message.from ,media, { sendMediaAsSticker: true })
    .then(() => {
        message.react('✅');
        console.log('LOG: Figurinha criada.');
    }).catch(()=>{
        message.reply('Falha ao gerar a figurinha :(.')
    });
}

client.initialize();